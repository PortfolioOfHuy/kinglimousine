import { prisma } from "@/lib/prisma";

type SyncVisitDailyStatsOptions = {
  startDate?: string | Date;
  endDate?: string | Date;
  timezoneOffsetMinutes?: number;
};

type SyncVisitDailyStatsResult = {
  syncedDates: string[];
  rows: Array<{
    date: string;
    totalVisits: number;
    uniqueVisits: number;
    contactCount: number;
  }>;
};

const DEFAULT_TIMEZONE_OFFSET_MINUTES = 7 * 60;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getDateKeyFromDate(
  value: Date,
  timezoneOffsetMinutes = DEFAULT_TIMEZONE_OFFSET_MINUTES,
) {
  const shifted = new Date(value.getTime() + timezoneOffsetMinutes * 60_000);

  const year = shifted.getUTCFullYear();
  const month = shifted.getUTCMonth() + 1;
  const day = shifted.getUTCDate();

  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Ngày không hợp lệ: ${dateKey}`);
  }

  return { year, month, day };
}

function getUtcRangeForLocalDate(
  dateKey: string,
  timezoneOffsetMinutes = DEFAULT_TIMEZONE_OFFSET_MINUTES,
) {
  const { year, month, day } = parseDateKey(dateKey);

  const startUtcMs =
    Date.UTC(year, month - 1, day, 0, 0, 0, 0) - timezoneOffsetMinutes * 60_000;

  const endUtcMs = startUtcMs + 24 * 60 * 60 * 1000;

  return {
    start: new Date(startUtcMs),
    end: new Date(endUtcMs),
  };
}

function normalizeInputToDateKey(
  value: string | Date,
  timezoneOffsetMinutes = DEFAULT_TIMEZONE_OFFSET_MINUTES,
) {
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Không thể parse ngày: ${value}`);
    }

    return getDateKeyFromDate(parsed, timezoneOffsetMinutes);
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("Date không hợp lệ.");
    }

    return getDateKeyFromDate(value, timezoneOffsetMinutes);
  }

  throw new Error("Giá trị ngày không hợp lệ.");
}

function addOneDayToDateKey(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;
}

function getDateKeysInRange(startDateKey: string, endDateKey: string) {
  const keys: string[] = [];
  let current = startDateKey;

  while (current <= endDateKey) {
    keys.push(current);
    current = addOneDayToDateKey(current);
  }

  return keys;
}

function getUniqueVisitorKey(visit: {
  id: number;
  sessionId: string | null;
  ipHash: string | null;
}) {
  if (visit.sessionId) return `session:${visit.sessionId}`;
  if (visit.ipHash) return `ip:${visit.ipHash}`;
  return `visit:${visit.id}`;
}

export async function syncVisitDailyStats(
  options: SyncVisitDailyStatsOptions = {},
): Promise<SyncVisitDailyStatsResult> {
  const timezoneOffsetMinutes =
    options.timezoneOffsetMinutes ?? DEFAULT_TIMEZONE_OFFSET_MINUTES;

  const now = new Date();

  const endDateKey = normalizeInputToDateKey(
    options.endDate ?? now,
    timezoneOffsetMinutes,
  );

  const startDateKey = normalizeInputToDateKey(
    options.startDate ?? endDateKey,
    timezoneOffsetMinutes,
  );

  if (startDateKey > endDateKey) {
    throw new Error("startDate không được lớn hơn endDate.");
  }

  const dateKeys = getDateKeysInRange(startDateKey, endDateKey);

  const overallRangeStart = getUtcRangeForLocalDate(
    startDateKey,
    timezoneOffsetMinutes,
  ).start;

  const overallRangeEnd = getUtcRangeForLocalDate(
    endDateKey,
    timezoneOffsetMinutes,
  ).end;

  const [visits, contacts] = await Promise.all([
    prisma.visit.findMany({
      where: {
        visitedAt: {
          gte: overallRangeStart,
          lt: overallRangeEnd,
        },
      },
      select: {
        id: true,
        sessionId: true,
        ipHash: true,
        visitedAt: true,
      },
      orderBy: {
        visitedAt: "asc",
      },
    }),

    prisma.contactMessage.findMany({
      where: {
        createdAt: {
          gte: overallRangeStart,
          lt: overallRangeEnd,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const visitBucket = new Map<
    string,
    {
      totalVisits: number;
      uniqueVisitors: Set<string>;
    }
  >();

  const contactBucket = new Map<string, number>();

  for (const dateKey of dateKeys) {
    visitBucket.set(dateKey, {
      totalVisits: 0,
      uniqueVisitors: new Set<string>(),
    });
    contactBucket.set(dateKey, 0);
  }

  for (const visit of visits) {
    const dateKey = getDateKeyFromDate(visit.visitedAt, timezoneOffsetMinutes);
    const bucket = visitBucket.get(dateKey);

    if (!bucket) continue;

    bucket.totalVisits += 1;
    bucket.uniqueVisitors.add(getUniqueVisitorKey(visit));
  }

  for (const contact of contacts) {
    const dateKey = getDateKeyFromDate(
      contact.createdAt,
      timezoneOffsetMinutes,
    );
    const current = contactBucket.get(dateKey) ?? 0;
    contactBucket.set(dateKey, current + 1);
  }

  const rows: SyncVisitDailyStatsResult["rows"] = [];

  for (const dateKey of dateKeys) {
    const visitData = visitBucket.get(dateKey);
    const contactCount = contactBucket.get(dateKey) ?? 0;
    const { start } = getUtcRangeForLocalDate(dateKey, timezoneOffsetMinutes);

    const totalVisits = visitData?.totalVisits ?? 0;
    const uniqueVisits = visitData?.uniqueVisitors.size ?? 0;

    await prisma.visitDailyStat.upsert({
      where: {
        date: start,
      },
      update: {
        totalVisits,
        uniqueVisits,
        contactCount,
      },
      create: {
        date: start,
        totalVisits,
        uniqueVisits,
        contactCount,
      },
    });

    rows.push({
      date: dateKey,
      totalVisits,
      uniqueVisits,
      contactCount,
    });
  }

  return {
    syncedDates: dateKeys,
    rows,
  };
}

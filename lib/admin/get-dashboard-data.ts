import { prisma } from "@/lib/prisma";

type GetDashboardDataParams = {
  month: number;
  year: number;
};

const VIETNAM_TZ_OFFSET_MINUTES = 7 * 60;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getLocalDateParts(
  date: Date,
  offsetMinutes = VIETNAM_TZ_OFFSET_MINUTES,
) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function getUtcRangeForLocalMonth(
  month: number,
  year: number,
  offsetMinutes = VIETNAM_TZ_OFFSET_MINUTES,
) {
  const startUtcMs =
    Date.UTC(year, month - 1, 1, 0, 0, 0, 0) - offsetMinutes * 60_000;

  const endUtcMs =
    Date.UTC(year, month, 1, 0, 0, 0, 0) - offsetMinutes * 60_000;

  return {
    start: new Date(startUtcMs),
    end: new Date(endUtcMs),
  };
}

function getUtcStartOfCurrentWeek(offsetMinutes = VIETNAM_TZ_OFFSET_MINUTES) {
  const now = new Date();
  const localMs = now.getTime() + offsetMinutes * 60_000;
  const local = new Date(localMs);

  const day = local.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;

  local.setUTCDate(local.getUTCDate() - diff);
  local.setUTCHours(0, 0, 0, 0);

  return new Date(local.getTime() - offsetMinutes * 60_000);
}

function getUniqueVisitorKey(visit: {
  id?: number;
  sessionId: string | null;
  ipHash: string | null;
}) {
  if (visit.sessionId) return `session:${visit.sessionId}`;
  if (visit.ipHash) return `ip:${visit.ipHash}`;
  return `unknown:${visit.id ?? Math.random()}`;
}

function truncateHash(value: string | null | undefined, length = 16) {
  if (!value) return "Không xác định";
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

export async function getDashboardData({
  month,
  year,
}: GetDashboardDataParams) {
  const { start, end } = getUtcRangeForLocalMonth(month, year);
  const weekStart = getUtcStartOfCurrentWeek();
  const onlineThreshold = new Date(Date.now() - 70 * 1000);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const [
    monthVisits,
    monthContacts,
    totalVisitCount,
    totalContactCount,
    totalUserCount,
    totalProductCount,
    weekVisitCount,
    liveOnline,
    browserRaw,
    deviceRaw,
    topIpRaw,
  ] = await Promise.all([
    prisma.visit.findMany({
      where: {
        visitedAt: {
          gte: start,
          lt: end,
        },
      },
      select: {
        id: true,
        visitedAt: true,
        sessionId: true,
        ipHash: true,
      },
      orderBy: {
        visitedAt: "asc",
      },
    }),

    prisma.contactMessage.findMany({
      where: {
        createdAt: {
          gte: start,
          lt: end,
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

    prisma.visit.count(),

    prisma.contactMessage.count(),

    prisma.user.count({
      where: {
        isActive: true,
      },
    }),

    prisma.product.count({
      where: {
        isActive: true,
      },
    }),

    prisma.visit.count({
      where: {
        visitedAt: {
          gte: weekStart,
        },
      },
    }),

    prisma.onlineSession.count({
      where: {
        lastSeenAt: {
          gte: onlineThreshold,
        },
      },
    }),

    prisma.visit.groupBy({
      by: ["browser"],
      where: {
        visitedAt: {
          gte: start,
          lt: end,
        },
        browser: {
          not: null,
        },
      },
      _count: {
        browser: true,
      },
      orderBy: {
        _count: {
          browser: "desc",
        },
      },
      take: 8,
    }),

    prisma.visit.groupBy({
      by: ["deviceType"],
      where: {
        visitedAt: {
          gte: start,
          lt: end,
        },
        deviceType: {
          not: null,
        },
      },
      _count: {
        deviceType: true,
      },
      orderBy: {
        _count: {
          deviceType: "desc",
        },
      },
      take: 8,
    }),

    prisma.visit.groupBy({
      by: ["ipHash"],
      where: {
        visitedAt: {
          gte: start,
          lt: end,
        },
        ipHash: {
          not: null,
        },
      },
      _count: {
        ipHash: true,
      },
      orderBy: {
        _count: {
          ipHash: "desc",
        },
      },
      take: 10,
    }),
  ]);

  const dailyBuckets = Array.from({ length: daysInMonth }, (_, index) => ({
    day: index + 1,
    totalVisits: 0,
    uniqueSet: new Set<string>(),
    contactCount: 0,
  }));

  const monthUniqueSet = new Set<string>();

  for (const visit of monthVisits) {
    const parts = getLocalDateParts(visit.visitedAt);

    if (parts.year !== year || parts.month !== month) continue;

    const bucket = dailyBuckets[parts.day - 1];
    const uniqueKey = getUniqueVisitorKey(visit);

    bucket.totalVisits += 1;
    bucket.uniqueSet.add(uniqueKey);
    monthUniqueSet.add(uniqueKey);
  }

  for (const contact of monthContacts) {
    const parts = getLocalDateParts(contact.createdAt);

    if (parts.year !== year || parts.month !== month) continue;

    const bucket = dailyBuckets[parts.day - 1];
    bucket.contactCount += 1;
  }

  const lineData = dailyBuckets.map((item) => ({
    dayLabel: `D${pad(item.day)}`,
    day: item.day,
    totalVisits: item.totalVisits,
    uniqueVisits: item.uniqueSet.size,
    contactCount: item.contactCount,
  }));

  const monthTotalVisits = lineData.reduce(
    (sum, item) => sum + item.totalVisits,
    0,
  );
  const monthContactCount = lineData.reduce(
    (sum, item) => sum + item.contactCount,
    0,
  );

  const browserStats = browserRaw.map((item) => ({
    name: item.browser || "Không rõ",
    value: item._count.browser,
  }));

  const deviceStats = deviceRaw.map((item) => ({
    name: item.deviceType || "OTHER",
    value: item._count.deviceType,
  }));

  const topIpStats = topIpRaw.map((item) => ({
    name: truncateHash(item.ipHash),
    value: item._count.ipHash,
  }));

  return {
    month,
    year,
    summary: {
      totalUsers: totalUserCount,
      totalProducts: totalProductCount,
      totalContacts: totalContactCount,
      liveOnline,
      weekVisits: weekVisitCount,
      monthVisits: monthTotalVisits,
      totalVisits: totalVisitCount,
      monthUniqueVisits: monthUniqueSet.size,
      monthContactCount,
    },
    lineData,
    browserStats,
    deviceStats,
    topIpStats,
  };
}

import ContactMessagesPageContent from "@/components/modules/admin/contact-messages/ContactMessagesPageContent";
import { getContactMessages } from "./action";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    status?: string;
    q?: string;
    id?: string;
  }>;
};

export default async function AdminContactMessagesPage({
  searchParams,
}: PageProps) {
  const params = (await searchParams) ?? {};

  const data = await getContactMessages({
    status: params.status,
    q: params.q,
    selectedId: params.id,
  });

  return <ContactMessagesPageContent data={data} />;
}
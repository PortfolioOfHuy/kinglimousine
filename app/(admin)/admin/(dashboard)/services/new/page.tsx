import ServiceForm from "@/components/modules/admin/services/ServiceForm";
import { createService } from "../actions";

export default async function NewServicePage() {
  return (
    <ServiceForm
      title="Tạo dịch vụ"
      submitLabel="Lưu dịch vụ"
      action={createService}
    />
  );
}

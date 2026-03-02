import { getCampaigns } from "@/lib/actions";
import DashboardClient from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const campaigns = await getCampaigns();
  
  return <DashboardClient campaigns={campaigns} />;
}

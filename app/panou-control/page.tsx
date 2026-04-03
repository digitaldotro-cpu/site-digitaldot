import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { siteContentToCmsData } from "@/lib/cms-site-adapter";
import { DashboardShell } from "@/components/cms/dashboard-shell";

export const metadata = {
  ...buildMetadata({
    title: "Digital Dot CMS",
    path: "/panou-control",
    description: "Panou CMS pentru administrarea conținutului Digital Dot.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ControlPanelPage() {
  const siteContent = await getSiteContent();
  const initialData = siteContentToCmsData(siteContent);

  return <DashboardShell initialData={initialData} />;
}

import { buildMetadata } from "@/lib/seo";
import { getSubmissionLogs, getEmailLogs } from "@/lib/logs";
import { LogsViewer } from "@/components/admin/logs-viewer";

export const dynamic = "force-dynamic";

export const metadata = {
  ...buildMetadata({
    title: "Loguri & Formulare - CMS",
    path: "/panou-control/logs",
    description: "Jurnal de submisii formulare și loguri de email.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LogsPage() {
  const submissions = await getSubmissionLogs();
  const emails = await getEmailLogs();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Loguri & Formulare</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#bfc5ca]">
          Aici poți vizualiza formularele de contact trimise de vizitatori și statusul email-urilor expediate.
        </p>
      </div>

      <LogsViewer submissions={submissions} emails={emails} />
    </div>
  );
}

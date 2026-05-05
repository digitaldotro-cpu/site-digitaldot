import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ControlPanel } from "@/components/admin/control-panel";

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
  const content = await getSiteContent();

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <ControlPanel initialContent={content} />
      </Container>
    </section>
  );
}

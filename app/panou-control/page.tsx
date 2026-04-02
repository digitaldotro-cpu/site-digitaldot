import { buildMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";
import { Container } from "@/components/ui/container";
import { ControlPanel } from "@/components/admin/control-panel";

export const metadata = {
  ...buildMetadata({
    title: "Panou de Control",
    path: "/panou-control",
    description: "Panou intern pentru editarea conținutului website-ului Digital Dot.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ControlPanelPage() {
  const content = await getSiteContent();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <ControlPanel initialContent={content} />
      </Container>
    </section>
  );
}

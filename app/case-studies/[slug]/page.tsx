import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { CaseStudyDetail } from "@/components/case-studies/case-study-detail";
import { getSiteContent } from "@/lib/site-content";
import { absoluteUrl } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildCaseStudySchema,
  buildCaseStudyServiceSchema,
  buildCaseStudyWebPageSchema,
  buildOrganizationSchema,
} from "@/lib/structured-data";

type CaseStudyRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.caseStudies.studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyRouteProps): Promise<Metadata> {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const study = content.caseStudies.studies.find((item) => item.slug === slug);

  if (!study) {
    return { title: "Studiu de caz negăsit | Digital Dot" };
  }

  const canonical = absoluteUrl(`/case-studies/${study.slug}`, content);
  const image = absoluteUrl(study.ogImage, content);

  return {
    title: study.seoTitle,
    description: study.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: study.seoTitle,
      description: study.seoDescription,
      url: canonical,
      siteName: "Digital Dot",
      locale: "ro_RO",
      images: [{ url: image, alt: study.seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.seoTitle,
      description: study.seoDescription,
      images: [image],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyRouteProps) {
  const [{ slug }, content] = await Promise.all([params, getSiteContent()]);
  const study = content.caseStudies.studies.find((item) => item.slug === slug);

  if (!content.caseStudies.enabled || !study) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationSchema(content),
          buildCaseStudyWebPageSchema(content, study),
          buildCaseStudySchema(content, study),
          buildCaseStudyServiceSchema(content, study),
          buildBreadcrumbSchema(content, [
            { name: "Acasă", path: "/" },
            { name: "Studii de caz", path: "/case-studies" },
            { name: study.clientName, path: `/case-studies/${study.slug}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Acasă", href: "/" },
          { label: "Studii de caz", href: "/case-studies" },
          { label: study.clientName, href: `/case-studies/${study.slug}` },
        ]}
      />
      <CaseStudyDetail study={study} />
    </>
  );
}

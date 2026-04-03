import type {
  CmsData,
  CmsPage,
  MediaItem,
  PageSection,
  SectionElement,
  SectionType,
} from "@/types/cms";

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function reorderList<T>(items: T[], sourceIndex: number, targetIndex: number) {
  const list = [...items];
  const [moved] = list.splice(sourceIndex, 1);
  list.splice(targetIndex, 0, moved);
  return list;
}

export function getPage(data: CmsData, pageId: string): CmsPage | undefined {
  return data.pages.find((page) => page.id === pageId);
}

export function getSection(page: CmsPage | undefined, sectionId: string): PageSection | undefined {
  return page?.sections.find((section) => section.id === sectionId);
}

export function getElement(
  section: PageSection | undefined,
  elementId: string,
): SectionElement | undefined {
  return section?.elements.find((element) => element.id === elementId);
}

export function getMedia(data: CmsData, mediaId: string): MediaItem | undefined {
  return data.media.find((item) => item.id === mediaId);
}

export function defaultStyle() {
  return {
    fontSize: 18,
    fontWeight: 500,
    textAlign: "left" as const,
    color: "#ffffff",
    backgroundColor: "transparent",
    padding: 0,
    margin: 0,
    borderRadius: 0,
  };
}

export function createSectionTemplate(type: SectionType, name: string, mediaId?: string): PageSection {
  const sectionId = createId("section");

  if (type === "cta") {
    return {
      id: sectionId,
      name,
      type,
      elements: [
        {
          id: createId("cta"),
          type: "cta",
          label: "CTA Block",
          content: "Construim ceva memorabil împreună?",
          subcontent: "Programează o discuție și definim următorii pași.",
          buttonLabel: "Programează o discuție",
          buttonHref: "/contacteaza-ne",
          style: { ...defaultStyle(), textAlign: "center", fontSize: 34, fontWeight: 700 },
        },
      ],
      settings: {
        backgroundColor: "#0f171c",
        paddingY: 56,
        borderRadius: 24,
        visible: true,
      },
    };
  }

  return {
    id: sectionId,
    name,
    type,
    elements: [
      {
        id: createId("text"),
        type: "text",
        label: "Titlu",
        content: "Titlu secțiune",
        style: { ...defaultStyle(), fontSize: 44, fontWeight: 700 },
      },
      {
        id: createId("paragraph"),
        type: "text",
        label: "Descriere",
        content: "Adaugă descrierea secțiunii aici.",
        style: { ...defaultStyle(), fontSize: 20, color: "#c6c6c6" },
      },
      {
        id: createId("media"),
        type: "media",
        label: "Media",
        mediaId: mediaId ?? "",
        caption: "Imagine secțiune",
        style: { ...defaultStyle(), borderRadius: 20 },
      },
    ],
    settings: {
      backgroundColor: "#0f171c",
      paddingY: 52,
      borderRadius: 20,
      visible: true,
    },
  };
}

export async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Nu am putut citi fișierul."));
    reader.readAsDataURL(file);
  });
}

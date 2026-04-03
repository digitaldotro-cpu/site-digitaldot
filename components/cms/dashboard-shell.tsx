"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import type { BlogPostItem, CmsData, MediaItem, PageSection, SectionElement } from "@/types/cms";
import {
  createId,
  createSectionTemplate,
  deepClone,
  defaultStyle,
  fileToDataUrl,
  getElement,
  getPage,
  getSection,
  reorderList,
} from "@/components/cms/utils";
import { cn } from "@/lib/utils";
import { Sidebar, type DashboardView } from "@/components/cms/sidebar";
import { Topbar } from "@/components/cms/topbar";
import { StructurePanel } from "@/components/cms/structure-panel";
import { EditorCanvas } from "@/components/cms/editor-canvas";
import { EditPanel } from "@/components/cms/edit-panel";
import { AddSectionModal } from "@/components/cms/add-section-modal";
import { ToastStack, type ToastItem } from "@/components/cms/ui/toast-stack";
import { MediaLibrary } from "@/components/cms/media-library";
import { BlogManager } from "@/components/cms/blog-manager";
import { SettingsPanel } from "@/components/cms/settings-panel";
import { AuthGate } from "@/components/cms/auth-gate";
import { PagesManager } from "@/components/cms/pages-manager";

const HISTORY_LIMIT = 40;

type DashboardShellProps = {
  initialData: CmsData;
};

function getAutosaveLabel(params: {
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt?: string;
  autosaveError: boolean;
}) {
  if (params.isSaving) {
    return "Saving changes...";
  }

  if (params.autosaveError) {
    return "Autosave failed";
  }

  if (params.isDirty) {
    return "Unsaved changes";
  }

  if (params.lastSavedAt) {
    return `Saved ${new Date(params.lastSavedAt).toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return "Ready";
}

export function DashboardShell({ initialData }: DashboardShellProps) {
  const [view, setView] = useState<DashboardView>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draft, setDraft] = useState<CmsData>(initialData);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initialData));
  const [isSaving, setIsSaving] = useState(false);
  const [autosaveError, setAutosaveError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedPageId, setSelectedPageId] = useState(initialData.pages[0]?.id ?? "");
  const [selectedSectionId, setSelectedSectionId] = useState(initialData.pages[0]?.sections[0]?.id ?? "");
  const [selectedElementId, setSelectedElementId] = useState(initialData.pages[0]?.sections[0]?.elements[0]?.id ?? "");
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  const [historyPast, setHistoryPast] = useState<CmsData[]>([]);
  const [historyFuture, setHistoryFuture] = useState<CmsData[]>([]);

  const serializedDraft = useMemo(() => JSON.stringify(draft), [draft]);
  const isDirty = serializedDraft !== savedSnapshot;

  const selectedPage = useMemo(() => getPage(draft, selectedPageId), [draft, selectedPageId]);
  const selectedSection = useMemo(
    () => getSection(selectedPage, selectedSectionId),
    [selectedPage, selectedSectionId],
  );
  const selectedElement = useMemo(
    () => getElement(selectedSection, selectedElementId),
    [selectedSection, selectedElementId],
  );

  const handleSelectPage = useCallback((pageId: string) => {
    setSelectedPageId(pageId);
    const page = getPage(draft, pageId);
    setSelectedSectionId(page?.sections[0]?.id ?? "");
    setSelectedElementId(page?.sections[0]?.elements[0]?.id ?? "");
  }, [draft]);

  const mediaById = useMemo(() => {
    return draft.media.reduce<Record<string, MediaItem>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [draft.media]);

  const addToast = useCallback((type: ToastItem["type"], message: string) => {
    const id = createId("toast");
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/auth/session", { cache: "no-store" });
        const data = (await response.json().catch(() => null)) as { authenticated?: boolean } | null;

        if (!mounted) {
          return;
        }

        setIsAuthenticated(Boolean(data?.authenticated));
      } catch {
        if (!mounted) {
          return;
        }
        setIsAuthenticated(false);
      } finally {
        if (mounted) {
          setIsAuthChecked(true);
        }
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const applyUpdate = useCallback((recipe: (current: CmsData) => CmsData, trackHistory = true) => {
    setDraft((current) => {
      const next = recipe(current);
      if (JSON.stringify(next) === JSON.stringify(current)) {
        return current;
      }

      if (trackHistory) {
        setHistoryPast((past) => [...past.slice(-(HISTORY_LIMIT - 1)), deepClone(current)]);
        setHistoryFuture([]);
      }

      return next;
    });
  }, []);

  const handleUnauthorized = useCallback(() => {
    setIsAuthenticated(false);
    setIsAuthChecked(true);
    addToast("error", "Sesiunea a expirat. Te rugăm să te autentifici din nou.");
  }, [addToast]);

  useEffect(() => {
    if (!selectedPage) {
      if (draft.pages[0]) {
        setSelectedPageId(draft.pages[0].id);
      }
      return;
    }

    if (!selectedSection || !selectedPage.sections.some((section) => section.id === selectedSectionId)) {
      const firstSection = selectedPage.sections[0];
      setSelectedSectionId(firstSection?.id ?? "");
      setSelectedElementId(firstSection?.elements[0]?.id ?? "");
      return;
    }

    if (!selectedElement || !selectedSection.elements.some((element) => element.id === selectedElementId)) {
      setSelectedElementId(selectedSection.elements[0]?.id ?? "");
    }
  }, [draft.pages, selectedPage, selectedSection, selectedElement, selectedSectionId, selectedElementId]);

  const persistData = useCallback(async (payload: CmsData, mode: "manual" | "autosave") => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setAutosaveError(false);

    try {
      const response = await fetch("/api/admin/cms-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        throw new Error(data?.message || "Nu am putut salva modificările.");
      }

      const snapshot = JSON.stringify(payload);
      setSavedSnapshot(snapshot);
      setLastSavedAt(new Date().toISOString());

      if (mode === "manual") {
        addToast("success", data?.message || "Modificările au fost publicate.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "A apărut o eroare la salvare.";
      setAutosaveError(true);
      addToast("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [addToast, handleUnauthorized, isSaving]);

  useEffect(() => {
    if (!isDirty || !isAuthenticated) {
      return;
    }

    const timer = setTimeout(() => {
      void persistData(draft, "autosave");
    }, 1800);

    return () => clearTimeout(timer);
  }, [draft, isAuthenticated, isDirty, persistData]);

  function handleUndo() {
    if (historyPast.length === 0) {
      return;
    }

    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((past) => past.slice(0, -1));
    setHistoryFuture((future) => [deepClone(draft), ...future].slice(0, HISTORY_LIMIT));
    setDraft(previous);
  }

  function handleRedo() {
    if (historyFuture.length === 0) {
      return;
    }

    const [next, ...rest] = historyFuture;
    setHistoryFuture(rest);
    setHistoryPast((past) => [...past, deepClone(draft)].slice(-HISTORY_LIMIT));
    setDraft(next);
  }

  const updateSection = useCallback((nextSection: PageSection) => {
    if (!selectedPage) {
      return;
    }

    applyUpdate((current) => {
      const nextData = deepClone(current);
      const page = nextData.pages.find((item) => item.id === selectedPage.id);
      if (!page) {
        return current;
      }

      page.sections = page.sections.map((section) =>
        section.id === nextSection.id ? nextSection : section,
      );
      return nextData;
    });
  }, [applyUpdate, selectedPage]);

  const updateElement = useCallback((nextElement: SectionElement) => {
    if (!selectedSection) {
      return;
    }

    updateSection({
      ...selectedSection,
      elements: selectedSection.elements.map((element) =>
        element.id === nextElement.id ? nextElement : element,
      ),
    });
  }, [selectedSection, updateSection]);

  function deleteSelectedElement() {
    if (!selectedSection || !selectedElement) {
      return;
    }

    if (selectedSection.elements.length <= 1) {
      addToast("info", "Secțiunea trebuie să aibă cel puțin un element.");
      return;
    }

    const nextElements = selectedSection.elements.filter((element) => element.id !== selectedElement.id);
    const nextElement = nextElements[0];
    updateSection({ ...selectedSection, elements: nextElements });
    setSelectedElementId(nextElement.id);
    addToast("success", "Element șters.");
  }

  function addElementToSelectedSection(type: SectionElement["type"]) {
    if (!selectedSection) {
      return;
    }

    const mediaId = draft.media[0]?.id ?? "";

    const getNextIndex = (regex: RegExp) => {
      let max = -1;
      for (const element of selectedSection.elements) {
        const match = regex.exec(element.id);
        if (match) {
          max = Math.max(max, Number(match[1]));
        }
      }
      return max + 1;
    };

    if (selectedSection.id === "strategy-problems" && type === "text") {
      const index = getNextIndex(/^strategy-problem-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `strategy-problem-${index}-icon`,
          type: "text",
          label: `Problemă ${index + 1} - icon`,
          content: "Lightbulb",
          style: { ...defaultStyle(), fontSize: 14, color: "#66fcf1" },
        },
        {
          id: `strategy-problem-${index}-title`,
          type: "text",
          label: `Problemă ${index + 1} - titlu`,
          content: `Problemă ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 24, fontWeight: 700 },
        },
        {
          id: `strategy-problem-${index}-description`,
          type: "text",
          label: `Problemă ${index + 1} - descriere`,
          content: "Descriere problemă.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[1].id);
      addToast("success", "Card de problemă adăugat.");
      return;
    }

    if (selectedSection.id === "strategy-deliverables" && type === "text") {
      const index = getNextIndex(/^strategy-deliverable-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `strategy-deliverable-${index}-title`,
          type: "text",
          label: `Card ${index + 1} - titlu`,
          content: `Deliverable ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 24, fontWeight: 700 },
        },
        {
          id: `strategy-deliverable-${index}-description`,
          type: "text",
          label: `Card ${index + 1} - descriere`,
          content: "Descriere deliverable.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `strategy-deliverable-${index}-variant`,
          type: "text",
          label: `Card ${index + 1} - variant`,
          content: "small",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[0].id);
      addToast("success", "Deliverable adăugat.");
      return;
    }

    if (selectedSection.id === "strategy-process" && type === "text") {
      const index = getNextIndex(/^strategy-process-step-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `strategy-process-step-${index}-title`,
          type: "text",
          label: `Pas ${index + 1} - titlu`,
          content: `Etapa ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 20, fontWeight: 700 },
        },
        {
          id: `strategy-process-step-${index}-description`,
          type: "text",
          label: `Pas ${index + 1} - descriere`,
          content: "Descriere etapă.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[0].id);
      addToast("success", "Pas de proces adăugat.");
      return;
    }

    if (selectedSection.id === "strategy-cases" && type === "text") {
      const index = getNextIndex(/^strategy-case-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `strategy-case-${index}-category`,
          type: "text",
          label: `Proiect ${index + 1} - categorie`,
          content: "Case Study",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `strategy-case-${index}-title`,
          type: "text",
          label: `Proiect ${index + 1} - titlu`,
          content: `Proiect ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 24, fontWeight: 700 },
        },
        {
          id: `strategy-case-${index}-description`,
          type: "text",
          label: `Proiect ${index + 1} - descriere`,
          content: "Descriere proiect.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `strategy-case-${index}-link`,
          type: "button",
          label: `Proiect ${index + 1} - link`,
          content: "Detalii proiect",
          href: "/portofoliu",
          style: { ...defaultStyle(), color: "#66fcf1", fontWeight: 700 },
        },
        {
          id: `strategy-case-${index}-media`,
          type: "media",
          label: `Proiect ${index + 1} - imagine`,
          mediaId,
          caption: `Proiect ${index + 1}`,
          style: { ...defaultStyle(), borderRadius: 24 },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[1].id);
      addToast("success", "Case study adăugat.");
      return;
    }

    if (selectedSection.id === "portfolio-filter" && type === "text") {
      const index = getNextIndex(/^portfolio-filter-(\d+)-label$/);
      const nextElements: SectionElement[] = [
        {
          id: `portfolio-filter-${index}-label`,
          type: "text",
          label: `Filtru ${index + 1} - label`,
          content: `Filtru ${index + 1}`,
          style: { ...defaultStyle(), fontWeight: 700 },
        },
        {
          id: `portfolio-filter-${index}-value`,
          type: "text",
          label: `Filtru ${index + 1} - value`,
          content: `filtru-${index + 1}`,
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-filter-${index}-categories`,
          type: "text",
          label: `Filtru ${index + 1} - categories`,
          content: "*",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[0].id);
      addToast("success", "Filtru adăugat.");
      return;
    }

    if (selectedSection.id === "portfolio-projects" && type === "text") {
      const index = getNextIndex(/^portfolio-project-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `portfolio-project-${index}-slug`,
          type: "text",
          label: `Project ${index + 1} - slug`,
          content: `project-${index + 1}`,
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-project-${index}-title`,
          type: "text",
          label: `Project ${index + 1} - title`,
          content: `Project ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 24, fontWeight: 700 },
        },
        {
          id: `portfolio-project-${index}-category`,
          type: "text",
          label: `Project ${index + 1} - category`,
          content: "Social Media",
          style: { ...defaultStyle() },
        },
        {
          id: `portfolio-project-${index}-excerpt`,
          type: "text",
          label: `Project ${index + 1} - excerpt`,
          content: "Descriere proiect.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-project-${index}-metrics`,
          type: "text",
          label: `Project ${index + 1} - metrics`,
          content: "Metric 1\nMetric 2",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-project-${index}-has-video`,
          type: "text",
          label: `Project ${index + 1} - hasVideo`,
          content: "false",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-project-${index}-href`,
          type: "text",
          label: `Project ${index + 1} - href`,
          content: "/portofoliu",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-project-${index}-layout`,
          type: "text",
          label: `Project ${index + 1} - layout`,
          content: "standard",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-project-${index}-badge`,
          type: "text",
          label: `Project ${index + 1} - badge`,
          content: "Featured",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-project-${index}-media`,
          type: "media",
          label: `Project ${index + 1} - image`,
          mediaId,
          caption: `Project ${index + 1}`,
          style: { ...defaultStyle(), borderRadius: 20 },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[1].id);
      addToast("success", "Card proiect adăugat.");
      return;
    }

    if (selectedSection.id === "portfolio-video-showcase" && type === "text") {
      const index = getNextIndex(/^portfolio-video-item-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `portfolio-video-item-${index}-label`,
          type: "text",
          label: `Video item ${index + 1} - label`,
          content: `Video ${index + 1}`,
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-video-item-${index}-title`,
          type: "text",
          label: `Video item ${index + 1} - title`,
          content: `Video item ${index + 1}`,
          style: { ...defaultStyle(), fontWeight: 700 },
        },
        {
          id: `portfolio-video-item-${index}-description`,
          type: "text",
          label: `Video item ${index + 1} - description`,
          content: "Descriere video.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-video-item-${index}-link`,
          type: "button",
          label: `Video item ${index + 1} - link`,
          content: "Vezi",
          href: "/portofoliu",
          style: { ...defaultStyle(), color: "#66fcf1", fontWeight: 700 },
        },
        {
          id: `portfolio-video-item-${index}-media`,
          type: "media",
          label: `Video item ${index + 1} - image`,
          mediaId,
          caption: `Video ${index + 1}`,
          style: { ...defaultStyle(), borderRadius: 20 },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[1].id);
      addToast("success", "Video item adăugat.");
      return;
    }

    if (selectedSection.id === "portfolio-case-highlights" && type === "text") {
      const index = getNextIndex(/^portfolio-case-(\d+)-title$/);
      const nextElements: SectionElement[] = [
        {
          id: `portfolio-case-${index}-icon`,
          type: "text",
          label: `Case ${index + 1} - icon`,
          content: "Target",
          style: { ...defaultStyle(), fontSize: 12, color: "#66fcf1" },
        },
        {
          id: `portfolio-case-${index}-title`,
          type: "text",
          label: `Case ${index + 1} - title`,
          content: `Case ${index + 1}`,
          style: { ...defaultStyle(), fontWeight: 700 },
        },
        {
          id: `portfolio-case-${index}-context`,
          type: "text",
          label: `Case ${index + 1} - context`,
          content: "Context proiect.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-case-${index}-approach`,
          type: "text",
          label: `Case ${index + 1} - approach`,
          content: "Abordare implementată.",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-case-${index}-metric`,
          type: "text",
          label: `Case ${index + 1} - metric`,
          content: "KPI",
          style: { ...defaultStyle(), color: "#66fcf1" },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[1].id);
      addToast("success", "Case highlight adăugat.");
      return;
    }

    if (selectedSection.id === "portfolio-social-proof" && (type === "text" || type === "media")) {
      const index = getNextIndex(/^portfolio-logo-(\d+)-name$/);
      const nextElements: SectionElement[] = [
        {
          id: `portfolio-logo-${index}-name`,
          type: "text",
          label: `Logo ${index + 1} - name`,
          content: `Partner ${index + 1}`,
          style: { ...defaultStyle(), fontWeight: 700 },
        },
        {
          id: `portfolio-logo-${index}-href`,
          type: "text",
          label: `Logo ${index + 1} - href`,
          content: "/portofoliu",
          style: { ...defaultStyle(), color: "#c6c6c6" },
        },
        {
          id: `portfolio-logo-${index}-media`,
          type: "media",
          label: `Logo ${index + 1} - image`,
          mediaId,
          caption: `Logo ${index + 1}`,
          style: { ...defaultStyle(), borderRadius: 14 },
        },
      ];

      updateSection({ ...selectedSection, elements: [...selectedSection.elements, ...nextElements] });
      setSelectedElementId(nextElements[0].id);
      addToast("success", "Logo adăugat.");
      return;
    }

    const baseId = createId(type);
    const nextElement: SectionElement =
      type === "text"
        ? {
            id: baseId,
            type: "text",
            label: "Text nou",
            content: "Editează acest text.",
            style: { ...defaultStyle() },
          }
        : type === "button"
          ? {
              id: baseId,
              type: "button",
              label: "Buton nou",
              content: "Buton CTA",
              href: "/contacteaza-ne",
              style: {
                ...defaultStyle(),
                backgroundColor: "#66fcf1",
                color: "#0b0c10",
                textAlign: "center",
                padding: 12,
                borderRadius: 999,
                fontWeight: 700,
              },
            }
          : type === "media"
            ? {
                id: baseId,
                type: "media",
                label: "Media nouă",
                mediaId,
                caption: "Descriere media",
                style: { ...defaultStyle(), borderRadius: 20 },
              }
            : {
                id: baseId,
                type: "cta",
                label: "CTA nou",
                content: "Construim următoarea etapă de creștere?",
                subcontent: "Programează o discuție și îți propunem prioritățile cu impact.",
                buttonLabel: "Programează o discuție",
                buttonHref: "/contacteaza-ne",
                style: {
                  ...defaultStyle(),
                  textAlign: "center",
                  fontSize: 32,
                  fontWeight: 700,
                  padding: 18,
                  borderRadius: 24,
                },
              };

    updateSection({
      ...selectedSection,
      elements: [...selectedSection.elements, nextElement],
    });
    setSelectedElementId(nextElement.id);
    addToast("success", "Element adăugat.");
  }

  async function handleMediaUpload(payload: {
    file: File;
    name: string;
    tags: string[];
    type: "image" | "video";
  }) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("name", payload.name);
    formData.append("tags", payload.tags.join(","));
    formData.append("folder", "digital-dot");

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (response.ok) {
      const data = (await response.json()) as { item?: MediaItem };
      if (data.item) {
        const nextItem = data.item;
        applyUpdate((current) => {
          const next = deepClone(current);
          next.media.unshift(nextItem);
          return next;
        });
        addToast("success", "Media încărcată în Cloudinary.");
        return;
      }
    }

    const dataUrl = await fileToDataUrl(payload.file);
    applyUpdate((current) => {
      const next = deepClone(current);
      next.media.unshift({
        id: createId("media"),
        name: payload.name,
        type: payload.type,
        url: dataUrl,
        tags: payload.tags,
        createdAt: new Date().toISOString(),
        provider: "local",
      });
      return next;
    });
    addToast("info", "Cloudinary indisponibil. Media a fost salvată local.");
  }

  async function handleMediaReplace(mediaId: string, file: File) {
    const currentItem = draft.media.find((item) => item.id === mediaId);
    if (!currentItem) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", currentItem.name);
    formData.append("tags", currentItem.tags.join(","));
    formData.append("folder", "digital-dot");

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (response.ok) {
      const data = (await response.json()) as { item?: MediaItem };

      if (data.item) {
        const nextItem = data.item;
        if (currentItem.provider === "cloudinary" && currentItem.publicId) {
          void fetch("/api/admin/media/destroy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              publicId: currentItem.publicId,
              resourceType: currentItem.type === "video" ? "video" : "image",
            }),
          });
        }

        applyUpdate((current) => {
          const next = deepClone(current);
          next.media = next.media.map((item) => (item.id === mediaId ? { ...nextItem, id: mediaId } : item));
          return next;
        });
        addToast("success", "Media înlocuită în Cloudinary.");
        return;
      }
    }

    const dataUrl = await fileToDataUrl(file);
    applyUpdate((current) => {
      const next = deepClone(current);
      next.media = next.media.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              type: file.type.startsWith("video") ? "video" : "image",
              url: dataUrl,
              createdAt: new Date().toISOString(),
              provider: "local",
              publicId: undefined,
            }
          : item,
      );
      return next;
    });
    addToast("info", "Cloudinary indisponibil. Media a fost înlocuită local.");
  }

  async function handleMediaDelete(mediaId: string) {
    const inUse = draft.pages.some((page) =>
      page.sections.some((section) =>
        section.elements.some((element) => element.type === "media" && element.mediaId === mediaId),
      ),
    );

    if (inUse) {
      addToast("info", "Media este folosită într-o secțiune. Înlocuiește întâi referința.");
      return;
    }

    const mediaItem = draft.media.find((item) => item.id === mediaId);

    if (mediaItem?.provider === "cloudinary" && mediaItem.publicId) {
      const response = await fetch("/api/admin/media/destroy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: mediaItem.publicId,
          resourceType: mediaItem.type === "video" ? "video" : "image",
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        addToast("error", data?.message || "Nu am putut șterge fișierul din Cloudinary.");
        return;
      }
    }

    applyUpdate((current) => {
      const next = deepClone(current);
      next.media = next.media.filter((item) => item.id !== mediaId);
      return next;
    });

    addToast("success", "Media ștearsă.");
  }

  function handleCreatePost() {
    const id = createId("post");

    applyUpdate((current) => {
      const next = deepClone(current);
      next.blog.unshift({
        id,
        title: "Articol nou",
        content: "## Introducere\n\nCompletează conținutul articolului.",
        category: "strategie",
        tags: [],
        published: false,
        updatedAt: new Date().toISOString(),
      });
      return next;
    });

    addToast("success", "Articol nou creat.");
    return id;
  }

  function handleUpdatePost(post: BlogPostItem) {
    applyUpdate((current) => {
      const next = deepClone(current);
      next.blog = next.blog.map((item) => (item.id === post.id ? post : item));
      return next;
    });

    addToast("success", "Articol actualizat.");
  }

  function handleDeletePost(postId: string) {
    applyUpdate((current) => {
      const next = deepClone(current);
      next.blog = next.blog.filter((item) => item.id !== postId);
      return next;
    });

    addToast("success", "Articol șters.");
  }

  function handleAddSection(values: { name: string; type: PageSection["type"]; mediaId?: string }) {
    if (!selectedPage) {
      return;
    }

    const nextSection = createSectionTemplate(values.type, values.name, values.mediaId);

    applyUpdate((current) => {
      const next = deepClone(current);
      const page = next.pages.find((item) => item.id === selectedPage.id);
      if (!page) {
        return current;
      }

      page.sections.push(nextSection);
      return next;
    });

    setSelectedSectionId(nextSection.id);
    setSelectedElementId(nextSection.elements[0]?.id ?? "");
    addToast("success", "Secțiune adăugată.");
  }

  function handleDeleteSection(sectionId: string) {
    if (!selectedPage) {
      return;
    }

    if (selectedPage.sections.length <= 1) {
      addToast("info", "Pagina trebuie să aibă cel puțin o secțiune.");
      return;
    }

    applyUpdate((current) => {
      const next = deepClone(current);
      const page = next.pages.find((item) => item.id === selectedPage.id);
      if (!page) {
        return current;
      }

      page.sections = page.sections.filter((section) => section.id !== sectionId);
      return next;
    });

    const fallback = selectedPage.sections.find((section) => section.id !== sectionId);
    if (fallback) {
      setSelectedSectionId(fallback.id);
      setSelectedElementId(fallback.elements[0]?.id ?? "");
    }

    addToast("success", "Secțiune ștearsă.");
  }

  const autosaveLabel = getAutosaveLabel({
    isSaving,
    isDirty,
    autosaveError,
    lastSavedAt,
  });

  const showEditor = view === "dashboard";

  if (!isAuthChecked) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#121414]">
        <div className="rounded-2xl border border-[#3c4948]/30 bg-[#1e2020] px-6 py-4 text-sm text-[#bacac7]">
          Se verifică sesiunea CMS...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[130] bg-[#121414] text-white">
      <div className="flex h-full">
        <Sidebar
          activeView={view}
          collapsed={sidebarCollapsed}
          onViewChange={setView}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            pages={draft.pages}
            selectedPageId={selectedPageId}
            onSelectPage={handleSelectPage}
            onPreview={() => {
              const page = getPage(draft, selectedPageId);
              if (!page) {
                return;
              }
              window.open(page.slug, "_blank", "noopener,noreferrer");
            }}
            onSave={() => {
              void persistData(draft, "manual");
            }}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyPast.length > 0}
            canRedo={historyFuture.length > 0}
            isDirty={isDirty}
            isSaving={isSaving}
            autosaveLabel={autosaveLabel}
          />

          <div className="flex items-center justify-between border-b border-[#3c4948]/20 bg-[#121414] px-4 py-3 lg:hidden">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#3c4948]/40 px-3 text-sm text-[#9fb2bc]"
            >
              <Menu className="h-4 w-4" /> Panou
            </button>
            <div className="flex gap-2">
              {(["dashboard", "pages", "media", "blog", "settings"] as DashboardView[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]",
                    view === item ? "bg-[#62f9ee]/10 text-[#62f9ee]" : "bg-[#1a1c1c] text-[#88a0aa]",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 bg-[#121414]">
            {showEditor ? (
              <div className="flex h-full flex-col lg:flex-row">
                <StructurePanel
                  sections={selectedPage?.sections ?? []}
                  selectedSectionId={selectedSectionId}
                  onSelect={(sectionId) => {
                    setSelectedSectionId(sectionId);
                    const section = selectedPage?.sections.find((item) => item.id === sectionId);
                    setSelectedElementId(section?.elements[0]?.id ?? "");
                  }}
                  onReorder={(sourceIndex, targetIndex) => {
                    if (!selectedPage) {
                      return;
                    }

                    applyUpdate((current) => {
                      const next = deepClone(current);
                      const page = next.pages.find((item) => item.id === selectedPage.id);
                      if (!page) {
                        return current;
                      }

                      page.sections = reorderList(page.sections, sourceIndex, targetIndex);
                      return next;
                    });
                  }}
                  onToggleVisibility={(sectionId) => {
                    if (!selectedPage) {
                      return;
                    }

                    applyUpdate((current) => {
                      const next = deepClone(current);
                      const page = next.pages.find((item) => item.id === selectedPage.id);
                      if (!page) {
                        return current;
                      }

                      page.sections = page.sections.map((section) =>
                        section.id === sectionId
                          ? {
                              ...section,
                              settings: {
                                ...section.settings,
                                visible: !section.settings.visible,
                              },
                            }
                          : section,
                      );
                      return next;
                    });
                  }}
                  onAdd={() => setAddSectionOpen(true)}
                  onDelete={handleDeleteSection}
                />

                <EditorCanvas
                  section={selectedSection}
                  mediaById={mediaById}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onInlineTextChange={(elementId, value) => {
                    if (!selectedSection) {
                      return;
                    }

                    const target = selectedSection.elements.find((element) => element.id === elementId);
                    if (!target || target.type === "media") {
                      return;
                    }

                    updateElement({ ...target, content: value });
                  }}
                />

                <EditPanel
                  element={selectedElement}
                  media={draft.media}
                  onUpdate={updateElement}
                  onAddElement={addElementToSelectedSection}
                  onDelete={deleteSelectedElement}
                />
              </div>
            ) : null}

            {view === "pages" ? (
              <PagesManager
                pages={draft.pages}
                selectedPageId={selectedPageId}
                onSelectPage={handleSelectPage}
                onUpdatePage={(nextPage) => {
                  applyUpdate((current) => {
                    const next = deepClone(current);
                    next.pages = next.pages.map((page) => (page.id === nextPage.id ? nextPage : page));
                    return next;
                  });
                  addToast("success", "Setările paginii au fost actualizate.");
                }}
                onOpenEditor={(pageId) => {
                  handleSelectPage(pageId);
                  setView("dashboard");
                }}
                onPreviewPage={(slug) => {
                  window.open(slug, "_blank", "noopener,noreferrer");
                }}
              />
            ) : null}

            {view === "media" ? (
              <MediaLibrary
                media={draft.media}
                selectedMediaId={selectedElement?.type === "media" ? selectedElement.mediaId : undefined}
                onSelect={(mediaId) => {
                  if (!selectedElement || selectedElement.type !== "media") {
                    return;
                  }
                  updateElement({ ...selectedElement, mediaId });
                }}
                onUpload={(payload) => {
                  void handleMediaUpload(payload);
                }}
                onReplace={(mediaId, file) => {
                  void handleMediaReplace(mediaId, file);
                }}
                onDelete={(mediaId) => {
                  void handleMediaDelete(mediaId);
                }}
              />
            ) : null}

            {view === "blog" ? (
              <BlogManager
                posts={draft.blog}
                media={draft.media}
                onCreatePost={handleCreatePost}
                onDeletePost={handleDeletePost}
                onUpdatePost={handleUpdatePost}
              />
            ) : null}

            {view === "settings" ? (
              <SettingsPanel
                values={draft.settings}
                onUpdate={(values) => {
                  applyUpdate((current) => ({ ...current, settings: values }));
                  addToast("success", "Setări actualizate.");
                }}
              />
            ) : null}
          </div>
        </div>
      </div>

      <AddSectionModal
        open={addSectionOpen}
        media={draft.media}
        onClose={() => setAddSectionOpen(false)}
        onConfirm={handleAddSection}
      />

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
      {!isAuthenticated ? (
        <AuthGate
          onAuthenticated={() => {
            setIsAuthenticated(true);
            addToast("success", "Autentificare reușită.");
          }}
        />
      ) : null}
    </div>
  );
}

// Only fields that actually store an image URL belong to the upload control.
// imageAlt, imageLink, avatarLink and imagePosition are not image assets.
const imageFields = new Set([
  "image", "heroImage", "ogImage", "defaultOgImage", "logo",
  "headerLogo", "avatar", "favicon", "src",
]);

export const heroImagePositions = [
  { value: "left", label: "Stânga" },
  { value: "right", label: "Dreapta / fundal" },
] as const;

export function getContentFieldKind(path: readonly (string | number)[], value: unknown) {
  if (typeof value !== "string") return "text";
  if (path.length === 3 && path[0] === "landing" && path[1] === "hero" && path[2] === "imagePosition") {
    return "hero-image-position";
  }
  return imageFields.has(String(path.at(-1))) ? "image" : "text";
}

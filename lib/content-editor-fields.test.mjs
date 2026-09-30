import assert from "node:assert/strict";
import test from "node:test";
import { getContentFieldKind, heroImagePositions } from "./content-editor-fields.ts";
import { siteContentSchema } from "./site-content-schema.ts";

test("hero position uses a dedicated selector for either existing value", () => {
  for (const value of ["left", "right"]) {
    assert.equal(getContentFieldKind(["landing", "hero", "imagePosition"], value), "hero-image-position");
  }
  assert.equal(getContentFieldKind(["other", "imagePosition"], "right"), "text");
});

test("the selector offers exactly the positions accepted by the content schema", () => {
  const schema = siteContentSchema.shape.landing.shape.hero.shape.imagePosition.removeDefault();
  assert.deepEqual(heroImagePositions.map(option => option.value), schema.options);
  for (const { value } of heroImagePositions) assert.equal(schema.parse(value), value);
  assert.equal(schema.safeParse("/uploads/not-a-position.png").success, false);
});

test("asset fields retain their image upload controls, including empty optional URLs", () => {
  for (const key of ["image", "heroImage", "ogImage", "defaultOgImage", "logo", "headerLogo", "avatar", "favicon", "src"]) {
    for (const value of ["", "/uploads/fixture.png"]) {
      assert.equal(getContentFieldKind(["section", key], value), "image", key);
    }
  }
});

test("image metadata and destination links never become image uploads", () => {
  for (const key of ["imageAlt", "imageLink", "avatarLink", "imagePosition", "imageryDescription", "logoLink"]) {
    assert.equal(getContentFieldKind(["section", key], "test"), "text", key);
  }
  for (const value of [null, undefined, false, 2, [], {}]) {
    assert.equal(getContentFieldKind(["image"], value), "text");
  }
  assert.equal(getContentFieldKind([], "text"), "text");
});

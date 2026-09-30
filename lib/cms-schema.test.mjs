import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import test from "node:test";
import { cmsDataSchema, cmsReadDataSchema } from "./cms-schema.ts";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const legacyFile = new URL("../content/cms-data.json", import.meta.url);
const legacySha256 = "cbae3ff22129ff789983a68daffbf0da69b41d5207d6862f237102513a7238dc";

function fixture() {
  return {
    pages: [{
      id: "synthetic-page",
      name: "Synthetic page",
      slug: "synthetic-page",
      seoTitle: "Synthetic SEO title",
      seoDescription: "Synthetic SEO description for schema tests.",
      status: "draft",
      sections: [{
        id: "synthetic-section",
        name: "Synthetic section",
        type: "hero",
        elements: [{
          id: "synthetic-element",
          type: "text",
          label: "Synthetic label",
          content: "Synthetic content",
          style: {
            fontSize: 16, fontWeight: 400, textAlign: "left",
            color: "#000", backgroundColor: "#fff", padding: 0,
            margin: 0, borderRadius: 0,
          },
        }],
        settings: { backgroundColor: "#fff", paddingY: 0, borderRadius: 0, visible: true },
      }],
    }],
    media: [],
    blog: [],
    settings: { siteTitle: "Synthetic site", primaryColor: "#000" },
  };
}

test("reads the byte-identical legacy fixture without adding SEO or changing its data", async () => {
  const before = await fs.readFile(legacyFile);
  assert.equal(sha256(before), legacySha256, "The certified legacy fixture must not be rewritten.");
  const input = JSON.parse(before.toString("utf8"));
  const inputHash = sha256(JSON.stringify(input));
  const result = cmsReadDataSchema.safeParse(input);
  assert.equal(result.success, true, "The legacy fixture must pass the read schema.");
  assert.equal(result.data.pages.length, input.pages.length);
  for (const page of result.data.pages) {
    assert.equal(Object.hasOwn(page, "seoTitle"), false, "Reading must not invent an SEO title.");
    assert.equal(Object.hasOwn(page, "seoDescription"), false, "Reading must not invent an SEO description.");
  }
  assert.equal(sha256(JSON.stringify(input)), inputHash, "Validation must not mutate its input.");
  assert.equal(cmsDataSchema.safeParse(input).success, false, "Legacy omission must still fail strict writes.");
  assert.equal(sha256(await fs.readFile(legacyFile)), legacySha256, "Reading must leave the fixture bytes unchanged.");
});

test("read compatibility accepts either or both omitted SEO fields without defaults", () => {
  for (const omitted of [["seoTitle"], ["seoDescription"], ["seoTitle", "seoDescription"]]) {
    const input = fixture();
    for (const field of omitted) delete input.pages[0][field];
    const result = cmsReadDataSchema.safeParse(input);
    assert.equal(result.success, true);
    for (const field of ["seoTitle", "seoDescription"]) {
      if (omitted.includes(field)) assert.equal(Object.hasOwn(result.data.pages[0], field), false);
      else assert.equal(result.data.pages[0][field], input.pages[0][field]);
    }
    assert.equal(cmsDataSchema.safeParse(input).success, false, "Strict writes must require both SEO fields.");
  }
});

test("complete valid SEO remains accepted and is preserved by read and write schemas", () => {
  const input = fixture();
  for (const schema of [cmsReadDataSchema, cmsDataSchema]) {
    const result = schema.safeParse(input);
    assert.equal(result.success, true);
    assert.equal(result.data.pages[0].seoTitle, input.pages[0].seoTitle);
    assert.equal(result.data.pages[0].seoDescription, input.pages[0].seoDescription);
  }
});

test("present invalid SEO is never treated as a missing legacy field", () => {
  for (const field of ["seoTitle", "seoDescription"]) {
    const invalidValues = [null, "", field === "seoTitle" ? "ab" : "too short", 123, false, [], {}];
    for (const value of invalidValues) {
      const input = fixture();
      input.pages[0][field] = value;
      for (const schema of [cmsReadDataSchema, cmsDataSchema]) {
        const result = schema.safeParse(input);
        assert.equal(result.success, false);
        assert.equal(result.error.issues.some(issue => issue.path.join(".") === `pages.0.${field}`), true);
      }
    }
  }
});

test("read compatibility preserves all unrelated CMS constraints", () => {
  const invalidChanges = [
    data => { data.pages = []; },
    data => { data.pages[0].id = ""; },
    data => { data.pages[0].name = ""; },
    data => { data.pages[0].slug = ""; },
    data => { data.pages[0].status = "invalid"; },
    data => { data.pages[0].sections = []; },
    data => { data.pages[0].sections[0].elements[0].style.fontSize = 1; },
    data => { data.pages[0].sections[0].settings.visible = "yes"; },
    data => { data.settings.siteTitle = ""; },
    data => { data.settings.primaryColor = "x"; },
    data => { data.media = null; },
    data => { data.blog = "invalid"; },
  ];
  for (const change of invalidChanges) {
    const input = fixture();
    change(input);
    assert.equal(cmsReadDataSchema.safeParse(input).success, false);
    assert.equal(cmsDataSchema.safeParse(input).success, false);
  }
});

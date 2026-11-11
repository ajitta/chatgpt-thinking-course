// Fill a Naver SmartEditor ONE page from a magazine manuscript (blog/lesson-XX-summary.html).
// Stops before publishing. Publishing is publish.mjs, run only after the user approves.
//
// Run inside `ego-browser nodejs` with the editor already open on the target page:
//   const { buildDraft } = await import("file:///<repo>/blog/tools/naver/build-draft.mjs");
//   const report = await buildDraft(page, { repo: "C:/.../chatgpt-thinking-course", manuscript: "blog/lesson-02-summary.html" });
//
// Manuscript contract (see blog/PLAYBOOK.md):
//   <!-- title: ... -->                 post title
//   <p style=...>, <h2 ...>              text blocks; data-font="maru", data-align="center", data-tight
//   <blockquote data-quote="mark|line">  quote block (one <p> inside)
//   <hr>                                 default short divider
//   <p><img src="assets/x.png" data-rep data-small></p>  image; data-rep = representative, data-small = 작게
//   <a href> must wrap the whole text of its paragraph.
import { readFile } from "node:fs/promises";
import { se, SEL } from "./se.mjs";

const strip = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

export function parseManuscript(src) {
  const title = (src.match(/<!--[\s\S]*?title:\s*([^\n]+?)\s*(?:-->|\n)/) || [])[1];
  const body = src.replace(/<!--[\s\S]*?-->/g, "");
  const blocks = [];
  for (const m of body.matchAll(/<(p|h2|blockquote|hr)([^>]*)>(?:([\s\S]*?)<\/\1>)?/g)) {
    const [, tag, attrs, inner = ""] = m;
    if (tag === "hr") { blocks.push({ type: "hr" }); continue; }
    if (tag === "blockquote") { blocks.push({ type: "quote", kind: /data-quote="mark"/.test(attrs) ? "default" : "quotation_line", text: strip(inner) }); continue; }
    const img = inner.match(/<img[^>]*src="([^"]+)"([^>]*)>/);
    if (img) { blocks.push({ type: "img", src: img[1], rep: /data-rep/.test(img[0]), small: /data-small/.test(img[0]) }); continue; }
    const style = (attrs.match(/style="([^"]*)"/) || [, ""])[1];
    const href = (inner.match(/<a href="([^"]+)"/) || [])[1];
    blocks.push({ type: "text", tag, style, inner, text: strip(inner), maru: /data-font="maru"/.test(attrs), center: /data-align="center"/.test(attrs), tight: /data-tight/.test(attrs), heading: tag === "h2", bold: /font-weight:bold/.test(style) || tag === "h2", href });
  }
  return { title, blocks };
}

export function expectedLines(blocks) {
  return blocks.map(b => b.type === "hr" ? "───" : b.type === "img" ? "[IMG]" : b.type === "quote" ? "“" + b.text + "”" : b.text);
}

export async function buildDraft(page, { repo, manuscript }) {
  const ed = se(page);
  const { title, blocks } = parseManuscript(await readFile(`${repo}/${manuscript}`, "utf8"));
  if (!title) throw new Error("manuscript has no <!-- title: ... --> line");
  await page.evaluate(() => document.querySelector(".se-help-panel-close-button")?.click());

  // 1. title
  const tid = await page.evaluate(() => { const t = document.querySelector(".se-documentTitle .se-text-paragraph"); t.scrollIntoView({ block: "center" }); return t.id; });
  await page.click("css=#" + tid, { label: "post title" });
  await page.keyboard.press("Control+a"); await page.keyboard.press("Delete");
  await page.keyboard.insertText(title);

  // 2. clear body, paste text with markers
  const firstBody = await page.evaluate(() => { const p = [...document.querySelectorAll(".se-component.se-text p.se-text-paragraph")][0]; p.scrollIntoView({ block: "center" }); return p.id; });
  await page.click("css=#" + firstBody, { label: "body" });
  await page.keyboard.press("Control+a"); await page.waitForTimeout(400); await page.keyboard.press("Delete"); await page.waitForTimeout(1000);
  const out = []; const markers = []; let prevText = false;
  blocks.forEach((b, i) => {
    if (b.type !== "text") { const k = `[[M${i}]]`; markers.push({ k, b }); out.push(`<p>${k}</p>`); prevText = false; return; }
    if (prevText && !b.tight) out.push("<p><br></p>");
    const style = b.heading ? "font-size:19px;color:#203b30;" : b.style.replace(/font-weight:bold;?/, "").replace(/line-height:[^;]*;?/, "");
    const inner = b.inner.replace(/<a [^>]*>|<\/a>/g, "");
    out.push(`<p><span style="${style}">${b.bold ? `<b>${inner}</b>` : inner}</span></p>`);
    prevText = true;
  });
  const html = out.join(""); const text = html.replace(/<\/p>/g, "\n").replace(/<[^>]+>/g, "");
  const pid = await page.evaluate(() => { const p = [...document.querySelectorAll(".se-component.se-text p.se-text-paragraph")][0]; p.scrollIntoView({ block: "center" }); return p.id; });
  await page.click("css=#" + pid, { label: "empty body" });
  await page.keyboard.paste({ text, html });
  await page.waitForTimeout(2500);

  // 3. justify everything, then fonts / centring per block
  await ed.caret(await ed.idOf(blocks.find(b => b.type === "text" && !b.heading).text), "end");
  await page.keyboard.press("Control+a"); await page.waitForTimeout(400);
  await ed.align("양끝 정렬"); await ed.esc();
  for (const b of blocks.filter(b => b.type === "text" && (b.maru || b.center || b.heading))) {
    const id = await ed.idOf(b.text); if (!id) throw new Error("text not found: " + b.text);
    await ed.selectParagraph(id);
    if (b.maru) await ed.setFont("마루부리");
    if (b.heading) await ed.setSize("fs19");
    if (b.center) await ed.align("가운데 정렬");
  }

  // 4. components at markers, top to bottom
  for (const { k, b } of markers) {
    const id = await ed.idOf(k); if (!id) throw new Error("marker lost: " + k);
    if (b.type === "quote") {
      await ed.caret(id, "end");
      await ed.pickStyle(SEL.quoteBtn, b.kind);
      await page.keyboard.insertText(b.text);
      await ed.esc();
      const qid = await page.evaluate((t) => [...document.querySelectorAll(".se-component.se-quotation p.se-text-paragraph")].find(p => p.innerText.trim() === t)?.id, b.text);
      if (qid) { await ed.selectParagraph(qid); await ed.bold(); }
    } else if (b.type === "hr") {
      await ed.caret(id, "end");
      await ed.pickStyle(SEL.hrBtn, "default");
      await ed.esc();
    } else if (b.type === "img") {
      const file = `${repo}/blog/${b.src}`;
      await ed.insertImageAfter(id, file);
      const stem = b.src.split("/").pop().replace(/\.\w+$/, "");
      if (b.rep || b.small) {
        await page.click(`css=.se-component.se-image img[src*='${stem}']`, { label: "select image" });
        await page.waitForTimeout(500);
        if (b.small) await page.evaluate(() => [...document.querySelectorAll("button")].find(x => x.offsetParent && x.innerText.trim().startsWith("작게"))?.click());
        if (b.rep) await page.evaluate((s) => [...document.querySelectorAll(".se-component.se-image")].find(c => c.querySelector("img")?.src.includes(s)).querySelector("button.se-set-rep-image-button").click(), stem);
        await page.waitForTimeout(500); await ed.esc();
      }
    }
    await ed.removeMarker(id);
  }

  // 5. links
  for (const b of blocks.filter(b => b.type === "text" && b.href)) await ed.link(await ed.idOf(b.text), b.href);

  // 6. empty paragraphs at the start or end of a text component sit against a component margin: remove
  for (let n = 0; n < 60; n++) {
    const t = await page.evaluate(() => {
      const empty = (p) => !p.innerText.replace(/\u200b/g, "").trim();
      for (const c of document.querySelectorAll(".se-component.se-text")) {
        const ps = [...c.querySelectorAll("p.se-text-paragraph")];
        if (ps.every(empty)) continue;
        for (let k = 0; k < ps.length; k++) {
          if (!empty(ps[k])) continue;
          if (!ps[k - 1] && ps[k + 1] && !empty(ps[k + 1])) return { id: ps[k + 1].id, where: "start", key: "Backspace" };
          if (!ps[k + 1] && ps[k - 1] && !empty(ps[k - 1])) return { id: ps[k - 1].id, where: "end", key: "Delete" };
        }
      }
      return null;
    });
    if (!t) break;
    await ed.caret(t.id, t.where); await page.keyboard.press(t.key); await page.waitForTimeout(200);
  }
  await ed.esc();
  return verify(page, blocks, title);
}

export async function verify(page, blocks, title) {
  const got = await page.evaluate(() => [...document.querySelectorAll(".se-component:not(.se-documentTitle)")].filter(c => !c.parentElement.closest(".se-component")).flatMap(c =>
    c.classList.contains("se-horizontalLine") ? ["───"] : c.classList.contains("se-image") ? ["[IMG]"] :
    c.classList.contains("se-quotation") ? ["“" + [...c.querySelectorAll("p.se-text-paragraph")].map(p => p.innerText.trim()).filter(t => t && t !== "출처 입력").join(" ") + "”"] :
    [...c.querySelectorAll("p.se-text-paragraph")].map(p => p.innerText.replace(/\u200b/g, "").trim()).filter(Boolean)));
  const want = expectedLines(blocks);
  const diff = [];
  for (let i = 0; i < Math.max(want.length, got.length); i++) if (want[i] !== got[i]) diff.push({ i, want: want[i], got: got[i] });
  const gotTitle = await page.evaluate(() => document.querySelector(".se-documentTitle").innerText.trim());
  const rep = await page.evaluate(() => [...document.querySelectorAll(".se-component.se-image")].filter(c => c.querySelector("button.se-set-rep-image-button")?.className.includes("se-is-")).map(c => c.querySelector("img").src.split("/").pop().split("?")[0]));
  return { titleOk: gotTitle === title, lines: got.length, diff, representative: rep };
}

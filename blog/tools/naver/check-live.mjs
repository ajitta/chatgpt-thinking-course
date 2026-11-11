// Check a published post on m.blog.naver.com against its manuscript at phone widths.
// Run inside `ego-browser nodejs` on a spare Page (it changes that Page's viewport and user agent):
//   const { checkLive } = await import("file:///<repo>/blog/tools/naver/check-live.mjs");
//   const r = await checkLive(page, { repo, manuscript: "blog/lesson-03-summary.html", logNo: "2244...", shotDir: "C:/.../shots" });
// Per width it reports: title match, line diff against the manuscript, per-paragraph bold mismatches,
// headings that wrap, horizontal overflow, image/link counts and og:image. ok is true only when all pass.
import { readFile } from "node:fs/promises";
import { parseManuscript, expectedLines } from "./build-draft.mjs";

const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

export async function checkLive(page, { repo, manuscript, logNo, blogId = "ajitta", widths = [360, 412], shotDir, maxClosingRows = 2 }) {
  const { title, blocks } = parseManuscript(await readFile(`${repo}/${manuscript}`, "utf8"));
  const want = expectedLines(blocks);
  const fmt = blocks.filter(b => b.type === "text" || b.type === "quote")
    .map(b => ({ text: b.text, quote: b.type === "quote", bold: b.type === "quote" ? true : !!b.bold, heading: !!b.heading }));
  const wantImgs = blocks.filter(b => b.type === "img").length;
  const wantLinks = blocks.filter(b => b.type === "text" && b.href).map(b => b.href);
  const out = [];
  for (const w of widths) {
    await page.cdp("Emulation.setUserAgentOverride", { userAgent: UA });
    await page.cdp("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: true });
    await page.goto(`https://m.blog.naver.com/${blogId}/${logNo}`, { timeout: 60000 });
    await page.waitForSelector("css=.se-main-container", { timeout: 30000 });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(({ fmt }) => {
      const root = document.querySelector(".se-main-container");
      const clean = (s) => s.replace(/\u200b/g, "").trim();
      const lines = [...root.querySelectorAll(".se-component")].filter(c => !c.parentElement.closest(".se-component")).flatMap(c =>
        c.classList.contains("se-horizontalLine") ? ["───"] : c.classList.contains("se-image") ? ["[IMG]"] :
        c.classList.contains("se-quotation") ? ["“" + [...c.querySelectorAll("p.se-text-paragraph")].map(p => clean(p.innerText)).filter(t => t && t !== "출처 입력").join(" ") + "”"] :
        [...c.querySelectorAll("p.se-text-paragraph")].map(p => clean(p.innerText)).filter(Boolean));
      const paras = [...root.querySelectorAll("p.se-text-paragraph")];
      const bold = (p) => { const tw = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n, any = false; while ((n = tw.nextNode())) { if (!clean(n.textContent)) continue; any = true; if (!n.parentElement.closest("b,strong") && Number(getComputedStyle(n.parentElement).fontWeight) < 600) return false; } return any; };
      const rows = (p) => { const r = document.createRange(); r.selectNodeContents(p); return new Set([...r.getClientRects()].filter(x => x.width > 1).map(x => Math.round(x.top))).size; };
      const style = [], wrapped = [];
      for (const x of fmt) {
        const p = paras.find(p => clean(p.innerText) === x.text && !!p.closest(".se-quotation") === x.quote);
        if (!p) { style.push({ text: x.text.slice(0, 30), issue: "not found" }); continue; }
        if (bold(p) !== x.bold) style.push({ text: x.text.slice(0, 30), issue: x.bold ? "should be bold" : "should not be bold" });
        if (x.heading && rows(p) > 1) wrapped.push(x.text);
      }
      const titleEl = document.querySelector(".se-documentTitle .se-title-text, .se-title-text, .se_title");
      // closing line: the last centred body paragraph outside quotes (headings are centred too, but come earlier)
      const centred = paras.filter(p => /align-center/.test(p.className) && !p.closest(".se-quotation"));
      const closing = centred[centred.length - 1];
      return {
        title: titleEl ? clean(titleEl.innerText) : null,
        closingRows: closing ? rows(closing) : null,
        lines, style, wrapped,
        overflow: document.documentElement.scrollWidth - innerWidth,
        imgs: root.querySelectorAll(".se-component.se-image img").length,
        links: [...root.querySelectorAll("a[href]")].map(a => a.href).filter(h => !/^javascript:/.test(h)),
        ogImage: document.querySelector("meta[property='og:image']")?.content || null,
      };
    }, { fmt });
    const diff = [];
    for (let i = 0; i < Math.max(want.length, r.lines.length); i++) if (want[i] !== r.lines[i]) diff.push({ i, want: want[i], got: r.lines[i] });
    // m.blog rewrites post links (m.blog.naver.com, PostView.naver?logNo=); compare Naver posts by log number.
    const dec = (u) => { try { return decodeURIComponent(u); } catch { return u; } };
    const key = (u) => { const s = dec(u); const m = s.match(/blog\.naver\.com\/(?:[\w-]+\/(\d{9,})|(?:PostView\.(?:naver|nhn)|[\w-]+)\?[^#]*\blogNo=(\d+))/); return m ? "naver:" + (m[1] || m[2]) : s.replace(/\/$/, ""); };
    const got = new Set(r.links.map(key));
    const missingLinks = wantLinks.filter(h => !got.has(key(h)) && !r.links.some(l => dec(l).includes(h)));
    let shot = null;
    if (shotDir) shot = await page.screenshot({ path: `${shotDir}/live-${logNo}-${w}.png` }).catch(e => "screenshot failed: " + e.message);
    const closingOk = !maxClosingRows || r.closingRows == null || r.closingRows <= maxClosingRows;
    const ok = r.title === title && !diff.length && !r.style.length && !r.wrapped.length && r.overflow <= 0 && r.imgs === wantImgs && !missingLinks.length && /thumb-lesson/.test(r.ogImage || "") && closingOk;
    out.push({ width: w, ok, titleOk: r.title === title, lines: r.lines.length, diff, style: r.style, wrappedHeadings: r.wrapped, closingRows: r.closingRows, overflow: r.overflow, imgs: `${r.imgs}/${wantImgs}`, missingLinks, ogImage: r.ogImage, shot });
  }
  await page.cdp("Emulation.clearDeviceMetricsOverride", {});
  return { ok: out.every(x => x.ok), widths: out };
}

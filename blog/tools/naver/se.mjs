// SmartEditor ONE helpers for ego-browser scripts (Naver blog).
// Learned on lesson 1 (2026-11-11). Every selector here was checked against the live editor.
// Rules that cost time to discover:
//  - `End`/`Home` move within a *visual* line. Wrapped paragraphs need mouse-based selection
//    (selectParagraph) or a short marker line.
//  - DOM Range selection is ignored by the editor; select with mouse + Shift.
//  - Pasted font-family is dropped and pasted sizes snap to the menu (11/13/15/16/19/24/28...).
//  - Quote blocks have no font-family control; their typeface is fixed by the quote style.
//  - Toolbar buttons whose class encodes the last-used style: match by prefix.

export const SEL = {
  quoteBtn: 'button.se-document-toolbar-icon-select-button[class*="se-insert-quotation-"]',
  hrBtn: 'button.se-document-toolbar-icon-select-button[class*="se-insert-horizontal-line-"]',
};

export function se(page) {
  const esc = async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(150); };

  const paragraphs = () => page.evaluate(() => [...document.querySelectorAll(".se-component:not(.se-documentTitle) p.se-text-paragraph")].map(p => ({ id: p.id, text: p.innerText.replace(/​/g, "").trim() })));

  // mode: "exact" | "starts" | "includes"; searches body text components only
  const idOf = (text, mode = "exact") => page.evaluate(({ text, mode }) => {
    const ok = (t) => mode === "exact" ? t === text : mode === "starts" ? t.startsWith(text) : t.includes(text);
    return [...document.querySelectorAll(".se-component.se-text p.se-text-paragraph")].find(p => ok(p.innerText.replace(/​/g, "").trim()))?.id || null;
  }, { text, mode });

  async function point(id, where) {
    await page.evaluate((i) => document.getElementById(i).scrollIntoView({ block: "center" }), id);
    await page.waitForTimeout(250);
    return page.evaluate(({ i, where }) => {
      const p = document.getElementById(i);
      const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.replace(/​/g, "").length ? 1 : 3 });
      const nodes = []; let n; while ((n = w.nextNode())) nodes.push(n);
      const r = document.createRange();
      if (where === "start") { r.setStart(nodes[0], 0); r.setEnd(nodes[0], 1); const b = r.getBoundingClientRect(); return { x: b.left + 1, y: b.top + b.height / 2 }; }
      const z = nodes[nodes.length - 1]; r.setStart(z, z.length - 1); r.setEnd(z, z.length); const b = r.getBoundingClientRect(); return { x: b.right - 1, y: b.top + b.height / 2 };
    }, { i: id, where });
  }

  async function caret(id, where) {
    await esc();
    const pt = await point(id, where);
    await page.mouse.click(pt.x, pt.y, { label: "caret " + where });
    await page.keyboard.press(where === "start" ? "Home" : "End");
  }

  async function selectParagraph(id) {
    await esc();
    const a = await point(id, "start"), z = await point(id, "end");
    await page.mouse.click(a.x, a.y, { label: "paragraph start" });
    await page.keyboard.press("Home");
    await page.keyboard.down("Shift");
    await page.mouse.click(z.x + 2, z.y, { label: "paragraph end" });
    await page.keyboard.up("Shift");
    await page.waitForTimeout(250);
  }

  // Quote and divider menus both have a "default" option: search only inside the menu just opened.
  async function pickStyle(buttonSel, value) {
    await page.evaluate((s) => [...document.querySelectorAll(s)].find(b => b.offsetParent).nextElementSibling.click(), buttonSel);
    await page.waitForTimeout(450);
    const ok = await page.evaluate(({ s, v }) => {
      const toggle = [...document.querySelectorAll(s)].find(b => b.offsetParent);
      // the main toolbar buttons also carry data-value; only menu options have se-toolbar-option
      const opt = "button.se-toolbar-option-icon-button[data-value='" + v + "']";
      let scope = toggle.parentElement;
      while (scope && !scope.querySelector(opt)) scope = scope.parentElement;
      const b = scope && [...scope.querySelectorAll(opt)].find(b => b.offsetParent);
      if (b) { b.click(); return true; } return false;
    }, { s: buttonSel, v: value });
    if (!ok) throw new Error("style not found: " + value);
    await page.waitForTimeout(800);
  }

  async function menuValue(buttonSel, matcher) {
    await page.click("css=" + buttonSel + " >> nth=0", { label: "toolbar menu" });
    await page.waitForTimeout(400);
    const ok = await page.evaluate((m) => {
      const b = [...document.querySelectorAll("button")].find(b => b.offsetParent && (m.value ? b.getAttribute("data-value") === m.value : b.innerText.trim().split("\n")[0] === m.text));
      if (b) { b.click(); return true; } return false;
    }, matcher);
    if (!ok) throw new Error("menu item not found: " + JSON.stringify(matcher));
    await page.waitForTimeout(300);
  }
  const setFont = (name) => menuValue("button.se-font-family-toolbar-button", { text: name });
  const setSize = (fs) => menuValue("button.se-font-size-code-toolbar-button", { value: fs });
  const bold = async () => { await page.click("css=button.se-bold-toolbar-button >> nth=0", { label: "bold" }); await page.waitForTimeout(250); };

  async function align(label) { // "가운데 정렬" | "양끝 정렬" | "왼쪽 정렬"
    await page.evaluate(() => [...document.querySelectorAll("button")].find(b => b.offsetParent && b.innerText.includes("정렬 열기")).click());
    await page.waitForTimeout(350);
    const ok = await page.evaluate((l) => { const b = [...document.querySelectorAll("button")].find(b => b.offsetParent && b.innerText.trim().startsWith(l)); if (b) { b.click(); return true; } return false; }, label);
    if (!ok) throw new Error("align not found: " + label);
    await page.waitForTimeout(250);
  }

  async function removeMarker(id) {
    await caret(id, "end");
    await page.keyboard.press("Shift+Home");
    await page.keyboard.press("Delete");
    const hasPrev = await page.evaluate((i) => { const p = document.getElementById(i); return !!(p && p.previousElementSibling && p.previousElementSibling.matches("p.se-text-paragraph")); }, id);
    if (hasPrev) await page.keyboard.press("Backspace");
    await page.waitForTimeout(250);
  }

  async function insertImageAfter(id, file) {
    await caret(id, "end");
    const chooserP = page.waitForFileChooser({ timeout: 10000 });
    await page.click("css=button.se-image-toolbar-button", { label: "insert photo" });
    await (await chooserP).setFiles(file);
    const stem = file.split("/").pop().replace(/\.\w+$/, "");
    await page.waitForFunction((n) => [...document.querySelectorAll(".se-component.se-image img")].some(i => i.src.includes(n)), stem, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1200);
    await esc();
  }

  async function link(id, href) {
    // Mouse selection covers every visual line; End + Shift+Home linked only the last line of a wrapped link.
    await selectParagraph(id);
    await page.click("css=button.se-link-toolbar-button >> nth=0", { label: "open link input" });
    await page.waitForSelector("css=input.se-custom-layer-link-input", { state: "visible" });
    await page.fill("css=input.se-custom-layer-link-input", href);
    await page.click("css=button.se-custom-layer-link-apply-button", { label: "apply link" });
    await page.waitForTimeout(600);
  }

  return { esc, paragraphs, idOf, caret, selectParagraph, pickStyle, setFont, setSize, bold, align, removeMarker, insertImageAfter, link };
}

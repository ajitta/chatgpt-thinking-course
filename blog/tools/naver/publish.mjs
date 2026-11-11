// Publish the post open in the editor. Run only after the user approved this exact post.
//   const { publish } = await import("file:///<repo>/blog/tools/naver/publish.mjs");
//   await publish(page, { category: "AI 기본원리", categoryNo: 7, topic: "IT·컴퓨터_30" });
// New posts default to category 낙서장 and no topic; categoryNo/topic set them (labels in the panel use
// ids like "7_AI 기본원리" and "IT·컴퓨터_30", with non-breaking spaces in names).
// Throws instead of publishing when the panel's category, topic or visibility differ from what was asked.
const norm = (s) => (s || "").replace(/ /g, " ").replace(/\s/g, "");

export async function publish(page, { category, categoryNo, topic = "IT·컴퓨터_30", visibility = "전체공개", clearTags = true }) {
  await page.keyboard.press("Escape");
  const panelOpen = () => page.evaluate(() => !!document.querySelector("[class*=layer_publish], [class*=publish_layer]"));
  if (!(await panelOpen())) { await page.click("css=button[class*=publish_btn]", { label: "open publish panel" }); await page.waitForTimeout(1500); }

  const panelText = () => page.evaluate(() => document.querySelector("[class*=layer_publish], [class*=publish_layer]").textContent);
  if (categoryNo && !norm(await panelText()).includes(norm(category))) {
    await page.click("css=button[class*=selectbox_button]", { label: "category list" });
    await page.waitForTimeout(700);
    const ok = await page.evaluate((n) => { const l = document.querySelector(`label[for^='${n}_']`); if (l) { l.click(); return true; } return false; }, categoryNo);
    if (!ok) throw new Error("category " + categoryNo + " not in the list (create it in blog admin first)");
    await page.waitForTimeout(800);
  }
  const topicName = topic && topic.split("_")[0];
  if (topic && !norm(await panelText()).includes(norm(topicName))) {
    await page.evaluate(() => [...document.querySelector("[class*=layer_publish], [class*=publish_layer]").querySelectorAll("a, button")].find(x => x.offsetParent && /주제/.test(x.textContent) && /선택|>/.test(x.textContent))?.click());
    await page.waitForTimeout(900);
    const ok = await page.evaluate((id) => { const l = document.querySelector(`label[for='${id}']`); if (!l) return false; l.click(); return true; }, topic);
    if (!ok) throw new Error("topic not found: " + topic);
    await page.waitForTimeout(500);
    await page.evaluate(() => [...document.querySelectorAll("button")].find(x => x.offsetParent && x.textContent.trim() === "확인")?.click());
    await page.waitForTimeout(700);
  }
  if (clearTags) {
    const n0 = await page.evaluate(() => document.querySelectorAll("[id^='tag-item-']").length);
    if (n0) {
      await page.click("css=#tag-input", { label: "tag input" });
      for (let k = 0; k < 40; k++) {
        const n = await page.evaluate(() => document.querySelectorAll("[id^='tag-item-']").length);
        if (!n) break;
        await page.keyboard.press("Backspace"); await page.waitForTimeout(250);
      }
    }
  }
  const st = await page.evaluate(() => ({
    text: document.querySelector("[class*=layer_publish], [class*=publish_layer]").textContent,
    vis: [...document.querySelectorAll("input[type=radio]:checked")].map(i => document.querySelector(`label[for="${i.id}"]`)?.textContent.trim()),
    tags: document.querySelectorAll("[id^='tag-item-']").length,
  }));
  if (!norm(st.text).includes(norm(category))) throw new Error(`category is not "${category}"`);
  if (topicName && !norm(st.text).includes(norm(topicName))) throw new Error(`topic is not "${topicName}"`);
  if (!st.vis.includes(visibility)) throw new Error(`visibility is not ${visibility}`);
  if (clearTags && st.tags) throw new Error("tags remain");
  await page.evaluate(() => document.querySelector("button[class*=confirm_btn]").click());
  await page.waitForURL(/PostView|logNo=/, { timeout: 30000 });
  return page.url();
}

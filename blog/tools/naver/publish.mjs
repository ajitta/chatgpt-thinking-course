// Publish the post open in the editor. Run only after the user approved this exact post.
//   const { publish } = await import("file:///<repo>/blog/tools/naver/publish.mjs");
//   await publish(page, { category: "AI 기본원리", clearTags: true });
// Refuses (throws) when the panel's category or visibility differ from what was asked.
export async function publish(page, { category, visibility = "전체공개", clearTags = true }) {
  await page.keyboard.press("Escape");
  await page.click("css=button[class*=publish_btn]", { label: "open publish panel" });
  await page.waitForTimeout(1500);
  if (clearTags) {
    await page.click("css=#tag-input", { label: "tag input" });
    for (let k = 0; k < 40; k++) {
      const n = await page.evaluate(() => document.querySelectorAll("[id^='tag-item-']").length);
      if (!n) break;
      await page.keyboard.press("Backspace"); await page.waitForTimeout(250);
    }
  }
  const st = await page.evaluate(() => {
    const panel = document.querySelector("[class*=layer_publish], [class*=publish_layer]");
    return {
      text: panel.innerText.replace(/\s/g, ""),
      vis: [...document.querySelectorAll("input[type=radio]:checked")].map(i => document.querySelector(`label[for="${i.id}"]`)?.innerText.trim()),
    };
  });
  if (!st.text.includes(category.replace(/\s/g, ""))) throw new Error(`category is not "${category}"; set it in the panel first`);
  if (!st.vis.includes(visibility)) throw new Error(`visibility is not ${visibility}`);
  await page.evaluate(() => document.querySelector("button[class*=confirm_btn]").click());
  await page.waitForURL(/PostView/, { timeout: 30000 });
  return page.url();
}

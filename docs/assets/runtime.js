// Renders the original lesson UI programs (sources/conversation/ui) as HTML.
// The same module runs at build time in Node (initial HTML) and in the browser
// (re-rendering after a reader answers a question, moves a slider, or types).

const FRAGMENT = Symbol("fragment");

// Component references the programs use by name.
export function Cite() {}
export function Link() {}
export function AsyncImage() {}
export function Entity() {}
const COMPONENTS = [Cite, Link, AsyncImage, Entity];

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = s => String(s).replace(/[&<>"]/g, c => ESC[c]);

// Every colour literal in lessons 1-20, mapped onto the site palette (one green accent).
const COLORS = {
  // blues: highlighted bars, lines, dots
  "#2386d8": "var(--accent)", "#2985d2": "var(--accent)", "#2a8bce": "var(--accent)", "#468cdd": "var(--accent)",
  "#2489d4": "var(--accent)", "#3283cd": "var(--accent)", "#3185cb": "var(--accent)", "#3285cb": "var(--accent)",
  "#2785d1": "var(--accent)", "#2585cd": "var(--accent)", "#2479ca": "var(--accent)", "#388bd2": "var(--accent)",
  "#2884c9": "var(--accent)",
  // blue-greys: neutral bars, boxes, dashed lines
  "#8d9baa": "var(--diagram)", "#8796a5": "var(--diagram)", "#97a2b3": "var(--diagram)", "#9aa4b2": "var(--diagram)",
  "#8894a4": "var(--diagram)", "#9099a6": "var(--diagram)", "#a7b0bc": "var(--diagram)", "#8296ab": "var(--diagram)",
  "#7187a2": "var(--diagram)", "#94aec3": "var(--diagram-light)",
  // reds and oranges: errors, risk
  "#df6655": "var(--danger-fill)", "#dd7866": "var(--danger-fill)", "#df7567": "var(--danger-fill)", "#d67b69": "var(--danger-fill)",
  "#d58a64": "var(--warning-fill)", "#d58b69": "var(--warning-fill)"
};
function paint(value) {
  if (typeof value !== "string") return value;
  return COLORS[value.trim().toLowerCase()] || value;
}
const BACKGROUNDS = {
  "surface-secondary": "bg-2",
  "surface-tertiary": "bg-3",
  surface: "bg-1",
  "rgba(24,119,242,0.07)": "bg-accent",
  "rgba(26,145,99,0.08)": "bg-accent",
  "rgba(217,81,70,0.08)": "bg-danger",
  "rgba(220,70,60,0.07)": "bg-danger",
  "rgba(214,139,50,0.09)": "bg-warning"
};

const SVG_ATTRS = {
  strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray", strokeOpacity: "stroke-opacity", fillOpacity: "fill-opacity",
  textAnchor: "text-anchor", fontSize: "font-size", fontWeight: "font-weight", dominantBaseline: "dominant-baseline"
};

function cleanUrl(url) {
  if (typeof url !== "string" || !/^https?:\/\//.test(url)) return null;
  try {
    const u = new URL(url);
    for (const k of [...u.searchParams.keys()]) if (/^(utm_|trk$|_bhlid$)/.test(k)) u.searchParams.delete(k);
    return u.toString();
  } catch { return null; }
}

function flatten(list, out = []) {
  for (const item of list) {
    if (Array.isArray(item)) flatten(item, out);
    else if (item != null && item !== false && item !== true && item !== "") out.push(item);
  }
  return out;
}

// Plain text of a node; element boundaries become spaces so labels read as words.
function textOf(node) {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && node.children) {
    const inline = node.type === "bold" || node.type === "italic";
    return flatten(node.children).map(c => (typeof c === "object" && !inline ? " " + textOf(c) + " " : textOf(c))).join("");
  }
  return "";
}
const squeeze = s => s.replace(/\s+/g, " ").trim();

const isType = (n, t) => n && typeof n === "object" && n.type === t;

// Minimal LaTeX for the three formulas in lessons 11 and 15.
function mathHTML(src) {
  let i = 0;
  const group = () => {
    if (src[i] !== "{") return "";
    let depth = 0;
    const start = ++i;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") { if (depth === 0) break; depth--; }
    }
    return src.slice(start, i++);
  };
  let out = "";
  while (i < src.length) {
    if (src.startsWith("\\text", i)) { i += 5; out += `<span class="mt">${esc(group())}</span>`; }
    else if (src.startsWith("\\frac", i)) { i += 5; const a = group(), b = group(); out += `<span class="frac"><span>${mathHTML(a)}</span><span>${mathHTML(b)}</span></span>`; }
    else if (src.startsWith("\\times", i)) { i += 6; out += " × "; }
    else if (src.startsWith("\\cdot", i)) { i += 5; out += " · "; }
    else if (src[i] === "=") { i++; out += " = "; }
    else if (src[i] === "+") { i++; out += " + "; }
    else { out += esc(src[i]); i++; }
  }
  return out;
}

function mathText(src) {
  return src.replace(/\\text\{([^}]*)\}/g, "$1").replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1) ÷ ($2)")
    .replace(/\\times/g, " × ").replace(/\\cdot/g, " · ").replace(/\s+/g, " ").trim();
}

export class Lesson {
  constructor(data, options = {}) {
    this.data = data;
    this.assets = options.assets || "../../assets/";
    this.onCopy = options.onCopy || (() => {});
    this.chartWidths = [];
    this.state = new Map();
    this.invalidate = () => {};
    this.root = null;
    const self = this;
    const DIL = {
      render(el) { self.root = el; },
      useState(init, opts) { return self.useState(init, opts); },
      useConstants() { return data.constants; },
      useAppData(select) {
        return select({ opGenui: { modelDataBindings: data.bindings || {}, componentResults: data.resolutions || {} } });
      }
    };
    const GenUI = { copy: text => self.onCopy(String(text ?? "")), issueNewTurn() {} };
    data.program(DIL, { jsx: (type, props, ...children) => ({ type, props: props || {}, children }), Fragment: FRAGMENT },
      GenUI, Cite, Link, AsyncImage, Entity);
  }

  useState(init, opts) {
    const comp = this.component;
    const key = comp.path + "#" + (opts && opts.key != null ? "k" + opts.key : "i" + comp.hook++);
    if (!this.state.has(key)) this.state.set(key, typeof init === "function" ? init() : init);
    const set = value => {
      const prev = this.state.get(key);
      const next = typeof value === "function" ? value(prev) : value;
      if (!Object.is(prev, next)) { this.state.set(key, next); this.invalidate(); }
    };
    return [this.state.get(key), set];
  }

  // Returns { html, toc } for the current state.
  render() {
    this.handlers = [];
    this.groupCount = 0;
    this.headingCount = 0;
    this.toc = [];
    this.h1Done = false;
    this.lastLabelId = null;
    const top = this.call(this.root, "r");
    let items = top && top.type === FRAGMENT ? flatten(top.children) : flatten([top]);
    items = items.map((item, i) => this.resolve(item, "r." + i)).flat();
    const start = this.data.start_at_title;
    if (start) {
      const at = items.findIndex(n => isType(n, "title") && squeeze(textOf(n)) === start);
      if (at >= 0) items = items.slice(at);
    }
    const html = this.list(items, { path: "r", top: true });
    return { html, toc: this.toc };
  }

  // Unwrap function components until an element, a string, or a fragment remains.
  call(node, path) {
    let guard = 0;
    while (node && typeof node === "object" && typeof node.type === "function" && !COMPONENTS.includes(node.type)) {
      const prev = this.component;
      this.component = { path: path + "/" + guard, hook: 0 };
      try { node = node.type(node.props); } finally { this.component = prev; }
      if (++guard > 20) break;
    }
    return node;
  }

  resolve(node, path) {
    node = this.call(node, path);
    if (node && node.type === FRAGMENT) return flatten(node.children).map(n => this.resolve(n, path)).flat();
    return node == null || node === false || node === true ? [] : [node];
  }

  // Returns the handler id for a data-* attribute, or null when there is no callback.
  handler(fn) {
    if (typeof fn !== "function") return null;
    this.handlers.push(fn);
    return String(this.handlers.length - 1);
  }

  // A site note left where the original's "send to ChatGPT" buttons were.
  sentNote(sent, items, ctx) {
    const labels = sent.map(b => squeeze(textOf(b))).filter(Boolean);
    const quoted = labels.map(l => `‘${l}’`).join(", ");
    const copies = items.some(n => isType(n, "button") && /GenUI\.copy/.test(String(n.props.onClick)));
    let text;
    if (copies) {
      // The request the button appended: a string literal in its handler, or a constant it refers to.
      const asks = sent.flatMap(b => {
        const src = String(b.props.onClick);
        const literals = [...src.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => { try { return JSON.parse(`"${m[1]}"`); } catch { return ""; } });
        const consts = [...src.matchAll(/__dilConstants\["(\d+)"\]/g)].map(m => this.data.constants[m[1]]).filter(v => typeof v === "string");
        // In a template literal the request is the text after the reader's own content.
        const templates = [...src.matchAll(/`((?:[^`\\]|\\.)*)`/g)].map(m => m[1].split(/\$\{[^}]*\}/).pop().replace(/\\n/g, " "));
        return templates.concat(literals, consts);
      }).map(s => s.trim()).filter(s => /[가-힣]/.test(s) && s.length > 15);
      text = asks.length
        ? `원문의 ${quoted} 버튼은 이 내용 뒤에 다음 요청을 붙여 ChatGPT에 보냈습니다. “${asks[0]}” 이 사이트에서는 내용을 복사한 뒤 이 요청을 덧붙여 ChatGPT 등에 붙여 넣어 쓰세요.`
        : `원문의 ${quoted} 버튼은 이 내용을 ChatGPT에 바로 보냈습니다. 이 사이트에서는 복사해서 ChatGPT 등에 붙여 넣어 쓰세요.`;
    } else {
      const n = this.data.lesson;
      const count = labels.length > 1 ? `버튼 ${labels.length}개(${quoted})가` : `버튼(${quoted})이`;
      text = `원문에는 이 자리에 ChatGPT에 새 요청을 보내는 ${count} 있었습니다. 이 사이트에서는 뺐습니다.`;
      const nextLabel = labels.find(l => new RegExp(`^${n + 1}강\\s*·`).test(l));
      if (nextLabel && n < 20) text += ` ${n + 1}강은 이 페이지 맨 아래의 다음 강의 링크로 이어집니다.`;
      if (nextLabel && n >= 20) text += ` 원문 대화는 ${n + 1}강으로 이어지지만, 이 사이트에는 20강까지 옮겼습니다.`;
    }
    const tag = ctx.phrasing ? "span" : "p";
    return `<${tag} class="u-sitenote">${esc(text)}</${tag}>`;
  }

  list(children, ctx) {
    const items = flatten(children).map((n, i) => this.resolve(n, ctx.path + "." + i)).flat();
    let out = "";
    let labelId = null;
    let near = ctx.near || "";
    // The original's buttons that open a new ChatGPT turn are left out; one site note takes their place.
    const sends = n => isType(n, "button") && typeof n.props.onClick === "function" && /GenUI\.issueNewTurn/.test(String(n.props.onClick));
    const sent = items.filter(sends);
    let noted = false;
    items.forEach((node, i) => {
      if (sends(node)) {
        if (!noted) { out += this.sentNote(sent, items, ctx); noted = true; }
        return;
      }
      const c = { ...ctx, path: ctx.path + "." + i, labelId, prev: items[i - 1], next: items[i + 1], siblings: items, index: i, near };
      const outer = this.lastLabelId;
      this.lastLabelId = null;
      out += this.node(node, c);
      const made = this.lastLabelId;
      this.lastLabelId = made || outer;
      labelId = made;
      if (isType(node, "title") || isType(node, "text") || typeof node === "string") {
        const t = squeeze(textOf(node));
        if (t && t.length < 200) near = t;
      }
    });
    return out;
  }

  inner(children, ctx) {
    return this.list(children, { ...ctx, top: false });
  }

  node(node, ctx) {
    if (node == null || node === false || node === true) return "";
    if (typeof node === "string" || typeof node === "number") {
      let s = esc(node);
      if (!ctx.pre && !ctx.svg) {
        // Markdown left inside a sentence (lesson 11) and blank-line breaks inside one text.
        s = s.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>").replace(/\n[ \t]*\n\s*/g, "<br>");
      }
      return ctx.top ? `<p>${s}</p>` : s;
    }
    if (typeof node !== "object") return "";
    const { type, props, children } = node;
    if (type === FRAGMENT) return this.list(children, ctx);
    if (type === Cite) return this.cite(props);
    if (type === Link) return this.link(props);
    if (type === AsyncImage) return this.image(props);
    if (type === Entity) return `<span class="u-entity">${esc(props.value ?? "")}</span>`;
    if (ctx.svg) return this.svgNode(type, props, children, ctx);
    const render = ELEMENTS[type];
    if (render) return render.call(this, props, children, ctx, node);
    return this.inner(children, ctx);
  }

  cite(props) {
    const res = (this.data.resolutions || {})[props.__resolutionId];
    const items = (res && res.state && res.state.items) || [];
    const seen = new Set();
    return items.map(it => {
      const url = cleanUrl(it.url);
      if (!url) return "";
      const host = new URL(url).hostname.replace(/^www\./, "");
      // One chip per site; a bare "DOI" or a long page title reads better as the publisher or the site.
      if (seen.has(host)) return "";
      seen.add(host);
      let label = it.source_label || it.source_name || it.title || host;
      if (/^doi$/i.test(label)) label = it.source_name || it.attribution || host;
      if (label.length > 24) label = it.source_name && it.source_name.length <= 24 ? it.source_name : host;
      // The site opens no github.com pages (user decision); such a source is named but not linked.
      if (/^https:\/\/(www\.)?github\.com\//.test(url)) return ` <span class="u-cite" title="${esc(it.title || label)}">${esc(label)}</span>`;
      return ` <a class="u-cite" href="${esc(url)}" title="${esc(it.title || label)}" rel="noopener">${esc(label)}</a>`;
    }).join("");
  }

  link(props) {
    const res = (this.data.resolutions || {})[props.__resolutionId];
    const url = cleanUrl(props.url) || cleanUrl(res && res.state && res.state.url);
    const title = props.title || (res && res.state && res.state.title) || url || "";
    if (url && /^https:\/\/(www\.)?github\.com\//.test(url)) return esc(title);
    return url ? `<a href="${esc(url)}" rel="noopener">${esc(title)}</a>` : esc(title);
  }

  image(props) {
    const res = (this.data.resolutions || {})[props.__resolutionId];
    // Left out at build time for licence terms (site/build.mjs OMITTED_IMAGE_SOURCES).
    if (res && res.state && res.state.omittedImage) return `<p class="u-sitenote">원문에는 이 자리에 이미지가 있었습니다(출처: ${esc(res.state.omittedImage)}). 이용 조건 때문에 이 사이트에는 싣지 않았습니다.</p>`;
    const img = res && res.state && res.state.images && res.state.images[0];
    if (!img) return "";
    const src = cleanUrl(img.thumbnail_url) || cleanUrl(img.content_url) || cleanUrl(img.url);
    const ratio = (props.aspectRatio || "16:9").replace(":", " / ");
    const page = cleanUrl(img.url) || cleanUrl(img.original_content_url);
    let host = "";
    try { host = page ? new URL(page).hostname.replace(/^(www|media|miro)\./, "") : ""; } catch {}
    const size = img.thumbnail_size || img.content_size || {};
    const crop = img.thumbnail_crop_info;
    const pos = crop ? `object-position:${(crop.center_x_percent * 100).toFixed(1)}% ${(crop.center_y_percent * 100).toFixed(1)}%` : "";
    const missing = this.failedImages && this.failedImages.has(src) ? " is-missing" : "";
    // The caption names the source site; the source page's own title stays in the link's title.
    return `<figure class="u-image${missing}"><div class="u-image-frame" style="aspect-ratio:${esc(ratio)}">` +
      `<img src="${esc(src)}" alt=""${size.width ? ` width="${size.width}" height="${size.height}"` : ""}${pos ? ` style="${pos}"` : ""} loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>` +
      `<figcaption>원문 이미지${page ? ` · 출처: <a href="${esc(page)}" title="${esc(img.title || "")}" rel="noopener">${esc(host || "원래 페이지")}</a>` : ""}</figcaption></figure>`;
  }

  svgNode(type, props, children, ctx) {
    let attrs = "";
    let style = "";
    for (const [k, v] of Object.entries(props)) {
      if (v == null || k === "key" || typeof v === "function") continue;
      const name = SVG_ATTRS[k] || k;
      if ((k === "fill" || k === "stroke") && paint(v) !== v) { style += `${name}:${paint(v)};`; continue; }
      attrs += ` ${name}="${esc(v)}"`;
    }
    if (style) attrs += ` style="${style}"`;
    return `<${type}${attrs}>${this.inner(children, { ...ctx, svg: true })}</${type}>`;
  }
}

function boxStyle(p, cls) {
  const st = [];
  if (p.border) cls.push(typeof p.border === "object" && p.border.color === "info" ? "bd bd-accent" : "bd");
  if (p.radius) cls.push("r-" + p.radius);
  if (p.background) {
    const token = BACKGROUNDS[String(p.background).replace(/\s+/g, "")];
    if (token) cls.push(token);
    else st.push(`background:${paint(p.background)}`);
  }
  if (p.padding != null) {
    if (typeof p.padding === "object") {
      const v = k => Number(p.padding[k] ?? 0) || 0;
      const y = Number(p.padding.y ?? 0) || 0, x = Number(p.padding.x ?? 0) || 0;
      const side = (k, d) => `calc(${p.padding[k] != null ? v(k) : d} * var(--pu))`;
      st.push(`padding:${side("top", y)} ${side("right", x)} ${side("bottom", y)} ${side("left", x)}`);
    } else st.push(`--p:${Number(p.padding) || 0}`);
  }
  if (p.gap != null) st.push(`--g:${Number(p.gap) || 0}`);
  if (p.align) cls.push("ai-" + p.align);
  if (p.justify) cls.push("jc-" + p.justify);
  if (p.flex) st.push(`flex:${Number(p.flex) || 1} 1 0%`);
  if (p.width) st.push(`width:${p.width}`);
  if (p.height) st.push(`height:${p.height}`);
  if (p.size) st.push(`width:${p.size};height:${p.size};flex:none`);
  if (p.maxHeight) st.push(`max-height:${p.maxHeight}`);
  if (p.scrollable) cls.push("scroll");
  if (p.clip) cls.push("clip");
  if (p.wrap) cls.push("wrap");
  return st.length ? ` style="${esc(st.join(";"))}"` : "";
}

// An empty box still draws something when it has a fill, an edge, or a size (bars, swatches).
const visual = p => Boolean(p.background || p.border || p.height || p.width || p.size);

const TEXT_COLOR = { secondary: "c-muted", tertiary: "c-faint", success: "c-success", danger: "c-danger", info: "c-accent", warning: "c-warning" };

function textClasses(p, cls) {
  if (p.color && TEXT_COLOR[p.color]) cls.push(TEXT_COLOR[p.color]);
  if (p.size === "sm" || p.size === "xs" || p.size === "2xs") cls.push("s-" + p.size);
  if (p.weight === "medium" || p.weight === "semibold" || p.weight === "bold") cls.push("w-strong");
  if (p.textAlign === "center") cls.push("ta-c");
  if (p.textAlign === "end") cls.push("ta-e");
  if (p.tabularNums) cls.push("num");
  if (p.preserveWhitespace) cls.push("pre");
  // maxLines is not applied: the original showed the full prompt once sent, and the site has no send step.
  return cls;
}

// Accessible name for a control: the text just before it, or the nearest text above it.
function nameFrom(ctx) {
  const prev = ctx.prev;
  let t = prev && typeof prev === "object" && !isType(prev, "label") ? squeeze(textOf(prev)) : "";
  if (!t || t.length > 200) t = ctx.near || "";
  return t && t.length <= 200 ? t : "";
}

// data-* hook for a handler id; nothing when the control has no callback.
const on = (name, h) => (h == null ? "" : ` data-${name}="${h}"`);

const isBadgeRow = n => isType(n, "row") && flatten(n.children).length > 0 && flatten(n.children).every(c => isType(c, "badge"));

const ELEMENTS = {
  title(p, children, ctx) {
    const body = this.inner(children, { ...ctx, phrasing: true });
    const cls = textClasses(p, []);
    if (ctx.top) {
      let level = p.size === "md" ? 3 : 2;
      if ((p.size === "xl" || p.size === "2xl") && !this.h1Done) { level = 1; this.h1Done = true; }
      if (level === 2) {
        const id = "sec-" + ++this.headingCount;
        this.toc.push({ id, text: squeeze(textOf({ children })) });
        return `<h2 id="${id}"${cls.length ? ` class="${cls.join(" ")}"` : ""}>${body}</h2>`;
      }
      return `<h${level}${cls.length ? ` class="${cls.join(" ")}"` : ""}>${body}</h${level}>`;
    }
    cls.unshift("u-title", "t-" + (p.size || "md"));
    const tag = ctx.phrasing ? "span" : "p";
    return `<${tag} class="${cls.join(" ")}">${body}</${tag}>`;
  },

  text(p, children, ctx) {
    const cls = textClasses(p, ["u-text"]);
    const style = [];
    if (p.width) style.push(`width:${p.width};flex:none`);
    const st = style.length ? ` style="${esc(style.join(";"))}"` : "";
    const body = this.inner(children, { ...ctx, phrasing: true, pre: ctx.pre || Boolean(p.preserveWhitespace) });
    if (!body.trim() && !p.width) return "";
    if (ctx.top && cls.length === 1 && !st) return `<p>${body}</p>`;
    const tag = p.inline || ctx.phrasing ? "span" : "p";
    return `<${tag} class="${cls.join(" ")}"${st}>${body}</${tag}>`;
  },

  bold(p, children, ctx) { return `<strong>${this.inner(children, { ...ctx, phrasing: true })}</strong>`; },
  italic(p, children, ctx) { return `<em>${this.inner(children, { ...ctx, phrasing: true })}</em>`; },

  box(p, children, ctx) {
    const cls = ["u-box"];
    const st = boxStyle(p, cls);
    const body = this.inner(children, ctx);
    if (!body.trim() && !visual(p)) return "";
    const tag = ctx.phrasing ? "span" : "div";
    return `<${tag} class="${cls.join(" ")}"${st}>${body}</${tag}>`;
  },

  row(p, children, ctx) {
    const cls = ["u-row"];
    if (p.gap == null) cls.push("g0");
    const st = boxStyle(p, cls);
    const body = this.inner(children, ctx);
    if (!body.trim() && !visual(p)) return "";
    const tag = ctx.phrasing ? "span" : "div";
    return `<${tag} class="${cls.join(" ")}"${st}>${body}</${tag}>`;
  },

  grid(p, children, ctx) {
    const cols = Math.max(1, Math.min(6, Number(p.columns) || 2));
    const items = flatten(children).map(n => this.resolve(n, ctx.path)).flat();
    const cls = ["u-grid", "c" + cols];
    // Keep the columns on phones when the grid is a matrix between axis badges,
    // or when every cell is a short label (e.g. a team of three named roles).
    const sib = ctx.siblings || [];
    let a = ctx.index ?? 0, b = ctx.index ?? 0;
    while (a > 0 && isType(sib[a - 1], "grid")) a--;
    while (b < sib.length - 1 && isType(sib[b + 1], "grid")) b++;
    const matrix = isBadgeRow(sib[a - 1]) || isBadgeRow(sib[b + 1]);
    const short = items.length > 0 && items.every(it => squeeze(textOf(it)).length <= 16);
    if (matrix || short) cls.push("keep");
    const st = p.gap != null ? ` style="--g:${Number(p.gap) || 0}"` : "";
    const body = this.list(items, { ...ctx, top: false, path: ctx.path + "g" });
    return body.trim() ? `<div class="${cls.join(" ")}"${st}>${body}</div>` : "";
  },

  "grid-item"(p, children, ctx) {
    const body = this.inner(children, ctx);
    return body.trim() ? `<div class="u-gi">${body}</div>` : "";
  },

  list(p, children, ctx) {
    const tag = p.marker === "number" ? "ol" : "ul";
    const cls = ["u-list"];
    if (p.connector) cls.push("steps");
    const st = p.gap != null ? ` style="--g:${Number(p.gap) || 0}"` : "";
    return `<${tag} class="${cls.join(" ")}"${st}>${this.inner(children, ctx)}</${tag}>`;
  },

  "list-item"(p, children, ctx) { return `<li>${this.inner(children, ctx)}</li>`; },

  table(p, children, ctx) {
    const rows = flatten(children).map(n => this.resolve(n, ctx.path)).flat().filter(r => isType(r, "table-row"));
    const cellsOf = r => flatten(r.children).map(n => this.resolve(n, ctx.path)).flat().filter(c => isType(c, "table-cell"));
    let head = "";
    let body = "";
    rows.forEach((r, i) => {
      const cells = cellsOf(r);
      const isHead = i === 0 && cells.length && cells.every(c => c.props.header);
      const html = cells.map(c => {
        const cls = [];
        if (c.props.align === "end") cls.push("ta-e", "num");
        const st = c.props.width ? ` style="width:${esc(c.props.width)}"` : "";
        const attr = (cls.length ? ` class="${cls.join(" ")}"` : "") + st;
        const inner = this.inner(c.children, ctx);
        if (isHead) return `<th scope="col"${attr}>${inner}</th>`;
        if (c.props.header) return `<th scope="row"${attr}>${inner}</th>`;
        return `<td${attr}>${inner}</td>`;
      }).join("");
      if (isHead) head += `<tr>${html}</tr>`; else body += `<tr>${html}</tr>`;
    });
    return `<div class="u-table"><table>${head ? `<thead>${head}</thead>` : ""}<tbody>${body}</tbody></table></div>`;
  },

  caption(p, children, ctx) {
    const cls = ["u-caption"];
    if (p.textAlign === "center") cls.push("ta-c");
    const tag = ctx.phrasing ? "span" : "p";
    return `<${tag} class="${cls.join(" ")}">${this.inner(children, { ...ctx, phrasing: true })}</${tag}>`;
  },

  blockquote(p, children, ctx) { return `<blockquote class="u-quote">${this.inner(children, ctx)}</blockquote>`; },

  divider() { return `<hr class="u-hr">`; },

  badge(p, children, ctx) {
    return `<span class="u-badge${p.color ? " b-" + esc(p.color) : ""}">${this.inner(children, { ...ctx, phrasing: true })}</span>`;
  },

  label(p, children, ctx) {
    const id = "lb-" + ctx.path.replace(/[^0-9a-z]+/gi, "-");
    this.lastLabelId = id;
    return `<p class="u-label" id="${id}">${this.inner(children, { ...ctx, phrasing: true })}</p>`;
  },

  icon(p) {
    let name = String(p.name || "");
    name = ICON_ALIASES[name] || name;
    if (!name) return "";
    const cls = ["u-icon", "i-" + (p.size || "md")];
    if (p.color && TEXT_COLOR[p.color]) cls.push(TEXT_COLOR[p.color]);
    if (p.inline) cls.push("inline");
    return `<svg class="${cls.join(" ")}" aria-hidden="true" focusable="false"><use href="${this.assets}icons.svg#${esc(name)}"></use></svg>`;
  },

  "radio-group"(p, children, ctx) {
    const name = "g" + ++this.groupCount;
    const h = this.handler(p.onChange);
    const radios = flatten(children).map(n => this.resolve(n, ctx.path)).flat().filter(r => isType(r, "radio"));
    const items = radios.map(r => {
      const v = String(r.props.value);
      const on = String(p.value) === v;
      return `<label class="u-choice"><input type="radio" name="${name}" value="${esc(v)}"${on ? " checked" : ""}>` +
        `<span>${this.inner(r.children, { ...ctx, phrasing: true })}</span></label>`;
    }).join("");
    const label = nameFrom(ctx);
    return `<div class="u-choices" role="radiogroup"${label ? ` aria-label="${esc(label)}"` : ""}${on("change", h)}>${items}</div>`;
  },

  "segmented-control"(p, children, ctx) {
    const name = "g" + ++this.groupCount;
    const h = this.handler(p.onChange);
    const options = Array.isArray(p.options) ? p.options : [];
    const items = options.map(o => {
      const v = typeof o === "object" ? String(o.value) : String(o);
      const label = typeof o === "object" ? (o.label ?? o.value) : o;
      return `<label class="u-seg-item"><input type="radio" name="${name}" value="${esc(v)}"${String(p.value) === v ? " checked" : ""}><span>${esc(label)}</span></label>`;
    }).join("");
    const label = nameFrom(ctx);
    return `<div class="u-seg" role="radiogroup"${label ? ` aria-label="${esc(label)}"` : ""}${on("change", h)}>${items}</div>`;
  },

  slider(p, children, ctx) {
    const h = this.handler(p.onChange);
    let name = "";
    let valuetext = "";
    if (ctx.labelId) {
      name = ` aria-labelledby="${ctx.labelId}"`;
      // The original shows the current value next to the label: announce that, not the raw number.
      const prev = ctx.prev;
      if (prev && typeof prev === "object" && !isType(prev, "label")) {
        const all = flatten(prev.children);
        valuetext = squeeze(all.filter(c => !isType(c, "label")).map(textOf).join(" "));
      }
    } else {
      const t = nameFrom(ctx);
      if (t) name = ` aria-label="${esc(t)}"`;
    }
    const marks = Array.isArray(p.marks) && p.marks.length
      ? `<div class="u-marks" aria-hidden="true">${p.marks.map(m => `<span>${esc(typeof m === "object" ? (m.label ?? m.value) : m)}</span>`).join("")}</div>` : "";
    return `<div class="u-slider"><input type="range" min="${esc(p.min ?? 0)}" max="${esc(p.max ?? 100)}" step="${esc(p.step ?? 1)}" value="${esc(p.value ?? 0)}"${name}${valuetext ? ` aria-valuetext="${esc(valuetext)}"` : ""}${on("input", h)} data-kind="number">${marks}</div>`;
  },

  textarea(p, children, ctx) {
    const h = this.handler(p.onChange);
    const t = nameFrom(ctx);
    const name = ctx.labelId ? ` aria-labelledby="${ctx.labelId}"` : t ? ` aria-label="${esc(t)}"` : p.placeholder ? ` aria-label="${esc(p.placeholder)}"` : "";
    // The newline after the start tag is dropped by the HTML parser, so a value that begins with one survives.
    return `<textarea class="u-field" rows="${esc(p.rows || 3)}"${p.placeholder ? ` placeholder="${esc(p.placeholder)}"` : ""}${name}${on("input", h)}>\n${esc(p.value ?? "")}</textarea>`;
  },

  input(p, children, ctx) {
    const h = this.handler(p.onChange);
    const t = nameFrom(ctx);
    const name = ctx.labelId ? ` aria-labelledby="${ctx.labelId}"` : t ? ` aria-label="${esc(t)}"` : p.placeholder ? ` aria-label="${esc(p.placeholder)}"` : "";
    return `<input class="u-field" type="text" value="${esc(p.value ?? "")}"${p.placeholder ? ` placeholder="${esc(p.placeholder)}"` : ""}${name}${on("input", h)}>`;
  },

  checkbox(p, children, ctx) {
    const h = this.handler(p.onChange);
    const done = p.lineThrough && p.checked ? " done" : "";
    return `<label class="u-check${done}"><input type="checkbox"${p.checked ? " checked" : ""}${on("check", h)}>` +
      `<span>${this.inner(children, { ...ctx, phrasing: true })}</span></label>`;
  },

  button(p, children, ctx) {
    // Buttons that open a new ChatGPT turn are replaced by a site note in list().
    if (typeof p.onClick === "function" && /GenUI\.issueNewTurn/.test(String(p.onClick))) return "";
    const h = this.handler(p.onClick);
    const cls = ["u-btn"];
    cls.push(p.variant === "outline" ? "outline" : "solid");
    if (p.color === "secondary") cls.push("quiet");
    if (p.block) cls.push("block");
    if (p.size === "sm") cls.push("small");
    return `<button type="button" class="${cls.join(" ")}"${p.disabled ? " disabled" : ""}${on("click", h)}>${this.inner(children, { ...ctx, phrasing: true })}</button>`;
  },

  pressable(p, children, ctx) {
    const h = this.handler(p.onClick);
    const cls = ["u-press"];
    const st = boxStyle(p, cls);
    // In lesson 7 a pressable reveals the detail that follows it in the same box.
    const expanded = ctx.next != null;
    return `<button type="button" class="${cls.join(" ")}"${st} aria-expanded="${expanded}"${on("click", h)}>${this.inner(children, { ...ctx, phrasing: true })}</button>`;
  },

  math(p) {
    const v = String(p.value || "");
    return `<div class="u-math" role="math" aria-label="${esc(mathText(v))}">${mathHTML(v)}</div>`;
  },

  svg(p, children, ctx) {
    let attrs = "";
    for (const [k, v] of Object.entries(p)) {
      if (v == null || k === "key" || k === "xmlns") continue;
      attrs += ` ${SVG_ATTRS[k] || k}="${esc(v)}"`;
    }
    const words = [];
    const collect = n => {
      if (isType(n, "text")) { const t = squeeze(textOf(n)); if (t) words.push(t); return; }
      if (n && typeof n === "object" && n.children) flatten(n.children).forEach(collect);
    };
    const items = flatten(children).map((n, i) => this.resolve(n, ctx.path + ".s" + i)).flat();
    items.forEach(collect);
    const role = words.length ? ` role="img" aria-label="${esc(words.join(", "))}"` : ` aria-hidden="true" focusable="false"`;
    return `<div class="u-figure"><svg xmlns="http://www.w3.org/2000/svg"${attrs}${role}>` +
      `${this.list(items, { ...ctx, top: false, svg: true, path: ctx.path + ".s" })}</svg></div>`;
  },

  __chatgptClientDefinedWidget(p) {
    const n = Number(String(p.key || "cdw:0").split(":")[1] || 0);
    const chart = (this.data.widgets || [])[n];
    return chart ? renderChart(chart, n, this.chartWidths[n]) : "";
  }
};

const ICON_ALIASES = {
  "check-circle": "circle-check", "alert-triangle": "triangle-alert", "alert-circle": "circle-alert",
  "pause-circle": "circle-pause", "help-circle": "circle-help", "x-circle": "circle-x"
};

// Charts from the original's chart widgets (bar and line), drawn at the width they are shown at.
function niceTicks(min, max) {
  const span = max - min || 1;
  const step = [1, 2, 2.5, 5, 10].map(m => m * 10 ** Math.floor(Math.log10(span / 4))).find(s => span / s <= 5) || span / 4;
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}

function fmt(v) {
  return Number.isInteger(v) ? String(v) : String(+v.toFixed(2));
}

export function renderChart(c, index = 0, width = 640) {
  const data = c.data || [];
  const series = c.series || [];
  const W = Math.max(280, Math.round(width || 640));
  const narrow = W < 480;
  const L = narrow ? 50 : 60, R = 14, T = 22;
  // Category labels: one line when they fit the band, two lines split at a space when they don't,
  // and every other label when even half a label is too wide.
  const FS = 13.5;
  const textW = s => [...String(s)].reduce((w, ch) => w + (/[ᄀ-ᇿ㄰-㆏가-힣一-鿿]/.test(ch) ? FS : FS * 0.58), 0);
  const band = (W - L - R) / Math.max(1, data.length);
  const split = s => {
    const words = String(s).split(" ");
    if (words.length < 2) return [String(s)];
    let best = [String(s)], worst = Infinity;
    for (let k = 1; k < words.length; k++) {
      const a = words.slice(0, k).join(" "), b = words.slice(k).join(" ");
      const w = Math.max(textW(a), textW(b));
      if (w < worst) { worst = w; best = [a, b]; }
    }
    return best;
  };
  const labels = data.map(d => String(d[c.xKey] ?? ""));
  const fits = ls => ls.every(l => textW(l) <= band - 6);
  let lines = labels.map(l => [l]);
  if (!fits(labels)) lines = labels.map(split);
  const twoLines = lines.some(l => l.length > 1);
  const thin = !lines.every(l => fits(l));
  const B = twoLines ? 58 : 40;
  const H = (narrow ? 250 : 300) + (twoLines ? 18 : 0);
  const values = data.flatMap(d => series.map(s => Number(d[s.dataKey]))).filter(Number.isFinite);
  const axis = (c.axes || []).find(a => a.dimension === "y");
  let min = c.yAxisMin ?? (axis && axis.domain ? axis.domain[0] : Math.min(0, ...values));
  let max = c.yAxisMax ?? (axis && axis.domain ? axis.domain[1] : Math.max(...values));
  const ticks = axis && axis.ticks && axis.ticks.length ? axis.ticks.map(t => t.value) : niceTicks(min, max);
  min = Math.min(min, ...ticks);
  max = Math.max(max, ...ticks);
  const suffix = (series[0] && series[0].valueSuffix) || "";
  const y = v => T + (H - T - B) * (1 - (v - min) / (max - min || 1));
  const bandW = (W - L - R) / Math.max(1, data.length);
  const x = i => L + bandW * (i + 0.5);
  let svg = "";
  for (const t of ticks) {
    svg += `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" class="ch-grid"/>`;
    svg += `<text x="${L - 8}" y="${y(t) + 4}" text-anchor="end" class="ch-tick">${esc(fmt(t) + suffix)}</text>`;
  }
  lines.forEach((ls, i) => {
    if (thin && i % 2 === 1 && i !== lines.length - 1) return;
    const tspans = ls.map((l, k) => `<tspan x="${x(i)}" dy="${k ? 16 : 0}">${esc(l)}</tspan>`).join("");
    svg += `<text x="${x(i)}" y="${H - B + 22}" text-anchor="middle" class="ch-label">${tspans}</text>`;
  });
  if (c.chartType === "bar") {
    const s = series[0];
    const bw = Math.min(72, bandW * 0.5);
    data.forEach((d, i) => {
      const v = Number(d[s.dataKey]);
      svg += `<rect x="${x(i) - bw / 2}" y="${y(v)}" width="${bw}" height="${Math.max(0, y(min) - y(v))}" rx="3" class="ch-bar"/>`;
      svg += `<text x="${x(i)}" y="${y(v) - 8}" text-anchor="middle" class="ch-value">${esc(fmt(v) + (s.valueSuffix || ""))}</text>`;
    });
  } else {
    series.forEach((s, si) => {
      const pts = data.map((d, i) => [x(i), y(Number(d[s.dataKey]))]);
      svg += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" class="ch-line s${si}"/>`;
      pts.forEach(([px, py]) => { svg += `<circle cx="${px}" cy="${py}" r="4.5" class="ch-dot s${si}"/>`; });
    });
    // Value labels: one label when the series meet; otherwise the higher point labels above, the lower below.
    data.forEach((d, i) => {
      const vals = series.map(s => Number(d[s.dataKey]));
      if (series.length > 1 && vals.every(v => v === vals[0])) {
        svg += `<text x="${x(i)}" y="${y(vals[0]) - 11}" text-anchor="middle" class="ch-value">${esc(fmt(vals[0]) + (series[0].valueSuffix || ""))}</text>`;
        return;
      }
      const top = vals.indexOf(Math.max(...vals));
      series.forEach((s, si) => {
        const above = series.length === 1 || si === top;
        svg += `<text x="${x(i)}" y="${above ? y(vals[si]) - 11 : y(vals[si]) + 21}" text-anchor="middle" class="ch-value s${si}">${esc(fmt(vals[si]) + (s.valueSuffix || ""))}</text>`;
      });
    });
  }
  const legend = series.length > 1
    ? `<p class="ch-legend">${series.map((s, i) => `<span class="s${i}"><svg viewBox="0 0 22 4" aria-hidden="true" focusable="false"><line x1="0" y1="2" x2="22" y2="2"/></svg>${esc(s.label)}</span>`).join("")}</p>` : "";
  const label = series.map(s => s.label).join(", ");
  const rows = data.map(d => `<tr><th scope="row">${esc(d[c.xKey])}</th>${series.map(s => `<td>${esc(fmt(Number(d[s.dataKey])) + (s.valueSuffix || ""))}</td>`).join("")}</tr>`).join("");
  const table = `<div class="sr-only"><table><caption>${esc(label)}</caption><thead><tr><th scope="col"></th>${series.map(s => `<th scope="col">${esc(s.label)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
  const footer = c.meta && c.meta.footer ? `<figcaption class="u-caption">${esc(c.meta.footer)}</figcaption>` : "";
  const title = series.length === 1 ? `<p class="ch-title">${esc(series[0].label)}</p>` : "";
  return `<figure class="u-chart" data-chart="${index}">${title}${legend}<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">${svg}</svg>${table}${footer}</figure>`;
}

// Browser: render into `root`, then re-render on every state change.
export function mount(root, data, options = {}) {
  const status = options.status;
  const say = text => {
    if (!status || !text) return;
    status.textContent = "";
    setTimeout(() => { status.textContent = text; }, 40);
  };
  let lastControl = null;
  // After a copy, the result is said next to the button for a few seconds and to assistive tech.
  const copied = ok => {
    const msg = ok ? "복사했습니다. ChatGPT 등 원하는 곳에 붙여 넣으세요." : "복사하지 못했습니다. 내용을 직접 선택해 복사해 주세요.";
    say(msg);
    const btn = lastControl;
    if (!btn || !btn.isConnected) return;
    const note = document.createElement("span");
    note.className = "u-copied" + (ok ? "" : " failed");
    note.setAttribute("aria-hidden", "true");
    note.textContent = msg;
    btn.insertAdjacentElement("afterend", note);
    setTimeout(() => note.remove(), 4000);
  };
  const lesson = new Lesson(data, {
    assets: options.assets,
    onCopy(text) {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => copied(true), () => copied(fallbackCopy(text)));
      else copied(fallbackCopy(text));
    }
  });
  lesson.failedImages = new Set();

  const blockOf = el => { let b = el; while (b && b.parentNode !== root) b = b.parentNode; return b; };
  const focusable = "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]";

  let queued = false;
  const paintNow = () => {
    queued = false;
    const active = document.activeElement;
    const had = active && active !== root && root.contains(active);
    const info = had ? { tag: active.tagName, text: (active.textContent || "").trim(), block: blockOf(active), index: [...root.children].indexOf(blockOf(active)) } : null;
    const { html } = lesson.render();
    const t = document.createElement("template");
    t.innerHTML = html;
    morphChildren(root, t.content);
    if (info && (!active.isConnected || active.disabled || !root.contains(active))) {
      const block = info.block && info.block.isConnected ? info.block : root.children[info.index];
      const scope = block || root;
      const same = [...scope.querySelectorAll(info.tag)].find(el => !el.disabled && (el.textContent || "").trim() === info.text);
      const target = same || scope.querySelector(focusable);
      (target || root).focus({ preventScroll: true });
    }
  };
  // Repaint once per frame, so fast typing or a slider drag renders the page only once per frame.
  lesson.invalidate = () => { if (!queued) { queued = true; requestAnimationFrame(paintNow); } };
  paintNow();

  // Charts are drawn at their shown width so their labels stay readable on phones.
  const measureCharts = () => {
    let changed = false;
    root.querySelectorAll(".u-chart[data-chart]").forEach(fig => {
      const n = Number(fig.dataset.chart);
      const w = Math.round(fig.clientWidth);
      if (w && Math.abs((lesson.chartWidths[n] || 640) - w) > 2) { lesson.chartWidths[n] = w; changed = true; }
    });
    if (changed) lesson.invalidate();
  };
  measureCharts();
  if ("ResizeObserver" in window) {
    let frame = 0;
    new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measureCharts); }).observe(root);
  }

  // Announce what a choice or button reveals in its block (feedback, results), once.
  const linesOf = el => new Set((el ? el.innerText : "").split("\n").map(s => s.trim()).filter(Boolean));
  // For sliders the "before" state is taken when a burst of moves starts, so feedback that
  // appears midway through a drag is still announced; each slider has its own timer.
  const pending = new Map();
  const act = (el, fn, delay) => {
    const block = blockOf(el);
    const index = [...root.children].indexOf(block);
    const held = delay && pending.get(el);
    const before = held ? held.before : linesOf(block);
    fn();
    const report = () => {
      pending.delete(el);
      const now = block && block.isConnected ? block : root.children[index];
      const fresh = [...linesOf(now)].filter(s => !before.has(s) && !/^복사(했습니다|하지 못했습니다)/.test(s));
      const text = fresh.join(" ");
      if (text) say(text.length > 300 ? text.slice(0, 298) + "…" : text);
    };
    if (delay) {
      if (held) clearTimeout(held.timer);
      pending.set(el, { before, timer: setTimeout(report, delay) });
    } else setTimeout(report, 32);
  };

  const call = (id, value) => {
    if (id == null || id === "") return;
    const fn = lesson.handlers[Number(id)];
    if (fn) fn(value);
  };
  root.addEventListener("click", e => {
    const el = e.target.closest("[data-click]");
    if (el && root.contains(el) && !el.disabled) { lastControl = el; act(el, () => call(el.dataset.click)); }
  });
  root.addEventListener("change", e => {
    const t = e.target;
    if (t.matches("[data-check]")) return act(t, () => call(t.dataset.check, t.checked));
    const group = t.closest("[data-change]");
    if (group && t.type === "radio") act(t, () => call(group.dataset.change, t.value));
  });
  root.addEventListener("input", e => {
    const t = e.target;
    if (!t.matches("[data-input]")) return;
    const value = t.dataset.kind === "number" ? Number(t.value) : t.value;
    if (t.type === "range") act(t, () => call(t.dataset.input, value), 700);
    else call(t.dataset.input, value);
  });
  // An original image that fails to load leaves its caption and source link, with a note.
  // The failure is kept in the lesson's state so later repaints keep it, including failures
  // that happened before this module ran.
  const markFailed = img => {
    if (!img.closest(".u-image")) return;
    lesson.failedImages.add(img.getAttribute("src"));
    img.closest(".u-image").classList.add("is-missing");
  };
  root.addEventListener("error", e => { if (e.target.tagName === "IMG") markFailed(e.target); }, true);
  root.querySelectorAll(".u-image img").forEach(img => { if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) markFailed(img); });
  return lesson;
}

// Marks the lesson section in view in the left rail.
export function railSpy(rail, root) {
  if (!rail || !("IntersectionObserver" in window)) return;
  const links = new Map([...rail.querySelectorAll('a[href^="#sec-"]')].map(a => [a.getAttribute("href").slice(1), a]));
  const visible = new Set();
  const update = () => {
    const first = [...root.querySelectorAll("h2[id]")].find(h => visible.has(h.id));
    if (!first) return;
    links.forEach((a, id) => {
      const on = id === first.id;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
    });
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => (en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id)));
    update();
  }, { rootMargin: "0px 0px -60% 0px" });
  root.querySelectorAll("h2[id]").forEach(h => io.observe(h));
}

// Copies through a hidden textarea; returns whether the browser reported success and gives focus back.
function fallbackCopy(text) {
  const back = document.activeElement;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  ta.remove();
  if (back && back.focus) back.focus({ preventScroll: true });
  return ok;
}

// Patch the live DOM to match a freshly rendered tree, keeping nodes (and focus) where it can.
const kind = n => (n.nodeType === 1 ? n.nodeName + "." + ((n.getAttribute("class") || "").split(" ")[0]) : "#" + n.nodeType);

function morphChildren(from, to) {
  const b = [...to.childNodes];
  let i = 0;
  for (let j = 0; j < b.length; j++) {
    const y = b[j];
    let x = from.childNodes[i];
    if (!x) { from.appendChild(y); i++; continue; }
    if (kind(x) !== kind(y)) {
      const x2 = from.childNodes[i + 1];
      if (x2 && kind(x2) === kind(y) && !(b[j + 1] && kind(b[j + 1]) === kind(x))) {
        x.remove();           // a node disappeared before y
        x = x2;
      } else if (b[j + 1] && kind(b[j + 1]) === kind(x)) {
        from.insertBefore(y, x);  // y is new
        i++;
        continue;
      } else {
        from.replaceChild(y, x);
        i++;
        continue;
      }
    }
    if (x.nodeType === 3 || x.nodeType === 8) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; }
    else morphElement(x, y);
    i++;
  }
  while (from.childNodes.length > i) from.lastChild.remove();
}

function morphElement(x, y) {
  // A textarea's inline style is the reader's own resize; keep it.
  for (const { name } of [...x.attributes]) if (!y.hasAttribute(name) && !(name === "style" && x.nodeName === "TEXTAREA")) x.removeAttribute(name);
  for (const { name, value } of [...y.attributes]) if (x.getAttribute(name) !== value) x.setAttribute(name, value);
  if (x.nodeName === "INPUT") {
    if (x.type === "radio" || x.type === "checkbox") x.checked = y.hasAttribute("checked");
    else { const v = y.getAttribute("value") ?? ""; if (x.value !== v) x.value = v; }
    return;
  }
  if (x.nodeName === "TEXTAREA") {
    const v = y.value;
    if (x.value !== v) x.value = v;
    return;
  }
  if (x.nodeName === "BUTTON") x.disabled = y.hasAttribute("disabled");
  morphChildren(x, y);
}

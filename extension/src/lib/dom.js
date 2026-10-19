// A few DOM helpers. API data only ever reaches the page as text (textContent,
// attributes); markup is used for the extension's own icons and nothing else.

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "class") el.className = value;
      else if (key === "text") el.textContent = value;
      else if (key === "style") el.style.cssText = value;
      else if (key === "dataset") Object.assign(el.dataset, value);
      else if (key.startsWith("on") && typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
      else if (value === true) el.setAttribute(key, "");
      else el.setAttribute(key, String(value));
    }
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : String(child));
  }
  return el;
}

export function fill(el, ...children) {
  el.replaceChildren();
  return append(el, children);
}

/** One of the extension's own icons (lib/icons.js), never data. */
export function icon(markup, className = "icon") {
  const t = document.createElement("template");
  t.innerHTML = markup.trim();
  const el = t.content.firstElementChild;
  el.setAttribute("class", className);
  el.setAttribute("aria-hidden", "true");
  return el;
}

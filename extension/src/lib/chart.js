// Rate charts drawn as plain SVG: a line over a soft fill, the range's opening
// rate as a dashed reference (as Stocks does), and a scrub cursor that follows
// the pointer or the arrow keys.

const NS = "http://www.w3.org/2000/svg";

export const RANGES = [
  ["1W", 7],
  ["1M", 30],
  ["3M", 91],
  ["6M", 182],
  ["1Y", 365],
];

/** The points inside the last `days` days of a [date, rate] series. */
export function sliceRange(points, days) {
  if (!points?.length) return [];
  const cutoff = Date.parse(points[points.length - 1][0]) - days * 86_400_000;
  return points.filter(([date]) => Date.parse(date) >= cutoff);
}

export function rangeStats(points) {
  if (points.length < 2) return null;
  let hi = points[0];
  let lo = points[0];
  for (const p of points) {
    if (p[1] > hi[1]) hi = p;
    if (p[1] < lo[1]) lo = p;
  }
  const first = points[0][1];
  const last = points[points.length - 1][1];
  return { hi, lo, first, last, changePct: ((last - first) / first) * 100 };
}

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

let gradientId = 0;

/**
 * @param points [date, rate][], oldest first
 * @param opts { width, height, interactive, label, onHover(point | null) }
 */
export function lineChart(points, { width, height, interactive = true, label = "", onHover } = {}) {
  const stats = rangeStats(points);
  const tone = !stats ? "flat" : stats.changePct >= 0 ? "up" : "down";
  const svg = el("svg", {
    viewBox: `0 0 ${width} ${height}`,
    class: `chart chart--${tone}${interactive ? " chart--interactive" : ""}`,
    role: "img",
    "aria-label": label,
    preserveAspectRatio: "none",
  });
  if (!stats) return svg;

  const rates = points.map((p) => p[1]);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const span = max - min || max * 0.002 || 1;
  const padY = interactive ? 12 : 3;
  const x = (i) => (i / (points.length - 1)) * width;
  const y = (v) => padY + (1 - (v - min) / span) * (height - padY * 2);

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(p[1]).toFixed(2)}`).join("");
  const id = `fill${++gradientId}`;
  const defs = el("defs");
  const grad = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 });
  grad.append(
    el("stop", { offset: "0%", "stop-color": "currentColor", "stop-opacity": interactive ? 0.22 : 0.16 }),
    el("stop", { offset: "100%", "stop-color": "currentColor", "stop-opacity": 0 }),
  );
  defs.append(grad);
  svg.append(defs, el("path", { d: `${line}L${width},${height}L0,${height}Z`, fill: `url(#${id})`, stroke: "none" }));

  if (interactive) {
    const base = y(stats.first).toFixed(2);
    svg.append(el("line", { x1: 0, x2: width, y1: base, y2: base, class: "chart-base" }));
  }
  svg.append(el("path", { d: line, class: "chart-line", "vector-effect": "non-scaling-stroke" }));
  if (!interactive) return svg;

  const cursor = el("g", { class: "chart-cursor", visibility: "hidden" });
  const rule = el("line", { y1: 0, y2: height, class: "chart-rule", "vector-effect": "non-scaling-stroke" });
  const dot = el("circle", { r: 3.5, class: "chart-dot" });
  cursor.append(rule, dot);
  svg.append(cursor);

  let active = -1;
  const move = (i) => {
    active = Math.max(0, Math.min(points.length - 1, i));
    const cx = x(active).toFixed(2);
    rule.setAttribute("x1", cx);
    rule.setAttribute("x2", cx);
    dot.setAttribute("cx", cx);
    dot.setAttribute("cy", y(points[active][1]).toFixed(2));
    cursor.setAttribute("visibility", "visible");
    onHover?.(points[active]);
  };
  const leave = () => {
    active = -1;
    cursor.setAttribute("visibility", "hidden");
    onHover?.(null);
  };

  svg.setAttribute("tabindex", "0");
  svg.addEventListener("pointermove", (e) => {
    const box = svg.getBoundingClientRect();
    move(Math.round(((e.clientX - box.left) / box.width) * (points.length - 1)));
  });
  svg.addEventListener("pointerleave", leave);
  svg.addEventListener("blur", leave);
  svg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const step = e.shiftKey ? 7 : 1;
      move((active < 0 ? points.length - 1 : active) + (e.key === "ArrowLeft" ? -step : step));
    } else if (e.key === "Escape") {
      leave();
    }
  });
  return svg;
}

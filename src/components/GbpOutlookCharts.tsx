"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas charts for the GBP outlook data-story. Kept dependency-free (raw
 * canvas, no chart lib) to avoid bundle weight, and reads its colours from the
 * page's CSS custom properties so it tracks the site design tokens + theme.
 */

export interface ProviderPoint {
  provider: string;
  receiveAmount: number;
}

function useCssVars() {
  // Resolve tokens at draw time so light/dark + brand colours stay in sync.
  return () => {
    const cs = getComputedStyle(document.documentElement);
    const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    return {
      primary: v("--color-primary", "#1a73e8"),
      ink: v("--color-on-surface", "#202124"),
      faint: v("--color-on-surface-variant", "#5f6368"),
      outline: v("--color-outline", "#dadce0"),
      surface: v("--color-surface-dim", "#f8f9fa"),
      up: "#1e7d5a",
      down: "#b3413a",
    };
  };
}

const DPR = () => Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);

function setup(cv: HTMLCanvasElement, cssH: number) {
  const dpr = DPR();
  const w = cv.clientWidth || 700;
  cv.width = w * dpr;
  cv.height = cssH * dpr;
  cv.style.height = `${cssH}px`;
  const ctx = cv.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return { ctx, w, h: cssH };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const MONO = "12px 'SF Mono', Menlo, Consolas, monospace";

/** Figure 1 — GBP/USD fluctuation timeline, Jan–Jul 2026. */
export function FluctuationChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const vars = useCssVars();
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const draw = () => {
      const c = vars();
      const { ctx, w, h } = setup(cv, 340);
      const data = [
        { m: "Jan", v: 1.3826 },
        { m: "Feb", v: 1.361 },
        { m: "Mar", v: 1.352 },
        { m: "Apr", v: 1.3585 },
        { m: "May", v: 1.341 },
        { m: "Jun", v: 1.3164 },
        { m: "Jul", v: 1.3347 },
      ];
      const avg = 1.3444;
      const padL = 48, padR = 16, padT = 18, padB = 34;
      const min = 1.3, max = 1.39;
      const x = (i: number) => padL + (w - padL - padR) * (i / (data.length - 1));
      const y = (val: number) => padT + (h - padT - padB) * (1 - (val - min) / (max - min));
      ctx.clearRect(0, 0, w, h);
      ctx.font = MONO;
      ctx.textBaseline = "middle";
      for (let g = 1.3; g <= 1.39; g += 0.02) {
        ctx.strokeStyle = c.outline;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, y(g));
        ctx.lineTo(w - padR, y(g));
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = c.faint;
        ctx.textAlign = "right";
        ctx.fillText(g.toFixed(2), padL - 8, y(g));
      }
      ctx.strokeStyle = c.faint;
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, y(avg));
      ctx.lineTo(w - padR, y(avg));
      ctx.stroke();
      ctx.setLineDash([]);
      const grad = ctx.createLinearGradient(0, padT, 0, h - padB);
      grad.addColorStop(0, c.primary + "44");
      grad.addColorStop(1, c.primary + "05");
      ctx.beginPath();
      ctx.moveTo(x(0), y(data[0].v));
      for (let i = 1; i < data.length; i++) ctx.lineTo(x(i), y(data[i].v));
      ctx.lineTo(x(data.length - 1), h - padB);
      ctx.lineTo(x(0), h - padB);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x(0), y(data[0].v));
      for (let i = 1; i < data.length; i++) ctx.lineTo(x(i), y(data[i].v));
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.stroke();
      for (let i = 0; i < data.length; i++) {
        const isEnd = i === data.length - 1;
        const isPeak = data[i].v === 1.3826;
        const isLow = data[i].v === 1.3164;
        ctx.beginPath();
        ctx.arc(x(i), y(data[i].v), isEnd ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isEnd ? c.primary : isPeak ? c.up : isLow ? c.down : c.surface;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isPeak ? c.up : isLow ? c.down : c.primary;
        ctx.stroke();
        ctx.fillStyle = c.faint;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(data[i].m, x(i), h - padB + 8);
        if (isPeak || isLow) {
          ctx.fillStyle = isPeak ? c.up : c.down;
          ctx.textBaseline = "bottom";
          ctx.fillText(data[i].v.toFixed(2), x(i), y(data[i].v) - (isPeak ? 10 : -24));
        }
      }
    };
    draw();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(draw, 150);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [vars]);
  return <canvas ref={ref} className="w-full" aria-label="GBP/USD exchange rate chart, January to July 2026, peaking at 1.3826 and troughing at 1.3164" />;
}

/** Figure 2 — provider spread on the headline corridor (live data). */
export function ProviderSpreadChart({ rows }: { rows: ProviderPoint[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const vars = useCssVars();
  useEffect(() => {
    const cv = ref.current;
    if (!cv || rows.length === 0) return;
    const draw = () => {
      const c = vars();
      const rowH = 26;
      const height = rows.length * rowH + 12;
      const { ctx, w, h } = setup(cv, height);
      const padL = 104, padR = 68, padT = 6, padB = 6, gap = 6;
      const bh = (h - padT - padB - gap * (rows.length - 1)) / rows.length;
      const values = rows.map((r) => r.receiveAmount);
      const hi = Math.max(...values);
      const lo = Math.min(...values);
      const span = hi - lo || 1;
      const chartLo = lo - span * 0.06;
      const chartHi = hi;
      const bw = (v: number) => (w - padL - padR) * ((v - chartLo) / (chartHi - chartLo));
      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = "middle";
      rows.forEach((d, i) => {
        const isBest = d.receiveAmount === hi;
        const isWorst = d.receiveAmount === lo;
        const yy = padT + i * (bh + gap);
        const col = isBest ? c.up : isWorst ? c.down : c.primary;
        ctx.font = "11px 'SF Mono', Menlo, Consolas, monospace";
        ctx.fillStyle = c.ink;
        ctx.textAlign = "right";
        ctx.fillText(d.provider, padL - 10, yy + bh / 2);
        ctx.fillStyle = c.outline;
        ctx.globalAlpha = 0.45;
        roundRect(ctx, padL, yy, w - padL - padR, bh, 4);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = isBest || isWorst ? col : col + "cc";
        roundRect(ctx, padL, yy, Math.max(bw(d.receiveAmount), 4), bh, 4);
        ctx.fill();
        ctx.fillStyle = isBest || isWorst ? col : c.faint;
        ctx.textAlign = "left";
        ctx.font = isBest || isWorst ? "bold 11px 'SF Mono', Menlo, Consolas, monospace" : "11px 'SF Mono', Menlo, Consolas, monospace";
        ctx.fillText("$" + d.receiveAmount.toFixed(2), padL + bw(d.receiveAmount) + 8, yy + bh / 2);
      });
    };
    draw();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(draw, 150);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rows, vars]);
  return <canvas ref={ref} className="w-full" aria-label="Bar chart of what each provider pays out on a 1000 pound transfer to US dollars, ranked best to worst" />;
}

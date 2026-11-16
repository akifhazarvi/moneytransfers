"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Bell, ChartNoAxesCombined, Puzzle, ShieldCheck, X } from "lucide-react";
import { extensionBrowser, extensionInstalled, extensionLabel, extensionOfferShown, openExtensionStore, type ExtensionBrowser } from "@/lib/browser-extension";
import { onInstallabilityChange } from "@/lib/pwa";
import styles from "./ExtensionDetailsButton.module.css";

/** An explicitly opened product guide; no automatic prompts or repeated nudges. */
export default function ExtensionDetailsButton({ placement, className = "", children = "Chrome extension" }: {
  placement: string; className?: string; children?: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [browser, setBrowser] = useState<ExtensionBrowser | null>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => onInstallabilityChange(() => setInstalled(extensionInstalled())), []);
  function show() {
    const current = extensionBrowser();
    const hasExtension = extensionInstalled();
    setBrowser(current);
    setInstalled(hasExtension);
    dialog.current?.showModal();
    if (current && !hasExtension) extensionOfferShown(placement, current);
  }
  return (
    <>
      <button type="button" onClick={show} className={className}>{children}</button>
      <dialog ref={dialog} aria-labelledby={titleId} className={styles.dialog} onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current?.close();
        }
      }}>
        <div className={styles.content}>
          <button type="button" className={styles.close} aria-label="Close extension overview" onClick={() => dialog.current?.close()} autoFocus><X size={20} aria-hidden="true" /></button>
          <p className={styles.eyebrow}><Puzzle size={18} aria-hidden="true" /> SendMoneyCompare for your browser</p>
          <p id={titleId} className={styles.title}>Check a transfer before you send.</p>
          <p className={styles.intro}>Compare payouts, convert currencies and follow rates from your browser toolbar. Enable price checks to compare while you use supported provider sites, including Wise and Remitly.</p>
          <div className={styles.features}>
            <div><ChartNoAxesCombined size={22} aria-hidden="true" /><p><strong>Compare in context</strong><span>See how a provider’s payout compares for your route and amount.</span></p></div>
            <div><Bell size={22} aria-hidden="true" /><p><strong>Keep an eye on rates</strong><span>Save currency pairs and set rate alerts in the extension.</span></p></div>
            <div><ShieldCheck size={22} aria-hidden="true" /><p><strong>You control price checks</strong><span>Access to supported provider sites is optional. Enable it when you want on-page comparisons.</span></p></div>
          </div>
          <div className={styles.steps}>
            <p className="font-semibold">{installed ? "You already have the extension" : "Get started in three steps"}</p>
            <ol>
              <li>{installed ? "Open the extensions menu in your browser." : "Open the Chrome Web Store and confirm Add extension."}</li>
              <li>Pin SendMoneyCompare to your toolbar.</li>
              <li>Open it to compare, or enable price checks on the welcome page.</li>
            </ol>
          </div>
          {!installed && <>
            {!browser && <p className={styles.note}>Install the extension in Chrome or Edge on a computer. On your phone, you can keep using the comparison website or install the web app from the site menu.</p>}
            <button type="button" className={styles.install} onClick={() => openExtensionStore(placement)}>
              {browser ? extensionLabel(browser) : "View Chrome Web Store listing"}<ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className={styles.note}>Opens the Chrome Web Store in a new tab. Your browser asks you to confirm installation.</p>
          </>}
        </div>
      </dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import styles from "./PropertyTransferIllustration.module.css";

const pounds = (value: number) => new Intl.NumberFormat("en-GB", {
  style: "currency", currency: "GBP", maximumFractionDigits: 0,
}).format(value);

export default function PropertyTransferIllustration() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("1.20");
  const [move, setMove] = useState(-5);
  const euros = Number(amount);
  const initialRate = Number(rate);
  const valid = amount.trim() !== "" && rate.trim() !== "" && Number.isFinite(euros)
    && Number.isFinite(initialRate) && euros >= 1 && euros <= 100000000
    && initialRate >= 0.01 && initialRate <= 100;
  const fixedCost = valid ? euros / initialRate : 0;
  const futureRate = initialRate * (1 + move / 100);
  const futureCost = valid ? euros / futureRate : 0;
  const difference = futureCost - fixedCost;
  const scale = Math.max(fixedCost, futureCost, 1);

  return (
    <figure className={styles.figure} aria-labelledby="property-illustration-title">
      <div className={styles.intro}>
        <span className={styles.eyebrow}>Explore the numbers · Illustrative only</span>
        <h3 id="property-illustration-title">The property price stays put. The pound cost can move.</h3>
        <p>Change the euro payment and assumed rate to see what happens before completion.</p>
      </div>
      <div className={styles.inputs}>
        <label htmlFor="property-euros">Payment due (EUR)
          <input id="property-euros" type="number" min="1" max="100000000" step="1" value={amount}
            onChange={(event) => setAmount(event.target.value)} aria-invalid={!valid} aria-describedby="property-assumptions" />
        </label>
        <label htmlFor="property-rate">Assumed agreed rate (EUR per £1)
          <input id="property-rate" type="number" min="0.01" max="100" step="0.0001" value={rate}
            onChange={(event) => setRate(event.target.value)} aria-invalid={!valid} aria-describedby="property-assumptions" />
        </label>
      </div>
      <label className={styles.slider} htmlFor="property-move">
        Market-rate change before completion <strong>{move > 0 ? "+" : ""}{move}%</strong>
        <input id="property-move" type="range" min="-10" max="10" step="1" value={move}
          onChange={(event) => setMove(Number(event.target.value))} />
        <span className={styles.rangeEnds}><span>Fewer euros per pound</span><span>More euros per pound</span></span>
      </label>
      {!valid ? <p role="status">Enter a payment from €1 to €100,000,000 and a rate from 0.01 to 100.</p> : (
        <div className={styles.results} aria-live="polite" aria-atomic="true">
          {[
            { label: "At the assumed agreed rate", cost: fixedCost, rate: initialRate },
            { label: "At the changed market rate", cost: futureCost, rate: futureRate },
          ].map((row) => <div key={row.label} className={styles.barRow}>
            <div><span>{row.label}<small>£1 = €{row.rate.toFixed(4)}</small></span><strong>{pounds(row.cost)}</strong></div>
            <div className={styles.track} aria-hidden="true"><div style={{ width: `${row.cost / scale * 100}%` }} /></div>
          </div>)}
          <p className={styles.result}>
            <strong>{pounds(Math.abs(difference))}</strong>
            <span>{move === 0 ? "difference when the rate is unchanged" : difference > 0
              ? "more pounds needed at the changed market rate"
              : "fewer pounds needed at the changed market rate"}</span>
          </p>
          <p>A 10% contract deposit in this illustration is {pounds(fixedCost * 0.1)}, leaving {pounds(fixedCost * 0.9)} to fund. This is separate from a property deposit paid to the seller.</p>
        </div>
      )}
      <figcaption id="property-assumptions">Calculation: GBP required = EUR payment ÷ EUR per GBP. This assumes the same euro amount and excludes fees, forward pricing adjustments and additional funding requirements. Figures are rounded. These are assumed rates, not a forecast, a Regency FX quote or a customer result. A binding forward contract also gives up the benefit of a later favourable rate.</figcaption>
    </figure>
  );
}

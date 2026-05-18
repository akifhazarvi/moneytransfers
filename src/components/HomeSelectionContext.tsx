"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface HomeSelection {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  setSelection: (from: string, to: string, amount: number) => void;
}

const HomeSelectionContext = createContext<HomeSelection>({
  fromCurrency: "USD",
  toCurrency: "INR",
  amount: 1000,
  setSelection: () => {},
});

export function HomeSelectionProvider({
  children,
  defaultFrom = "USD",
  defaultTo = "INR",
  defaultAmount = 1000,
}: {
  children: ReactNode;
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
}) {
  const [fromCurrency, setFrom] = useState(defaultFrom);
  const [toCurrency, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState(defaultAmount);

  function setSelection(from: string, to: string, amt: number) {
    setFrom(from);
    setTo(to);
    setAmount(amt);
  }

  return (
    <HomeSelectionContext.Provider value={{ fromCurrency, toCurrency, amount, setSelection }}>
      {children}
    </HomeSelectionContext.Provider>
  );
}

export function useHomeSelection() {
  return useContext(HomeSelectionContext);
}

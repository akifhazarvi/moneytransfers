/**
 * Bank & Broker Rates
 *
 * Previously sourced from ExchangeRates.org.uk (Lloyds, NatWest, Halifax, RBS, etc.).
 * That scraper was removed (site blocks CI runners with 403s).
 * This module now returns empty results — corridor pages handle this gracefully.
 */

export interface BankRate {
  provider: string;
  providerSlug: string;
  providerType: string;
  exchangeRate: number;
  fee: number;
  receiveAmount: number;
  deliveryEstimate: string | null;
}

export function getBankRates(
  _sendCurrency: string,
  _receiveCurrency: string,
  _sendAmount: number
): BankRate[] {
  return [];
}

export function hasBankRates(_sendCurrency: string, _receiveCurrency: string): boolean {
  return false;
}

export function getBankRatesSourceUrl(
  _sendCurrency: string,
  _receiveCurrency: string,
  _amount?: number
): string | null {
  return null;
}

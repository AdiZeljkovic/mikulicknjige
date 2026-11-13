/**
 * Podaci za uplatu na račun — po uputstvima NLB Banke koja je poslao klijent
 * („Za domaće plaćanje" i „DEVIZNI 19.03.2026.").
 *
 * Domaći račun je lični račun kod NLB-a: uplata ide na račun banke, a račun
 * klijenta se navodi uz uplatu, tačno kako banka propisuje. JMBG sa uputstva
 * banke se NIKAD ne prikazuje.
 */

export type PaymentMethod = 'POUZECE' | 'UPLATA'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  POUZECE: 'Pouzećem pri preuzimanju',
  UPLATA: 'Uplata na račun',
}

export const DOMACA_UPLATA = {
  banka: 'NLB Banka d.d. Sarajevo',
  racunPrimaoca: '1327300000000566',
  primalac: 'Mikulić Goran',
  racunKlijenta: '1322602018646946',
}

export const DEVIZNA_UPLATA = {
  banka: 'NLB Banka d.d., Zmaja od Bosne do 16, 71000 Sarajevo',
  swift: 'TBTUBA22XXX',
  iban: 'BA39 1320 0109 3537 8769',
  primalac: 'Mikulić Goran, Hamdije Čemerlića 10, Sarajevo',
}

export function svrhaUplate(orderId: number | string) {
  return `Narudžba knjige #${orderId}`
}

/** Redovi „naziv — vrijednost" za prikaz na stranici i u mailu. */
export function domaciRedovi(orderId: number | string, iznos: string): [string, string][] {
  return [
    ['Banka', DOMACA_UPLATA.banka],
    ['Račun primaoca', DOMACA_UPLATA.racunPrimaoca],
    ['Primalac', DOMACA_UPLATA.primalac],
    ['Račun klijenta', DOMACA_UPLATA.racunKlijenta],
    ['Svrha uplate', svrhaUplate(orderId)],
    ['Iznos', iznos],
  ]
}

export function devizniRedovi(orderId: number | string): [string, string][] {
  return [
    ['Banka', DEVIZNA_UPLATA.banka],
    ['SWIFT/BIC', DEVIZNA_UPLATA.swift],
    ['IBAN', DEVIZNA_UPLATA.iban],
    ['Primalac', DEVIZNA_UPLATA.primalac],
    ['Svrha uplate', svrhaUplate(orderId)],
  ]
}

/**
 * Način plaćanja narudžbe. Uplata na račun je isključena (16.11.2026.) —
 * nove narudžbe su uvijek POUZECE; UPLATA ostaje samo zbog starih zapisa.
 */

export type PaymentMethod = 'POUZECE' | 'UPLATA'

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  POUZECE: 'Pouzećem pri preuzimanju',
  UPLATA: 'Uplata na račun',
}

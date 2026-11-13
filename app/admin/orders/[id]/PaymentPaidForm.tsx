'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Uplata na račun: admin bilježi da je novac stigao (ili poništava oznaku). */
export default function PaymentPaidForm({ orderId, paidAt }: { orderId: number; paidAt: string | null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paid: !paidAt }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError('Greška pri ažuriranju.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {paidAt ? (
        <span className="inline-block text-sm font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-800">
          Uplata primljena {new Date(paidAt).toLocaleDateString('bs')}
        </span>
      ) : (
        <span className="inline-block text-sm font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">
          Čeka se uplata — knjigu poslati tek kad uplata stigne
        </span>
      )}
      <button
        onClick={toggle}
        disabled={loading}
        className="px-4 py-2 bg-graphite text-white text-sm font-medium hover:bg-brand-red transition-colors disabled:opacity-50"
      >
        {loading ? 'Ažuriranje...' : paidAt ? 'Poništi oznaku' : 'Uplata primljena'}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

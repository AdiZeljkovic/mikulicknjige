import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { book: { include: { category: true } } },
    })
    if (!order) return NextResponse.json({ error: 'Narudžba nije pronađena' }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Greška pri dohvatu narudžbe' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin(req)
  if (deny) return deny

  try {
    const { id } = await params
    if (isNaN(Number(id)) || Number(id) <= 0) {
      return NextResponse.json({ error: 'Nevažeći ID' }, { status: 400 })
    }

    const { status, paid } = await req.json()
    const data: { status?: string; paidAt?: Date | null } = {}

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Nevažeći status' }, { status: 400 })
      }
      data.status = status
    }
    // Uplata na račun: admin bilježi da je novac stigao (ili poništava oznaku).
    if (paid !== undefined) data.paidAt = paid ? new Date() : null

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nema izmjena' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: data as { status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; paidAt?: Date | null },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Greška pri ažuriranju narudžbe' }, { status: 500 })
  }
}

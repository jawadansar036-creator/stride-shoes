import { NextRequest, NextResponse } from 'next/server';
import { getStoreOrders, addStoreOrder, updateStoreOrderStatus } from '@/lib/store-data';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const orders = getStoreOrders();
  return NextResponse.json({ success: true, orders, total: orders.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addStoreOrder(body);
    return NextResponse.json({ success: true, order: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required.' }, { status: 400 });
    }

    const updated = updateStoreOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

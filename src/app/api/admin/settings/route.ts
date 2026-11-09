import { NextRequest, NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/store-data';

export async function GET() {
  const settings = getStoreSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = updateStoreSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

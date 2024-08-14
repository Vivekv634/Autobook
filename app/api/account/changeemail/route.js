import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ result: 'Email changed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


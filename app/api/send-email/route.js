import { sendEmail } from '@/app/utils/sendEmail';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function GET(request) {
  try {
    await sendEmail();
    return NextResponse.json({ result: 'email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error });
  }
}

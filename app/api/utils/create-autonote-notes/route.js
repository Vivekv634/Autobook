import { NextResponse } from 'next/server';

//eslint-disable-next-line
export async function PATCH(request) {
  try {
    return NextResponse.json(
      { result: 'AutoNotes notes created!' },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

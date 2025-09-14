
import { NextResponse } from 'next/server';
// This file is now deprecated in favor of the [...nextauth] route handler.
// It is kept for reference but is not used in the authentication flow.

export async function POST(request: Request) {
  try {
    return NextResponse.json({ message: "This endpoint is deprecated. Use the /api/auth/signin/credentials endpoint provided by next-auth." }, { status: 404 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An internal server error occurred" }, { status: 500 });
  }
}

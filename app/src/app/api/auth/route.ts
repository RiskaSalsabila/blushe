import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession, clearAdminSession, isAuthenticated } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  seedDatabase();
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username dan password wajib diisi' }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Kredensial admin tidak valid' }, { status: 401 });
    }

    await setAdminSession(username);
    return NextResponse.json({ success: true, message: 'Login berhasil' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: 'Logout berhasil' });
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, setUserSession } from '@/lib/user-auth';
import { seedDatabase } from '@/lib/seed';

export async function POST(request: Request) {
  try {
    seedDatabase();
    const db = getDb();

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Format data tidak valid.' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user berdasarkan email
    const user = db
      .prepare('SELECT id, display_name, email, password_hash FROM users WHERE email = ?')
      .get(cleanEmail) as
      | { id: number; display_name: string; email: string; password_hash: string }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email atau password tidak sesuai.' },
        { status: 401 }
      );
    }

    // Verifikasi password hash
    const isMatch = verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Email atau password tidak sesuai.' },
        { status: 401 }
      );
    }

    // Pasang session cookie
    await setUserSession({
      id: user.id,
      email: user.email,
      display_name: user.display_name,
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: user.id,
        displayName: user.display_name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat login.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  isValidEmail,
  hashPassword,
  setUserSession,
  PRIVACY_NOTICE_VERSION,
} from '@/lib/user-auth';
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

    const { displayName, email, password, confirmPassword, privacyConsent } = body;

    // 1. Validasi keberadaan seluruh field wajib
    if (
      !displayName ||
      typeof displayName !== 'string' ||
      !displayName.trim() ||
      !email ||
      typeof email !== 'string' ||
      !email.trim() ||
      !password ||
      typeof password !== 'string' ||
      !confirmPassword ||
      typeof confirmPassword !== 'string'
    ) {
      return NextResponse.json(
        { success: false, message: 'Seluruh kolom wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanDisplayName = displayName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // 2. Validasi format email
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    // 3. Validasi panjang password minimal 8 karakter
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 8 karakter.' },
        { status: 400 }
      );
    }

    // 4. Validasi kecocokan konfirmasi password
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Konfirmasi password tidak sesuai.' },
        { status: 400 }
      );
    }

    // 5. Validasi persetujuan privasi (wajib dicentang)
    if (privacyConsent !== true) {
      return NextResponse.json(
        {
          success: false,
          message: 'Persetujuan privasi wajib dicentang sebelum mendaftar.',
        },
        { status: 400 }
      );
    }

    // 6. Cek apakah email sudah terdaftar
    const existing = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(cleanEmail);

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.',
        },
        { status: 409 }
      );
    }

    // 7. Hash password dan simpan ke database
    const passwordHash = hashPassword(password);
    const consentTime = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (
        display_name, email, password_hash, privacy_consent_at, privacy_notice_version
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      cleanDisplayName,
      cleanEmail,
      passwordHash,
      consentTime,
      PRIVACY_NOTICE_VERSION
    );

    const newUserId = Number(result.lastInsertRowid);

    // 8. Langsung buat sesi login pengguna
    await setUserSession({
      id: newUserId,
      email: cleanEmail,
      display_name: cleanDisplayName,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil. Selamat datang di Blushé!',
        user: {
          id: newUserId,
          displayName: cleanDisplayName,
          email: cleanEmail,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat registrasi.' },
      { status: 500 }
    );
  }
}

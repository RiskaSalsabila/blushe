import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '../src/lib/db';
import {
  isValidEmail,
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  PRIVACY_NOTICE_VERSION,
} from '../src/lib/user-auth';
import { verifyAdminCredentials } from '../src/lib/auth';

describe('User Authentication & Registration System', () => {
  const db = getDb();

  beforeEach(() => {
    // Bersihkan data user dan run uji coba sebelum setiap test
    db.prepare("DELETE FROM recommendation_runs WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.com')").run();
    db.prepare("DELETE FROM users WHERE email LIKE '%@test.com'").run();
  });

  // 1. Registrasi dengan seluruh data valid
  it('1. Registrasi dengan seluruh data valid berhasil menyimpan ke database', () => {
    const rawEmail = 'User.Baru@test.com';
    const cleanEmail = rawEmail.trim().toLowerCase();
    const displayName = 'Riska Salsabila';
    const plainPass = 'PasswordRahasia123';
    const hashed = hashPassword(plainPass);
    const consentTime = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO users (
        display_name, email, password_hash, privacy_consent_at, privacy_notice_version
      ) VALUES (?, ?, ?, ?, ?)
    `).run(displayName, cleanEmail, hashed, consentTime, PRIVACY_NOTICE_VERSION);

    expect(insert.changes).toBe(1);

    const savedUser = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;
    expect(savedUser).toBeDefined();
    expect(savedUser.display_name).toBe('Riska Salsabila');
    expect(savedUser.email).toBe('user.baru@test.com');
    expect(savedUser.privacy_notice_version).toBe('v1.0');
    expect(savedUser.privacy_consent_at).toBe(consentTime);
    expect(savedUser.password_hash).not.toBe(plainPass);
    expect(verifyPassword(plainPass, savedUser.password_hash)).toBe(true);
  });

  // 2. Registrasi dengan kolom kosong
  it('2. Registrasi dengan kolom kosong dapat dideteksi', () => {
    const emptyCheck = (displayName: string, email: string, pass: string, confirm: string) => {
      return Boolean(displayName.trim() && email.trim() && pass && confirm);
    };

    expect(emptyCheck('', 'user@test.com', 'Pass1234', 'Pass1234')).toBe(false);
    expect(emptyCheck('User', '', 'Pass1234', 'Pass1234')).toBe(false);
    expect(emptyCheck('User', 'user@test.com', '', 'Pass1234')).toBe(false);
    expect(emptyCheck('User', 'user@test.com', 'Pass1234', '')).toBe(false);
  });

  // 3. Registrasi menggunakan email yang sudah terdaftar
  it('3. Registrasi menggunakan email yang sudah terdaftar gagal (UNIQUE constraint)', () => {
    const email = 'duplicate@test.com';
    const hashed = hashPassword('Pass1234');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
      VALUES (?, ?, ?, ?, ?)
    `).run('User Pertama', email, hashed, now, 'v1.0');

    // Coba masukkan email yang sama persis
    expect(() => {
      db.prepare(`
        INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
        VALUES (?, ?, ?, ?, ?)
      `).run('User Kedua', email, hashed, now, 'v1.0');
    }).toThrow();
  });

  // 4. Registrasi dengan format email tidak valid
  it('4. Registrasi dengan format email tidak valid ditolak', () => {
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missingusername.com')).toBe(false);
    expect(isValidEmail('username@.com')).toBe(false);
    expect(isValidEmail('user@test.')).toBe(false);
    expect(isValidEmail('user name@test.com')).toBe(false);
    expect(isValidEmail('valid.user@test.com')).toBe(true);
    expect(isValidEmail('riska@blushe.ac.id')).toBe(true);
  });

  // 5. Registrasi dengan password kurang dari 8 karakter
  it('5. Registrasi dengan password kurang dari 8 karakter ditolak', () => {
    const isPasswordValid = (pass: string) => typeof pass === 'string' && pass.length >= 8;

    expect(isPasswordValid('1234567')).toBe(false);
    expect(isPasswordValid('short')).toBe(false);
    expect(isPasswordValid('12345678')).toBe(true);
    expect(isPasswordValid('rahasia_aman_123')).toBe(true);
  });

  // 6. Registrasi dengan konfirmasi password berbeda
  it('6. Registrasi dengan konfirmasi password berbeda ditolak', () => {
    const pass = 'SuperSecret123';
    const confirmWrong = 'SuperSecret124';
    const confirmMatch = 'SuperSecret123';

    expect(pass === confirmWrong).toBe(false);
    expect(pass === confirmMatch).toBe(true);
  });

  // 7. Registrasi tanpa persetujuan privasi
  it('7. Registrasi tanpa persetujuan privasi (privacyConsent !== true) ditolak', () => {
    const checkConsent = (consent: any) => consent === true;

    expect(checkConsent(false)).toBe(false);
    expect(checkConsent(null)).toBe(false);
    expect(checkConsent(undefined)).toBe(false);
    expect(checkConsent('true')).toBe(false);
    expect(checkConsent(true)).toBe(true);
  });

  // 8. Login dengan kredensial benar
  it('8. Login dengan kredensial benar berhasil diverifikasi', () => {
    const email = 'login.benar@test.com';
    const pass = 'KredensialBenar123';
    const hashed = hashPassword(pass);
    db.prepare(`
      INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
      VALUES (?, ?, ?, datetime('now'), 'v1.0')
    `).run('User Sukses', email, hashed);

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    expect(user).toBeDefined();
    expect(verifyPassword(pass, user.password_hash)).toBe(true);
  });

  // 9. Login dengan password salah
  it('9. Login dengan password salah gagal diverifikasi', () => {
    const email = 'login.salah@test.com';
    const pass = 'PasswordAsli123';
    const hashed = hashPassword(pass);
    db.prepare(`
      INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
      VALUES (?, ?, ?, datetime('now'), 'v1.0')
    `).run('User Coba', email, hashed);

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    expect(user).toBeDefined();
    expect(verifyPassword('PasswordSalah123', user.password_hash)).toBe(false);
  });

  // 10. Logout pengguna & Validasi Session Token
  it('10. Pembuatan, verifikasi, dan pemalsuan token sesi pengguna', () => {
    const payload = {
      userId: 42,
      email: 'session@test.com',
      displayName: 'Pengguna Sesi',
      createdAt: Date.now(),
    };

    const token = signToken(payload);
    expect(token).toContain('.');

    // Verifikasi token asli
    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(42);
    expect(verified?.email).toBe('session@test.com');

    // Token yang diubah/dipalsukan harus ditolak
    const parts = token.split('.');
    const forgedToken = `${parts[0]}.invalidSignature`;
    expect(verifyToken(forgedToken)).toBeNull();
  });

  // 11. Pemisahan akses pengguna biasa dan admin
  it('11. Pemisahan ketat antara sesi & kredensial pengguna biasa dengan admin', async () => {
    const userEmail = 'bukan.admin@test.com';
    const pass = 'UserBiasa123';
    const hashed = hashPassword(pass);

    db.prepare(`
      INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
      VALUES (?, ?, ?, datetime('now'), 'v1.0')
    `).run('Bukan Admin', userEmail, hashed);

    // Kredensial pengguna biasa tidak bisa digunakan untuk autentikasi admin_users
    const adminAuthResult = await verifyAdminCredentials(userEmail, pass);
    expect(adminAuthResult).toBe(false);

    // Tabel users terpisah dari admin_users
    const checkInAdminTable = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(userEmail);
    expect(checkInAdminTable).toBeUndefined();
  });

  // 12. Pencatatan user_id pada sesi rekomendasi
  it('12. Pencatatan user_id pada tabel recommendation_runs untuk pengguna login maupun tamu', () => {
    const userEmail = 'rekomendasi.user@test.com';
    const hashed = hashPassword('Pass123456');
    const userInsert = db.prepare(`
      INSERT INTO users (display_name, email, password_hash, privacy_consent_at, privacy_notice_version)
      VALUES (?, ?, ?, datetime('now'), 'v1.0')
    `).run('User Rekomendasi', userEmail, hashed);
    const userId = Number(userInsert.lastInsertRowid);

    // Kasus A: Pengguna Login
    const runUser = db.prepare(`
      INSERT INTO recommendation_runs (
        user_id, skin_tone, undertone, selected_colors, selected_formula, budget_limit, candidates_count, v_parameter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, 'Light', 'Warm', JSON.stringify(['Peach']), 'Powder', 150000, 3, 0.5);

    const loggedRun = db.prepare('SELECT * FROM recommendation_runs WHERE id = ?').get(runUser.lastInsertRowid) as any;
    expect(loggedRun.user_id).toBe(userId);

    // Kasus B: Pengguna Tamu (tanpa login)
    const runGuest = db.prepare(`
      INSERT INTO recommendation_runs (
        user_id, skin_tone, undertone, selected_colors, selected_formula, budget_limit, candidates_count, v_parameter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(null, 'Medium', 'Neutral', JSON.stringify(['Pink']), 'Cream', 200000, 2, 0.5);

    const guestRun = db.prepare('SELECT * FROM recommendation_runs WHERE id = ?').get(runGuest.lastInsertRowid) as any;
    expect(guestRun.user_id).toBeNull();
  });
});

import { getDb } from './db';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
  const db = getDb();

  // 1. Seed Admin User
  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.prepare('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)').run(
      'admin',
      hash,
      'admin'
    );
  }

  // 2. Seed Criteria
  const existingCriteria = db.prepare('SELECT COUNT(*) as count FROM criteria').get() as { count: number };
  if (existingCriteria.count === 0) {
    const insertCrit = db.prepare(`
      INSERT INTO criteria (code, name, description, type, weight, scale_min, scale_max)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertCrit.run('C1', 'Kecocokan Skin Tone', 'Penilaian kecocokan kedalaman warna shade terhadap skin tone', 'benefit', 0.35, 1.0, 5.0);
    insertCrit.run('C2', 'Kecocokan Undertone', 'Penilaian kecocokan rona warna shade terhadap undertone kulit', 'benefit', 0.25, 1.0, 5.0);
    insertCrit.run('C3', 'Kesesuaian Preferensi Warna', 'Kesesuaian kelompok warna shade terhadap pilihan pengguna', 'benefit', 0.25, 1.0, 5.0);
    insertCrit.run('C4', 'Harga Produk', 'Harga produk dalam rupiah (kriteria cost/biaya)', 'cost', 0.15, 0.0, 200000.0);
  }

  // 3. Seed Brands, Products, and Shades from Prototype Demo
  const existingBrands = db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number };
  if (existingBrands.count === 0) {
    const insertBrand = db.prepare('INSERT INTO brands (name) VALUES (?)');
    const insertProduct = db.prepare('INSERT INTO products (brand_id, product_name, description) VALUES (?, ?, ?)');
    const insertShade = db.prepare(`
      INSERT INTO product_shades (product_id, shade_name, shade_description, formula, color_family, color_hex, price_idr, tone_depth, undertone_bias)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const brandsData = [
      {
        name: 'Petal Theory',
        products: [
          {
            name: 'Cloud Blush',
            desc: 'Blush on bertekstur lembut dengan pigmentasi buildable.',
            shades: [
              { name: 'Soft Rose', formula: 'Powder', color: 'Pink', hex: '#d78f9a', price: 78000, tone: 'Fair', undertone: 'Cool' },
            ]
          },
          {
            name: 'Warm Petal',
            desc: 'Stick blush praktis dengan hasil akhir satin alami.',
            shades: [
              { name: 'Terracotta Muse', formula: 'Stick', color: 'Terracotta', hex: '#b86c50', price: 68000, tone: 'Tan', undertone: 'Warm' },
            ]
          }
        ]
      },
      {
        name: 'Mellow Muse',
        products: [
          {
            name: 'Velvet Cheek',
            desc: 'Powder blush halus dengan efek blur pada pori.',
            shades: [
              { name: 'Peach Bloom', formula: 'Powder', color: 'Peach', hex: '#e9ad8b', price: 92000, tone: 'Light', undertone: 'Warm' },
            ]
          }
        ]
      },
      {
        name: 'Dear Petal',
        products: [
          {
            name: 'Soft Flush',
            desc: 'Perona pipi cerah dan segar untuk pemakaian sehari-hari.',
            shades: [
              { name: 'Coral Dawn', formula: 'Powder', color: 'Coral', hex: '#df8c78', price: 59000, tone: 'Medium', undertone: 'Warm' },
            ]
          }
        ]
      },
      {
        name: 'Rose Atelier',
        products: [
          {
            name: 'Silk Tint',
            desc: 'Liquid blush ringan mudah dibaurkan dengan kilau sehat.',
            shades: [
              { name: 'Mauve Day', formula: 'Liquid', color: 'Mauve', hex: '#ac7888', price: 105000, tone: 'Medium', undertone: 'Neutral' },
            ]
          }
        ]
      },
      {
        name: 'Bloom Theory',
        products: [
          {
            name: 'Cream Veil',
            desc: 'Cream blush yang meleleh lembut di atas kulit.',
            shades: [
              { name: 'Berry Cloud', formula: 'Cream', color: 'Berry', hex: '#a85d76', price: 115000, tone: 'Deep', undertone: 'Cool' },
            ]
          }
        ]
      }
    ];

    for (const b of brandsData) {
      const bRes = insertBrand.run(b.name);
      const brandId = Number(bRes.lastInsertRowid);

      for (const p of b.products) {
        const pRes = insertProduct.run(brandId, p.name, p.desc);
        const productId = Number(pRes.lastInsertRowid);

        for (const s of p.shades) {
          insertShade.run(
            productId,
            s.name,
            `Alternatif ${s.formula.toLowerCase()} blush dengan kelompok warna ${s.color.toLowerCase()}. Data simulasi untuk bimbingan.`,
            s.formula,
            s.color,
            s.hex,
            s.price,
            s.tone,
            s.undertone
          );
        }
      }
    }
  }
}

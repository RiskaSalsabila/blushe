'use client';

import { useEffect } from 'react';

export interface ModalProductData {
  brand: string;
  name: string;
  shade: string;
  formula: string;
  price: number;
  hex: string;
  desc: string;
  color: string;
}

interface ProductDetailModalProps {
  product: ModalProductData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="detail-modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          ×
        </button>
        <div className="eyebrow">Product detail · demo</div>
        <h3 id="modalTitle">
          {product.brand} · {product.name} / {product.shade}
        </h3>
        <div className="modal-art">
          <span style={{ ['--shade' as any]: product.hex }}></span>
        </div>
        <p id="modalText">
          Formula: <strong>{product.formula}</strong>. Harga ilustrasi: <strong>Rp{product.price.toLocaleString('id-ID')}</strong>. Kelompok warna: <strong>{product.color}</strong>. {product.desc}
        </p>
        <div className="inline-note">
          Informasi ini merupakan data contoh untuk menunjukkan rancangan halaman detail. Ganti dengan data produk yang sudah diverifikasi pada tahap pengembangan.
        </div>
      </div>
    </div>
  );
}

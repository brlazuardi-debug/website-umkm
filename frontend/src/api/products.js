import apiClient from './client';

export const fallbackProducts = [
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'Italian Tailored Black Blazer',
    deskripsi: 'Jas pria double-breasted premium dari wol Italia super 130s dengan konstruksi kanvas penuh dan detail kancing tanduk asli.',
    harga: 1450000,
    stok: 12,
    gambar_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
    is_active: true,
    kategori: 'tops',
  },
  {
    id: 'f4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    nama: 'Architectural Poplin Dress Shirt',
    deskripsi: 'Kemeja katun poplin Mesir 120s dengan kerah arsitektural, saku tersembunyi, dan potongan tailored elegan.',
    harga: 520000,
    stok: 24,
    gambar_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800',
    is_active: true,
    kategori: 'tops',
  },
  {
    id: 'd2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Heavyweight Minimalist Tee Black',
    deskripsi: 'T-shirt 280gsm combed cotton jersey berpotongan boxy dengan ribbed collar kokoh dan sentuhan akhir halus.',
    harga: 299000,
    stok: 45,
    gambar_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
    is_active: true,
    kategori: 'tops',
  },
  {
    id: 'e3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e',
    nama: 'Tailored Pleated Trousers',
    deskripsi: 'Celana panjang high-waisted dari wol Jepang dengan lipit tunggal tajam dan siluet jatuh yang sempurna.',
    harga: 620000,
    stok: 18,
    gambar_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
    is_active: true,
    kategori: 'bottoms',
  },
  {
    id: 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Handcrafted Leather Loafers',
    deskripsi: 'Sepatu formal loafer kulit sapi calfskin asli dengan jahitan tangan Goodyear welted dan sol kulit alami.',
    harga: 1250000,
    stok: 10,
    gambar_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800',
    is_active: true,
    kategori: 'bottoms',
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Minimalist Calfskin Leather Belt',
    deskripsi: 'Sabuk kulit calfskin kualitas tinggi dengan buckle matte nickel minimalis tanpa jahitan tepi yang mencolok.',
    harga: 380000,
    stok: 22,
    gambar_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
    is_active: true,
    kategori: 'bottoms',
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    nama: 'Double-Faced Wool Coat Men',
    deskripsi: 'Mantel luar panjang pria berbahan wol kasmir dua sisi dengan notch lapel elegan dan siluet unconstructed.',
    harga: 1850000,
    stok: 8,
    gambar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
    is_active: true,
    kategori: 'outerwear',
  },
  {
    id: 'w1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'Structured Tailored Blazer Women',
    deskripsi: 'Blazer tailored wanita berpotongan arsitektural modern dengan bantalan bahu halus dan siluet ramping berkelas.',
    harga: 1350000,
    stok: 14,
    gambar_url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800',
    is_active: true,
    kategori: 'outerwear',
  },
  {
    id: 'j1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'Minimalist Noir Chronograph Watch',
    deskripsi: 'Jam tangan mewah dial hitam sapphire crystal dengan movement otomatis Swiss dan strap kulit asli premium.',
    harga: 1650000,
    stok: 10,
    gambar_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800',
    is_active: true,
    kategori: 'accessories',
  },
];

export const getProducts = async (limit = 20, offset = 0, includeInactive = false) => {
  try {
    const response = await apiClient.get('/products', {
      params: { limit, offset, ...(includeInactive ? { include_inactive: true } : {}) },
    });
    const data = response.data?.data ?? response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[Products API] Fallback to instant catalog data:', err.message);
  }
  return fallbackProducts;
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    if (response.data && response.data.id) return response.data;
  } catch (err) {
    console.warn('[Product Detail API] Fallback search:', err.message);
  }
  const found = fallbackProducts.find((p) => p.id === id);
  return found || fallbackProducts[0];
};

export const createProduct = async (data) => {
  try {
    const response = await apiClient.post('/products', data);
    return response.data;
  } catch {
    const newProd = { id: `prod-${Date.now()}`, ...data, is_active: true };
    fallbackProducts.unshift(newProd);
    return newProd;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  } catch {
    const idx = fallbackProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      fallbackProducts[idx] = { ...fallbackProducts[idx], ...data };
      return fallbackProducts[idx];
    }
    return { id, ...data };
  }
};

export const deleteProduct = async (id) => {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch {
    const idx = fallbackProducts.findIndex((p) => p.id === id);
    if (idx !== -1) fallbackProducts.splice(idx, 1);
  }
};

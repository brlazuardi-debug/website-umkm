import { http, HttpResponse } from 'msw';
import type { ProdukResponse, TransaksiResponse, UserResponse } from '../types';

// Mock Databases lokal di memory
let mockProducts: ProdukResponse[] = [
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'Batik Tulis Mega Mendung Premium',
    deskripsi: 'Kain batik tulis halus dengan motif tradisional Mega Mendung Cirebon. Dibuat menggunakan lilin malam alami berkualitas tinggi dan pewarna ramah lingkungan. Sangat nyaman dipakai untuk acara formal maupun santai.',
    harga: 350000,
    stok: 15,
    gambar_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'd2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Tas Anyaman Rotan Etnik',
    deskripsi: 'Tas tangan wanita yang dianyam rapi oleh pengrajin rotan lokal di Kalimantan. Menggunakan bahan rotan pilihan yang kuat dan dilapisi kain batik halus di bagian dalam. Gaya bohemian yang elegan.',
    harga: 185000,
    stok: 8,
    gambar_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'e3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e',
    nama: 'Madu Hutan Liar Asli Odeng',
    deskripsi: 'Madu murni yang dipanen langsung dari sarang lebah Apis dorsata di hutan belantara Jawa Barat. Diproses secara higienis tanpa campuran bahan kimia atau pemanis tambahan. Kaya nutrisi dan antioksidan.',
    harga: 120000,
    stok: 25,
    gambar_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    nama: 'Sepatu Kulit Slop Handcrafted',
    deskripsi: 'Sepatu kulit pria dengan model slop slip-on casual. Terbuat dari 100% kulit sapi asli pilihan dengan jahitan tangan yang rapi dan kuat. Sol karet empuk antimelar dan antiselip.',
    harga: 420000,
    stok: 5,
    gambar_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let mockUser: UserResponse = {
  id: 'e0a123b4-5678-4abc-9def-123456789abc',
  clerk_id: 'user_2Tj9KL8MnoPQrs',
  email: 'customer.umkm@gmail.com',
  name: 'Budi Santoso',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let mockTransactions: Record<string, TransaksiResponse> = {};

// Helper base URL matching Vite env variable or default
const BASE_URL = '*/api/v1';

export const handlers = [
  // 1. Health check
  http.get('*/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // 2. GET /products
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Filter aktif jika bukan admin (untuk simulasi, kita kembalikan produk aktif)
    const activeProducts = mockProducts.filter(p => p.is_active);
    const paginated = activeProducts.slice(offset, offset + limit);
    return HttpResponse.json(paginated);
  }),

  // 3. GET /products/{id}
  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  // 4. POST /products (Admin)
  http.post(`${BASE_URL}/products`, async ({ request }) => {
    const body: any = await request.json();
    const newProduct: ProdukResponse = {
      id: crypto.randomUUID(),
      nama: body.nama,
      deskripsi: body.deskripsi || null,
      harga: body.harga,
      stok: body.stok,
      gambar_url: body.gambar_url || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // 5. PUT /products/{id} (Admin)
  http.put(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const { id } = params;
    const body: any = await request.json();
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockProducts[index] = {
      ...mockProducts[index],
      nama: body.nama !== undefined ? body.nama : mockProducts[index].nama,
      deskripsi: body.deskripsi !== undefined ? body.deskripsi : mockProducts[index].deskripsi,
      harga: body.harga !== undefined ? body.harga : mockProducts[index].harga,
      stok: body.stok !== undefined ? body.stok : mockProducts[index].stok,
      gambar_url: body.gambar_url !== undefined ? body.gambar_url : mockProducts[index].gambar_url,
      is_active: body.is_active !== undefined ? body.is_active : mockProducts[index].is_active,
      updated_at: new Date().toISOString()
    };
    return HttpResponse.json(mockProducts[index]);
  }),

  // 6. DELETE /products/{id} (Admin)
  http.delete(`${BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockProducts.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // 7. GET /users/me
  http.get(`${BASE_URL}/users/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  // 8. PATCH /users/me
  http.patch(`${BASE_URL}/users/me`, async ({ request }) => {
    const body: any = await request.json();
    if (body.name !== undefined) {
      mockUser.name = body.name || '';
      mockUser.updated_at = new Date().toISOString();
    }
    return HttpResponse.json(mockUser);
  }),

  // 9. POST /transactions (Checkout)
  http.post(`${BASE_URL}/transactions`, async ({ request }) => {
    const body: any = await request.json();
    const txId = crypto.randomUUID();
    const midtransOrderId = `MOCK-ORDER-${Date.now()}`;

    const newTx: TransaksiResponse = {
      id: txId,
      user_id: mockUser.id,
      total_harga: body.total_harga,
      status: 'PENDING',
      payment_type: body.payment_type || 'qris',
      midtrans_order_id: midtransOrderId,
      // QR server mockup API yang menampilkan teks order ID
      qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-MOCK-PAYLOAD-${midtransOrderId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockTransactions[txId] = newTx;

    // Simulasikan pembayaran otomatis (PAID) setelah 15 detik untuk simulasi polling E2E
    setTimeout(() => {
      if (mockTransactions[txId] && mockTransactions[txId].status === 'PENDING') {
        mockTransactions[txId].status = 'PAID';
        mockTransactions[txId].updated_at = new Date().toISOString();
        console.log(`[MSW Mock] Transaction ${txId} has been paid successfully.`);
      }
    }, 15000);

    return HttpResponse.json(newTx, { status: 201 });
  }),

  // 10. GET /transactions/{id} (Polling)
  http.get(`${BASE_URL}/transactions/:id`, ({ params }) => {
    const { id } = params;
    const tx = mockTransactions[id as string];
    if (!tx) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(tx);
  })
];

import { http, HttpResponse } from 'msw';

// Mock Databases lokal di memory (Figma-matched VARCA luxury items: Jas, Kemeja, T-shirt, Celana, Sabuk, Sepatu, Outer Pria & Wanita, Jam Tangan)
let mockProducts = [
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'Italian Tailored Black Blazer',
    deskripsi: 'Jas pria double-breasted premium dari wol Italia super 130s dengan konstruksi kanvas penuh dan detail kancing tanduk asli.',
    harga: 1450000,
    stok: 12,
    gambar_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
    is_active: true,
    kategori: 'tops',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockUser = {
  id: 'e0a123b4-5678-4abc-9def-123456789abc',
  clerk_id: 'user_2Tj9KL8MnoPQrs',
  email: 'customer@varca.id',
  name: 'Elena Rostova',
  role: 'STAFF',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let mockTransactions = {};
let mockCarts = [
  {
    id: 'cart-001',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    status: 'active',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    items: [
      {
        id: 'ci-1',
        cart_id: 'cart-001',
        product_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
        quantity: 1,
        harga_satuan: 1450000,
        product: mockProducts[0],
      }
    ]
  }
];

let mockOrders = [
  {
    id: 'ORD-0091',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    total_harga: 1450000,
    status: 'PENDING',
    payment_type: 'qris',
    midtrans_order_id: 'TRX-ORD0091',
    qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TRX-ORD0091',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    items: [
      { id: 'oi-1', order_id: 'ORD-0091', product_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', quantity: 1, harga_satuan: 1450000, product: mockProducts[0] }
    ]
  },
  {
    id: 'ORD-0090',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    total_harga: 520000,
    status: 'PAID',
    payment_type: 'qris',
    paid_at: new Date(Date.now() - 14400000).toISOString(),
    midtrans_order_id: 'TRX-ORD0090',
    qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TRX-ORD0090',
    created_at: new Date(Date.now() - 18000000).toISOString(),
    updated_at: new Date(Date.now() - 14400000).toISOString(),
    items: []
  },
  {
    id: 'ORD-0089',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    total_harga: 1650000,
    status: 'SHIPPED',
    payment_type: 'bank',
    paid_at: new Date(Date.now() - 86400000).toISOString(),
    midtrans_order_id: 'TRX-ORD0089',
    qr_url: null,
    created_at: new Date(Date.now() - 90000000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    items: []
  }
];

let mockEmployees = [
  {
    id: 'emp-001',
    name: 'Alexander Wright',
    email: 'alexander@varca.id',
    phone: '+62 812-3456-7890',
    role: 'OWNER',
    is_active: true,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-002',
    name: 'Sophia Laurent',
    email: 'sophia@varca.id',
    phone: '+62 813-9876-5432',
    role: 'STORE MANAGER',
    is_active: true,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-003',
    name: 'Marcus Vance',
    email: 'marcus@varca.id',
    phone: '+62 821-1122-3344',
    role: 'WAREHOUSE',
    is_active: true,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'emp-004',
    name: 'Chloe Bennett',
    email: 'chloe@varca.id',
    phone: '+62 855-4433-2211',
    role: 'STAFF',
    is_active: false,
    status: 'INACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const handlers = [
  // Products Endpoints
  http.get('/api/v1/products', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const category = url.searchParams.get('category');
    const includeInactive = url.searchParams.get('include_inactive') === 'true';

    let prods = mockProducts;
    if (!includeInactive) {
      prods = prods.filter((p) => p.is_active);
    }
    if (category) {
      prods = prods.filter((p) => p.kategori?.toLowerCase() === category.toLowerCase());
    }

    const paginated = prods.slice(skip, skip + limit);
    return HttpResponse.json(paginated, { status: 200 });
  }),

  http.get('/api/v1/products/:id', ({ params }) => {
    const prod = mockProducts.find((p) => p.id === params.id);
    if (!prod) {
      return HttpResponse.json({ detail: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    return HttpResponse.json(prod, { status: 200 });
  }),

  http.post('/api/v1/products', async ({ request }) => {
    const body = await request.json();
    const newProd = {
      id: `prod-${Date.now()}`,
      nama: body.nama,
      deskripsi: body.deskripsi || null,
      harga: body.harga,
      stok: body.stok,
      gambar_url: body.gambar_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
      is_active: body.is_active !== undefined ? body.is_active : true,
      kategori: body.kategori || 'tops',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProducts.unshift(newProd);
    return HttpResponse.json(newProd, { status: 201 });
  }),

  http.put('/api/v1/products/:id', async ({ params, request }) => {
    const body = await request.json();
    const idx = mockProducts.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    mockProducts[idx] = {
      ...mockProducts[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(mockProducts[idx], { status: 200 });
  }),

  http.delete('/api/v1/products/:id', ({ params }) => {
    const idx = mockProducts.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Produk tidak ditemukan.' }, { status: 404 });
    }
    mockProducts.splice(idx, 1);
    return HttpResponse.json({ detail: 'Produk berhasil dihapus.' }, { status: 200 });
  }),

  // Transactions Endpoints
  http.post('/api/v1/transactions', async ({ request }) => {
    const body = await request.json();
    const txId = `TRX-${Date.now()}`;
    const orderId = `ORD-${Date.now()}`;
    const newTx = {
      id: txId,
      user_id: mockUser.id,
      total_harga: body.total_harga || 1450000,
      status: 'PENDING',
      payment_type: body.payment_type || 'qris',
      midtrans_order_id: orderId,
      qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VARCA-LUXURY-PAYMENT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTransactions[txId] = newTx;

    // Catat otomatis ke mockOrders agar langsung muncul di Panel Admin Cart & Orders
    const newOrder = {
      id: orderId,
      user_id: mockUser.id,
      user: { name: mockUser.name, email: mockUser.email },
      total_harga: body.total_harga || 1450000,
      status: 'PENDING',
      payment_type: body.payment_type || 'qris',
      midtrans_order_id: orderId,
      qr_url: newTx.qr_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [
        {
          id: `oi-${Date.now()}`,
          order_id: orderId,
          product_id: mockProducts[0]?.id,
          quantity: 1,
          harga_satuan: body.total_harga || 1450000,
          product: mockProducts[0],
        }
      ]
    };
    mockOrders.unshift(newOrder);

    return HttpResponse.json(newTx, { status: 201 });
  }),

  http.get('/api/v1/transactions/:id', ({ params }) => {
    const tx = mockTransactions[params.id] || {
      id: params.id,
      user_id: mockUser.id,
      total_harga: 1450000,
      status: 'PENDING',
      payment_type: 'qris',
      midtrans_order_id: `ORD-${params.id}`,
      qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VARCA-LUXURY-PAYMENT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(tx, { status: 200 });
  }),

  // Orders Endpoints
  http.get('/api/v1/orders', () => {
    return HttpResponse.json(mockOrders, { status: 200 });
  }),

  http.put('/api/v1/orders/:id/status', async ({ params, request }) => {
    const body = await request.json();
    const order = mockOrders.find((o) => o.id === params.id);
    if (order) {
      order.status = body.status;
      order.updated_at = new Date().toISOString();
    }
    return HttpResponse.json(order || { id: params.id, status: body.status }, { status: 200 });
  }),

  // Carts Endpoints
  http.get('/api/v1/carts', () => {
    return HttpResponse.json(mockCarts, { status: 200 });
  }),

  // Employees Endpoints (Support both /api/v1/admin/employees and /api/v1/employees)
  http.get('/api/v1/admin/employees', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    let emps = mockEmployees;
    if (search) {
      emps = emps.filter((e) =>
        e.name.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.role.toLowerCase().includes(search)
      );
    }
    return HttpResponse.json(emps, { status: 200 });
  }),

  http.get('/api/v1/employees', () => {
    return HttpResponse.json(mockEmployees, { status: 200 });
  }),

  http.post('/api/v1/admin/employees', async ({ request }) => {
    const body = await request.json();
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      role: body.role || 'STAFF',
      is_active: body.is_active !== undefined ? body.is_active : true,
      status: body.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEmployees.unshift(newEmp);
    return HttpResponse.json(newEmp, { status: 201 });
  }),

  http.post('/api/v1/employees', async ({ request }) => {
    const body = await request.json();
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      role: body.role || 'STAFF',
      is_active: body.is_active !== undefined ? body.is_active : true,
      status: body.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEmployees.unshift(newEmp);
    return HttpResponse.json(newEmp, { status: 201 });
  }),

  http.put('/api/v1/admin/employees/:id', async ({ params, request }) => {
    const body = await request.json();
    const idx = mockEmployees.findIndex((e) => e.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Karyawan tidak ditemukan.' }, { status: 404 });
    }
    mockEmployees[idx] = { ...mockEmployees[idx], ...body, updated_at: new Date().toISOString() };
    return HttpResponse.json(mockEmployees[idx], { status: 200 });
  }),

  http.delete('/api/v1/admin/employees/:id', ({ params }) => {
    const idx = mockEmployees.findIndex((e) => e.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ detail: 'Karyawan tidak ditemukan.' }, { status: 404 });
    }
    mockEmployees.splice(idx, 1);
    return HttpResponse.json({ detail: 'Karyawan berhasil dihapus.' }, { status: 200 });
  }),

  // Users / Profile Endpoints
  http.get('/api/v1/users/me', () => {
    return HttpResponse.json(mockUser, { status: 200 });
  }),

  http.put('/api/v1/users/me', async ({ request }) => {
    const body = await request.json();
    mockUser = {
      ...mockUser,
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(mockUser, { status: 200 });
  }),
];

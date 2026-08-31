import { http, HttpResponse } from 'msw';

// Mock Databases lokal di memory (Figma-matched VARCA luxury minimalist items)
let mockProducts = [
  {
    id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    nama: 'The Essential Overshirt',
    deskripsi: 'Heavyweight structured cotton overshirt with custom horn buttons, clean chest pocket, and a boxy relaxed drape.',
    harga: 499000,
    stok: 20,
    gambar_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
    is_active: true,
    kategori: 'tops',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'd2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Heavyweight Oversized Tee Black',
    deskripsi: '280gsm heavyweight combed cotton jersey featuring dropped shoulders, wide ribbed collar, and pre-shrunk finish.',
    harga: 289000,
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
    deskripsi: 'High-waisted relaxed trousers crafted from Japanese wool-poly blend with deep single front pleats and tapered hems.',
    harga: 580000,
    stok: 15,
    gambar_url: 'https://images.unsplash.com/photo-1542272604-780c96856553?q=80&w=800',
    is_active: true,
    kategori: 'bottoms',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    nama: 'Relaxed Structured Shirt Off-White',
    deskripsi: 'Crisp luxury poplin shirt designed with an architectural collar, hidden placket, and exaggerated cuffs.',
    harga: 420000,
    stok: 18,
    gambar_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800',
    is_active: true,
    kategori: 'tops',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    nama: 'Minimalist Cargo Trousers',
    deskripsi: 'Streamlined military-inspired trousers with flush seamless utility pockets and adjustable ankle cinch straps.',
    harga: 520000,
    stok: 12,
    gambar_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800',
    is_active: true,
    kategori: 'bottoms',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    nama: 'Monochrome Minimalist Wool Coat',
    deskripsi: 'Double-faced Italian wool blend overcoat with clean notch lapels, storm flap detail, and unconstructed shoulders.',
    harga: 1250000,
    stok: 8,
    gambar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800',
    is_active: true,
    kategori: 'outerwear',
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
        harga_satuan: 499000,
        product: mockProducts[0],
      }
    ]
  }
];

let mockOrders = [
  {
    id: 'ORD-0091',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    total_harga: 1250000,
    status: 'PENDING',
    payment_type: 'qris',
    midtrans_order_id: 'TRX-ORD0091',
    qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TRX-ORD0091',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    items: [
      { id: 'oi-1', order_id: 'ORD-0091', product_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', quantity: 2, harga_satuan: 499000, product: mockProducts[0] }
    ]
  },
  {
    id: 'ORD-0090',
    user_id: 'e0a123b4-5678-4abc-9def-123456789abc',
    total_harga: 450000,
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
    total_harga: 3100000,
    status: 'SHIPPED',
    payment_type: 'bank',
    paid_at: new Date(Date.now() - 86400000).toISOString(),
    shipped_at: new Date(Date.now() - 43200000).toISOString(),
    midtrans_order_id: 'TRX-ORD0089',
    qr_url: null,
    created_at: new Date(Date.now() - 90000000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    items: []
  }
];

let mockEmployees = [
  { id: 'emp-1', name: 'Renaldi Zaki', role: 'ADMIN', status: 'ACTIVE', email: 'renaldi@varca.id', phone: '+62 812-0192-2834', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-2', name: 'Bagus Lazuardi', role: 'WAREHOUSE', status: 'ACTIVE', email: 'bagus@varca.id', phone: '+62 812-0192-2835', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-3', name: 'Fadli Suta', role: 'CUSTOMER SERVICE', status: 'ACTIVE', email: 'fadli@varca.id', phone: '+62 812-0192-2836', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-4', name: 'Virmanza', role: 'STORE MANAGER', status: 'ACTIVE', email: 'virman@varca.id', phone: '+62 812-0192-2837', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'emp-5', name: 'Dummy Staff', role: 'WAREHOUSE', status: 'INACTIVE', email: 'dummy@varca.id', phone: '+62 812-0192-2838', is_active: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const BASE_URL = '*/api/v1';

export const handlers = [
  // 1. Health check
  http.get('*/health', () => HttpResponse.json({ status: 'ok' })),

  // 2. GET /products
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const includeInactive = url.searchParams.get('include_inactive') === 'true';

    const source = includeInactive ? mockProducts : mockProducts.filter((p) => p.is_active);
    const paginated = source.slice(offset, offset + limit);
    return HttpResponse.json({
      data: paginated,
      meta: {
        total: source.length,
        limit,
        offset,
        has_next: offset + limit < source.length,
      }
    });
  }),

  // 3. GET /products/{id}
  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),

  // 4. POST /products
  http.post(`${BASE_URL}/products`, async ({ request }) => {
    const body = await request.json();
    const newProduct = {
      id: crypto.randomUUID(),
      nama: body.nama,
      deskripsi: body.deskripsi || null,
      harga: body.harga,
      stok: body.stok,
      gambar_url: body.gambar_url || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // 5. PUT /products/{id}
  http.put(`${BASE_URL}/products/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    mockProducts[index] = {
      ...mockProducts[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(mockProducts[index]);
  }),

  // 6. DELETE /products/{id}
  http.delete(`${BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    mockProducts.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // 7. Users
  http.get(`${BASE_URL}/users/me`, () => HttpResponse.json(mockUser)),
  http.patch(`${BASE_URL}/users/me`, async ({ request }) => {
    const body = await request.json();
    if (body.name) mockUser.name = body.name;
    return HttpResponse.json(mockUser);
  }),

  // 8. Transactions
  http.post(`${BASE_URL}/transactions`, async ({ request }) => {
    const body = await request.json();
    const txId = crypto.randomUUID();
    const midtransOrderId = `TRX-${Date.now()}`;
    const newTx = {
      id: txId,
      user_id: mockUser.id,
      total_harga: body.total_harga,
      status: 'PENDING',
      payment_type: body.payment_type || 'qris',
      midtrans_order_id: midtransOrderId,
      qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-${midtransOrderId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTransactions[txId] = newTx;
    return HttpResponse.json(newTx, { status: 201 });
  }),

  http.get(`${BASE_URL}/transactions/:id`, ({ params }) => {
    const tx = mockTransactions[params.id] || mockOrders.find(o => o.id === params.id);
    if (!tx) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(tx);
  }),

  // 9. Admin Orders
  http.get(`${BASE_URL}/admin/orders`, () => HttpResponse.json({ data: mockOrders, meta: { total: mockOrders.length, limit: 20, offset: 0, has_next: false } })),
  http.get(`${BASE_URL}/admin/orders/:id`, ({ params }) => {
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),
  http.patch(`${BASE_URL}/admin/orders/:id/status`, async ({ params, request }) => {
    const body = await request.json();
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    order.status = body.status;
    return HttpResponse.json(order);
  }),

  // 10. Admin Carts
  http.get(`${BASE_URL}/admin/carts`, () => HttpResponse.json({ data: mockCarts, meta: { total: mockCarts.length, limit: 20, offset: 0, has_next: false } })),
  http.get(`${BASE_URL}/admin/carts/:id`, ({ params }) => {
    const cart = mockCarts.find(c => c.id === params.id);
    if (!cart) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(cart);
  }),

  // 11. Admin Employees
  http.get(`${BASE_URL}/admin/employees`, () => HttpResponse.json({ data: mockEmployees, meta: { total: mockEmployees.length, limit: 20, offset: 0, has_next: false } })),
  http.post(`${BASE_URL}/admin/employees`, async ({ request }) => {
    const body = await request.json();
    const newEmp = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone || '+62 812-0000-0000',
      role: body.role || 'STAFF',
      is_active: body.is_active !== undefined ? body.is_active : true,
      status: body.status || 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockEmployees.push(newEmp);
    return HttpResponse.json(newEmp, { status: 201 });
  }),
];

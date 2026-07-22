lucide.createIcons();

/* ---------------- AUTH (demo only — not real security) ---------------- */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

document.getElementById('loginForm').addEventListener('submit', e=>{
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if(u === ADMIN_USER && p === ADMIN_PASS){
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminShell').classList.remove('hidden');
    goToAdminPage('dashboard');
  } else {
    document.getElementById('loginError').classList.remove('hidden');
  }
});

document.getElementById('adminLogoutBtn').addEventListener('click', ()=>{
  document.getElementById('adminShell').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').classList.add('hidden');
});

/* ---------------- DATA (in-memory copy — resets on refresh, not synced to the live storefront without a backend) ---------------- */
let adminProducts = PRODUCTS.map(p => ({...p}));
let adminOrders = [
  { id:'A1B2C3', customer:'Wanjiru Kamau', email:'wanjiru@example.com', items:3, total:45850, payment:'M-Pesa', status:'delivered', date:'2026-07-14' },
  { id:'D4E5F6', customer:'Otieno Owuor', email:'otieno@example.com', items:1, total:168850, payment:'Card', status:'shipped', date:'2026-07-17' },
  { id:'G7H8I9', customer:'Amina Yusuf', email:'amina@example.com', items:2, total:64700, payment:'Pay on Delivery', status:'processing', date:'2026-07-19' },
  { id:'J1K2L3', customer:'Brian Mutiso', email:'brian@example.com', items:1, total:32350, payment:'Airtel Money', status:'pending', date:'2026-07-21' },
];

/* ---------------- ROUTING ---------------- */
function goToAdminPage(page){
  document.querySelectorAll('.admin-nav-item').forEach(b=>b.classList.toggle('active', b.dataset.adminPage===page));
  const body = document.getElementById('adminPageBody');
  if(page === 'dashboard') body.innerHTML = renderDashboard();
  else if(page === 'products') { body.innerHTML = renderProductsPage(); wireProductsPage(); }
  else if(page === 'orders') { body.innerHTML = renderOrdersPage(); wireOrdersPage(); }
  else if(page === 'settings') { body.innerHTML = renderSettingsPage(); wireSettingsPage(); }
  lucide.createIcons();
}
document.querySelectorAll('[data-admin-page]').forEach(btn=>{
  btn.addEventListener('click', ()=> goToAdminPage(btn.dataset.adminPage));
});

/* ---------------- DASHBOARD ---------------- */
function renderDashboard(){
  const totalRevenue = adminOrders.reduce((s,o)=>s+o.total,0);
  const lowStock = adminProducts.filter(p=>p.stock < 20).length;
  return `
    <h1 class="text-2xl font-bold mb-1">Dashboard</h1>
    <p class="text-sm text-neutral-500 mb-6">Welcome back — here's what's happening in your store.</p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="admin-card p-4">
        <p class="text-xs text-neutral-500 mb-1">Total Products</p>
        <p class="admin-stat-value">${adminProducts.length}</p>
      </div>
      <div class="admin-card p-4">
        <p class="text-xs text-neutral-500 mb-1">Total Orders</p>
        <p class="admin-stat-value">${adminOrders.length}</p>
      </div>
      <div class="admin-card p-4">
        <p class="text-xs text-neutral-500 mb-1">Revenue</p>
        <p class="admin-stat-value">${formatPrice(totalRevenue)}</p>
      </div>
      <div class="admin-card p-4">
        <p class="text-xs text-neutral-500 mb-1">Low Stock (&lt;20)</p>
        <p class="admin-stat-value ${lowStock>0?'text-red-600':''}">${lowStock}</p>
      </div>
    </div>
    <div class="admin-card">
      <div class="px-4 py-3 border-b border-neutral-200 font-semibold text-sm">Recent Orders</div>
      <table class="admin-table w-full">
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          ${adminOrders.slice(-5).reverse().map(o=>`
            <tr>
              <td class="font-semibold">#${o.id}</td>
              <td>${o.customer}</td>
              <td>${formatPrice(o.total)}</td>
              <td><span class="status-pill status-${o.status}">${o.status}</span></td>
              <td class="text-neutral-500">${o.date}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-xs text-neutral-400 mt-4">Note: this is a demo admin — data lives in memory for this session only. Connecting it to your real storefront and database is a backend project.</p>
  `;
}

/* ---------------- PRODUCTS ---------------- */
function renderProductsPage(){
  return `
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-bold">Products</h1>
        <p class="text-sm text-neutral-500">${adminProducts.length} products</p>
      </div>
      <button id="addProductBtn" class="bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white text-sm font-semibold px-4 py-2 rounded flex items-center gap-1.5">
        <i data-lucide="plus" class="w-4 h-4"></i> Add New Product
      </button>
    </div>
    <div class="admin-card overflow-x-auto">
      <table class="admin-table w-full">
        <thead><tr><th></th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th>Rating</th><th></th></tr></thead>
        <tbody id="productsTableBody"></tbody>
      </table>
    </div>
  `;
}

function renderProductsTable(){
  const tbody = document.getElementById('productsTableBody');
  if(!tbody) return;
  tbody.innerHTML = adminProducts.map(p=>`
    <tr>
      <td><img src="${p.img}" class="w-10 h-10 object-contain border border-neutral-100"/></td>
      <td class="font-semibold">${p.name}${p.official?' <span class=\"text-blue-600\" title=\"Official Store\">✓</span>':''}</td>
      <td>${p.category}</td>
      <td>${p.brand}</td>
      <td>${formatPrice(p.price)}${p.old?`<div class="text-neutral-400 line-through text-[11px]">${formatPrice(p.old)}</div>`:''}</td>
      <td>${p.stock < 20 ? `<span class="text-red-600 font-semibold">${p.stock}</span>` : p.stock}</td>
      <td>${p.rating} ★ (${p.reviews})</td>
      <td class="text-right whitespace-nowrap">
        <button data-edit-product="${p.id}" class="text-[var(--violet)] hover:underline text-xs font-semibold mr-3">Edit</button>
        <button data-delete-product="${p.id}" class="text-red-600 hover:underline text-xs font-semibold">Delete</button>
      </td>
    </tr>`).join('');
  lucide.createIcons();
}

function wireProductsPage(){
  renderProductsTable();
  document.getElementById('addProductBtn').addEventListener('click', ()=> openProductForm(null));
  document.getElementById('productsTableBody').addEventListener('click', e=>{
    const editBtn = e.target.closest('[data-edit-product]');
    const delBtn = e.target.closest('[data-delete-product]');
    if(editBtn) openProductForm(editBtn.dataset.editProduct);
    if(delBtn){
      if(confirm('Delete this product? This cannot be undone.')){
        adminProducts = adminProducts.filter(p=>p.id !== delBtn.dataset.deleteProduct);
        renderProductsTable();
        adminToast('Product deleted');
      }
    }
  });
}

function openProductForm(productId){
  const editing = !!productId;
  const p = editing ? adminProducts.find(x=>x.id===productId) : null;
  document.getElementById('productFormTitle').textContent = editing ? 'Edit Product' : 'Add New Product';
  document.getElementById('productFormBody').innerHTML = `
    <form id="productForm" class="space-y-3">
      <div>
        <label class="text-xs font-semibold text-neutral-600">Product Name</label>
        <input required name="name" value="${p?p.name:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-neutral-600">Category</label>
          <select name="category" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]">
            ${CATS.map(c=>`<option value="${c.category}" ${p&&p.category===c.category?'selected':''}>${c.category}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-neutral-600">Brand</label>
          <input name="brand" value="${p?p.brand:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-neutral-600">Price (KSh)</label>
          <input required type="number" min="0" name="price" value="${p?p.price:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <div>
          <label class="text-xs font-semibold text-neutral-600">Old Price (optional)</label>
          <input type="number" min="0" name="old" value="${p&&p.old?p.old:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-neutral-600">Stock Quantity</label>
          <input required type="number" min="0" name="stock" value="${p?p.stock:0}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <div class="flex items-center gap-2 pt-6">
          <input type="checkbox" name="official" id="officialCheck" ${p&&p.official?'checked':''} class="accent-[var(--violet)]"/>
          <label for="officialCheck" class="text-xs font-semibold text-neutral-600">Official Store</label>
        </div>
      </div>
      <div>
        <label class="text-xs font-semibold text-neutral-600">Image URL</label>
        <input required name="img" value="${p?p.img:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
      </div>
      <div>
        <label class="text-xs font-semibold text-neutral-600">Short Spec (e.g. "256GB, Black")</label>
        <input name="spec" value="${p?p.spec:''}" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
      </div>
      <div>
        <label class="text-xs font-semibold text-neutral-600">Description</label>
        <textarea name="desc" rows="3" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]">${p?p.desc:''}</textarea>
      </div>
      <button type="submit" class="w-full bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold py-2.5 rounded text-sm">${editing?'Save Changes':'Add Product'}</button>
    </form>
  `;
  document.getElementById('productForm').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      category: fd.get('category'),
      brand: fd.get('brand') || 'Generic',
      price: Number(fd.get('price')),
      old: fd.get('old') ? Number(fd.get('old')) : null,
      stock: Number(fd.get('stock')),
      official: fd.get('official') === 'on',
      img: fd.get('img'),
      spec: fd.get('spec') || '',
      desc: fd.get('desc') || '',
    };
    if(editing){
      Object.assign(p, data);
      adminToast('Product updated');
    } else {
      const newId = data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Math.random().toString(36).slice(2,6);
      adminProducts.unshift({ id:newId, off:null, rating:5.0, reviews:0, badge:'New', ...data });
      adminToast('Product added');
    }
    closeProductForm();
    renderProductsTable();
  });
  document.getElementById('productFormOverlay').classList.remove('hidden');
}
function closeProductForm(){
  document.getElementById('productFormOverlay').classList.add('hidden');
}
document.getElementById('closeProductForm').addEventListener('click', closeProductForm);
document.getElementById('productFormOverlay').addEventListener('click', e=>{
  if(e.target.id === 'productFormOverlay') closeProductForm();
});

/* ---------------- ORDERS ---------------- */
function renderOrdersPage(){
  return `
    <h1 class="text-2xl font-bold mb-1">Orders</h1>
    <p class="text-sm text-neutral-500 mb-4">Sample orders for this demo admin — a real store would pull these from your database.</p>
    <div class="admin-card overflow-x-auto">
      <table class="admin-table w-full">
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
        <tbody id="ordersTableBody"></tbody>
      </table>
    </div>
  `;
}
function renderOrdersTable(){
  const tbody = document.getElementById('ordersTableBody');
  if(!tbody) return;
  tbody.innerHTML = adminOrders.slice().reverse().map(o=>`
    <tr>
      <td class="font-semibold">#${o.id}</td>
      <td>${o.customer}<div class="text-neutral-400 text-[11px]">${o.email}</div></td>
      <td>${o.items}</td>
      <td>${formatPrice(o.total)}</td>
      <td>${o.payment}</td>
      <td>
        <select data-order-status="${o.id}" class="status-pill status-${o.status} border-0 outline-none cursor-pointer">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
          <option value="processing" ${o.status==='processing'?'selected':''}>Processing</option>
          <option value="shipped" ${o.status==='shipped'?'selected':''}>Shipped</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
        </select>
      </td>
      <td class="text-neutral-500">${o.date}</td>
    </tr>`).join('');
}
function wireOrdersPage(){
  renderOrdersTable();
  document.getElementById('ordersTableBody').addEventListener('change', e=>{
    const sel = e.target.closest('[data-order-status]');
    if(!sel) return;
    const order = adminOrders.find(o=>o.id === sel.dataset.orderStatus);
    order.status = sel.value;
    sel.className = `status-pill status-${order.status} border-0 outline-none cursor-pointer`;
    adminToast(`Order #${order.id} marked ${order.status}`);
  });
}

/* ---------------- SETTINGS ---------------- */
function renderSettingsPage(){
  return `
    <h1 class="text-2xl font-bold mb-1">Settings</h1>
    <p class="text-sm text-neutral-500 mb-4">Store details. Demo only — saving here doesn't change the live storefront without a backend.</p>
    <div class="admin-card p-5 max-w-lg">
      <form id="settingsForm" class="space-y-3">
        <div>
          <label class="text-xs font-semibold text-neutral-600">Store Name</label>
          <input name="storeName" value="Thomex" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <div>
          <label class="text-xs font-semibold text-neutral-600">Support Email</label>
          <input name="supportEmail" value="support@thomex.co.ke" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <div>
          <label class="text-xs font-semibold text-neutral-600">Currency Prefix</label>
          <input name="currency" value="KSh" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <div>
          <label class="text-xs font-semibold text-neutral-600">Flat Delivery Fee (KSh)</label>
          <input type="number" name="deliveryFee" value="200" class="w-full mt-1 border border-neutral-300 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
        <button type="submit" class="bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold px-5 py-2.5 rounded text-sm">Save Changes</button>
      </form>
    </div>
  `;
}
function wireSettingsPage(){
  document.getElementById('settingsForm').addEventListener('submit', e=>{
    e.preventDefault();
    adminToast('Settings saved (this session only)');
  });
}

/* ---------------- TOAST ---------------- */
let adminToastTimer;
function adminToast(text){
  const t = document.getElementById('adminToast');
  document.getElementById('adminToastText').textContent = text;
  t.classList.remove('hidden'); t.classList.add('flex');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(()=>{ t.classList.add('hidden'); t.classList.remove('flex'); }, 2200);
}

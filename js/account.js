/* ---------------- ACCOUNT ---------------- */
let currentUser = null; // {name, email, phone}
let orders = [];        // {id, items, total, address, payment, date}
let accountMode = 'login'; // 'login' | 'signup'

function updateAccountUI(){
  const label = document.getElementById('accountLabel');
  if(label) label.textContent = currentUser ? currentUser.name.split(' ')[0] : 'Account';
}

/* Entry point from header/bottom-nav: logged in -> account page, otherwise -> login modal */
function openAccountModal(){
  if(currentUser){
    renderAccountPage();
    showPage('accountPage');
  } else {
    renderAuthModal();
    document.getElementById('accountOverlay').classList.remove('hidden');
    requestAnimationFrame(()=>document.getElementById('accountOverlay').classList.remove('opacity-0'));
  }
}
function closeAccountModal(){
  document.getElementById('accountOverlay').classList.add('opacity-0');
  setTimeout(()=>document.getElementById('accountOverlay').classList.add('hidden'), 250);
}

function renderAuthModal(){
  const body = document.getElementById('accountModalBody');
  body.innerHTML = `
    <div class="flex mb-5 border-b border-neutral-200">
      <button id="tabLogin" class="flex-1 pb-2 text-sm font-semibold ${accountMode==='login'?'text-[var(--violet)] border-b-2 border-[var(--violet)]':'text-neutral-400'}">Log In</button>
      <button id="tabSignup" class="flex-1 pb-2 text-sm font-semibold ${accountMode==='signup'?'text-[var(--violet)] border-b-2 border-[var(--violet)]':'text-neutral-400'}">Sign Up</button>
    </div>
    <form id="authForm" class="space-y-3">
      ${accountMode==='signup' ? `<input required name="name" placeholder="Full Name" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>` : ''}
      <input required name="email" type="email" placeholder="Email Address" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
      <input required name="password" type="password" placeholder="Password" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
      <button type="submit" class="w-full bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold py-2.5 rounded">${accountMode==='signup'?'Create Account':'Log In'}</button>
    </form>
    <p class="text-[10px] text-neutral-400 mt-3 text-center">Demo only — no real account is created or emailed.</p>
  `;
  document.getElementById('tabLogin').addEventListener('click', ()=>{ accountMode='login'; renderAuthModal(); });
  document.getElementById('tabSignup').addEventListener('click', ()=>{ accountMode='signup'; renderAuthModal(); });
  document.getElementById('authForm').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = fd.get('email');
    const name = accountMode==='signup' ? fd.get('name') : email.split('@')[0];
    currentUser = { name, email };
    updateAccountUI();
    closeAccountModal();
    renderAccountPage();
    showPage('accountPage');
    showToast(`Welcome, ${currentUser.name.split(' ')[0]}!`);
  });
  lucide.createIcons();
}

/* Full account page — shown once logged in, matches the Jumia account hub layout */
function renderAccountPage(){
  if(!currentUser) return;
  const body = document.getElementById('accountPageBody');
  const optionRow = (icon, label, onclickAttr) => `
    <button ${onclickAttr} class="w-full flex items-center justify-between px-3 py-3 border-b border-neutral-100 text-left hover:bg-neutral-50">
      <span class="flex items-center gap-3 text-sm"><i data-lucide="${icon}" class="w-4 h-4 text-neutral-600"></i>${label}</span>
      <i data-lucide="chevron-right" class="w-4 h-4 text-neutral-400"></i>
    </button>`;

  body.innerHTML = `
    <p class="text-lg font-bold">Welcome ${currentUser.name.split(' ')[0]}!</p>
    <p class="text-xs text-[var(--violet)] mb-4">${currentUser.email}</p>
    <div class="flex items-center gap-2 text-xs text-neutral-600 mb-4">
      <i data-lucide="wallet" class="w-4 h-4 text-[var(--violet)]"></i> Thomex balance: KSh 0
    </div>
    <div class="grid grid-cols-2 gap-2 mb-6">
      <button data-info="help" class="bg-[var(--violet)] text-white text-sm font-semibold py-2.5 rounded flex items-center justify-center gap-2"><i data-lucide="message-square" class="w-4 h-4"></i>Live Chat</button>
      <button data-social="WhatsApp" class="border border-green-500 text-green-600 text-sm font-semibold py-2.5 rounded flex items-center justify-center gap-2"><i data-lucide="message-circle" class="w-4 h-4"></i>WhatsApp</button>
    </div>

    <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Need Assistance?</p>
    <div class="border border-neutral-100 mb-5">${optionRow('info', 'Help & Support', `data-info="help"`)}</div>

    <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">My Thomex Account</p>
    <div class="border border-neutral-100 mb-5" id="accountOptionsList">
      ${optionRow('package', `Orders (${orders.length})`, `data-account-action="orders"`)}
      ${optionRow('mail', 'Inbox', `data-info="help"`)}
      ${optionRow('edit-3', 'Ratings &amp; Reviews', `data-info="help"`)}
      ${optionRow('ticket', 'Vouchers', `data-info="help"`)}
      ${optionRow('heart', `Wishlist (${wishlist.size})`, `data-account-action="wishlist"`)}
      ${optionRow('store', 'Follow Seller', `data-info="help"`)}
      ${optionRow('history', `Recently Viewed (${recentlyViewed.length})`, `data-account-action="recent"`)}
    </div>

    <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">My Settings</p>
    <div class="border border-neutral-100 mb-6">${optionRow('credit-card', 'Payment Settings', `data-info="help"`)}</div>

    <button id="logoutBtn" class="w-full border border-neutral-200 text-sm font-semibold py-2.5 hover:bg-neutral-50 mb-8">Log Out</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    currentUser=null; updateAccountUI(); showPage('mainContent'); showToast('Logged out');
  });
  lucide.createIcons();
}

document.addEventListener('click', e=>{
  const actionBtn = e.target.closest('[data-account-action]');
  if(!actionBtn) return;
  const action = actionBtn.dataset.accountAction;
  if(action === 'orders') showProductList('My Orders', orders.length ? orders.flatMap(o=>o.items.map(i=>i.id)) : []);
  else if(action === 'wishlist') runSearchWishlist();
  else if(action === 'recent') showProductList('Recently Viewed', recentlyViewed);
});

document.getElementById('accountBtn')?.addEventListener('click', openAccountModal);
document.getElementById('closeAccount').addEventListener('click', closeAccountModal);
document.getElementById('accountOverlay').addEventListener('click', e=>{ if(e.target.id==='accountOverlay') closeAccountModal(); });

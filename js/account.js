/* ---------------- ACCOUNT ---------------- */
let currentUser = null; // {name, email, phone}
let orders = [];        // {id, items, total, address, payment, date}
let accountMode = 'login'; // 'login' | 'signup'

function updateAccountUI(){
  const label = document.getElementById('accountLabel');
  if(label) label.textContent = currentUser ? currentUser.name.split(' ')[0] : 'Account';
}

function openAccountModal(){
  renderAccountModal();
  document.getElementById('accountOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>document.getElementById('accountOverlay').classList.remove('opacity-0'));
}
function closeAccountModal(){
  document.getElementById('accountOverlay').classList.add('opacity-0');
  setTimeout(()=>document.getElementById('accountOverlay').classList.add('hidden'), 250);
}

function renderAccountModal(){
  const body = document.getElementById('accountModalBody');
  if(currentUser){
    body.innerHTML = `
      <div class="flex items-center gap-3 mb-5">
        <div class="w-12 h-12 rounded-full bg-[var(--violet)] text-white flex items-center justify-center font-bold text-lg">${currentUser.name.charAt(0).toUpperCase()}</div>
        <div>
          <p class="font-bold">${currentUser.name}</p>
          <p class="text-xs text-neutral-500">${currentUser.email}</p>
        </div>
      </div>
      <div class="border-t border-neutral-100 pt-4">
        <p class="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-2">My Orders (${orders.length})</p>
        ${orders.length === 0 ? `<p class="text-sm text-neutral-500">No orders yet — start shopping!</p>` :
          `<div class="space-y-2 max-h-40 overflow-y-auto">${orders.slice().reverse().map(o=>`
            <div class="border border-neutral-200 p-2 text-xs flex items-center justify-between">
              <div><p class="font-semibold">#${o.id}</p><p class="text-neutral-400">${o.date}</p></div>
              <p class="font-bold">${formatPrice(o.total)}</p>
            </div>`).join('')}</div>`}
      </div>
      <button id="logoutBtn" class="w-full mt-5 border border-neutral-200 text-sm font-semibold py-2.5 hover:bg-neutral-50">Log Out</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', ()=>{ currentUser=null; updateAccountUI(); renderAccountModal(); showToast('Logged out'); });
  } else {
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
    document.getElementById('tabLogin').addEventListener('click', ()=>{ accountMode='login'; renderAccountModal(); });
    document.getElementById('tabSignup').addEventListener('click', ()=>{ accountMode='signup'; renderAccountModal(); });
    document.getElementById('authForm').addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = fd.get('email');
      const name = accountMode==='signup' ? fd.get('name') : email.split('@')[0];
      currentUser = { name, email };
      updateAccountUI();
      renderAccountModal();
      showToast(`Welcome, ${currentUser.name.split(' ')[0]}!`);
    });
  }
  lucide.createIcons();
}

document.getElementById('accountBtn')?.addEventListener('click', openAccountModal);
document.getElementById('closeAccount').addEventListener('click', closeAccountModal);
document.getElementById('accountOverlay').addEventListener('click', e=>{ if(e.target.id==='accountOverlay') closeAccountModal(); });


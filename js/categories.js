/* ---------------- CATEGORIES PAGE ---------------- */
let activeCategoryTab = CATS[0].category;

function openCategoriesPage(){
  renderCategoriesPage();
  showPage('categoriesPage');
}

function renderCategoriesPage(){
  const tabs = document.getElementById('categoriesTabs');
  tabs.innerHTML = CATS.map(c=>`
    <button data-cat-tab="${c.category}" class="cat-tab-btn w-full text-left text-xs px-2 py-3 border-b border-neutral-100 ${activeCategoryTab===c.category ? 'bg-white font-semibold text-[var(--violet)] border-l-2 border-l-[var(--violet)]' : 'bg-neutral-50 text-neutral-600'}">${c.name}</button>
  `).join('');
  renderCategoriesContent(activeCategoryTab);
}

function renderCategoriesContent(category){
  activeCategoryTab = category;
  const items = PRODUCTS.filter(p=>p.category===category);
  const brands = [...new Set(items.map(p=>p.brand))];
  document.getElementById('categoriesContent').innerHTML = `
    <div class="border border-neutral-100 mb-3">
      <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
        <h3 class="text-sm font-bold">${category}</h3>
        <button data-filter-cat="${category}" class="text-xs text-[var(--violet)] font-semibold hover:underline">See All</button>
      </div>
      <div class="grid grid-cols-3 gap-3 p-3">
        ${brands.slice(0,6).map(b=>`
          <button data-collection="brand:${b}" class="flex flex-col items-center gap-1 text-center">
            <div class="w-14 h-14 bg-neutral-50 border border-neutral-100 flex items-center justify-center overflow-hidden">
              <img src="${items.find(p=>p.brand===b).img}" class="w-10 h-10 object-contain"/>
            </div>
            <p class="text-[10px] leading-tight">${b}</p>
          </button>`).join('')}
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-1.5">
      ${items.map(p=>productCard(p)).join('')}
    </div>
  `;
  lucide.createIcons();
}

document.addEventListener('click', e=>{
  const tabBtn = e.target.closest('[data-cat-tab]');
  if(tabBtn){ activeCategoryTab = tabBtn.dataset.catTab; renderCategoriesPage(); }
});

/* Generic "show a fixed list of products" view — used by View All / See All / collection links */
function showProductList(title, ids){
  showPage('searchResults');
  document.getElementById('searchResultsTitle').textContent = title;
  const grid = document.getElementById('searchResultsGrid');
  const empty = document.getElementById('searchEmpty');
  const items = ids.map(id=>byId(id)).filter(Boolean);
  if(items.length === 0){ grid.innerHTML=''; empty.textContent='No products in this list yet.'; empty.classList.remove('hidden'); }
  else { empty.classList.add('hidden'); grid.innerHTML = items.map(p=>productCard(p)).join(''); }
  document.getElementById('filterDrawer')?.classList.add('translate-x-full');
  lucide.createIcons();
  window.scrollTo({top:0, behavior:'smooth'});
}

document.addEventListener('click', e=>{
  const viewAll = e.target.closest('[data-view-all]');
  if(viewAll){
    e.preventDefault();
    const key = viewAll.dataset.viewAll;
    const map = { collections: ['macbook-air-m2','ipad-air','dji-mini-3','mx-master-3s'], flash: FLASH_IDS, arrivals: ARRIVAL_IDS, bestsellers: BESTSELLER_IDS };
    const titles = { collections:'Featured Collections', flash:'Flash Sales', arrivals:'New Arrivals', bestsellers:'Best Sellers' };
    showProductList(titles[key], map[key] || []);
    return;
  }
  const viewAllKey = e.target.closest('[data-view-all-key]');
  if(viewAllKey){
    e.preventDefault();
    const key = viewAllKey.dataset.viewAllKey;
    const titleEl = viewAllKey.closest('section')?.querySelector('h3');
    showProductList(titleEl ? titleEl.textContent : 'Deals', DEAL_ROW_IDS[key] || []);
    return;
  }
  const collectionEl = e.target.closest('[data-collection]');
  if(collectionEl){
    const [type, value] = collectionEl.dataset.collection.split(':');
    if(type === 'brand') showProductList(value + ' Collection', PRODUCTS.filter(p=>p.brand===value).map(p=>p.id));
    else runSearch('', value);
    return;
  }
  const social = e.target.closest('[data-social]');
  if(social){ e.preventDefault(); showToast(`${social.dataset.social} — coming soon`); return; }
  const info = e.target.closest('[data-info]');
  if(info){
    if(info.dataset.info === 'sell') showToast('Seller sign-up — coming soon');
    else if(info.dataset.info === 'help') showToast('Need help? Email support@thomex.co.ke');
    return;
  }
});

/* Categories mega-menu (desktop) */
document.getElementById('categoriesNavBtn')?.addEventListener('click', e=>{
  e.stopPropagation();
  document.getElementById('categoriesMegaMenu')?.classList.toggle('hidden');
});
document.addEventListener('click', e=>{
  const menu = document.getElementById('categoriesMegaMenu');
  if(menu && !menu.classList.contains('hidden') && !e.target.closest('#categoriesMegaMenu') && !e.target.closest('#categoriesNavBtn')){
    menu.classList.add('hidden');
  }
});

/* nav links: return to the homepage first if another page is showing, then scroll to the section */
function isOnMainContent(){ return !document.getElementById('mainContent').classList.contains('hidden'); }

document.addEventListener('click', e=>{
  const el = e.target.closest('[data-nav]');
  if(!el) return;
  e.preventDefault();
  if(el.dataset.nav === 'mainContent'){ showPage('mainContent'); return; }
  if(!isOnMainContent()) showPage('mainContent');
  requestAnimationFrame(()=> document.getElementById(el.dataset.nav)?.scrollIntoView({behavior:'smooth'}));
});

document.getElementById('logoBtn')?.addEventListener('click', ()=> showPage('mainContent'));

/* MOBILE BOTTOM NAV */
function setActiveBottomNav(key){
  document.querySelectorAll('.bottomnav-btn').forEach(b=>b.classList.toggle('active', b.dataset.bottomnav===key));
}
document.querySelectorAll('[data-bottomnav]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const key = btn.dataset.bottomnav;
    setActiveBottomNav(key);
    if(key === 'home'){
      showPage('mainContent');
    } else if(key === 'categories'){
      openCategoriesPage();
    } else if(key === 'cart'){
      openCart();
    } else if(key === 'wishlist'){
      runSearchWishlist();
    } else if(key === 'account'){
      openAccountModal();
    }
  });
});

function runSearchWishlist(){
  showPage('searchResults');
  document.getElementById('searchResultsTitle').textContent = 'Your Wishlist';
  const grid = document.getElementById('searchResultsGrid');
  const empty = document.getElementById('searchEmpty');
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  if(items.length === 0){ grid.innerHTML=''; empty.textContent='Nothing in your wishlist yet — tap the heart on any product to save it here.'; empty.classList.remove('hidden'); }
  else { empty.classList.add('hidden'); grid.innerHTML = items.map(p=>productCard(p)).join(''); }
  lucide.createIcons();
  window.scrollTo({top:0, behavior:'smooth'});
}

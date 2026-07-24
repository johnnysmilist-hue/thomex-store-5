/* ---------------- SEARCH / FILTER ---------------- */
const filterState = { query:'', categories:new Set(), brands:new Set(), minPrice:null, maxPrice:null, minRating:0, sort:'default' };

const PAGES = ['mainContent','searchResults','cartPage','productPage','categoriesPage','accountPage'];
function showPage(id){
  PAGES.forEach(p => document.getElementById(p)?.classList.toggle('hidden', p!==id));
  const stickyBar = document.getElementById('cartStickyBar');
  if(stickyBar){
    stickyBar.classList.toggle('hidden', id!=='cartPage');
    stickyBar.classList.toggle('flex', id==='cartPage');
  }
  window.scrollTo({top:0, behavior:'smooth'});
}

function runSearch(query, category){
  filterState.query = (query||'').trim();
  filterState.categories = category ? new Set([category]) : new Set();
  applyFilters();
}

function applyFilters(){
  const q = filterState.query.trim().toLowerCase();
  let results = PRODUCTS.filter(p=>{
    if(q && !(p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.spec.toLowerCase().includes(q))) return false;
    if(filterState.categories.size && !filterState.categories.has(p.category)) return false;
    if(filterState.brands.size && !filterState.brands.has(p.brand)) return false;
    if(filterState.minPrice!=null && p.price < filterState.minPrice) return false;
    if(filterState.maxPrice!=null && p.price > filterState.maxPrice) return false;
    if(filterState.minRating && p.rating < filterState.minRating) return false;
    return true;
  });

  if(filterState.sort === 'price-asc') results = results.slice().sort((a,b)=>a.price-b.price);
  else if(filterState.sort === 'price-desc') results = results.slice().sort((a,b)=>b.price-a.price);
  else if(filterState.sort === 'rating') results = results.slice().sort((a,b)=>b.rating-a.rating);

  showPage('searchResults');
  const catLabel = filterState.categories.size === 1 ? [...filterState.categories][0] : null;
  document.getElementById('searchResultsTitle').textContent = catLabel ? catLabel : (filterState.query ? `Results for "${filterState.query}"` : 'All Products');
  document.getElementById('searchResultsCount').textContent = `${results.length} product${results.length===1?'':'s'} found`;

  const activeFilterCount = filterState.categories.size + filterState.brands.size + (filterState.minPrice!=null?1:0) + (filterState.maxPrice!=null?1:0) + (filterState.minRating?1:0);
  const badge = document.getElementById('filterActiveCount');
  badge.textContent = activeFilterCount;
  badge.classList.toggle('hidden', activeFilterCount===0);
  badge.classList.toggle('flex', activeFilterCount>0);

  const grid = document.getElementById('searchResultsGrid');
  const empty = document.getElementById('searchEmpty');
  if(results.length === 0){
    grid.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    grid.innerHTML = results.map(p=>productCard(p)).join('');
  }
  renderFilterChips();
  lucide.createIcons();
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderFilterChips(){
  const catBox = document.getElementById('filterCategories');
  const brandBox = document.getElementById('filterBrands');
  const ratingBox = document.getElementById('filterRating');
  if(!catBox) return;

  const uniqueCats = [...new Set(PRODUCTS.map(p=>p.category))];
  catBox.innerHTML = uniqueCats.map(c=>`
    <button data-chip-cat="${c}" class="filter-chip text-xs font-medium px-3 py-1.5 rounded-full border ${filterState.categories.has(c) ? 'bg-[var(--violet)] text-white border-[var(--violet)]' : 'border-neutral-200 text-neutral-600 hover:border-[var(--violet)]'}">${c}</button>`).join('');

  const uniqueBrands = [...new Set(PRODUCTS.map(p=>p.brand))];
  brandBox.innerHTML = uniqueBrands.map(b=>`
    <button data-chip-brand="${b}" class="filter-chip text-xs font-medium px-3 py-1.5 rounded-full border ${filterState.brands.has(b) ? 'bg-[var(--violet)] text-white border-[var(--violet)]' : 'border-neutral-200 text-neutral-600 hover:border-[var(--violet)]'}">${b}</button>`).join('');

  const ratingOpts = [4,3,2,0];
  ratingBox.innerHTML = ratingOpts.map(r=>`
    <button data-chip-rating="${r}" class="filter-chip text-xs font-medium px-3 py-1.5 rounded-full border ${filterState.minRating===r ? 'bg-[var(--violet)] text-white border-[var(--violet)]' : 'border-neutral-200 text-neutral-600 hover:border-[var(--violet)]'}">${r===0 ? 'Any' : r+'★ & up'}</button>`).join('');

  document.getElementById('filterMinPrice').value = filterState.minPrice ?? '';
  document.getElementById('filterMaxPrice').value = filterState.maxPrice ?? '';
  lucide.createIcons();
}

function clearSearch(){
  showPage('mainContent');
  document.getElementById('searchEmpty').textContent = 'No products match your search. Try a different term or category.';
  ['searchInput','searchInputMobile'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  ['searchSuggest','searchSuggestMobile'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  document.querySelectorAll('.bottomnav-btn').forEach(b=>b.classList.toggle('active', b.dataset.bottomnav==='home'));
  filterState.query=''; filterState.categories=new Set(); filterState.brands=new Set();
  filterState.minPrice=null; filterState.maxPrice=null; filterState.minRating=0; filterState.sort='default';
  document.getElementById('sortSelect').value = 'default';
}

document.getElementById('clearSearch').addEventListener('click', clearSearch);

/* Filters drawer open/close */
function openFilterDrawer(){
  renderFilterChips();
  document.getElementById('filterOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>document.getElementById('filterOverlay').classList.remove('opacity-0'));
  document.getElementById('filterDrawer').classList.remove('translate-x-full');
}
function closeFilterDrawer(){
  document.getElementById('filterOverlay').classList.add('opacity-0');
  document.getElementById('filterDrawer').classList.add('translate-x-full');
  setTimeout(()=>document.getElementById('filterOverlay').classList.add('hidden'), 300);
}
document.getElementById('openFilters').addEventListener('click', openFilterDrawer);
document.getElementById('closeFilters').addEventListener('click', closeFilterDrawer);
document.getElementById('filterOverlay').addEventListener('click', e=>{ if(e.target.id==='filterOverlay') closeFilterDrawer(); });

document.addEventListener('click', e=>{
  const catChip = e.target.closest('[data-chip-cat]');
  if(catChip){ const c=catChip.dataset.chipCat; filterState.categories.has(c)?filterState.categories.delete(c):filterState.categories.add(c); renderFilterChips(); return; }
  const brandChip = e.target.closest('[data-chip-brand]');
  if(brandChip){ const b=brandChip.dataset.chipBrand; filterState.brands.has(b)?filterState.brands.delete(b):filterState.brands.add(b); renderFilterChips(); return; }
  const ratingChip = e.target.closest('[data-chip-rating]');
  if(ratingChip){ filterState.minRating = Number(ratingChip.dataset.chipRating); renderFilterChips(); return; }
});

document.getElementById('applyFilters').addEventListener('click', ()=>{
  filterState.minPrice = document.getElementById('filterMinPrice').value ? Number(document.getElementById('filterMinPrice').value) : null;
  filterState.maxPrice = document.getElementById('filterMaxPrice').value ? Number(document.getElementById('filterMaxPrice').value) : null;
  applyFilters();
  closeFilterDrawer();
});
document.getElementById('clearFilters').addEventListener('click', ()=>{
  filterState.categories=new Set(); filterState.brands=new Set(); filterState.minPrice=null; filterState.maxPrice=null; filterState.minRating=0;
  renderFilterChips();
  applyFilters();
});
document.getElementById('sortSelect').addEventListener('change', e=>{ filterState.sort = e.target.value; applyFilters(); });

/* Wire up a search input + button + suggestion box (used for both desktop and mobile bars) */
function wireSearchBar(inputId, btnId, suggestId){
  const input = document.getElementById(inputId);
  const suggest = document.getElementById(suggestId);
  if(!input || !suggest) return;
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ suggest.classList.add('hidden'); return; }
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0,5);
    if(matches.length === 0){ suggest.classList.add('hidden'); return; }
    suggest.innerHTML = matches.map(p=>`
      <div data-suggest="${p.id}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 cursor-pointer">
        <img src="${p.img}" class="w-9 h-9 rounded-lg object-cover"/>
        <div class="flex-1"><p class="text-xs font-semibold">${p.name}</p><p class="text-[10px] text-neutral-400">${p.category}</p></div>
        <p class="text-xs font-bold">${formatPrice(p.price)}</p>
      </div>`).join('');
    suggest.classList.remove('hidden');
  });
  input.addEventListener('keydown', e=>{
    if(e.key === 'Enter'){ runSearch(input.value, null); suggest.classList.add('hidden'); input.blur(); }
  });
  if(btnId) document.getElementById(btnId)?.addEventListener('click', ()=> runSearch(input.value, null));
}
wireSearchBar('searchInput', 'searchBtn', 'searchSuggest');
wireSearchBar('searchInputMobile', 'searchBtnMobile', 'searchSuggestMobile');

document.addEventListener('click', e=>{
  const s = e.target.closest('[data-suggest]');
  if(s){
    openProduct(s.dataset.suggest);
    ['searchSuggest','searchSuggestMobile'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
    ['searchInput','searchInputMobile'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    return;
  }
  if(!e.target.closest('#searchInput') && !e.target.closest('#searchInputMobile')){
    ['searchSuggest','searchSuggestMobile'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  }
});

/* category filter clicks */
document.addEventListener('click', e=>{
  const catEl = e.target.closest('[data-filter-cat]');
  if(catEl){
    runSearch('', catEl.dataset.filterCat);
    document.getElementById('categoriesMegaMenu')?.classList.add('hidden');
  }
});


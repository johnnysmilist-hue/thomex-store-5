/* ---------------- RENDER HELPERS ---------------- */
function stars(rating){
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

function priceHtml(p){
  return `<p class="text-sm font-bold text-[var(--red)]">${formatPrice(p.price)}</p>${p.old ? `<p class="text-[10px] text-neutral-400 line-through">${formatPrice(p.old)}</p>` : ''}`;
}

function offLabel(p){
  if(p.off) return p.off;
  if(p.old && p.old > p.price){
    const pct = Math.round((1 - p.price/p.old) * 100);
    if(pct > 0) return `-${pct}%`;
  }
  return null;
}

function productCard(p, opts={}){
  const widthCls = opts.scroll ? 'w-28 md:w-auto shrink-0' : '';
  const off = offLabel(p);
  return `
  <div class="prod-card ${widthCls} border border-neutral-200 p-1.5 hover:shadow-md transition relative bg-white" data-open-product="${p.id}">
    ${off ? `<span class="discount-ribbon absolute top-1 left-1 text-white text-[10px] font-bold px-1.5 py-0.5 z-10 rounded-sm">${off}</span>` : (p.badge ? `<span class="absolute top-1 left-1 bg-neutral-800 text-white text-[9px] font-bold px-1.5 py-0.5 z-10 rounded-sm">${p.badge}</span>` : '')}
    <button data-wish="${p.id}" class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center z-10"><i data-lucide="heart" class="w-3.5 h-3.5 ${wishlist.has(p.id)?'text-red-500 fill-red-500':'text-neutral-300'}"></i></button>
    <img src="${p.img}" class="w-full h-20 md:h-32 object-contain mb-1" alt="${p.name}"/>
    ${p.official ? `<span class="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 mb-0.5"><i data-lucide="badge-check" class="w-3 h-3"></i>Official Store</span>` : ''}
    <p class="text-[11px] md:text-xs text-neutral-700 leading-tight line-clamp-2 min-h-[2.2em]">${p.name}</p>
    <div class="mt-1 flex items-baseline gap-1">${priceHtml(p)}</div>
    <p class="text-[10px] star mt-0.5">${stars(p.rating)} <span class="text-neutral-400">(${p.reviews})</span></p>
    <button data-add="${p.id}" class="absolute bottom-1.5 right-1.5 w-6 h-6 flex items-center justify-center text-[var(--violet)] hover:bg-orange-50 rounded-full"><i data-lucide="shopping-cart" class="w-4 h-4"></i></button>
    ${opts.showStock ? `<div class="mt-1.5 h-1 bg-neutral-100 overflow-hidden"><div class="h-full bg-[var(--red)]" style="width:${Math.min(100, p.stock)}%"></div></div><p class="text-[10px] text-neutral-400 mt-0.5">${p.stock} items left</p>` : ''}
  </div>`;
}

const CIRCLE_BG = ['#FFF3E0','#E8F5E9','#E3F2FD','#FCE4EC','#FFFDE7','#EDE7F6'];

function renderAll(){
  const sidebar = document.getElementById('sidebarCats');
  if(sidebar){
    sidebar.innerHTML = CATS.map(c=>`
      <button data-filter-cat="${c.category}" class="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-[var(--violet)] border-b border-neutral-100 last:border-0">
        <i data-lucide="${c.icon}" class="w-4 h-4 shrink-0"></i> ${c.name}
      </button>`).join('');
  }

  const circleCats = document.getElementById('circleCats');
  if(circleCats){
    circleCats.innerHTML = CATS.map((c,i)=>`
      <div data-filter-cat="${c.category}" class="prod-card w-20 md:w-auto shrink-0 flex flex-col items-center gap-1.5 text-center">
        <div class="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center" style="background:${CIRCLE_BG[i % CIRCLE_BG.length]}">
          <i data-lucide="${c.icon}" class="w-6 h-6 text-neutral-700"></i>
        </div>
        <p class="text-[10px] font-medium leading-tight">${c.name}</p>
      </div>`).join('');
  }

  const hotCats = document.getElementById('hotCatsGrid');
  if(hotCats){
    hotCats.innerHTML = CATS.map((c,i)=>`
      <div data-filter-cat="${c.category}" class="hotcat-tile prod-card flex flex-col items-center gap-1 text-center p-2 rounded-lg">
        <div class="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center" style="background:${CIRCLE_BG[i % CIRCLE_BG.length]}">
          <i data-lucide="${c.icon}" class="w-4 h-4 md:w-5 md:h-5 text-[var(--violet)]"></i>
        </div>
        <p class="text-[9px] md:text-[10px] font-medium leading-tight">${c.name}</p>
      </div>`).join('');
  }

  const catStrip = document.getElementById('catStripLinks');
  if(catStrip){
    catStrip.innerHTML = CATS.map(c=>`<button data-filter-cat="${c.category}" class="hover:text-[var(--violet)]">${c.name}</button>`).join('');
  }

  const megaMenu = document.getElementById('categoriesMegaMenu');
  if(megaMenu){
    megaMenu.innerHTML = CATS.map(c=>`
      <div data-filter-cat="${c.category}" class="flex items-center gap-2 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer">
        <i data-lucide="${c.icon}" class="w-5 h-5 text-[var(--violet)]"></i>
        <p class="text-sm font-medium">${c.name}</p>
      </div>`).join('');
  }

  document.getElementById('collections').innerHTML = COLLECTIONS.map(c=>`
    <div data-collection="${c.brand?('brand:'+c.brand):('cat:'+c.category)}" class="prod-card border border-neutral-200 p-3 hover:shadow-md transition">
      <img src="${c.img}" class="w-full h-24 object-cover mb-2" alt="${c.name}"/>
      <h4 class="font-bold text-sm font-display">${c.name}</h4>
      <span class="text-xs text-[var(--violet)] font-semibold flex items-center gap-1 mt-1">${c.tag} <i data-lucide="arrow-right" class="w-3 h-3"></i></span>
    </div>`).join('');

  document.getElementById('flashGrid').innerHTML = FLASH_IDS.map(id=>productCard(byId(id), {scroll:true, showStock:true})).join('');
  document.getElementById('arrivalsGrid').innerHTML = ARRIVAL_IDS.map(id=>productCard(byId(id))).join('');

  document.getElementById('bestsellers').innerHTML = BESTSELLER_IDS.map((id,i)=>{
    const p = byId(id);
    return `
    <div class="prod-card p-3 flex flex-col gap-1.5" data-open-product="${p.id}">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-neutral-500">${String(i+1).padStart(2,'0')}</span>
        <span class="text-[9px] bg-white/10 text-white px-1.5 py-0.5">Bestseller</span>
      </div>
      <img src="${p.img}" class="w-full h-20 object-contain" alt="${p.name}"/>
      <p class="text-xs text-neutral-200 leading-tight line-clamp-2">${p.name}</p>
      <div class="flex items-center justify-between mt-1">
        <div><p class="text-sm font-bold text-white">${formatPrice(p.price)}</p>${p.old?`<p class="text-[10px] text-neutral-500 line-through">${formatPrice(p.old)}</p>`:''}</div>
        <button data-add="${p.id}" class="w-6 h-6 flex items-center justify-center text-[var(--violet)]"><i data-lucide="shopping-cart" class="w-4 h-4"></i></button>
      </div>
      <p class="text-[10px] star">${stars(p.rating)} <span class="text-neutral-500">(${p.reviews})</span></p>
    </div>`;
  }).join('');

  renderDealRows();
  lucide.createIcons();
}

const DEAL_ROW_IDS = {};
function dealRow(key, title, ids, color='violet'){
  DEAL_ROW_IDS[key] = ids;
  const bg = color==='red' ? 'background:var(--red);' : 'background:var(--violet);';
  return `
  <section class="px-2 md:px-8 mb-6">
    <div class="text-white flex items-center justify-between px-3 py-2" style="${bg}">
      <h3 class="text-sm font-bold">${title}</h3>
      <a href="#" data-view-all-key="${key}" class="text-xs font-semibold flex items-center gap-1 hover:underline">See All <i data-lucide="arrow-right" class="w-3 h-3"></i></a>
    </div>
    <div class="scroll-row md:grid md:grid-cols-6 md:gap-1.5 px-0 border border-t-0 border-neutral-200">
      ${ids.map(id=>productCard(byId(id), {scroll:true})).join('')}
    </div>
  </section>`;
}

function renderDealRows(){
  const el = document.getElementById('dealRows');
  if(!el) return;
  const audioIds = PRODUCTS.filter(p=>p.category==='Audio').map(p=>p.id);
  const clearanceIds = PRODUCTS.filter(p=>p.old).map(p=>p.id);
  const officialIds = PRODUCTS.filter(p=>p.official).map(p=>p.id);
  el.innerHTML =
    dealRow('audio', 'Audio Deals', audioIds.length?audioIds:FLASH_IDS, 'violet') +
    dealRow('clearance', 'Clearance Sale', clearanceIds.length?clearanceIds:ARRIVAL_IDS, 'red') +
    dealRow('official', 'Deals From Official Stores', officialIds.length?officialIds:BESTSELLER_IDS, 'violet');
  lucide.createIcons();
}

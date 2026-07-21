/* ---------------- RENDER HELPERS ---------------- */
function stars(rating){
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

function priceHtml(p){
  return `<p class="text-sm font-bold">${formatPrice(p.price)}</p>${p.old ? `<p class="text-[10px] text-neutral-400 line-through">${formatPrice(p.old)}</p>` : ''}`;
}

function productCard(p, opts={}){
  const widthCls = opts.scroll ? 'w-32 md:w-auto shrink-0' : '';
  return `
  <div class="prod-card ${widthCls} border border-neutral-200 p-2 hover:shadow-sm transition relative bg-white" data-open-product="${p.id}">
    ${p.off ? `<span class="absolute top-1.5 left-1.5 bg-[var(--violet)] text-white text-[10px] font-bold px-1.5 py-0.5 z-10">${p.off}</span>` : (p.badge ? `<span class="absolute top-1.5 left-1.5 bg-neutral-800 text-white text-[9px] font-bold px-1.5 py-0.5 z-10">${p.badge}</span>` : '')}
    <button data-wish="${p.id}" class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center z-10"><i data-lucide="heart" class="w-3.5 h-3.5 ${wishlist.has(p.id)?'text-red-500 fill-red-500':'text-neutral-300'}"></i></button>
    <img src="${p.img}" class="w-full h-24 md:h-32 object-contain mb-1.5" alt="${p.name}"/>
    ${p.official ? `<span class="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 mb-0.5"><i data-lucide="badge-check" class="w-3 h-3"></i>Official Store</span>` : ''}
    <p class="text-xs text-neutral-700 leading-tight line-clamp-2 min-h-[2.2em]">${p.name}</p>
    <div class="mt-1">${priceHtml(p)}</div>
    <p class="text-[10px] star mt-0.5">${stars(p.rating)} <span class="text-neutral-400">(${p.reviews})</span></p>
    <button data-add="${p.id}" class="absolute bottom-2 right-2 w-6 h-6 flex items-center justify-center text-[var(--violet)] hover:bg-orange-50"><i data-lucide="shopping-cart" class="w-4 h-4"></i></button>
    ${opts.showStock ? `<div class="mt-1.5 h-1 bg-neutral-100 overflow-hidden"><div class="h-full bg-[var(--violet)]" style="width:${Math.min(100, p.stock)}%"></div></div><p class="text-[10px] text-neutral-400 mt-0.5">${p.stock} items left</p>` : ''}
  </div>`;
}

function renderAll(){
  document.getElementById('cats').innerHTML = CATS.map(c=>`
    <div data-filter-cat="${c.category}" class="prod-card w-16 md:w-auto shrink-0 flex flex-col items-center justify-center gap-1 p-2 border border-neutral-200 hover:border-[var(--violet)] transition text-center">
      <i data-lucide="${c.icon}" class="w-5 h-5 text-neutral-700"></i>
      <p class="text-[10px] font-medium leading-tight">${c.name}</p>
    </div>`).join('') + `
    <div class="w-16 md:w-auto shrink-0 flex flex-col items-center justify-center gap-1 p-2 bg-[var(--ink)] text-white cursor-pointer text-center">
      <i data-lucide="layout-grid" class="w-5 h-5"></i><p class="text-[9px] font-medium">View All</p>
    </div>`;

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
    <div class="border border-neutral-200 p-3 hover:shadow-md transition">
      <img src="${c.img}" class="w-full h-24 object-cover mb-2" alt="${c.name}"/>
      <h4 class="font-bold text-sm font-display">${c.name}</h4>
      <a href="#" class="text-xs text-[var(--violet)] font-semibold flex items-center gap-1 mt-1">${c.tag} <i data-lucide="arrow-right" class="w-3 h-3"></i></a>
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

  lucide.createIcons();
}


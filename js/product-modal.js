/* ---------------- PRODUCT PAGE ---------------- */
let productReturnPage = 'mainContent';

function sellerInfoFor(p){
  return p.official
    ? { name:'Thomex Official Store', score:98, followers:'12.4K', shipping:'Excellent', quality:'Excellent', ratingLabel:'Excellent', cancellation:'Excellent' }
    : { name:`${p.brand} Marketplace Seller`, score:88, followers:'2.1K', shipping:'Good', quality:'Good', ratingLabel:'Good', cancellation:'Good' };
}

function openProduct(id){
  const p = byId(id);
  if(!p) return;

  productReturnPage = PAGES.find(pg => !document.getElementById(pg)?.classList.contains('hidden')) || 'mainContent';

  if(!recentlyViewed.includes(id)){
    recentlyViewed.unshift(id);
    if(recentlyViewed.length > 6) recentlyViewed.pop();
  }

  document.getElementById('productBreadcrumb').innerHTML = `Home &nbsp;›&nbsp; ${p.category} &nbsp;›&nbsp; <span class="text-neutral-700">${p.name}</span>`;
  document.getElementById('productPageImg').src = p.img;
  document.getElementById('productPageImg').alt = p.name;

  document.getElementById('productPageInfo').innerHTML = `
    ${p.official ? `<span class="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 mb-2">Official Store</span>` : ''}
    <h1 class="text-lg md:text-xl font-bold leading-snug mb-1">${p.name}</h1>
    <p class="text-xs text-neutral-500 mb-2">Brand: <span class="font-semibold text-neutral-700">${p.brand}</span> · <button data-collection="brand:${p.brand}" class="text-[var(--violet)] hover:underline">Similar products from ${p.brand}</button></p>
    <div class="flex items-baseline gap-2 mb-1">
      <span class="text-2xl font-bold">${formatPrice(p.price)}</span>
      ${p.old ? `<span class="text-sm text-neutral-400 line-through">${formatPrice(p.old)}</span>` : ''}
      ${p.off ? `<span class="text-red-600 font-bold text-sm">${p.off}</span>` : ''}
    </div>
    <p class="text-xs text-green-600 font-semibold mb-3">In stock</p>
    <button id="modalAdd" class="w-full md:w-auto bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold px-8 py-3 rounded flex items-center justify-center gap-2 mb-4">
      <i data-lucide="shopping-cart" class="w-4 h-4"></i> Add to Cart
    </button>
    <div class="flex items-center gap-3 mb-4 text-xs">
      <span class="text-neutral-500">Qty:</span>
      <div class="flex items-center gap-3 border border-neutral-200 rounded-full px-3 py-1">
        <button id="modalQtyDec" class="qty-btn text-neutral-500 hover:text-black">−</button>
        <span id="modalQty" class="w-5 text-center">1</span>
        <button id="modalQtyInc" class="qty-btn text-neutral-500 hover:text-black">+</button>
      </div>
      <button id="modalWish" class="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50">
        <i data-lucide="heart" class="w-4 h-4 ${wishlist.has(p.id)?'text-red-500 fill-red-500':'text-neutral-400'}"></i>
      </button>
    </div>
    <p class="text-sm star mb-4">${stars(p.rating)} <span class="text-neutral-400">(${p.reviews} verified ratings)</span></p>
    <p class="text-sm text-neutral-600 leading-relaxed mb-4">${p.desc}</p>
    <p class="text-xs font-semibold text-neutral-500 mb-2">Share this product</p>
    <div class="flex items-center gap-2">
      <button data-social="Facebook" class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"><i data-lucide="facebook" class="w-3.5 h-3.5"></i></button>
      <button data-social="X (Twitter)" class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"><i data-lucide="twitter" class="w-3.5 h-3.5"></i></button>
      <button data-social="WhatsApp" class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"><i data-lucide="message-circle" class="w-3.5 h-3.5"></i></button>
    </div>
  `;

  const seller = sellerInfoFor(p);
  document.getElementById('productPageSidebar').innerHTML = `
    <div class="border border-neutral-200 p-3">
      <p class="text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Delivery &amp; Returns</p>
      <label class="text-[11px] text-neutral-500">Choose your location</label>
      <select class="w-full border border-neutral-200 rounded px-2 py-1.5 text-xs mt-1 mb-3">
        <option>Nairobi</option><option>Mombasa</option><option>Kisumu</option><option>Eldoret</option>
      </select>
      <div class="flex items-start gap-2 mb-2">
        <i data-lucide="package" class="w-4 h-4 text-[var(--violet)] mt-0.5 shrink-0"></i>
        <div><p class="text-xs font-semibold">Pickup Station</p><p class="text-[11px] text-neutral-500">Delivery fee KSh 90</p></div>
      </div>
      <div class="flex items-start gap-2 mb-2">
        <i data-lucide="truck" class="w-4 h-4 text-[var(--violet)] mt-0.5 shrink-0"></i>
        <div><p class="text-xs font-semibold">Door Delivery</p><p class="text-[11px] text-neutral-500">Delivery fee KSh 200</p></div>
      </div>
      <div class="flex items-start gap-2 mb-2">
        <i data-lucide="rotate-ccw" class="w-4 h-4 text-[var(--violet)] mt-0.5 shrink-0"></i>
        <div><p class="text-xs font-semibold">Return Policy</p><p class="text-[11px] text-neutral-500">Easy return, quick refund</p></div>
      </div>
      <div class="flex items-start gap-2">
        <i data-lucide="shield-check" class="w-4 h-4 text-[var(--violet)] mt-0.5 shrink-0"></i>
        <div><p class="text-xs font-semibold">Warranty</p><p class="text-[11px] text-neutral-500">${p.official?'1 Year Warranty':'No warranty'}</p></div>
      </div>
    </div>
    <div class="border border-neutral-200 p-3">
      <p class="text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Seller Information</p>
      <p class="text-sm font-semibold">${seller.name}</p>
      <p class="text-[11px] text-neutral-500 mb-2">${seller.score}% Seller Score · ${seller.followers} Followers</p>
      <div class="space-y-1 text-[11px]">
        <div class="flex items-center justify-between"><span class="text-neutral-500">Shipping speed</span><span class="text-green-600 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i>${seller.shipping}</span></div>
        <div class="flex items-center justify-between"><span class="text-neutral-500">Quality Score</span><span class="text-green-600 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i>${seller.quality}</span></div>
        <div class="flex items-center justify-between"><span class="text-neutral-500">Customer Rating</span><span class="text-green-600 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i>${seller.ratingLabel}</span></div>
        <div class="flex items-center justify-between"><span class="text-neutral-500">Cancellation Rate</span><span class="text-green-600 font-semibold flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i>${seller.cancellation}</span></div>
      </div>
    </div>
  `;

  const sponsored = PRODUCTS.filter(x=>x.id!==p.id && x.category===p.category).slice(0,6);
  const sponsoredList = (sponsored.length ? sponsored : PRODUCTS.filter(x=>x.id!==p.id).slice(0,6));
  document.getElementById('sponsoredGrid').innerHTML = sponsoredList.map(x=>productCard(x, {scroll:true})).join('');

  lucide.createIcons();

  let qty = 1;
  const qtyEl = document.getElementById('modalQty');
  document.getElementById('modalQtyInc').addEventListener('click', ()=>{ qty++; qtyEl.textContent=qty; });
  document.getElementById('modalQtyDec').addEventListener('click', ()=>{ qty=Math.max(1,qty-1); qtyEl.textContent=qty; });
  document.getElementById('modalAdd').addEventListener('click', ()=>{ addToCart(p.id, qty); });
  document.getElementById('modalWish').addEventListener('click', ()=>{ toggleWish(p.id); openProduct(p.id); });

  showPage('productPage');
}
function closeProduct(){
  showPage(productReturnPage);
}
document.getElementById('closeProduct').addEventListener('click', closeProduct);

document.addEventListener('click', e=>{
  const openEl = e.target.closest('[data-open-product]');
  if(openEl && !e.target.closest('[data-add]') && !e.target.closest('[data-wish]')) openProduct(openEl.dataset.openProduct);
});

/* ---------------- TOAST ---------------- */
let toastTimer;
function showToast(text){
  const t = document.getElementById('toast');
  document.getElementById('toastText').textContent = text;
  t.classList.remove('hidden'); t.classList.add('flex');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.classList.add('hidden'); t.classList.remove('flex'); }, 2200);
}

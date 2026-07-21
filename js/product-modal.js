/* ---------------- PRODUCT MODAL ---------------- */
function openProduct(id){
  const p = byId(id);
  if(!p) return;
  document.getElementById('productModalBody').innerHTML = `
    <div class="bg-neutral-50 flex items-center justify-center p-8 md:rounded-l-3xl">
      <img src="${p.img}" class="w-full max-w-xs rounded-2xl object-cover" alt="${p.name}"/>
    </div>
    <div class="p-8 flex flex-col">
      <span class="text-xs font-semibold text-[var(--violet)] mb-2">${p.category}</span>
      ${p.official ? `<span class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mb-2 w-fit"><i data-lucide="badge-check" class="w-4 h-4"></i>Official Store</span>` : ''}
      <h2 class="text-2xl font-bold font-display mb-1">${p.name}</h2>
      <p class="text-sm text-neutral-500 mb-3">${p.spec}</p>
      <p class="text-sm star mb-4">${stars(p.rating)} <span class="text-neutral-400">${p.rating} (${p.reviews} reviews)</span></p>
      <div class="flex items-baseline gap-2 mb-5">
        <span class="text-2xl font-bold">${formatPrice(p.price)}</span>
        ${p.old ? `<span class="text-sm text-neutral-400 line-through">${formatPrice(p.old)}</span>` : ''}
        ${p.off ? `<span class="bg-red-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-md">${p.off}</span>` : ''}
      </div>
      <p class="text-sm text-neutral-600 leading-relaxed mb-6">${p.desc}</p>
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center gap-3 border border-neutral-200 rounded-full px-3 py-1.5">
          <button id="modalQtyDec" class="qty-btn text-neutral-500 hover:text-black">−</button>
          <span id="modalQty" class="text-sm w-5 text-center">1</span>
          <button id="modalQtyInc" class="qty-btn text-neutral-500 hover:text-black">+</button>
        </div>
        <button id="modalWish" class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50">
          <i data-lucide="heart" class="w-4 h-4 ${wishlist.has(p.id)?'text-red-500 fill-red-500':'text-neutral-400'}"></i>
        </button>
      </div>
      <button id="modalAdd" class="w-full bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2">
        <i data-lucide="shopping-cart" class="w-4 h-4"></i> Add to Cart
      </button>
      <div class="grid grid-cols-3 gap-2 mt-6 text-center text-[10px] text-neutral-500">
        <div class="flex flex-col items-center gap-1"><i data-lucide="truck" class="w-4 h-4 text-[var(--violet)]"></i>Free Shipping</div>
        <div class="flex flex-col items-center gap-1"><i data-lucide="rotate-ccw" class="w-4 h-4 text-[var(--violet)]"></i>30-Day Returns</div>
        <div class="flex flex-col items-center gap-1"><i data-lucide="shield-check" class="w-4 h-4 text-[var(--violet)]"></i>Secure Checkout</div>
      </div>
      <div class="flex items-center gap-2 mt-5 pt-5 border-t border-neutral-100">
        <span class="text-[10px] text-neutral-400 shrink-0">Pay with:</span>
        <span class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">M-Pesa</span>
        <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded">Airtel Money</span>
        <span class="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-2 py-1 rounded">Pay on Delivery</span>
      </div>
    </div>`;
  lucide.createIcons();

  let qty = 1;
  const qtyEl = document.getElementById('modalQty');
  document.getElementById('modalQtyInc').addEventListener('click', ()=>{ qty++; qtyEl.textContent=qty; });
  document.getElementById('modalQtyDec').addEventListener('click', ()=>{ qty=Math.max(1,qty-1); qtyEl.textContent=qty; });
  document.getElementById('modalAdd').addEventListener('click', ()=>{ addToCart(p.id, qty); });
  document.getElementById('modalWish').addEventListener('click', ()=>{ toggleWish(p.id); openProduct(p.id); });

  document.getElementById('productOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>document.getElementById('productOverlay').classList.remove('opacity-0'));
}
function closeProduct(){
  document.getElementById('productOverlay').classList.add('opacity-0');
  setTimeout(()=>document.getElementById('productOverlay').classList.add('hidden'), 250);
}
document.getElementById('closeProduct').addEventListener('click', closeProduct);
document.getElementById('productOverlay').addEventListener('click', e=>{ if(e.target.id==='productOverlay') closeProduct(); });

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


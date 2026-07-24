/* ---------------- CART ---------------- */
let recentlyViewed = [];

function addToCart(id, qty=1){
  cart[id] = (cart[id]||0) + qty;
  renderCart();
  showToast(`${byId(id).name} added to cart`);
}
function removeFromCart(id){ delete cart[id]; renderCart(); }
function setQty(id, qty){ if(qty<=0) removeFromCart(id); else { cart[id]=qty; renderCart(); } }

/* Keeps the header/bottom-nav cart badge in sync, and refreshes the cart page if it's currently open */
function renderCart(){
  const ids = Object.keys(cart);
  const countEl = document.getElementById('cartCount');
  const countElMobile = document.getElementById('cartCountMobile');
  const totalCount = ids.reduce((s,id)=>s+cart[id],0);
  countEl.textContent = totalCount;
  countEl.classList.toggle('hidden', totalCount===0);
  if(countElMobile){
    countElMobile.textContent = totalCount;
    countElMobile.classList.toggle('hidden', totalCount===0);
  }
  if(!document.getElementById('cartPage').classList.contains('hidden')) renderCartPage();
}

function renderCartPage(){
  const ids = Object.keys(cart);
  const itemsEl = document.getElementById('cartPageItems');
  document.getElementById('cartPageCount').textContent = ids.reduce((s,id)=>s+cart[id],0);

  if(ids.length===0){
    itemsEl.innerHTML = `
      <div class="border border-neutral-200 p-10 text-center text-neutral-400">
        <i data-lucide="shopping-cart" class="w-10 h-10 mx-auto mb-3"></i>
        <p class="text-sm mb-4">Your cart is empty</p>
        <button data-nav="mainContent" class="bg-[var(--violet)] text-white text-sm font-semibold px-5 py-2 rounded-full">Continue Shopping</button>
      </div>`;
  } else {
    itemsEl.innerHTML = ids.map(id=>{
      const p = byId(id); const qty = cart[id];
      return `
      <div class="flex gap-3 border border-neutral-200 p-3">
        <img src="${p.img}" class="w-20 h-20 object-contain shrink-0"/>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold leading-tight line-clamp-2">${p.name}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="font-bold text-sm">${formatPrice(p.price)}</span>
            ${p.old?`<span class="text-xs text-neutral-400 line-through">${formatPrice(p.old)}</span>`:''}
            ${p.off?`<span class="text-[10px] font-bold text-[var(--violet)] bg-orange-50 px-1.5 py-0.5">${p.off}</span>`:''}
          </div>
          <p class="text-xs ${p.stock<15?'text-amber-600':'text-green-600'} mt-0.5">${p.stock<15?'Few units left':'In Stock'}</p>
          ${p.official ? `<span class="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 mt-0.5"><i data-lucide="badge-check" class="w-3 h-3"></i>Official Store</span>` : ''}
          <p class="text-[10px] font-bold text-[var(--violet)] mt-1">THOMEX <span class="text-neutral-500 font-semibold">EXPRESS</span></p>
          <div class="flex items-center justify-between mt-2">
            <button data-remove="${id}" class="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove</button>
            <div class="flex items-center gap-2 border border-neutral-200 rounded-full px-1">
              <button data-qty-dec="${id}" class="qty-btn text-neutral-500 hover:text-black">−</button>
              <span class="text-xs w-4 text-center">${qty}</span>
              <button data-qty-inc="${id}" class="qty-btn text-neutral-500 hover:text-black">+</button>
            </div>
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="font-bold text-sm">${formatPrice(p.price*qty)}</p>
          ${p.old?`<p class="text-xs text-neutral-400 line-through">${formatPrice(p.old*qty)}</p>`:''}
        </div>
      </div>`;
    }).join('');
  }
  const subtotal = ids.reduce((s,id)=>s+byId(id).price*cart[id],0);
  document.getElementById('cartPageSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('cartPageCheckoutBtn').textContent = subtotal>0 ? `Checkout (${formatPrice(subtotal)})` : 'Checkout';

  const rvGrid = document.getElementById('recentlyViewedGrid');
  if(rvGrid) rvGrid.innerHTML = recentlyViewed.length
    ? recentlyViewed.map(id=>productCard(byId(id), {scroll:true})).join('')
    : `<p class="text-sm text-neutral-400">No recently viewed products yet.</p>`;

  lucide.createIcons();
}

document.addEventListener('click', e=>{
  const add = e.target.closest('[data-add]'); if(add){ addToCart(add.dataset.add); return; }
  const inc = e.target.closest('[data-qty-inc]'); if(inc){ setQty(inc.dataset.qtyInc, cart[inc.dataset.qtyInc]+1); return; }
  const dec = e.target.closest('[data-qty-dec]'); if(dec){ setQty(dec.dataset.qtyDec, cart[dec.dataset.qtyDec]-1); return; }
  const rem = e.target.closest('[data-remove]'); if(rem){ removeFromCart(rem.dataset.remove); return; }
  const wish = e.target.closest('[data-wish]'); if(wish){ toggleWish(wish.dataset.wish); return; }
});

function toggleWish(id){
  if(wishlist.has(id)) wishlist.delete(id); else wishlist.add(id);
  const countEl = document.getElementById('wishCount');
  const countElMobile = document.getElementById('wishCountMobile');
  countEl.textContent = wishlist.size;
  countEl.classList.toggle('hidden', wishlist.size===0);
  if(countElMobile){
    countElMobile.textContent = wishlist.size;
    countElMobile.classList.toggle('hidden', wishlist.size===0);
  }
  renderAll();
  if(!document.getElementById('searchResults').classList.contains('hidden')){
    if(document.getElementById('searchResultsTitle').textContent === 'Your Wishlist') runSearchWishlist();
    else runSearch(searchInput.value, null);
  }
}

function openCart(){
  renderCartPage();
  showPage('cartPage');
}
document.getElementById('cartBtn').addEventListener('click', openCart);

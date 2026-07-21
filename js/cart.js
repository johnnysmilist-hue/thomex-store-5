/* ---------------- CART ---------------- */
function addToCart(id, qty=1){
  cart[id] = (cart[id]||0) + qty;
  renderCart();
  showToast(`${byId(id).name} added to cart`);
}
function removeFromCart(id){ delete cart[id]; renderCart(); }
function setQty(id, qty){ if(qty<=0) removeFromCart(id); else { cart[id]=qty; renderCart(); } }

function renderCart(){
  const ids = Object.keys(cart);
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const countEl = document.getElementById('cartCount');
  const countElMobile = document.getElementById('cartCountMobile');
  const totalCount = ids.reduce((s,id)=>s+cart[id],0);
  countEl.textContent = totalCount;
  countEl.classList.toggle('hidden', totalCount===0);
  if(countElMobile){
    countElMobile.textContent = totalCount;
    countElMobile.classList.toggle('hidden', totalCount===0);
  }

  if(ids.length===0){
    itemsEl.innerHTML=''; itemsEl.classList.add('hidden'); emptyEl.classList.remove('hidden');
  } else {
    itemsEl.classList.remove('hidden'); emptyEl.classList.add('hidden');
    itemsEl.innerHTML = ids.map(id=>{
      const p = byId(id); const qty = cart[id];
      return `
      <div class="flex gap-3">
        <img src="${p.img}" class="w-16 h-16 rounded-xl object-cover"/>
        <div class="flex-1">
          <p class="text-sm font-semibold leading-tight">${p.name}</p>
          <p class="text-xs text-neutral-400">${p.spec}</p>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center gap-2 border border-neutral-200 rounded-full px-1">
              <button data-qty-dec="${id}" class="qty-btn text-neutral-500 hover:text-black">−</button>
              <span class="text-xs w-4 text-center">${qty}</span>
              <button data-qty-inc="${id}" class="qty-btn text-neutral-500 hover:text-black">+</button>
            </div>
            <p class="text-sm font-bold">${formatPrice(p.price*qty)}</p>
          </div>
        </div>
        <button data-remove="${id}" class="text-neutral-300 hover:text-red-500"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
      </div>`;
    }).join('');
  }
  const subtotal = ids.reduce((s,id)=>s+byId(id).price*cart[id],0);
  document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
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
  document.getElementById('cartOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>document.getElementById('cartOverlay').classList.remove('opacity-0'));
  document.getElementById('cartDrawer').classList.remove('translate-x-full');
}
function closeCart(){
  document.getElementById('cartOverlay').classList.add('opacity-0');
  document.getElementById('cartDrawer').classList.add('translate-x-full');
  setTimeout(()=>document.getElementById('cartOverlay').classList.add('hidden'), 300);
}
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', e=>{ if(e.target.id==='cartOverlay') closeCart(); });


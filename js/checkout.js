/* ---------------- CHECKOUT ---------------- */
function openCheckout(){
  if(Object.keys(cart).length === 0){ showToast('Your cart is empty'); return; }
  renderCheckout();
  document.getElementById('checkoutOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>document.getElementById('checkoutOverlay').classList.remove('opacity-0'));
}
function closeCheckoutModal(){
  document.getElementById('checkoutOverlay').classList.add('opacity-0');
  setTimeout(()=>document.getElementById('checkoutOverlay').classList.add('hidden'), 250);
}

function renderCheckout(){
  const body = document.getElementById('checkoutModalBody');
  const ids = Object.keys(cart);
  const itemCount = ids.reduce((s,id)=>s+cart[id],0);
  const subtotal = ids.reduce((s,id)=>s+byId(id).price*cart[id],0);
  const deliveryFee = subtotal > 0 ? 200 : 0;
  const total = subtotal + deliveryFee;

  body.innerHTML = `
    <h3 class="font-bold font-display text-lg mb-1">Place Your Order</h3>
    <p class="text-xs text-neutral-500 mb-4">If you proceed, you are automatically accepting our <span class="text-[var(--violet)]">Terms &amp; Conditions</span>.</p>

    <div class="border border-neutral-200 p-3 mb-3">
      <p class="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Order Summary</p>
      <div class="text-sm space-y-1">
        <div class="flex justify-between"><span class="text-neutral-500">Item's Total (${itemCount})</span><span>${formatPrice(subtotal)}</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Delivery Fee</span><span>${formatPrice(deliveryFee)}</span></div>
        <div class="flex justify-between font-bold text-base pt-2 border-t border-neutral-100 mt-1"><span>Total</span><span>${formatPrice(total)}</span></div>
      </div>
    </div>

    <form id="checkoutForm" class="space-y-3">
      <div class="border border-neutral-200 p-3">
        <p class="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Payment Method</p>
        <div class="space-y-2">
          <label class="flex items-center gap-2 border border-neutral-200 rounded px-3 py-2 text-sm cursor-pointer has-[:checked]:border-[var(--violet)]">
            <input type="radio" name="payment" value="M-Pesa" checked class="accent-[var(--violet)]"/> Pay Now with M-Pesa
          </label>
          <label class="flex items-center gap-2 border border-neutral-200 rounded px-3 py-2 text-sm cursor-pointer has-[:checked]:border-[var(--violet)]">
            <input type="radio" name="payment" value="Airtel Money" class="accent-[var(--violet)]"/> Airtel Money
          </label>
          <label class="flex items-center gap-2 border border-neutral-200 rounded px-3 py-2 text-sm cursor-pointer has-[:checked]:border-[var(--violet)]">
            <input type="radio" name="payment" value="Card" class="accent-[var(--violet)]"/> Credit / Debit Card
          </label>
          <label class="flex items-center gap-2 border border-neutral-200 rounded px-3 py-2 text-sm cursor-pointer has-[:checked]:border-[var(--violet)]">
            <input type="radio" name="payment" value="Pay on Delivery" class="accent-[var(--violet)]"/> Pay on Delivery
          </label>
        </div>
      </div>

      <div class="border border-neutral-200 p-3">
        <p class="text-[11px] font-bold uppercase tracking-wide text-neutral-400 mb-2">Delivery Address</p>
        <div class="space-y-2">
          <input required name="fullName" value="${currentUser?currentUser.name:''}" placeholder="Full Name" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
          <input required name="phone" placeholder="Phone Number (e.g. 07XX XXX XXX)" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
          <input required name="address" placeholder="Delivery Address" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
          <input required name="city" placeholder="Town / City" class="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-[var(--violet)]"/>
        </div>
      </div>

      <button type="submit" class="w-full bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold py-3 rounded-full mt-2">Confirm Order</button>
      <p class="text-[10px] text-neutral-400 text-center">Demo checkout — no real payment is processed.</p>
    </form>
  `;

  document.getElementById('checkoutForm').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const orderId = Math.random().toString(36).slice(2,8).toUpperCase();
    orders.push({
      id: orderId,
      items: ids.map(id=>({ id, qty: cart[id] })),
      total,
      address: `${fd.get('address')}, ${fd.get('city')}`,
      payment: fd.get('payment'),
      date: new Date().toLocaleDateString()
    });
    cart = {};
    renderCart();
    renderOrderConfirmation(orderId, fd.get('payment'), total);
  });
}

function renderOrderConfirmation(orderId, payment, total){
  const body = document.getElementById('checkoutModalBody');
  body.innerHTML = `
    <div class="text-center py-6">
      <div class="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4"><i data-lucide="check" class="w-7 h-7"></i></div>
      <h3 class="font-bold font-display text-lg mb-1">Order Placed!</h3>
      <p class="text-sm text-neutral-500 mb-4">Order <span class="font-semibold text-black">#${orderId}</span> — paying via ${payment}</p>
      <p class="text-2xl font-bold mb-6">${formatPrice(total)}</p>
      <button id="continueShoppingBtn" class="bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white font-semibold px-6 py-2.5 rounded-full">Continue Shopping</button>
    </div>
  `;
  document.getElementById('continueShoppingBtn').addEventListener('click', closeCheckoutModal);
  lucide.createIcons();
}

document.getElementById('cartPageCheckoutBtn').addEventListener('click', openCheckout);
document.getElementById('cartStickyCheckoutBtn').addEventListener('click', openCheckout);
document.getElementById('closeCheckout').addEventListener('click', closeCheckoutModal);
document.getElementById('checkoutOverlay').addEventListener('click', e=>{ if(e.target.id==='checkoutOverlay') closeCheckoutModal(); });

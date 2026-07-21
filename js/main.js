/* ---------------- HERO CAROUSEL ---------------- */
let heroIndex = 0;
let heroTimer;
function renderHeroSlides(){
  const slidesEl = document.getElementById('heroSlides');
  const dotsEl = document.getElementById('heroDots');
  if(!slidesEl) return;
  slidesEl.innerHTML = HERO_SLIDES.map((s,i)=>`
    <div class="hero-slide absolute inset-0 transition-opacity duration-700 ${i===heroIndex?'opacity-100 z-10':'opacity-0 z-0'}">
      <img src="${s.img}" class="w-full h-full object-cover opacity-80" alt="${s.title}"/>
      <div class="absolute inset-0 flex flex-col justify-center px-5 md:px-10 text-white">
        <span class="inline-block bg-[var(--violet)] text-[10px] font-bold px-2 py-0.5 w-fit mb-2">${s.tag}</span>
        <h1 class="text-2xl md:text-4xl font-extrabold font-display leading-tight mb-2 max-w-xs md:max-w-md">${s.title}</h1>
        <button data-nav="${s.nav}" class="bg-[var(--violet)] hover:bg-[var(--violet-dark)] transition text-white text-xs md:text-sm font-semibold px-4 py-2 w-fit flex items-center gap-1">Shop Now <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
      </div>
    </div>`).join('');
  dotsEl.innerHTML = HERO_SLIDES.map((s,i)=>`<button data-hero-dot="${i}" class="w-1.5 h-1.5 rounded-full ${i===heroIndex?'bg-white w-5':'bg-white/50'} transition-all"></button>`).join('');
  lucide.createIcons();
}
function goToHeroSlide(i){
  heroIndex = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
  renderHeroSlides();
  resetHeroTimer();
}
function resetHeroTimer(){
  clearInterval(heroTimer);
  heroTimer = setInterval(()=> goToHeroSlide(heroIndex+1), 5000);
}
document.getElementById('heroPrev')?.addEventListener('click', ()=> goToHeroSlide(heroIndex-1));
document.getElementById('heroNext')?.addEventListener('click', ()=> goToHeroSlide(heroIndex+1));
document.addEventListener('click', e=>{
  const dot = e.target.closest('[data-hero-dot]');
  if(dot) goToHeroSlide(Number(dot.dataset.heroDot));
});
renderHeroSlides();
resetHeroTimer();

/* ---------------- COUNTDOWN ---------------- */
function pad(n){return n.toString().padStart(2,'0');}
let remaining = 3*3600 + 31*60 + 31;
function tick(){
  const h=Math.floor(remaining/3600), m=Math.floor((remaining%3600)/60), s=remaining%60;
  document.getElementById('countdown').textContent = `${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
  if(remaining>0) remaining--;
}
tick(); setInterval(tick, 1000);

/* ---------------- INIT ---------------- */
renderAll();
renderCart();

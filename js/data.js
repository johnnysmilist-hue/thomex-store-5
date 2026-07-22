const PRODUCTS = [
  {id:'iphone-15-pro-max', name:'iPhone 15 Pro Max', spec:'256GB, Natural Titanium', category:'Smartphones', brand:'Apple', official:true, price:142850, old:168850, off:'-15%', rating:4.8, reviews:1280, stock:167, img:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'The most advanced iPhone yet, with a titanium design, A17 Pro chip, and a pro camera system built for stunning detail in any light.'},
  {id:'dell-xps-15', name:'Dell XPS 15 Plus', spec:'16GB / 512GB SSD', category:'Laptops', brand:'Dell', official:true, price:168850, old:207850, off:'-20%', rating:4.7, reviews:96, stock:32, img:'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'A powerful 15-inch laptop with a stunning InfinityEdge display, all-day battery life, and plenty of power for creative work.'},
  {id:'sony-wh1000xm4', name:'Sony WH-1000XM4', spec:'Wireless Noise Cancelling', category:'Audio', brand:'Sony', official:true, price:32350, old:null, off:'-25%', rating:4.9, reviews:215, stock:10, img:'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'Industry-leading noise cancellation with premium sound quality, tuned by Sony engineers for all-day comfort.'},
  {id:'galaxy-watch-6', name:'Samsung Galaxy Watch 6', spec:'44mm, Black', category:'Smartwatches', brand:'Samsung', official:true, price:38850, old:51850, off:'-30%', rating:4.6, reviews:150, stock:74, img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'Track your health and fitness in style with advanced sleep coaching, heart monitoring, and a vivid always-on display.'},
  {id:'bose-soundlink', name:'Bose SoundLink Revolve+ II', spec:'Portable Bluetooth Speaker', category:'Audio', brand:'Bose', official:false, price:38850, old:51850, off:'-15%', rating:4.7, reviews:88, stock:66, img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'360-degree sound that fills the room, with a rugged water-resistant design built for the outdoors.'},
  {id:'canon-eos-r6', name:'Canon EOS R6', spec:'Mirrorless Camera, Body Only', category:'Cameras', brand:'Canon', official:true, price:324850, old:null, off:'-20%', rating:4.9, reviews:54, stock:61, img:'https://images.unsplash.com/photo-1606986628253-05620e9b0142?q=80&w=800&auto=format&fit=crop', badge:'Flash Deal', desc:'A full-frame mirrorless camera built for speed and precision, with in-body stabilization and 4K video.'},
  {id:'airpods-pro-2', name:'AirPods Pro (2nd Gen)', spec:'Active Noise Cancellation', category:'Audio', brand:'Apple', official:true, price:32350, old:null, off:null, rating:4.8, reviews:340, stock:39, img:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop', badge:'Best Selling', desc:'Richer audio, smarter noise cancellation, and a more personalized fit for all-day listening.'},
  {id:'ipad-air', name:'iPad Air', spec:'M1 Chip, 64GB', category:'Tablets', brand:'Apple', official:true, price:77850, old:null, off:null, rating:4.8, reviews:74, stock:30, img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop', badge:'New', desc:'Serious performance in a thin, light design, powered by the M1 chip for pro-level creative work.'},
  {id:'sony-wh-ch720n', name:'Sony WH-CH720N', spec:'Noise Cancelling Headphones', category:'Audio', brand:'Sony', official:true, price:19350, old:null, off:null, rating:4.6, reviews:82, stock:177, img:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop', badge:'New', desc:'Lightweight, comfortable noise-cancelling headphones with up to 35 hours of battery life.'},
  {id:'dji-mini-3', name:'DJI Mini 3 Drone', spec:'Fly More Combo', category:'Gaming', brand:'DJI', official:true, price:60950, old:null, off:null, rating:4.9, reviews:65, stock:143, img:'https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=800&auto=format&fit=crop', badge:'New', desc:'A featherweight drone with 4K HDR video, 38-minute flight time, and tri-directional obstacle sensing.'},
  {id:'mx-master-3s', name:'Logitech MX Master 3S', spec:'Wireless Mouse', category:'Accessories', brand:'Logitech', official:false, price:12850, old:null, off:null, rating:4.8, reviews:39, stock:26, img:'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800&auto=format&fit=crop', badge:'New', desc:'Ultra-quiet clicks, 8K DPI tracking, and an ergonomic shape designed for all-day precision work.'},
  {id:'macbook-air-m2', name:'Apple MacBook Air M2', spec:'13-inch, 256GB SSD', category:'Laptops', brand:'Apple', official:true, price:129850, old:155850, off:null, rating:4.8, reviews:96, stock:155, img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', badge:'Bestseller', desc:'Strikingly thin design, blazing-fast M2 performance, and up to 18 hours of battery life.'},
];

const HERO_SLIDES = [
  {img:'https://images.unsplash.com/photo-1592286927505-1def25115481?q=80&w=1200&auto=format&fit=crop', tag:'NEW ARRIVAL', title:'Future Technology Today.', nav:'flash'},
  {img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop', tag:'LIMITED OFFER', title:'MacBook Air M2 — Save KSh 26,000.', nav:'flash'},
  {img:'https://images.unsplash.com/photo-1606986628253-05620e9b0142?q=80&w=1200&auto=format&fit=crop', tag:'TOP RATED', title:'Pro Cameras For Every Shot.', nav:'flash'},
  {img:'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=1200&auto=format&fit=crop', tag:'FLASH SALE', title:'Up To 40% Off Electronics.', nav:'flash'},
];

const CATS = [
  {icon:'smartphone', name:'Smartphones', count:24, category:'Smartphones'},
  {icon:'laptop', name:'Laptops', count:18, category:'Laptops'},
  {icon:'headphones', name:'Audio', count:32, category:'Audio'},
  {icon:'watch', name:'Smartwatches', count:14, category:'Smartwatches'},
  {icon:'camera', name:'Cameras', count:22, category:'Cameras'},
  {icon:'gamepad-2', name:'Gaming', count:16, category:'Gaming'},
  {icon:'speaker', name:'Accessories', count:40, category:'Accessories'},
  {icon:'tablet', name:'Tablets', count:12, category:'Tablets'},
];

const COLLECTIONS = [
  {name:'Apple Collection', tag:'Explore Now', img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=400&auto=format&fit=crop'},
  {name:'Gaming Zone', tag:'Level Up Your Game', img:'https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?q=80&w=400&auto=format&fit=crop'},
  {name:'Smart Living', tag:'Innovate Your Home', img:'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=400&auto=format&fit=crop'},
  {name:'Work From Home', tag:'Essentials for Productivity', img:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'},
];

const BESTSELLER_IDS = ['iphone-15-pro-max','macbook-air-m2','galaxy-watch-6','sony-wh1000xm4','canon-eos-r6'];
const ARRIVAL_IDS = ['ipad-air','sony-wh-ch720n','dji-mini-3','mx-master-3s'];
const FLASH_IDS = ['iphone-15-pro-max','dell-xps-15','sony-wh1000xm4','galaxy-watch-6','bose-soundlink','canon-eos-r6'];

/* ---------------- STATE (in-memory only) ---------------- */
let cart = {};      // id -> qty
let wishlist = new Set();
const byId = id => PRODUCTS.find(p => p.id === id);
function formatPrice(n){ return 'KSh ' + Math.round(n).toLocaleString('en-KE'); }

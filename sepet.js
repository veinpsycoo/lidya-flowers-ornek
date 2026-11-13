// Örnek sepet: tarayıcıda (localStorage) tutulur, sipariş WhatsApp'tan tamamlanır. Gerçek kurulumda Shopify/Woo sepeti.
(function(){
const ANAHTAR='lidya-sepet', WA='905394332569';
const oku=()=>{try{return JSON.parse(localStorage.getItem(ANAHTAR))||[]}catch(e){return []}};
const yaz=l=>{try{localStorage.setItem(ANAHTAR,JSON.stringify(l))}catch(e){}};
const tl=n=>'₺'+n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const sayi=s=>parseFloat(String(s).replace(/\./g,'').replace(',','.'))||0;
const css=`.sp-rozet{position:absolute;top:2px;right:0;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#e8467c;color:#fff;font:800 11px/18px system-ui,sans-serif;text-align:center}
.sp-ort{position:fixed;inset:0;background:rgba(30,20,10,.45);z-index:90;opacity:0;pointer-events:none;transition:opacity .2s}
.sp-ort.ac{opacity:1;pointer-events:auto}
.sp-cek{position:fixed;top:0;right:0;bottom:0;width:min(420px,100%);background:#fff;z-index:91;transform:translateX(100%);transition:transform .25s;display:flex;flex-direction:column;font:15px/1.45 system-ui,sans-serif;color:#3a2c1c}
.sp-cek.ac{transform:none}
.sp-ust{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #eadfd3}
.sp-ust b{font-size:18px}
.sp-ust button{width:40px;height:40px;border:0;background:none;font-size:26px;cursor:pointer;color:#3a2c1c}
.sp-liste{flex:1;overflow:auto;padding:8px 16px}
.sp-oge{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f1e9e0}
.sp-oge img{width:72px;height:72px;object-fit:contain;background:#f6efe7;border-radius:10px;flex:0 0 auto}
.sp-oge div{flex:1;min-width:0;font-size:13px}
.sp-oge b{display:block;font-size:14px}
.sp-oge small{display:block;color:#7a6b5c}
.sp-oge button{border:0;background:none;color:#a8485a;font-weight:700;font-size:12.5px;cursor:pointer;padding:4px 0}
.sp-bos{color:#7a6b5c;text-align:center;padding:40px 0}
.sp-alt{border-top:1px solid #eadfd3;padding:14px 16px 18px}
.sp-top{display:flex;justify-content:space-between;font-weight:800;font-size:17px;margin-bottom:10px}
.sp-alt a{display:flex;align-items:center;justify-content:center;height:52px;border-radius:999px;background:#25d366;color:#063b1c;font-weight:800;text-decoration:none}
.sp-alt p{margin:8px 0 0;font-size:12px;color:#7a6b5c;text-align:center}
.sp-bildir{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#3a2c1c;color:#fff;padding:10px 18px;border-radius:999px;font:700 14px system-ui,sans-serif;z-index:95;opacity:0;transition:opacity .2s;pointer-events:none}
.sp-bildir.ac{opacity:1}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
document.body.insertAdjacentHTML('beforeend',`<div class="sp-ort" id="spOrt"></div>
<aside class="sp-cek" id="spCek" role="dialog" aria-modal="true" aria-labelledby="spB" aria-hidden="true">
 <div class="sp-ust"><b id="spB">Sepetim</b><button type="button" id="spKapat" aria-label="Sepeti kapat">×</button></div>
 <div class="sp-liste" id="spListe"></div>
 <div class="sp-alt" id="spAlt"></div>
</aside><div class="sp-bildir" id="spBildir" role="status"></div>`);
const cek=document.getElementById('spCek'),ort=document.getElementById('spOrt');
let onceki=null;
function ac(){onceki=document.activeElement;ciz();cek.classList.add('ac');ort.classList.add('ac');cek.setAttribute('aria-hidden','false');document.getElementById('spKapat').focus()}
function kapat(){cek.classList.remove('ac');ort.classList.remove('ac');cek.setAttribute('aria-hidden','true');onceki&&onceki.focus&&onceki.focus()}
ort.onclick=kapat;document.getElementById('spKapat').onclick=kapat;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cek.classList.contains('ac'))kapat()});
function rozet(){const n=oku().length;document.querySelectorAll('[data-sepet]').forEach(a=>{a.style.position='relative';let r=a.querySelector('.sp-rozet');
 if(!n){r&&r.remove();return} if(!r){r=document.createElement('span');r.className='sp-rozet';a.appendChild(r)} r.textContent=n;a.setAttribute('aria-label','Sepet, '+n+' ürün')})}
function ciz(){
 const l=oku(),li=document.getElementById('spListe'),alt=document.getElementById('spAlt');
 if(!l.length){li.innerHTML='<div class="sp-bos">Sepetiniz boş.</div>';alt.innerHTML='';return}
 const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 li.innerHTML=l.map((u,i)=>`<div class="sp-oge"><img src="${e(u.img)}" alt=""><div><b>${e(u.ad)}</b>${tl(sayi(u.fiyat))}<small>${e(u.tarih)}, ${e(u.dilim)}</small><small>${e(u.adres)}</small><button type="button" data-sil="${i}">Kaldır</button></div></div>`).join('');
 li.querySelectorAll('[data-sil]').forEach(b=>b.onclick=()=>{const x=oku();x.splice(+b.dataset.sil,1);yaz(x);ciz();rozet()});
 const top=l.reduce((t,u)=>t+sayi(u.fiyat),0);
 const msg='Merhaba, sipariş vermek istiyorum.\n'+l.map((u,i)=>`${i+1}) ${u.ad} (${tl(sayi(u.fiyat))})\nAdres: ${u.adres}\nTeslimat: ${u.tarih} ${u.dilim}`+(u.not?`\nKart notu: ${u.not}`:'')).join('\n\n')+`\n\nToplam: ${tl(top)}`;
 alt.innerHTML=`<div class="sp-top"><span>Toplam</span><span>${tl(top)}</span></div><a href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Siparişi Tamamla</a><p>Örnek sepet · ödeme adımı gerçek sitede olacak</p>`;
}
let zz;function bildir(t){const b=document.getElementById('spBildir');b.textContent=t;b.classList.add('ac');clearTimeout(zz);zz=setTimeout(()=>b.classList.remove('ac'),1800)}
document.querySelectorAll('[data-sepet]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();ac()}));
window.LidyaSepet={ekle(u){const l=oku();l.push(u);yaz(l);rozet();bildir('Sepete eklendi ✓');setTimeout(ac,350)},ac};
rozet();
})();

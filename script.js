/* =========================================================
   ziko.pro — Script compartido por todas las páginas
   ⚠️ Ya no se cambian datos aquí: WhatsApp, portafolio, demos,
   planes, precios y pagos se editan en el PANEL de ziko.pro.
   ========================================================= */
let AJ = {}, PORT = [], PLANES = [];
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const soles = n => "S/ " + (+n || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const WA = () => String(AJ.whatsapp || "51999999999").replace(/\D/g, "");
const waLink = txt => "https://wa.me/" + WA() + "?text=" + encodeURIComponent(txt);
const TIPOS = { sistema: "Sistema web", app: "Aplicación", web: "Página web", tienda: "Tienda online" };
const img = f => !f ? "" : /^(https?:|data:)/.test(f) ? f : "/" + String(f).replace(/^\//, "");
const fechaPE = (s, hora = false) => { const d = new Date(s); if (isNaN(d)) return ""; return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) + (hora ? " " + d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) : ""); };
const precioSoles = p => p.precio == null || p.precio === "" ? null : Math.round((+p.precio) * (p.moneda === "USD" ? (+AJ.tipoCambio || 3.75) : 1) * 100) / 100;
const precioTxt = p => p.precio == null || p.precio === "" ? "A medida" : (p.moneda === "USD" ? "$" : "S/ ") + (+p.precio).toLocaleString("es-PE") + ` <small>${p.moneda === "USD" ? "USD" : "PEN"}</small>`;
function aviso(msg) { let t = $(".zk-toast"); if (!t) { t = document.createElement("div"); t.className = "zk-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); } t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 3000); }

/* ---------- Menú móvil, año y animación al hacer scroll ---------- */
const menu = $("#menu"), burger = $("#hamburger");
if (burger && menu) { burger.addEventListener("click", () => menu.classList.toggle("open")); menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open"))); }
$$(".year").forEach(el => el.textContent = new Date().getFullYear());
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } }), { threshold: 0.12 }) : null;
const revelar = (root = document) => $$(".reveal:not(.visible)", root).forEach(el => io ? io.observe(el) : el.classList.add("visible"));
revelar();

/* ---------- Datos del panel: WhatsApp, contacto y redes ---------- */
function aplicarAjustes() {
  $$(".wa-link").forEach(a => { a.href = waLink(a.dataset.msg || "Hola ziko.pro 👋 Quiero información sobre una página web o sistema."); a.target = "_blank"; a.rel = "noopener"; });
  $$(".js-tel").forEach(a => a.textContent = (a.dataset.pre ?? "WhatsApp: ") + (AJ.telefono || "+" + WA()));
  $$(".js-email").forEach(a => { a.textContent = AJ.email || ""; a.href = "mailto:" + (AJ.email || ""); });
  $$(".js-dir").forEach(x => x.textContent = AJ.direccion || "");
  $$(".js-hor").forEach(x => x.textContent = AJ.horario || "");
  const redes = AJ.redes || {}; let alguna = false;
  $$(".socials a").forEach(a => { const u = redes[(a.getAttribute("aria-label") || "").toLowerCase()]; if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; alguna = true; } else a.hidden = true; });
  $$(".socials").forEach(s => s.hidden = !alguna);
}

/* ---------- Tarjetas del portafolio ---------- */
const inicial = n => { const w = String(n || "?").split("·")[0].replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, "").split(" ").filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || "?").slice(0, 2)).toUpperCase(); };
function tarjeta(p) {
  return `<article class="project zk-card reveal" data-cat="${esc(p.tipo)}">
    <div class="project-img">${p.foto ? `<img src="${esc(img(p.foto))}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'zk-ph',textContent:'${esc(inicial(p.nombre))}'}))">` : `<div class="zk-ph">${esc(inicial(p.nombre))}</div>`}
      <span class="project-cat">${esc(TIPOS[p.tipo] || p.tipo)}</span>${p.demo ? `<span class="zk-demo-tag">DEMO DISPONIBLE</span>` : ""}</div>
    <div class="project-info"><h3>${esc(p.nombre)}</h3><p>${esc(p.desc || "")}</p>
      ${p.demo || p.link ? `<div class="zk-acts">${p.demo ? `<a class="btn btn-teal" href="/demo?s=${encodeURIComponent(p.id)}">VER DEMO</a>` : ""}${p.link ? `<a class="btn btn-outline" href="${esc(p.link)}" target="_blank" rel="noopener">VER PROYECTO</a>` : ""}</div>` : ""}</div>
  </article>`;
}
function portafolio() {
  const vis = PORT.filter(p => p.visible !== false).sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
  const rec = $("#recientes"); if (rec) { const otros = $("#sistemasDemo") ? vis.filter(p => !p.demo) : vis, d = otros.filter(p => p.destacado); rec.innerHTML = d.concat(otros.filter(p => !p.destacado)).slice(0, 6).map(tarjeta).join(""); }
  const sis = $("#sistemasDemo"); if (sis) { const l = vis.filter(p => p.demo); sis.innerHTML = l.map(tarjeta).join(""); if (!l.length) sis.closest("section").hidden = true; }
  const g = $("#portGrid");
  if (g) {
    const tipos = Object.keys(TIPOS).filter(t => vis.some(p => p.tipo === t)), f0 = params.get("tipo") || "todos";
    $("#portFilters").innerHTML = [["todos", "Todos"], ["demo", "Con demo"], ...tipos.map(t => [t, { sistema: "Sistemas web", app: "Aplicaciones", web: "Páginas web", tienda: "Tiendas online" }[t]])].map(([k, t]) => `<button class="filter-btn${k === f0 ? " active" : ""}" data-filter="${k}">${t}</button>`).join("");
    g.innerHTML = vis.map(tarjeta).join("") || `<p>Pronto publicaremos nuestros proyectos.</p>`;
    const filtrar = f => $$(".project", g).forEach((el, i) => el.classList.toggle("hide", f === "demo" ? !vis[i].demo : f !== "todos" && el.dataset.cat !== f));
    $("#portFilters").addEventListener("click", e => { const b = e.target.closest(".filter-btn"); if (!b) return; $$(".filter-btn").forEach(x => x.classList.toggle("active", x === b)); filtrar(b.dataset.filter); });
    filtrar(f0);
  }
  revelar();
}

/* ---------- Demos: solicitud y acceso con código ---------- */
function paginaDemo() {
  const box = $("#demoBox"); if (!box) return;
  const demos = PORT.filter(p => p.demo && p.visible !== false).sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99)), s0 = params.get("s") || "";
  let guardado = ""; try { guardado = localStorage.getItem("zk_codigo") || ""; } catch (e) {}
  box.innerHTML = `
    <div class="zk-demo-grid">
      <form class="box zk-panel" id="dmF" novalidate>
        <span class="zk-step">PASO 1</span><h2>Solicita tu acceso gratis</h2>
        <p class="form-note" style="margin:0 0 16px">Déjanos tus datos y te enviamos por WhatsApp un <b>código de acceso</b> para probar la web y el panel administrativo.</p>
        <div class="form-row"><div><label for="dmN">Nombre *</label><input id="dmN" autocomplete="name" placeholder="Tu nombre"></div>
          <div><label for="dmC">Celular (WhatsApp) *</label><input id="dmC" type="tel" inputmode="tel" autocomplete="tel" placeholder="987 654 321"></div></div>
        <label for="dmS">¿Qué sistema quieres probar? *</label>
        <select id="dmS">${demos.map(p => `<option value="${esc(p.id)}"${p.id === s0 ? " selected" : ""}>${esc(p.nombre)}</option>`).join("")}<option value="todos"${s0 === "todos" ? " selected" : ""}>Quiero ver todos</option></select>
        <label for="dmB">Tu negocio</label><input id="dmB" placeholder="Ej. Ferretería en Comas, tienda de ropa en Gamarra">
        <p class="zk-err" id="dmErr" role="alert"></p>
        <button class="btn btn-teal" type="submit" style="width:100%">SOLICITAR MI CÓDIGO</button>
        <p class="form-note">Al enviar aceptas nuestra <a href="/privacidad" style="color:var(--teal);font-weight:600">Política de privacidad</a>. Usamos tu celular solo para enviarte el código.</p>
      </form>
      <div class="box zk-panel zk-code">
        <span class="zk-step">PASO 2</span><h2>¿Ya tienes tu código?</h2>
        <p class="form-note" style="margin:0 0 16px">Escríbelo aquí para ver los enlaces de la demo, con su usuario y contraseña de prueba.</p>
        <form id="acF" class="zk-code-f"><input id="acC" placeholder="Ej. ZD-7K2M9QXA" value="${esc(guardado)}" autocomplete="one-time-code"><button class="btn btn-teal">ENTRAR</button></form>
        <p class="zk-err" id="acErr" role="alert"></p>
        <ol class="zk-how"><li><b>Solicitas</b> tu acceso con tu nombre y celular.</li><li><b>Te escribimos</b> por WhatsApp con tu código.</li><li><b>Pruebas</b> la web y el panel como si fuera tuyo.</li></ol>
      </div>
    </div>
    <div id="acRes" aria-live="polite"></div>`;
  const err = (id, m) => { $(id).textContent = m; };
  $("#dmF").addEventListener("submit", async e => {
    e.preventDefault(); err("#dmErr", "");
    const s = { nombre: $("#dmN").value.trim().slice(0, 80), celular: $("#dmC").value.trim().slice(0, 20), sistema: $("#dmS").value, negocio: $("#dmB").value.trim().slice(0, 120), estado: "nuevo", creado: new Date().toISOString() };
    if (!s.nombre || s.celular.replace(/\D/g, "").length < 9) return err("#dmErr", "Escribe tu nombre y un celular válido.");
    const b = $("#dmF button"); b.disabled = true; b.textContent = "ENVIANDO…";
    try { await DB.solicitarDemo(s); } catch (er) { console.error(er); b.disabled = false; b.textContent = "SOLICITAR MI CÓDIGO"; return err("#dmErr", "No se pudo enviar. Revisa tu conexión e inténtalo otra vez."); }
    const sis = s.sistema === "todos" ? "todos los sistemas" : (demos.find(x => x.id === s.sistema) || {}).nombre || s.sistema;
    $("#dmF").innerHTML = `<div class="zk-ok"><div class="zk-ok-i">✓</div><h2>¡Solicitud enviada!</h2><p>Gracias, <b>${esc(s.nombre.split(" ")[0])}</b>. En breve te enviamos tu código por WhatsApp al <b>${esc(s.celular)}</b>.</p>
      <a class="btn btn-teal" target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Soy ${s.nombre}. Acabo de solicitar el acceso a la demo de ${sis}${s.negocio ? " para mi negocio: " + s.negocio : ""}.`)}">AVISAR POR WHATSAPP</a>
      <p class="form-note">¿Tienes apuro? Toca el botón y te respondemos más rápido.</p></div>`;
  });
  async function entrar(c, silencioso) {
    err("#acErr", ""); const r = $("#acRes"); if (!silencioso) r.innerHTML = `<p class="form-note" style="text-align:center">Verificando…</p>`;
    const a = await DB.acceso(c);
    if (!a) { r.innerHTML = ""; try { localStorage.removeItem("zk_codigo"); } catch (e) {} if (!silencioso) err("#acErr", "Código no válido o vencido. Pídenos uno nuevo por WhatsApp."); return; }
    try { localStorage.setItem("zk_codigo", a.codigo); } catch (e) {}
    const fila = (t, v, sec) => v ? `<div class="zk-cred"><span>${t}</span><b class="${sec ? "zk-sec" : ""}">${esc(v)}</b><button type="button" class="zk-copy" data-copy="${esc(v)}">Copiar</button></div>` : "";
    r.innerHTML = `<div class="zk-acc-h reveal visible"><div><small>Acceso de</small><b>${esc(a.nombre || "Invitado")}</b></div><div><small>Código</small><b>${esc(a.codigo)}</b></div><div><small>Válido hasta</small><b>${fechaPE(a.venceMs)}</b></div><button type="button" class="btn btn-outline" id="acOut">SALIR</button></div>
      <div class="zk-acc">${(a.demos || []).map(d => { const p = PORT.find(x => x.id === d.id) || {}; return `<article class="zk-acc-card">
        <div class="zk-acc-img">${p.foto ? `<img src="${esc(img(p.foto))}" alt="" loading="lazy">` : `<div class="zk-ph">${esc(inicial(d.nombre))}</div>`}</div>
        <div class="zk-acc-b"><span class="project-cat" style="position:static">${esc(TIPOS[p.tipo] || "Sistema web")}</span><h3>${esc(d.nombre)}</h3>${p.desc ? `<p>${esc(p.desc)}</p>` : ""}
          <div class="zk-links">${d.web ? `<a class="btn btn-teal" href="${esc(d.web)}" target="_blank" rel="noopener">🌐 ABRIR LA WEB</a>` : `<span class="zk-pend">Web en preparación</span>`}${d.admin ? `<a class="btn btn-navy" href="${esc(d.admin)}" target="_blank" rel="noopener">⚙️ ABRIR EL PANEL</a>` : ""}</div>
          ${d.usuario || d.clave ? `<div class="zk-creds"><b>Datos para entrar al panel</b>${fila("Usuario", d.usuario)}${fila("Contraseña", d.clave, true)}</div>` : ""}
          ${d.nota ? `<p class="form-note">${esc(d.nota)}</p>` : ""}</div></article>`; }).join("") || `<p>Este código no tiene demos asignadas. Escríbenos por WhatsApp.</p>`}</div>
      <div class="zk-acc-foot">¿Te gustó? <a class="btn btn-teal wa-link" target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Probé la demo con el código ${a.codigo} y quiero cotizar mi sistema.`)}">QUIERO UNO PARA MI NEGOCIO</a></div>`;
    $("#acOut").addEventListener("click", () => { try { localStorage.removeItem("zk_codigo"); } catch (e) {} r.innerHTML = ""; $("#acC").value = ""; });
    if (!silencioso) r.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("#acF").addEventListener("submit", e => { e.preventDefault(); entrar($("#acC").value); });
  $("#acRes").addEventListener("click", e => { const b = e.target.closest("[data-copy]"); if (!b) return; navigator.clipboard?.writeText(b.dataset.copy).catch(() => {}); b.textContent = "Copiado ✓"; setTimeout(() => b.textContent = "Copiar", 1500); });
  if (params.get("codigo")) { $("#acC").value = params.get("codigo"); entrar(params.get("codigo")); } else if (guardado) entrar(guardado, true);
}

/* ---------- Planes y precios ---------- */
function paginaPrecios() {
  const g = $("#planesGrid"); if (!g) return;
  const l = PLANES.filter(p => p.visible !== false).sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
  g.innerHTML = l.map(p => { const s = precioSoles(p);
    return `<div class="card plan reveal${p.destacado ? " featured" : ""}">${p.destacado ? `<span class="tag">MÁS POPULAR</span>` : ""}
      <h3>${esc(p.nombre)}</h3>${p.tipo ? `<div class="zk-plan-tipo">${esc(p.tipo)}</div>` : ""}
      <div class="price">${precioTxt(p)}</div><div class="price-note">${esc(p.nota || "")}${s && p.moneda === "USD" ? ` · aprox. ${soles(s)}` : ""}</div>
      <ul>${(p.items || []).map(i => i.startsWith("-") ? `<li class="no">${esc(i.slice(1).trim())}</li>` : `<li>${esc(i)}</li>`).join("")}</ul>
      ${p.pagable && s ? `<a href="/contratar?plan=${encodeURIComponent(p.id)}" class="btn ${p.destacado ? "btn-teal" : "btn-outline"}">CONTRATAR</a>` : `<a href="/contacto?plan=${encodeURIComponent(p.nombre)}" class="btn ${p.destacado ? "btn-teal" : "btn-outline"}">COTIZAR</a>`}</div>`; }).join("");
  revelar(g);
}

/* ---------- Contratar un plan: pago con Yape, Plin o transferencia ---------- */
function paginaContratar() {
  const box = $("#contratarBox"); if (!box) return;
  const p = PLANES.find(x => x.id === params.get("plan") && x.pagable && precioSoles(x));
  if (!p) { box.innerHTML = `<div class="box zk-panel" style="text-align:center"><h2>Elige un plan</h2><p class="form-note">Ese plan no está disponible para pago en línea.</p><a class="btn btn-teal" href="/precios">VER PLANES</a></div>`; return; }
  const total = precioSoles(p), pct = Math.min(100, Math.max(10, +AJ.adelantoPct || 50)), adel = Math.round(total * pct) / 100;
  let pago = null;
  box.innerHTML = `<div class="zk-buy">
    <aside class="box zk-panel zk-sum"><span class="zk-step">TU PLAN</span><h2>${esc(p.nombre)}</h2><div class="zk-plan-tipo">${esc(p.tipo || "")}</div>
      <div class="zk-sum-p">${precioTxt(p)}</div>${p.moneda === "USD" ? `<p class="form-note" style="margin:0">Equivale a <b>${soles(total)}</b> (tipo de cambio ${(+AJ.tipoCambio || 3.75).toFixed(2)})</p>` : ""}
      <ul class="zk-inc">${(p.items || []).filter(i => !i.startsWith("-")).map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <a href="/precios" class="zk-back">← Cambiar de plan</a></aside>
    <form class="box zk-panel" id="ctF" novalidate>
      <span class="zk-step">DATOS Y PAGO</span><h2>Contratar plan ${esc(p.nombre)}</h2>
      <label>¿Cuánto pagas ahora?</label>
      <div class="zk-opts"><label class="zk-opt on"><input type="radio" name="tp" value="adelanto" checked><span><b>Adelanto ${pct}%</b><small>${soles(adel)} ahora y ${soles(total - adel)} al entregar</small></span></label>
        <label class="zk-opt"><input type="radio" name="tp" value="total"><span><b>Pago completo</b><small>${soles(total)}</small></span></label></div>
      <div class="form-row"><div><label for="ctN">Nombre *</label><input id="ctN" autocomplete="name"></div><div><label for="ctC">Celular (WhatsApp) *</label><input id="ctC" type="tel" inputmode="tel" autocomplete="tel"></div></div>
      <div class="form-row"><div><label for="ctE">Correo</label><input id="ctE" type="email" autocomplete="email"></div><div><label for="ctB">Negocio *</label><input id="ctB" placeholder="Nombre de tu negocio"></div></div>
      <div class="form-row"><div><label for="ctK">Comprobante</label><select id="ctK"><option>Boleta</option><option>Factura</option></select></div><div><label for="ctD">DNI o RUC</label><input id="ctD" inputmode="numeric" maxlength="11" placeholder="Opcional para boleta"></div></div>
      <label for="ctX">Cuéntanos tu proyecto *</label><textarea id="ctX" placeholder="¿Qué vende tu negocio? ¿Qué secciones o funciones necesitas? ¿Tienes logo y fotos?"></textarea>
      <label>Forma de pago</label><div id="pagoBox"></div>
      <p class="zk-err" id="ctErr" role="alert"></p>
      <button class="btn btn-teal" type="submit" id="ctBtn" style="width:100%">CONFIRMAR Y ENVIAR PAGO</button>
      <p class="form-note">Validamos tu pago y te escribimos por WhatsApp para coordinar la reunión de inicio. Al enviar aceptas los <a href="/terminos" style="color:var(--teal);font-weight:600">Términos y condiciones</a>.</p>
    </form></div>`;
  const monto = () => ($('[name="tp"]:checked') || {}).value === "total" ? total : adel;
  pago = Pago($("#pagoBox"), AJ, { contraEntrega: false }); pago.pintar().then(() => pago.setMonto(monto())); pago.setMonto(monto());
  $("#ctF").addEventListener("change", e => { if (e.target.name === "tp") { $$(".zk-opt").forEach(l => l.classList.toggle("on", l.contains(e.target))); pago.setMonto(monto()); } if (e.target.id === "ctK") $("#ctD").placeholder = e.target.value === "Factura" ? "RUC (11 dígitos) *" : "Opcional para boleta"; });
  $("#ctF").addEventListener("submit", async e => {
    e.preventDefault(); const er = m => { $("#ctErr").textContent = m; $("#ctErr").scrollIntoView({ block: "center", behavior: "smooth" }); }, v = id => ($("#" + id).value || "").trim();
    $("#ctErr").textContent = "";
    if (!v("ctN") || v("ctC").replace(/\D/g, "").length < 9) return er("Escribe tu nombre y un celular válido.");
    if (!v("ctB")) return er("Escribe el nombre de tu negocio.");
    if (v("ctK") === "Factura" && v("ctD").replace(/\D/g, "").length !== 11) return er("Para factura escribe tu RUC de 11 dígitos.");
    if (v("ctX").length < 10) return er("Cuéntanos un poco de tu proyecto.");
    pago.setMonto(monto()); const pe = pago.validar(); if (pe) return er(pe);
    const pd = pago.datos(), cod = codigo("ZK"), tp = ($('[name="tp"]:checked') || {}).value;
    const ped = { codigo: cod, plan: p.id, items: [{ n: `Plan ${p.nombre}${p.tipo ? " · " + p.tipo : ""}`, precio: total, cant: 1 }], subtotal: total, envio: 0, total, monto: monto(), tipoPago: tp,
      nombre: v("ctN").slice(0, 80), celular: v("ctC").slice(0, 20), email: v("ctE").slice(0, 80), negocio: v("ctB").slice(0, 120), doc: v("ctD").slice(0, 11), comprobante: v("ctK"), detalle: v("ctX").slice(0, 1500),
      pago: pd.pago, banco: pd.banco, operacion: pd.operacion, montoLeido: pd.montoLeido, coincide: pd.coincide, fechaOk: pd.fechaOk, estado: "por-validar", origen: "web", creado: new Date().toISOString() };
    const b = $("#ctBtn"); b.disabled = true; b.textContent = "ENVIANDO…";
    try { await DB.crearPedido(ped, pd.captura); } catch (x) { console.error(x); b.disabled = false; b.textContent = "CONFIRMAR Y ENVIAR PAGO"; return er("No se pudo enviar. Revisa tu conexión e inténtalo otra vez."); }
    const msg = `Hola ziko.pro 👋 Acabo de contratar el *Plan ${p.nombre}* (código *${cod}*).\nNegocio: ${ped.negocio}\nPagué ${soles(ped.monto)} con ${ped.pago}${ped.banco ? " " + ped.banco : ""}${tp === "adelanto" ? ` (adelanto de ${soles(total)})` : ""}.`;
    box.innerHTML = `<div class="box zk-panel zk-ok" style="max-width:720px;margin:0 auto"><div class="zk-ok-i">✓</div><h2>¡Gracias, ${esc(ped.nombre.split(" ")[0])}!</h2><p>Recibimos tu pedido. Tu código es</p><div class="zk-ok-code">${cod}</div>
      <p>Estamos validando tu pago de <b>${soles(ped.monto)}</b>. Te escribiremos por WhatsApp para coordinar la reunión de inicio.</p>
      <div class="zk-acts" style="justify-content:center"><a class="btn btn-teal" target="_blank" rel="noopener" href="${waLink(msg)}">AVISAR POR WHATSAPP</a><button class="btn btn-outline" type="button" id="rcB">DESCARGAR RECIBO PDF</button></div></div>`;
    $("#rcB").addEventListener("click", async ev => { const bt = ev.currentTarget; bt.disabled = true; bt.textContent = "GENERANDO…"; try { await pdfRecibo(ped); } catch (x) { console.error(x); aviso("No se pudo generar el recibo."); } bt.disabled = false; bt.textContent = "DESCARGAR RECIBO PDF"; });
    scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Recibo de pago en PDF ---------- */
async function pdfRecibo(p) {
  await cargarScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a5" }), W = 148, H = 210, M = 10, S = soles;
  const T = (t, x, y, o) => doc.text(String(t ?? ""), x, y, o), F = (b, z, c = 20) => { doc.setFont("helvetica", b ? "bold" : "normal"); doc.setFontSize(z); doc.setTextColor(c); };
  doc.setFillColor(18, 48, 90); doc.rect(0, 0, W, 24, "F"); doc.setFillColor(34, 195, 190); doc.rect(0, 24, W, 1.6, "F");
  F(1, 15, 255); T(AJ.nombre || "ziko.pro", M, 12); F(0, 7.5, 210); T("Desarrollo web & aplicaciones" + (AJ.ruc ? " · RUC " + AJ.ruc : ""), M, 17); T([AJ.telefono, AJ.email].filter(Boolean).join(" · "), M, 21);
  F(1, 9, 255); T("RECIBO DE PAGO", W - M, 12, { align: "right" }); F(1, 11, 255); T(p.codigo, W - M, 18, { align: "right" });
  let y = 34; F(0, 8, 90); T("Fecha: " + fechaPE(p.creado, true), M, y); T("Estado: pago por validar", W - M, y, { align: "right" });
  y += 6; doc.setFillColor(243, 247, 251); doc.roundedRect(M, y, W - 2 * M, 24, 1.5, 1.5, "F");
  F(1, 7, 120); T("CLIENTE", M + 3, y + 5); F(1, 9.5); T(p.nombre, M + 3, y + 10); F(0, 8, 70);
  T(`${p.negocio || ""}${p.doc ? " · " + (p.doc.length === 11 ? "RUC " : "DNI ") + p.doc : ""}`, M + 3, y + 15); T([p.celular, p.email].filter(Boolean).join(" · "), M + 3, y + 20);
  y += 30; doc.setFillColor(18, 48, 90); doc.rect(M, y, W - 2 * M, 7, "F"); F(1, 7.5, 255); T("DESCRIPCIÓN", M + 3, y + 4.8); T("IMPORTE", W - M - 3, y + 4.8, { align: "right" }); y += 7;
  (p.items || []).forEach(i => { F(0, 8.5, 30); const l = doc.splitTextToSize(i.n, 90); l.forEach((x, k) => T(x, M + 3, y + 5 + k * 4)); F(1, 8.5, 30); T(S(i.precio * i.cant), W - M - 3, y + 5, { align: "right" }); y += 4 * l.length + 4; });
  doc.setDrawColor(210); doc.line(M, y, W - M, y); y += 6;
  const filas = [["Total del proyecto", p.total], [p.tipoPago === "total" ? "Pagado (completo)" : "Pagado ahora (adelanto)", p.monto], ["Saldo al entregar", Math.max(0, p.total - p.monto)]];
  filas.forEach(([k, v], i) => { const last = i === filas.length - 1; if (i === 1) { doc.setFillColor(34, 195, 190); doc.roundedRect(W - M - 70, y - 4.5, 70, 7, 1.2, 1.2, "F"); } F(i === 1, i === 1 ? 9.5 : 8.5, i === 1 ? 255 : 60); T(k, W - M - 30, y, { align: "right" }); T(S(v), W - M - 3, y, { align: "right" }); y += last ? 6 : 7; });
  F(1, 7, 120); T("PAGO", M, y + 2); F(0, 8, 40); T(`${p.pago || ""}${p.banco ? " · " + p.banco : ""}${p.operacion ? " · Op. " + p.operacion : ""}`, M, y + 7);
  if (p.detalle) { y += 16; F(1, 7, 120); T("TU PROYECTO", M, y); F(0, 8, 60); doc.splitTextToSize(p.detalle, W - 2 * M).slice(0, 8).forEach((x, k) => T(x, M, y + 5 + k * 4)); }
  doc.setDrawColor(220); doc.line(M, H - 16, W - M, H - 16);
  F(1, 7, 90); T("Este recibo no reemplaza la boleta o factura electrónica.", W / 2, H - 11, { align: "center" });
  F(0, 6.5, 140); T("¡Gracias por confiar en " + (AJ.nombre || "ziko.pro") + "! · " + (AJ.email || ""), W / 2, H - 7, { align: "center" });
  doc.save(`Recibo-${p.codigo}.pdf`);
}

/* ---------- Contacto (se guarda en el panel y abre WhatsApp) ---------- */
const contactForm = $("#contactForm");
if (contactForm) {
  const plan = params.get("plan");
  if (plan) { const sel = $("#servicio"); [...sel.options].forEach(o => { if (o.text.toLowerCase().includes(plan.toLowerCase())) sel.value = o.value; }); const m = $("#mensaje"); if (m && !m.value) m.value = `Hola, me interesa el plan ${plan}. `; }
  contactForm.addEventListener("submit", async e => {
    e.preventDefault(); const v = id => ($("#" + id).value || "").trim();
    const m = { nombre: v("nombre").slice(0, 80), telefono: v("telefono").slice(0, 20), asunto: v("servicio").slice(0, 80), mensaje: `${v("mensaje")}\n\nNegocio: ${v("negocio") || "—"} · Presupuesto: ${v("presupuesto")}`.slice(0, 1500), estado: "nuevo", creado: new Date().toISOString() };
    try { await DB.mensaje(m); } catch (er) { console.warn(er); }
    window.open(waLink("Hola ziko.pro 👋\nNombre: " + m.nombre + "\nNegocio: " + v("negocio") + "\nTeléfono: " + m.telefono + "\nServicio: " + m.asunto + "\nPresupuesto: " + v("presupuesto") + "\nMensaje: " + v("mensaje")), "_blank");
    contactForm.reset(); aviso("✓ Mensaje enviado. Te responderemos pronto.");
  });
}

/* ---------- Libro de Reclamaciones (se guarda en el panel y por correo) ---------- */
const reclamoForm = $("#reclamoForm");
if (reclamoForm) {
  const d = new Date(), hoja = "ZK-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + String(d.getTime()).slice(-5);
  $("#hoja").textContent = hoja; $("#fecha").textContent = d.toLocaleDateString("es-PE");
  reclamoForm.addEventListener("submit", async e => {
    e.preventDefault();
    const v = id => ($("#" + id).value || "").trim(), r = n => ($('input[name="' + n + '"]:checked') || {}).value || "";
    const cuerpo = "HOJA DE RECLAMACIÓN N° " + hoja + "\nFecha: " + d.toLocaleDateString("es-PE") + "\n\n1. CONSUMIDOR\nNombre: " + v("r_nombre") + "\nDocumento: " + v("r_doc") + "\nDomicilio: " + v("r_dir") + "\nTeléfono: " + v("r_tel") + "\nCorreo: " + v("r_email") +
      "\nMenor de edad: " + r("menor") + (v("r_apoderado") ? "\nPadre/Madre/Apoderado: " + v("r_apoderado") : "") + "\n\n2. BIEN CONTRATADO\nTipo: " + r("bien") + "\nMonto: " + v("r_monto") + "\nDescripción: " + v("r_desc") + "\n\n3. DETALLE\nTipo: " + r("tipo") + "\nDetalle: " + v("r_detalle") + "\nPedido: " + v("r_pedido");
    try { await DB.mensaje({ nombre: v("r_nombre").slice(0, 80), telefono: v("r_tel").slice(0, 20), asunto: `Libro de reclamaciones · ${r("tipo")} ${hoja}`, mensaje: cuerpo.slice(0, 3800), estado: "nuevo", creado: d.toISOString() }); } catch (er) { console.warn(er); }
    $("#reclamoOk").style.display = "block";
    location.href = "mailto:" + (AJ.email || "contacto@ziko.pro") + "?subject=" + encodeURIComponent("Libro de Reclamaciones - " + hoja) + "&body=" + encodeURIComponent(cuerpo);
  });
}

/* ---------- Arranque: carga los datos del panel ---------- */
(async function () {
  const c = await DB.catalogo();
  AJ = c.aj || {}; PORT = c.port || []; PLANES = c.planes || [];
  aplicarAjustes(); portafolio(); paginaDemo(); paginaPrecios(); paginaContratar();
})();

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
const TC = () => +AJ.tipoCambio || 3.75;
const usd = sol => { const v = Math.round((+sol || 0) / TC() * 100) / 100; return "$" + v.toLocaleString("es-PE", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }); };   // precio en soles → se muestra en dólares
const precioTxt = p => p.precio == null || p.precio === "" ? "A medida" : (p.moneda === "USD" ? "$" + (+p.precio).toLocaleString("es-PE") : usd(p.precio)) + ` <small>USD</small>`;
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
  const sis = esSis(p), dl = demoLibre(p), ven = vendible(p), acts = [];
  const precio = sis ? (p.demo && ven ? `<div class="zk-price">${conMensual(p) ? `${usd(cuotaDe(p))}<small> /mes</small>` : ""}${conMensual(p) && precioSoles(p) ? `<span class="o">o</span>` : ""}${precioSoles(p) ? `${precioTxt(p)}<span>compra completa</span>` : ""}</div>` : "")
    : precioSoles(p) ? `<div class="zk-price">${precioTxt(p)}<span>pago único</span></div>` : "";
  if (sis && p.demo) acts.push(`<a class="btn btn-teal" href="/demo?s=${encodeURIComponent(p.id)}">VER DEMO</a>`);
  if (dl) acts.push(`<a class="btn btn-teal" href="${esc(dl)}" target="_blank" rel="noopener">VER DEMO</a>`);
  if (ven) acts.push(`<a class="btn btn-navy" href="/contratar?sistema=${encodeURIComponent(p.id)}${sis ? "" : "&modo=completo"}">COMPRAR</a>`);
  else if (!sis) acts.push(`<a class="btn btn-navy" href="${esc(waLink(`Hola ziko.pro 👋 Quiero cotizar ${TIPO1[p.tipo] || "un proyecto"} como «${p.nombre}» para mi negocio.`))}" target="_blank" rel="noopener">COTIZAR</a>`);
  if (sis && p.link) acts.push(`<a class="btn btn-outline" href="${esc(p.link)}" target="_blank" rel="noopener">VER PROYECTO</a>`);
  return `<article class="project zk-card reveal" data-cat="${esc(p.tipo)}">
    <div class="project-img">${p.foto ? `<img src="${esc(img(p.foto))}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'zk-ph',textContent:'${esc(inicial(p.nombre))}'}))">` : `<div class="zk-ph">${esc(inicial(p.nombre))}</div>`}
      <span class="project-cat">${esc(TIPOS[p.tipo] || p.tipo)}</span>${(sis && p.demo) || dl ? `<span class="zk-demo-tag">DEMO DISPONIBLE</span>` : ""}</div>
    <div class="project-info"><h3>${esc(p.nombre)}</h3><p>${esc(p.desc || "")}</p>
      ${precio}${acts.length ? `<div class="zk-acts">${acts.join("")}</div>` : ""}</div>
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
    const filtrar = f => $$(".project", g).forEach((el, i) => el.classList.toggle("hide", f === "demo" ? !(vis[i].demo || demoLibre(vis[i])) : f !== "todos" && el.dataset.cat !== f));
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
          ${d.nota ? `<p class="form-note">${esc(d.nota)}</p>` : ""}
          ${comparativa(p) || `<div class="zk-buy-row"><div><small>Precio</small><b>Según tu negocio</b></div><a class="btn btn-teal" target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Probé la demo de ${d.nombre} (código ${a.codigo}) y quiero uno para mi negocio.`)}">QUIERO UNO PARA MI NEGOCIO</a></div>`}</div></article>`; }).join("") || `<p>Este código no tiene demos asignadas. Escríbenos por WhatsApp.</p>`}</div>
      <div class="zk-acc-foot">¿Tienes dudas antes de comprar? <a class="btn btn-outline" target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Probé la demo con el código ${a.codigo} y tengo unas preguntas.`)}">ESCRÍBENOS POR WHATSAPP</a> <a class="btn btn-navy" href="/mis-compras">MIS COMPRAS</a></div>`;
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
      <div class="price">${precioTxt(p)}</div><div class="price-note">${esc(p.nota || "")}${s ? ` · aprox. ${soles(s)}` : ""}</div>
      <ul>${(p.items || []).map(i => i.startsWith("-") ? `<li class="no">${esc(i.slice(1).trim())}</li>` : `<li>${esc(i)}</li>`).join("")}</ul>
      ${p.pagable && s ? `<a href="/contratar?plan=${encodeURIComponent(p.id)}" class="btn ${p.destacado ? "btn-teal" : "btn-outline"}">CONTRATAR</a>` : `<a href="/contacto?plan=${encodeURIComponent(p.nombre)}" class="btn ${p.destacado ? "btn-teal" : "btn-outline"}">COTIZAR</a>`}</div>`; }).join("");
  const md = $("#modalidades");
  if (md) { const sis = PORT.filter(p => p.demo && p.visible !== false && (conMensual(p) || precioSoles(p))), min = Math.min(...sis.map(p => cuotaDe(p)));
    md.innerHTML = sis.length ? `<div class="zk-modal-sec reveal"><div class="section-title"><h2>Sistemas web: ¿mensual o completo?</h2><div class="line"></div><p>Nuestros sistemas (ferretería, tienda de ropa, hospedaje, consultorio…) los puedes tener de dos formas. Elige la que le conviene a tu negocio.</p></div>
      <div class="zk-mods"><div class="zk-mod"><span class="zk-mod-tag">PAGA MES A MES</span><h3>Plan mensual</h3><div class="zk-mod-p">${usd(min)}<small> / mes</small></div><p class="zk-mod-n">Pagas a fin de cada mes · sin permanencia${INSTAL() ? ` · ${usd(INSTAL())} de instalación solo si quieres dominio propio` : ""}</p>
        <ul><li>Empiezas pagando poco</li><li>Hosting, base de datos y mantenimiento incluidos</li><li>Soporte mientras tu plan esté activo</li><li class="no">El sistema y el código son de ziko.pro</li><li class="no">Si no pagas en ${GRACIA()} días después de fin de mes, se bloquea</li></ul></div>
        <div class="zk-mod hi"><span class="zk-mod-tag">PAGO ÚNICO · ES TUYO</span><h3>Compra completa</h3><div class="zk-mod-p">Pago único</div><p class="zk-mod-n"><b>${PCT()}% de adelanto</b> y el resto cuando te entregamos el sistema</p>
        <ul><li>Sin mensualidades nunca más</li><li>El sistema es tuyo para siempre</li><li>Código completo y base de datos a tu nombre</li><li>Puedes mejorarlo en el futuro</li><li><b>Soporte gratis por ${soporteTxt()}</b></li></ul></div></div>
      <div class="zk-sis-list">${sis.map(p => `<a class="zk-sis" href="/contratar?sistema=${encodeURIComponent(p.id)}"><b>${esc(p.nombre)}</b><span>${conMensual(p) ? usd(cuotaDe(p)) + " /mes" : ""}${conMensual(p) && precioSoles(p) ? " · " : ""}${precioSoles(p) ? precioTxt(p).replace(/<[^>]+>/g, "") + " completo" : ""}</span><em>ELEGIR →</em></a>`).join("")}</div></div>` : ""; }
  revelar(g); revelar(md || document);
}

/* ---------- Mis compras: códigos guardados en este dispositivo ---------- */
const MIS = {
  get() { try { const l = JSON.parse(localStorage.getItem("zk_compras")); return Array.isArray(l) ? l : []; } catch (e) { return []; } },
  guardar(l) { try { localStorage.setItem("zk_compras", JSON.stringify(l.slice(0, 40))); } catch (e) {} },
  add(c) { c = String(c || "").trim().toUpperCase(); if (!c) return; const l = MIS.get(); if (!l.includes(c)) { l.unshift(c); MIS.guardar(l); } },
  del(c) { MIS.guardar(MIS.get().filter(x => x !== c)); }
};
const EST = { "por-validar": "Pago en revisión", confirmado: "Confirmado", desarrollo: "En desarrollo", entregado: "Entregado", rechazado: "Pago rechazado", anulado: "Anulado" };
const pagadoDe = p => +p.pagado || 0, saldoDe = p => p.modalidad === "mensual" ? 0 : Math.max(0, Math.round(((+p.total || 0) - pagadoDe(p)) * 100) / 100);
const PCT = () => Math.min(100, Math.max(10, +AJ.adelantoPct || 50)), GRACIA = () => +AJ.gracia >= 0 && AJ.gracia !== "" ? +AJ.gracia : 5;
const cuotaDe = s => +((s && s.mensual) || AJ.mensual || 120), INSTAL = () => +(AJ.instalacion ?? 300), SOPORTE = () => +AJ.soporteMeses || 24;
const esSis = p => (p.tipo || "sistema") === "sistema";
const conMensual = s => s && esSis(s) && s.demo && s.mensualActivo !== false && cuotaDe(s) > 0;
const demoLibre = p => !esSis(p) && (p.demoUrl || p.link) || "";                    // webs, apps y tiendas: la demo abre directo, sin código
const vendible = p => esSis(p) ? !!(p.demo && (conMensual(p) || precioSoles(p))) : !!precioSoles(p);   // webs, apps y tiendas: solo compra completa
const TIPO1 = { sistema: "un sistema", app: "una aplicación", web: "una página web", tienda: "una tienda online" };
const soporteTxt = () => { const m = SOPORTE(); return m % 12 ? `${m} meses` : `${m / 12} año${m > 12 ? "s" : ""}`; };
const fechaCorta = iso => iso ? new Date(String(iso).slice(0, 10) + "T12:00:00").toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }) : "";
/* Estado de un plan mensual según su fecha de pago y los días de plazo */
function estadoMensual(p) {
  if (p.baja) return ["Plan dado de baja", "mute"]; if (p.bloqueado) return ["Bloqueado por falta de pago", "bad"]; if (!p.vence) return ["Se activa al validar tu pago", "mute"];
  const hoy = new Date(new Date().toDateString()), v = new Date(p.vence + "T00:00:00"), dif = Math.round((hoy - v) / 864e5), g = GRACIA();
  if (dif <= 0) return -dif <= 5 ? [dif === 0 ? "Tu pago vence hoy" : `Tu pago vence en ${-dif} día(s)`, "warn"] : ["Al día", "ok"];
  return dif <= g ? [`Pago vencido · tienes ${g - dif + 1} día(s) para pagar`, "warn"] : ["Pago vencido · servicio por bloquear", "bad"];
}

/* Tarjetas comparativas: plan mensual vs. compra completa */
function comparativa(s, extra = "") {
  const c = cuotaDe(s), t = precioSoles(s), pct = PCT();
  const m = conMensual(s) ? `<div class="zk-mod">
      <span class="zk-mod-tag">PAGA MES A MES</span><h3>Plan mensual</h3>
      <div class="zk-mod-p">${usd(c)}<small> / mes</small></div><p class="zk-mod-n">Al pagar: ${soles(c)} al mes${INSTAL() ? ` · instalación ${soles(INSTAL())}` : ""}</p><p class="zk-mod-n">Pagas a fin de cada mes · sin permanencia${INSTAL() ? ` · <b>+ ${usd(INSTAL())}</b> de instalación solo si quieres dominio propio` : ""}</p>
      <ul><li>Sistema listo con tu logo y tus datos</li><li>Hosting y base de datos incluidos</li><li>Mantenimiento y mejoras</li><li>Soporte mientras tu plan esté activo</li><li class="no">El código y la base de datos son de ziko.pro</li><li class="no">Si no pagas en ${GRACIA()} días después de fin de mes, se bloquea</li></ul>
      <a class="btn btn-outline" href="/contratar?sistema=${encodeURIComponent(s.id)}&modo=mensual${extra}">ELEGIR PLAN MENSUAL</a></div>` : "";
  const k = t ? `<div class="zk-mod hi">
      <span class="zk-mod-tag">PAGO ÚNICO · ES TUYO</span><h3>Compra completa</h3>
      <div class="zk-mod-p">${precioTxt(s)}</div><p class="zk-mod-n">${t ? `≈ ${soles(t)} · ` : ""}<b>${pct}% de adelanto</b> (${soles(Math.round(t * pct) / 100)}) y el resto al entregar</p>
      <ul><li>Sin mensualidades: te olvidas de pagar cada mes</li><li>El sistema es tuyo para siempre</li><li>Código completo para mejorarlo en el futuro</li><li>Base de datos en tu propia cuenta</li><li><b>Soporte gratis por ${soporteTxt()}</b></li><li class="info">Tu dominio y el plan de Firebase (gratis para negocios pequeños) van a tu nombre</li></ul>
      <a class="btn btn-teal" href="/contratar?sistema=${encodeURIComponent(s.id)}&modo=completo${extra}">COMPRAR COMPLETO</a></div>` : "";
  return m || k ? `<div class="zk-mods${m && k ? "" : " uno"}">${m}${k}</div>` : "";
}

/* ---------- Comprar: un plan, un sistema (mensual o completo) o pagar una cuota/saldo ---------- */
async function paginaContratar() {
  const box = $("#contratarBox"); if (!box) return;
  if (params.get("saldo")) return pagarSaldo(box, params.get("saldo"));
  const pct = PCT(), tc = (+AJ.tipoCambio || 3.75).toFixed(2);
  const pl = PLANES.find(x => x.id === params.get("plan") && x.pagable && precioSoles(x)), si = PORT.find(x => x.id === params.get("sistema") && vendible(x));
  let modo = params.get("modo");
  if (si && !esSis(si)) modo = "completo";   // webs, apps y tiendas: solo compra completa
  if (si && !modo) {   // elegir cómo comprarlo
    box.innerHTML = `<div class="box zk-panel zk-elige"><span class="zk-step">ELIGE CÓMO LO QUIERES</span><h2>${esc(si.nombre)}</h2><p class="form-note">Compara y elige lo que más le conviene a tu negocio. Puedes probar la demo antes de decidir.</p>${comparativa(si)}
      <p class="zk-mod-help">¿Dudas? <a target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Quiero el sistema ${si.nombre}. ¿Me conviene el plan mensual o la compra completa?`)}">Pregúntanos por WhatsApp</a> · <a href="/demo?s=${encodeURIComponent(si.id)}">Probar la demo</a></p></div>`;
    return;
  }
  if (si && modo === "completo" && !precioSoles(si)) modo = conMensual(si) ? "mensual" : "";
  if (si && modo === "mensual" && !conMensual(si)) modo = precioSoles(si) ? "completo" : "";
  let item = null;
  if (pl) item = { tipo: "plan", id: pl.id, nombre: `Plan ${pl.nombre}`, sub: pl.tipo || "", moneda: pl.moneda, precioTxt: precioTxt(pl), total: precioSoles(pl), incluye: (pl.items || []).filter(i => !i.startsWith("-")), volver: ["/precios", "Cambiar de plan"] };
  else if (si && !esSis(si)) item = { tipo: "completo", id: si.id, nombre: si.nombre, sub: `${TIPOS[si.tipo] || ""} · pago único`, moneda: si.moneda, precioTxt: precioTxt(si), total: precioSoles(si), foto: si.foto, etq: "TU " + (TIPOS[si.tipo] || "PROYECTO").toUpperCase(),
    incluye: ["Hecha a tu medida con tu logo, colores y datos", "Diseño adaptable a celulares", "Botón de WhatsApp y redes sociales", "Código completo a tu nombre", "Publicada y lista para usar", `Soporte gratis por ${soporteTxt()}`], volver: ["/portafolio", "Ver portafolio"] };
  else if (si && modo === "completo") item = { tipo: "completo", id: si.id, nombre: si.nombre, sub: "Compra completa · pago único", moneda: si.moneda, precioTxt: precioTxt(si), total: precioSoles(si), foto: si.foto,
    incluye: ["El sistema es tuyo para siempre", "Código completo y base de datos a tu nombre", "Web pública + panel administrativo", "Personalizado con tu logo, colores y datos", "Capacitación para ti y tu equipo", `Soporte gratis por ${soporteTxt()}`], volver: [`/contratar?sistema=${encodeURIComponent(si.id)}`, "Ver plan mensual / completo"] };
  else if (si && modo === "mensual") item = { tipo: "mensual", id: si.id, nombre: si.nombre, sub: "Plan mensual", moneda: "USD", precioTxt: `${usd(cuotaDe(si))} <small>/ mes</small>`, total: cuotaDe(si), foto: si.foto,
    incluye: ["Sistema listo con tu logo y tus datos", "Hosting y base de datos incluidos", "Mantenimiento, mejoras y soporte", "Sin permanencia: cancelas cuando quieras", `Pagas a fin de cada mes (${GRACIA()} días de plazo)`], volver: [`/contratar?sistema=${encodeURIComponent(si.id)}`, "Ver plan mensual / completo"] };
  if (!item) { box.innerHTML = `<div class="box zk-panel" style="text-align:center"><h2>Elige qué quieres comprar</h2><p class="form-note">Ese plan o sistema no está disponible para pago en línea. Escríbenos y te ayudamos.</p><div class="zk-acts" style="justify-content:center"><a class="btn btn-teal" href="/precios">VER PLANES</a><a class="btn btn-outline" href="/demo">VER SISTEMAS</a></div></div>`; return; }
  const men = item.tipo === "mensual", total = item.total, adel = Math.round(total * pct) / 100;
  box.innerHTML = `<div class="zk-buy">
    <aside class="box zk-panel zk-sum"><span class="zk-step">${item.etq || (item.tipo === "plan" ? "TU PLAN" : "TU SISTEMA")}</span>${item.foto ? `<img class="zk-sum-img" src="${esc(img(item.foto))}" alt="">` : ""}<h2>${esc(item.nombre)}</h2><div class="zk-plan-tipo">${esc(item.sub)}</div>
      <div class="zk-sum-p">${item.precioTxt}</div>${total ? `<p class="form-note" style="margin:0">Al pagar equivale a <b>${soles(total)}</b> (tipo de cambio ${tc})</p>` : ""}
      <ul class="zk-inc">${item.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      ${men ? `<div class="zk-pay-split" id="ctSplit"></div>` : `<div class="zk-pay-split"><div><small>Adelanto ${pct}%</small><b>${soles(adel)}</b></div><div><small>Al entregar</small><b>${soles(total - adel)}</b></div></div>`}
      <a href="${item.volver[0]}" class="zk-back">← ${item.volver[1]}</a></aside>
    <form class="box zk-panel" id="ctF" novalidate>
      <span class="zk-step">DATOS Y PAGO</span><h2>${men ? "Plan mensual · " : item.tipo === "completo" ? "Compra completa · " : "Comprar "}${esc(item.nombre)}</h2>
      ${men ? `<label>Dominio</label>
      <div class="zk-opts"><label class="zk-opt on"><input type="radio" name="dom" value="no" checked><span><b>Sin dominio propio</b><small>Usas un enlace de ziko.pro · sin instalación</small></span></label>
        <label class="zk-opt"><input type="radio" name="dom" value="si"><span><b>Con dominio propio</b><small>minegocio.com · instalación ${usd(INSTAL())} (${soles(INSTAL())})</small></span></label></div>
      <div id="domBox" hidden><label for="ctDom">¿Qué dominio quieres?</label><input id="ctDom" placeholder="Ej. ferreteriamendoza.com (si ya lo tienes, escríbelo)"></div>`
      : `<label>¿Cuánto pagas ahora?</label>
      <div class="zk-opts"><label class="zk-opt on"><input type="radio" name="tp" value="adelanto" checked><span><b>Adelanto ${pct}%</b><small>${soles(adel)} ahora y ${soles(total - adel)} al entregar</small></span></label>
        <label class="zk-opt"><input type="radio" name="tp" value="total"><span><b>Pago completo</b><small>${soles(total)}</small></span></label></div>`}
      <div class="form-row"><div><label for="ctN">Nombre *</label><input id="ctN" autocomplete="name"></div><div><label for="ctC">Celular (WhatsApp) *</label><input id="ctC" type="tel" inputmode="tel" autocomplete="tel"></div></div>
      <div class="form-row"><div><label for="ctE">Correo</label><input id="ctE" type="email" autocomplete="email"></div><div><label for="ctB">Negocio *</label><input id="ctB" placeholder="Nombre de tu negocio"></div></div>
      <div class="form-row"><div><label for="ctK">Comprobante</label><select id="ctK"><option>Boleta</option><option>Factura</option></select></div><div><label for="ctD">DNI o RUC</label><input id="ctD" inputmode="numeric" maxlength="11" placeholder="Opcional para boleta"></div></div>
      <label for="ctX">${item.tipo === "plan" ? "Cuéntanos tu proyecto *" : "Cuéntanos de tu negocio *"}</label><textarea id="ctX" placeholder="${item.tipo === "plan" ? "¿Qué vende tu negocio? ¿Qué secciones o funciones necesitas? ¿Tienes logo y fotos?" : "¿Qué vendes? ¿Cuántas sedes o productos tienes? ¿Tienes logo? ¿Algo que quieras cambiar del sistema?"}"></textarea>
      <label>Forma de pago</label><div id="pagoBox"></div>
      <p class="zk-err" id="ctErr" role="alert"></p>
      <button class="btn btn-teal" type="submit" id="ctBtn" style="width:100%">CONFIRMAR Y ENVIAR PAGO</button>
      <p class="form-note">Validamos tu pago y te escribimos por WhatsApp para empezar. Verás tu compra${men ? ", tus mensualidades" : ""} y tus recibos en <a href="/mis-compras" style="color:var(--teal);font-weight:600">Mis compras</a>. Al enviar aceptas los <a href="/terminos" style="color:var(--teal);font-weight:600">Términos y condiciones</a>.</p>
    </form></div>`;
  const dom = () => men && ($('[name="dom"]:checked') || {}).value === "si";
  const monto = () => men ? total + (dom() ? INSTAL() : 0) : ($('[name="tp"]:checked') || {}).value === "total" ? total : adel;
  const split = () => { if (men) $("#ctSplit").innerHTML = `<div><small>Primer mes</small><b>${soles(total)}</b></div><div><small>${dom() ? "Instalación + dominio" : "Instalación"}</small><b>${dom() ? soles(INSTAL()) : "Gratis"}</b></div><div class="full"><small>Pagas hoy</small><b>${soles(monto())}</b></div>`; };
  const pago = Pago($("#pagoBox"), AJ, { contraEntrega: false }); pago.pintar().then(() => pago.setMonto(monto())); pago.setMonto(monto()); split();
  $("#ctF").addEventListener("change", e => {
    if (e.target.name === "tp" || e.target.name === "dom") { $$(`[name="${e.target.name}"]`).forEach(r => r.closest(".zk-opt").classList.toggle("on", r.checked)); pago.setMonto(monto()); split(); if (men) $("#domBox").hidden = !dom(); }
    if (e.target.id === "ctK") $("#ctD").placeholder = e.target.value === "Factura" ? "RUC (11 dígitos) *" : "Opcional para boleta"; });
  $("#ctF").addEventListener("submit", async e => {
    e.preventDefault(); const er = m => { $("#ctErr").textContent = m; $("#ctErr").scrollIntoView({ block: "center", behavior: "smooth" }); }, v = id => (($("#" + id) || {}).value || "").trim();
    $("#ctErr").textContent = "";
    if (!v("ctN") || v("ctC").replace(/\D/g, "").length < 9) return er("Escribe tu nombre y un celular válido.");
    if (!v("ctB")) return er("Escribe el nombre de tu negocio.");
    if (v("ctK") === "Factura" && v("ctD").replace(/\D/g, "").length !== 11) return er("Para factura escribe tu RUC de 11 dígitos.");
    if (v("ctX").length < 10) return er("Cuéntanos un poco de tu negocio o proyecto.");
    pago.setMonto(monto()); const pe = pago.validar(); if (pe) return er(pe);
    const pd = pago.datos(), cod = codigo("ZK", 8), tp = men ? "total" : ($('[name="tp"]:checked') || {}).value;
    const items = item.tipo === "plan" ? [{ n: `${item.nombre}${item.sub ? " · " + item.sub : ""}`, precio: total, cant: 1 }]
      : men ? [{ n: `Plan mensual · ${item.nombre} (primer mes)`, precio: total, cant: 1 }, ...(dom() ? [{ n: `Instalación con dominio propio${v("ctDom") ? " · " + v("ctDom") : ""}`, precio: INSTAL(), cant: 1 }] : [])]
      : [{ n: `Compra completa · ${item.nombre}`, precio: total, cant: 1 }];
    const tot = items.reduce((a, i) => a + i.precio * i.cant, 0);
    const ped = { codigo: cod, plan: item.tipo === "plan" ? item.id : "", sistema: item.tipo === "plan" ? "" : item.id, modalidad: item.tipo === "plan" ? "plan" : item.tipo, items, subtotal: tot, envio: 0, total: tot, monto: monto(), tipoPago: tp,
      ...(men ? { mensual: total, dominio: dom(), dominioNombre: v("ctDom").slice(0, 80) } : {}),
      nombre: v("ctN").slice(0, 80), celular: v("ctC").slice(0, 20), email: v("ctE").slice(0, 80), negocio: v("ctB").slice(0, 120), doc: v("ctD").slice(0, 11), comprobante: v("ctK"), detalle: v("ctX").slice(0, 1500),
      pago: pd.pago, banco: pd.banco, operacion: pd.operacion, montoLeido: pd.montoLeido, coincide: pd.coincide, fechaOk: pd.fechaOk, estado: "por-validar", origen: "web", creado: new Date().toISOString() };
    const b = $("#ctBtn"); b.disabled = true; b.textContent = "ENVIANDO…";
    try { await DB.crearPedido(ped, pd.captura); } catch (x) { console.error(x); b.disabled = false; b.textContent = "CONFIRMAR Y ENVIAR PAGO"; return er("No se pudo enviar. Revisa tu conexión e inténtalo otra vez."); }
    MIS.add(cod);
    const msg = `Hola ziko.pro 👋 Acabo de ${men ? "contratar el *plan mensual*" : item.tipo === "completo" ? "hacer la *compra completa*" : "contratar el *" + item.nombre + "*"}${item.tipo !== "plan" ? ` de *${item.nombre}*` : ""} (código *${cod}*).\nNegocio: ${ped.negocio}${men && dom() ? `\nDominio: ${ped.dominioNombre || "por definir"}` : ""}\nPagué ${soles(ped.monto)} con ${ped.pago}${ped.banco ? " " + ped.banco : ""}.`;
    okCompra(box, ped, msg, `Estamos validando tu pago de <b>${soles(ped.monto)}</b>. Te escribiremos por WhatsApp para empezar.${men ? " Tus próximas mensualidades las pagas desde <b>Mis compras</b>." : ""}`);
  });
}
function okCompra(box, p, msg, txt) {
  box.innerHTML = `<div class="box zk-panel zk-ok" style="max-width:740px;margin:0 auto"><div class="zk-ok-i">✓</div><h2>¡Gracias, ${esc(String(p.nombre || "").split(" ")[0])}!</h2><p>Recibimos tu pago. Tu código es</p><div class="zk-ok-code">${esc(p.codigo)}</div>
    <p>${txt}</p>
    <div class="zk-acts" style="justify-content:center"><a class="btn btn-teal" target="_blank" rel="noopener" href="${waLink(msg)}">AVISAR POR WHATSAPP</a><a class="btn btn-navy" href="/mis-compras">VER MIS COMPRAS</a><button class="btn btn-outline" type="button" data-recibo="${esc(p.codigo)}">DESCARGAR RECIBO PDF</button></div>
    <p class="form-note">Tu compra quedó guardada en <b>Mis compras</b> de este dispositivo. Guarda tu código para verla desde otro celular.</p></div>`;
  RECIBOS[p.codigo] = p; scrollTo({ top: 0, behavior: "smooth" });
}
/* Pagar el saldo (compra completa) o la mensualidad (plan mensual) */
async function pagarSaldo(box, c) {
  box.innerHTML = `<p class="form-note" style="text-align:center">Cargando tu compra…</p>`;
  const p = await DB.pedido(c).catch(() => null), men = p && p.modalidad === "mensual", s = !p ? 0 : men ? cuotaDe(p) : saldoDe(p), pend = p ? (p.pagosWeb || []).filter(x => x.estado === "por-validar") : [];
  if (!p || ["anulado", "rechazado", "por-validar"].includes(p.estado) || !s || pend.length || p.baja) { box.innerHTML = `<div class="box zk-panel" style="text-align:center"><h2>${!p ? "No encontramos esa compra" : pend.length ? "Ya tienes un pago en revisión" : p.estado === "por-validar" ? "Primero validamos tu primer pago" : p.baja ? "Este plan está dado de baja" : !s ? "¡Tu compra ya está pagada! ✅" : "Esta compra no admite pagos"}</h2><p class="form-note">Revisa el estado en Mis compras.</p><a class="btn btn-teal" href="/mis-compras">IR A MIS COMPRAS</a></div>`; return; }
  const [et] = men ? estadoMensual(p) : [];
  box.innerHTML = `<div class="zk-buy">
    <aside class="box zk-panel zk-sum"><span class="zk-step">TU COMPRA</span><h2>${esc((p.items || [])[0]?.n.replace(" (primer mes)", "") || "")}</h2><div class="zk-plan-tipo">Código ${esc(p.codigo)}</div>
      ${men ? `<div class="zk-pay-split"><div><small>Cuota mensual</small><b>${soles(s)}</b></div><div><small>Pagado hasta</small><b>${p.vence ? fechaCorta(p.vence) : "—"}</b></div><div class="full"><small>Estado</small><b>${esc(et)}</b></div></div>`
        : `<div class="zk-pay-split three"><div><small>Total</small><b>${soles(p.total)}</b></div><div><small>Pagado</small><b>${soles(pagadoDe(p))}</b></div><div><small>Saldo</small><b>${soles(s)}</b></div></div>`}
      <a href="/mis-compras" class="zk-back">← Mis compras</a></aside>
    <form class="box zk-panel" id="psF" novalidate><span class="zk-step">${men ? "PAGAR MENSUALIDAD" : "PAGAR SALDO"}</span><h2>${men ? `Paga tu mes: ${soles(s)}` : `Paga tu saldo de ${soles(s)}`}</h2>
      <p class="form-note" style="margin:0 0 14px">Paga con Yape, Plin o transferencia y sube la captura. Lo validamos y se actualiza en Mis compras${men ? " con tu nueva fecha de pago" : ""}.</p>
      <div id="pagoBox"></div><p class="zk-err" id="psErr" role="alert"></p><button class="btn btn-teal" type="submit" id="psBtn" style="width:100%">ENVIAR PAGO</button></form></div>`;
  const pago = Pago($("#pagoBox"), AJ, { contraEntrega: false }); pago.pintar().then(() => pago.setMonto(s)); pago.setMonto(s);
  $("#psF").addEventListener("submit", async e => {
    e.preventDefault(); const pe = pago.validar(); if (pe) { $("#psErr").textContent = pe; return; }
    const pd = pago.datos(), id = p.codigo + "-P" + ((p.pagos || []).length + 1), pg = { pedido: p.codigo, monto: s, nombre: p.nombre, celular: p.celular, pago: pd.pago, banco: pd.banco, operacion: pd.operacion, montoLeido: pd.montoLeido, coincide: pd.coincide, fechaOk: pd.fechaOk, estado: "por-validar", creado: new Date().toISOString() };
    const b = $("#psBtn"); b.disabled = true; b.textContent = "ENVIANDO…";
    try { await DB.crearPago(id, pg, pd.captura); } catch (x) { console.error(x); b.disabled = false; b.textContent = "ENVIAR PAGO"; $("#psErr").textContent = "No se pudo enviar. Revisa tu conexión."; return; }
    MIS.add(p.codigo);
    okCompra(box, { ...p, pagosWeb: [pg] }, `Hola ziko.pro 👋 Acabo de pagar ${men ? "mi mensualidad" : "el saldo"} de ${soles(s)} de mi compra *${p.codigo}* con ${pd.pago}${pd.banco ? " " + pd.banco : ""}.`, `Estamos validando tu pago de <b>${soles(s)}</b>. Cuando lo confirmemos, se actualiza en Mis compras.`);
  });
}

/* ---------- Página «Mis compras» ---------- */
const RECIBOS = {};
function paginaMisCompras() {
  const box = $("#comprasBox"); if (!box) return;
  box.innerHTML = `<div id="mcList" aria-live="polite"></div>
    <form class="box zk-panel zk-add" id="mcF"><span class="zk-step">¿COMPRASTE DESDE OTRO CELULAR?</span><label for="mcC" style="margin-top:6px">Escribe el código de tu compra</label>
      <div class="zk-code-f"><input id="mcC" placeholder="ZK-XXXXXXXX" maxlength="14"><button class="btn btn-teal">AGREGAR</button></div><p class="zk-err" id="mcErr"></p></form>`;
  const PASOS = [["por-validar", "Pago en revisión"], ["confirmado", "Pago confirmado"], ["desarrollo", "En desarrollo"], ["entregado", "Entregado"]];
  async function pintar() {
    const L = $("#mcList"), cods = MIS.get();
    if (!cods.length) { L.innerHTML = `<div class="box zk-panel" style="text-align:center"><div class="zk-ok-i" style="background:linear-gradient(135deg,var(--navy),var(--blue))">🛒</div><h2>Aún no tienes compras en este dispositivo</h2><p class="form-note">Cuando compres un sistema o un plan, aquí verás su estado, tus pagos y tus recibos.</p><div class="zk-acts" style="justify-content:center"><a class="btn btn-teal" href="/demo">VER SISTEMAS</a><a class="btn btn-outline" href="/precios">VER PLANES</a></div></div>`; return; }
    L.innerHTML = `<p class="form-note" style="text-align:center">Cargando tus compras…</p>`;
    const ps = await Promise.all(cods.map(c => DB.pedido(c).catch(() => null)));
    ps.forEach(p => p && (RECIBOS[p.codigo] = p));
    const ok = ps.filter(Boolean).sort((a, b) => String(b.creado).localeCompare(String(a.creado))), faltan = cods.filter((c, i) => !ps[i]), val = ok.filter(p => !["anulado", "rechazado"].includes(p.estado));
    const mens = val.filter(p => p.modalidad === "mensual" && !p.baja);
    L.innerHTML = `<div class="zk-mc-sum"><div><small>Compras</small><b>${ok.length}</b></div><div><small>Pagado en total</small><b>${soles(val.reduce((a, p) => a + pagadoDe(p), 0))}</b></div><div><small>Saldo pendiente</small><b>${soles(val.filter(p => p.estado !== "por-validar").reduce((a, p) => a + saldoDe(p), 0))}</b></div><div><small>Planes mensuales</small><b>${mens.length ? soles(mens.reduce((a, p) => a + cuotaDe(p), 0)) + " /mes" : "—"}</b></div></div>
      ${ok.map(p => { const malo = ["anulado", "rechazado"].includes(p.estado), idx = PASOS.findIndex(x => x[0] === p.estado), pend = (p.pagosWeb || []).filter(x => x.estado === "por-validar"), men = p.modalidad === "mensual", s = saldoDe(p), sis = PORT.find(x => x.id === p.sistema);
        const pagos = (p.pagos || []).map(x => ({ ...x, ok: true })).concat(p.estado === "por-validar" ? [{ fecha: p.creado, monto: p.monto, metodo: p.pago, ok: false, adel: !men && p.tipoPago === "adelanto" }] : []).concat(pend.map(x => ({ fecha: x.creado, monto: x.monto, metodo: x.pago, ok: false })));
        const [et, ec] = men ? estadoMensual(p) : [], tag = men ? "Plan mensual" : p.modalidad === "completo" ? "Compra completa" : "Plan";
        return `<article class="zk-mc box zk-panel">
        <div class="zk-mc-h">${sis && sis.foto ? `<img src="${esc(img(sis.foto))}" alt="">` : `<div class="zk-ph sm">${esc(inicial((sis && sis.nombre) || (p.items || [])[0]?.n.replace(/^[^·]*· ?/, "") || "Z"))}</div>`}
          <div><small>${esc(p.codigo)} · ${fechaPE(p.creado)} · <b>${tag}</b></small><h3>${esc(sis ? sis.nombre : (p.items || [])[0]?.n || "")}</h3><span class="zk-est e-${esc(p.estado)}">${esc(EST[p.estado] || p.estado)}</span>${men && !malo && p.estado !== "por-validar" ? ` <span class="zk-est m-${ec}">${esc(et)}</span>` : ""}</div></div>
        ${malo ? `<div class="zk-bad">Esta compra fue ${p.estado === "rechazado" ? "rechazada porque no pudimos validar el pago" : "anulada"}${p.motivo ? ": " + esc(p.motivo) : ""}. Escríbenos por WhatsApp.</div>`
          : `<ol class="zk-steps">${PASOS.map(([k, t], i) => `<li class="${i < idx ? "done" : i === idx ? "now" : ""}"><i>${i < idx ? "✓" : i + 1}</i><span>${t}</span></li>`).join("")}</ol>`}
        ${men ? `<div class="zk-pay-split three"><div><small>Cuota mensual</small><b>${soles(cuotaDe(p))}</b></div><div><small>Pagado hasta</small><b>${p.vence ? fechaCorta(p.vence) : "—"}</b></div><div><small>Próximo pago</small><b class="${ec === "bad" ? "neg" : ""}">${p.vence ? fechaCorta(p.vence) : "Al validar"}</b></div></div>
            ${p.bloqueado ? `<div class="zk-bad">Tu servicio está bloqueado por falta de pago. Paga tu mensualidad y te lo reactivamos.</div>` : ec === "warn" && p.vence ? `<div class="zk-warn">Recuerda: tienes ${GRACIA()} días después de fin de mes para pagar; si no, el servicio se bloquea.</div>` : ""}`
          : `<div class="zk-pay-split three"><div><small>Total</small><b>${soles(p.total)}</b></div><div><small>Pagado</small><b class="ok">${soles(pagadoDe(p))}</b></div><div><small>Saldo</small><b class="${s && p.estado !== "por-validar" ? "neg" : ""}">${soles(p.estado === "por-validar" ? p.total - p.monto : s)}</b></div></div>
            ${p.soporteHasta ? `<p class="zk-sop">🛟 Soporte gratis hasta el <b>${fechaCorta(p.soporteHasta)}</b></p>` : p.modalidad === "completo" ? `<p class="zk-sop">🛟 Incluye soporte gratis por ${soporteTxt()} desde la entrega</p>` : ""}`}
        ${pagos.length ? `<div class="zk-pagos"><b>Tus pagos</b>${pagos.map(x => `<div><span>${fechaPE(x.fecha)} · ${esc(x.metodo || "")}${x.adel ? " · adelanto" : ""}</span><b>${soles(x.monto)}</b><em class="${x.ok ? "ok" : "rev"}">${x.ok ? "✓ Confirmado" : "⏳ En revisión"}</em></div>`).join("")}</div>` : ""}
        ${p.link ? `<p><a class="btn btn-navy" href="${esc(p.link)}" target="_blank" rel="noopener">🌐 VER MI SISTEMA</a></p>` : ""}
        ${p.boleta ? `<p class="zk-bol">🧾 ${esc(p.comprobante || "Boleta")} electrónica: <b>${esc(p.boleta)}</b></p>` : ""}
        <div class="zk-acts"><button class="btn btn-teal" type="button" data-recibo="${esc(p.codigo)}">DESCARGAR RECIBO PDF</button>${!malo && !pend.length && p.estado !== "por-validar" && !p.baja && (men || s) ? `<a class="btn btn-navy" href="/contratar?saldo=${encodeURIComponent(p.codigo)}">${men ? `PAGAR MES ${soles(cuotaDe(p))}` : `PAGAR SALDO ${soles(s)}`}</a>` : ""}<a class="btn btn-outline" target="_blank" rel="noopener" href="${waLink(`Hola ziko.pro 👋 Consulto por mi compra ${p.codigo}.`)}">CONSULTAR</a><button class="btn btn-outline zk-q" type="button" data-quitar="${esc(p.codigo)}">QUITAR</button></div>
      </article>`; }).join("")}
      ${faltan.length ? `<p class="form-note">No encontramos: ${faltan.map(c => `<b>${esc(c)}</b> <button class="zk-lnk" data-quitar="${esc(c)}">quitar</button>`).join(", ")}</p>` : ""}`;
    revelar(L);
  }
  box.addEventListener("click", e => { const q = e.target.closest("[data-quitar]"); if (q) { MIS.del(q.dataset.quitar); aviso("Quitado de esta lista (tu compra sigue existiendo)."); pintar(); } });
  $("#mcF").addEventListener("submit", async e => {
    e.preventDefault(); const c = $("#mcC").value.trim().toUpperCase(); $("#mcErr").textContent = ""; if (!c) return;
    const p = await DB.pedido(c).catch(() => null); if (!p) { $("#mcErr").textContent = "No encontramos ese código. Revísalo e inténtalo otra vez."; return; }
    MIS.add(p.codigo); $("#mcC").value = ""; aviso("✓ Compra agregada"); pintar();
  });
  pintar();
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-recibo]"); if (!b) return;
  const c = b.dataset.recibo, t = b.textContent; b.disabled = true; b.textContent = "GENERANDO…";
  try { const p = RECIBOS[c] || await DB.pedido(c); if (!p) throw new Error("no existe"); await pdfRecibo(p); } catch (x) { console.error(x); aviso("No se pudo generar el recibo. Revisa tu conexión."); }
  b.disabled = false; b.textContent = t;
});

/* ---------- Recibo de pago en PDF (con todos los pagos) ---------- */
async function pdfRecibo(p) {
  await cargarScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a5" }), W = 148, H = 210, M = 10, S = soles, men = p.modalidad === "mensual";
  const T = (t, x, y, o) => doc.text(String(t ?? ""), x, y, o), F = (b, z, c = 20) => { doc.setFont("helvetica", b ? "bold" : "normal"); doc.setFontSize(z); doc.setTextColor(c); };
  const conf = (p.pagos || []).length || p.estado !== "por-validar", pagado = conf ? pagadoDe(p) : 0;
  doc.setFillColor(18, 48, 90); doc.rect(0, 0, W, 24, "F"); doc.setFillColor(34, 195, 190); doc.rect(0, 24, W, 1.6, "F");
  F(1, 15, 255); T(AJ.nombre || "ziko.pro", M, 12); F(0, 7.5, 210); T((AJ.razon && AJ.razon !== AJ.nombre ? AJ.razon + " · " : "") + "Desarrollo web & aplicaciones" + (AJ.ruc ? " · RUC " + AJ.ruc : ""), M, 17); T([AJ.telefono, AJ.email].filter(Boolean).join(" · "), M, 21);
  F(1, 9, 255); T("RECIBO DE PAGO", W - M, 12, { align: "right" }); F(1, 11, 255); T(p.codigo, W - M, 18, { align: "right" });
  let y = 34; F(0, 8, 90); T("Fecha de compra: " + fechaPE(p.creado, true), M, y); T((men ? "Plan mensual · " : p.modalidad === "completo" ? "Compra completa · " : "") + (EST[p.estado] || p.estado), W - M, y, { align: "right" });
  y += 6; doc.setFillColor(243, 247, 251); doc.roundedRect(M, y, W - 2 * M, 24, 1.5, 1.5, "F");
  F(1, 7, 120); T("CLIENTE", M + 3, y + 5); F(1, 9.5); T(p.nombre, M + 3, y + 10); F(0, 8, 70);
  T(`${p.negocio || ""}${p.doc ? " · " + (String(p.doc).length === 11 ? "RUC " : "DNI ") + p.doc : ""}`, M + 3, y + 15); T([p.celular, p.email].filter(Boolean).join(" · "), M + 3, y + 20);
  y += 30;
  if (p.boleta) { doc.setDrawColor(34, 195, 190); doc.setLineWidth(.6); doc.roundedRect(M, y, W - 2 * M, 8, 1.5, 1.5); F(1, 8.5); T(`${p.comprobante || "Boleta"} electrónica N° ${p.boleta}`, W / 2, y + 5.3, { align: "center" }); y += 12; }
  doc.setFillColor(18, 48, 90); doc.rect(M, y, W - 2 * M, 7, "F"); F(1, 7.5, 255); T("DESCRIPCIÓN", M + 3, y + 4.8); T("IMPORTE", W - M - 3, y + 4.8, { align: "right" }); y += 7;
  (p.items || []).forEach(i => { F(0, 8.5, 30); const l = doc.splitTextToSize(i.n, 90); l.forEach((x, k) => T(x, M + 3, y + 5 + k * 4)); F(1, 8.5, 30); T(S(i.precio * i.cant), W - M - 3, y + 5, { align: "right" }); y += 4 * l.length + 4; });
  doc.setDrawColor(210); doc.setLineWidth(.2); doc.line(M, y, W - M, y); y += 6;
  const filas = men ? [["Cuota mensual", S(cuotaDe(p))], ["Total pagado", S(pagado || (conf ? 0 : 0))], ["Servicio pagado hasta", p.vence ? fechaCorta(p.vence) : "al validar el pago"]]
    : conf ? [["Total", S(p.total)], ["Pagado", S(pagado)], ["Saldo pendiente", S(saldoDe(p))]] : [["Total", S(p.total)], [p.tipoPago === "total" ? "Pago enviado (completo)" : "Adelanto enviado", S(p.monto)], ["Saldo al entregar", S(Math.max(0, p.total - p.monto))]];
  if (men && !conf) filas[1] = ["Pago enviado", S(p.monto)];
  filas.forEach(([k, v], i) => { if (i === 1) { doc.setFillColor(34, 195, 190); doc.roundedRect(W - M - 76, y - 4.5, 76, 7, 1.2, 1.2, "F"); } F(i === 1, i === 1 ? 9.5 : 8.5, i === 1 ? 255 : 60); if (String(v).length > 14) T(`${k}: ${v}`, W - M - 3, y, { align: "right" }); else { T(k, W - M - 36, y, { align: "right" }); T(v, W - M - 3, y, { align: "right" }); } y += 7; });
  if (p.soporteHasta) { F(1, 8, 30); T(`Soporte gratis hasta el ${fechaCorta(p.soporteHasta)}`, M, y + 1); y += 6; }
  const lst = conf ? (p.pagos || []).map(x => [x.fecha, x.monto, x.metodo, "Confirmado"]) : [[p.creado, p.monto, p.pago + (p.operacion ? " · Op. " + p.operacion : ""), "En revisión"]];
  (p.pagosWeb || []).filter(x => x.estado === "por-validar").forEach(x => lst.push([x.creado, x.monto, x.pago, "En revisión"]));
  if (lst.length) { F(1, 7, 120); T(men ? "MENSUALIDADES Y PAGOS" : "PAGOS", M, y + 1); y += 5; lst.slice(-14).forEach(([f, m, met, est]) => { F(0, 8, 50); T(`${fechaPE(f)} · ${met || ""}`, M, y); T(est, M + 82, y, { align: "right" }); F(1, 8, 30); T(S(m), W - M - 3, y, { align: "right" }); y += 4.6; }); }
  if (p.detalle && y < H - 50) { y += 5; F(1, 7, 120); T("TU PROYECTO", M, y); F(0, 8, 60); doc.splitTextToSize(p.detalle, W - 2 * M).slice(0, 5).forEach((x, k) => T(x, M, y + 5 + k * 4)); }
  doc.setDrawColor(220); doc.line(M, H - 16, W - M, H - 16);
  F(1, 7, 90); T("Este recibo no reemplaza la boleta o factura electrónica.", W / 2, H - 11, { align: "center" });
  F(0, 6.5, 140); T("Revisa tus compras en " + location.host + "/mis-compras · " + (AJ.email || ""), W / 2, H - 7, { align: "center" });
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

/* ---------- Textos, imágenes y botones editados desde el panel ---------- */
const PAGINA = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
function aplicarContenido(lista) {
  lista.forEach(c => $$(`[data-ed="${CSS.escape(c.k)}"]`).forEach(el => {
    if (el.tagName === "IMG") { if (c.v) { el.src = img(c.v); el.style.display = ""; } return; }
    if (el.tagName === "A") { if (c.t) el.textContent = c.t; if (c.href && !el.classList.contains("wa-link")) { if (/^wa:/.test(c.href)) { el.classList.add("wa-link"); el.dataset.msg = c.href.slice(3) || "Hola ziko.pro 👋"; } else el.href = c.href; } return; }
    if (c.v == null) return;
    const mk = el.dataset.mk ? JSON.parse(el.dataset.mk) : (el.querySelector("span,strong,b,em") ? [el.querySelector("span,strong,b,em").outerHTML.match(/^<[^>]+>/)[0], "</" + el.querySelector("span,strong,b,em").tagName.toLowerCase() + ">"] : ["<b>", "</b>"]);
    el.dataset.mk = JSON.stringify(mk);
    el.innerHTML = esc(c.v).replace(/\*(.+?)\*/g, (_, t) => mk[0] + t + mk[1]).replace(/\n/g, "<br>");
  }));
}

/* ---------- Arranque: carga los datos del panel ---------- */
(async function () {
  const [c, ct] = await Promise.all([DB.catalogo(), DB.contenido(PAGINA).catch(() => [])]);
  AJ = c.aj || {}; PORT = c.port || []; PLANES = c.planes || [];
  aplicarContenido(ct); aplicarAjustes(); portafolio(); paginaDemo(); paginaPrecios(); paginaContratar(); paginaMisCompras();
})();

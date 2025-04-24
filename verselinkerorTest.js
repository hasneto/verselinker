!async function() {
    const e = document.currentScript;
    let t = e.getAttribute("lang") || null,
        o = e.getAttribute("data-trueTooltip") || !0,
        n = e.getAttribute("data-trueCredit") || !0,
        r = e.getAttribute("data-trueLinks") || !0;
    if (!t || "all" === t) {
        const p = document.documentElement.getAttribute("lang");
        t = p || "en"
    }
    t.startsWith("zh") ? "zh-CN" === t || "zh-tw" === t || (t = "zh-CN") : t = t.split("-")[0];
    const a = "es" === t ? "" : `${t}/`;
    let i = e.getAttribute("version") || null;
    const l = `https://hasneto.github.io/verselinker/pt.json`;
    let s = null,
        c = null;
    const d = [];
    try {
        const u = await fetch(l);
        if (!u.ok) throw new Error(`Error al cargar el JSON: ${u.statusText}`);
        const g = await u.json();
        i && e.getAttribute("lang") || (i = g.abreviacion);
        const f = {};
        g.libros.forEach((e => {
            const t = e.nombre.toLowerCase();
            f[t] = {
                id: e.id,
                url: e.url.toLowerCase(),
                nombre: t,
                cant_capitulos: parseInt(e.cant_capitulos)
            }, e.alias && Array.isArray(e.alias) && e.alias.forEach((e => {
                f[e.toLowerCase()] = f[t]
            }))
        }));
        const m = Object.keys(f).map((e => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("|"),
            b = new Map;

        function h(e) {
            const t = new RegExp(`\\b(${m})\\s+\\d+(?::\\d+(?:-\\d+)?)*(?:;\\s*\\d+(?::\\d+(?:-\\d+)?)*\\s*)+`, "gi");
            return e.replace(t, ((e, t, o) => {
                const n = e.split(";");
                if (n.length <= 1) return e;
                const r = t.toLowerCase();
                return n.forEach(((e, t) => {
                    const n = e.trim();
                    if (!n) return;
                    const a = o + "|" + n + "|" + r;
                    b.set(a, {
                        libro: r,
                        text: n
                    })
                })), e
            }))
        }

        function x(e, t) {
            const o = e.split(",");
            for (let e of o)
                if (e.includes("-") || e.includes("—")) {
                    let o = e.split(/[-—]/);
                    for (let e of o) {
                        if (parseInt(e, 10) > t) return !0
                    }
                } else {
                    if (parseInt(e, 10) > t) return !0
                }
            return !1
        }

        function y(e, o, n, r = null, a = null, l = null) {
            e = e.trim();
            let s = `https://www.bibliatodo.com/${encodeURIComponent(t)}/search-bible?s=${encodeURIComponent(e)}+${encodeURIComponent(n)}`;
            return r && a ? s += `%3A${encodeURIComponent(r)}-${encodeURIComponent(a)}` : r && (s += `%3A${encodeURIComponent(r)}`), s += l ? `&version=${encodeURIComponent(l)}` : `&version=${encodeURIComponent(i)}`, s
        }

        function $(e, t) {
            const [o, n] = t.split(":");
            let r = `${e}.${o}`;
            return n && (r += `.${n}`), r
        }

        async function v(e) {
            d.forEach((e => e.remove())), d.length = 0;
            const t = e.target.getAttribute("id_cita");
            if (!t) return;
            let o = e.target.getAttribute("version") || i;
            s && (s.remove(), s = null);
            const r = document.createElement("div");
            r.className = "bibliatodo-tooltip", r.style.position = "absolute", r.style.backgroundColor = "#fff", r.style.border = "1px solid #ccc", r.style.zIndex = "99999999", r.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)", r.style.fontFamily = "Arial, sans-serif", r.style.fontSize = "14px", r.style.maxWidth = "380px", r.style.borderRadius = "7px", r.innerHTML = '<div style="padding: 7px; text-align: center;color: black!important;">Carregando...</div>', document.body.appendChild(r), s = r, d.push(r);
            const l = e.target.getBoundingClientRect();
            r.style.top = l.bottom + window.scrollY - 2 + "px", r.style.left = `${l.left + window.scrollX}px`;
            e.target.addEventListener("mouseleave", (t => {
                r && r.contains(t.relatedTarget) || t.relatedTarget === e.target || s && s.contains(t.relatedTarget) || (clearTimeout(c), r && (r.remove(), s = null))
            })), r.addEventListener("mouseleave", (t => {
                r && r.contains(t.relatedTarget) || t.relatedTarget === e.target || s && s.contains(t.relatedTarget) || (clearTimeout(c), r.remove(), s = null)
            })), e.target.addEventListener("mouseleave", (t => {
                r && r.contains(t.relatedTarget) || t.relatedTarget === e.target || s && s.contains(t.relatedTarget) || (clearTimeout(c), r && (r.remove(), s = null))
            })), c = setTimeout((async () => {
                try {
                    const i = `https://www.bibliatodo.com/api/tooltip/versiculo?id_cita=${t}&version=${o}`,
                        l = await fetch(i, {
                            method: "GET",
                            headers: {
                                "X-Requested-With": "verselinker.js",
                                "Content-Type": "application/json"
                            }
                        });
                    if (!l.ok) throw new Error("No se pudo cargar el tooltip");
                    const s = await l.json(),
                        p = s.abreviacion ? ` (${s.abreviacion})` : "";
                    let u = `<div style="font-weight: bold; text-align: center; background-color: #606161!important; color: white!important; border: solid #434343 1px; border-radius: 7px 7px 0 0; padding: 8px 0;">${`<a href="${e.target.href}" target="_blank" style="color: #fff!important; text-decoration: none;">${s.referencia}${p}</a>`}</div>`;
                    if (u += '<div style="padding: 7px; line-height: 23px;color: black!important;">', u += s.data.map((e => `<span><sup>${e.num_versiculo}</sup> ${e.info_versiculo}</span>`)).join(" "), 0 === s.complete) {
                        u += `<div style="margin-top: 10px; text-align: left;"><a href="${e.target.href}" target="_blank" style="color: #007bff!important; text-decoration: none; font-size: 12px;">More »</a></div>`
                    }
                    u += "</div>", "false" !== n && (u += `<div style="text-align: center; font-size: 12px; margin-top: 10px; background-color: #ECF1FA!important; padding: 5px; border-top: 1px solid #e9ecef;border-radius: 0 0 7px 7px;color: black;">
                            <a href="https://www.oticareformada.com" target="_blank" style="color: #0606069e!important; text-decoration: none; display: flex; align-items: center; justify-content: center;">
                                Adaptado por&nbsp;&nbsp;<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6W249LCXs8KKhYgAn85uKlxXmTIq4_NtFLiURoI4nsQf8ZhDYuCfIsIKl7fv5KBB1PfvVBXoycJyGpUICX3S4pWNMt8QIzORQIsVRtbwbBaHfwf6-gXv9KTP352zmCBrS8xu9UlYCs78HS3mEGyXr7OvP43rJ26D4B_7y1k88Po-j-dGGMdgciaAToQ/s1600/icone3.png" alt="Ótica Reformada" style="height: 14px; margin-right: 5px;" />oticareformada.com</a>
                        </div>`), r.innerHTML = u, r.addEventListener("mouseenter", (() => clearTimeout(c))), r.addEventListener("mouseleave", (() => {
                        r.remove();
                        const e = d.indexOf(r);
                        -1 !== e && d.splice(e, 1)
                    }))
                } catch (e) {
                    console.error("Error al cargar el tooltip:", e)
                }
            }), 50)
        }

        function E(e) {
            let n = e.nodeValue;
            "my" === t && (n = n.replace(/\u200B/g, ""), n = n.replace(/။/g, "")), n = h(n);
            const r = Object.keys(f).map((e => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("|"),
                a = new RegExp(`\\b(${r})\\s+(\\d+(?:-\\d+)?(?:,\\d+(?:-\\d+)?)*)(?::(\\d+(?:-\\d+)?(?:,\\d+(?:-\\d+)?)*))?|\\b(${r})\\s+(\\d+(?:—\\d+)?(?:,\\d+(?:—\\d+)?)*)(?::(\\d+(?:—\\d+)?(?:,\\d+(?:—\\d+)?)*))?\\s*(\\(([A-Za-z0-9-]{1,20})\\))?`, "gi");
            let l = n.replace(a, ((e, t, o, n, r, a, l, s) => {
                if ("%".charAt(l + e.length) === s) return e;
                const c = t.trim().toLowerCase(),
                    d = f[c];
                if (!d) return e;
                if (x(o, d.cant_capitulos)) return e;
                let p = `${d.id}.${o}`;
                n && (p += `.${n}`);
                const u = a || i;
                return `<a href="${y(t, d.url, o, n, null, u)}" target="_blank" id_cita="${p}" version="${u}">${e}</a>`
            }));
            const s = new RegExp("(\\d+(?::\\d+(?:-\\d+)?)+(?:,\\d+(?:-\\d+)?)*)(?![A-Za-z])", "g");
            let c, d = "",
                p = 0;
            for (; null !== (c = s.exec(l));) {
                const e = c.index,
                    t = c[1];
                d += l.slice(p, e);
                let o = null;
                for (let [e, n] of b.entries())
                    if (n.text === t) {
                        o = n.libro;
                        break
                    }
                if (o) {
                    const e = f[o];
                    if (e) {
                        let n = $(e.id, t);
                        const r = i,
                            [a, l] = t.split(/[:.]/);
                        d += `<a href="${y(o, e.url, a, l, null, r)}" target="_blank" id_cita="${n}" version="${r}">${t}</a>`
                    } else d += t
                } else d += t;
                p = s.lastIndex
            }
            if (d += l.slice(p), e.nodeValue !== d) {
                const t = document.createElement("span");
                t.innerHTML = d, e.parentNode.replaceChild(t, e), "false" !== o && t.querySelectorAll("[id_cita]").forEach((e => {
                    e.addEventListener("mouseenter", v)
                }))
            }
        }

        function w(e) {
            e.childNodes.forEach((e => {
                e.nodeType === Node.TEXT_NODE ? E(e) : e.nodeType !== Node.ELEMENT_NODE || ["script", "style", "iframe", "noscript"].includes(e.tagName.toLowerCase()) || w(e)
            }))
        }
        if ("false" !== r) {
            const T = new RegExp(`^(?:(${m})\\s+\\d+(?:-\\d+)?(?:,\\d+(?:-\\d+)?)*|\\d+(?:-\\d+)?(?:,\\d+(?:-\\d+)?)*$)`, "i");
            document.body.querySelectorAll("a[href]").forEach((e => {
                if (!e.hasAttribute("id_cita")) {
                    const t = (e.textContent || "").trim();
                    T.test(t) && e.replaceWith(document.createTextNode(t))
                }
            })), function e(t) {
                let o = t.firstChild;
                for (; o;) {
                    if (o.nodeType === Node.TEXT_NODE) {
                        let e = o.nextSibling;
                        for (; e && e.nodeType === Node.TEXT_NODE;) {
                            o.nodeValue += e.nodeValue;
                            const n = e;
                            e = e.nextSibling, t.removeChild(n)
                        }
                    } else o.nodeType === Node.ELEMENT_NODE && e(o);
                    o = o.nextSibling
                }
            }(document.body)
        }
        w(document.body)
    } catch (C) {
        console.error(`Error al cargar o procesar el JSON: ${C}`)
    }
}();

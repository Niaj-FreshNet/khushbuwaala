export default function flyToCart(fromEl: HTMLElement, imageUrl?: string) {
    if (typeof window === "undefined") return;

    // 1) Ensure navbar is visible before measuring target
    window.dispatchEvent(new CustomEvent("kw:reveal-nav"));

    const reduceMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    if (reduceMotion) {
        window.dispatchEvent(new CustomEvent("kw:open-cart"));
        return;
    }

    const vv = window.visualViewport;
    const viewportW = () => vv?.width ?? window.innerWidth;
    const viewportH = () => vv?.height ?? window.innerHeight;

    const inViewport = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        return cx >= 0 && cx <= viewportW() && cy >= 0 && cy <= viewportH();
    };

    const pickVisibleTarget = () => {
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        const candidates = [
            document.getElementById(isDesktop ? "kw-cart-icon-desktop" : "kw-cart-icon-mobile"),
            document.getElementById("kw-cart-icon-bottom"),
            document.getElementById("kw-cart-icon-desktop"),
            document.getElementById("kw-cart-icon-mobile"),
        ].filter(Boolean) as HTMLElement[];

        return candidates.find(inViewport) || candidates[0] || null;
    };

    const run = () => {
        const toEl = pickVisibleTarget();
        if (!toEl) return;

        // If still not in viewport, try 1 more frame (handles rare timing)
        if (!inViewport(toEl)) {
            requestAnimationFrame(() => {
                const retry = pickVisibleTarget();
                if (retry) animate(fromEl, retry, imageUrl);
            });
            return;
        }

        animate(fromEl, toEl, imageUrl);
    };

    // Let layout update after reveal
    requestAnimationFrame(() => requestAnimationFrame(run));
}

function animate(fromEl: HTMLElement, toEl: HTMLElement, imageUrl?: string) {
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();

    const x0 = from.left + from.width / 2;
    const y0 = from.top + from.height / 2;
    const x1 = to.left + to.width / 2;
    const y1 = to.top + to.height / 2;

    // ====== Premium drawn direction line (SVG with arrow) ======
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "fixed";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.zIndex = "9997";
    svg.style.pointerEvents = "none";

    // Arrow marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "kw-arrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowPath.setAttribute("d", "M0,0 L9,3 L0,6 Z");
    arrowPath.setAttribute("fill", "rgba(16,185,129,0.75)");
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const dx = x1 - x0;
    const dy = y1 - y0;

    // curve feels natural both desktop and mobile
    const curveUp = Math.min(280, Math.max(140, Math.abs(dy) * 0.55));
    const cx = x0 + dx * 0.35;
    const cy = y0 + dy * 0.35 - curveUp;

    const d = `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`;
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(16,185,129,0.55)");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-dasharray", "8 10");
    path.setAttribute("marker-end", "url(#kw-arrow)");
    svg.appendChild(path);
    document.body.appendChild(svg);

    const totalLen = path.getTotalLength();
    path.style.strokeDasharray = `${totalLen}`;
    path.style.strokeDashoffset = `${totalLen}`;

    path.animate(
        [{ strokeDashoffset: totalLen }, { strokeDashoffset: 0 }],
        { duration: 420, easing: "ease-out" }
    );

    // ====== Flying bubble ======
    const flyer = document.createElement("div");
    flyer.style.position = "fixed";
    flyer.style.left = `${x0 - 18}px`;
    flyer.style.top = `${y0 - 18}px`;
    flyer.style.width = "36px";
    flyer.style.height = "36px";
    flyer.style.borderRadius = "14px";
    flyer.style.zIndex = "9999";
    flyer.style.pointerEvents = "none";
    flyer.style.boxShadow = "0 18px 50px rgba(0,0,0,0.22)";
    flyer.style.background = "#fff";
    flyer.style.overflow = "hidden";
    flyer.style.transform = "translate3d(0,0,0)";

    if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        flyer.appendChild(img);
    } else {
        flyer.style.background = "linear-gradient(135deg,#3b82f6,#8b5cf6)";
    }

    document.body.appendChild(flyer);

    const spawnParticle = (x: number, y: number) => {
        const p = document.createElement("div");
        p.style.position = "fixed";
        p.style.left = `${x - 3}px`;
        p.style.top = `${y - 3}px`;
        p.style.width = "6px";
        p.style.height = "6px";
        p.style.borderRadius = "999px";
        p.style.pointerEvents = "none";
        p.style.zIndex = "9998";
        p.style.opacity = "0.85";
        p.style.background = "radial-gradient(circle, rgba(16,185,129,1), rgba(16,185,129,0))";
        document.body.appendChild(p);

        p.animate(
            [{ transform: "scale(1)", opacity: 0.9 }, { transform: "scale(2.6)", opacity: 0 }],
            { duration: 420, easing: "ease-out" }
        ).onfinish = () => p.remove();
    };

    const duration = 780;
    const start = performance.now();

    const cleanupTimeout = window.setTimeout(() => {
        try { flyer.remove(); } catch { }
        try { svg.remove(); } catch { }
    }, duration + 1000);


    const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);

        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;

        const scale = 1 - t * 0.78;

        flyer.style.left = `${x - 18}px`;
        flyer.style.top = `${y - 18}px`;
        flyer.style.transform = `scale(${scale})`;

        if (t < 0.95 && Math.random() > 0.5) spawnParticle(x, y);

        if (t < 1) requestAnimationFrame(step);
        else finish();
    };

    const finish = () => {
        window.clearTimeout(cleanupTimeout);

        flyer.remove();

        svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).onfinish = () => {
            try { svg.remove(); } catch { }
        };

        toEl.animate(
            [
                { transform: "scale(1)", filter: "brightness(1)" },
                { transform: "scale(1.18)", filter: "brightness(1.22)" },
                { transform: "scale(1)", filter: "brightness(1)" },
            ],
            { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" }
        );

        toEl.classList.add("ring-4", "ring-emerald-200");
        setTimeout(() => toEl.classList.remove("ring-4", "ring-emerald-200"), 700);

        window.dispatchEvent(new CustomEvent("kw:open-cart"));
    };
    requestAnimationFrame(step);
}

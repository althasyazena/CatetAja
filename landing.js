(() => {
    const hero = document.getElementById('hero');
    const objects = Array.from(document.querySelectorAll('.object'));

    const DIR_MAP = {
        'left-up': (s) => ({ x: -1 * s * 260, y: -1 * s * 220 }),
        'left-down': (s) => ({ x: -1 * s * 260, y: 1 * s * 220 }),
        'right-up': (s) => ({ x: 1 * s * 260, y: -1 * s * 220 }),
        'right-down': (s) => ({ x: 1 * s * 260, y: 1 * s * 220 }),
        'left': (s) => ({ x: -1 * s * 220, y: 1 * s * 40 }),
        'right': (s) => ({ x: 1 * s * 220, y: 1 * s * 40 }),
        'up': (s) => ({ x: 1 * s * 40, y: -1 * s * 220 }),
        'down': (s) => ({ x: 1 * s * 40, y: 1 * s * 220 }),
    };

    // ini buat jadi pembatas nilainya, gak lebih dari a dan b jadi nilai scroll tetep 1 dan 0
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // ini buat ngitung seberapa jauh object yang di hero keliatan pas di scroll, 0 belum keliatan kalo 1 udah keliatan
    function heroProgress() {
        const rect = hero.getBoundingClientRect();
        const vpH = window.innerHeight;
        const start = vpH;
        const end = -rect.height;
        const p = (vpH - rect.top) / (vpH + rect.height);
        return clamp(p, 0, 1);
    }

    // buat baca data dari setiap object, dir buat arah gerak, speed kecepatan gerak, rotMag buat rotasi, base buat rotasi awal
    const items = objects.map((el) => {
        const dir = el.dataset.dir || 'right';
        const speed = parseFloat(el.dataset.speed) || 1;
        const rotMag = parseFloat(el.dataset.rot) || 360;
        const base = parseFloat(el.dataset.base) || 0;
        const getTarget = DIR_MAP[dir] || DIR_MAP['right'];
        return { el, dir, speed, rotMag, base, getTarget };
    });

    // ini buat si object ga dijalankan terus menerus
    let ticking = false;

    // fungsi pas dijalanin atau discroll
    function onScrollOrResize() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const p = heroProgress(); // progress scroll hero
                const easeP = p;

                // ini loop setiap object buat ngatur gerakannya
                items.forEach((it, i) => {
                    const { el, speed, rotMag, base, getTarget } = it;

                    // ambil arah sesuai speed
                    const t = getTarget(speed);

                    // posisi geser sesuai scroll
                    const tx = t.x * easeP;
                    const ty = t.y * easeP;

                    // rotasi beda arahnya
                    const rot = base + rotMag * easeP * ((i % 2 === 0) ? 1 : -1);

                    el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }

    // event listener pas scroll
    window.addEventListener('scroll', onScrollOrResize, { passive: true });

    // event listener pas ukuran layar berubah
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('load', () => {
        setTimeout(onScrollOrResize, 60);
    });

})();

// Inisialisasi VanillaTilt pada elemen span
VanillaTilt.init(document.querySelectorAll(".logo-text"), {
  max: 15,
  speed: 400,
  scale: 1.1
});

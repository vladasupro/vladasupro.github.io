// Continuous horizontal ticker that moves at the same speed (pixels per second)
// on every screen size.
//
// Markup:
//   <div class="ticker-wrapper" data-ticker-speed="50">
//     <ul class="ticker-track"><li>…</li><li>…</li></ul>
//   </div>
//
// How it works: the original items are repeated until one "set" is wider than
// the screen, then the set is duplicated. The track is animated by exactly one
// set width (-50%) and loops, so the seam is invisible. The animation duration
// is calculated from the measured width, which keeps the speed constant no
// matter how long the words are or how wide the screen is.

const DEFAULT_SPEED = 50; // pixels per second

function setupTicker(wrapper) {
    const track = wrapper.querySelector('.ticker-track');
    if (!track) return;

    const speed = parseFloat(wrapper.dataset.tickerSpeed) || DEFAULT_SPEED;
    const originals = Array.from(track.children);
    let lastWrapperWidth = 0;

    function cloneItems(items) {
        return items.map((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            return clone;
        });
    }

    function build() {
        const wrapperWidth = wrapper.offsetWidth;

        // Phones fire resize when the address bar shows/hides; only rebuild
        // when the width actually changes so the ticker doesn't jump.
        if (wrapperWidth === lastWrapperWidth) return;
        lastWrapperWidth = wrapperWidth;

        // Reset to the original items.
        track.classList.remove('is-running');
        track.replaceChildren(...originals);

        // Repeat items until one set is at least as wide as the screen.
        const originalWidth = track.scrollWidth;
        if (!originalWidth) return;
        const repeats = Math.max(1, Math.ceil(wrapperWidth / originalWidth));
        let set = originals.slice();
        for (let i = 1; i < repeats; i++) {
            set = set.concat(cloneItems(originals));
        }

        // Two identical sets: animating by -50% moves exactly one set width.
        track.replaceChildren(...set, ...cloneItems(set));

        const setWidth = track.scrollWidth / 2;
        track.style.setProperty('--ticker-duration', `${setWidth / speed}s`);
        track.classList.add('is-running');
    }

    build();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
    });

    // Text width changes once the web font loads; measure again then.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            lastWrapperWidth = 0;
            build();
        });
    }
}

export default function ticker() {
    document.querySelectorAll('.ticker-wrapper').forEach(setupTicker);
}

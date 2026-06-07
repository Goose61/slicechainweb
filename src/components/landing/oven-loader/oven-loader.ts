/* DO NOT MODIFY — copied verbatim from menos&gusto/Pizza.html loader IIFE */

export function initOvenLoader(): void {
  (function () {
    const loader = document.getElementById("loader");
    const bar = document.getElementById("prog-bar");
    const pct = document.getElementById("prog-pct");
    if (!loader || !bar || !pct) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        triggerZoom();
      }
      bar.style.width = progress + "%";
      pct.textContent = Math.floor(progress) + "%";
    }, 150);

    function triggerZoom() {
      setTimeout(() => {
        loader!.classList.add("zooming");
        setTimeout(() => {
          loader!.classList.add("done");
        }, 1100);
      }, 400);
    }
  })();
}

/* =========================================================
   EXCAVĂRI TULCEA — interactions
   1) Before/After drag slider
   2) Diagonal strip carousel dots
   3) Scroll-reveal animations
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1) BEFORE / AFTER SLIDER ---------- */
  var slider = document.getElementById('baSlider');
  var beforeWrap = document.getElementById('baBeforeWrap');
  var divider = document.getElementById('baDivider');
  var handle = document.getElementById('baHandle');

  if (slider && beforeWrap && divider && handle) {
    var dragging = false;

    function setPosition(percent) {
      percent = Math.max(2, Math.min(98, percent));
      beforeWrap.style.width = percent + '%';
      divider.style.left = percent + '%';
      handle.style.left = percent + '%';
    }

    function positionFromEvent(clientX) {
      var rect = slider.getBoundingClientRect();
      var x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    function start(e) {
      dragging = true;
      slider.classList.add('dragging');
    }
    function move(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(positionFromEvent(clientX));
      e.preventDefault();
    }
    function end() {
      dragging = false;
      slider.classList.remove('dragging');
    }

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    // also allow tapping/clicking anywhere on the slider to jump
    slider.addEventListener('click', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      setPosition(positionFromEvent(e.clientX));
    });

    // gentle auto-demo on load: ease from 50% to 38% so people notice it's draggable
    setPosition(50);
    setTimeout(function () { setPosition(38); }, 700);
  }

  /* ---------- 2) DIAGONAL STRIP CAROUSEL DOTS ---------- */
  var track = document.getElementById('stripTrack');
  var dotsWrap = document.getElementById('stripDots');

  if (track && dotsWrap) {
    var cards = Array.prototype.slice.call(track.children);
    cards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = cards.indexOf(entry.target);
          dots.forEach(function (d) { d.classList.remove('active'); });
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    }, { root: track, threshold: 0.6 });

    cards.forEach(function (card) { observer.observe(card); });
  }

  /* ---------- 3) SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // fail-safe: force-reveal anything still hidden after 4s (covers edge cases
    // where an element never intersects, e.g. unusually short viewports)
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 4000);
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

});

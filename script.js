/* =========================================================
   SERVICII BULDOEXCAVATOR TULCEA — interactions
   1) Intro overlay (skip + auto-end)
   2) Hero ambient dust particles
   3) Final-CTA checkmark draw trigger
   4) Before/After drag slider
   5) Diagonal strip carousel dots
   6) Scroll-reveal animations
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1) INTRO OVERLAY ---------- */
  var intro = document.getElementById('intro');
  var introDust = document.getElementById('introDust');
  var body = document.body;

  function endIntro() {
    if (!intro) return;
    body.classList.remove('intro-active');
    intro.style.pointerEvents = 'none';
    setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 600);
  }

  if (intro) {
    // generate burst dust particles from center
    if (introDust) {
      for (var i = 0; i < 18; i++) {
        var p = document.createElement('span');
        var angle = (Math.PI * 2) * (i / 18) + Math.random() * 0.4;
        var dist = 140 + Math.random() * 100;
        p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        p.style.setProperty('--dy', (Math.sin(angle) * dist) + 'px');
        p.style.animationDelay = (0.3 + Math.random() * 0.15) + 's';
        p.style.width = p.style.height = (3 + Math.random() * 5) + 'px';
        introDust.appendChild(p);
      }
    }
    // dismiss on tap/click
    intro.addEventListener('click', function () {
      intro.classList.add('skip');
      setTimeout(endIntro, 280);
    });
    // auto-end after animation completes
    setTimeout(endIntro, 2050);
  } else {
    body.classList.remove('intro-active');
  }

  /* ---------- 2) HERO AMBIENT DUST ---------- */
  var heroDust = document.getElementById('heroDust');
  if (heroDust && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (var j = 0; j < 14; j++) {
      var d = document.createElement('span');
      d.style.left = (Math.random() * 100) + '%';
      d.style.animationDuration = (8 + Math.random() * 10) + 's';
      d.style.animationDelay = (Math.random() * 8) + 's';
      d.style.setProperty('--drift', ((Math.random() * 80 - 40)) + 'px');
      d.style.width = d.style.height = (2 + Math.random() * 4) + 'px';
      heroDust.appendChild(d);
    }
  }

  /* ---------- 3) FINAL CTA CHECKMARK TRIGGER ---------- */
  var finalCta = document.querySelector('.final-cta');
  if (finalCta && 'IntersectionObserver' in window) {
    var finalObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          finalCta.classList.add('in-view');
          finalObs.unobserve(finalCta);
        }
      });
    }, { threshold: 0.3 });
    finalObs.observe(finalCta);
  } else if (finalCta) {
    finalCta.classList.add('in-view');
  }

  /* ---------- 4) BEFORE / AFTER SLIDER ---------- */
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
      return ((clientX - rect.left) / rect.width) * 100;
    }
    function start() { dragging = true; slider.classList.add('dragging'); }
    function move(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(positionFromEvent(clientX));
      e.preventDefault();
    }
    function end() { dragging = false; slider.classList.remove('dragging'); }

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);

    slider.addEventListener('click', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      setPosition(positionFromEvent(e.clientX));
    });

    setPosition(50);
    setTimeout(function () { setPosition(38); }, 1200);
  }

  /* ---------- 5) DIAGONAL STRIP CAROUSEL DOTS ---------- */
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

  /* ---------- 6) SCROLL REVEAL ---------- */
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

    // fail-safe: force-reveal anything still hidden after 4s
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 4000);
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

});

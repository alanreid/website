(function () {
  var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiPos = 0;

  document.addEventListener("keydown", function (e) {
    if (e.keyCode === konamiSeq[konamiPos]) {
      konamiPos++;

      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        partyMode();
      }
    } else {
      konamiPos = 0;
    }
  });

  /* Mobile: tap the logo 7 times to trigger */
  var tapCount = 0;
  var tapTimer = null;
  var logo = document.querySelector(".nav-logo");

  if (logo) {
    logo.addEventListener("click", function (e) {
      tapCount++;

      clearTimeout(tapTimer);

      tapTimer = setTimeout(function () {
        tapCount = 0;
      }, 2000);

      if (tapCount >= 7) {
        tapCount = 0;
        clearTimeout(tapTimer);
        e.preventDefault();
        partyMode();
      }
    });
  }

  function partyMode() {
    var cleaned = false;
    var W = window.innerWidth;
    var H = window.innerHeight;

    document.body.classList.add("party-mode");

    /* Confetti canvas */
    var confettiCanvas = document.createElement("canvas");
    confettiCanvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(confettiCanvas);

    var cCtx = confettiCanvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;

    confettiCanvas.width = W * dpr;
    confettiCanvas.height = H * dpr;
    cCtx.scale(dpr, dpr);

    var colors = [
      "#14b8a6",
      "#f59e0b",
      "#ec4899",
      "#3b82f6",
      "#a855f7",
      "#22c55e",
      "#ef4444",
      "#06b6d4",
      "#ffffff",
      "#fbbf24",
    ];
    var particles = [];

    /* Shape types: 0=rect, 1=circle, 2=streamer */
    function makeParticle(x, y, power) {
      var angle = Math.random() * Math.PI * 2;
      var speed = (Math.random() * 0.7 + 0.3) * power;

      return {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rv: (Math.random() - 0.5) * 0.2,
        shape: Math.floor(Math.random() * 3),
        opacity: 1,
        gravity: 0.12 + Math.random() * 0.08,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.1 + 0.03,
        drag: 0.98 + Math.random() * 0.015,
      };
    }

    /* Initial big burst from center */
    for (var i = 0; i < 200; i++) {
      particles.push(makeParticle(W / 2, H / 2, 18));
    }

    /* Staggered bursts from random positions */
    var burstTimers = [];
    for (var b = 0; b < 6; b++) {
      burstTimers.push(
        setTimeout(
          function () {
            var bx = Math.random() * W;
            var by = Math.random() * H * 0.6;

            for (var j = 0; j < 80; j++) {
              particles.push(makeParticle(bx, by, 14));
            }
          },
          400 + b * 600,
        ),
      );
    }

    /* Continuous gentle rain from top */
    var rainInterval = setInterval(function () {
      for (var r = 0; r < 5; r++) {
        var p = makeParticle(Math.random() * W, -20, 3);
        p.vy = Math.abs(p.vy) + 1;
        p.gravity = 0.05;
        particles.push(p);
      }
    }, 100);

    /* Screen shake */
    var shakeStart = performance.now();
    var shakeDuration = 600;

    function applyShake() {
      var elapsed = performance.now() - shakeStart;

      if (elapsed < shakeDuration) {
        var intensity = 6 * (1 - elapsed / shakeDuration);
        var sx = (Math.random() - 0.5) * intensity;
        var sy = (Math.random() - 0.5) * intensity;

        document.body.style.transform = "translate(" + sx + "px," + sy + "px)";
        requestAnimationFrame(applyShake);
      } else {
        document.body.style.transform = "";
      }
    }
    applyShake();

    /* Disco hue rotation on party-mode elements */
    var hue = 0;
    var discoInterval = setInterval(function () {
      hue = (hue + 3) % 360;
      document.body.style.setProperty("--party-hue", hue + "deg");
    }, 50);

    var startTime = performance.now();

    function animateConfetti() {
      var now = performance.now();
      var elapsed = (now - startTime) / 1000;
      cCtx.clearRect(0, 0, W, H);

      for (var j = particles.length - 1; j >= 0; j--) {
        var p = particles[j];
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.8;
        p.y += p.vy;
        p.rot += p.rv;

        /* Fade out particles that leave the screen */
        if (p.y > H + 50) {
          particles.splice(j, 1);
          continue;
        }

        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate(p.rot);
        cCtx.globalAlpha = p.opacity;
        cCtx.fillStyle = p.color;

        if (p.shape === 0) {
          /* Rectangle */
          cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 1) {
          /* Circle */
          cCtx.beginPath();
          cCtx.arc(0, 0, p.w / 2.5, 0, Math.PI * 2);
          cCtx.fill();
        } else {
          /* Streamer / ribbon */
          cCtx.beginPath();
          cCtx.moveTo(-p.w, 0);
          cCtx.quadraticCurveTo(0, -p.h * 2, p.w, Math.sin(p.wobble * 3) * p.h);
          cCtx.lineWidth = 2;
          cCtx.strokeStyle = p.color;
          cCtx.stroke();
        }

        cCtx.restore();
      }

      /* Sparkle flashes */
      if (elapsed < 15) {
        for (var s = 0; s < 3; s++) {
          var sx = Math.random() * W;
          var sy = Math.random() * H;
          var sr = Math.random() * 3 + 1;
          cCtx.save();
          cCtx.globalAlpha = Math.random() * 0.8 + 0.2;
          cCtx.fillStyle = "#fff";
          cCtx.beginPath();
          cCtx.arc(sx, sy, sr, 0, Math.PI * 2);
          cCtx.fill();
          /* Star cross */
          cCtx.fillRect(sx - sr * 2, sy - 0.5, sr * 4, 1);
          cCtx.fillRect(sx - 0.5, sy - sr * 2, 1, sr * 4);
          cCtx.restore();
        }
      }

      if (confettiCanvas.parentNode) {
        requestAnimationFrame(animateConfetti);
      }
    }

    requestAnimationFrame(animateConfetti);

    /* Toast notification with dismiss */
    var toast = document.createElement("div");
    toast.className = "party-toast";

    var toastText = document.createElement("span");
    toastText.textContent = "\uD83C\uDF89 You found the secret!";

    var dismiss = document.createElement("button");
    dismiss.className = "party-dismiss";
    dismiss.textContent = "Turn off";
    dismiss.addEventListener("click", cleanup);
    toast.appendChild(toastText);
    toast.appendChild(dismiss);
    document.body.appendChild(toast);

    /* Cleanup */
    function cleanup() {
      if (cleaned) {
        return;
      }

      cleaned = true;

      clearInterval(rainInterval);
      clearInterval(discoInterval);

      burstTimers.forEach(clearTimeout);

      document.body.classList.remove("party-mode");
      document.body.style.transform = "";
      document.body.style.removeProperty("--party-hue");

      if (confettiCanvas.parentNode) {
        confettiCanvas.parentNode.removeChild(confettiCanvas);
      }

      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }

    setTimeout(cleanup, 20000);
  }
})();

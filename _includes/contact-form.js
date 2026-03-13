function launchConfetti() {
  var canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  var pieces = [];
  var colors = ["#14b8a6", "#f59e0b", "#6366f1", "#ec4899", "#22c55e"];

  for (var i = 0; i < 150; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -18 - 4,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.3,
      gravity: 0.35,
    });
  }

  var start = performance.now();

  (function frame() {
    if (performance.now() - start > 3000) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(function (p) {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rv;
      p.vx *= 0.99;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(frame);
  })();
}

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const data = Object.fromEntries(new FormData(contactForm));
    const res = await fetch(contactForm.action, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Form submission failed");
    }

    const msg = document.createElement("div");
    msg.className = "form-success visible";
    msg.setAttribute("role", "status");
    msg.innerHTML =
      "<h3>Message Sent</h3><p>Thanks for reaching out, I'll get back to you soon.</p>";
    contactForm.replaceWith(msg);

    launchConfetti();
  } catch {
    btn.disabled = false;
    btn.textContent = "Send Message";

    var err = contactForm.querySelector(".form-error");

    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      err.setAttribute("role", "alert");
      contactForm.insertBefore(err, btn);
    }

    err.textContent =
      "Something went wrong. Please try again or email me directly at mail@alanreid.de.";
  }
});

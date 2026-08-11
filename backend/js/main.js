// ========================================
// MENÚ HAMBURGUESA
// ========================================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ========================================
// HEADER SCROLL (sombra al hacer scroll)
// ========================================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ========================================
// INTERSECTION OBSERVER (fade-up en tarjetas)
// ========================================
const fadeElements = document.querySelectorAll('.service-card, .stat-item, .mv-card, .location-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -30px 0px'
});

fadeElements.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ========================================
// ANIMACIÓN DE CONTADORES (estadísticas)
// ========================================
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const increment = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ========================================
// ENVÍO DEL FORMULARIO (fetch)
// ========================================
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Por favor completa todos los campos obligatorios.';
      feedback.className = 'form-feedback error';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = 'Ingresa un correo electrónico válido.';
      feedback.className = 'form-feedback error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        feedback.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        feedback.textContent = result.error || 'Ocurrió un error. Intenta de nuevo.';
        feedback.className = 'form-feedback error';
      }
    } catch (error) {
      feedback.textContent = 'Error de conexión. Revisa tu internet.';
      feedback.className = 'form-feedback error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });
}

// ========================================
// CLOSE MENU AL HACER CLICK EN UN ENLACE
// ========================================
document.querySelectorAll('.nav__list a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});
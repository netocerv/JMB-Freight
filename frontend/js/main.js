// ========================================
// MENÚ HAMBURGUESA
// ========================================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    // Opcional: animar ícono hamburguesa
    hamburger.classList.toggle('active');
  });
}

// ========================================
// INTERSECTION OBSERVER (fade-up)
// ========================================
const fadeElements = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -20px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ========================================
// ENVÍO DEL FORMULARIO (fetch)
// ========================================
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación básica
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

    // Deshabilitar botón para evitar múltiples envíos
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
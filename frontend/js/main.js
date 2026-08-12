/* ============================================
   JMB FREIGHT - JAVASCRIPT PRINCIPAL
   ============================================ */

// ============================================================
// 1. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
});

document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        nav?.classList.remove('open');
    });
});

// ============================================================
// 2. HEADER SCROLL EFFECT
// ============================================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// ============================================================
// 3. ANIMACIONES AL SCROLL
// ============================================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero__stat-number')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .service-card, .fleet-card, .vehicle-article').forEach(el => {
    observer.observe(el);
});

// ============================================================
// 4. CONTADORES ANIMADOS
// ============================================================
function animateCounter(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        
        element.textContent = current + (target > 100 ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (target > 100 ? '+' : '');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ============================================================
// 5. FORMULARIO DE CONTACTO (FULLY FUNCTIONAL)
// ============================================================
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
        
        // Validar campos
        let isValid = true;
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        
        if (!name.value.trim()) {
            showError('nameError');
            name.classList.add('error');
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError('emailError');
            email.classList.add('error');
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            showError('phoneError');
            phone.classList.add('error');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError('messageError');
            message.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Deshabilitar botón
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Recolectar datos
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Intentar enviar al backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Éxito
                form.reset();
                successMessage.classList.add('visible');
                successMessage.querySelector('p').textContent = '¡Mensaje enviado! Te contactaremos en breve.';
                setTimeout(() => successMessage.classList.remove('visible'), 8000);
            } else {
                // Error del servidor: usar fallback mailto
                sendEmailFallback(data);
            }
        } catch (error) {
            // Error de red: usar fallback mailto
            console.warn('Backend no disponible, usando fallback mailto');
            sendEmailFallback(data);
        }
        
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane"></i>';
    });
}

function showError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('visible');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================
// 6. FALLBACK: mailto con datos del formulario
// ============================================================
function sendEmailFallback(data) {
    // 🔹 CORREO: Cambia por el correo de la empresa
    const empresaEmail = 'contacto@jmbfreight.mx';
    
    const subject = encodeURIComponent(`Cotización JMB Freight - ${data.name}`);
    const body = encodeURIComponent(
        `Nombre: ${data.name}\n` +
        `Correo: ${data.email}\n` +
        `Teléfono: ${data.phone}\n` +
        `Servicio: ${data.service || 'No especificado'}\n\n` +
        `Mensaje:\n${data.message}`
    );
    
    const mailtoLink = `mailto:${empresaEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    const successMessage = document.getElementById('formSuccess');
    if (successMessage) {
        successMessage.classList.add('visible');
        successMessage.querySelector('p').textContent = '📧 ¡Mensaje enviado por correo! Te contactaremos pronto.';
        setTimeout(() => successMessage.classList.remove('visible'), 8000);
    }
}

// ============================================================
// 7. SCROLL SUAVE PARA ENLACES INTERNOS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = document.getElementById('header')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================
// 8. ENLACE ACTIVO EN EL MENÚ
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || 
            link.getAttribute('href') === `index.html#${current}`) {
            link.classList.add('active');
        }
    });
});
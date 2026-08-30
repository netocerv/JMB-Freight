/* ============================================
   JMB FREIGHT - JAVASCRIPT PRINCIPAL v6.0
   ============================================ */

// ----- HAMBURGER MENU -----
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

// ----- HEADER SCROLL EFFECT -----
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// ----- ANIMACIONES AL SCROLL -----
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

// SE AÑADIÓ .hero__stat-number A LOS SELECTORES PARA QUE EL OBSERVADOR LOS DETECTE
document.querySelectorAll('.fade-in, .service-card, .fleet-card, .hero__stat-number').forEach(el => {
    observer.observe(el);
});

// ----- ANIMACIÓN DE CONTADORES -----
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

// ----- FORMULARIO DE CONTACTO -----
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('error'));
        
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
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        let formDataObj = null;

        try {
            const formData = new FormData(form);
            formDataObj = Object.fromEntries(formData.entries());
            
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataObj)
            });
            
            if (response.ok) {
                form.reset();
                successMessage.classList.add('visible');
                setTimeout(() => {
                    successMessage.classList.remove('visible');
                }, 6000);
            } else {
                sendEmailFallback(formDataObj);
            }
        } catch (error) {
            sendEmailFallback(formDataObj);
        }
        
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

function sendEmailFallback(data) {
    const subject = encodeURIComponent(`Cotización JMB Freight - ${data.name}`);
    const body = encodeURIComponent(
        `Nombre: ${data.name}\n` +
        `Correo: ${data.email}\n` +
        `Teléfono: ${data.phone}\n` +
        `Servicio: ${data.service || 'No especificado'}\n` +
        `Mensaje: ${data.message}`
    );
    
    const mailtoLink = `mailto:contacto@jmbfreight.mx?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    successMessage.classList.add('visible');
    successMessage.querySelector('p').textContent = '¡Mensaje enviado por correo! Te contactaremos pronto.';
    setTimeout(() => {
        successMessage.classList.remove('visible');
    }, 6000);
}

// ----- SCROLL SUAVE PARA ENLACES INTERNOS -----
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

// ----- ACTUALIZAR ENLACE ACTIVO EN EL MENÚ AL SCROLL -----
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
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// MODAL DE GALERÍA DE FLOTA (DINÁMICO)
// ============================================
const modal = document.getElementById('fleetModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalGallery = document.getElementById('modalGallery');
const modalCta = document.getElementById('modalCta');

function openModal(vehicleName, imagesArray) {
    if (!modal) return;
    
    modalTitle.textContent = vehicleName;
    modalGallery.innerHTML = '';
    
    if (imagesArray && imagesArray.length > 0 && imagesArray[0] !== "") {
        imagesArray.forEach(src => {
            const img = document.createElement('img');
            img.src = src.trim();
            img.alt = `${vehicleName} - Imagen`;
            img.loading = 'lazy';
            modalGallery.appendChild(img);
        });
    } else {
        modalGallery.innerHTML = '<p style="color: var(--color-gray);">No hay imágenes disponibles para este vehículo.</p>';
    }
    
    modalCta.href = '#contacto';
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
        closeModal();
    }
});

// Inyectar el evento click leyendo dinámicamente el data-gallery
document.querySelectorAll('.fleet-card').forEach(card => {
    const title = card.querySelector('h3')?.textContent.trim();
    const galleryData = card.getAttribute('data-gallery');
    const images = galleryData ? galleryData.split(',') : [];
    
    const image = card.querySelector('.fleet-card__image');
    image?.addEventListener('click', () => openModal(title, images));
    
    const heading = card.querySelector('h3');
    heading?.addEventListener('click', () => openModal(title, images));
});

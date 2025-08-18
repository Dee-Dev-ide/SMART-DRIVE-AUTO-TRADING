document.addEventListener('DOMContentLoaded', function () {
  // Offcanvas navigation
  const toggle = document.querySelector('.nav__toggle');
  const tray = document.getElementById('offcanvas');
  const closeBtn = document.querySelector('.offcanvas__close');
  const backdrop = document.querySelector('.offcanvas__backdrop');

  // Mobile connect elements
  const connectBtn = document.getElementById('connect-btn');
  const mobileConnect = document.getElementById('mobile-connect');

  // Toggle offcanvas menu
  function openTray() {
    tray.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeTray() {
    tray.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    tray.classList.contains('open') ? closeTray() : openTray();
  });

  closeBtn.addEventListener('click', closeTray);
  backdrop.addEventListener('click', closeTray);

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTray();
  });

  // Toggle mobile connect links
  connectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileConnect.hidden = !mobileConnect.hidden;
    connectBtn.textContent = mobileConnect.hidden ? 'Connect' : 'Hide Contacts';
  });

  // Close mobile connect when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileConnect.hidden &&
      !mobileConnect.contains(e.target) &&
      e.target !== connectBtn) {
      mobileConnect.hidden = true;
      connectBtn.textContent = 'Connect';
    }
  });

  // Smooth scroll for all anchor links (navbar and offcanvas)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        closeTray(); // Close offcanvas if open
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Navigation active state management
  function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentSection = getCurrentSection();

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentSection) {
        link.classList.add('active');
      }
    });
  }

  function getCurrentSection() {
    const sections = ['#hero', '#about', '#services', '#testimonials', '#contact'];
    const scrollPosition = window.scrollY + 100; // Offset for better detection

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.querySelector(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        return sections[i];
      }
    }
    return '#hero'; // Default to home
  }

  window.addEventListener('scroll', setActiveNavLink);
  setActiveNavLink();

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Testimonials slider
  const track = document.querySelector('.slider-track');
  const cards = document.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  function updateSlider() {
    cards.forEach(card => card.classList.remove('active'));
    cards[currentIndex].classList.add('active');

    const cardWidth = cards[currentIndex].offsetWidth;
    const screenWidth = window.innerWidth;
    const offset = (cardWidth * currentIndex) - ((screenWidth - cardWidth) / 2);
    track.style.transform = `translateX(-${offset}px)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
  }

  if (cards.length > 0) {
    updateSlider();
    setInterval(nextSlide, 5000);
    window.addEventListener('resize', updateSlider);
  }

  // CONTACT FORM SCRIPT
  const serviceType = document.getElementById('serviceType');
  const reservationFields = document.getElementById('reservationFields');
  const generalFields = document.getElementById('generalFields');
  const callFields = document.getElementById('callFields');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');

  serviceType.addEventListener('change', () => {
    reservationFields.style.display = 'none';
    generalFields.style.display = 'none';
    callFields.style.display = 'none';

    if (serviceType.value === 'reservation') {
      reservationFields.style.display = 'grid';
      submitBtn.textContent = 'Submit';
    } else if (serviceType.value === 'general') {
      generalFields.style.display = 'grid';
      submitBtn.textContent = 'Submit';
    } else if (serviceType.value === 'call') {
      callFields.style.display = 'grid';
      submitBtn.textContent = 'Request a Call';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const formData = new FormData(form);

    // Submit to Formspree using fetch
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          // Show success message
          successMessage.style.display = 'block';
          form.reset();

          // Reset conditional fields
          reservationFields.style.display = 'none';
          generalFields.style.display = 'none';
          callFields.style.display = 'none';

          // Reset service type
          serviceType.value = '';

          // Hide success message after 5 seconds
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      });
  });

  // BOOK NOW BUTTON FUNCTIONALITY
  document.querySelectorAll('.service-card button').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // Get service name from card
      const card = btn.closest('.service-card');
      const serviceName = card.querySelector('h3').textContent.replace(/^[^a-zA-Z]+/, '').trim();

      // Scroll to contact form
      const contactSection = document.getElementById('contact');
      contactSection.scrollIntoView({ behavior: 'smooth' });

      // Autofill dropdown and service field after scroll
      setTimeout(() => {
        serviceType.value = 'reservation';
        serviceType.dispatchEvent(new Event('change'));

        // Autofill service to book
        const reservationService = document.querySelector('input[name="reservationService"]');
        if (reservationService) reservationService.value = serviceName;
      }, 500);
    });
  });
});












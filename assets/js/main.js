/**
 * SUVARNA TRUST GOLD — CORE APPLICATION SCRIPT
 * Handles Theme (Light/Dark), RTL/LTR Direction, Sticky Navbar,
 * Mobile Drawer, Enquiry Modal, Form Validation, Counters & Scroll Reveals.
 */

(function () {
  'use strict';

  const THEME_KEY = 'suvarna_theme';
  const DIR_KEY = 'suvarna_dir';

  /* --------------------------------------------------------------------------
     1. THEME & RTL INITIALIZATION
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function applyDirection(dir) {
    document.documentElement.dir = dir;
    localStorage.setItem(DIR_KEY, dir);
    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-pressed', dir === 'rtl' ? 'true' : 'false');
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyTheme(savedTheme);
  applyDirection(savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    // Re-sync button labels once DOM is ready
    applyTheme(localStorage.getItem(THEME_KEY) || 'light');
    applyDirection(localStorage.getItem(DIR_KEY) || 'ltr');

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });

    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.dir || 'ltr';
        applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
      });
    });

    /* ------------------------------------------------------------------------
       2. STICKY NAVBAR TRANSITION
       ------------------------------------------------------------------------ */
    const header = document.querySelector('.site-header');
    if (header) {
      const updateHeader = () => {
        if (window.scrollY > 36) {
          header.classList.add('is-scrolled');
          header.classList.remove('is-transparent');
        } else {
          header.classList.remove('is-scrolled');
          if (header.dataset.transparentHero === 'true') {
            header.classList.add('is-transparent');
          }
        }
      };
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    /* ------------------------------------------------------------------------
       3. MOBILE DRAWER
       ------------------------------------------------------------------------ */
    const hamburger = document.querySelector('[data-drawer-open]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    const drawerBackdrop = document.querySelector('[data-drawer-backdrop]');
    const drawerClose = document.querySelector('[data-drawer-close]');

    function toggleDrawer(open) {
      if (!drawer || !drawerBackdrop) return;
      drawer.classList.toggle('open', open);
      drawerBackdrop.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (hamburger) hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (hamburger) hamburger.addEventListener('click', () => toggleDrawer(true));
    if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer(false));
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

    /* Mobile & Tablet Sidebar Dropdown */
    document.querySelectorAll('[data-mobile-dropdown-toggle]').forEach((trigger) => {
      const dropdown = trigger.closest('.mobile-dropdown');
      if (!dropdown) return;
      if (dropdown.querySelector('.mobile-dropdown-menu a.active')) {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
      trigger.addEventListener('click', () => {
        const isOpen = dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    /* ------------------------------------------------------------------------
       4. ENQUIRY MODAL
       ------------------------------------------------------------------------ */
    const enquiryModal = document.getElementById('enquiryModal');
    const modalContextInput = document.getElementById('modalEnquiryTopic');

    function openEnquiryModal(topic) {
      if (!enquiryModal) return;
      if (modalContextInput && topic) {
        modalContextInput.value = topic;
      }
      enquiryModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeEnquiryModal() {
      if (!enquiryModal) return;
      enquiryModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-open-enquiry]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDrawer(false);
        openEnquiryModal(trigger.getAttribute('data-topic') || 'General Gold Loan Enquiry');
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleDrawer(false);
        closeEnquiryModal();
        document.querySelectorAll('.modal-backdrop.open').forEach((m) => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });

    /* ------------------------------------------------------------------------
       5. FORM VALIDATION (INDIAN MOBILE + REQUIRED FIELDS + DEMO CONFIRMATION)
       ------------------------------------------------------------------------ */
    document.querySelectorAll('form[data-validate-enquiry]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const fields = form.querySelectorAll('[required], [data-indian-mobile], [type="email"]');
        fields.forEach((field) => {
          const group = field.closest('.form-group');
          const errEl = group ? group.querySelector('.form-error') : null;
          const val = field.value.trim();
          let message = '';

          if (field.hasAttribute('required') && !val) {
            message = 'This field is required.';
          } else if (field.hasAttribute('data-indian-mobile') && val) {
            const cleanMobile = val.replace(/[\s\-+]/g, '').replace(/^91/, '');
            if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
              message = 'Enter a valid 10-digit Indian mobile number (starts with 6–9).';
            }
          } else if (field.type === 'email' && val) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
              message = 'Please enter a valid email address.';
            }
          }

          if (message) {
            isValid = false;
            field.classList.add('is-invalid');
            if (errEl) errEl.textContent = message;
          } else {
            field.classList.remove('is-invalid');
            if (errEl) errEl.textContent = '';
          }
        });

        const successBanner = form.querySelector('.form-success-banner');
        if (isValid && successBanner) {
          successBanner.classList.add('show');
          form.reset();
        }
      });
    });

    /* ------------------------------------------------------------------------
       6. SCROLL REVEAL & ANIMATED COUNTERS
       ------------------------------------------------------------------------ */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    const counterEls = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counterEls.length) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-counter'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 1200;
            const start = performance.now();

            function tick(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(target * eased);
              el.textContent = `${prefix}${current.toLocaleString('en-IN')}${suffix}`;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          });
        },
        { threshold: 0.3 }
      );
      counterEls.forEach((el) => counterObserver.observe(el));
    }

    /* ------------------------------------------------------------------------
       7. FLOATING BACK-TO-TOP BUTTON (VISIBLE ACROSS ALL SECTIONS)
       ------------------------------------------------------------------------ */
    if (!document.querySelector('.back-to-top')) {
      const topBtn = document.createElement('button');
      topBtn.type = 'button';
      topBtn.className = 'back-to-top';
      topBtn.setAttribute('aria-label', 'Back to top');
      topBtn.setAttribute('title', 'Back to top');
      topBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(topBtn);
    }
  });
})();

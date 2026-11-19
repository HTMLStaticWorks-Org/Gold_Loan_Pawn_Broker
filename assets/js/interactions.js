/**
 * SUVARNA TRUST GOLD — ADVANCED UI INTERACTIONS
 * Handles FAQ Accordions, 3D Card Tilt, Service Selection Helper,
 * and Rich Service/Product Detail Modals.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------------------------------------
       1. FAQ ACCORDION
       ------------------------------------------------------------------------ */
    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const panel = item ? item.querySelector('.accordion-panel') : null;
        if (!item || !panel) return;

        const isOpen = item.classList.contains('open');
        // Close sibling items in the same accordion
        const parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion-item.open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('open');
              const p = openItem.querySelector('.accordion-panel');
              const t = openItem.querySelector('.accordion-trigger');
              if (p) p.style.maxHeight = null;
              if (t) t.setAttribute('aria-expanded', 'false');
            }
          });
        }

        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
      });
    });

    /* ------------------------------------------------------------------------
       2. SUBTLE 3D CARD TILT (RESPECTS REDUCED MOTION)
       ------------------------------------------------------------------------ */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('[data-tilt-card]').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    /* ------------------------------------------------------------------------
       3. SERVICE / PRODUCT DETAIL MODAL
       ------------------------------------------------------------------------ */
    const detailModal = document.getElementById('detailModal');
    const detailTitle = document.getElementById('detailModalTitle');
    const detailCategory = document.getElementById('detailModalCategory');
    const detailBody = document.getElementById('detailModalBody');
    const detailBullets = document.getElementById('detailModalBullets');
    const detailEnquireBtn = document.getElementById('detailModalEnquireBtn');

    document.querySelectorAll('[data-detail-trigger]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!detailModal) return;

        const title = btn.getAttribute('data-title') || 'Gold Loan Details';
        const category = btn.getAttribute('data-category') || 'Gold Valuation & Loan';
        const desc = btn.getAttribute('data-desc') || '';
        const specs = (btn.getAttribute('data-specs') || '').split('|').filter(Boolean);

        if (detailTitle) detailTitle.textContent = title;
        if (detailCategory) detailCategory.textContent = category;
        if (detailBody) detailBody.textContent = desc;
        if (detailBullets) {
          detailBullets.innerHTML = specs.map((s) => `<li>${s.trim()}</li>`).join('');
        }
        if (detailEnquireBtn) {
          detailEnquireBtn.setAttribute('data-topic', title);
          detailEnquireBtn.onclick = () => {
            detailModal.classList.remove('open');
            const enqModal = document.getElementById('enquiryModal');
            const topicField = document.getElementById('modalEnquiryTopic');
            if (topicField) topicField.value = title;
            if (enqModal) {
              enqModal.classList.add('open');
              document.body.style.overflow = 'hidden';
            }
          };
        }

        detailModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    /* ------------------------------------------------------------------------
       4. INTERACTIVE SERVICE SELECTOR (SERVICES PAGE)
       ------------------------------------------------------------------------ */
    const selectorBtns = document.querySelectorAll('[data-service-select]');
    const selectorTitle = document.getElementById('selectedServiceTitle');
    const selectorDesc = document.getElementById('selectedServiceDesc');
    const selectorNote = document.getElementById('selectedServiceNote');
    const selectorLink = document.getElementById('selectedServiceLink');

    const serviceRecommendations = {
      personal: {
        title: 'Gold Jewellery Loan',
        desc: 'Designed for households seeking funds against pledged 22K or eligible gold necklaces, bangles, and everyday ornaments with transparent XRF purity checks.',
        note: 'Ideal for medical, education, or family financial needs with clear documentation.',
        href: '#jewellery-loan'
      },
      heritage: {
        title: 'Gold Ornament Loan',
        desc: 'Tailored for traditional family ornaments, temple jewellery, and studded pieces where net gold weight is carefully assessed excluding non-gold stones.',
        note: 'Non-destructive inspection and clear net-weight calculation at the branch.',
        href: '#ornament-loan'
      },
      coin: {
        title: 'Gold Coin Loan (Subject to Policy)',
        desc: 'Available for eligible hallmarked bank-minted or certified gold coins within permitted regulatory weight caps and company acceptance guidelines.',
        note: 'Please confirm coin eligibility and hallmarking requirements with our branch team.',
        href: '#coin-loan'
      },
      business: {
        title: 'Business Gold Loan',
        desc: 'Supports traders, shopkeepers, and MSMEs needing working capital or inventory liquidity by pledging eligible gold assets with flexible repayment options.',
        note: 'Subject to lender policy, KYC verification, and applicable regulatory LTV norms.',
        href: '#business-loan'
      }
    };

    if (selectorBtns.length && selectorTitle) {
      selectorBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          selectorBtns.forEach((b) => b.classList.remove('btn-primary'));
          selectorBtns.forEach((b) => b.classList.add('btn-outline'));
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-primary');

          const key = btn.getAttribute('data-service-select');
          const data = serviceRecommendations[key] || serviceRecommendations.personal;
          selectorTitle.textContent = data.title;
          selectorDesc.textContent = data.desc;
          selectorNote.textContent = data.note;
          if (selectorLink) selectorLink.setAttribute('href', data.href);
        });
      });
    }

    /* ------------------------------------------------------------------------
       5. HOME 1 SPLIT SERVICE SHOWCASE CAROUSEL
       ------------------------------------------------------------------------ */
    document.querySelectorAll('[data-service-carousel]').forEach((carousel) => {
      const slides = carousel.querySelectorAll('[data-carousel-slide]');
      const prevBtn = carousel.querySelector('[data-carousel-prev]');
      const nextBtn = carousel.querySelector('[data-carousel-next]');
      const dots = carousel.parentElement ? carousel.parentElement.querySelectorAll('[data-carousel-dot]') : [];

      if (!slides.length) return;
      let current = 0;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
        dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      }

      if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-carousel-dot'), 10);
          if (!Number.isNaN(idx)) showSlide(idx);
        });
      });
    });

    /* ------------------------------------------------------------------------
       6. HOME 1 TESTIMONIAL CAROUSEL
       ------------------------------------------------------------------------ */
    document.querySelectorAll('[data-testimonial-carousel]').forEach((carousel) => {
      const slides = carousel.querySelectorAll('[data-t-slide]');
      const prevBtn = carousel.querySelector('[data-t-prev]');
      const nextBtn = carousel.querySelector('[data-t-next]');
      const dots = carousel.parentElement ? carousel.parentElement.querySelectorAll('[data-t-dot]') : [];

      if (!slides.length) return;
      let current = 0;

      function showPair(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
        dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      }

      if (prevBtn) prevBtn.addEventListener('click', () => showPair(current - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => showPair(current + 1));
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-t-dot'), 10);
          if (!Number.isNaN(idx)) showPair(idx);
        });
      });
    });

    /* ------------------------------------------------------------------------
       7. HOME 2 KARAT COVERFLOW CAROUSEL
       ------------------------------------------------------------------------ */
    document.querySelectorAll('[data-karat-carousel]').forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll('[data-k-slide]'));
      const prevBtn = carousel.querySelector('[data-k-prev]');
      const nextBtn = carousel.querySelector('[data-k-next]');
      const dots = carousel.parentElement ? carousel.parentElement.querySelectorAll('[data-k-dot]') : [];

      if (!slides.length) return;
      let current = 1; // Start on 20K/center or index 1 as marked is-center

      function updateCoverflow(index) {
        current = (index + slides.length) % slides.length;
        const prevIdx = (current - 1 + slides.length) % slides.length;
        const nextIdx = (current + 1) % slides.length;

        slides.forEach((slide, i) => {
          slide.classList.remove('is-center', 'is-prev', 'is-next', 'is-hidden');
          if (i === current) slide.classList.add('is-center');
          else if (i === prevIdx) slide.classList.add('is-prev');
          else if (i === nextIdx) slide.classList.add('is-next');
          else slide.classList.add('is-hidden');
        });

        dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      }

      if (prevBtn) prevBtn.addEventListener('click', () => updateCoverflow(current - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => updateCoverflow(current + 1));

      slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
          if (i !== current) updateCoverflow(i);
        });
      });

      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-k-dot'), 10);
          if (!Number.isNaN(idx)) updateCoverflow(idx);
        });
      });

      updateCoverflow(current);
    });
  });
})();

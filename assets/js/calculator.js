/**
 * SUVARNA TRUST GOLD — INTERACTIVE GOLD LOAN CALCULATOR
 * Formula:
 *   Estimated Gold Value = Eligible Net Gold Weight × Applicable Gold Rate
 *   Estimated Eligible Loan = Estimated Gold Value × Applicable LTV Percentage
 */

(function () {
  'use strict';

  function formatINR(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }

  function initCalculator(container) {
    const weightInput = container.querySelector('[data-calc-weight]');
    const weightRange = container.querySelector('[data-calc-weight-range]');
    const puritySelect = container.querySelector('[data-calc-purity]');
    const rateInput = container.querySelector('[data-calc-rate]');
    const ltvInput = container.querySelector('[data-calc-ltv]');
    const ltvRange = container.querySelector('[data-calc-ltv-range]');

    const goldValueOut = container.querySelector('[data-calc-gold-value]');
    const loanValueOut = container.querySelector('[data-calc-loan-value]');
    const rateDisplayOut = container.querySelector('[data-calc-rate-display]');
    const purityNoteOut = container.querySelector('[data-calc-purity-note]');

    if (!weightInput || !puritySelect || !rateInput || !ltvInput) return;

    const purityFactors = {
      '24': { label: '24K (99.9% Purity)', factor: 1.0 },
      '22': { label: '22K (91.6% Purity)', factor: 0.916 },
      '20': { label: '20K (83.3% Purity)', factor: 0.833 },
      '18': { label: '18K (75.0% Purity)', factor: 0.75 }
    };

    function calculate() {
      const weight = Math.max(0, parseFloat(weightInput.value) || 0);
      const purityKey = puritySelect.value || '22';
      const baseRate24K = Math.max(0, parseFloat(rateInput.value) || 0);
      const ltv = Math.min(90, Math.max(10, parseFloat(ltvInput.value) || 75));

      const purityInfo = purityFactors[purityKey] || purityFactors['22'];
      const applicableRate = baseRate24K * purityInfo.factor;

      const estimatedGoldValue = weight * applicableRate;
      const estimatedEligibleLoan = estimatedGoldValue * (ltv / 100);

      if (goldValueOut) goldValueOut.textContent = formatINR(estimatedGoldValue);
      if (loanValueOut) loanValueOut.textContent = formatINR(estimatedEligibleLoan);
      if (rateDisplayOut) rateDisplayOut.textContent = `${formatINR(applicableRate)} / g`;
      if (purityNoteOut) purityNoteOut.textContent = purityInfo.label;
    }

    if (weightRange) {
      weightRange.addEventListener('input', () => {
        weightInput.value = weightRange.value;
        calculate();
      });
      weightInput.addEventListener('input', () => {
        weightRange.value = Math.min(parseFloat(weightRange.max) || 500, parseFloat(weightInput.value) || 0);
        calculate();
      });
    } else {
      weightInput.addEventListener('input', calculate);
    }

    if (ltvRange) {
      ltvRange.addEventListener('input', () => {
        ltvInput.value = ltvRange.value;
        calculate();
      });
      ltvInput.addEventListener('input', () => {
        ltvRange.value = ltvInput.value;
        calculate();
      });
    } else {
      ltvInput.addEventListener('input', calculate);
    }

    puritySelect.addEventListener('change', calculate);
    rateInput.addEventListener('input', calculate);

    calculate();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-loan-calculator]').forEach(initCalculator);
  });
})();

(function () {
  'use strict';

  var ITEMS = ['conciencia', 'cianosis', 'estridor', 'entrada', 'retracciones'];

  var form = document.getElementById('form');
  var bar = document.getElementById('bar');
  var totalEl = document.getElementById('total');
  var labelEl = document.getElementById('label');
  var hintEl = document.getElementById('hint');
  var rows = document.querySelectorAll('.ref tbody tr');

  function classify(n) {
    if (n <= 2) return { level: 'leve', label: 'Crup leve', hint: '' };
    if (n <= 5) return { level: 'moderado', label: 'Crup moderado', hint: '' };
    if (n <= 11) return { level: 'grave', label: 'Crup grave', hint: '' };
    return { level: 'inminente', label: 'Insuficiencia respiratoria inminente', hint: 'Puntaje ≥ 12' };
  }

  function update(showMissing) {
    var sum = 0;
    var answered = 0;

    ITEMS.forEach(function (name) {
      var checked = form.querySelector('input[name="' + name + '"]:checked');
      var fs = form.querySelector('fieldset[data-item="' + name + '"]');
      if (checked) {
        sum += parseInt(checked.value, 10);
        answered++;
        fs.classList.remove('missing');
      } else if (showMissing) {
        fs.classList.add('missing');
      }
    });

    rows.forEach(function (r) { r.classList.remove('active'); });

    if (answered < ITEMS.length) {
      bar.setAttribute('data-level', 'vacio');
      totalEl.textContent = answered ? String(sum) : '–';
      labelEl.textContent = 'Sin completar';
      hintEl.textContent = 'Faltan ' + (ITEMS.length - answered) + ' de ' + ITEMS.length + ' ítems';
      return;
    }

    var res = classify(sum);
    bar.setAttribute('data-level', res.level);
    totalEl.textContent = String(sum);
    labelEl.textContent = res.label;
    hintEl.textContent = res.hint;
    var active = document.querySelector('.ref tbody tr[data-level="' + res.level + '"]');
    if (active) active.classList.add('active');
  }

  form.addEventListener('change', function () { update(false); });

  document.getElementById('reset').addEventListener('click', function () {
    form.reset();
    ITEMS.forEach(function (name) {
      form.querySelector('fieldset[data-item="' + name + '"]').classList.remove('missing');
    });
    update(false);
    window.scrollTo({ top: 0 });
  });

  update(false);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();

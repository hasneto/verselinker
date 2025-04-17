(function () {
  const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/hasneto/BibliaJSON/refs/heads/main/NAA.json';

  const regexBiblia = /\b(1?\s?[A-Za-z]{1,}\.?\s?[A-Za-z]*\.?)\s?(\d{1,3})[.:](\d{1,3})(?:[-–](\d{1,3}))?\b/g;

  function criarTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'versiculo-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.maxWidth = '300px';
    tooltip.style.background = '#fff';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.2)';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = 9999;
    tooltip.style.fontSize = '14px';
    tooltip.style.lineHeight = '1.4';
    tooltip.style.borderRadius = '8px';
    document.body.appendChild(tooltip);
    return tooltip;
  }

  const tooltip = criarTooltip();

  function mostrarTooltip(texto, x, y) {
    tooltip.innerText = texto;
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
    tooltip.style.display = 'block';
  }

  function esconderTooltip() {
    tooltip.style.display = 'none';
  }

  function processarTexto(versiculosData) {
  const elementos = document.querySelectorAll('p, span, div, li, h1, h2, h3');

  elementos.forEach(el => {
    if (!el.children.length && regexBiblia.test(el.innerHTML)) {
      el.innerHTML = el.innerHTML.replace(regexBiblia, (match, livro, cap, verIni, verFim) => {
        const livroAbrev = livro.replace(/\s|\./g, '');
        let texto = '';

        if (verFim) {
          for (let v = parseInt(verIni); v <= parseInt(verFim); v++) {
            const chave = `${livroAbrev} ${cap}:${v}`;
            texto += versiculosData[chave] ? `${v}. ${versiculosData[chave]} ` : '';
          }
        } else {
          const chave = `${livroAbrev} ${cap}:${verIni}`;
          texto = versiculosData[chave] || 'Versículo não encontrado';
        }

        const ref = verFim ? `${livroAbrev} ${cap}:${verIni}-${verFim}` : `${livroAbrev} ${cap}:${verIni}`;
        return `<a href="javascript:void(0)" class="versiculo-link" data-versiculo="${ref}" data-texto="${texto.replace(/"/g, '&quot;')}">${match}</a>`;
      });
    }
  });

  document.querySelectorAll('.versiculo-link').forEach(link => {
    link.addEventListener('mouseover', e => {
      const texto = e.target.getAttribute('data-texto');
      mostrarTooltip(texto, e.pageX, e.pageY);
    });
    link.addEventListener('mousemove', e => {
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    });
    link.addEventListener('mouseout', esconderTooltip);
  });
}


  fetch(BIBLE_JSON_URL)
    .then(res => res.json())
    .then(data => {
      processarTexto(data);
    })
    .catch(err => console.error('Erro ao carregar a Bíblia:', err));
})();

(function () {
  const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/hasneto/BibliaJSON/refs/heads/main/NAA.json';

  const regexBiblia = /\b(1?\s?[A-Za-z]{2,})\s?(\d{1,3})(?:[:.](\d{1,3}))?(?:[-–](\d{1,3}))?\b/g;

  const mapLivros = {
    'Gn': 'Gênesis', 'Êx': 'Êxodo', 'Lv': 'Levítico', 'Nm': 'Números', 'Dt': 'Deuteronômio',
    'Js': 'Josué', 'Jz': 'Juízes', 'Rt': 'Rute', '1Sm': '1 Samuel', '2Sm': '2 Samuel',
    '1Rs': '1 Reis', '2Rs': '2 Reis', '1Cr': '1 Crônicas', '2Cr': '2 Crônicas', 'Ed': 'Esdras',
    'Ne': 'Neemias', 'Et': 'Ester', 'Jó': 'Jó', 'Sl': 'Salmos', 'Pv': 'Provérbios',
    'Ec': 'Eclesiastes', 'Ct': 'Cantares', 'Is': 'Isaías', 'Jr': 'Jeremias', 'Lm': 'Lamentações',
    'Ez': 'Ezequiel', 'Dn': 'Daniel', 'Os': 'Oseias', 'Jl': 'Joel', 'Am': 'Amós',
    'Ob': 'Obadias', 'Jn': 'Jonas', 'Mq': 'Miquéias', 'Na': 'Naum', 'Hc': 'Habacuque',
    'Sf': 'Sofonias', 'Ag': 'Ageu', 'Zc': 'Zacarias', 'Ml': 'Malaquias',
    'Mt': 'Mateus', 'Mc': 'Marcos', 'Lc': 'Lucas', 'Jo': 'João', 'At': 'Atos',
    'Rm': 'Romanos', '1Co': '1 Coríntios', '2Co': '2 Coríntios', 'Gl': 'Gálatas',
    'Ef': 'Efésios', 'Fp': 'Filipenses', 'Cl': 'Colossenses', '1Ts': '1 Tessalonicenses',
    '2Ts': '2 Tessalonicenses', '1Tm': '1 Timóteo', '2Tm': '2 Timóteo', 'Tt': 'Tito',
    'Fm': 'Filemom', 'Hb': 'Hebreus', 'Tg': 'Tiago', '1Pe': '1 Pedro', '2Pe': '2 Pedro',
    '1Jo': '1 João', '2Jo': '2 João', '3Jo': '3 João', 'Jd': 'Judas', 'Ap': 'Apocalipse'
  };

  function criarTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'versiculo-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.maxWidth = '300px';
    tooltip.style.background = '#fdfdfd';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.2)';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = 9999;
    tooltip.style.fontSize = '14px';
    tooltip.style.lineHeight = '1.4';
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

  function normalizarLivro(nome) {
    nome = nome.replace(/\s/g, '');
    return mapLivros[nome] || nome;
  }

  function processarTexto(versiculosData) {
    const elementos = document.querySelectorAll('p, span, div, li');

    elementos.forEach(el => {
      if (!el.children.length && regexBiblia.test(el.innerHTML)) {
        el.innerHTML = el.innerHTML.replace(regexBiblia, (match, livro, cap, verIni, verFim) => {
          const chave = `${normalizarLivro(livro)} ${cap}:${verIni}`;
          return `<a href="javascript:void(0)" class="versiculo-link" data-ref="${chave}">${match}</a>`;
        });
      }
    });

    document.querySelectorAll('.versiculo-link').forEach(link => {
      link.addEventListener('mouseover', e => {
        const ref = e.target.dataset.ref;
        const texto = versiculosData[ref] || 'Versículo não encontrado';
        mostrarTooltip(texto, e.pageX, e.pageY);
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

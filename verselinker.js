(function () {
  const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/hasneto/BibliaJSON/refs/heads/main/NAA.json';

  const regexBiblia = /\b(1?\s?[A-Za-z]{1,}\.?\s?[A-Za-z]*\.?)\s?(\d{1,3})[.:](\d{1,3})(?:[-–](\d{1,3}))?\b/g;

  const livrosMapeados = {
    Gn: 'Gn', Êx: 'Êx', Lv: 'Lv', Nm: 'Nm', Dt: 'Dt',
    Js: 'Js', Jz: 'Jz', Rt: 'Rt', 1Sm: '1Sm', 2Sm: '2Sm',
    1Rs: '1Rs', 2Rs: '2Rs', 1Cr: '1Cr', 2Cr: '2Cr', Ed: 'Ed',
    Ne: 'Ne', Et: 'Et', Jó: 'Jó', Sl: 'Sl', Pv: 'Pv',
    Ec: 'Ec', Ct: 'Ct', Is: 'Is', Jr: 'Jr', Lm: 'Lm',
    Ez: 'Ez', Dn: 'Dn', Os: 'Os', Jl: 'Jl', Am: 'Am',
    Ob: 'Ob', Jn: 'Jn', Mq: 'Mq', Na: 'Na', Hc: 'Hc',
    Sf: 'Sf', Ag: 'Ag', Zc: 'Zc', Ml: 'Ml',

    Mt: 'Mt', Mc: 'Mc', Lc: 'Lc', Jo: 'Jo', At: 'At',
    Rm: 'Rm', 1Co: '1Co', 2Co: '2Co', Gl: 'Gl', Ef: 'Ef',
    Fp: 'Fp', Cl: 'Cl', 1Ts: '1Ts', 2Ts: '2Ts', 1Tm: '1Tm',
    2Tm: '2Tm', Tt: 'Tt', Fm: 'Fm', Hb: 'Hb', Tg: 'Tg',
    1Pe: '1Pe', 2Pe: '2Pe', 1Jo: '1Jo', 2Jo: '2Jo',
    3Jo: '3Jo', Jd: 'Jd', Ap: 'Ap'
  };

  function normalizarLivro(livro) {
    return livro.replace(/\s|\./g, '')
      .replace(/(1|2|3)([A-Za-z]+)/, (_, num, nome) => `${num}${nome}`)
      .replace(/^(Genesis|Gn)$/i, 'Gn')
      .replace(/^(Exodo|Êxodo|Êx)$/i, 'Êx')
      .replace(/^(Levitico|Lv)$/i, 'Lv')
      .replace(/^(Numeros|Nm)$/i, 'Nm')
      .replace(/^(Deuteronomio|Dt)$/i, 'Dt')
      .replace(/^(Joao|Jo)$/i, 'Jo')
      .replace(/^(1Corintios|1Co|1Cor)$/i, '1Co')
      .replace(/^(2Corintios|2Co|2Cor)$/i, '2Co')
      .replace(/^(Salmos|Sl)$/i, 'Sl')
      .replace(/^(Romanos|Rm)$/i, 'Rm')
      // adicione mais se necessário
  }

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
    tooltip.style.whiteSpace = 'pre-wrap';
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

  function buscarVersiculo(bibliaJson, livroAbrev, capitulo, versiculo) {
    const livro = bibliaJson.find(l => l.abbrev.toLowerCase() === livroAbrev.toLowerCase());
    if (!livro) return null;
    const cap = livro.chapters[parseInt(capitulo) - 1];
    if (!cap || !cap[parseInt(versiculo) - 1]) return null;
    return cap[parseInt(versiculo) - 1];
  }

  function buscarIntervalo(bibliaJson, livroAbrev, capitulo, versIni, versFim) {
    const livro = bibliaJson.find(l => l.abbrev.toLowerCase() === livroAbrev.toLowerCase());
    if (!livro) return null;
    const cap = livro.chapters[parseInt(capitulo) - 1];
    if (!cap) return null;
    let texto = '';
    for (let i = parseInt(versIni); i <= parseInt(versFim); i++) {
      if (cap[i - 1]) texto += `${i}. ${cap[i - 1]} `;
    }
    return texto.trim();
  }

  function processarTexto(bibliaJson) {
    const elementos = document.querySelectorAll('p, span, div, li, h1, h2, h3');
    elementos.forEach(el => {
      if (!el.children.length && regexBiblia.test(el.innerHTML)) {
        el.innerHTML = el.innerHTML.replace(regexBiblia, (match, livro, cap, verIni, verFim) => {
          const abrev = normalizarLivro(livro);
          let texto = '';
          if (verFim) {
            texto = buscarIntervalo(bibliaJson, abrev, cap, verIni, verFim) || 'Versículo não encontrado';
          } else {
            texto = buscarVersiculo(bibliaJson, abrev, cap, verIni) || 'Versículo não encontrado';
          }
          return `<a href="javascript:void(0)" class="versiculo-link" data-texto="${texto.replace(/"/g, '&quot;')}">${match}</a>`;
        });
      }
    });

    document.querySelectorAll('.versiculo-link').forEach(link => {
      link.addEventListener('mouseover', e => {
        mostrarTooltip(e.target.getAttribute('data-texto'), e.pageX, e.pageY);
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
    .then(data => processarTexto(data))
    .catch(err => console.error('Erro ao carregar a Bíblia:', err));
})();

// verselinker.js - Versículos em tooltip para Blogger
// Créditos: Ótica Reformada (www.oticareformada.com)

(function () {
  const BIBLE_JSON_KEY = 'bible_data_naa';
  const BIBLE_JSON_URL = 'https://www.bibliatodo.com/pt/biblia/naa';

  const BOOK_ALIASES = {
    "gen": "Gênesis", "ex": "Êxodo", "lv": "Levítico", "nm": "Números", "dt": "Deuteronômio",
    "js": "Josué", "jz": "Juízes", "rt": "Rute", "1sm": "1 Samuel", "2sm": "2 Samuel",
    "1rs": "1 Reis", "2rs": "2 Reis", "1cr": "1 Crônicas", "2cr": "2 Crônicas",
    "ed": "Esdras", "ne": "Neemias", "et": "Ester", "job": "Jó", "sl": "Salmos",
    "pv": "Provérbios", "ec": "Eclesiastes", "ct": "Cânticos", "is": "Isaías", "jr": "Jeremias",
    "lm": "Lamentações", "ez": "Ezequiel", "dn": "Daniel", "os": "Oséias", "jl": "Joel",
    "am": "Amós", "ob": "Obadias", "jn": "Jonas", "mq": "Miquéias", "na": "Naum",
    "hc": "Habacuque", "sf": "Sofonias", "ag": "Ageu", "zc": "Zacarias", "ml": "Malaquias",
    "mt": "Mateus", "mc": "Marcos", "lc": "Lucas", "jo": "João", "at": "Atos",
    "rm": "Romanos", "1co": "1 Coríntios", "2co": "2 Coríntios", "gl": "Gálatas", "ef": "Efésios",
    "fp": "Filipenses", "cl": "Colossenses", "1ts": "1 Tessalonicenses", "2ts": "2 Tessalonicenses",
    "1tm": "1 Timóteo", "2tm": "2 Timóteo", "tt": "Tito", "fm": "Filemom", "hb": "Hebreus",
    "tg": "Tiago", "1pe": "1 Pedro", "2pe": "2 Pedro", "1jo": "1 João", "2jo": "2 João",
    "3jo": "3 João", "jd": "Judas", "ap": "Apocalipse"
  };

  function normalizeBookName(name) {
    name = name.toLowerCase().replace(/\s+/g, '');
    return BOOK_ALIASES[name] || name.charAt(0).toUpperCase() + name.slice(1);
  }

  function loadBible(callback) {
    const stored = localStorage.getItem(BIBLE_JSON_KEY);
    if (stored) return callback(JSON.parse(stored));
    fetch(BIBLE_JSON_URL).then(res => res.json()).then(data => {
      localStorage.setItem(BIBLE_JSON_KEY, JSON.stringify(data));
      callback(data);
    });
  }

  function findReferences(text) {
    const regex = /(?:\b(\d?\s?[A-Za-zçÇéãõíó]+)\s+)?(\d{1,3})(?::(\d{1,3}(?:[-,]\d{1,3})*))?/g;
    let matches = [], match;
    while ((match = regex.exec(text)) !== null) {
      const book = normalizeBookName((match[1] || '').trim());
      const chapter = match[2];
      const verses = match[3] || '';
      matches.push({ book, chapter, verses, index: match.index, raw: match[0] });
    }
    return matches;
  }

  function tooltipHtml(content) {
    return `<div style="background:#fff;border:1px solid #ccc;padding:10px;border-radius:6px;max-width:300px;font-size:13px;line-height:1.4">
      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6W249LCXs8KKhYgAn85uKlxXmTIq4_NtFLiURoI4nsQf8ZhDYuCfIsIKl7fv5KBB1PfvVBXoycJyGpUICX3S4pWNMt8QIzORQIsVRtbwbBaHfwf6-gXv9KTP352zmCBrS8xu9UlYCs78HS3mEGyXr7OvP43rJ26D4B_7y1k88Po-j-dGGMdgciaAToQ/s1600/icone3.png" style="height:20px;vertical-align:middle;margin-right:5px">
      <strong>Ótica Reformada</strong><br>${content}</div>`;
  }

  function applyTooltips(root, bible) {
    const elements = root.querySelectorAll("p, span, li, h1, h2, h3, h4, h5, h6");
    elements.forEach(el => {
      const refs = findReferences(el.textContent);
      if (!refs.length) return;
      let html = el.innerHTML;
      refs.forEach(ref => {
        const { book, chapter, verses, raw } = ref;
        const refKey = `${book} ${chapter}`;
        const verseText = (bible[book] && bible[book][chapter]) ?
          (verses ? verses.split(/[,-]/).map(v => `${v}: ${bible[book][chapter][v] || ''}`).join('<br>') : bible[book][chapter][1])
          : 'Versículo não encontrado';
        html = html.replace(raw, `<span title="" onmouseover="this.setAttribute('data-tooltip','${verseText.replace(/"/g, '&quot;')}')" class="bible-ref" style="text-decoration:underline dotted;cursor:help">${raw}</span>`);
      });
      el.innerHTML = html;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadBible(data => applyTooltips(document.body, data));
  });
})();

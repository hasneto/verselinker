
/**
 * verselinker.js
 * Script para exibir versículos bíblicos em tooltip ao passar o mouse sobre referências.
 * Desenvolvido para Ótica Reformada (www.oticareformada.com)
 * Baseado no comportamento do verselinker da Bibliatodo, mas com melhorias e funcionalidades locais.
 */

// URL da logo da Ótica Reformada
const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6W249LCXs8KKhYgAn85uKlxXmTIq4_NtFLiURoI4nsQf8ZhDYuCfIsIKl7fv5KBB1PfvVBXoycJyGpUICX3S4pWNMt8QIzORQIsVRtbwbBaHfwf6-gXv9KTP352zmCBrS8xu9UlYCs78HS3mEGyXr7OvP43rJ26D4B_7y1k88Po-j-dGGMdgciaAToQ/s1600/icone3.png";

// Link do JSON com versículos
const BIBLE_JSON_URL = "https://www.bibliatodo.com/pt/biblia/naa";

// Versão em cache
const CACHE_KEY = "bibleDataCacheNAA";

async function loadBibleData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch(BIBLE_JSON_URL);
    const data = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Erro ao carregar dados da Bíblia", e);
    return null;
  }
}

function normalizeBookName(book) {
  const map = {
    "1tim": "1 Timóteo", "2tim": "2 Timóteo",
    "1cor": "1 Coríntios", "2cor": "2 Coríntios",
    "1jo": "1 João", "2jo": "2 João", "3jo": "3 João",
    "jd": "Judas", "judas": "Judas",
    "jo": "João", "mt": "Mateus", "mc": "Marcos", "lc": "Lucas", "gn": "Gênesis",
    // Adicione outros conforme necessário
  };
  let key = book.toLowerCase().replace(/[^a-z0-9]/g, '');
  return map[key] || book;
}

function findVerse(bibleData, ref) {
  const match = ref.match(/([1-3]?[ ]?[a-zA-Zçãéíô]+)[ ]*(\d+)?[:.]?(\d+)?/);
  if (!match) return null;

  let [, book, chapter, verse] = match;
  book = normalizeBookName(book);
  chapter = chapter || "1";
  verse = verse || "1";

  if (bibleData[book] && bibleData[book][chapter] && bibleData[book][chapter][verse]) {
    return bibleData[book][chapter][verse];
  }
  return null;
}

function createTooltip(text, verse) {
  const tooltip = document.createElement("div");
  tooltip.className = "bible-tooltip";
  tooltip.innerHTML = `
    <div style="font-size:14px; padding:10px; max-width:300px; background:white; border:1px solid #ccc; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.2);">
      <div style="margin-bottom:8px;">${verse}</div>
      <div style="text-align:right; font-size:10px; color:#555;">
        <img src="${LOGO_URL}" alt="Ótica Reformada" style="height:16px; vertical-align:middle;"> 
        <a href="https://www.oticareformada.com" target="_blank" style="color:#555; text-decoration:none;">Ótica Reformada</a>
      </div>
    </div>
  `;
  return tooltip;
}

async function setupVerseTooltips() {
  const bibleData = await loadBibleData();
  if (!bibleData) return;

  const elements = document.querySelectorAll("body *:not(script):not(style)");

  elements.forEach(el => {
    if (el.children.length === 0 && el.textContent.match(/\b[1-3]?\s?[A-Za-zçãéíô]+\s?\d{0,3}[:\.]\d{1,3}\b/g)) {
      const html = el.innerHTML.replace(/\b([1-3]?[ ]?[A-Za-zçãéíô]+)[ ]*(\d{0,3})[:\.]?(\d{1,3})\b/g, (match, book, chap, vers) => {
        const ref = `${book.trim()} ${chap}:${vers}`;
        const verseText = findVerse(bibleData, ref);
        if (!verseText) return match;

        return `<span class="bverse" style="border-bottom:1px dotted #999; cursor:help;" title="${verseText}">${match}</span>`;
      });
      el.innerHTML = html;
    }
  });
}

document.addEventListener("DOMContentLoaded", setupVerseTooltips);

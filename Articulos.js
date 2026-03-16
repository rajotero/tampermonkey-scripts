// ==UserScript==
// @name         Articulos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://*/myinventory/inventory*
// @grant        GM_xmlhttpRequest
// @connect      192.168.0.85
// @updateURL    https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/Articulos.js
// @downloadURL  https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/Articulos.js
// ==/UserScript==

(function () {
'use strict';
  
function procesarArticulo(element) {
    console.log("Artículo visible:", element);
}

const intersectionObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const el = entry.target;

            if (!el.dataset.procesado) {
                el.dataset.procesado = "true";
                procesarArticulo(el);
            }

        }

    });

}, { threshold: 0.3 });

})();

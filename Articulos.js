// ==UserScript==
// @name         Botones pedidos Amazon
// @namespace    http://tampermonkey.net/
// @version      1.4
// @match        https://*/orders-v3*
// @grant        GM_xmlhttpRequest
// @connect      192.168.0.85
// @updateURL    https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/script.user.js
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

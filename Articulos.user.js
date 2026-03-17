// ==UserScript==
// @name         Articulos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match https://*/myinventory*
// @grant        GM_xmlhttpRequest
// @connect      192.168.0.85
// @updateURL    https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/Articulos.user.js
// @downloadURL  https://raw.githubusercontent.com/rajotero/tampermonkey-scripts/main/Articulos.user.js
// ==/UserScript==



(function() {
    'use strict';

    function observarArticulos() {
        
        const rows = document.querySelectorAll('[data-sku]');
        rows.forEach(row => {
            if (row.dataset.procesado) return;
            const sku = row.dataset.sku;
            if (!sku) return;
            
            // 👉 aquí buscamos la zona de detalles del producto
            const contenedor = row.querySelector('[id*="productDetails"]') || row;

        if (!contenedor) return;

        row.dataset.procesado = "1";

        // 🔘 BOTÓN CONTROL
        const btnControl = document.createElement('button');
        btnControl.textContent = "Control";
        btnControl.style.marginLeft = "6px";
        btnControl.style.fontSize = "11px";
        btnControl.style.cursor = "pointer";

        btnControl.onclick = () => {
            console.log("Control:", sku);
   //         llamarServidorControl(sku);
        };

        // 🔘 BOTÓN PEDIDOS
        const btnPedidos = document.createElement('button');
        btnPedidos.textContent = "Pedidos";
        btnPedidos.style.marginLeft = "6px";
        btnPedidos.style.fontSize = "11px";
        btnPedidos.style.cursor = "pointer";

        btnPedidos.onclick = () => {
            console.log("Pedidos:", sku);
   //         llamarPedidos(sku);
        };

        // 👉 insertamos
          // 👉 insertamos
    const skuLink = row.querySelector('a[href*="skucentral"]');
    console.log("skuLink",skuLink);
        const skuLabel = [...row.querySelectorAll('div, span')]
    .find(el => el.textContent.includes('SKU'));

if (skuLink) {
    skuLink.insertAdjacentElement("afterend", btnControl);
    btnControl.insertAdjacentElement("afterend", btnPedidos);
}



    });
    }

    setTimeout(() => {
        console.log("Timeout...");
        observarArticulos();
    }, 30000);
})();

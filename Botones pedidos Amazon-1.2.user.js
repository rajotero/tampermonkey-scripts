// ==UserScript==
// @name         Botones pedidos Amazon
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        https://sellercentral.amazon.es/orders-v3*
// @grant        GM_xmlhttpRequest
// @connect      192.168.0.85
// ==/UserScript==

(function () {
'use strict';

const style = document.createElement('style');
style.textContent = `
.spinner {
  border:2px solid #f3f3f3;
  border-top:2px solid #333;
  border-radius:50%;
  width:12px;
  height:12px;
  animation:spin 1s linear infinite;
  display:inline-block;
  margin-left:4px;
}
@keyframes spin {
0% {transform:rotate(0deg);}
100% {transform:rotate(360deg);}
}`;
document.head.appendChild(style);


function obtenerTodosLosPedidos(){

    const pedidos = [];

    document.querySelectorAll('.btn-benef').forEach(btn=>{
        pedidos.push(btn.dataset.orderId);
    });

    return pedidos;
}


function llamarServidor(){

    const pedidos = obtenerTodosLosPedidos();

    if(pedidos.length === 0) return;

    const url = "http://192.168.0.85/Trazabilidad/PedidosAmazon/BeneficioPedido?pedidos=" + pedidos.join(",");

    document.querySelectorAll('.btn-benef').forEach(btn=>{
        btn.innerHTML='Calculando <span class="spinner"></span>';
        btn.disabled=true;
        btn.style.cursor="not-allowed";
    });

    GM_xmlhttpRequest({

        method:"GET",
        url:url,

        onload:function(response){

            const datos = JSON.parse(response.responseText);

            document.querySelectorAll('.btn-benef').forEach(btn=>{

                const pedido = btn.dataset.orderId;

                if(!datos[pedido]) return;

                const beneficio = datos[pedido].Beneficio;
                const stock = datos[pedido].Stock;

                btn.textContent = `Benef ${beneficio}€ | Stock ${stock}`;
                btn.disabled=false;
                btn.style.cursor="pointer";

                if(beneficio < 0){
                    btn.style.backgroundColor="red";
                    btn.style.color="white";
                }else{
                    btn.style.backgroundColor="green";
                    btn.style.color="white";
                }

            });

        }

    });

}

function llamarPedidos(sku){
    const baseUrl = window.location.origin;
    const width = 700;
    const height = 1400;
    const left = window.screen.width - width;
    const top = 0;
    const urlControl = `${baseUrl}/orders-v3/search?q=${sku}&qt=sku&res=si&sort=order_date_desc&page=1&date-range=last-365`;;
    window.open(urlControl,'popUpWindow',`toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`);
}

function llamarServidorControl(sku){
const popupWidth = 700;
const popupHeight = 1400;

// Calculamos el tamaño disponible de la pantalla
const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;

// Ajustamos la ventana padre para que haya espacio para el popup a la derecha
const newWidth = screenWidth - popupWidth;
const newHeight = Math.min(screenHeight, window.outerHeight); // mantener alto actual o ajustar si quieres

// Redimensionamos la ventana padre
window.resizeTo(newWidth, newHeight);
    console.log(newWidth, newHeight);

// Ahora abrimos el popup a la derecha
const left = newWidth; // empieza donde termina la ventana padre
const top = 0;
    const urlControl = "http://fabrica.synology.me:80/ChartFBA?sku=" + sku + "&pais=&merchantId=";
    window.open(urlControl,'popUpWindow',`toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
}


function crearBotonesPedido(pedido,sku,link){

    const btnControl = document.createElement('button');
    btnControl.textContent="Control.";
    btnControl.className="btn-amz-extra btn-control";
    btnControl.dataset.orderId=pedido;
    btnControl.style.marginLeft="6px";
    btnControl.style.padding="3px 6px";
    btnControl.style.fontSize="11px";
    btnControl.style.cursor="pointer";

    btnControl.addEventListener('click',()=>llamarServidorControl(sku));


    const btnBenef = document.createElement('button');
    btnBenef.textContent="Benef.";
    btnBenef.className="btn-amz-extra btn-benef";
    btnBenef.dataset.orderId=pedido;
    btnBenef.style.marginLeft="6px";
    btnBenef.style.padding="3px 6px";
    btnBenef.style.fontSize="11px";
    btnBenef.style.cursor="pointer";

    btnBenef.addEventListener('click',()=>llamarServidor());

    const btnpedidos = document.createElement('button');
    btnpedidos.textContent="Pedidos";
    btnpedidos.className="btn-amz-extra btn-Pedidos";
    btnpedidos.dataset.orderId=pedido;
    btnpedidos.style.marginLeft="6px";
    btnpedidos.style.padding="3px 6px";
    btnpedidos.style.fontSize="11px";
    btnpedidos.style.cursor="pointer";

    btnpedidos.addEventListener('click',()=>llamarPedidos(sku));


    link.insertAdjacentElement("afterend",btnControl);
    btnControl.insertAdjacentElement("afterend",btnBenef);
    btnBenef.insertAdjacentElement("afterend",btnpedidos);

}


function crearBotones(){

    const rows = document.querySelectorAll("#orders-table tr");

    rows.forEach(row=>{

        if(row.dataset.procesado) return;

        const orderLink = row.querySelector('a[href*="/orders-v3/order/"]');

        if(!orderLink) return;

        const skuMatch = row.innerText.match(/SKU\s*:\s*([^\s]+)/);
        const sku = skuMatch ? skuMatch[1] : null;

        row.dataset.procesado = "1";

        const pedido = orderLink.textContent.trim();

        crearBotonesPedido(pedido,sku,orderLink);

    });

}


setInterval(crearBotones,1500);

})();
<?php
include "../menu.php";
include "../header.php";


?>


<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="FE_FCE">Facturacion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Factura Compras</li>
            </ol>
        </nav>
        <div class="container">
            <div id="FacturacionCompras"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PurchaseBilling
    } from './react-dist/billing/purchase_billing/PurchaseBilling.js';

    ReactDOMClient.createRoot(document.getElementById('FacturacionCompras')).render(React.createElement(PurchaseBilling));
</script>



<?php include "../footer.php";
include "../Inventario/modal/modalNuevoInsumo.php";
?>
<?php
include "../menu.php";
include "../header.php";


?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="FE_FCE">Facturacion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Factura Ventas</li>
            </ol>
        </nav>
        <div class="container">
            <div id="FacturacionVentas"></div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        SalesBilling
    } from './react-dist/billing/sales_billing/SalesBilling.js';

    ReactDOMClient.createRoot(document.getElementById('FacturacionVentas')).render(React.createElement(SalesBilling));
</script>



<?php include "../footer.php"; ?>
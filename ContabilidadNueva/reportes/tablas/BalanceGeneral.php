<?php
include "../../../menu.php";
include "../../../header.php";


?>
    <div class="content">
            <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Balance General</li>
            </ol>
        </nav>
        <div class="main-content">
         <div class="component-container">
            <div id="balanceGeneral"></div>
        </div>
    </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        BalanceSheet
    } from './react-dist/billing/reports/BalanceSheet.js';

    ReactDOMClient.createRoot(document.getElementById('balanceGeneral')).render(React.createElement(BalanceSheet));
</script>



<?php include "../../../footer.php"; ?>
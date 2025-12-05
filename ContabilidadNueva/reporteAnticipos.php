<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>
<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Anticipos</li>
            </ol>
        </nav>
        <div class="main-content">

            <div class="component-container">
                <div id="reporteAnticipos"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AdvancesReport
    } from './react-dist/billing/reports/AdvancesReport.js';

    ReactDOMClient.createRoot(document.getElementById('reporteAnticipos')).render(
        React.createElement(AdvancesReport)
    );
</script>
<?php
include "../footer.php";
?>
<?php
include "../../../menu.php";
include "../../../header.php";
?>


 <div class="content">
     <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="ReportesContables">Reportes Contables</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Libro diario
                </li>
            </ol>
        </nav>
             <div class="main-content">
            <div class="component-container">
            <div id="generalJournalReport"></div>
        </div>
    </div>
</div>
</div>

<?php
include "../../../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        GeneralJournal
    } from './react-dist/billing/reports/GeneralJournal.js';

    ReactDOMClient.createRoot(document.getElementById('generalJournalReport')).render(React.createElement(GeneralJournal));
</script>
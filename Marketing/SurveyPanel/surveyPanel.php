<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeMarketing">Marketing</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Panel de encuestas
                </li>
            </ol>
        </nav>
        <div class="w-full">
            <h2 class="section-title">Panel de encuestas</h2>

            <div id="surveyPanel"></div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        SurveyPanelApp
    } from './react-dist/marketing/survey-panel/SurveyPanelApp.js';

    ReactDOMClient.createRoot(document.getElementById('surveyPanel')).render(React.createElement(SurveyPanelApp));
</script>
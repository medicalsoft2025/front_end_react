<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        UserForm
    } from './react-dist/dynamic-form/demos/forms/UserForm.js';

    const rootElement = document.getElementById('appointmentModalRoot');

    ReactDOMClient.createRoot(rootElement).render(React.createElement(UserForm));
</script>

<?php include "../footer.php"; ?>
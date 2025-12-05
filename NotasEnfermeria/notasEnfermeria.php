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
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
        <li class="breadcrumb-item active">Notas de Enfermería</li>
      </ol>
    </nav>
    <div id="notasEnfermeriaAppReact"></div>
  </div>
</div>
<?php include "../footer.php"; ?>

<script type="module">
  import {
    patientService
  } from "../../services/api/index.js";

  const patientId = new URLSearchParams(window.location.search).get('patient_id');
  
  if (patientId) {
    try {
      const patient = await patientService.get(patientId);
      document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
          element.href = `verPaciente?id=${patient.id}`;
        }
      });
    } catch (error) {
      console.error("Error loading patient:", error);
    }
  }
</script>

<script type="module">
  import React from "react";
  import ReactDOMClient from "react-dom/client";
  import {
    patientsNursingNotesApp
  } from './react-dist/patients/patientsNursingNotes/patientsNursingNotesApp.js';

  const patientId = new URLSearchParams(window.location.search).get('patient_id');
  console.log("PHP - Rendering React app with patientId:", patientId);
  
  const root = ReactDOMClient.createRoot(document.getElementById('notasEnfermeriaAppReact'));
  root.render(React.createElement(patientsNursingNotesApp, { patientId: patientId }));
</script>
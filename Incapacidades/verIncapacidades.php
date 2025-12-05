<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }

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
            <ol class="breadcrumb mt-5">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item">
                    <a class="patient-name" href="verPaciente?id=<?= $_GET['patient_id'] ?>">
                        Cargando paciente...
                    </a>
                </li>
                <li class="breadcrumb-item active">Incapacidades</li>
            </ol>
        </nav>
        
        <div class="main-content">
            <div class="component-container">
                <div id="disability-app"></div>
            </div>
        </div>
    </div>
</div>

<?php include './modalIncapacidad.php'; ?>

<script type="module">
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import DisabilityApp from './react-dist/disabilities/DisabilityApp.js';
    import { patientService } from '../../services/api/index.js';

    class PatientApp {
        constructor() {
            this.patientId = new URLSearchParams(window.location.search).get('patient_id');
            this.init();
        }

        async init() {
            try {
                await this.loadPatientData();
                this.renderReactApp();
            } catch (error) {
                this.handleError(error);
            }
        }

        async loadPatientData() {
            if (!this.patientId) throw new Error('No patient ID provided');
            
            this.patient = await patientService.get(this.patientId);
            this.updateBreadcrumb();
        }

        updateBreadcrumb() {
            const patientElements = document.querySelectorAll('.patient-name');
            const patientName = `${this.patient.first_name} ${this.patient.last_name}`;

            patientElements.forEach(element => {
                element.textContent = patientName;
                element.href = `verPaciente?id=${this.patient.id}`;
            });
        }

        renderReactApp() {
            const container = document.getElementById('disability-app');
            if (!container) return;

            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(DisabilityApp, { 
                patientId: this.patientId 
            }));
        }

        handleError(error) {
            console.error('App initialization error:', error);
            document.querySelectorAll('.patient-name').forEach(element => {
                element.textContent = 'Paciente no encontrado';
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => new PatientApp());
</script>

<?php include "../footer.php"; ?>
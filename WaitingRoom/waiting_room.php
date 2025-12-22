<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sala de Espera - Monaros</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f0f4f8;
            color: #333;
        }

        .brand-bg {
            background-color: #132030;
        }

        .card-shadow {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        @keyframes highlight {
            0% {
                transform: scale(1);
                background-color: #ffffff;
            }

            50% {
                transform: scale(1.02);
                background-color: #eef2ff;
            }

            100% {
                transform: scale(1);
                background-color: #ffffff;
            }
        }

        .highlight-call {
            animation: highlight 1.5s ease-out forwards;
        }

        tbody tr {
            animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        .custom-btn {
            width: 150px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
        }

        .container-small {
            max-width: 100% !important;
            width: 100%;
            padding: 0;
            margin: 0;
        }

        .custom-btn i {
            margin-right: 5px;
        }

        .animate-pulse-once {
            animation: pulse-once 2s ease-in-out;
        }

        @keyframes pulse-once {
            0% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.05);
            }

            100% {
                transform: scale(1);
            }
        }

        .highlight-call {
            animation: highlight 10s ease-in-out;
        }

        @keyframes highlight {
            0% {
                background-color: rgba(99, 102, 241, 0.1);
            }

            100% {
                background-color: transparent;
            }
        }

        .status-badge {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-called {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status-waiting {
            background-color: #fef3c7;
            color: #92400e;
        }

        .status-missed {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .status-completed {
            background-color: #dbeafe;
            color: #1e40af;
        }

        .blink {
            animation: blink-animation 1s steps(2, start) infinite;
        }

        @keyframes blink-animation {
            to {
                visibility: hidden;
            }
        }
    </style>
</head>

<body class="antialiased">
    <div class="container mx-auto p-4 lg:p-8">

        <header class="flex justify-between items-center mb-6">
            <img id="logo" src="../logo_monaros_sinbg_light.png" alt="medical" style="width: 150px; height: auto" class="align-self-start" onerror="this.onerror=null;this.src='https://placehold.co/150x50/132030/ffffff?text=Monaros';">

            <div id="clock" class="text-right">
                <div class="flex gap-2 items-center justify-end text-xl md:text-2xl font-semibold text-gray-700">
                    <i class="far fa-clock"></i>
                    <span id="time"></span>
                </div>
                <div class="text-sm md:text-base text-gray-500 font-medium">
                    <strong id="date"></strong>
                </div>
            </div>
        </header>

        <main>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                <div class="lg:col-span-2 bg-white rounded-xl card-shadow">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">LLAMANDO ACTUALMENTE</h2>
                    </div>
                    <div id="currently-calling-container" class="text-center p-6 md:p-8 min-h-[300px] flex items-center justify-center">
                        <div class="text-gray-400">
                            <i class="fas fa-user-clock fa-4x mb-4"></i>
                            <p class="text-2xl">Esperando próximo turno</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl card-shadow">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-lg lg:text-xl font-bold text-white text-center">PRÓXIMOS TURNOS</h2>
                    </div>
                    <div id="queue-container" class="p-4 space-y-3">
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-list-ol fa-2x mb-2"></i>
                            <p>No hay turnos en espera</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl card-shadow mb-8">
                <div class="brand-bg p-4 rounded-t-xl">
                    <h2 class="text-xl lg:text-2xl font-bold text-white text-center">TURNOS PERDIDOS</h2>
                </div>
                <div id="recent-calls-container" class="p-4">
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay historial reciente</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl card-shadow h-full flex flex-col">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">Turnos en Módulo</h2>
                    </div>
                    <div class="p-4 flex-grow">
                        <table class="w-full text-left">
                            <thead class="border-b-2 border-gray-200">
                                <tr>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Turno</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Paciente</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Módulo</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="pending-body">
                                <tr>
                                    <td colspan="4" class="text-center text-gray-500 py-4">Cargando...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white rounded-xl card-shadow h-full flex flex-col">
                    <div class="brand-bg p-4 rounded-t-xl">
                        <h2 class="text-xl lg:text-2xl font-bold text-white text-center">Pacientes en Consultorio</h2>
                    </div>
                    <div class="p-4 flex-grow">
                        <table class="w-full text-left">
                            <thead class="border-b-2 border-gray-200">
                                <tr>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Paciente</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Consultorio #</th>
                                    <th class="py-2 px-4 text-lg font-semibold text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="waiting-body">
                                <tr>
                                    <td colspan="3" class="text-center text-gray-500 py-4">Cargando...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script type="module">
        import {
            admissionService,
            moduleService,
            ticketService,
            appointmentStateService,
            infoCompanyService
        } from "./services/api/index.js";
        import {
            callTicket,
            callPatientToOffice
        } from './services/voiceAnnouncer.js';

        const waitingBody = document.getElementById("waiting-body");
        const pendingBody = document.getElementById("pending-body");
        const timeEl = document.getElementById('time');
        const dateEl = document.getElementById('date');
        const currentlyCallingContainer = document.getElementById('currently-calling-container');
        const queueContainer = document.getElementById('queue-container');
        const recentCallsContainer = document.getElementById('recent-calls-container');

        let currentCall = null;
        let callQueue = [];
        let recentCalls = [];
        let missedTickets = [];
        let callTimer = null;
        let missedTicketsTimer = null;
        let currentMissedTicketsPage = 0;
        let isCalling = false;
        let isVoiceAnnouncing = false;

        let appointments = [];
        let tickets = [];
        let modules = [];
        let appointmentStates = [];
        let company = {};

        let processedTickets = new Set();
        let processedAppointments = new Set();

        // Variables para el refresco automático
        let lastActivityTime = Date.now();
        let autoRefreshInterval = null;
        const INACTIVITY_TIME = 30000;
        const REFRESH_INTERVAL = 10000;

        // Constantes para tiempos de llamada
        const VOICE_ANNOUNCEMENT_TIME = 15000; // 15 segundos para anuncio de voz
        const MINIMUM_CALL_DURATION = 20000; // 20 segundos mínimo entre llamados
        const CALL_CHECK_INTERVAL = 3000; // Revisar estado cada 3 segundos
        const REPEAT_CALL_INTERVAL = 20000; // Repetir llamada cada 20 segundos si sigue en "called" <- NUEVO
        const MAX_CALL_REPEATS = 3; // Máximo de repeticiones <- NUEVO

        class WaitingRoomManager {
            constructor() {
                this.isInitialized = false;
                this.lastCallTime = 0;
                this.currentCallStartTime = 0;
                this.callRepeatCount = 0; // Contador de repeticiones <- NUEVO
                this.callRepeatTimer = null; // Timer para repeticiones <- NUEVO
                this.activeCallId = null; // ID único de la llamada activa <- NUEVO
            }

            async initialize() {
                try {
                    [appointmentStates, modules, tickets, company] = await Promise.all([
                        appointmentStateService.getAll().catch(e => {
                            console.error("Error loading states:", e);
                            return [];
                        }),
                        moduleService.active().catch(e => {
                            console.error("Error loading modules:", e);
                            return [];
                        }),
                        ticketService.getTicketsToday().catch(e => {
                            console.error("Error loading tickets:", e);
                            return [];
                        }),
                        infoCompanyService.getCompany().catch(e => {
                            console.error("Error loading company:", e);
                            return [];
                        })
                    ]);

                    document.getElementById("logo").src = company.data[0].attributes.logo_minio_url;

                    try {
                        const appointmentsData = await admissionService.getAdmisionsAll();
                        appointments = appointmentsData.filter(appointment => {
                            const today = new Date().toISOString().split('T')[0];
                            return appointment.user_availability?.appointment_type_id === 1 &&
                                appointment.appointment_date === today;
                        });
                    } catch (error) {
                        console.error("Error loading appointments:", error);
                        appointments = [];
                    }

                    this.isInitialized = true;
                    this.updateAllDisplays();
                    this.initializePusher();
                    this.startAutoRefresh();

                } catch (error) {
                    console.error("❌ Error crítico inicializando datos:", error);
                    this.showErrorState();
                }
            }

            // Nueva función para refresco automático
            startAutoRefresh() {
                // Detectar actividad del usuario
                const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
                activityEvents.forEach(event => {
                    document.addEventListener(event, () => {
                        lastActivityTime = Date.now();
                        this.stopAutoRefresh();
                    });
                });

                // Verificar inactividad cada 5 segundos
                setInterval(() => {
                    const timeSinceLastActivity = Date.now() - lastActivityTime;
                    if (timeSinceLastActivity > INACTIVITY_TIME && !autoRefreshInterval) {
                        console.log("🔄 Inactividad detectada, iniciando refresco automático...");
                        this.startRefreshCycle();
                    }
                }, 5000);
            }

            startRefreshCycle() {
                if (autoRefreshInterval) return;

                autoRefreshInterval = setInterval(async () => {
                    // Verificar si hay actividad reciente
                    const timeSinceLastActivity = Date.now() - lastActivityTime;
                    if (timeSinceLastActivity < INACTIVITY_TIME) {
                        console.log("🔄 Actividad detectada, deteniendo refresco automático");
                        this.stopAutoRefresh();
                        return;
                    }

                    console.log("🔄 Refrescando datos automáticamente...");
                    await this.refreshData();
                }, REFRESH_INTERVAL);
            }

            stopAutoRefresh() {
                if (autoRefreshInterval) {
                    clearInterval(autoRefreshInterval);
                    autoRefreshInterval = null;
                    console.log("⏹️ Refresco automático detenido");
                }
            }

            async refreshData() {
                try {
                    // Refrescar tickets
                    const newTickets = await ticketService.getTicketsToday();
                    tickets = newTickets;

                    // Refrescar citas
                    const appointmentsData = await admissionService.getAdmisionsAll();
                    appointments = appointmentsData.filter(appointment => {
                        const today = new Date().toISOString().split('T')[0];
                        return appointment.user_availability?.appointment_type_id === 1 &&
                            appointment.appointment_date === today;
                    });

                    // Actualizar todas las pantallas
                    this.updateAllDisplays();
                    this.processExistingCalls();

                    console.log("✅ Datos refrescados exitosamente");

                } catch (error) {
                    console.error("❌ Error refrescando datos:", error);
                }
            }

            showErrorState() {
                pendingBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-500 py-4">Error cargando datos</td></tr>`;
                waitingBody.innerHTML = `<tr><td colspan="3" class="text-center text-red-500 py-4">Error cargando datos</td></tr>`;
            }

            updateAllDisplays() {
                this.updateTicketTable();
                this.updateAppointmentTable();
                this.updateQueueDisplay();
                this.updateMissedTicketsDisplay();
                this.processExistingCalls();
            }

            updateTicketTable() {
                const activeTickets = tickets.filter(ticket => ["CALLED", "WAITING", "IN_PROGRESS"].includes(ticket.status));

                if (activeTickets.length === 0) {
                    pendingBody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-500 py-4">No hay turnos activos</td></tr>`;
                    return;
                }

                let html = '';
                activeTickets.forEach(ticket => {
                    const moduleInfo = modules.find(module => module.id == ticket.module_id);
                    const statusClass = this.getStatusClass(ticket.status);
                    const statusText = this.getStatusText(ticket.status);

                    html += `
                    <tr class="border-b border-gray-100 text-lg">
                        <td class="py-3 px-4 font-bold text-indigo-600">${ticket.ticket_number || 'N/A'}</td>
                        <td class="py-3 px-4 text-gray-700">${ticket.patient_name || 'Paciente no especificado'}</td>
                        <td class="py-3 px-4 font-semibold text-gray-800">${moduleInfo?.name || 'Módulo desconocido'}</td>
                        <td class="py-3 px-4"><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
                });

                pendingBody.innerHTML = html;
            }

            updateAppointmentTable() {
                const activeAppointments = appointments.filter(appointment => ['called', 'waiting', 'in_progress', 'in_consultation'].includes(appointment.appointment_state?.name));

                if (activeAppointments.length === 0) {
                    waitingBody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500 py-4">No hay pacientes en consultorio</td></tr>`;
                    return;
                }

                waitingBody.innerHTML = activeAppointments.map(appointment => {
                    const statusClass = this.getStatusClass(appointment.appointment_state?.name);
                    const statusText = this.getStatusText(appointment.appointment_state?.name);

                    return `
                    <tr class="border-b border-gray-100 text-lg">
                        <td class="py-3 px-4 text-gray-700">
                            ${appointment.patient?.first_name || ''} 
                            ${appointment.patient?.middle_name || ''} 
                            ${appointment.patient?.last_name || ''} 
                            ${appointment.patient?.second_last_name || ''}
                        </td>
                        <td class="py-3 px-4 font-bold text-indigo-600 text-center">
                            ${appointment.user_availability?.office || '--'}
                        </td>
                        <td class="py-3 px-4"><span class="status-badge ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
                }).join('');
            }

            getStatusClass(status) {
                const statusMap = {
                    'CALLED': 'status-called',
                    'called': 'status-called',
                    'WAITING': 'status-waiting',
                    'waiting': 'status-waiting',
                    'MISSED': 'status-missed',
                    'EXPIRED': 'status-missed',
                    'LOST': 'status-missed',
                    'COMPLETED': 'status-completed',
                    'completed': 'status-completed',
                    'IN_PROGRESS': 'status-waiting',
                    'in_progress': 'status-waiting',
                    'IN_CONSULTATION': 'status-waiting',
                    'in_consultation': 'status-waiting'
                };
                return statusMap[status] || 'status-waiting';
            }

            getStatusText(status) {
                const textMap = {
                    'CALLED': 'Llamando',
                    'called': 'Llamando',
                    'WAITING': 'En espera',
                    'waiting': 'En espera',
                    'MISSED': 'Perdido',
                    'EXPIRED': 'Expirado',
                    'LOST': 'Perdido',
                    'COMPLETED': 'Completado',
                    'completed': 'Completado',
                    'IN_PROGRESS': 'En progreso',
                    'in_progress': 'En progreso',
                    'IN_CONSULTATION': 'En consulta',
                    'in_consultation': 'En consulta'
                };
                return textMap[status] || status;
            }

            updateQueueDisplay() {
                if (callQueue.length === 0) {
                    queueContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-list-ol fa-2x mb-2"></i>
                        <p>No hay turnos en espera</p>
                    </div>
                `;
                    return;
                }

                queueContainer.innerHTML = callQueue.map((item, index) => `
                <div class="bg-gray-50 rounded-lg p-3 border-l-4 ${index === 0 ? 'border-yellow-400' : 'border-gray-300'}">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-lg text-gray-700">${item.type === 'ticket' ? item.ticket.ticket_number : 'Cita'}</span>
                        <span class="text-sm text-gray-500">#${index + 1}</span>
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        ${item.type === 'ticket' ? 
                          (item.ticket.patient_name || 'Paciente') : 
                          `${item.appointment.patient?.first_name || ''} ${item.appointment.patient?.last_name || ''}`
                        }
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                        ${item.type === 'ticket' ? 
                          `Módulo ${item.moduleName}` : 
                          `Consultorio ${item.appointment.user_availability?.office || '--'}`
                        }
                    </div>
                    <div class="text-xs text-blue-400 mt-1">
                        Estado: ${item.type === 'ticket' ? this.getStatusText(item.ticket.status) : this.getStatusText(item.appointment.appointment_state?.name)}
                    </div>
                </div>
            `).join('');
            }

            updateCurrentlyCallingDisplay(callData) {
                if (!callData) {
                    currentlyCallingContainer.innerHTML = `
                    <div class="text-center text-gray-400">
                        <i class="fas fa-user-clock fa-4x mb-4"></i>
                        <p class="text-2xl">Esperando próximo turno</p>
                    </div>
                `;
                    return;
                }

                let content = '';
                if (callData.type === 'ticket') {
                    content = `
                    <div class="animate-pulse-once">
                        <div class="blink text-yellow-500 mb-2">
                            <i class="fas fa-bell fa-lg"></i> LLAMANDO
                        </div>
                        <p class="text-5xl md:text-7xl font-black text-indigo-600 mb-2">${callData.ticket.ticket_number}</p>
                        <p class="text-2xl md:text-4xl text-gray-600 mb-4">${callData.ticket.patient_name || 'Paciente'}</p>
                        <p class="text-3xl md:text-5xl font-bold text-gray-800">
                            <i class="fas fa-door-open mr-2"></i> Módulo ${callData.moduleName}
                        </p>
                        <div class="mt-6 text-lg text-gray-500">
                            <i class="fas fa-volume-up mr-2"></i>Diríjase al módulo indicado
                        </div>
                    </div>
                `;
                } else {
                    content = `
                    <div class="animate-pulse-once">
                        <div class="blink text-yellow-500 mb-2">
                            <i class="fas fa-bell fa-lg"></i> LLAMANDO
                        </div>
                        <p class="text-4xl md:text-6xl font-black text-indigo-600 mb-2">
                            ${callData.appointment.patient?.first_name || ''} ${callData.appointment.patient?.last_name || 'Paciente'}
                        </p>
                        <p class="text-2xl md:text-4xl text-gray-600 mb-4">Pase al consultorio</p>
                        <p class="text-5xl md:text-7xl font-bold text-gray-800">
                            <i class="fas fa-clinic-medical mr-2"></i> ${callData.appointment.user_availability?.office || '--'}
                        </p>
                        <div class="mt-6 text-lg text-gray-500">
                            <i class="fas fa-volume-up mr-2"></i>Su médico lo está esperando
                        </div>
                    </div>
                `;
                }

                currentlyCallingContainer.innerHTML = content;
            }

            updateMissedTicketsDisplay() {
                const missedTicketsList = tickets.filter(ticket => ["MISSED", "EXPIRED", "LOST"].includes(ticket.status));

                missedTickets = missedTicketsList;
                this.startMissedTicketsRotation();
            }

            startMissedTicketsRotation() {
                if (missedTicketsTimer) {
                    clearInterval(missedTicketsTimer);
                }

                if (missedTickets.length === 0) {
                    recentCallsContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay turnos perdidos</p>
                    </div>
                `;
                    return;
                }

                this.showMissedTicketsPage(0);

                missedTicketsTimer = setInterval(() => {
                    currentMissedTicketsPage++;
                    const totalPages = Math.ceil(missedTickets.length / 3);

                    if (currentMissedTicketsPage >= totalPages) {
                        currentMissedTicketsPage = 0;
                    }

                    this.showMissedTicketsPage(currentMissedTicketsPage);
                }, 5000);
            }

            showMissedTicketsPage(page) {
                const startIndex = page * 3;
                const endIndex = startIndex + 3;
                const currentPageTickets = missedTickets.slice(startIndex, endIndex);
                const totalPages = Math.ceil(missedTickets.length / 3);

                if (currentPageTickets.length === 0) {
                    recentCallsContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-6">
                        <i class="fas fa-history fa-2x mb-2"></i>
                        <p>No hay turnos perdidos</p>
                    </div>
                `;
                    return;
                }

                recentCallsContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${currentPageTickets.map(ticket => `
                        <div class="bg-red-50 rounded-lg p-3 border border-red-200 animate-fade-in">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-bold text-red-700">${ticket.ticket_number || 'N/A'}</span>
                                <span class="text-xs text-red-500">
                                    <i class="fas fa-exclamation-triangle mr-1"></i>Perdido
                                </span>
                            </div>
                            <div class="text-sm text-red-600">
                                ${ticket.patient_name || 'Paciente no especificado'}
                            </div>
                            <div class="text-xs text-red-400 mt-1">
                                Módulo ${modules.find(m => m.id == ticket.module_id)?.name || 'Desconocido'}
                            </div>
                            <div class="text-xs text-red-300 mt-1">
                                ${this.formatTime(ticket.updated_at || ticket.created_at)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${totalPages > 1 ? `
                    <div class="mt-4 text-center">
                        <div class="flex justify-center space-x-2">
                            ${Array.from({length: totalPages}, (_, i) => `
                                <span class="w-2 h-2 rounded-full ${i === page ? 'bg-red-500' : 'bg-red-200'}"></span>
                            `).join('')
        } <
        /div> < /
        div >
            ` : ''}
            `;
        }

        processExistingCalls() {
            tickets.forEach(ticket => {
                if (!processedTickets.has(ticket.id)) {
                    this.handleTicketUpdate(ticket);
                    processedTickets.add(ticket.id);
                }
            });
            appointments.forEach(appointment => {
                if (!processedAppointments.has(appointment.id)) {
                    this.handleAppointmentUpdate(appointment);
                    processedAppointments.add(appointment.id);
                }
            });

            // Solo procesar cola si no está en llamada actual
            if (!isCalling) {
                setTimeout(() => this.processCallQueue(), 1000);
            }
        }

        // ... (otros métodos permanecen igual hasta handleTicketUpdate y handleAppointmentUpdate) ...

        handleTicketUpdate(ticket) {
            const moduleInfo = modules.find(module => module.id == ticket.module_id);
            const ticketId = `ticket_${ticket.id}`;

            // Verificar si es la misma llamada actual
            if (currentCall && currentCall.type === 'ticket' && currentCall.ticket.id === ticket.id) {
                // Si cambió de estado, limpiar
                if (ticket.status !== "called" && ticket.status !== "CALLED") {
                    console.log(`🔄 Estado cambiado para ticket ${ticket.ticket_number}, limpiando llamada`);
                    this.clearCurrentCall();
                    return;
                }

                // Si sigue en "called", verificar si necesita repetición
                if (ticket.status === "called" || ticket.status === "CALLED") {
                    console.log(`✅ Ticket ${ticket.ticket_number} sigue en estado "called"`);
                    return;
                }
            }

            // Si el ticket está en estado "called", agregar a la cola o procesar
            if (ticket.status === "called" || ticket.status === "CALLED") {
                const callData = {
                    type: 'ticket',
                    ticket,
                    moduleName: moduleInfo?.name || 'Desconocido',
                    timestamp: new Date().toISOString(),
                    callId: ticketId // Agregar ID único
                };

                // Verificar si ya está en la cola
                const inQueue = callQueue.some(item =>
                    item.type === 'ticket' && item.ticket.id === ticket.id
                );

                if (!inQueue) {
                    console.log(`📝 Agregando ticket ${ticket.ticket_number} a la cola`);
                    this.addToQueue(callData);

                    // Si no hay llamada en curso, procesar la cola
                    if (!isCalling) {
                        setTimeout(() => this.processCallQueue(), 1000);
                    }
                }
            }

            this.updateTicketTable();
            this.updateMissedTicketsDisplay();
        }

        handleAppointmentUpdate(appointment) {
            const appointmentId = `appointment_${appointment.id}`;

            // Verificar si es la misma llamada actual
            if (currentCall && currentCall.type === 'appointment' && currentCall.appointment.id === appointment.id) {
                // Si cambió de estado, limpiar
                if (appointment.appointment_state?.name !== 'called') {
                    console.log(`🔄 Estado cambiado para cita ${appointment.id}, limpiando llamada`);
                    this.clearCurrentCall();
                    return;
                }

                // Si sigue en "called", verificar si necesita repetición
                if (appointment.appointment_state?.name === 'called') {
                    console.log(`✅ Cita ${appointment.id} sigue en estado "called"`);
                    return;
                }
            }

            // Si la cita está en estado "called", agregar a la cola o procesar
            if (appointment.appointment_state?.name === 'called') {
                const callData = {
                    type: 'appointment',
                    appointment,
                    timestamp: new Date().toISOString(),
                    callId: appointmentId // Agregar ID único
                };

                // Verificar si ya está en la cola
                const inQueue = callQueue.some(item =>
                    item.type === 'appointment' && item.appointment.id === appointment.id
                );

                if (!inQueue) {
                    console.log(`📝 Agregando cita ${appointment.id} a la cola`);
                    this.addToQueue(callData);

                    // Si no hay llamada en curso, procesar la cola
                    if (!isCalling) {
                        setTimeout(() => this.processCallQueue(), 1000);
                    }
                }
            }

            this.updateAppointmentTable();
        }

        addToQueue(callData) {
            // Verificar si ya existe en la cola
            const existingIndex = callQueue.findIndex(item => {
                if (item.type === 'ticket' && callData.type === 'ticket') {
                    return item.ticket.id === callData.ticket.id;
                }
                if (item.type === 'appointment' && callData.type === 'appointment') {
                    return item.appointment.id === callData.appointment.id;
                }
                return false;
            });

            if (existingIndex !== -1) {
                // Actualizar timestamp
                callQueue[existingIndex] = {
                    ...callData,
                    timestamp: new Date().toISOString()
                };
                console.log(`🔄 Actualizando timestamp en cola: ${callData.callId}`);
            } else {
                // Agregar nuevo elemento
                callQueue.push({
                    ...callData,
                    timestamp: new Date().toISOString()
                });
                console.log(`📌 Agregado a cola: ${callData.callId}`);
            }

            // Ordenar por timestamp
            callQueue.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            this.updateQueueDisplay();
        }

        processCallQueue() {
            if (isCalling) {
                console.log("⏳ Ya se está realizando una llamada, esperando...");
                return;
            }

            // Verificar tiempo mínimo entre llamadas
            const timeSinceLastCall = Date.now() - this.lastCallTime;
            if (timeSinceLastCall < MINIMUM_CALL_DURATION) {
                const remaining = Math.ceil((MINIMUM_CALL_DURATION - timeSinceLastCall) / 1000);
                console.log(`⏳ Esperando tiempo mínimo entre llamadas: ${remaining}s restantes`);
                setTimeout(() => this.processCallQueue(), 1000);
                return;
            }

            if (callQueue.length === 0) {
                console.log("📭 Cola vacía, no hay llamadas pendientes");
                return;
            }

            const nextCall = callQueue[0];

            // Verificar si el estado sigue siendo "called"
            let isValidState = false;
            if (nextCall.type === 'ticket') {
                // Buscar el ticket actualizado
                const currentTicket = tickets.find(t => t.id === nextCall.ticket.id);
                isValidState = currentTicket &&
                    (currentTicket.status === "called" || currentTicket.status === "CALLED");

                if (!isValidState) {
                    console.log(`🗑️ Ticket ${nextCall.ticket.ticket_number} ya no está en estado "called", removiendo de cola`);
                }
            } else {
                // Buscar la cita actualizada
                const currentAppointment = appointments.find(a => a.id === nextCall.appointment.id);
                isValidState = currentAppointment &&
                    currentAppointment.appointment_state?.name === "called";

                if (!isValidState) {
                    console.log(`🗑️ Cita ${nextCall.appointment.id} ya no está en estado "called", removiendo de cola`);
                }
            }

            if (!isValidState) {
                // Remover de la cola
                callQueue.shift();
                this.updateQueueDisplay();
                setTimeout(() => this.processCallQueue(), 500);
                return;
            }

            // Verificar que no haya anuncio de voz en curso
            if (isVoiceAnnouncing) {
                console.log("🎤 Anuncio de voz en curso, esperando...");
                setTimeout(() => this.processCallQueue(), 1000);
                return;
            }

            const calledItem = callQueue.shift();
            this.setCurrentCall(calledItem);
            this.updateQueueDisplay();
        }

        setCurrentCall(callData) {
            // Generar ID único para esta llamada
            this.activeCallId = Date.now();
            this.callRepeatCount = 0; // Resetear contador de repeticiones

            isCalling = true;
            this.currentCallStartTime = Date.now();
            this.lastCallTime = Date.now();
            currentCall = callData;

            // Actualizar display
            this.updateCurrentlyCallingDisplay(currentCall);

            // Marcar que se está realizando anuncio de voz
            isVoiceAnnouncing = true;

            // Realizar la llamada por voz
            if (callData.type === 'ticket') {
                callTicket({
                    nombre: callData.ticket.patient_name || 'Paciente',
                    turno: callData.ticket.ticket_number,
                    modulo: callData.moduleName
                }).catch(error => {
                    console.error("❌ Error llamando ticket:", error);
                    isVoiceAnnouncing = false;
                });
            } else {
                callPatientToOffice({
                    nombre: `${callData.appointment.patient?.first_name || ''} ${callData.appointment.patient?.last_name || ''}`,
                    office: callData.appointment.user_availability?.office || 'Consultorio'
                }).catch(error => {
                    console.error("❌ Error llamando paciente:", error);
                    isVoiceAnnouncing = false;
                });
            }

            // Marcar como terminado el anuncio de voz después del tiempo estimado
            setTimeout(() => {
                isVoiceAnnouncing = false;
                console.log("✅ Anuncio de voz completado");

                // Programar repetición después de que termine el anuncio
                this.scheduleCallRepeat();
            }, VOICE_ANNOUNCEMENT_TIME);

            // Iniciar verificación periódica del estado
            if (callTimer) clearInterval(callTimer);
            callTimer = setInterval(() => this.verifyCallStatus(), CALL_CHECK_INTERVAL);

            console.log(`📢 Iniciando llamada: ${callData.type === 'ticket' ? 
            `Ticket ${callData.ticket.ticket_number}` : 
            `Cita ${callData.appointment.id}`}`);
        }

        // NUEVO: Programar repetición de la llamada
        scheduleCallRepeat() {
            // Limpiar timer anterior si existe
            if (this.callRepeatTimer) {
                clearTimeout(this.callRepeatTimer);
                this.callRepeatTimer = null;
            }

            // Verificar si aún es la misma llamada
            if (!currentCall || !isCalling) {
                return;
            }

            // Incrementar contador de repeticiones
            this.callRepeatCount++;

            // Verificar si hemos alcanzado el máximo de repeticiones
            if (this.callRepeatCount >= MAX_CALL_REPEATS) {
                console.log(`🛑 Máximo de repeticiones alcanzado (${MAX_CALL_REPEATS}) para llamada actual`);
                this.clearCurrentCall();
                return;
            }

            console.log(`🔄 Programando repetición ${this.callRepeatCount}/${MAX_CALL_REPEATS} en ${REPEAT_CALL_INTERVAL/1000} segundos`);

            // Programar repetición
            this.callRepeatTimer = setTimeout(() => {
                this.repeatCurrentCall();
            }, REPEAT_CALL_INTERVAL);
        }

        // NUEVO: Repetir la llamada actual
        repeatCurrentCall() {
            if (!currentCall || !isCalling) {
                return;
            }

            console.log(`🔁 Repitiendo llamada (${this.callRepeatCount}/${MAX_CALL_REPEATS})`);

            // Verificar que el estado siga siendo "called"
            let shouldRepeat = false;

            if (currentCall.type === 'ticket') {
                const currentTicket = tickets.find(t => t.id === currentCall.ticket.id);
                shouldRepeat = currentTicket &&
                    (currentTicket.status === "called" || currentTicket.status === "CALLED");
            } else {
                const currentAppointment = appointments.find(a => a.id === currentCall.appointment.id);
                shouldRepeat = currentAppointment &&
                    currentAppointment.appointment_state?.name === "called";
            }

            if (!shouldRepeat) {
                console.log("🛑 No repetir: estado ya no es 'called'");
                this.clearCurrentCall();
                return;
            }

            // Verificar que no haya anuncio de voz en curso
            if (isVoiceAnnouncing) {
                console.log("🎤 Anuncio de voz en curso, posponiendo repetición");
                this.scheduleCallRepeat();
                return;
            }

            // Realizar la repetición
            isVoiceAnnouncing = true;

            if (currentCall.type === 'ticket') {
                callTicket({
                    nombre: currentCall.ticket.patient_name || 'Paciente',
                    turno: currentCall.ticket.ticket_number,
                    modulo: currentCall.moduleName
                }).catch(error => {
                    console.error("❌ Error repitiendo ticket:", error);
                    isVoiceAnnouncing = false;
                });
            } else {
                callPatientToOffice({
                    nombre: `${currentCall.appointment.patient?.first_name || ''} ${currentCall.appointment.patient?.last_name || ''}`,
                    office: currentCall.appointment.user_availability?.office || 'Consultorio'
                }).catch(error => {
                    console.error("❌ Error repitiendo paciente:", error);
                    isVoiceAnnouncing = false;
                });
            }

            // Programar siguiente repetición
            setTimeout(() => {
                isVoiceAnnouncing = false;
                console.log("✅ Repetición completada");
                this.scheduleCallRepeat();
            }, VOICE_ANNOUNCEMENT_TIME);
        }

        clearCurrentCall() {
            // Limpiar todos los timers
            if (callTimer) {
                clearInterval(callTimer);
                callTimer = null;
            }

            if (this.callRepeatTimer) {
                clearTimeout(this.callRepeatTimer);
                this.callRepeatTimer = null;
            }

            // Resetear variables
            currentCall = null;
            isCalling = false;
            this.activeCallId = null;
            this.callRepeatCount = 0;

            // Actualizar display
            this.updateCurrentlyCallingDisplay(null);

            console.log("🔄 Llamada actual limpiada");

            // Esperar un momento antes de procesar la siguiente llamada
            setTimeout(() => this.processCallQueue(), 2000);
        }

        async verifyCallStatus() {
            if (!currentCall) {
                this.clearCurrentCall();
                return;
            }

            try {
                let currentStatus;
                let itemId;
                let itemIdentifier;

                if (currentCall.type === 'ticket') {
                    const updatedTicket = tickets.find(t => t.id === currentCall.ticket.id);
                    currentStatus = updatedTicket ? updatedTicket.status : currentCall.ticket.status;
                    itemId = currentCall.ticket.id;
                    itemIdentifier = `Ticket ${currentCall.ticket.ticket_number}`;
                } else {
                    const updatedAppointment = appointments.find(a => a.id === currentCall.appointment.id);
                    currentStatus = updatedAppointment ? updatedAppointment.appointment_state?.name : currentCall.appointment.appointment_state?.name;
                    itemId = currentCall.appointment.id;
                    itemIdentifier = `Cita ${currentCall.appointment.id}`;
                }

                // Estados que indican que la llamada debe terminar
                const terminalStates = [
                    "missed", "MISSED",
                    "completed", "COMPLETED",
                    "in_progress", "IN_PROGRESS",
                    "in_consultation", "IN_CONSULTATION",
                    "waiting", "WAITING"
                ];

                // Verificar si el estado actual es terminal
                const shouldEndCall = terminalStates.includes(currentStatus);

                // También verificar si ya no es "called" (pero no terminar inmediatamente si es "waiting")
                const isNoLongerCalled = currentCall.type === 'ticket' ?
                    !["called", "CALLED"].includes(currentStatus) :
                    currentStatus !== "called";

                // Solo terminar si es estado terminal o si lleva tiempo en otro estado
                if (shouldEndCall) {
                    console.log(`🛑 Terminando llamada - ${itemIdentifier} cambió a estado: ${currentStatus}`);

                    // Mover a historial si es necesario
                    if (["missed", "MISSED"].includes(currentStatus)) {
                        if (!missedTickets.some(item =>
                                (item.type === 'ticket' && item.ticket.id === itemId) ||
                                (item.type === 'appointment' && item.appointment.id === itemId)
                            )) {
                            missedTickets.push({
                                ...currentCall,
                                finalStatus: "MISSED",
                                timestamp: new Date().toISOString()
                            });
                            this.updateMissedTicketsDisplay();
                        }
                    }

                    this.clearCurrentCall();
                } else if (isNoLongerCalled) {
                    // Si ya no está en "called" pero no es terminal, verificar después de un tiempo
                    console.log(`⚠️ ${itemIdentifier} ya no está en estado "called" (${currentStatus}), monitoreando...`);
                    // No limpiar inmediatamente, esperar a la próxima verificación
                }

            } catch (error) {
                console.error("❌ Error en verifyCallStatus:", error);
                this.clearCurrentCall();
            }
        }

        formatTime(timestamp) {
            return new Date(timestamp).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        initializePusher() {
            try {
                const pusher = new Pusher('5e57937071269859a439', {
                    cluster: 'us2'
                });

                const hostname = window.location.hostname.split('.')[0];
                const channel = pusher.subscribe(`waiting-room.${hostname}`);
                const channelTickets = pusher.subscribe(`tickets.${hostname}`);

                channel.bind('appointment.state.updated', (data) => {
                    console.log('📡 Evento Pusher - appointment.state.updated:', data);
                    this.handleAppointmentEvent(data);
                });

                channelTickets.bind('ticket.state.updated', (data) => {
                    console.log('📡 Evento Pusher - ticket.state.updated:', data);
                    this.handleTicketEvent(data);
                });

            } catch (error) {
                console.error("❌ Error inicializando Pusher:", error);
            }
        }

        handleAppointmentEvent(data) {
            console.log('📊 Procesando evento de cita:', data);
            console.log(' citas en cache:', appointments);
            console.log('estados en cache:', appointmentStates);


            let appointment = appointments.find(app => app.id == data.appointmentId);

            if (appointment) {
                const newState = appointmentStates.find(state => state.id == data.newState);
                if (newState) {
                    appointment.appointment_state = newState;
                }

                this.handleAppointmentUpdate(appointment);
                this.updateAppointmentTable();
                this.updateQueueDisplay();

                if (currentCall && currentCall.type === 'appointment' && currentCall.appointment.id === appointment.id) {
                    this.updateCurrentlyCallingDisplay(currentCall);
                }
            } else {
                // Si no encontramos la cita, refrescar datos
                console.log('🔄 Cita no encontrada en cache, refrescando...');
                this.refreshData();
            }
        }

        handleTicketEvent(data) {
            console.log('📊 Procesando evento de ticket:', data);

            let ticket = tickets.find(t => t.id == data.ticketId);

            if (ticket) {
                ticket.status = data.newState;
                ticket.module_id = data.moduleId;

                if (data.ticket) {
                    Object.assign(ticket, data.ticket);
                }
            } else if (data.ticket) {
                ticket = data.ticket;
                tickets.push(ticket);
            } else {
                console.warn('⚠️ Evento de ticket sin datos suficientes:', data);
                return;
            }

            this.handleTicketUpdate(ticket);
            this.updateTicketTable();
            this.updateQueueDisplay();
            this.updateMissedTicketsDisplay();

            if (currentCall && currentCall.type === 'ticket' && currentCall.ticket.id === ticket.id) {
                this.updateCurrentlyCallingDisplay(currentCall);
            }

            processedTickets.add(ticket.id);
        }
        }

        const waitingRoom = new WaitingRoomManager();

        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            const dateString = now.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (timeEl) timeEl.textContent = timeString;
            if (dateEl) dateEl.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        }

        document.addEventListener('DOMContentLoaded', function() {
            updateTime();
            setInterval(updateTime, 1000);
            waitingRoom.initialize();
        });
    </script>
</body>

</html>
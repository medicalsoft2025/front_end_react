// // =======================
// // IMPORTACIONES
// // =======================
// import { farmaciaService } from "../../services/api/index.js";

// // =======================
// // UTILIDADES
// // =======================
// export function aPesos(valor) {
//     return new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     }).format(valor);
// }

// // =======================
// // VARIABLES GLOBALES
// // =======================
// let allRecipes = []; // Guardar todas las recetas
// let verifiedProducts = []; // Guardar los productos verificados con su id y cantidad
// let currentRecipeItems = [];
// let verifiedItems = {}; // clave: recipeId, valor: lista de item IDs verificados


// // =======================
// // FUNCIONES PRINCIPALES
// // =======================

// // Evento principal al cargar el DOM
// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const response = await farmaciaService.getAllRecipes();

//         const farmaciaRecipes = Array.isArray(response) ? response : response?.data || [];

//         if (!Array.isArray(farmaciaRecipes)) {
//             console.error("Error: La API no devolvió un array válido", farmaciaRecipes);
//             return;
//         }

//         allRecipes = farmaciaRecipes;


//         await cargarMedicamentos();
//         renderOrderList(farmaciaRecipes);
//         updatePrescriberInfo(farmaciaRecipes[0]?.prescriber); // Mostrar del primero por defecto

//     } catch (error) {
//         console.error("Error al obtener recetas:", error);
//     }

//     const modalElement = document.getElementById("modalReceta");

//     if (modalElement) {
//         modalElement.addEventListener("shown.bs.modal", () => {
//             mostrarRecetaEnModal(window.recipeItems);
//         });
//     }


//     const filterDropdownItems = document.querySelectorAll('.dropdown-item');
//     const filterDropdownButton = document.getElementById("filterDropdown");

//     filterDropdownItems.forEach(item => {
//         item.addEventListener('click', (e) => {
//             e.preventDefault();
//             const status = item.getAttribute('data-status');
//             const label = item.textContent.trim();

//             const filteredRecipes = status === 'ALL'
//                 ? allRecipes
//                 : allRecipes.filter(recipe => recipe.status === status);

//             renderOrderList(filteredRecipes);

//             // Marcar el filtro activo visualmente
//             filterDropdownItems.forEach(i => i.classList.remove('active'));
//             item.classList.add('active');

//             // Cambiar el texto del botón
//             filterDropdownButton.textContent = `Filtrar: ${label}`;
//         });
//     });

    

//     document.addEventListener('click', function (event) {
//         if (event.target.closest('#viewReceiptBtn')) {
//             const button = event.target.closest('#viewReceiptBtn');
//             const recipeId = button.getAttribute('data-recipe-id');

//             fetch(`https://dev.monaros.co/medical/recipes/${recipeId}`)
//             .then(response => response.json())
//             .then(data => {
//                 const { items, patient, prescriber } = data.data;
        
//                 console.log('Recibo recibido:', data.data);
//                 renderReceiptModal(data.data); // <- si esto es redundante, puedes removerlo
        
//                 const modal = new bootstrap.Modal(document.getElementById('receiptModal'));
//                 modal.show();
        
//                 // Mostrar los datos en el modal correctamente
//                 mostrarRecetaEnModal(items, patient, prescriber);
//             })
//                 .catch(error => {
//                     console.error('Error al obtener el recibo:', error);
//                 });
//         }
//     });


//     const btnCompletarEntrega = document.getElementById("btnCompletarEntrega");

//     btnCompletarEntrega.addEventListener("click", () => {
//         const deliveryCartBody = document.getElementById("deliveryCartBody");
//         const totalPrice = document.getElementById("deliveryTotalPrice");
//         let total = 0;
    
//         // Vaciar la tabla antes de llenarla
//         deliveryCartBody.innerHTML = "";
    
//         // Llenar la tabla con los productos verificados
//         verifiedProducts.forEach(product => {
//             const name = product.name ?? "Desconocido";
//             const quantity = Number(product.quantity) || 0;
//             const price = Number(product.sale_price) || 0;
//             const subtotal = quantity * price;
        
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${name}</td>
//                 <td>${quantity}</td>
//                 <td>$${price.toFixed(2)}</td>
//                 <td>$${subtotal.toFixed(2)}</td>
//             `;
//             deliveryCartBody.appendChild(row);
//             total += subtotal;
//         });
    
//         // Actualizar el precio total
//         totalPrice.textContent = `$${total.toFixed(2)}`;
    
//         // Cargar métodos de pago y luego mostrar el modal
//         cargarMetodosDePago().then(() => {
//             const modal = new bootstrap.Modal(document.getElementById("verifiedDeliveryModal"));
//             modal.show();
//         });
//     });

//     const submitDeliveryBtn = document.getElementById("submitDeliveryBtn");

// submitDeliveryBtn.addEventListener("click", () => {
//     if (!verifiedProducts || verifiedProducts.length === 0) {
//         alert("No hay productos verificados para entregar.");
//         return;
//     }

//     // Crear el array de productos para el JSON
//     const productsPayload = verifiedProducts
//     .filter(p => p.id && p.quantity && !isNaN(p.quantity))  
//     .map(p => ({
//         id: p.id,
//         quantity: Number(p.quantity)
//     }));


//     // Enviar los datos al backend
//     fetch("https://dev.monaros.co/api/v1/admin/pharmacy/sell", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
          
//         },
//         body: JSON.stringify({ products: productsPayload })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Error al entregar el pedido");
//         }
//         return response.json();
//     })
//     .then(data => {
       
//         const modal = bootstrap.Modal.getInstance(document.getElementById("verifiedDeliveryModal"));
//         modal.hide();
//         alert("Pedido entregado exitosamente");
//     })
//     .catch(error => {
//         console.error("Error en la entrega:", error);
//         alert("Ocurrió un error al entregar el pedido.");
//     });
// });

    

// });





// // =======================
// // FUNCIONES DE RENDERIZADO
// // =======================

// function renderOrderList(recipes) {
//     const orderList = document.querySelector(".order-list");

//     if (!orderList) {
//         console.error("Error: No se encontró el contenedor '.order-list'.");
//         return;
//     }

//     orderList.innerHTML = "";

//     recipes.forEach(recipe => {
//         const patientName = formatFullName(recipe.patient);
//         const { class: badgeClass, label: statusLabel } = getStatusBadgeClass(recipe.status);
//         const formattedDate = formatDate(recipe.created_at);

//         const orderItem = document.createElement("div");
//         orderItem.classList.add("order-item", "p-3", "border-bottom");
//         orderItem.dataset.recipeId = recipe.id;
//         orderItem.dataset.patientInfo = JSON.stringify(recipe.patient);

//         orderItem.innerHTML = `
//             <div class="d-flex justify-content-between align-items-start">
//                 <div>
//                     <div class="d-flex align-items-center">
//                         <h6 class="mb-0">Receta #${recipe.id}</h6>
//                         <span class="badge ${badgeClass} ms-2 status-badge">${statusLabel}</span>
//                     </div>
//                     <div class="text-muted small"><strong>Paciente:</strong> <span class="text-dark">${patientName}</span></div>
//                 </div>
//                 <div class="text-end">
//                     <div class="small fw-bold">${formattedDate}</div>
//                 </div>
//             </div>
//         `;

//         // Evento de selección
//         orderItem.addEventListener("click", () => {
//             // Marcar como activa
//             document.querySelectorAll('.order-item').forEach(item => item.classList.remove('active'));
//             orderItem.classList.add('active');

//             // Guardar receta seleccionada
//             window.selectedRecipe = recipe;
//             window.recipeItems = recipe.recipe_items || [];

           

//             updateClientInfo(recipe.patient);
//             renderMedicationTable(recipe.recipe_items);
//             updatePrescriberInfo(recipe.prescriber);
//         });

//         orderList.appendChild(orderItem);
//     });
// }

// async function cargarOpcionesMedicamento() {
//     try {
//         const response = await fetch("https://dev.monaros.co/api/v1/admin/products/medicamentos");
//         const result = await response.json();

//         const select = document.getElementById("medicamentoSelect");
//         select.innerHTML = `<option value="">Buscar medicamento...</option>`; // Limpia el select

//         if (Array.isArray(result)) {
//             result.forEach(producto => {
//                 const option = document.createElement("option");
//                 option.value = producto.id;
//                 option.textContent = producto.name || "Sin nombre";
//                 select.appendChild(option);
//             });

//             if (window.jQuery && $(select).select2) {
//                 $(select).select2({
//                     placeholder: "Buscar medicamento...",
//                     width: "100%"
//                 });
//             }
//         } else {
//             console.warn("Respuesta inesperada:", result);
//         }
//     } catch (error) {
//         console.error("Error al cargar medicamentos:", error);
//     }
// }


// function renderMedicationTable(recipeItems) {
//     currentRecipeItems = recipeItems
//     cargarMedicamentos(recipeItems);
//     const tableBody = document.querySelector(".table tbody");

//     if (!tableBody) {
//         console.error("Error: No se encontró la tabla de medicamentos.");
//         return;
//     }

//     tableBody.innerHTML = "";

//     if (!Array.isArray(recipeItems) || recipeItems.length === 0) {
//         tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay medicamentos en esta receta.</td></tr>`;
//         return;
//     }

//     recipeItems.forEach((item, index) => {
//         const verificationBadge = item.verified
//             ? `<span class="badge bg-success">Verificado</span>`
//             : `<span class="badge bg-secondary">Pendiente</span>`;

//         const verifyButton = item.verified
//             ? `<button class="btn btn-sm btn-outline-primary" disabled><i class="fas fa-check"></i></button>`
//             : `<button class="btn btn-sm btn-primary btn-verificar"
//                     data-name="${item.medication}"
//                     data-concentration="${item.concentration}"
//                     data-item-id="${item.id}">
//                     <i class="fas fa-check me-1"></i> Verificar
//                 </button>`;

//         const row = document.createElement("tr");
//         const medication = item.medication ?? '';
//         const concentration = item.concentration ?? '';
//         const textoMostrar = `${medication} ${concentration}`.trim();

//         row.innerHTML = `
//             <td>
//                 <div class="fw-medium">${textoMostrar || "Desconocido"}</div>
//                 <div class="text-muted small">${item.description || "Sin descripción"}</div>
//             </td>
//             <td>${item.quantity || "N/A"}</td>
//             <td>$${item.price ? item.price.toFixed(2) : "0.00"}</td>
//             <td>${verificationBadge}</td>
//             <td>${verifyButton}</td>
//         `;

//         tableBody.appendChild(row);
//     });

//     document.querySelectorAll(".btn-verificar").forEach(button => {
//         button.addEventListener("click", async () => {

//             const recipeId = document.querySelector(".order-item.active")?.dataset?.recipeId;
//             if (recipeId) {
//                 const itemId = button.getAttribute("data-item-id"); // Obtener el ID del producto
//                 if (!verifiedItems[recipeId]) {
//                     verifiedItems[recipeId] = new Set();
//                 }
//                 verifiedItems[recipeId].add(itemId); // Usar el itemId aquí
//             }
//             const name = button.getAttribute("data-name");
//             let concentration = button.getAttribute("data-concentration");
//             concentration = concentration.replace(/\D/g, '');

//             try {
//                 const response = await fetch(`https://dev.monaros.co/api/v1/admin/products/searchProduct?name=${encodeURIComponent(name)}&concentration=${encodeURIComponent(concentration)}`);
//                 const result = await response.json();

//                 if (Array.isArray(result.data) && result.data.length > 0) {
//                     const product = result.data[0];

                    

//                     // Agregar a verifiedProducts
//                     verifiedProducts.push({
//                         id: product.id,
//                         name: product.attributes.name,
//                         concentration: product.attributes.concentration,
//                         expirationDate: product.attributes.expiration_date,
//                         sale_price: product.attributes.sale_price

//                     });

                   
//                     Swal.fire({
//                         title: 'Producto verificado',
//                         text: 'El medicamento fue verificado correctamente.',
//                         icon: 'success',
//                         timer: 2000,
//                         showConfirmButton: false
//                     });

//                     // Cambiar el badge a "Verificado"
//                     const badgeCell = button.closest('tr').querySelector('td:nth-child(4)');
//                     badgeCell.innerHTML = `<span class="badge bg-success">Verificado</span>`;

//                     // Cambiar el botón a un check deshabilitado
//                     button.outerHTML = `
//                         <button class="btn btn-sm btn-outline-primary" disabled>
//                             <i class="fas fa-check"></i>
//                         </button>
//                     `;

//                 } else {
//                     // Producto no encontrado
//                     const confirmManualSearch = await Swal.fire({
//                         title: 'Producto no encontrado',
//                         text: '¿Desea buscar el producto manualmente?',
//                         icon: 'warning',
//                         showCancelButton: true,
//                         confirmButtonText: 'Sí, buscar manualmente',
//                         cancelButtonText: 'Cancelar'
//                     });

//                     if (confirmManualSearch.isConfirmed) {
//                         const select = document.getElementById("medicamentoSelect");
//                         select.innerHTML = `<option value="">Buscar medicamento...</option>`;
//                         document.getElementById("medicamentoLote").value = "";
//                         document.getElementById("medicamentoFechaVenc").value = "";

//                         await cargarOpcionesMedicamento();

//                         if (window.jQuery && $(select).select2) {
//                             $(select).select2({
//                                 placeholder: "Buscar medicamento...",
//                                 width: "100%"
//                             });
//                         }

//                         document.getElementById("medicamentoNombre").textContent = name || "Sin nombre";
//                         document.getElementById("medicamentoDescripcion").textContent = "Por favor seleccione el medicamento manualmente.";

//                         const modal = new bootstrap.Modal(document.getElementById('verificationModal'));
//                         modal.show();
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error consultando producto:", error);
//                 Swal.fire({
//                     title: 'Error',
//                     text: 'Error al verificar el producto.',
//                     icon: 'error'
//                 });
//             }
//         });
//     });
// }





// document.getElementById("completeDeliveryBtn").addEventListener("click", async () => {
//     // Verificar que haya productos verificados
//     if (verifiedProducts.length === 0) {
//         alert("No se han verificado productos. No puede completar la entrega.");
//         return;
//     }

//     const idCheck = document.getElementById("idCheck").checked;
//     const ageCheck = document.getElementById("ageCheck").checked;
//     const confirmCheck = document.getElementById("confirmCheck").checked;

//     if (!idCheck || !ageCheck || !confirmCheck) {
//         alert("Debe confirmar todos los requisitos.");
//         return;
//     }

//     try {
//         // Enviar los productos verificados al endpoint
//         const response = await fetch('/api/v1/admin/pharmacy/sell', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 products: verifiedProducts,
//                 // Aquí puedes agregar más datos del modal si es necesario
//                 signature: document.getElementById("signaturePad").innerHTML, // Ejemplo
//                 additionalInfo: document.querySelector("textarea").value
//             }),
//         });

//         if (response.ok) {
//             alert("Entrega completada con éxito.");

//         } else {
//             alert("Error al completar la entrega.");
//         }
//     } catch (error) {
//         console.error("Error al completar la entrega:", error);
//         alert("Hubo un error al procesar la entrega.");
//     }
// });


// function mostrarRecetaEnModal(recipeItems, patient = {}, prescriber = {}) {
        

//     const header = document.getElementById("recipeHeader");
//     const container = document.getElementById("recipeContainer");

//     if (!container || !header) {
//         console.error("Error: Contenedores del modal no encontrados.");
//         return;
//     }

//     // --- Header: Info del paciente y prescriptor ---
//     const patientName = `${patient.first_name ?? ""} ${patient.middle_name ?? ""} ${patient.last_name ?? ""} ${patient.second_last_name ?? ""}`.trim();
//     const prescriberName = `${prescriber.first_name ?? ""} ${prescriber.middle_name ?? ""} ${prescriber.last_name ?? ""} ${prescriber.second_last_name ?? ""}`.trim();
//     const specialty = prescriber.specialty?.name ?? "Sin especialidad";

//     header.innerHTML = `
//         <div class="p-3 border rounded bg-white shadow-sm">
//             <div class="d-flex justify-content-between align-items-center mb-2">
//                 <h5 class="mb-0"><i class="bi bi-person-badge me-2 text-primary"></i>${patientName || "Paciente desconocido"}</h5>
//                 <span class="badge bg-info text-dark"><i class="bi bi-activity me-1"></i>${specialty}</span>
//             </div>
//             <div class="text-muted small">
//                 <i class="bi bi-person-vcard me-1"></i>Prescrito por: <strong>${prescriberName || "Desconocido"}</strong>
//             </div>
//         </div>
//     `;

//     // --- Cuerpo: Medicamentos ---
//     if (!Array.isArray(recipeItems) || recipeItems.length === 0) {
//         container.innerHTML = `<p class="text-muted text-center mt-4">No hay medicamentos en esta receta.</p>`;
//         return;
//     }

//     const rows = recipeItems.map(item => {
//         const medicamento = item.medication || "Desconocido";
//         const concentracion = item.concentration || "N/A";
//         const frecuencia = item.frequency || "N/A";
//         const duracion = item.duration ? `${item.duration} días` : "N/A";
//         const tipo = item.medication_type || "N/A";
//         const cadaHoras = item.take_every_hours ? `Cada ${item.take_every_hours}h` : "N/A";
//         const cantidad = item.quantity === 0 ? "N/A" : item.quantity ?? "N/A";
//         const observaciones = item.observations || "Sin observaciones";

//         return `
//             <div class="border rounded p-4 mb-4 shadow-sm bg-light">
//                 <div class="d-flex align-items-center mb-3">
//                     <i class="bi bi-capsule-pill me-2 fs-4 text-primary"></i>
//                     <h5 class="mb-0 fw-semibold">${medicamento} <small class="text-muted fs-6">(${concentracion})</small></h5>
//                 </div>
//                 <ul class="list-unstyled ps-4 mb-2">
//                     <li class="mb-1"><i class="bi bi-clock-history me-2 text-secondary"></i><strong>Frecuencia:</strong> ${frecuencia}</li>
//                     <li class="mb-1"><i class="bi bi-calendar-check me-2 text-secondary"></i><strong>Duración:</strong> ${duracion}</li>
//                     <li class="mb-1"><i class="bi bi-box-seam me-2 text-secondary"></i><strong>Tipo:</strong> ${tipo}</li>
//                     <li class="mb-1"><i class="bi bi-hourglass-split me-2 text-secondary"></i><strong>Intervalo:</strong> ${cadaHoras}</li>
//                     <li class="mb-1"><i class="bi bi-123 me-2 text-secondary"></i><strong>Cantidad:</strong> ${cantidad}</li>
//                 </ul>
//                 <p class="mb-0"><i class="bi bi-chat-left-text me-2 text-secondary"></i><strong>Observaciones:</strong> ${observaciones}</p>
//             </div>
//         `;
//     }).join("");

//     container.innerHTML = rows;
// }


// const modal = new bootstrap.Modal(document.getElementById('verificationModal'));
// mostrarProductosVerificadosEnModal(recipeId);
// modal.show();

// function mostrarProductosVerificadosEnModal(recipeId) {
//     const verifiedIds = verifiedItems[recipeId] || new Set();

//     const itemsVerificados = currentRecipeItems.filter(item => verifiedIds.has(item.id));

//     const contenedor = document.getElementById("contenedorProductosVerificados");
//     contenedor.innerHTML = "";

//     if (itemsVerificados.length === 0) {
//         contenedor.innerHTML = `<p class="text-muted">No hay productos verificados.</p>`;
//         return;
//     }

//     itemsVerificados.forEach(item => {
//         const div = document.createElement("div");
//         div.className = "border rounded p-2 mb-2";
//         div.innerHTML = `
//             <strong>${item.medication || "Desconocido"} ${item.concentration || ""}</strong>
//             <br>
//             <small>${item.description || "Sin descripción"}</small>
//         `;
//         contenedor.appendChild(div);
//     });
// }



// // Asignar evento al botón de abrir receta
// orderItem.addEventListener("click", () => {
//     window.recipeItems = recipe.recipe_items;
//     updateClientInfo(recipe.patient);
//     renderMedicationTable(recipe.recipe_items);
//     updatePrescriberInfo(recipe.prescriber);
// });




// // =======================
// // FUNCIONES AUXILIARES
// // =======================

// function updateClientInfo(patient) {
//     const clientInfoContainer = document.querySelector("#client-info");

//     if (!clientInfoContainer) {
//         console.error("Error: No se encontró el contenedor de cliente.");
//         return;
//     }

//     clientInfoContainer.innerHTML = `
//         <h6 class="card-title">Información del Cliente</h6>
//         <div class="mb-3">
//             <div class="fw-bold">${formatFullName(patient)}</div>
//             <div>${patient.email || "Sin email"}</div>
//             <div>${patient.whatsapp ? `+${patient.whatsapp}` : "Sin whatsapp"}</div>
//         </div>
//     `;
// }

// function updatePrescriberInfo(prescriber) {
//     const nameElement = document.querySelector("#prescriber-name");
//     const specialtyElement = document.querySelector("#prescriber-specialty");
//     const emailElement = document.querySelector("#prescriber-email");
//     const phoneElement = document.querySelector("#prescriber-phone");
//     const addressElement = document.querySelector("#prescriber-address");

//     if (!nameElement || !specialtyElement || !emailElement || !phoneElement || !addressElement) {
//         console.error("Error: No se encontraron los contenedores para la información del prescriptor.");
//         return;
//     }

//     if (!prescriber) {
//         console.error("Error: No se encontró información del prescriptor.");
//         return;
//     }

//     // Actualizar los valores de los elementos con los datos del prescriptor
//     nameElement.textContent = formatFullName(prescriber);
//     specialtyElement.textContent = prescriber.specialty?.name || "Sin especialidad";
//     emailElement.textContent = prescriber.email || "Sin correo electrónico";
//     phoneElement.textContent = prescriber.phone || "Sin teléfono";
//     addressElement.textContent = prescriber.address || "Sin dirección";
// }





// function formatFullName(person) {
//     return `${person.first_name} ${person.last_name}`;
// }

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-MX');
// }

// function getStatusBadgeClass(status) {
//     const statusMap = {
//         PENDING: { class: "bg-warning", label: "Pendiente" },
//         VALIDATED: { class: "bg-success", label: "Validada" },
//         DELIVERED: { class: "bg-success", label: "Entregada" },
//         PARTIALLY_DELIVERED: { class: "bg-info", label: "Parcialmente entregada" },
//         REJECTED: { class: "bg-danger", label: "Rechazada" }
//     };

//     return statusMap[status] || { class: "bg-secondary", label: "Desconocido" };
// }

// async function cargarMedicamentos(recipeItems = []) {
//     const medicationContainer = document.querySelector(".medication-list");

//     if (!medicationContainer) {
//         console.error("Error: No se encontró el contenedor de medicamentos.");
//         return;
//     }

//     if (recipeItems.length === 0) {
//         medicationContainer.innerHTML = "<p>No hay medicamentos para mostrar.</p>";
//         return;
//     }

//     const listItems = recipeItems.map(item => `
//         <div class="col-md-4">
//             <div class="card">
//                 <div class="card-body">
//                     <h6 class="card-title">${item.medication}</h6>
//                     <p class="card-text">${item.description}</p>
//                     <button class="btn btn-outline-primary btn-sm">Ver detalles</button>
//                 </div>
//             </div>
//         </div>
//     `).join('');

//     medicationContainer.innerHTML = listItems;
// }

// //=================
// // FILTROS
// //=================


// // Función que se ejecutará al abrir el modal



// function renderReceiptModal(recipe) {
//     const modalBody = document.querySelector("#receiptModal .modal-body");

//     if (!modalBody) {
//         console.error("Error: No se encontró el contenedor del modal.");
//         return;
//     }

//     // Información del paciente
//     const patientName = `${recipe.patient.first_name} ${recipe.patient.middle_name || ''} ${recipe.patient.last_name} ${recipe.patient.second_last_name || ''}`;
//     const patientPhone = recipe.patient.whatsapp;

//     // Información del pedido
//     const orderId = recipe.id;
//     const orderDate = formatDate(recipe.created_at);

//     // Producto y precios
//     let subtotal = 0;
//     const itemsHTML = recipe.recipe_items.map(item => {
//         const itemSubtotal = item.quantity * 100;
//         subtotal += itemSubtotal;

//         return `
//             <div class="d-flex justify-content-between mt-2">
//                 <span>${item.medication} ${item.concentration}</span>
//                 <span>$${itemSubtotal.toFixed(2)}</span>
//             </div>
//             <div class="small text-muted">${item.quantity} x $${itemSubtotal.toFixed(2)}</div>
//         `;
//     }).join("");

//     const taxes = (subtotal * 0.10).toFixed(2);
//     const discount = 0.00;
//     const total = (subtotal + parseFloat(taxes) - discount).toFixed(2);

//     // Llenar el modal con el contenido
//     modalBody.innerHTML = `
//         <div class="receipt-preview">
//             <div class="receipt-header">
//                 <div class="fw-bold">FARMACIA CENODE</div>
//                 <div>Av. Principal 123, Ciudad</div>
//                 <div>Tel: +1 234 567 890</div>
//             </div>

//             <div class="receipt-divider"></div>

//             <div class="text-center mb-2">
//                 <div class="fw-bold">RECIBO DE ENTREGA</div>
//                 <div>Pedido: #${orderId}</div>
//                 <div>Fecha: ${orderDate}</div>
//             </div>

//             <div class="receipt-divider"></div>

//             <div class="mb-2">
//                 <div>Cliente: ${patientName}</div>
//                 <div>Tel: ${patientPhone}</div>
//             </div>

//             <div class="receipt-divider"></div>

//             <div class="mb-2">
//                 ${itemsHTML}
//             </div>

//             <div class="receipt-divider"></div>

//             <div class="mb-2">
//                 <div class="d-flex justify-content-between">
//                     <span>Subtotal:</span>
//                     <span>$${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div class="d-flex justify-content-between">
//                     <span>Impuestos (10%):</span>
//                     <span>$${taxes}</span>
//                 </div>
//                 <div class="d-flex justify-content-between">
//                     <span>Descuento:</span>
//                     <span>-$${discount.toFixed(2)}</span>
//                 </div>
//                 <div class="d-flex justify-content-between fw-bold">
//                     <span>TOTAL:</span>
//                     <span>$${total}</span>
//                 </div>
//             </div>

//             <div class="receipt-divider"></div>

//             <div class="mb-2">
//                 <div>Método de pago: Tarjeta de crédito</div>
//                 <div>Atendido por: ${recipe.prescriber.first_name} ${recipe.prescriber.last_name}</div>
//             </div>

//             <div class="barcode">
//                 <img src="https://via.placeholder.com/250x50" alt="Código de barras">
//             </div>
//         </div>
//     `;
// }

// async function cargarMetodosDePago() {
//     const select = document.getElementById("paymentMethod");

//     try {
//         const response = await fetch("https://dev.monaros.co/api/v1/admin/payment-methods");
//         const methods = await response.json();

        
//         select.innerHTML = `<option value="" disabled selected>Seleccione un método</option>`;

      
//         methods.forEach(method => {
//             const option = document.createElement("option");
//             option.value = method.id;
//             option.textContent = method.method;
//             select.appendChild(option);
//         });
//     } catch (error) {
//         console.error("Error al cargar métodos de pago:", error);
//         Swal.fire("Error", "No se pudieron cargar los métodos de pago.", "error");
//     }
// }



// // Llama a esta función al cargar el modal o la página






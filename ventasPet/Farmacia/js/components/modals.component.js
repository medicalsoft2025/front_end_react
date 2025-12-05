 import { formatDate, getLoggedInUser } from '../services/utils.service.js';

    export function renderRecipeModalContent(recipeItems, patient, prescriber) {
    const header = document.getElementById("recipeHeader");
    const container = document.getElementById("recipeContainer");
  
    // Renderizar encabezado (paciente + prescriptor) con estilo limpio
    header.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-3">
          <h6 class="text-primary mb-1">Paciente</h6>
          <div class="fw-semibold">${patient.first_name || ''} ${patient.last_name || ''}</div>
          <div class="text-muted small">Documento: ${patient.document_type || ''} ${patient.document_number || ''}</div>
          <div class="text-muted small">Nacimiento: ${patient.date_of_birth || ''}</div>
        </div>
        <div class="col-md-6 mb-3">
          <h6 class="text-primary mb-1">Prescriptor</h6>
          <div class="fw-semibold">${prescriber.first_name || ''} ${prescriber.last_name || ''}</div>
          <div class="text-muted small">${prescriber.specialty?.name || 'Sin especialidad'}</div>
          <div class="text-muted small">Email: ${prescriber.email || 'Sin correo'}</div>
        </div>
      </div>
    `;
  
    // Renderizar medicamentos con tarjeta limpia
    if (!recipeItems.length) {
      container.innerHTML = `<p class="text-muted">No hay medicamentos en esta receta.</p>`;
      return;
    }
  
    container.innerHTML = recipeItems.map(item => `
      <div class="card mb-3 border shadow-sm">
        <div class="card-body">
          <h6 class="card-title mb-1 fw-semibold">${item.medication} ${item.concentration}</h6>
          <p class="mb-1 text-muted small">${item.description || "Sin descripción"}</p>
          <span class="badge bg-primary-subtle text-primary">Cantidad: ${item.quantity}</span>
        </div>
      </div>
    `).join("");
  }
  

  
  
  export function setupDeliveryModal() {
    document.getElementById("btnCompletarEntrega").addEventListener("click", () => {
      const verifiedProducts = window.getVerifiedProducts(); // Debería venir de medication.component.js
      
      if (!verifiedProducts.length) {
        alert("No hay productos verificados");
        return;
      }
      
      renderDeliverySummary(verifiedProducts);
      const modal = new bootstrap.Modal(document.getElementById("verifiedDeliveryModal"));
      modal.show();
    });
  }
  
  function renderDeliverySummary(products) {
    const tableBody = document.getElementById("deliveryCartBody");
    let total = 0;
    
    tableBody.innerHTML = products.map(product => {
      const subtotal = product.quantity * product.price;
      total += subtotal;
      
      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
        </tr>
      `;
    }).join("");
    
    document.getElementById("deliveryTotalPrice").textContent = `$${total.toFixed(2)}`;
  }


  export function renderReceiptModal(recipe) {
      const modalBody = document.querySelector("#receiptModal .modal-body");
  
      if (!modalBody) {
          console.error("Error: No se encontró el contenedor del modal.");
          return;
      }
  
      // Obtener información del paciente
      const patientName = `${recipe.patient.first_name} ${recipe.patient.middle_name || ''} ${recipe.patient.last_name} ${recipe.patient.second_last_name || ''}`.trim();
      const patientPhone = recipe.patient.whatsapp;
  
      // Información del pedido
      const orderId = recipe.id;
      const orderDate = new Date().toLocaleDateString();  // FECHA DE HOY
  
      // Obtener el nombre del prescriptor
      const prescriberName = `${recipe.prescriber.first_name} ${recipe.prescriber.last_name}`;
  
      // Obtener el nombre del usuario logueado
      const loggedInUser = getLoggedInUser();
      const attendedBy = loggedInUser ? `${loggedInUser.first_name} ${loggedInUser.last_name}` : 'Desconocido';
  
      // Productos y precios
      let subtotal = 0;
      let itemsHTML = '';
  
      const verifiedProducts = typeof window.getVerifiedProducts === 'function'
          ? window.getVerifiedProducts()
          : [];
  
      if (Array.isArray(verifiedProducts)) {
          recipe.recipe_items.forEach(item => {
              const verifiedProduct = verifiedProducts.find(p =>
                  p.name.toLowerCase() === item.medication.toLowerCase() &&
                  String(p.concentration).toLowerCase() === String(item.concentration).toLowerCase()
              );
  
              let productPrice = 0;
              if (verifiedProduct) {

                  productPrice = verifiedProduct.price || 0;
                  console.log("productPrice", productPrice);
              }
  
              const itemSubtotal = item.quantity * productPrice;
              subtotal += itemSubtotal;
  
              itemsHTML += `
                  <div class="d-flex justify-content-between mt-2">
                      <span>${item.medication} ${item.concentration}</span>
                      <span>$${itemSubtotal.toFixed(2)}</span>
                  </div>
                  <div class="small text-muted">${item.quantity} x $${productPrice.toFixed(2)}</div>
              `;
          });
      } else {
          console.error("getVerifiedProducts() no devolvió un arreglo válido:", verifiedProducts);
      }
  
      // Calcular impuestos, descuento y total
      const taxes = (subtotal * 0.10).toFixed(2);
      const discount = 0.00;
      const total = (subtotal + parseFloat(taxes) - discount).toFixed(2);
  
      // Render del HTML
      modalBody.innerHTML = `
          <div class="receipt-preview">
              <div class="receipt-header">
                  <div class="fw-bold">FARMACIA CENODE</div>
                  <div>Av. Principal 123, Ciudad</div>
                  <div>Tel: +1 234 567 890</div>
              </div>
  
              <div class="receipt-divider"></div>
  
              <div class="text-center mb-2">
                  <div class="fw-bold">RECIBO DE ENTREGA</div>
                  <div>Pedido: #${orderId}</div>
                  <div>Fecha: ${orderDate}</div>
              </div>
  
              <div class="receipt-divider"></div>
  
              <div class="mb-2">
                  <div>Cliente: ${patientName}</div>
                  <div>Tel: ${patientPhone}</div>
              </div>
  
              <div class="receipt-divider"></div>
  
              <div class="mb-2">
                  ${itemsHTML || '<div class="text-muted">No se encontraron productos verificados.</div>'}
              </div>
  
              <div class="receipt-divider"></div>
  
              <div class="mb-2">
                  <div class="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>$${subtotal.toFixed(2)}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                      <span>Impuestos:</span>
                      <span>$${taxes}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                      <span>Descuento:</span>
                      <span>-$${discount.toFixed(2)}</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold">
                      <span>TOTAL:</span>
                      <span>$${total}</span>
                  </div>
              </div>
  
              <div class="receipt-divider"></div>
  
              <div class="mb-2">
                  <div>Atendido por: ${attendedBy}</div>
              </div>
          </div>
      `;
  }
  

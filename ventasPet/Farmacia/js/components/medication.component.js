import { farmaciaService } from "../services/api.service.js";

let verifiedProducts = [];

export function renderMedicationTable(recipeItems) {
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = "";

  recipeItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.medication} ${item.concentration}</td>
      <td>${item.quantity}</td>
      <td>${item.price ? item.price.toFixed(2) : "0.00"}</td>
      <td><span class="badge ${item.verified ? 'bg-success' : 'bg-secondary'}">
        ${item.verified ? 'Verificado' : 'Pendiente'}
      </span></td>
      <td><button class="btn btn-sm ${item.verified ? 'btn-outline-primary' : 'btn-primary'} btn-verificar"
          data-id="${item.id}" data-name="${item.medication}" data-concentration="${item.concentration}">
          <i class="fas fa-check"></i> ${item.verified ? '' : 'Verificar'}
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  setupVerificationButtons();
}

function setupVerificationButtons() {
  document.querySelectorAll(".btn-verificar").forEach(button => {
    button.addEventListener("click", async () => {
      const name = button.getAttribute("data-name");
      const concentration = button.getAttribute("data-concentration");

      try {
        const result = await farmaciaService.searchProducts(name, concentration);

        if (result.data?.length > 0) {
          const product = result.data[0];
          const salePrice = product.attributes.sale_price;

          // Guardar en el arreglo de productos verificados
          verifiedProducts.push({
            id: product.id,
            name: product.attributes.name,
            quantity: 1, // Ajustar si es necesario
            price: salePrice
          });

          // Cambiar estado del botón
          button.innerHTML = '<i class="fas fa-check"></i>';
          button.classList.remove("btn-primary");
          button.classList.add("btn-outline-primary");
          button.disabled = true;

          // Actualizar badge
          const row = button.closest("tr");
          const badge = row.querySelector(".badge");
          badge.className = "badge bg-success";
          badge.textContent = "Verificado";

          // Actualizar precio en la celda
          const priceCell = row.querySelector("td:nth-child(3)");
          priceCell.textContent = salePrice.toFixed(2);
        }

        console.log("Productos verificados:", verifiedProducts);
      } catch (error) {
        console.error("Error verificando producto:", error);
      }
    });
  });
}


export function getVerifiedProducts() {
  return verifiedProducts;
}
<div class="modal fade" id="solicitudInsumoAdmin" tabindex="-1" aria-labelledby="solicitudInsumoAdminLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="solicitudInsumoAdminLabel">Solicitud de insumos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="requestInsumo">
                    <div class="mb-3">
                        <label for="productSelect" class="form-label">Seleccionar Insumo</label>
                        <select id="productSelect" class="form-select">
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Cantidad</label>
                        <input type="number" id="quantity" class="form-control" min="1">
                    </div>
                    <button type="button" id="addInsumo" class="btn btn-secondary">Añadir Insumo</button>

                    <div class="mt-3" id="divInsumosAgregados" style="display: none;">
                        <h4 class="text-center">Insumos agregados</h4>
                    </div>

                    <div class="mb-3">
                        <label for="observations" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observations"></textarea>
                    </div>
                    <button id="enviarSolicitudAdmin" type="button" class="btn btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    </div>
</div>



<script>
    const productSelect = document.getElementById("productSelect");
    const addInsumoButton = document.getElementById("addInsumo");
    const divInsumosAgregados = document.getElementById("divInsumosAgregados");
    const enviarSolicitudButton = document.getElementById("enviarSolicitudAdmin");

    // Función para obtener los productos y cargar en el select
    const loadProducts = async () => {
        try {
            const res = await fetch("https://dev.monaros.co/api/v1/admin/products/");
            const data = await res.json();
            const products = data.data;

            // Llenar el select con los productos
            productSelect.innerHTML = ""; // Limpiar el select
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.attributes.name; // Mostrar el nombre del producto
                productSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    };

    // Cargar los productos al abrir el modal
    const openModal = () => {
        loadProducts();
        divInsumosAgregados.style.display = "none"; // Ocultar lista de insumos agregados al abrir el modal
    };

    // Mostrar insumos agregados
    const showAddedInsumos = (productId, quantity) => {
        const productOption = productSelect.querySelector(`option[value="${productId}"]`);
        const productName = productOption ? productOption.text : 'Producto desconocido';
        const insumoList = document.createElement('li');
        insumoList.textContent = `${productName} (x${quantity})`;

        if (!divInsumosAgregados.querySelector("ul")) {
            const ul = document.createElement("ul");
            divInsumosAgregados.appendChild(ul);
        }
        divInsumosAgregados.querySelector("ul").appendChild(insumoList);
        divInsumosAgregados.style.display = "block";
    };

    // Event listener para el botón de "Añadir Insumo"
    addInsumoButton.addEventListener("click", () => {
        const productId = productSelect.value;
        const quantity = document.getElementById("quantity").value;

        if (productId && quantity && quantity > 0) {
            showAddedInsumos(productId, quantity);
        } else {
            alert("Por favor, seleccione un insumo y cantidad válida.");
        }
    });

    // Event listener para el botón "Enviar Solicitud"
    enviarSolicitudButton.addEventListener("click", () => {
        alert("Solicitud enviada");
        // Aquí puedes agregar la lógica para enviar la solicitud a tu servidor
    });

    // Inicializar el modal
    const modal = new bootstrap.Modal(document.getElementById("solicitudInsumoAdmin"));
    document.getElementById("solicitudInsumoAdmin").addEventListener("show.bs.modal", openModal);
</script>


<!-- <script>
    function cargarOpcionesSelect() {
        const insumosAdministrativos = [
            "Papelería",
            "Carpetas",
            "Bolígrafos",
            "Post-it",
            "Toner",
            "Papel",
            "Archivadores",
            "Plumones",
            "Grapadoras",
            "Calculadora",
            "Reglas",
            "Cinta adhesiva",
            "Sillas",
            "Mesas",
            "Estanterías",
            "Pizarras",
            "Rotuladores",
            "Papel de impresión"
        ];

        const selectElement = document.getElementById('productSelect');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        insumosAdministrativos.forEach((insumo, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = insumo;
            selectElement.appendChild(option);
        });
    }

    cargarOpcionesSelect();

    function agregarInsumo() {
        const productSelect = document.getElementById('productSelect');
        const quantityInput = document.getElementById('quantity');
        const divInsumosAgregados = document.getElementById('divInsumosAgregados');

        const productoSeleccionado = productSelect.options[productSelect.selectedIndex].text;
        const productoValor = productSelect.value;
        const cantidad = quantityInput.value;

        if (productoValor === "" || cantidad === "" || cantidad <= 0) {
            alert("Por favor, seleccione un producto y especifique una cantidad válida.");
            return;
        }

        let tabla = divInsumosAgregados.querySelector('table');

        if (!tabla) {
            tabla = document.createElement('table');
            tabla.className = 'table';
            tabla.innerHTML = `
            <thead>
                <tr>
                    <th width="50%">Producto</th>
                    <th width="30%">Cantidad</th>
                    <th width="20%">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaInsumosBody">
            </tbody>
        `;
            divInsumosAgregados.appendChild(tabla);
        }

        const tablaBody = document.getElementById('tablaInsumosBody') || tabla.querySelector('tbody');

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
        <td width="50%">${productoSeleccionado}</td>
        <td width="30%">${cantidad}</td>
        <td width="20%">
            <button class="btn btn-danger btn-sm eliminar-insumo"><i class="fas fa-trash"></i></button>
        </td>
    `;

        nuevaFila.querySelector('.eliminar-insumo').addEventListener('click', function() {
            nuevaFila.remove();

            if (tablaBody.children.length === 0) {
                divInsumosAgregados.style.display = 'none';
            }
        });

        tablaBody.appendChild(nuevaFila);

        divInsumosAgregados.style.display = 'block';

        productSelect.selectedIndex = 0;
        quantityInput.value = '';
    }

    document.getElementById('addInsumo').addEventListener('click', agregarInsumo);

    function enviarSolicitudAdmin() {
        const tablaBody = document.getElementById('tablaInsumosBody');
        const observaciones = document.getElementById('observations').value;

        if (!tablaBody || tablaBody.children.length === 0) {
            alert("No hay insumos agregados para enviar.");
            return;
        }

        const insumosSeleccionados = [];

        Array.from(tablaBody.children).forEach((fila, index) => {
            const celdas = fila.querySelectorAll('td');

            const insumo = {
                id: index + 1,
                producto: celdas[0].textContent,
                cantidad: parseInt(celdas[1].textContent)
            };

            insumosSeleccionados.push(insumo);
        });

        const solicitudData = {
            totalInsumos: insumosSeleccionados.length,
            insumos: insumosSeleccionados,
            observaciones: observaciones
        };

        console.log("Datos de la solicitud de insumos administrativos:");
        console.log(solicitudData);

        // Crear la lista de insumos para mostrar
        let listaInsumos = '';
        insumosSeleccionados.forEach(insumo => {
            listaInsumos += `<li>${insumo.producto}: ${insumo.cantidad}</li>`;
        });

        Swal.fire({
            title: 'Información de Solicitud',
            html: `
            <p><strong>Total de insumos:</strong> ${solicitudData.totalInsumos}</p>
            <div style="text-align: center;">
                <p><strong>Insumos:</strong></p>
                <ul style="display: inline-block; text-align: left;">${listaInsumos}</ul>
            </div>
            <p><strong>Observaciones:</strong> ${solicitudData.observaciones}</p>
        `,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#132030',
            allowOutsideClick: false,
            showCancelButton: false
        }).then((res) => {
            if (res.isConfirmed) {
                window.location.reload();
            }
        });

        return false;
    }
    document.getElementById('enviarSolicitudAdmin').addEventListener('click', enviarSolicitudAdmin);
</script> -->
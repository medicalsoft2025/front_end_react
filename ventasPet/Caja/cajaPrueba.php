<?php
include "../menu.php";
include "../header.php";
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farmacia POS - Punto de Venta</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Asegúrate de que esto esté en tu HTML -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <style>
        body {
            background-color: #f8f9fa;
        }

        .navbar-brand {
            display: flex;
            align-items: center;
        }

        .logo {
            width: 40px;
            height: 40px;
            background-color: #28a745;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin-right: 10px;
            font-weight: bold;
            font-size: 20px;
        }

        .product-card {
            cursor: pointer;
            transition: all 0.2s;
        }

        .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .category-btn {
            white-space: nowrap;
        }

        .category-container {
            overflow-x: auto;
            padding-bottom: 10px;
        }

        .cart-item {
            background-color: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 10px;
            padding: 10px;
        }

        .cart-empty {
            text-align: center;
            padding: 40px 0;
            color: #adb5bd;
        }

        .cart-container {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 180px);
        }

        .cart-items {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
        }

        .cart-summary {
            border-top: 1px solid #dee2e6;
            padding: 15px;
            background-color: white;
        }

        .payment-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .payment-content {
            background-color: white;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;
            padding: 20px;
            margin: 0 15px;
        }

        .payment-method {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 15px;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            cursor: pointer;
        }

        .payment-method:hover {
            background-color: #f8f9fa;
        }

        .payment-method i {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .payment-method.cash i {
            color: #28a745;
        }

        .payment-method.card i {
            color: #0d6efd;
        }

        .payment-method.invoice i {
            color: #6f42c1;
        }

        .payment-method {
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            background-color: #fff;
        }

        .payment-method:hover {
            background-color: #f8f9fa;
        }

        .payment-method.selected {
            border-color: #198754;
            background-color: #e6f4ea;
            color: #198754;
        }

        #patient-select {
    min-height: 38px;
    padding: 0.375rem 0.75rem;
  }


        @media (max-width: 768px) {
            .cart-container {
                height: auto;
                max-height: 400px;
            }
        }
    </style>
</head>

<body>
    <!-- Main Content -->
    <div class="container-fluid mt-5">
        <div class="row">
            <!-- Products Section -->
            <div class="col-md-8 col-lg-9 mt-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">Punto de Venta</h4>
                    <div class="position-relative" style="width: 250px;">
                        <input type="text" id="searchInput" class="form-control ps-4" placeholder="Buscar productos...">
                        <i class="fas fa-search position-absolute" style="top: 10px; left: 10px; color: #adb5bd;"></i>
                    </div>
                </div>

                <!-- Categories -->
                <div class="category-container mb-4">
                    <div class="d-flex gap-2" id="category-buttons">
                        <button class="btn btn-success category-btn" data-category="Todos">Todos</button>
                    </div>
                </div>


                <!-- Products Grid -->
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3" id="productsContainer">

                </div>
            </div>

            <!-- Cart Section -->
            <div class="col-md-4 col-lg-3">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">
                            <i class="fas fa-shopping-cart me-2"></i>
                            Carrito de Compra
                        </h5>
                    </div>
                    <div class="cart-container">
                        <div class="cart-items" id="cartItems">
                            <div class="cart-empty" id="emptyCart">
                                <i class="fas fa-shopping-cart mb-2" style="font-size: 48px;"></i>
                                <p>El carrito está vacío</p>
                            </div>
                        </div>
                        <div class="cart-summary">
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Subtotal:</span>
                                    <span id="subtotal">$0.00</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted d-flex align-items-center">
                                        Descuento:
                                        <button class="btn btn-sm text-success p-0 ms-1" id="discountBtn">
                                            <i class="fas fa-percent"></i>
                                        </button>
                                    </span>
                                    <span class="text-danger" id="discount">-$0.00</span>
                                </div>
                                <div class="d-flex justify-content-between pt-2 border-top">
                                    <span class="fw-bold">Total:</span>
                                    <span class="fw-bold text-success" id="total">$0.00</span>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-between">
                                <button class="btn btn-outline-secondary" id="cancelBtn">Cancelar</button>
                                <button class="btn btn-success" id="payBtn" disabled>Pagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment Modal -->
    <div class="payment-modal" id="paymentModal">
        <div class="payment-content">
            <h4 class="mb-4">Procesar Pago</h4>

            <div class="mb-4">
                <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">Total a pagar:</span>
                    <span class="fw-bold text-success" id="modalTotal">$0.00</span>
                </div>

                <div class="mb-3">
                    <label class="form-label">Cliente</label>
                    <select class="form-select" id="patient-select" style="width: 100%">
                        <option value="">Seleccione</option>
                    </select>
                </div>


                <div>
                    <label class="form-label">Método de Pago</label>
                    <div class="row g-2" id="payment-methods-container">
                        <!-- Aquí se insertarán dinámicamente los métodos de pago -->
                    </div>
                </div>

            </div>

            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary flex-grow-1" id="cancelPaymentBtn">Cancelar</button>
                <button class="btn btn-success flex-grow-1" id="confirmPaymentBtn">Confirmar Pago</button>
            </div>
        </div>
    </div>



    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>



</body>

</html>

<?php
include "../footer.php";

?>
<script src="./Caja/js/caja.js" type="module"></script>
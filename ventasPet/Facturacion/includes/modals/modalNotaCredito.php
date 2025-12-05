<div class="modal fade modal-xl" id="modalNotaCredito" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Realizar nota crédito</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="card">
                    <div class=" card-body">
                        <h5 class="card-title">Información de factura</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="numeroFactura"># Factura</label>
                                <input class="form-control" type="text" name="numeroFactura" id="numeroFactura" value="100929919" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="fechaFactura">Fecha</label>
                                <input class="form-control" type="date" name="fechaFactura" id="fechaFactura" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="tipoFactura">Cliente/Entidad</label>
                                <input class="form-control" type="text" name="tipoFactura" id="tipoFactura" value="Cliente 1" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="valorFacturaNC">Valor</label>
                                <input class="form-control" type="text" name="valorFacturaNC" id="valorFacturaNC" value="2109172" disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class=" card-body">
                        <h5 class="card-title">Información nota crédito</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="montoNotaCredito">Monto nota crédito</label>
                                <input class="form-control" type="number" name="montoNotaCredito" id="montoNotaCredito" required>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="motivoNota">Motivo</label>
                                <input class="form-control" type="text" name="motivoNota" id="motivoNota" required>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="totalFacturaNC">Total</label>
                                <input class="form-control" type="text" name="totalFacturaNC" id="totalFacturaNC" disabled>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="enviar" type="button">Enviar</button>
            </div>
        </div>
    </div>
</div>

<script>
   function calcularTotalNC(valorFacturaNC, montoNotaCredito){
    const valorFacturaNumNC = parseFloat(valorFacturaNC) || 0;
    const montoNotaCreditoNum = parseFloat(montoNotaCredito) || 0;

    const totalFacturaNC = valorFacturaNumNC - montoNotaCreditoNum;

    return totalFacturaNC;
   }

   document.addEventListener('DOMContentLoaded',function(){
    const inputValorFacturaNC = document.getElementById('valorFacturaNC');
    const inputMontoNotaCredito = document.getElementById('montoNotaCredito');
    const inputTotalFacturaNC = document.getElementById('totalFacturaNC');

    function actualizarTotalNC() {
        const valorFacturaNC = inputValorFacturaNC.value;
        const montoNotaCredito = inputMontoNotaCredito.value;
         
        const total = calcularTotalNC(valorFacturaNC, montoNotaCredito);
        inputTotalFacturaNC.value = total.toFixed(2);
    }

    inputValorFacturaNC.addEventListener('input', actualizarTotalNC);
    inputMontoNotaCredito.addEventListener('input', actualizarTotalNC);
    inputMontoNotaCredito.addEventListener('change', actualizarTotalNC);

   })
</script>
async function generarFormato(objecto, nombreObjecto) {
  let formatoAImprimir = {};
  // esto es asi ya que no sé exactamente como esten construidos los objectos
  // y no sé si se respeta la regla de mantener ciertos datos iguales ejemplo
  // user_id y para evitar errores mejor se escribe más codigo pwro avmos a la fija c;
  switch (nombreObjecto) {
    case "Incapacidad":
      formatoAImprimir = await generarFormatoIncapacidad(objecto);
      break;
    case "Consentimiento":
      formatoAImprimir = await generarFormatoConsentimiento(objecto);
      break;
    case "Consulta":
      formatoAImprimir = await generarFormatoConsulta(objecto);
      break;
    case "RecetaExamen":
      formatoAImprimir = await generarFormatoRecetaOrden(objecto);
      break;
    case "Receta":
      formatoAImprimir = await generarFormatoReceta(objecto);
      break;
    case "Examen":
      formatoAImprimir = await generarFormatoOrden(objecto);
      break;

    default:
      break;
  }

  return formatoAImprimir;
}

async function generarFormatoIncapacidad(incapacidad) {
  let contenido = `
  <div class="container p-2 border rounded shadow-sm">
    <h3 class="text-primary" style="margin-top: 0; margin-bottom: 5px;">Certificado de Incapacidad</h3>
    <hr style="margin: 0.25rem 0;">
    <div style="width: 100%; margin-bottom: 0">
        <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Desde:</strong> ${incapacidad.start_date}</p>
        <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Hasta:</strong> ${incapacidad.end_date}</p>
    </div>
    <div style="margin-top: 0;">
    <p style="margin: 0;"><strong>Motivo de Incapacidad: </strong> ${incapacidad.reason}</p>
    </div>
  </div>`;
  let datosPaciente = await consultarDatosPaciente(
    incapacidad.patient_id,
    formatearFechaQuitarHora(incapacidad.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(incapacidad.user_id);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoConsentimiento(consentimeinto) {
  let contenido = `
  <div class="container p-3 border rounded shadow-sm">
    <h3 class="text-primary text-center">${consentimeinto.title}</h3>
    <hr>

    <div class="mb-3">
      ${consentimeinto.description}
    </div>
  </div>
  `;
  let datosPaciente = await consultarDatosPaciente(
    consentimeinto.patient_id,
    formatearFechaQuitarHora(consentimeinto.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor("1");

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoConsulta(consulta_id) {
  // Helper functions
  const capitalizar = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  const obtenerUrl = (path) => obtenerRutaPrincipal() + path;

  // Función para formatear valores de opciones predefinidas
  const formatearValorOpcion = (valor) => {
    if (!valor || typeof valor !== "string") return valor;

    // Casos especiales
    const casosEspeciales = {
      si: "Sí",
      no: "No",
      ambos: "Ambos",
      OD: "Ojo Derecho",
      OI: "Ojo Izquierdo",
      noAplica: "No Aplica",
      noNiega: "No Niega",
    };

    if (casosEspeciales[valor]) {
      return casosEspeciales[valor];
    }

    // Para otros casos, separar camelCase y capitalizar
    return valor
      .replace(/([A-Z])/g, " $1") // Separar palabras en camelCase
      .replace(/^./, (str) => str.toUpperCase()) // Primera letra mayúscula
      .trim(); // Eliminar espacios adicionales
  };

  // Obtener datos iniciales
  const urlConsulta = obtenerUrl(`/medical/clinical-records/${consulta_id}`);
  const datosConsulta = await obtenerDatos(urlConsulta);
  const idDoctorCita = parseInt(datosConsulta.data.cita.doctor);
  // console.log("Doctor: ", idDoctorCita);
  const nombreDoctorCita = await consultarDatosDoctor(idDoctorCita);
  const nombreDoctor = nombreDoctorCita.nombre;
  // console.log("Datos Doctor: ", nombreDoctorCita);

  console.log(datosConsulta);

  const urlTipoHistoria = obtenerUrl(
    `/medical/clinical-record-types/${datosConsulta.clinical_record_type_id}`
  );
  const tipoHistoria = await obtenerDatos(urlTipoHistoria);

  // Función para generar contenido base
  const generarContenidoBase = () => `
  <div class="container p-3 border rounded shadow-sm text-start" style="padding-top: 0;">
    <h3 class="text-primary text-center" style="margin: 0; padding: 0;">${
      tipoHistoria.name
    }</h3>
    <hr style="margin: 0.25rem 0;">
    <h4 class="text-secondary" style="margin: 0.5rem 0 0.25rem 0;">Descripción:</h4>
    <p style="margin: 0 0 0.5rem 0;">${
      datosConsulta.description || "Sin descripción"
    }</p>
  `;

  // Función para generar campos de verificación
  const generarCamposVerificacion = () => {
    const campos = [
      {
        texto: "¿Se ha confirmado la identidad del paciente?",
        valor: datosConsulta.data.values.confirmacionIdentidad.text,
      },
      {
        texto: "¿Se ha marcado el sitio quirurgico?",
        valor: datosConsulta.data.values.marcadoSitioQuirurgico.text,
      },
      {
        texto: "¿Se ha comprobado la disponibilidad de anestesia y medicación?",
        valor: datosConsulta.data.values.disponibilidadAnestesiaMedicacion.text,
      },
      {
        texto: "¿Se ha colocado el pulsioximetro al paciente?",
        valor: datosConsulta.data.values.pulsioximetro.text,
      },
      {
        texto: "¿El paciente tiene alergias conocidas?",
        valor: datosConsulta.data.values.alergiasConocidas.text,
      },
      {
        texto: "Vía aérea dificil/riesgo de aspiración",
        valor: datosConsulta.data.values.viaAspiracion.text,
      },
      {
        texto: "¿En este caso, hay instrumental y equipos de ayuda disponible?",
        valor: datosConsulta.data.values.instrumentalAyudaDisponible.text,
      },
      {
        texto: "Riesgo de hemorragia > 500 ml",
        valor: datosConsulta.data.values.riesgoHemorragia.text,
      },
      {
        texto:
          "¿En este caso, se ha previsto la disponibilidad de sangre, plasma u otros fluidos?",
        valor: datosConsulta.data.values.disponibilidadSangre.text,
      },
      {
        texto:
          "Confirmar que todos los miembros del equipo programados se hayan presentado por su nombre y funcion",
        valor: datosConsulta.data.values.presentacionEquipo.text,
      },
      {
        texto:
          "Confirmar indentidad del paciente, procedimiento y sitio quirurgico",
        valor:
          datosConsulta.data.values.confirmarIdentidadProcedimientoSitio.text,
      },
      {
        texto:
          "Confirmar que todos los miembros del equipo han cumplido correctamente con el",
        valor: datosConsulta.data.values.cumplimiento.text,
      },
      {
        texto: "Se ha administrado profilaxis con antibioticos",
        valor: datosConsulta.data.values.administracionProfilaxis.text,
      },
      {
        texto: "¿Cuales son los pasos criticos o inesperados?",
        valor: datosConsulta.data.values.pasosCriticos.text,
      },
      {
        texto: "Duracion de la operacion",
        valor: datosConsulta.data.values.duracionOperacion.text,
      },
      {
        texto: "Perdida de sangre prevista",
        valor: datosConsulta.data.values.perdidaSangrePrevista.text,
      },
      {
        texto: "¿El paciente presenta algún problema en especifico?",
        valor: datosConsulta.data.values.problemaEspecifico.text,
      },
      {
        texto: "Se ha confirmado la esterilidad de la ropa",
        valor: datosConsulta.data.values.esterilidadRopa.text,
      },
      {
        texto: "¿Hay dudas o problemas relacionados con ellos?",
        valor: datosConsulta.data.values.dudasProblemas.text,
      },
      {
        texto: "Pueden visualizarse las imagenes diagnosticas esenciales?",
        valor: datosConsulta.data.values.imagenesDiagnosticas.text,
      },
      {
        texto: "El nombre del procedimiento",
        valor: datosConsulta.data.values.nombreProcedimiento.text,
      },
      {
        texto: "El recuento de instrumentos",
        valor: datosConsulta.data.values.recuentoInstrumentos.text,
      },
      {
        texto:
          "El etiquetado de las muestras (lectura de etiquetas en voz alta, incluido el nombre del paciente)",
        valor: datosConsulta.data.values.etiquetadoMuestras.text,
      },
      {
        texto:
          "Problemas que resolver relacionados al instrumental y/o equipos",
        valor: datosConsulta.data.values.problemasInstrumentalEquipos.text,
      },
    ];

    return campos
      .filter((campo) => campo.valor)
      .map(
        (campo) => `
    <div style="width: 100%; margin: 0;">
      <p style="display: inline-block; width: 83%; margin: 0;">${
        campo.texto
      }</p>
      <p style="display: inline-block; width: 15%; margin: 0;">${formatearValorOpcion(
        campo.valor
      )}</p>
    </div>
    <hr style="margin: 0; height: 1px; background-color: rgba(0, 0, 0, 0.2); border: none;">
  `
      )
      .join("");
  };

  // Función para generar escala Aldrete
  const generarEscalaAldrete = () => {
    const campos = [
      {
        titulo: "Actividad Muscular",
        texto: datosConsulta.data.values?.actividadMuscular?.text,
        valor: datosConsulta.data.values?.actividadMuscular?.value,
      },
      {
        titulo: "Respiratorios",
        texto: datosConsulta.data.values?.respiratorios?.text,
        valor: datosConsulta.data.values?.respiratorios?.value,
      },
      {
        titulo: "Circulatorios",
        texto: datosConsulta.data.values?.circulatorios?.text,
        valor: datosConsulta.data.values?.circulatorios?.value,
      },
      {
        titulo: "Estado de Conciencia",
        texto: datosConsulta.data.values?.estadoConciencia?.text,
        valor: datosConsulta.data.values?.estadoConciencia?.value,
      },
      {
        titulo: "Color de mucosa",
        texto: datosConsulta.data.values?.colorMucosas?.text,
        valor: datosConsulta.data.values?.colorMucosas?.value,
      },
    ];

    const totalAldrete = campos.reduce(
      (sum, campo) => sum + (Number(campo.valor) || 0),
      0
    );

    const listaCampos = campos
      .filter((campo) => campo.valor)
      .map(
        (campo) => `
        <div style="width: 100%; margin: 0;">
          <p style="display: inline-block; width: 35%; margin-top: 0; margin-bottom: 3px">${
            campo.titulo
          }</p>
          <p style="display: inline-block; width: 50%; margin-top: 0; margin-bottom: 3px">${formatearValorOpcion(
            campo.texto
          )}</p>
          <p style="display: inline-block; width: 10%; margin-top: 0; margin-bottom: 3px">${
            campo.valor
          }</p>
        </div>
      `
      )
      .join("");

    return (
      listaCampos +
      `
      <div style="width: 100%; margin: 0.35rem 0; font-weight: bold;">
        <p style="display: inline-block; margin: 0;">Total:</p>
        <p style="display: inline-block; margin: 0;">${totalAldrete}</p>
      </div>
    `
    );
  };

  // Función para generar tabla de ojos
  const generarTablaOjos = (campos, titulo) => {
    const tieneDatos = campos.some(
      (item) => datosConsulta.data.values[item.campo] != null
    );

    if (!tieneDatos) return "";

    return `
       <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">${titulo}</h3>
  <hr style="margin: 0.25rem 0;">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>${campos
              .map((item) => `<th>${item.etiqueta}</th>`)
              .join("")}</tr>
          </thead>
          <tbody>
            <tr>${campos
              .map((item) => {
                const valor = datosConsulta.data.values[item.campo];
                return `<td>${
                  valor != null ? formatearValorOpcion(valor) : "-"
                }</td>`;
              })
              .join("")}</tr>
          </tbody>
        </table>
      </div>
    `;
  };

  // Función para generar tabla de cristal recomendado
  const generarTablaCristal = () => {
    const campos = [
      {
        campo1: "visionSencilla",
        campo2: "visionSencillaV",
        etiqueta: "Visión sencilla",
      },
      {
        campo1: "bifocalFlttop",
        campo2: "bifocalFlttopH",
        etiqueta: "Bifocal FLTTOP",
      },
      {
        campo1: "bifocalInvisible",
        campo2: "bifocalInvisibleD",
        etiqueta: "Bifocal invisible",
      },
      { campo1: "progresivo", campo2: "progresivoP", etiqueta: "Progresivo" },
    ];

    const tieneDatos = campos.some(
      (item) =>
        datosConsulta.data.values[item.campo1] != null ||
        datosConsulta.data.values[item.campo2] != null
    );

    if (!tieneDatos) return "";

    return `
     <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">Cristal recomendado</h3>
  <hr style="margin: 0.25rem 0;">
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Valor 1</th>
              <th>Valor 2</th>
            </tr>
          </thead>
          <tbody>
            ${campos
              .map((item) => {
                const valor1 = datosConsulta.data.values[item.campo1];
                const valor2 = datosConsulta.data.values[item.campo2];
                if (valor1 == null && valor2 == null) return "";
                return `
                <tr>
                  <td><strong>${item.etiqueta}</strong></td>
                  <td>${
                    valor1 != null ? formatearValorOpcion(valor1) : "-"
                  }</td>
                  <td>${
                    valor2 != null ? formatearValorOpcion(valor2) : "-"
                  }</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  // Añadir esta función para generar la tabla de queratometría
  const generarTablaQueratometria = () => {
    // Verificar si hay datos de queratometría para algún ojo
    const tieneQueratometria =
      datosConsulta.data.values.queratometriaOjoDerecho != null ||
      datosConsulta.data.values.queratometriaOjoIzquierdo != null ||
      datosConsulta.data.values.esferaOjoDerecho != null ||
      datosConsulta.data.values.esferaOjoIzquierdo != null ||
      datosConsulta.data.values.cilindroOjoDerecho != null ||
      datosConsulta.data.values.cilindroOjoIzquierdo != null ||
      datosConsulta.data.values.ejeOjoDerecho != null ||
      datosConsulta.data.values.ejeOjoIzquierdo != null ||
      datosConsulta.data.values.addOjoDerecho != null ||
      datosConsulta.data.values.addOjoIzquierdo != null ||
      datosConsulta.data.values.dnpOjoDerecho != null ||
      datosConsulta.data.values.dnpOjoIzquierdo != null;

    if (!tieneQueratometria) return "";

    // Encabezados de la tabla
    const encabezados = [
      "Ojo",
      "Queratometría",
      "Esfera",
      "Cilindro",
      "Eje",
      "ADD",
      "DNP",
    ];

    // Función para formatear valores
    const formatearValor = (valor) => (valor != null ? valor : "-");

    // Datos para cada ojo
    const ojoDerecho = [
      "Ojo Derecho",
      formatearValor(datosConsulta.data.values.queratometriaOjoDerecho),
      formatearValor(datosConsulta.data.values.esferaOjoDerecho),
      formatearValor(datosConsulta.data.values.cilindroOjoDerecho),
      formatearValor(datosConsulta.data.values.ejeOjoDerecho),
      formatearValor(datosConsulta.data.values.addOjoDerecho),
      formatearValor(datosConsulta.data.values.dnpOjoDerecho),
    ];

    const ojoIzquierdo = [
      "Ojo Izquierdo",
      formatearValor(datosConsulta.data.values.queratometriaOjoIzquierdo),
      formatearValor(datosConsulta.data.values.esferaOjoIzquierdo),
      formatearValor(datosConsulta.data.values.cilindroOjoIzquierdo),
      formatearValor(datosConsulta.data.values.ejeOjoIzquierdo),
      formatearValor(datosConsulta.data.values.addOjoIzquierdo),
      formatearValor(datosConsulta.data.values.dnpOjoIzquierdo),
    ];

    return `
    <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">Queratometría</h3>
    <hr style="margin: 0.25rem 0;">
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            ${encabezados.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${ojoDerecho.map((valor) => `<td>${valor}</td>`).join("")}
          </tr>
          <tr>
            ${ojoIzquierdo.map((valor) => `<td>${valor}</td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>`;
  };

  const generarContenidoTabs = () => {
    if (!datosConsulta.data.tabsStructure) return "";

    let contenidoTabs = "";
    let queratometriaEncontrada = false; // Flag para controlar si ya se generó la tabla de queratometría

    datosConsulta.data.tabsStructure.forEach((tab) => {
      let contenidoTab = "";
      let tieneDatosEnTab = false;

      tab.cards.forEach((card) => {
        let contenidoCard = "";
        let tieneDatosEnCard = false;

        // **Nuevo:** Verificar si la card tiene el título "Queratometría" y generar la tabla con estilo similar a exámenes
        if (
          card.cardTitle?.toLowerCase() === "queratometría" &&
          !queratometriaEncontrada
        ) {
          const tieneQueratometria =
            datosConsulta.data.values.queratometriaOjoDerecho != null ||
            datosConsulta.data.values.queratometriaOjoIzquierdo != null ||
            datosConsulta.data.values.esferaOjoDerecho != null ||
            datosConsulta.data.values.esferaOjoIzquierdo != null ||
            datosConsulta.data.values.cilindroOjoDerecho != null ||
            datosConsulta.data.values.cilindroOjoIzquierdo != null ||
            datosConsulta.data.values.ejeOjoDerecho != null ||
            datosConsulta.data.values.ejeOjoIzquierdo != null ||
            datosConsulta.data.values.addOjoDerecho != null ||
            datosConsulta.data.values.addOjoIzquierdo != null ||
            datosConsulta.data.values.dnpOjoDerecho != null ||
            datosConsulta.data.values.dnpOjoIzquierdo != null;

          if (tieneQueratometria) {
            queratometriaEncontrada = true;
            contenidoTab += `
              <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">Queratometría</h3>
              <hr style="margin: 0.25rem 0 0.5rem 0;">
              <div class="table-responsive">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                  <thead>
                    <tr>
                      <th style="padding: 6px; text-align: left; width: 15%;">Ojo</th>
                      <th style="padding: 6px; text-align: left; width: 17%;">Queratometría</th>
                      <th style="padding: 6px; text-align: left; width: 13%;">Esfera</th>
                      <th style="padding: 6px; text-align: left; width: 13%;">Cilindro</th>
                      <th style="padding: 6px; text-align: left; width: 10%;">Eje</th>
                      <th style="padding: 6px; text-align: left; width: 10%;">ADD</th>
                      <th style="padding: 6px; text-align: left; width: 12%;">DNP</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">Ojo Derecho</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.queratometriaOjoDerecho
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.esferaOjoDerecho
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.cilindroOjoDerecho
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.ejeOjoDerecho
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.addOjoDerecho
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.dnpOjoDerecho
                      )}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">Ojo Izquierdo</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.queratometriaOjoIzquierdo
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.esferaOjoIzquierdo
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.cilindroOjoIzquierdo
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.ejeOjoIzquierdo
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.addOjoIzquierdo
                      )}</td>
                      <td style="padding: 6px; vertical-align: top; border-bottom: 1px solid #eee;">${formatearValor(
                        datosConsulta.data.values.dnpOjoIzquierdo
                      )}</td>
                    </tr>
                  </tbody>
                </table>
              </div>`;
            tieneDatosEnTab = true;
          }
        } else {
          // Lógica de procesamiento de otras cards con ajustes de espaciado del título
          if (card.fields.length === 1 && card.cardTitle) {
            // Caso 1: Card con un solo campo - mostramos solo el título de la card
            const field = card.fields[0];
            const valor = datosConsulta.data.values[field.name];

            if (valor != null && valor !== "" && valor !== false) {
              tieneDatosEnCard = true;
              tieneDatosEnTab = true;

              if (field.type === "checkbox") {
                // Caso especial para checkbox con campo Info asociado
                const baseFieldName = field.name.replace(/Check$/, "");
                const infoFieldName = baseFieldName + "Info";

                // Buscar valor en campo InfoField o en campo con nombre base
                let infoValue = datosConsulta.data.values[infoFieldName];

                // Si no hay valor en el campo Info, intentar buscar en un campo con el nombre base
                if (
                  !infoValue &&
                  typeof datosConsulta.data.values[baseFieldName] === "string"
                ) {
                  infoValue = datosConsulta.data.values[baseFieldName];
                }

                // Obtenemos el título limpio (sin "Check" al final)
                const tituloCampo = card.cardTitle.replace(/ check$/i, "");

                if (infoValue) {
                  // Mostramos "Título: valor del campo Info" con menor margen inferior
                  contenidoCard += `
                    <div style="margin-bottom: 4px;">
                      <strong>${tituloCampo}:</strong> ${infoValue}
                    </div>
                  `;
                } else {
                  // Mostramos solo el título con menor margen inferior
                  contenidoCard += `
                    <div style="margin-bottom: 4px;">
                      <strong>${tituloCampo}</strong>
                    </div>
                  `;
                }
              } else {
                // Otros tipos de campos con un solo campo en la card con menor margen inferior
                contenidoCard += `
                  <div style="margin-bottom: 4px;">
                    <strong>${card.cardTitle}:</strong>
                    ${
                      field.type === "textarea" || field.type === "input"
                        ? valor
                        : formatearValorOpcion(valor)
                    }
                  </div>
                `;
              }
            }
          } else {
            // Caso 2: Card con múltiples campos - procesamiento normal con ajustes de espaciado del título
            const campos = card.fields
              .map((field) => {
                const valor = datosConsulta.data.values[field.name];
                if (valor == null || valor === "" || valor === false)
                  return null;

                return {
                  field,
                  valor,
                  esCorto:
                    typeof valor === "string" &&
                    valor.length < 30 &&
                    !valor.includes("<") &&
                    field.type !== "textarea" &&
                    field.type !== "checkbox",
                };
              })
              .filter(Boolean);

            if (campos.length > 0) {
              tieneDatosEnCard = true;
              tieneDatosEnTab = true;

              // Agrupar campos cortos y otros
              const camposCortos = campos.filter((c) => c.esCorto);
              const otrosCampos = campos.filter((c) => !c.esCorto);

              // Procesar campos cortos en tabla de dos columnas con menor padding
              if (camposCortos.length > 0) {
                contenidoCard += `<table style="width: 100%; margin-bottom: 4px; border-collapse: collapse;">`;

                // Agrupar en filas de dos campos
                for (let i = 0; i < camposCortos.length; i += 2) {
                  const campo1 = camposCortos[i];
                  const campo2 = camposCortos[i + 1];

                  contenidoCard += `<tr>`;

                  // Celda para el primer campo con menor padding
                  contenidoCard += `<td style="width: 50%; padding: 2px 10px 2px 0; vertical-align: top;">`;
                  if (campo1) {
                    const tituloCampo1 =
                      campo1.field.label ||
                      capitalizar(
                        campo1.field.name
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                      );
                    const valorFormateado1 = formatearValorOpcion(campo1.valor);
                    contenidoCard += `<strong>${tituloCampo1}:</strong> ${valorFormateado1}`;
                  }
                  contenidoCard += `</td>`;

                  // Celda para el segundo campo (si existe) con menor padding
                  contenidoCard += `<td style="width: 50%; padding: 2px 0; vertical-align: top;">`;
                  if (campo2) {
                    const tituloCampo2 =
                      campo2.field.label ||
                      capitalizar(
                        campo2.field.name
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                      );
                    const valorFormateado2 = formatearValorOpcion(campo2.valor);
                    contenidoCard += `<strong>${tituloCampo2}:</strong> ${valorFormateado2}`;
                  }
                  contenidoCard += `</td>`;

                  contenidoCard += `</tr>`;
                }

                contenidoCard += `</table>`;
              }

              // Procesar otros campos (uno debajo del otro) con menor margen inferior
              otrosCampos.forEach(({ field, valor }) => {
                const tituloCampo =
                  field.label ||
                  capitalizar(
                    field.name.replace(/([A-Z])/g, " $1").toLowerCase()
                  );
                let valorFormateado = valor;

                if (
                  field.type === "radio" ||
                  (typeof valor === "string" && !valor.startsWith("<"))
                ) {
                  valorFormateado = formatearValorOpcion(valor);
                }

                if (field.type === "textarea") {
                  contenidoCard += `
                    <div style="margin-bottom: 4px;">
                      <strong>${tituloCampo}:</strong>
                      <div>${valor}</div>
                    </div>
                  `;
                } else if (field.type === "checkbox") {
                  // Para campos checkbox, buscamos el campo Info asociado o el campo base con menor margen inferior
                  const baseFieldName = field.name.replace(/Check$/, "");
                  const infoFieldName = baseFieldName + "Info";

                  // Buscar valor en campo InfoField o en campo con nombre base
                  let infoValue = datosConsulta.data.values[infoFieldName];

                  // Si no hay valor en el campo Info, intentar buscar en un campo con el nombre base
                  if (
                    !infoValue &&
                    typeof datosConsulta.data.values[baseFieldName] === "string"
                  ) {
                    infoValue = datosConsulta.data.values[baseFieldName];
                  }

                  // Obtenemos el título limpio (sin "Check" al final)
                  const tituloCampoLimpio = tituloCampo.replace(/ check$/i, "");

                  if (infoValue) {
                    // Mostramos "Etiqueta: valor del campo Info" con menor margen inferior
                    contenidoCard += `
                      <div style="margin-bottom: 4px;">
                        <strong>${tituloCampoLimpio}:</strong> ${infoValue}
                      </div>
                    `;
                  } else {
                    // Mostramos solo la etiqueta con menor margen inferior
                    contenidoCard += `
                      <div style="margin-bottom: 4px;">
                        <strong>${tituloCampoLimpio}</strong>
                      </div>
                    `;
                  }
                } else if (field.type !== "label") {
                  contenidoCard += `
                    <div style="margin-bottom: 4px;">
                      <strong>${tituloCampo}:</strong> ${valorFormateado}
                    </div>
                  `;
                }
              });
            }
          }
        }

        if (tieneDatosEnCard) {
          contenidoTab += `
            ${
              card.cardTitle && card.fields.length > 1
                ? `<h4 class="fw-bold text-secondary" style="margin-top: 0; margin-bottom: 3px;">${card.cardTitle}</h4>`
                : ""
            }
            ${contenidoCard}
          `;
        }
      });

      if (tieneDatosEnTab) {
        contenidoTabs += `
          <h3 class="text-primary" style="margin: 0.75rem 0 0.25rem 0;">${tab.tabName}</h3>
          <hr style="margin: 0.25rem 0 0.5rem 0;">
          ${contenidoTab}
        `;
      }
    });

    return contenidoTabs;
  };

  // Helper function para formatear valores
  const formatearValor = (valor) => (valor != null ? valor : "—");

  // Secciones adicionales
  const seccionesAdicionales = {
    diagnosticos: () => {
      if (!datosConsulta.data.rips) return "";

      const diagnosticos = {
        principal: datosConsulta.data.rips.diagnosticoPrincipal,
        tipo: datosConsulta.data.rips.tipoDiagnostico,
        rel1: datosConsulta.data.rips.diagnosticoRel1,
        rel2: datosConsulta.data.rips.diagnosticoRel2,
        rel3: datosConsulta.data.rips.diagnosticoRel3,
      };

      const diagnosticosValidos = Object.entries(diagnosticos).filter(
        ([_, valor]) => valor && valor !== "null" && valor !== "Null"
      );

      if (diagnosticosValidos.length === 0) return "";

      const formatearNombre = (key) => {
        const nombres = {
          principal: "Diagnóstico Principal",
          tipo: "Tipo de Diagnóstico",
          rel1: "Diagnóstico Relacionado 1",
          rel2: "Diagnóstico Relacionado 2",
          rel3: "Diagnóstico Relacionado 3",
        };
        return nombres[key] || key;
      };

      const mitad = Math.ceil(diagnosticosValidos.length / 2);
      const columnaIzq = diagnosticosValidos.slice(0, mitad);
      const columnaDer = diagnosticosValidos.slice(mitad);

      return `
        <div class="row" style="margin: 0;">
          <div class="col-md-6" style="padding: 0;">
            ${columnaIzq
              .map(
                ([key, valor]) => `
                <p style="margin: 0;"><strong>${formatearNombre(
                  key
                )}:</strong> ${formatearValorOpcion(valor)}</p>
              `
              )
              .join("")}
          </div>
          ${
            columnaDer.length > 0
              ? `
            <div class="col-md-6" style="padding: 0;">
              ${columnaDer
                .map(
                  ([key, valor]) => `
                  <p style="margin: 0;"><strong>${formatearNombre(
                    key
                  )}:</strong> ${formatearValorOpcion(valor)}</p>
                `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      `;
    },

    // proximaCita: () => {
    //   if (!datosConsulta.data.cita) return "";

    //   const { fecha, hora, doctor } = datosConsulta.data.cita;
    //   const tieneDatos = fecha || hora || doctor;
    //   if (!tieneDatos) return "";

    //   return `
    //     <div class="table-responsive" style="margin: 0; padding: 0;">
    //       <table class="table table-bordered" style="margin: 0;">
    //         <tr>
    //           <td style="width: 50%; padding: 4px 8px; vertical-align: top;">
    //             <p style="margin: 0;"><strong>Fecha:</strong> ${
    //               fecha || "No especificada"
    //             } - ${hora || "Hora no especificada"}</p>
    //           </td>
    //           <td style="width: 50%; padding: 4px 8px; vertical-align: top;">
    //             <p style="margin: 0;"><strong>Doctor:</strong> ${
    //               nombreDoctor || "No especificado"
    //             }</p>
    //           </td>
    //         </tr>
    //       </table>
    //     </div>
    //   `;
    // },

    // receta: () => {
    //   if (!datosConsulta.data.receta || datosConsulta.data.receta.length === 0)
    //     return "";

    //   let contenidoReceta = "";

    //   datosConsulta.data.receta.forEach((item, index) => {
    //     contenidoReceta += `
    //       <div style="margin: 0; padding: 0;">
    //         <p style="margin: 0;"><strong>${index + 1}. ${
    //       item.medication
    //     }</strong> - ${item.concentration} ${item.medication_type}</p>
    //         <p style="margin: 0;"><strong>Frecuencia:</strong> ${
    //           item.frequency
    //         } | <strong>Duración:</strong> ${
    //       item.duration
    //     } días | <strong>Toma cada:</strong> ${item.take_every_hours} horas</p>
    //         <p style="margin: 0;"><strong>Cantidad:</strong> ${
    //           item.quantity
    //         }</p>
    //         ${
    //           item.observations
    //             ? `<p style="margin: 0;"><strong>Observaciones:</strong> ${item.observations}</p>`
    //             : ""
    //         }
    //       </div>
    //     `;
    //   });

    //   return contenidoReceta;
    // },

    // incapacidad: () => {
    //   if (
    //     !datosConsulta.data.incapacidad ||
    //     !datosConsulta.data.incapacidad.dias
    //   )
    //     return "";

    //   const { dias, start_date, end_date, reason } =
    //     datosConsulta.data.incapacidad;
    //   const tieneDatos = dias || start_date || end_date;
    //   if (!tieneDatos) return "";

    //   return `
    //     <table style="width: 100%; border-collapse: collapse; margin: 0;">
    //       <tr>
    //         <td style="width: 33%; padding: 4px 8px; vertical-align: top;">
    //           <p style="margin: 0;"><strong>Días:</strong> ${
    //             dias || "No especificados"
    //           }</p>
    //         </td>
    //         <td style="width: 33%; padding: 4px 8px; vertical-align: top;">
    //           <p style="margin: 0;"><strong>Inicio:</strong> ${
    //             start_date || "No especificada"
    //           }</p>
    //         </td>
    //         <td style="width: 33%; padding: 4px 8px; vertical-align: top;">
    //           <p style="margin: 0;"><strong>Fin:</strong> ${
    //             end_date || "No especificada"
    //           }</p>
    //         </td>
    //       </tr>
    //       ${
    //         reason
    //           ? `
    //         <tr>
    //           <td colspan="3" style="padding: 4px 8px; vertical-align: top;">
    //             <p style="margin: 0;"><strong>Motivo:</strong> ${reason}</p>
    //           </td>
    //         </tr>
    //       `
    //           : ""
    //       }
    //     </table>
    //   `;
    // },

    // examenes: () => {
    //   if (
    //     !datosConsulta.data.examenes ||
    //     datosConsulta.data.examenes.length === 0
    //   )
    //     return "";

    //   return `
    //     <table style="width: 100%; border-collapse: collapse; margin: 0;">
    //       <tr>
    //         <th style="padding: 4px; text-align: left; width: 30%;">Nombre</th>
    //         <th style="padding: 4px; text-align: left; width: 50%;">Descripción</th>
    //         <th style="padding: 4px; text-align: left; width: 20%;">Tipo</th>
    //       </tr>
    //       ${datosConsulta.data.examenes
    //         .map(
    //           (examen) => `
    //         <tr>
    //           <td style="padding: 4px; vertical-align: top; border-bottom: 1px solid #eee;">${
    //             examen.name
    //           }</td>
    //           <td style="padding: 4px; vertical-align: top; border-bottom: 1px solid #eee;">${
    //             examen.description || "—"
    //           }</td>
    //           <td style="padding: 4px; vertical-align: top; border-bottom: 1px solid #eee;">${
    //             examen.type
    //           }</td>
    //         </tr>
    //       `
    //         )
    //         .join("")}
    //     </table>
    //   `;
    // },

    // remision: () => {
    //   if (
    //     !datosConsulta.data.remision ||
    //     !datosConsulta.data.remision.receiver_user_id?.length
    //   )
    //     return "";

    //   return `
    //     <div style="margin: 0; padding: 0;">
    //       <p style="margin: 0;"><strong>Remitido a:</strong> ${datosConsulta.data.remision.receiver_user_id.join(
    //         ", "
    //       )}</p>
    //       ${
    //         datosConsulta.data.remision.note
    //           ? `<p style="margin: 0;"><strong>Nota:</strong> ${datosConsulta.data.remision.note}</p>`
    //           : ""
    //       }
    //     </div>
    //   `;
    // },
  };

  // Generar contenido según el tipo de historia clínica
  let contenido = generarContenidoBase();

  if (datosConsulta.clinical_record_type_id === 62) {
    // Formato procedimiento oftalmológico
    contenido += `<h3 style="margin: 0.1rem 0;">Admisión</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico
    if (datosConsulta.data.values.diagnostico) {
      contenido += `
        <h4 style="margin: 0.1rem 0;">Diagnóstico</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.diagnostico}</p>`;
    }

    // Procedimiento
    if (datosConsulta.data.values.procedimiento) {
      contenido += `
        <h4 style="margin: 0.1rem 0;">Procedimiento</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.procedimiento}</p>`;
    }

    // Observaciones
    if (datosConsulta.data.values.observaciones) {
      contenido += `
        <h4 style="margin: 0.1rem 0;">Observaciones</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.observaciones}</p>`;
    }

    // Verificación
    contenido += `<h3 style="margin: 0.1rem 0;">Verificación</h3>
    <hr style="margin: 0.25rem 0;">
    ${generarCamposVerificacion()}`;

    // Aspectos críticos de recuperación
    if (datosConsulta.data.values.aspectosCriticosRecuperacion) {
      contenido += `<h4 style="margin: 0.1rem 0;">Aspectos criticos de recuperacion del paciente</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.aspectosCriticosRecuperacion}</p>`;
    }

    contenido += `
    <h3 style="margin: 0.1rem 0;">Escala Aldrete</h3>
    <hr style="margin: 0.25rem 0;">
    ${generarEscalaAldrete()}
    `;

    // Hoja de cirugía
    contenido += `<h3 style="margin: 0.1rem 0;">Hoja de cirugia</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico principal
    if (datosConsulta.data.values?.diagnosticoPrincipal) {
      contenido += `<h4 style="margin-bottom: 0; margin-top: 0;">Diagnóstico principal</h4>
        <p style="margin-top: 0; margin-bottom: 0;">${datosConsulta.data.values.diagnosticoPrincipal}</p>`;
    }

    // Complicaciones
    if (datosConsulta.data.values.complicaciones) {
      contenido += `<h4 style="margin-bottom: 0; margin-top: 0;">Complicaciones</h4>
        <p style="margin-top: 0; margin-bottom: 0;">${datosConsulta.data.values.complicaciones}</p>`;
    }

    // Ojo derecho
    if (datosConsulta.data.values.derecho) {
      contenido += `<h4 style="margin-bottom: 0; margin-top: 0;">Ojo derecho</h4>
        <p style="margin-top: 0; margin-bottom: 0;">${datosConsulta.data.values.derecho}</p>`;
    }

    // Ojo izquierdo
    if (datosConsulta.data.values.izquierdo) {
      contenido += `<h4 style="margin-bottom: 0; margin-top: 0;">Ojo izquierdo</h4>
        <p style="margin-top: 0; margin-bottom: 0;">${datosConsulta.data.values.izquierdo}</p>`;
    }

    // Descripción de la cirugía
    if (datosConsulta.data.values.descripcionCirugia) {
      contenido += `<h4 style="margin-bottom: 0; margin-top: 0;">Descripción de la cirugia</h4>
        <p style="margin-top: 0; margin-bottom: 0;">${datosConsulta.data.values.descripcionCirugia}</p>`;
    }

    // Firmas
    contenido += `<table style="width: 100%; border-collapse: collapse; margin-top: 100px;">
        <tr>
            <td style="width: 50%; padding-right: 20px;">
                <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
                <p style="text-align: center; margin: 0;">Cirujano</p>
            </td>
            <td style="width: 50%;">
                <hr style="border: 1px solid black; width: 90%; margin: 0.25rem 0;">
                <p style="text-align: center; margin: 0;">Técnico</p>
            </td>
        </tr>
    </table>
    `;

    // Hoja de enfermeria
    if (datosConsulta.data.notasMedicas.exists === true) {
      contenido += `<h3 style="margin: 0.1rem 0;">Hoja de enfermeria</h3>
  <hr style="margin: 0.25rem 0;">
  <table style="width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">#</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha/Hora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Medicamento</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Observaciones</th>
      </tr>
    </thead>
    <tbody>`;

      // Añadir cada registro como fila de la tabla
      datosConsulta.data.notasMedicas.registros.forEach((registro) => {
        contenido += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.index}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.fechaHora}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.medicamento}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.observaciones}</td>
      </tr>`;
      });

      contenido += `
    </tbody>
  </table>`;
    }

    // Signos vitales
    contenido += `<h3 style="margin: 0.1rem 0;">Signos vitales</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Tensión arterial (mostrar si al menos uno de los valores existe)
    contenido += `<h4 style="margin: 0.1rem 0;">Tensión arterial</h4>
  <div style="margin: 0.1rem 0;">
    <div style="display: inline-block; width: 30%;">
      ${
        datosConsulta.data.values.tensionSistólica
          ? `<strong>Sistolica: </strong> ${datosConsulta.data.values.tensionSistólica}`
          : ""
      }
    </div>
    <div style="display: inline-block; width: 30%;">
      ${
        datosConsulta.data.values.tensionDiastólica
          ? `<strong>Diastólica: </strong> ${datosConsulta.data.values.tensionDiastólica}`
          : ""
      }
    </div>
    <div style="display: inline-block; width: 30%;">
      ${
        datosConsulta.data.values.pam
          ? `<strong>PAM: </strong> ${datosConsulta.data.values.pam}`
          : ""
      }
    </div>
  </div>`;

    // Frecuencia (mostrar si al menos uno de los valores existe)
    if (
      datosConsulta.data.values.frecC ||
      datosConsulta.data.values.frecR ||
      datosConsulta.data.values.ayuno !== undefined
    ) {
      contenido += `<h4 style="margin: 0.1rem 0;">Frecuencia</h4>
        <div style="margin: 0.1rem 0;">
          <div style="display: inline-block; width: 30%;">
            ${
              datosConsulta.data.values.frecC
                ? `<strong>Cardiaca: </strong>${datosConsulta.data.values.frecC}`
                : ""
            }
          </div>
          <div style="display: inline-block; width: 30%;">
            ${
              datosConsulta.data.values.frecR
                ? `<strong>Respiratoria: </strong>${datosConsulta.data.values.frecR}`
                : ""
            }
          </div>
          <div style="display: inline-block; width: 30%;">
            <strong>Ayuno: </strong>${
              datosConsulta.data.values.ayuno ? "SI" : "NO"
            }
          </div>
        </div>`;
    }

    if (
      datosConsulta.data.values.anestesia ||
      datosConsulta.data.values.respiracion
    ) {
      contenido += `<div style="margin: 0.2rem 0;">
        <div style="display: inline-block; width: 30%;">
          ${
            datosConsulta.data.values.anestesia &&
            datosConsulta.data.values.anestesia.text
              ? `<strong>Anestesia: </strong> ${datosConsulta.data.values.anestesia.text}`
              : ""
          }
        </div>
        <div style="display: inline-block; width: 30%;">
          ${
            datosConsulta.data.values.respiracion &&
            datosConsulta.data.values.respiracion.text
              ? `<strong>Respiración: </strong>${datosConsulta.data.values.respiracion.text}`
              : ""
          }
        </div>
      </div>`;
    }

    // Agentes inhalados
    if (datosConsulta.data.values.agentesInhalados) {
      contenido += `<h4 style="margin: 0.1rem 0;">Agentes inhalados</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.agentesInhalados}</p>`;
    }

    // Agente EV
    if (datosConsulta.data.values.agentesEV) {
      contenido += `<h4 style="margin: 0.1rem 0;">Agente EV</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.agentesEV}</p>`;
    }

    // Bloqueos
    if (datosConsulta.data.values.bloqueo) {
      contenido += `<h4 style="margin: 0.1rem 0;">Bloqueos</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.bloqueo}</p>`;
    }

    // Mantenimientos
    if (datosConsulta.data.values.mantenimientos) {
      contenido += `<h4 style="margin: 0.1rem 0;">Mantenimientos</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.mantenimientos}</p>`;
    }

    if (datosConsulta.data.values.sat02 || datosConsulta.data.values.etc02) {
      contenido += `<div style="margin: 0.1rem 0;">
        <div style="display: inline-block; width: 30%; vertical-align: top;">
          ${
            datosConsulta.data.values.sat02
              ? `<p style="margin: 0.1rem 0;"><strong>SAT02: </strong>${datosConsulta.data.values.sat02}</p>`
              : ""
          }
        </div>
        <div style="display: inline-block; width: 30%; vertical-align: top;">
          ${
            datosConsulta.data.values.etc02
              ? `<p style="margin: 0.1rem 0;"><strong>ETCO2: </strong>${datosConsulta.data.values.etc02}</p>`
              : ""
          }
        </div>
      </div>`;
    }

    // Posición
    if (datosConsulta.data.values.posicion) {
      contenido += `<div style="margin: 0.05rem 0;"><span style="font-weight: bold;">Posición: </span>${datosConsulta.data.values.posicion}</div>`;
    }

    // EKG
    if (datosConsulta.data.values.ekg) {
      contenido += `<div style="margin: 0.05rem 0;"><span style="font-weight: bold;">EKG: </span>${datosConsulta.data.values.ekg}</div>`;
    }

    // Temp
    if (datosConsulta.data.values.temp) {
      contenido += `<div style="margin: 0.05rem 0;"><span style="font-weight: bold;">Temp: </span>${datosConsulta.data.values.temp}</div>`;
    }

    // Cam
    if (datosConsulta.data.values.cam) {
      contenido += `<div style="margin: 0.05rem 0;"><span style="font-weight: bold;">Cam: </span>${datosConsulta.data.values.cam}</div>`;
    }

    //Observaciones postquirurgicas
    if (datosConsulta.data.observacionesPostQuirurgicas.exists === true) {
      contenido += `<h3 style="margin: 0.1rem 0;">Observaciones Post-Quirúrgicas</h3>
  <hr style="margin: 0.25rem 0;">
  <table style="width: 100%; border-collapse: collapse; margin: 0.5rem 0; font-size: 0.9rem;">
    <thead>
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">#</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha/Hora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Observación</th>
      </tr>
    </thead>
    <tbody>`;

      // Añadir cada registro como fila de la tabla
      datosConsulta.data.observacionesPostQuirurgicas.registros.forEach(
        (registro) => {
          contenido += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.index}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.fechaHora}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${registro.observacion}</td>
      </tr>`;
        }
      );

      contenido += `
    </tbody>
  </table>`;
    }

    contenido += `<h3 style="margin: 0.1rem 0;">Egreso</h3>
    <hr style="margin: 0.25rem 0;">`;

    // Diagnóstico de ingreso
    if (datosConsulta.data.values.diagnosticoIngreso) {
      contenido += `<h4 style="margin: 0.1rem 0;">Diagnóstico de ingreso</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.diagnosticoIngreso}</p>`;
    }

    // Procedimientos
    if (datosConsulta.data.values.procedimientos) {
      contenido += `<h4 style="margin: 0.1rem 0;">Procedimientos</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.procedimientos}</p>`;
    }

    // Diagnóstico de egreso
    if (datosConsulta.data.values.diagnosticoEgreso) {
      contenido += `<h4 style="margin: 0.1rem 0;">Diagnóstico de egreso</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.diagnosticoEgreso}</p>`;
    }

    // Tratamiento
    if (datosConsulta.data.values.tratamiento) {
      contenido += `<h4 style="margin: 0.1rem 0;">Tratamiento</h4>
        <p style="margin: 0.1rem 0;">${datosConsulta.data.values.tratamiento}</p>`;
    }
  } else if (datosConsulta.clinical_record_type_id == 64) {
    // console.log("Informe Neuro");
    // contenido += `<p>Neuro</p>`;
    if (datosConsulta.data.informeMensualTrimestral.exists === true) {
      // console.log("Informe Mensual Trimestral");
      // contenido += `<h3 class="text-primary" style="margin: 0.25rem 0 0.25rem 0;">Informe Mensual Trimestral</h3>`;
      contenido += `<div style="margin: 0.1rem 0;">
      <div style="display: inline-block; width: 49%; vertical-align: top;">
        <p style="margin: 0.1rem 0;"><strong>Tipo:</strong> ${datosConsulta.data.values.tipoInforme}</p>
      </div>
      <div style="display: inline-block; width: 49%; vertical-align: top;">
        <p style="margin: 0.1rem 0;"><strong>Especialidad:</strong> ${datosConsulta.data.values.especialidad}</p>
      </div>
    </div>`;
      datosConsulta.data.informeMensualTrimestral.registros.forEach(
        (registro) => {
          contenido += `<p style="margin: 0.1rem 0;"><strong>${registro.tipoTitulo}:</strong> ${registro.detalle}</p>`;
        }
      );
    }
  } else if (datosConsulta.data.tabsStructure) {
    // Contenido con estructura de tabs
    contenido += generarContenidoTabs();
  } else if (datosConsulta.clinical_record_type_id === 33) {
    contenido += generarTablaQueratometria();

    // Agregar información de antecedentes oftalmológicos
    const antecedentes = [
      {
        id: "disminucionVision",
        label: "Disminución de la visión",
        value: datosConsulta.data.values.disminucionVision,
      },
      {
        id: "estrabismo",
        label: "Estrabismo",
        value: datosConsulta.data.values.estrabismo,
      },
      {
        id: "glaucoma",
        label: "Glaucoma",
        value: datosConsulta.data.values.glaucoma,
      },
      {
        id: "ambliopia",
        label: "Ambliopia",
        value: datosConsulta.data.values.ambliopia,
      },
      {
        id: "fumador",
        label: "Fumador",
        value: datosConsulta.data.values.fumador,
      },
      {
        id: "otrosInfo",
        label: "Otros",
        value: datosConsulta.data.values.otrosInfo,
      },
    ].filter(
      (item) => item.value && item.value !== "no" && item.value !== "noAplica"
    );

    if (antecedentes.length > 0) {
      contenido += `<h3 class="text-primary" style="margin: 0.25rem 0 0.25rem 0;">Antecedentes Oftalmológicos</h3>
      <hr style="margin: 0.25rem 0 0.5rem 0;">
      <ul>`;

      antecedentes.forEach((item) => {
        contenido += `<li><strong>${
          item.label
        }:</strong> ${formatearValorOpcion(item.value)}</li>`;
      });

      contenido += `</ul>`;
    }
  }

  // SECCIONES ADICIONALES PARA TODOS LOS TIPOS DE CONSULTA
  const ordenSecciones = [
    { nombre: "diagnosticos", titulo: "Diagnósticos" },
    { nombre: "proximaCita", titulo: "Próxima Cita" },
    { nombre: "receta", titulo: "Receta Médica" },
    { nombre: "incapacidad", titulo: "Incapacidad Médica" },
    { nombre: "examenes", titulo: "Exámenes Solicitados" },
    { nombre: "remision", titulo: "Remisión" },
  ];

  // Agregar secciones adicionales en el orden especificado
  ordenSecciones.forEach((seccion) => {
    if (seccionesAdicionales[seccion.nombre]) {
      const contenidoSeccion = seccionesAdicionales[seccion.nombre]();
      if (contenidoSeccion) {
        contenido += `
          <div style="margin: 0;">
            <h3 class="text-primary" style="margin: 0.30rem 0 0 0;">${seccion.titulo}</h3>
            <hr style="margin: 0.25rem 0;">
            ${contenidoSeccion}
          </div>
        `;
      }
    }
  });

  contenido += `</div>`;

  // Obtener datos adicionales
  const [datosPaciente, datosEmpresa, datosDoctor] = await Promise.all([
    consultarDatosPaciente(
      datosConsulta.patient_id,
      formatearFechaQuitarHora(datosConsulta.created_at)
    ),
    consultarDatosEmpresa(),
    consultarDatosDoctor(datosConsulta.created_by_user_id),
  ]);
  // console.log("Datos doctor: ", datosDoctor);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoReceta(recetaId) {
  let url = obtenerRutaPrincipal() + `/medical/recipes/${recetaId}`;
  let resultado = await obtenerDatos(url);

  // let urlConsulta =
  //   obtenerRutaPrincipal() + `/medical/clinical-records/${consulta_id}`;
  // let datosConsulta = await obtenerDatos(urlConsulta);
  // console.log("Datos de la consulta: ", datosConsulta);

  let datosReceta = resultado.data;
  console.log("Datos de la receta: ", datosReceta);

  let contenido = `
  <div class="container border rounded shadow-sm text-start" style="margin: 0; padding: 0;">
    <h3 class="text-primary text-center" style="margin: 0; padding: 0;">Receta Médica</h3>
`;

  if (datosReceta.recipe_items.length > 0) {
    datosReceta.recipe_items.forEach((item, index) => {
      contenido += `
      <div style="margin-bottom: 5px;">
        <p style="margin: 0;"><strong>${index + 1}. Nombre:</strong> ${
        item.medication
      } - <strong>Concentración:</strong> ${
        item.concentration
      } - <strong>Tipo:</strong> ${item.medication_type}</p>
        <p style="margin: 0;"><strong>Frecuencia:</strong> ${
          item.frequency
        } - <strong>Duración:</strong> ${
        item.duration
      } días - <strong>Toma cada:</strong> ${
        item.take_every_hours
      } horas - <strong>Cantidad:</strong> ${item.quantity}</p>
        <p style="margin: 0;"><strong>Observaciones:</strong> ${
          item.observations || "Sin observaciones"
        }</p>
      </div>
      <hr>`;
    });
  } else {
    contenido += `
    <p class="text-muted fst-italic">No hay medicamentos en esta receta</p>`;
  }

  contenido += `
  </div>`;

  let datosPaciente = await consultarDatosPaciente(
    datosReceta.patient_id,
    formatearFechaQuitarHora(datosReceta.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(datosReceta.prescriber.id);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoOrden(ordenId) {
  let url = obtenerRutaPrincipal() + `/medical/exam-orders/${ordenId}`;
  let dataState = await obtenerDatos(url);

  let state = getOrdenState(dataState.exam_order_state.name);

  let contenido = `
  <div class="container border rounded shadow-sm text-start">
    <h3 class="text-primary text-center" style="margin-top: 0; margin-bottom: 0;">Orden de Examen Médico</h3>
    <hr style="margin: 0.25rem 0;">
    <h4 class="text-secondary" style="margin-top: 0; margin-bottom: 0;">Detalles del examen:</h4>
    <div style="display: table; width: 100%;">
  <div style="display: table-row;">
    <div style="display: table-cell; width: 50%;"><p style="margin: 0;"><strong>Tipo de examen:</strong> ${dataState.exam_type.name}</p></div>
    <div style="display: table-cell; width: 50%;"><p style="margin: 0;"><strong>Estado:</strong> ${state}</p></div>
  </div>
</div>
    <hr style="margin: 0.25rem 0;">
  `;

  const result = dataState?.exam_result?.results || {};
  const defaultForm = dataState.exam_type.form_config.values || {};
  const filledForm = { ...defaultForm };

  for (const key in result) {
    if (result.hasOwnProperty(key) && filledForm.hasOwnProperty(key)) {
      filledForm[key] = result[key];
    }
  }

  dataState.exam_type.form_config.values = filledForm;

  // Iteramos por las tarjetas y campos dinámicos del examen
  dataState.exam_type.form_config.tabs.forEach((tab) => {
    contenido += `<h4 class="text-secondary" style="margin-top: 0; margin-bottom: 0;">${tab.tab}</h4>`;

    tab.cards.forEach((card) => {
      contenido += `<h5 class="text-primary" style="margin-top: 0; margin-bottom: 0;">${card.title}</h5>`;

      card.fields.forEach((field) => {
        contenido += `
        <p style="margin-bottom: 0; margin-top: 0;"><strong>${
          field.label
        }</strong></p>
        <div style="margin-bottom: 0; margin-top: 0;">${
          dataState.exam_type.form_config.values[field.id] || "Sin datos"
        }</div>
        `;
      });
    });
    contenido += `<hr style="margin: 0.25rem 0;">`;
  });

  contenido += `</div>`;

  let datosPaciente = await consultarDatosPaciente(
    dataState.patient_id,
    formatearFechaQuitarHora(dataState.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(1);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoRecetaOrden(ordenId) {
  let url = obtenerRutaPrincipal() + `/medical/exam-recipes/${ordenId}`;
  let datosExamen = await obtenerDatos(url);

  let contenido = `
  <div class="container border rounded shadow-sm p-3">
    <h4 class="text-secondary text-start mb-2" style="margin-top: 0; margin-bottom: 5px;">Exámenes Solicitados</h4>
    <div class="card exam-card mb-3 p-2">
      <table style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f8f9fa; border: 1px solid #dee2e6;">
          <tr>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Nombre</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Cantidad</th>
            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Descripción</th>
          </tr>
        </thead>
        <tbody>
          ${
            datosExamen.details.length > 0
              ? datosExamen.details
                  .map(
                    (detalle) => `
              <tr>
                <td style="border: 1px black; padding: 8px;">${
                  detalle.exam_type.name
                }</td>
                <td style="border: 1px black; padding: 8px;">1</td>
                <td style="border: 1px black; padding: 8px;">${
                  detalle.exam_type.description || "Sin descripción"
                }</td>
              </tr>
            `
                  )
                  .join("")
              : `<tr><td colspan="3" style="border: 1px solid #dee2e6; padding: 8px; text-align: center; color: #6c757d; font-style: italic;">No hay exámenes en esta solicitud</td></tr>`
          }
        </tbody>
      </table>
    </div>
  </div>
`;

  let datosPaciente = await consultarDatosPaciente(
    datosExamen.patient_id,
    formatearFechaQuitarHora(datosExamen.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(datosExamen.user.id);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

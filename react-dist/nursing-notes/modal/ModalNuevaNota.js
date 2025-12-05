import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
const ModalNuevaNota = ({
  visible,
  onHide,
  onGuardarNota,
  enfermeras,
  loading,
  initialData
}) => {
  const [nuevaNota, setNuevaNota] = useState({
    tituloNota: '',
    user_id: '',
    note: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Efecto para cargar datos iniciales cuando se edita
  useEffect(() => {
    if (initialData) {
      setNuevaNota({
        tituloNota: initialData.tituloNota || initialData.titulo || '',
        user_id: initialData.user_id || '',
        note: initialData.nota || initialData.note || ''
      });
    } else {
      setNuevaNota({
        tituloNota: '',
        user_id: '',
        note: ''
      });
    }
  }, [initialData, visible]);
  const opcionesEnfermeras = enfermeras.map(enfermera => ({
    label: enfermera.nombre || `Enfermera ${enfermera.id}`,
    value: enfermera.id.toString()
  }));
  const handleInputChange = (field, value) => {
    setNuevaNota(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleGuardar = async () => {
    if (!nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note) {
      return;
    }
    setSubmitting(true);
    try {
      // Preparar los datos en el formato que espera el servidor
      const datosParaGuardar = {
        tituloNota: nuevaNota.tituloNota,
        user_id: nuevaNota.user_id,
        note: nuevaNota.note,
        guardarNota: "" // Campo vacío como requiere el servidor
      };
      await onGuardarNota(datosParaGuardar);
      setNuevaNota({
        tituloNota: '',
        user_id: '',
        note: ''
      });
      onHide();
    } catch (error) {
      console.error('Error guardando nota:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleCancelar = () => {
    setNuevaNota({
      tituloNota: '',
      user_id: '',
      note: ''
    });
    onHide();
  };
  const footer = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    onClick: handleCancelar,
    className: "p-button-text",
    disabled: submitting
  }), /*#__PURE__*/React.createElement(Button, {
    label: initialData ? "Actualizar Nota" : "Guardar Nota",
    icon: "pi pi-check",
    onClick: handleGuardar,
    loading: submitting,
    disabled: !nuevaNota.tituloNota || !nuevaNota.user_id || !nuevaNota.note
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: initialData ? "Editar Nota" : "Nueva Nota",
    visible: visible,
    style: {
      width: '50vw'
    },
    footer: footer,
    onHide: handleCancelar,
    closable: !submitting
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tituloNota",
    className: "block text-sm font-medium mb-2"
  }, "T\xEDtulo *"), /*#__PURE__*/React.createElement(InputText, {
    id: "tituloNota",
    value: nuevaNota.tituloNota,
    onChange: e => handleInputChange('tituloNota', e.target.value),
    placeholder: "Ingrese el t\xEDtulo de la nota",
    className: "w-full",
    disabled: submitting
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "user_id",
    className: "block text-sm font-medium mb-2"
  }, "Enfermera *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "user_id",
    value: nuevaNota.user_id,
    options: opcionesEnfermeras,
    onChange: e => handleInputChange('user_id', e.value),
    placeholder: "Seleccione una opci\xF3n",
    className: "w-full",
    disabled: submitting || loading
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "note",
    className: "block text-sm font-medium mb-2"
  }, "Nota *"), /*#__PURE__*/React.createElement(InputTextarea, {
    id: "note",
    value: nuevaNota.note,
    onChange: e => handleInputChange('note', e.target.value),
    rows: 4,
    placeholder: "Escriba la nota aqu\xED",
    className: "w-full",
    disabled: submitting
  }))));
};
export default ModalNuevaNota;
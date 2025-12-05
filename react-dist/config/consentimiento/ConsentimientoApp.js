import React, { useState } from 'react';
import ConsentimientoTable from './components/ConsentimientoTable.js';
import { getColumns } from './enums/columns.js';
import { useGetData } from './hooks/ConsentimientoGetData.js';
import { ConsentimientoFormModal } from './components/ConsentimientoFormModal.js';
import { consentimientoService } from '../../../services/api/index.js';
import { SwalManager } from "../../../services/alertManagerImported.js";
import { url } from '../../../services/globalMedical.js';
import { Button } from 'primereact/button';
const ConsentimientoApp = () => {
  const {
    data,
    loading,
    error,
    reload
  } = useGetData();
  const [showConsentimientoFormModal, setShowConsentimientoFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [currentConsentimiento, setCurrentConsentimiento] = useState(null);
  const onCreate = () => {
    console.log("Debug: ColumnActionsProps loaded");
    setCurrentConsentimiento(null);
    setInitialData({
      tenant_id: "",
      title: "",
      data: "",
      template_type_id: 0,
      description: ""
    });
    setShowConsentimientoFormModal(true);
  };
  const editConsentimiento = async id => {
    try {
      // Buscar el consentimiento en los datos actuales
      const consentimientoToEdit = data.find(consentimiento => consentimiento.id === id);
      if (consentimientoToEdit) {
        setCurrentConsentimiento(consentimientoToEdit);
        setInitialData({
          tenant_id: consentimientoToEdit.tenant_id,
          title: consentimientoToEdit.title,
          data: consentimientoToEdit.data,
          template_type_id: consentimientoToEdit.template_type_id,
          description: consentimientoToEdit.description
        });
        setShowConsentimientoFormModal(true);
      } else {
        SwalManager.error({
          title: "Error",
          text: "No se pudo encontrar el consentimiento a editar"
        });
      }
    } catch (error) {
      console.error('Error al preparar edición:', error);
      SwalManager.error({
        title: "Error",
        text: "Error al cargar los datos del consentimiento"
      });
    }
  };
  const deleteConsentimiento = async id => {
    console.log("Debug: deleteConsentimiento loaded", id);
    SwalManager.confirmDelete(async () => {
      await consentimientoService.delete(id);
      // Actualizar el estado local eliminando el elemento
      reload();
      SwalManager.success();
    });
  };
  const handleSubmit = async formData => {
    try {
      const tenant_id = url.split('.')[0];
      const newData = {
        ...formData,
        tenant_id
      };
      if (currentConsentimiento) {
        await consentimientoService.update(currentConsentimiento.id, newData);
        SwalManager.success({
          title: "Consentimiento actualizado"
        });
      } else {
        await consentimientoService.create(newData);
        SwalManager.success({
          title: "Consentimiento creado"
        });
      }
      reload();
    } catch (error) {
      console.error("Error creating/updating consentimiento: ", error);
      SwalManager.error({
        title: "Error",
        text: "Ha ocurrido un error al procesar la solicitud"
      });
    } finally {
      setShowConsentimientoFormModal(false);
      setCurrentConsentimiento(null);
      setInitialData(null);
    }
  };
  const handleHideConsentimientoFormModal = () => {
    setShowConsentimientoFormModal(false);
    setCurrentConsentimiento(null);
    setInitialData(null);
  };
  const columns = getColumns({
    editConsentimiento,
    deleteConsentimiento
  });
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React.createElement("strong", null, "Error:"), " ", error, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-sm btn-outline-danger ms-2",
      onClick: reload
    }, "Reintentar"));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-1"
  }, "Configuraci\xF3n de Consentimientos"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCreate,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    label: "Nuevo Consentimiento"
  })))), /*#__PURE__*/React.createElement(ConsentimientoTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: reload
  }), /*#__PURE__*/React.createElement(ConsentimientoFormModal, {
    title: currentConsentimiento ? "Editar Consentimiento" : "Crear Consentimiento",
    show: showConsentimientoFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideConsentimientoFormModal,
    initialData: initialData
  })));
};
export default ConsentimientoApp;
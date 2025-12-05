import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useMassMessage } from "./hooks/useMassMessage.js";
import { useMassMessagesAll } from "./hooks/useMassMessagesAll.js";
import { MassMessageTable } from "./MassMessageTable.js";
import { MassMessageFormModal } from "./MassMessageFormModal.js";
import { Dialog } from "primereact/dialog";
import { massMessageMedicalService } from "../../../services/api/index.js";
export const MassMessageApp = () => {
  const {
    massMessage,
    setMassMessage,
    fetchMassMessage
  } = useMassMessage();
  const {
    massMessages,
    setMassMessages,
    fetchMassMessages,
    loading
  } = useMassMessagesAll();
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  useEffect(() => {
    fetchMassMessages();
  }, []);
  useEffect(() => {
    if (massMessage) {
      setInitialData(massMessage);
    }
  }, [massMessage]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (massMessage) {
        const response = await massMessageMedicalService.update(massMessage.id, data);
        SwalManager.success({
          title: "Registro actualizado"
        });
      } else {
        const response = await massMessageMedicalService.create(data);
        SwalManager.success();
      }
    } catch (error) {
      console.error("Error creating/updating comission config: ", error);
    } finally {
      setShowFormModal(false);
      await fetchMassMessages();
    }
  };
  const handleHideFormModal = () => {
    setShowFormModal(false);
  };
  const handleTableEdit = id => {
    fetchMassMessage(id);
    setShowFormModal(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nuevo Mensaje"))), /*#__PURE__*/React.createElement(MassMessageTable, {
    massMessages: massMessages,
    onEditItem: handleTableEdit,
    onDeleteItem: fetchMassMessages,
    loading: loading
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Mensaje Masivo",
    visible: showFormModal,
    style: {
      width: "75vw",
      height: "90vh"
    },
    onHide: () => {
      if (!showFormModal) return;
      setShowFormModal(false);
      setMassMessage(null);
    }
  }, /*#__PURE__*/React.createElement(MassMessageFormModal, {
    handleSubmit: handleSubmit,
    initialData: initialData
  }))));
};
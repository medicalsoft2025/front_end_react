import React, { useState } from 'react';
import { useEffect } from 'react';
import CustomDataTable from "../components/CustomDataTable.js";
import { formatDate } from "../../services/utilidades.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { cancelConsultationClaim } from "../../services/koneksiService.js";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useUsers } from "../users/hooks/useUsers.js";
import { usePatients } from "../patients/hooks/usePatients.js";
import { useEntities } from "../entities/hooks/useEntities.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UpdateAdmissionAuthorizationForm } from "./UpdateAdmissionAuthorizationForm.js";
import { CustomModal } from "../components/CustomModal.js";
import { admissionService } from "../../services/api/index.js";
export const AdmissionTable = ({
  items,
  onReload
}) => {
  const {
    users
  } = useUsers();
  const {
    patients
  } = usePatients();
  const {
    entities
  } = useEntities();
  const [tableItems, setTableItems] = useState([]);
  const [filteredTableItems, setFilteredTableItems] = useState([]);
  const [selectedAdmittedBy, setSelectedAdmittedBy] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedDate, setSelectedDate] = React.useState([new Date(), new Date()]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [showUpdateAuthorizationModal, setShowUpdateAuthorizationModal] = useState(false);
  const [showAttachFileModal, setShowAttachFileModal] = useState(false);
  useEffect(() => {
    const mappedItems = items.map(item => {
      return {
        createdAt: formatDate(item.created_at),
        admittedBy: `${item.user.first_name || ''} ${item.user.middle_name || ''} ${item.user.last_name || ''} ${item.user.second_last_name || ''}`,
        patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`,
        entityName: item.entity.name || '--',
        koneksiClaimId: item.koneksi_claim_id,
        patientDNI: item.patient.document_number || '--',
        authorizationNumber: item.authorization_number || '--',
        authorizedAmount: item.entity_authorized_amount || '0.00',
        originalItem: item
      };
    });
    setTableItems(mappedItems);
  }, [items]);

  // Aplicar filtros cuando cambia alguno de ellos
  useEffect(() => {
    if (tableItems.length === 0) return;
    let result = [...tableItems];
    if (selectedAdmittedBy) {
      result = result.filter(item => item.originalItem.user.id === selectedAdmittedBy);
    }
    if (selectedPatient) {
      result = result.filter(item => item.originalItem.patient.id === selectedPatient);
    }
    if (selectedEntity) {
      result = result.filter(item => item.originalItem.entity.id === selectedEntity);
    }
    if (selectedDate && selectedDate[0] && selectedDate[1]) {
      selectedDate[0].setHours(0, 0, 0, 0);
      selectedDate[1].setHours(0, 0, 0, 0);
      const startDate = new Date(selectedDate[0]);
      const endDate = new Date(selectedDate[1]);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(item => {
        const itemDate = new Date(item.originalItem.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    setFilteredTableItems(result);
  }, [selectedAdmittedBy, selectedPatient, selectedEntity, selectedDate, tableItems]);
  const columns = [{
    data: 'createdAt'
  }, {
    data: 'admittedBy'
  }, {
    data: 'patientName'
  }, {
    data: 'patientDNI'
  }, {
    data: 'entityName'
  }, {
    data: 'authorizationNumber'
  }, {
    data: 'authorizedAmount',
    type: 'currency'
  }, {
    orderable: false,
    searchable: false
  }];
  const cancelClaim = claimId => {
    //console.log('Cancel claim with ID:', claimId);
    SwalManager.confirmCancel(async () => {
      try {
        const response = await cancelConsultationClaim(claimId);

        //console.log(response);

        SwalManager.success({
          title: 'Éxito',
          text: 'Reclamación anulada con éxito.'
        });
      } catch (error) {
        SwalManager.error({
          title: 'Error',
          text: 'No se pudo anular la reclamación.'
        });
      }
    });
  };
  const openUpdateAuthorizationModal = admissionId => {
    //console.log('Open update authorization modal with admission ID:', admissionId);
    setSelectedAdmissionId(admissionId);
    setShowUpdateAuthorizationModal(true);
  };
  const openAttachDocumentModal = async admissionId => {
    setSelectedAdmissionId(admissionId);
    setShowAttachFileModal(true);
  };
  const handleUploadDocument = async () => {
    try {
      //@ts-ignore
      const minioId = await guardarDocumentoAdmision('admissionDocumentInput', selectedAdmissionId);
      if (minioId !== undefined) {
        //console.log("PDF de prueba:", minioId);
        //console.log("Resultado de la promesa:", minioId);
        await admissionService.update(selectedAdmissionId, {
          document_minio_id: minioId.toString()
        });
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      setShowAttachFileModal(false);
      onReload && onReload();
    }
  };
  const seeDocument = async minioId => {
    if (minioId) {
      //@ts-ignore
      const url = await getFileUrl(minioId);
      window.open(url, '_blank');
      return;
    }
    SwalManager.error({
      title: 'Error',
      text: 'No se pudo visualizar el documento adjunto.'
    });
  };
  const slots = {
    7: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openUpdateAuthorizationModal(data.originalItem.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pencil",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Actualizar informaci\xF3n de autorizaci\xF3n")))), !data.originalItem.document_minio_id && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openAttachDocumentModal(data.originalItem.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Adjuntar documento")))), data.originalItem.document_minio_id && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => seeDocument(data.originalItem.document_minio_id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Ver documento adjunto")))), data.koneksiClaimId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => cancelClaim(data.koneksiClaimId)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: '20px'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Anular reclamaci\xF3n")))))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar admisiones")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Admisionado entre"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "admittedBy",
    className: "form-label"
  }, "Admisionado por"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "admittedBy",
    options: users,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Admisionado por",
    className: "w-100",
    value: selectedAdmittedBy,
    onChange: e => setSelectedAdmittedBy(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "patient",
    className: "form-label"
  }, "Paciente"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "patient",
    options: patients,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Paciente",
    className: "w-100",
    value: selectedPatient,
    onChange: e => setSelectedPatient(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "entity",
    className: "form-label"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "entity",
    options: entities,
    optionLabel: "label",
    optionValue: "id",
    filter: true,
    placeholder: "Entidad",
    className: "w-100",
    value: selectedEntity,
    onChange: e => setSelectedEntity(e.value),
    showClear: true
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: filteredTableItems,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Admisionado el"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Admisionado por"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero de identificaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero de autorizaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Monto autorizado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "updateAdmissionAuthorization",
    title: "Actualizar informaci\xF3n de autorizaci\xF3n",
    show: showUpdateAuthorizationModal,
    onHide: () => setShowUpdateAuthorizationModal(false)
  }, /*#__PURE__*/React.createElement(UpdateAdmissionAuthorizationForm, {
    formId: "updateAdmissionAuthorization",
    admissionId: selectedAdmissionId
  })), /*#__PURE__*/React.createElement(CustomModal, {
    title: "Subir documento adjunto",
    show: showAttachFileModal,
    onHide: () => setShowAttachFileModal(false),
    footerTemplate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: ".pdf",
      id: "admissionDocumentInput"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-secondary",
      onClick: () => setShowAttachFileModal(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: () => {
        handleUploadDocument();
        setShowAttachFileModal(false);
      }
    }, "Confirmar"))
  }, /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")));
};
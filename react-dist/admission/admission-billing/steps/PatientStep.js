import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { validatePatientStep } from "../utils/helpers.js";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import PatientFormModal from "../../../patients/modals/form/PatientFormModal.js";
import { usePatient } from "../../../patients/hooks/usePatient.js";
import { genders } from "../../../../services/commons.js";
const PatientStepPreview = ({
  formData,
  updateFormData,
  updateBillingData,
  nextStep,
  toast
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: {
      errors
    },
    trigger
  } = useForm({
    defaultValues: formData
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [mappedPatient, setMappedPatient] = useState(null);
  const {
    patient,
    fetchPatient
  } = usePatient(formData.patient.id);
  const [hideInputs, setHideInputs] = useState(false);
  useEffect(() => {
    if (patient) {
      const mappedPatientData = {
        id: patient.id,
        documentType: patient.document_type || "",
        documentNumber: patient.document_number || "",
        firstName: patient.first_name || "",
        middleName: patient.middle_name || "",
        lastName: patient.last_name || "",
        secondLastName: patient.second_last_name || "",
        nameComplet: `${patient.first_name || ""} ${patient.middle_name || ""} ${patient.last_name || ""} ${patient.second_last_name || ""}`,
        birthDate: patient.date_of_birth ? new Date(patient.date_of_birth) : null,
        gender: genders[patient.gender] || "",
        country: patient.country_id || "",
        department: patient.department_id || "",
        city: patient.city_id || "",
        address: patient.address || "",
        email: patient.email || "",
        whatsapp: patient.whatsapp || "",
        bloodType: patient.blood_type || "",
        affiliateType: patient.social_security?.affiliate_type || "",
        insurance: patient.social_security?.entity?.name || "",
        hasCompanion: patient.companions?.length > 0 || false
      };
      setMappedPatient(mappedPatientData);
    }
  }, [patient, formData]);
  const handlePatientChange = (field, value) => {
    updateFormData("patient", {
      [field]: value
    });
  };
  const handleBillingChange = (field, value) => {
    updateBillingData(field, value);
  };
  const toggleBillingType = type => {
    if (type === "entity") {
      updateBillingData("facturacionEntidad", !formData.billing.facturacionEntidad);
      updateBillingData("facturacionConsumidor", false);
      formData.billing.facturacionEntidad = !formData.billing.facturacionEntidad;
      formData.billing.facturacionConsumidor = false;
    } else {
      updateBillingData("facturacionConsumidor", !formData.billing.facturacionConsumidor);
      updateBillingData("facturacionEntidad", false);
      formData.billing.facturacionConsumidor = !formData.billing.facturacionConsumidor;
      formData.billing.facturacionEntidad = false;
    }
    const mappedProducts = formData.products.map(product => ({
      ...product,
      currentPrice: formData.billing.facturacionEntidad ? product.copayment : product.price
    }));
    const matchProductWithEntity = formData.products.map(product => {
      return {
        ...product.matchProductByEntity
      };
    });
    if (matchProductWithEntity.length && matchProductWithEntity[0]?.id > 0) {
      const priceSums = matchProductWithEntity.reduce((total, objeto) => {
        return total + parseFloat(objeto.price);
      }, 0);
      setHideInputs(true);
      handleBillingChange("authorizedAmount", priceSums.toString() || "0");
    }
    formData.products = mappedProducts;
    updateFormData("products", mappedProducts);
    updateFormData("payments", []);
  };
  const toggleCompanion = value => {
    handlePatientChange("hasCompanion", value);
  };
  const handleNext = () => {
    if (validatePatientStep(formData.billing, toast)) {
      nextStep();
    }
  };
  const getFormErrorMessage = name => {
    const nameParts = name.split(".");
    let errorObj = errors;
    for (const part of nameParts) {
      errorObj = errorObj?.[part];
      if (!errorObj) break;
    }
    return errorObj && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errorObj.message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Datos Personales",
    className: "mb-4 shadow-sm border-0 p-4",
    headerClassName: "bg-primary text-white py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Nombre Completo"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.nameComplet || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Documento"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.documentNumber || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "G\xE9nero"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.gender || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.address || "--"))))), /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n Adicional",
    className: "mb-4 shadow-sm border-0 p-4",
    headerClassName: "bg-secondary text-white py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "WhatsApp"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.whatsapp || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.email || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Aseguradora"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.insurance || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Ciudad"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.city || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted small mb-2"
  }, "Tipo de Afiliado"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-light-subtle text-dark"
  }, mappedPatient?.affiliateType || "--"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-item d-flex align-items-end h-100"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Actualizar Paciente",
    className: "p-button-primary p-button-sm w-100",
    icon: "pi pi-user-edit",
    onClick: () => setShowUpdateModal(true)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid px-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 col-md-8 col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n Consumidor",
    className: "h-100 shadow-sm border-0",
    headerClassName: "bg-success text-white py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.billing.facturacionConsumidor,
    onChange: () => toggleBillingType("consumer"),
    className: "me-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium text-muted"
  }, "Facturaci\xF3n a consumidor final")), formData.billing.facturacionConsumidor && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle text-success me-2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-success fw-medium"
  }, "Facturaci\xF3n consumidor activada")))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 col-md-8 col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Facturaci\xF3n por Entidad",
    className: "h-100 shadow-sm border-0 ft-entidad",
    headerClassName: "bg-info text-white py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(InputSwitch, {
    checked: formData.billing.facturacionEntidad,
    onChange: () => toggleBillingType("entity"),
    className: "me-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium text-muted"
  }, "Facturaci\xF3n por entidad")), formData.billing.facturacionEntidad && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 space-y-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "billing.entity",
    control: control,
    rules: {
      required: "Entidad es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-item"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold text-dark"
    }, "Entidad *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100 p-3", {
        "p-invalid border-danger": fieldState.error,
        "border": !fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("entity", e.target.value);
      },
      disabled: true
    }), getFormErrorMessage("billing.entity"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-item"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold text-dark"
    }, "Fecha de autorizaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
      className: "w-100",
      inputClassName: "p-3 border",
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        handleBillingChange("authorizationDate", e.value);
      },
      dateFormat: "dd/mm/yy",
      showIcon: true,
      appendTo: "self"
    }))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizationNumber",
    control: control,
    rules: {
      required: "Número de autorización es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-item"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold text-dark"
    }, "N\xB0 Autorizaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
      className: classNames("w-100 p-3", {
        "p-invalid border-danger": fieldState.error,
        "border": !fieldState.error
      }),
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizationNumber", e.target.value);
      },
      placeholder: "Ingrese el n\xFAmero de autorizaci\xF3n"
    }), getFormErrorMessage("billing.authorizationNumber"))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "billing.authorizedAmount",
    control: control,
    rules: {
      required: "Monto autorizado es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "field-item",
      style: {
        display: hideInputs ? "none" : "block"
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold text-dark"
    }, "Monto Autorizado"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100 p-3 border",
      value: field.value || "",
      onChange: e => {
        field.onChange(e.target.value);
        handleBillingChange("authorizedAmount", e.target.value);
      },
      placeholder: "0.00"
    }))
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    iconPos: "right",
    icon: "pi pi-arrow-right",
    onClick: handleNext,
    className: "p-button-primary px-4 py-2"
  })), /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showUpdateModal,
    onHide: () => setShowUpdateModal(false),
    onSuccess: () => {
      fetchPatient();
      setShowUpdateModal(false);
    },
    patientData: patient
  }), /*#__PURE__*/React.createElement("style", null, `
     
        .p-card .p-card-header {
          border-radius: 8px 8px 0 0 !important;
        }
        .p-card {
          border-radius: 10px !important;
          transition: box-shadow 0.3s ease;
        }
        
        .p-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .bg-light-subtle {
          background-color: #f8f9fa !important;
        }
        .space-y-3 > * + * {
          margin-top: 1rem;
        }
        
        .admission-billing-card .p-card-body{
        margin-left: 20px !important;
            padding: 10px 20px !important;
        }
      `));
};
export default PatientStepPreview;
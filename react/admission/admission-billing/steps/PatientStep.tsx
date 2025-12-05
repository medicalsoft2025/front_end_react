import React, { useEffect, useState } from "react";
import {
  AdmissionBillingFormData,
  BillingData,
  PatientData,
  PatientStepProps,
} from "../interfaces/AdmisionBilling";
import { Controller, useForm } from "react-hook-form";
import { validatePatientStep } from "../utils/helpers";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { genderOptions } from "../utils/constants";
import PatientFormModal from "../../../patients/modals/form/PatientFormModal";
import { Patient } from "../../../models/models";
import { usePatient } from "../../../patients/hooks/usePatient";
import { genders } from "../../../../services/commons";

const PatientStepPreview: React.FC<PatientStepProps> = ({
  formData,
  updateFormData,
  updateBillingData,
  nextStep,
  toast,
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<AdmissionBillingFormData>({
    defaultValues: formData,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [mappedPatient, setMappedPatient] =
    useState<Partial<PatientData> | null>(null);
  const { patient, fetchPatient } = usePatient(formData.patient.id);
  const [hideInputs, setHideInputs] = useState(false);

  useEffect(() => {
    if (patient) {
      const mappedPatientData: Partial<PatientData> = {
        id: patient.id,
        documentType: patient.document_type || "",
        documentNumber: patient.document_number || "",
        firstName: patient.first_name || "",
        middleName: patient.middle_name || "",
        lastName: patient.last_name || "",
        secondLastName: patient.second_last_name || "",
        nameComplet: `${patient.first_name || ""} ${patient.middle_name || ""
          } ${patient.last_name || ""} ${patient.second_last_name || ""}`,
        birthDate: patient.date_of_birth
          ? new Date(patient.date_of_birth)
          : null,
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
        hasCompanion: patient.companions?.length > 0 || false,
      };
      setMappedPatient(mappedPatientData);
    }
  }, [patient, formData]);

  const handlePatientChange = <K extends keyof PatientData>(
    field: K,
    value: any
  ) => {
    updateFormData("patient", { [field]: value });
  };

  const handleBillingChange = <K extends keyof BillingData>(
    field: K,
    value: any
  ) => {
    updateBillingData(field, value);
  };

  const toggleBillingType = (type: "entity" | "consumer") => {
    if (type === "entity") {
      updateBillingData(
        "facturacionEntidad",
        !formData.billing.facturacionEntidad
      );
      updateBillingData("facturacionConsumidor", false);
      formData.billing.facturacionEntidad =
        !formData.billing.facturacionEntidad;
      formData.billing.facturacionConsumidor = false;
    } else {
      updateBillingData(
        "facturacionConsumidor",
        !formData.billing.facturacionConsumidor
      );
      updateBillingData("facturacionEntidad", false);
      formData.billing.facturacionConsumidor =
        !formData.billing.facturacionConsumidor;
      formData.billing.facturacionEntidad = false;
    }

    const mappedProducts = formData.products.map((product) => ({
      ...product,
      currentPrice: formData.billing.facturacionEntidad
        ? product.copayment
        : product.price,
    }));

    const matchProductWithEntity = formData.products.map((product) => {
      return {
        ...product.matchProductByEntity,
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

  const toggleCompanion = (value: boolean) => {
    handlePatientChange("hasCompanion", value);
  };

  const handleNext = () => {
    if (validatePatientStep(formData.billing, toast)) {
      nextStep();
    }
  };

  const getFormErrorMessage = (name: string) => {
    const nameParts = name.split(".");
    let errorObj = errors as any;

    for (const part of nameParts) {
      errorObj = errorObj?.[part];
      if (!errorObj) break;
    }

    return errorObj && <small className="p-error">{errorObj.message}</small>;
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Datos Personales Card */}
        <Card
          title="Datos Personales"
          className="mb-4 shadow-sm border-0 p-4"
          headerClassName="bg-primary text-white py-3"
        >
          <div className="row">
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Nombre Completo</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.nameComplet || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Documento</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.documentNumber || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Género</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.gender || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Dirección</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.address || "--"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Información Adicional Card */}
        <Card
          title="Información Adicional"
          className="mb-4 shadow-sm border-0 p-4"
          headerClassName="bg-secondary text-white py-3"
        >
          <div className="row">
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">WhatsApp</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.whatsapp || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Correo Electrónico</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.email || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Aseguradora</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.insurance || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Ciudad</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.city || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item">
                <label className="form-label fw-semibold text-muted small mb-2">Tipo de Afiliado</label>
                <div className="p-3 border rounded bg-light-subtle text-dark">
                  {mappedPatient?.affiliateType || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="field-item d-flex align-items-end h-100">
                <Button
                  label="Actualizar Paciente"
                  className="p-button-primary p-button-sm w-100"
                  icon="pi pi-user-edit"
                  onClick={() => setShowUpdateModal(true)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Facturación Cards */}
        <div className="container-fluid px-0">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-12">
              <Card
                title="Facturación Consumidor"
                className="h-100 shadow-sm border-0"
                headerClassName="bg-success text-white py-3"
              >
                <div className="d-flex align-items-center mb-3">
                  <InputSwitch
                    checked={formData.billing.facturacionConsumidor}
                    onChange={() => toggleBillingType("consumer")}
                    className="me-3"
                  />
                  <span className="fw-medium text-muted">
                    Facturación a consumidor final
                  </span>
                </div>
                {formData.billing.facturacionConsumidor && (
                  <div className="p-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
                    <i className="pi pi-check-circle text-success me-2"></i>
                    <span className="text-success fw-medium">Facturación consumidor activada</span>
                  </div>
                )}
              </Card>
            </div>

            <div className="col-lg-6 col-md-8 col-12">
              <Card
                title="Facturación por Entidad"
                className="h-100 shadow-sm border-0 ft-entidad"

                headerClassName="bg-info text-white py-3"
              >
                <div className="d-flex align-items-center mb-3">
                  <InputSwitch
                    checked={formData.billing.facturacionEntidad}
                    onChange={() => toggleBillingType("entity")}
                    className="me-3"
                  />
                  <span className="fw-medium text-muted">
                    Facturación por entidad
                  </span>
                </div>

                {formData.billing.facturacionEntidad && (
                  <div className="mt-3 space-y-3">
                    <Controller
                      name="billing.entity"
                      control={control}
                      rules={{ required: "Entidad es requerida" }}
                      render={({ field, fieldState }) => (
                        <div className="field-item">
                          <label className="form-label fw-semibold text-dark">Entidad *</label>
                          <InputText
                            className={classNames("w-100 p-3", {
                              "p-invalid border-danger": fieldState.error,
                              "border": !fieldState.error
                            })}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange("entity", e.target.value);
                            }}
                            disabled
                          />
                          {getFormErrorMessage("billing.entity")}
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizationDate"
                      control={control}
                      render={({ field }) => (
                        <div className="field-item">
                          <label className="form-label fw-semibold text-dark">
                            Fecha de autorización
                          </label>
                          <Calendar
                            className="w-100"
                            inputClassName="p-3 border"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.value);
                              handleBillingChange("authorizationDate", e.value);
                            }}
                            dateFormat="dd/mm/yy"
                            showIcon
                            appendTo="self"
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizationNumber"
                      control={control}
                      rules={{
                        required: "Número de autorización es requerido",
                      }}
                      render={({ field, fieldState }) => (
                        <div className="field-item">
                          <label className="form-label fw-semibold text-dark">
                            N° Autorización *
                          </label>
                          <InputText
                            className={classNames("w-100 p-3", {
                              "p-invalid border-danger": fieldState.error,
                              "border": !fieldState.error
                            })}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange(
                                "authorizationNumber",
                                e.target.value
                              );
                            }}
                            placeholder="Ingrese el número de autorización"
                          />
                          {getFormErrorMessage("billing.authorizationNumber")}
                        </div>
                      )}
                    />

                    <Controller
                      name="billing.authorizedAmount"
                      control={control}
                      rules={{
                        required: "Monto autorizado es requerido",
                      }}
                      render={({ field }) => (
                        <div
                          className="field-item"
                          style={{ display: hideInputs ? "none" : "block" }}
                        >
                          <label className="form-label fw-semibold text-dark">Monto Autorizado</label>
                          <InputText
                            className="w-100 p-3 border"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleBillingChange(
                                "authorizedAmount",
                                e.target.value
                              );
                            }}
                            placeholder="0.00"
                          />
                        </div>
                      )}
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="d-flex justify-content-end pt-4 col-12">
        <Button
          label="Siguiente"
          iconPos="right"
          icon="pi pi-arrow-right"
          onClick={handleNext}
          className="p-button-primary px-4 py-2"
        />
      </div>

      {/* Patient Update Modal */}
      <PatientFormModal
        visible={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        onSuccess={() => {
          fetchPatient();
          setShowUpdateModal(false);
        }}
        patientData={patient}
      />

      <style>{`
     
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
      `}</style>
    </div>
  );
};

export default PatientStepPreview;
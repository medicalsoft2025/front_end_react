import React, { use, useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { usePatientDocuments } from "./hooks/usePatientDocuments";
import { DocumentoConsentimiento, UploadResponse } from "./types/DocumentData";
import PatientBreadcrumb from "./components/PatientBreadcrumb";
import DocumentTable from "./components/DocumentTable";
import DocumentFormModal from "./components/DocumentFormModal";
import { useGetData } from "../consentimiento/hooks/ConsentimientoGetData";
import { ConsentimientoData } from "../consentimiento/enums/ConsentimientoData";
import SignatureModal from "./components/SignatureModal";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";
import { SwalManager } from "../../../services/alertManagerImported";

const AsignarConsentimiento: React.FC = () => {
  const [patientId, setPatientId] = useState("");
  const toast = useRef<Toast>(null);
  const {
    documents,
    patient,
    loading,
    error,
    reload,
    setPatientId: updatePatientId,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = usePatientDocuments(patientId);

  const [showDocumentFormModal, setShowDocumentFormModal] = useState(false);
  const [currentDocument, setCurrentDocument] =
    useState<DocumentoConsentimiento | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [documentToView, setDocumentToView] =
    useState<DocumentoConsentimiento | null>(null);
  const { data: templates } = useGetData();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("patient_id");
    if (id) {
      setPatientId(id);
      updatePatientId(id);
    }
  }, []);

  // Crear
  const handleCreateDocument = () => {
    setCurrentDocument(null);
    setShowDocumentFormModal(true);
  };

  // Ver
  const handleViewDocument = (id: string) => {
    const documentToView = documents.find((doc) => doc.id === id);

    if (!documentToView) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000,
      });
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=1000,top=100,left=200,resizable=yes,scrollbars=yes"
    );

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentToView.titulo ?? "Documento"}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                font-size: 14px;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
            </style>
          </head>
          <body>
            ${documentToView.contenido ?? "<p>Sin contenido</p>"}
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleSignatureDocument = (id: string) => {
    console.log("documents", documents);
    const doc = documents.find((d) => d.id === id);
    if (!doc) {
      toast.current?.show({
        severity: "warn",
        summary: "No encontrado",
        detail: "No se encontró el documento",
        life: 3000,
      });
      return;
    }
    doc.patient_id = patientId;
    doc.title = doc.titulo;
    doc.description = doc.contenido || "No hay descripcion";
    console.log("doc", doc);
    setDocumentToView(doc);
    setShowViewModal(true);
  };

  // Editar
  const handleEditDocument = (id: string) => {
    const documentToEdit = documents.find((doc) => doc.id === id);
    if (documentToEdit) {
      setCurrentDocument(documentToEdit);
      setShowDocumentFormModal(true);
    }
  };

  // Función para el nuevo proceso de descarga y subida
  const handleDownloadAndUpload = async (
    documento: File
  ): Promise<UploadResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", documento);
        formData.append("model_type", "App\\Models\\ExamRecipes");
        formData.append("model_id", documento.size.toString());

        // Aquí usamos then/catch como querías
        guardarArchivo(formData, true)
          .then(async (response) => {
            //@ts-ignore
            const fileUrl = await getUrlImage(
              response.file.file_url.replaceAll("\\", "/"),
              true
            );

            resolve({
              file_url: fileUrl,
              model_type: response.file.model_type,
              model_id: response.file.model_id,
              id: response.file.id,
            });

            toast.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Documento generado y subido correctamente.",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error al generar o subir el documento:", error);
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "No se pudo completar la operación.",
              life: 3000,
            });
            reject(error);
          });
      } catch (error) {
        console.error("Error inesperado:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo completar la operación.",
          life: 3000,
        });
        reject(error);
      }
    });
  };


  const handleDeleteDocument = async (id: string) => {
    const result = await SwalManager.confirmDelete({
      title: '¿Estás seguro?',
      text: "¿Seguro que deseas eliminar este Documento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result) {
      try {
        await deleteTemplate(id);

        toast.current?.show({
          severity: "success",
          summary: "Eliminado",
          detail: "Documento eliminado correctamente",
          life: 3000,
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar el documento",
          life: 3000,
        });
      }
    }
  };

  // Guardar (crear/editar)
  const handleSubmitDocument = async (
    formData: any,
    template: ConsentimientoData
  ) => {
    try {
      const doctor = JSON.parse(localStorage.getItem("userData")!);
      const tenant_id = window.location.hostname.split(".")[0];

      const payload = {
        documentId: template.id,
        title:
          formData.title && formData.title.trim() !== ""
            ? formData.title
            : template.title,
        description: template.description || "No hay descripcion",
        data: formData.contenido,
        tenantId: tenant_id,
        doctorId: doctor.id,
        statusSignature: formData.statusSignature ?? 0,
      };

      if (currentDocument) {
        await updateTemplate(currentDocument?.id, payload);
        toast.current?.show({
          severity: "info",
          summary: "Actualizado",
          detail: "Documento actualizado con éxito",
          life: 3000,
        });
      } else {
        await createTemplate(payload);
        toast.current?.show({
          severity: "success",
          summary: "Creado",
          detail: "Documento creado con éxito",
          life: 3000,
        });
      }

      setShowDocumentFormModal(false);
      setCurrentDocument(null);
    } catch (error) {
      console.error("Error al guardar documento:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el documento",
        life: 3000,
      });
    }
  };

  const handleHideDocumentFormModal = () => {
    setShowDocumentFormModal(false);
    setCurrentDocument(null);
  };

  // Función para obtener los items del menú de acciones
  const getMenuItems = (rowData: DocumentoConsentimiento): MenuItem[] => [
    {
      label: "Ver",
      icon: <i className="fas fa-eye me-2"></i>,
      command: () => handleViewDocument(rowData.id),
    },
    {
      label: "Editar",
      icon: <i className="fas fa-edit me-2"></i>,
      command: () => handleEditDocument(rowData.id),
    },
    {
      label: "Firmar",
      icon: <i className="fas fa-signature me-2"></i>,
      command: () => handleSignatureDocument(rowData.id),
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
      command: () => handleDeleteDocument(rowData.id),
    }
  ];

  // Template para las acciones - usando CustomPRTableMenu
  const accionesBodyTemplate = (rowData: DocumentoConsentimiento) => {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minWidth: "120px" }}>
        <CustomPRTableMenu
          rowData={rowData}
          menuItems={getMenuItems(rowData)}
        />
      </div>
    );
  };

  // Columnas personalizadas con el menú de acciones
  const columns = [
    {
      field: 'titulo',
      header: 'Título',
      sortable: true
    },
    {
      field: 'motivo',
      header: 'Motivo',
      sortable: true
    },
    {
      field: 'fecha',
      header: 'Fecha',
      sortable: true
    },
    {
      field: 'firmado',
      header: 'Firmado',
      sortable: true,
      body: (rowData: any) => rowData.firmado ? 'Sí' : 'No'
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: accionesBodyTemplate,
      exportable: false,
      style: { minWidth: '80px', textAlign: 'center' },
      width: '80px'
    }
  ];

  // Preparar datos para la tabla
  const tableData = documents.map(doc => ({
    ...doc,
    actions: doc // Pasamos el documento completo para las acciones
  }));

  if (error) {
    return (
      <div className="content">
        <div className="container-small">
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={reload}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrimeReactProvider
      value={{
        appendTo: typeof window !== "undefined" ? document.body : undefined,
        zIndex: {
          overlay: 100000,
          modal: 110000,
        },
      }}
    >
      <div className="content">
        <div className="container-small">
          <PatientBreadcrumb patient={patient} loading={loading && !patient} />
          <Toast ref={toast} />

          <div className="col-12">
            <div className="d-flex justify-content-end align-items-end mb-2">
              <Button
                label="Nuevo Consentimiento"
                className="p-button-primary"
                type="button"
                onClick={handleCreateDocument}
                disabled={!patient}
              >
                <i className="fas fa-plus" style={{ marginLeft: "5px" }}></i>
              </Button>
            </div>
          </div>

          <DocumentTable
            data={tableData}
            columns={columns}
            loading={loading}
            onReload={reload}
            globalFilterFields={["titulo", "motivo", "fecha", "firmado"]}
          />

        </div>

        <DocumentFormModal
          title={
            currentDocument ? "Editar Consentimiento" : "Crear Consentimiento"
          }
          show={showDocumentFormModal}
          onSubmit={handleSubmitDocument}
          onHide={handleHideDocumentFormModal}
          initialData={currentDocument}
          templates={templates}
          patient={patient!}
        />

        <SignatureModal
          visible={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onSave={async (file) => {
            if (!currentDocumentId) return;

            try {
              const response = await handleDownloadAndUpload(file);
              console.log("URL del archivo subido:", response.file_url);

              const reader = new FileReader();
              reader.onload = function (e) {
                const base64 = e.target?.result as string;
                const slot = document.getElementById("signature-slot");
                if (slot) {
                  slot.innerHTML = `<img src="${base64}" style="max-width:250px; height:auto;" />`;
                }
                setDocumentToView((prev) =>
                  prev ? { ...prev, image_signature: base64 } : prev
                );
              };
              reader.readAsDataURL(file);

              const doc = documents.find((d) => d.id === currentDocumentId);
              if (!doc) return;

              await updateTemplate(currentDocumentId, {
                documentId: doc.id,
                title: doc.titulo,
                description: doc.motivo,
                data: doc.contenido,
                tenantId: window.location.hostname.split(".")[0],
                patientId: doc.patient_id || patientId,
                doctorId: JSON.parse(localStorage.getItem("userData")!).id,
                statusSignature: 1,
                imageSignature: response.file_url,
              });

              setDocumentToView((prev) =>
                prev
                  ? {
                    ...prev,
                    status_signature: 1,
                    image_signature: response.file_url,
                  }
                  : prev
              );
              setShowSignatureModal(false);
              setShowViewModal(false);
              setCurrentDocumentId(null);

              toast.current?.show({
                severity: "success",
                summary: "Firma guardada",
                detail: "El consentimiento ha sido firmado correctamente",
                life: 3000,
              });
            } catch (error) {
              console.error("Error al subir la firma:", error);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo guardar la firma",
                life: 3000,
              });
            }
          }}
        />

        {showViewModal && documentToView && (
          <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {documentToView.titulo ?? "Consentimiento Informado"}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {/* Renderizamos el contenido HTML del documento */}
                  <div
                    id="doc-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        documentToView.contenido +
                        `<br/><p><b>Firma del paciente:</b></p>
                          <div id="signature-slot" style="border:1px dashed #aaa; height:80px; width:300px;">
                            ${documentToView.firma
                          ? `<img src="${documentToView.firma}" style="max-width:250px; height:auto;" />`
                          : ""
                        }
                          </div>`,
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setShowSignatureModal(true);
                      setCurrentDocumentId(documentToView.id);
                      setShowViewModal(false);
                    }}
                  >
                    Firmar
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={async () => {
                      // Tomar contenido del modal
                      const doc =
                        document.getElementById("doc-content")?.innerHTML || "";
                      const iframe = document.createElement("iframe");
                      iframe.style.position = "absolute";
                      iframe.style.left = "-9999px";
                      document.body.appendChild(iframe);
                      const docIframe = iframe.contentWindow?.document;
                      if (docIframe) {
                        docIframe.open();
                        docIframe.write(`
                        <html>
                          <head>
                            <title>${documentToView.titulo || "Documento"}</title>
                            <style>
                              body { font-family: Arial; padding: 40px; font-size: 14px; }
                              @page { size: A4; margin: 15mm; }
                            </style>
                          </head>
                          <body>${doc}</body>
                        </html>
                      `);
                        docIframe.close();
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                      }
                    }}
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrimeReactProvider >
  );
};

export default AsignarConsentimiento;
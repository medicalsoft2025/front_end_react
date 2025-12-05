import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { useMassMessage } from "./hooks/useMassMessage";
import { useMassMessagesAll } from "./hooks/useMassMessagesAll";
import { MassMessageTable } from "./MassMessageTable";
import { MassMessageFormModal } from "./MassMessageFormModal";
import { Dialog } from "primereact/dialog";
import { massMessageMedicalService } from "../../../services/api";

export const MassMessageApp = () => {
  const { massMessage, setMassMessage, fetchMassMessage } = useMassMessage();
  const { massMessages, setMassMessages, fetchMassMessages, loading } =
    useMassMessagesAll();
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(undefined);

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

  const handleSubmit = async (data: any) => {
    try {
      if (massMessage) {
        const response = await massMessageMedicalService.update(
          massMessage.id,
          data
        );
        SwalManager.success({
          title: "Registro actualizado",
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

  const handleTableEdit = (id: string) => {
    fetchMassMessage(id);

    setShowFormModal(true);
  };

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="text-end mb-2">
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={onCreate}
            >
              <i className="fas fa-plus me-2"></i>
              Nuevo Mensaje
            </button>
          </div>
        </div>
        <MassMessageTable
          massMessages={massMessages}
          onEditItem={handleTableEdit}
          onDeleteItem={fetchMassMessages}
          loading={loading}
        ></MassMessageTable>

        <Dialog
          header="Crear Mensaje Masivo"
          visible={showFormModal}
          style={{ width: "75vw", height: "90vh" }}
          onHide={() => {
            if (!showFormModal) return;
            setShowFormModal(false);
            setMassMessage(null);
          }}
        >
          <MassMessageFormModal
            handleSubmit={handleSubmit}
            initialData={initialData}
          ></MassMessageFormModal>
        </Dialog>
      </PrimeReactProvider>
    </>
  );
};

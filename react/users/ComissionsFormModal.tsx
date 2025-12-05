import React from "react";
import { ComissionForm, UserComissionsFormInputs } from "./Comissions";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface ComissionFormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: UserComissionsFormInputs) => void;
  initialData?: UserComissionsFormInputs;
  onHide?: () => void;
}

export const ComissionFormModal: React.FC<ComissionFormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
}) => {
  const formId = "createDoctor";

  const footer = (
    <div className="d-flex justify-content-end">
      <Button
        label="Cancelar"
        className="p-button-primary px-3 my-0 me-2"
        aria-label="Close"
        onClick={onHide}
      >
        <i className="fas fa-arrow-left" style={{ marginLeft: "10px" }}></i>
      </Button>
      <Button label="Guardar" type="submit" form={formId} className="p-button-primary my-0">
        <i className="fas fa-bookmark" style={{ marginLeft: "10px" }}></i>
      </Button>
    </div>
  );
  return (
    <Dialog
      visible={show}
      onHide={() => { onHide?.() }}
      header={title}
      footer={footer}
      style={{ width: "80vw", height: "75%", maxHeight: "90%" }}
    >
      <ComissionForm
        formId={formId}
        onHandleSubmit={handleSubmit}
        initialData={initialData}
      ></ComissionForm>
    </Dialog>
  );
};
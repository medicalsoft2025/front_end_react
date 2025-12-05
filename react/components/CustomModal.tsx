import { Dialog } from "primereact/dialog";
import React from "react";

interface Props {
  children: React.ReactNode;
  footerTemplate?: React.ReactNode;
  title: string;
  show: boolean;
  scrollable?: boolean;
  onHide?: () => void;
  width?: string;
}

export const CustomModal: React.FC<Props> = ({
  children,
  title,
  show,
  onHide,
  footerTemplate,
  scrollable = false,
  width

}) => {
  return (
    <Dialog
      visible={show}
      header={title}
      footer={footerTemplate}
      onHide={() => onHide?.()}
      style={{ width: width || '50vw' }}
      aria-labelledby="contained-modal-title-vcenter"
      className={`${scrollable ? "modal-dialog-scrollable" : ""}`}
      draggable={false}
    >
      {children}
    </Dialog>
  );
};

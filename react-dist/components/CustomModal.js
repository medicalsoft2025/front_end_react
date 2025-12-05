import { Dialog } from "primereact/dialog";
import React from "react";
export const CustomModal = ({
  children,
  title,
  show,
  onHide,
  footerTemplate,
  scrollable = false,
  width
}) => {
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    header: title,
    footer: footerTemplate,
    onHide: () => onHide?.(),
    style: {
      width: width || '50vw'
    },
    "aria-labelledby": "contained-modal-title-vcenter",
    className: `${scrollable ? "modal-dialog-scrollable" : ""}`,
    draggable: false
  }, children);
};
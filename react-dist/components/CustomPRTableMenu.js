import React from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useRef } from "react";
import { generateUUID } from "../../services/utilidades.js";
export const CustomPRTableMenu = ({
  rowData,
  menuItems
}) => {
  const menu = useRef(null);
  const menuId = rowData?.id || generateUUID();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    className: "d-flex align-items-center gap-2",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${menuId}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: menuItems,
    popup: true,
    ref: menu,
    id: `popup_menu_${menuId}`,
    style: {
      zIndex: 9999
    }
  })));
};
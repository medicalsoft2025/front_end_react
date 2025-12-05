import React from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { generateUUID } from "../../services/utilidades";

interface CustomPRTableMenuProps {
    rowData?: any;
    menuItems: MenuItem[];
}

export const CustomPRTableMenu: React.FC<CustomPRTableMenuProps> = ({ rowData, menuItems }) => {

    const menu = useRef<Menu>(null);
    const menuId = rowData?.id || generateUUID();

    return <>
        <div style={{ position: "relative" }}>
            <Button
                className="d-flex align-items-center gap-2"
                onClick={(e) => menu.current?.toggle(e)}
                aria-controls={`popup_menu_${menuId}`}
                aria-haspopup
            >
                Acciones
                <i className="fa fa-cog"></i>
            </Button>
            <Menu
                model={menuItems}
                popup
                ref={menu}
                id={`popup_menu_${menuId}`}
                style={{ zIndex: 9999 }}
            />
        </div>
    </>
};

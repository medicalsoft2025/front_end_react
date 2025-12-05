import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages";
import { SwalManager } from "../../services/alertManagerImported";

interface PrescriptionPackagesTableProps {
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
    ref?: React.RefObject<PrescriptionPackagesTableRef>;
}

export interface PrescriptionPackagesTableRef {
    fetchData: () => void;
}

export const PrescriptionPackagesTable = forwardRef((props: PrescriptionPackagesTableProps, ref) => {

    const { onEdit, onDelete } = props;

    const { clinicalPackages, fetchClinicalPackages, loading: clinicalPackagesLoading } = useClinicalPackages();

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState<any>(null);
    const toast = useRef<Toast>(null);

    useImperativeHandle(ref, () => ({
        fetchData: fetchClinicalPackages
    }));

    const confirmDelete = (packageItem: any) => {
        setPackageToDelete(packageItem);
        setDeleteDialogVisible(true);
    };

    const handleDelete = async () => {
        if (packageToDelete) {
            try {
                // Llamar a la función de eliminación pasada por props
                await onDelete(packageToDelete);

                SwalManager.success({
                    title: "Paquete Eliminado",
                });

                // Refrescar los datos después de eliminar
                fetchClinicalPackages();
            } catch (error) {
                console.error("Error al eliminar paquete:", error);
                SwalManager.error({
                    title: "Error",
                    text: "No se pudo eliminar el paquete",
                });
            }
        }
        setDeleteDialogVisible(false);
        setPackageToDelete(null);
    };

    const deleteDialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
                label="Eliminar"
                icon="pi pi-check"
                className="p-button-danger"
                onClick={handleDelete}
            />
        </div>
    );

    const TableMenu: React.FC<{
        rowData: any,
        onEdit: (item: any) => void,
        onDelete: (item: any) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            console.log("Editando paquete con ID:", rowData.id);
            onEdit(rowData);
        };

        const handleDelete = () => {
            console.log("Solicitando eliminar paquete con ID:", rowData.id);
            onDelete(rowData);
        };

        return (
            <div style={{ position: "relative" }}>
                <Button
                    className="p-button-primary flex items-center gap-2"
                    onClick={(e) => menu.current?.toggle(e)}
                    aria-controls={`popup_menu_${rowData.id}`}
                    aria-haspopup
                >
                    Acciones
                    <i className="fas fa-cog ml-2"></i>
                </Button>
                <Menu
                    model={[
                        {
                            label: "Editar",
                            icon: <i className="fas fa-edit me-2"></i>,
                            command: handleEdit,
                        },
                        {
                            label: "Eliminar",
                            icon: <i className="fas fa-trash me-2"></i>,
                            command: handleDelete,
                        }
                    ]}
                    popup
                    ref={menu}
                    id={`popup_menu_${rowData.id}`}
                    appendTo={document.body}
                    style={{ zIndex: 9999 }}
                />
            </div>
        );
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData}
                    onEdit={onEdit}
                    onDelete={confirmDelete}
                />
            </div>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'label',
            header: 'Nombre',
            sortable: true
        },
        {
            field: 'description',
            header: 'Descripción',
            sortable: true
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: actionBodyTemplate,
            exportable: false
        }
    ];

    return (
        <>
            <Toast ref={toast} />

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                visible={deleteDialogVisible}
                style={{ width: "450px" }}
                header="Confirmar"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialogVisible(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i
                        className="fas fa-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#F8BB86" }}
                    />
                    {packageToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar el paquete <b>{packageToDelete.label}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <CustomPRTable
                columns={columns}
                data={clinicalPackages}
                onReload={fetchClinicalPackages}
                loading={clinicalPackagesLoading}
            />
        </>
    );
});
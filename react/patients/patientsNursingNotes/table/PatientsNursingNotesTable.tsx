import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../../components/CustomPRTable";
import { formatDate } from "../../../../services/utilidades";
export interface NursingNote {
    id: string;
    titulo: string;
    nota: string;
    fecha: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    enfermera: string;
    patient_id: string;
    tituloNota: string;
}

export interface NursingNotesTableProps {
    onEditItem: (id: string) => void;
    nursingNotes?: NursingNote[];
    loading?: boolean;
    onDeleteItem: (id: string) => void;
    onReload: () => void;
    onCreate: () => void;
    createLoading?: boolean;
    updateLoading?: boolean;
    deleteLoading?: boolean;
}

export const PatientsNursingNotesTable: React.FC<NursingNotesTableProps> = ({
    onEditItem,
    nursingNotes = [],
    loading = false,
    onDeleteItem,
    onReload,
    onCreate,
    createLoading = false,
    updateLoading = false,
    deleteLoading = false
}) => {
    const toast = useRef<Toast>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<NursingNote | null>(null);
    const [filteredNotes, setFilteredNotes] = useState<NursingNote[]>([]);
    const [filtros, setFiltros] = useState({
        titulo: "",
        enfermera: "",
    });

    const syncFilteredData = () => {
        let result = [...nursingNotes];

        if (filtros.titulo) {
            result = result.filter((note) =>
                note.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
            );
        }
        if (filtros.enfermera) {
            result = result.filter((note) =>
                note.enfermera.toLowerCase().includes(filtros.enfermera.toLowerCase())
            );
        }

        setFilteredNotes(result);
    };

    React.useEffect(() => {
        syncFilteredData();
    }, [nursingNotes, filtros]);

    const handleFilterChange = (field: string, value: any) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSearchChange = (searchValue: string) => {
        console.log("Search value:", searchValue);
    };

    const limpiarFiltros = () => {
        setFiltros({
            titulo: "",
            enfermera: "",
        });
    };

    const handleRefresh = async () => {
        limpiarFiltros();
        if (onReload) {
            await onReload();
        }
    };

    const showToast = (severity: 'success' | 'error', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const confirmDelete = (note: NursingNote) => {
        setNoteToDelete(note);
        setDeleteDialogVisible(true);
    };

    const deleteNote = async () => {
        if (noteToDelete && onDeleteItem) {
            await onDeleteItem(noteToDelete.id);
            showToast("success", "Éxito", `Nota "${noteToDelete.titulo}" eliminada`);
        }
        setDeleteDialogVisible(false);
        setNoteToDelete(null);
    };

    const deleteDialogFooter = (
        <div className="d-flex justify-content-end gap-3">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => setDeleteDialogVisible(false)}
            ><i className="fas fa-times" style={{ marginLeft: "10px" }}></i> </Button>

            <Button
                label="Eliminar"
                className="p-button-danger"
                onClick={deleteNote}
            ><i className="fas fa-trash" style={{ marginLeft: "10px" }}></i> </Button>

        </div>
    );

    const formatDateForTable = (dateString: string) => {
        return formatDate(dateString);
    };

    const TableMenu: React.FC<{
        rowData: NursingNote,
        onEdit: (id: string) => void,
        onDelete: (note: NursingNote) => void
    }> = ({ rowData, onEdit, onDelete }) => {
        const menu = useRef<Menu>(null);

        const handleEdit = () => {
            onEdit(rowData.id);
        };

        const handleDelete = () => {
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

    const actionBodyTemplate = (rowData: NursingNote) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <TableMenu
                    rowData={rowData}
                    onEdit={onEditItem}
                    onDelete={confirmDelete}
                />
            </div>
        );
    };

    const columns: CustomPRTableColumnProps[] = [
        {
            field: 'titulo',
            header: 'Título',
            sortable: true
        },
        {
            field: 'nota',
            header: 'Contenido',
            body: (rowData: NursingNote) => (
                <span title={rowData.nota}>
                    {rowData.nota?.length > 50
                        ? `${rowData.nota.substring(0, 50)}...`
                        : rowData.nota}
                </span>
            )
        },
        {
            field: 'enfermera',
            header: 'Enfermera',
            sortable: true
        },
        {
            field: 'fecha',
            header: 'Fecha y Hora',
            body: (rowData: NursingNote) => formatDateForTable(rowData.fecha),
            sortable: true
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: NursingNote) => actionBodyTemplate(rowData),
            exportable: false,
            width: "120px"
        }
    ];

    return (
        <div className="w-100">
            <Toast ref={toast} />
            <Dialog
                visible={deleteDialogVisible}
                style={{ width: "450px" }}
                header="Confirmar Eliminación"
                modal
                footer={deleteDialogFooter}
                onHide={() => setDeleteDialogVisible(false)}
            >
                <div className="flex align-items-center justify-content-center">
                    <i
                        className="fas fa-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#F8BB86" }}
                    />
                    {noteToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar la nota <b>"{noteToDelete.titulo}"</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-50px" }}>
                    <div className="text-end pt-3 mb-2">
                        <Button
                            className="p-button-primary"
                            onClick={onCreate}
                            disabled={createLoading || updateLoading || deleteLoading}
                        >
                            <i className="fas fa-plus me-2"></i>
                            {createLoading || updateLoading ? 'Procesando...' : 'Nueva Nota'}
                        </Button>
                    </div>

                    {/* <Accordion>
                        <AccordionTab header="Filtros">
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Título de la Nota
                                    </label>
                                    <InputText
                                        value={filtros.titulo}
                                        onChange={(e) => handleFilterChange("titulo", e.target.value)}
                                        placeholder="Buscar por título"
                                        className="w-100"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Enfermera
                                    </label>
                                    <InputText
                                        value={filtros.enfermera}
                                        onChange={(e) => handleFilterChange("enfermera", e.target.value)}
                                        placeholder="Buscar por enfermera"
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion> */}

                    <CustomPRTable
                        columns={columns}
                        data={filteredNotes}
                        loading={loading}
                        onSearch={handleSearchChange}
                        onReload={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
};
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { TaxDTO } from "../interfaces/taxConfigDTO";
import { Filtros, TaxConfigTableProps, ToastSeverity } from "../interfaces/taxConfigTable";



export const TaxConfigTable: React.FC<TaxConfigTableProps> = ({
    onEditItem,
    loading = false,
    onDeleteItem,
}) => {
    const toast = useRef<Toast>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [taxToDelete, setTaxToDelete] = useState<TaxDTO | null>(null);
    const [filteredTaxes, setFilteredTaxes] = useState<TaxDTO[]>([]);
    const [filtros, setFiltros] = useState<Filtros>({
        name: "",
        document_type: null,
        city_id: "",
    });

    const documentTypes = [
        { label: "Cédula de Ciudadanía", value: "CC" },
        { label: "NIT", value: "NIT" },
        { label: "Cédula de Extranjería", value: "CE" },
        { label: "Pasaporte", value: "PASSPORT" },
        { label: "Tarjeta de Identidad", value: "TI" },
    ];


    // useEffect(() => {
    //     setFilteredTaxes(taxes);
    // }, [taxes]);

    const handleFilterChange = (field: string, value: any) => {
        setFiltros((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const aplicarFiltros = () => {
        let result = [...taxes];

        if (filtros.name) {
            result = result.filter((tax) =>
                tax.name.toLowerCase().includes(filtros.name.toLowerCase())
            );
        }

        if (filtros.document_type) {
            result = result.filter((tax) => tax.document_type === filtros.document_type);
        }

        if (filtros.city_id) {
            result = result.filter((tax) =>
                tax.city_id.toLowerCase().includes(filtros.city_id.toLowerCase())
            );
        }

        setFilteredTaxes(result);
    };

    const limpiarFiltros = () => {
        setFiltros({
            name: "",
            document_type: null,
            city_id: "",
        });
        setFilteredTaxes(taxes);
    };

    const showToast = (
        severity: ToastSeverity,
        summary: string,
        detail: string
    ) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const actionBodyTemplate = (rowData: TaxDTO) => {
        return (
            <div
                className="flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", minWidth: "120px" }}
            >
                <Button
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => editTax(rowData)}
                >
                    <i className="fas fa-pencil-alt"></i>
                </Button>
                <Button
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={() => confirmDelete(rowData)}
                >
                    <i className="fa-solid fa-trash"></i>
                </Button>
            </div>
        );
    };

    const editTax = (tax: TaxDTO) => {
        if (onEditItem) {
            onEditItem(tax.id.toString());
        }
        showToast("info", "Editar", `Editando impuesto: ${tax.name}`);
    };

    const confirmDelete = (tax: TaxDTO) => {
        setTaxToDelete(tax);
        setDeleteDialogVisible(true);
    };

    const deleteTax = () => {
        if (taxToDelete && onDeleteItem) {
            onDeleteItem(taxToDelete.id.toString());
            showToast("success", "Éxito", `Impuesto ${taxToDelete.name} eliminado`);
        }
        setDeleteDialogVisible(false);
        setTaxToDelete(null);
    };

    const deleteDialogFooter = (
        <div className="flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                className="p-button-text"
                onClick={() => setDeleteDialogVisible(false)}
            />
            <Button
                label="Eliminar"
                className="p-button-danger"
                onClick={deleteTax}
            />
        </div>
    );

    const getDocumentTypeLabel = (value: string) => {
        const type = documentTypes.find((doc) => doc.value === value);
        return type ? type.label : value;
    };

    const styles = {
        card: {
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
        },
        cardTitle: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#333",
        },
        tableHeader: {
            backgroundColor: "#f8f9fa",
            color: "#495057",
            fontWeight: 600,
        },
        tableCell: {
            padding: "0.75rem 1rem",
        },
        formLabel: {
            fontWeight: 500,
            marginBottom: "0.5rem",
            display: "block",
        },
    };

    return (
        <div
            className="container-fluid mt-4"
            style={{ width: "100%", padding: "0 15px" }}
        >
            <Toast ref={toast} />

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
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem", color: "#f8bb86" }}
                    />
                    {taxToDelete && (
                        <span>
                            ¿Estás seguro que deseas eliminar el impuesto <b>{taxToDelete.name}</b>?
                            Esta acción no se puede deshacer.
                        </span>
                    )}
                </div>
            </Dialog>

            <Card title="Filtros de Búsqueda" style={styles.card}>
                <div className="row g-3">
                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Nombre</label>
                        <InputText
                            value={filtros.name}
                            onChange={(e) => handleFilterChange("name", e.target.value)}
                            placeholder="Buscar por nombre"
                            className="w-100"
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Tipo de Documento</label>
                        <Dropdown
                            value={filtros.document_type}
                            options={documentTypes}
                            onChange={(e) => handleFilterChange("document_type", e.value)}
                            optionLabel="label"
                            placeholder="Seleccione tipo"
                            className="w-100"
                            showClear
                        />
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <label style={styles.formLabel}>Ciudad</label>
                        <InputText
                            value={filtros.city_id}
                            onChange={(e) => handleFilterChange("city_id", e.target.value)}
                            placeholder="Buscar por ciudad"
                            className="w-100"
                        />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2">
                        <Button
                            label="Limpiar"
                            icon="pi pi-trash"
                            className="btn btn-phoenix-secondary"
                            onClick={limpiarFiltros}
                        />
                        <Button
                            label="Aplicar Filtros"
                            icon="pi pi-filter"
                            className="btn btn-primary"
                            onClick={aplicarFiltros}
                            loading={loading}
                        />
                    </div>
                </div>
            </Card>

            <Card title="Configuración de Impuestos" style={styles.card}>
                <DataTable
                    value={filteredTaxes}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    loading={loading}
                    className="p-datatable-striped p-datatable-gridlines"
                    emptyMessage="No se encontraron impuestos"
                    responsiveLayout="scroll"
                    tableStyle={{ minWidth: "50rem" }}
                >
                    <Column
                        field="name"
                        header="Nombre"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="document_type"
                        header="Tipo Documento"
                        sortable
                        body={(rowData) => getDocumentTypeLabel(rowData.document_type)}
                        style={styles.tableCell}
                    />
                    <Column
                        field="document_number"
                        header="Número Documento"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="email"
                        header="Email"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        field="city_id"
                        header="Ciudad"
                        sortable
                        style={styles.tableCell}
                    />
                    <Column
                        body={actionBodyTemplate}
                        header="Acciones"
                        style={{ width: "120px" }}
                        exportable={false}
                    />
                </DataTable>
            </Card>
        </div>
    );
};
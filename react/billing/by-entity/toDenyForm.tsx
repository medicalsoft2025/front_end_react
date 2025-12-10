import React, { useEffect, useRef, useState } from "react";
import { invoiceService } from "../../../services/api";
import { cleanJsonObject } from "../../../services/utilidades";
import { useForm, Controller } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { Tag } from "primereact/tag";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

interface ToDenyFormProps {
  dataToInvoice: any;
  onSuccess?: () => void;
}

export const ToDenyForm: React.FC<ToDenyFormProps> = ({
  dataToInvoice,
  onSuccess,
}) => {
  console.log("dataToInvoice: ", dataToInvoice);
  const { control, handleSubmit, watch, setValue } = useForm<any>({
    defaultValues: {
      invoices: [],
      reason: "",
    },
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]); // Estado para las facturas seleccionadas

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    const filters = {
      per_page: 100,
      page: 1,
      entityInvoiceId: dataToInvoice.id,
      sort: "-id",
    };
    const invoices = await invoiceService.filterInvoice(
      cleanJsonObject(filters)
    );
    setInvoices(invoices.data);
  }

  function handleInvoicesToDeny(selectedItems: any[]) {
    console.log("selected invoices: ", selectedItems);
    setSelectedInvoices(selectedItems);
  }

  const getEstadoSeverity = (estado: string) => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pagada";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return "";
    }
  };

  const itemTemplate = (option: any) => {
    return (
      <div className="flex align-items-center">
        <div>{option.invoice_code || option.id}</div>
      </div>
    );
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer={`Total glosado: $${selectedInvoices
            .reduce((sum, invoice) => {
              return (
                sum +
                (Number(invoice?.admission?.entity_authorized_amount) || 0)
              );
            }, 0)
            .toFixed(2)}`}
          colSpan={4}
          footerStyle={{
            textAlign: "right",
            fontWeight: "bold",
            color: "red",
          }}
        />
      </Row>
    </ColumnGroup>
  );

  const isPositiveNumber = (val: any) => {
    if (val === null || val === undefined) return false;
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  };

  const onCellEditComplete = (e: any) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    console.log("rowData: ", rowData);
    console.log("field: ", field);
    console.log("newValue: ", newValue);

    if (field === "admission") {
      console.log("rowData: ", rowData);
      console.log("field: ", field);
      console.log("newValue: ", newValue);
      if (isPositiveNumber(newValue)) {
        if (!rowData.admission) {
          rowData.admission = {};
        }
        rowData.admission.entity_authorized_amount = Number(newValue);

        const updatedInvoices = [...selectedInvoices];
        const index = updatedInvoices.findIndex(
          (invoice) => invoice.id === rowData.id
        );
        if (index !== -1) {
          updatedInvoices[index] = { ...rowData };
          setSelectedInvoices(updatedInvoices);
        }
      } else {
        event.preventDefault();
      }
    }
  };

  const amountEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: any) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
        onKeyDown={(e: any) => e.stopPropagation()}
        className="w-100"
      />
    );
  };

  const amountBodyTemplate = (rowData: any) => {
    const amount = rowData?.admission?.entity_authorized_amount || 0;
    return `$${Number(amount).toFixed(2)}`;
  };

  const onSubmit = (data: any) => {
    const submitData = {
      reason: data.reason,
      toDenyInvoices: selectedInvoices,
    };

    console.log("Datos a enviar:", submitData);

    // if (onSuccess) {
    //   onSuccess();
    // }
  };

  return (
    <div className="container-fluid p-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label className="form-label">Facturas *</label>
              <Controller
                name="invoices"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={invoices}
                    optionLabel="invoice_code"
                    itemTemplate={itemTemplate}
                    placeholder="Seleccione una o más facturas"
                    className="w-100"
                    filter
                    virtualScrollerOptions={{ itemSize: 38 }}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                      handleInvoicesToDeny(e.value);
                    }}
                    appendTo={document.body}
                    display="chip"
                  />
                )}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label className="form-label">Razon</label>
              <Controller
                name="reason"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    placeholder="Razón"
                    className="w-100"
                    rows={3}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {selectedInvoices.length > 0 && (
          <div className="row mt-3">
            <div className="col-12">
              <div className="card p-2">
                <h5>Facturas seleccionadas</h5>
                <DataTable
                  value={selectedInvoices}
                  className="p-datatable-sm"
                  footerColumnGroup={footerGroup}
                  editMode="cell"
                >
                  <Column field="id" header="ID" sortable></Column>
                  <Column
                    field="status"
                    header="Estado"
                    sortable
                    body={(rowData) => (
                      <Tag
                        value={getEstadoLabel(rowData.status)}
                        severity={getEstadoSeverity(rowData.status)}
                      />
                    )}
                  ></Column>
                  <Column
                    field="third_party"
                    header="Tercero"
                    sortable
                    body={(rowData) => rowData?.third_party?.name ?? " -- "}
                  ></Column>
                  <Column
                    field="admission"
                    header="Monto autorizado"
                    sortable
                    body={amountBodyTemplate}
                    editor={(options) => amountEditor(options)}
                    onCellEditComplete={onCellEditComplete}
                    style={{ width: "25%" }}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        )}
        <div className="row mt-3">
          <div className="col-12">
            <div className="flex justify-content-end">
              <Button
                label="Guardar"
                icon="pi pi-check"
                className="p-button-primary"
                type="submit"
                disabled={selectedInvoices.length === 0}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

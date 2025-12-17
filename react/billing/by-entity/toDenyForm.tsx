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
import { InputText } from "primereact/inputtext";
import { useBillingByType } from "../../billing/hooks/useBillingByType";

interface ToDenyFormProps {
  dataToInvoice: any;
  onSuccess: (data: any) => void;
}

export const ToDenyForm: React.FC<ToDenyFormProps> = ({
  dataToInvoice,
  onSuccess,
}) => {
  const { control, handleSubmit } = useForm<any>({
    defaultValues: {
      invoices: [],
      reason: "",
      tax_receipt: "",
      invoice_number: "",
    },
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<any[]>([]);
  const { fetchBillingByType } = useBillingByType();
  const [billing, setBilling] = useState<any>(null);

  useEffect(() => {
    loadInvoices();
    loadBillingType();
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
    const invoicesMapped = invoices.data.map((invoice: any) => {
      return {
        ...invoice,
        value_to_deny: 0,
      };
    });
    setInvoices(invoicesMapped);
  }

  async function loadBillingType() {
    const billing = await fetchBillingByType("debit_note");
    setBilling(billing.data);
  }

  function handleInvoicesToDeny(selectedItems: any[]) {
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
              return sum + (Number(invoice?.value_to_deny) || 0);
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

    if (field === "glossed_amount") {
      if (isPositiveNumber(newValue)) {
        if (!rowData) {
          rowData = {};
        }
        rowData.value_to_deny = Number(newValue).toFixed(2);

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
        max={Number(options.rowData.admission.entity_authorized_amount)}
      />
    );
  };

  const amountBodyTemplate = (rowData: any) => {
    const amount = rowData?.admission?.entity_authorized_amount || 0;
    return `$${Number(amount).toFixed(2)}`;
  };

  const onSubmit = async (data: any) => {
    console.log("data:", data);
    const amountToDeny: BigInteger = selectedInvoices
      .reduce((sum, invoice) => {
        return Number(sum) + Number(invoice?.value_to_deny);
      }, 0)
      .toFixed(2);
    const submitData = {
      reason: data.reason,
      to_deny_invoices: selectedInvoices.map((item: any) => {
        return {
          id: item.id,
          value_to_deny: item.value_to_deny,
          entity_invoice_id: item.entity_invoice_id,
          paid_amount:
            item.admission.entity_authorized_amount - item.value_to_deny,
          admission: {
            entity_authorized_amount: Number(
              item.admission.entity_authorized_amount
            ).toFixed(2),
            id: item.admission.id,
          },
        };
      }),
      credit_note: {
        invoice_id: dataToInvoice.id,
        amount: Number(amountToDeny),
        reason: data.reason,
        fiscal_receipt: data.tax_receipt,
        invoice_number: data.invoice_number,
        billing: billing,
        payments: [
          {
            payment_method_id: 9,
            payment_date: "2025-12-11T15:02:27.895Z",
            amount: 4800,
          },
        ],
      },
    };

    console.log("Datos a enviar:", submitData);
    const response = await invoiceService.createGlossToInvoiceByEntity(
      submitData
    );
    onSuccess(response);
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
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Comprobante fiscal *</label>
              <Controller
                name="tax_receipt"
                control={control}
                render={({ field }) => (
                  <InputText {...field} className="w-100 form-control" />
                )}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Número de la factura *</label>
              <Controller
                name="invoice_number"
                control={control}
                render={({ field }) => (
                  <InputText {...field} className="w-100 form-control" />
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
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    field="glossed_amount"
                    header="Monto a glosar"
                    sortable
                    body={(rowData) => {
                      return rowData.value_to_deny;
                    }}
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

import React, { use, useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { accountingAccountsService } from "../../../services/api";
import { AccountingVoucherDto, DetailsDto } from "../../models/models";

type DropdownOption = {
  label: string;
  value: string;
  icon: string;
};

export const AccountingVouchers: React.FC = () => {
  // Estado para los datos
  const [vouchers, setVouchers] = useState<AccountingVoucherDto[]>([]);
  const [dates, setDates] = useState(null);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: null as Date | null,
    fechaFin: null as Date | null,
    numeroComprobante: "",
    codigoContable: "",
  });

  // Estado para el modal
  const [tipoComprobante, setTipoComprobante] = useState<string | null>(null);

  // Opciones para el dropdown de nuevo comprobante
  const opcionesNuevoComprobante: DropdownOption[] = [
    { label: "Recibo de Caja", value: "recibo_caja", icon: "pi-money-bill" },
    { label: "Recibo de Pago", value: "recibo_pago", icon: "pi-credit-card" },
  ];

  const loadData = async () => {
    const response = await accountingAccountsService.getAccountingVouchers();
    const filteredData = applyFilters(response.data);
    setVouchers(filteredData);
  };

  const applyFilters = (data: AccountingVoucherDto[]) => {
  let filteredData = [...data];

  // Filtro por rango de fechas
  if (filtros.fechaInicio && filtros.fechaFin) {
    filteredData = filteredData.filter(voucher => {
      const voucherDate = new Date(voucher.seat_date);
      const startDate = new Date(filtros.fechaInicio as Date);
      const endDate = new Date(filtros.fechaFin as Date);
      
      // Ajustamos las fechas para comparar solo día, mes y año
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      voucherDate.setHours(0, 0, 0, 0);
      
      return voucherDate >= startDate && voucherDate <= endDate;
    });
  }

  // Filtro por número de comprobante (búsqueda parcial)
  if (filtros.numeroComprobante) {
    const searchTerm = filtros.numeroComprobante.toLowerCase();
    filteredData = filteredData.filter(voucher => 
      voucher.seat_number.toLowerCase().includes(searchTerm)
    );
  }

  return filteredData;
};

const handleSearch = () => {
  loadData();
};

useEffect(() => {
  if (dates && Array.isArray(dates)) {
    setFiltros({
      ...filtros,
      fechaInicio: dates[0],
      fechaFin: dates[1]
    });
  }
}, [dates]);

useEffect(() => {
  loadData();
}, [filtros.fechaInicio, filtros.fechaFin, filtros.numeroComprobante]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTypeMovement = (value: string) => {
    switch (value) {
      case "credit":
        return "Cedito";
      case "debit":
        return "Debito";
    }
  };

  // Template para el encabezado del acordeón
  const voucherTemplate = (voucher: AccountingVoucherDto) => {
    return (
      <div className="flex justify-content-between align-items-center w-full">
        <div>
          <span className="font-bold">{voucher.seat_number}</span> -
          <span className="mx-2">{formatDate(voucher.seat_date)}</span>-
          <span> {voucher.description}</span>
        </div>
        <div>
          <span className="font-bold">
            Total: {formatCurrency(voucher.total_is)}
          </span>
        </div>
      </div>
    );
  };

  // Handler para selección de tipo de comprobante
  const handleSeleccionTipo = (value: string) => {
    setTipoComprobante(value);
  };

  // Template para opciones del dropdown
  const itemTemplate = (option: DropdownOption) => (
    <div className="flex align-items-center">
      <i className={`pi ${option.icon} mr-2`} />
      <span>{option.label}</span>
    </div>
  );

  return (
    <div className="container-fluid mt-4" style={{ padding: "0 15px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Movimientos Contables</h2>
        <div className="d-flex gap-2">
          <Button
            label="Nuevo Comprobante"
            icon="pi pi-file-edit"
            className="btn btn-primary"
            onClick={() => (window.location.href = "CrearComprobantesContable")}
          />

          <Dropdown
            value={tipoComprobante}
            options={opcionesNuevoComprobante}
            onChange={(e: DropdownChangeEvent) => handleSeleccionTipo(e.value)}
            optionLabel="label"
            itemTemplate={itemTemplate}
            placeholder="Seleccione tipo"
            dropdownIcon="pi pi-chevron-down"
            appendTo="self"
            className="w-full md:w-14rem"
          />
        </div>
      </div>

      <Card title="Filtros de Búsqueda" className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Fechas</label>
            <Calendar
              value={dates}
              onChange={(e: any) => setDates(e.value)}
              appendTo={document.body}
              dateFormat="dd/mm/yy"
              placeholder="Seleccione fecha"
              className="w-100"
              showIcon
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">N° Comprobante</label>
            <InputText
              value={filtros.numeroComprobante}
              onChange={(e) =>
                setFiltros({ ...filtros, numeroComprobante: e.target.value })
              }
              placeholder="Buscar por número"
              className="w-100"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Código Contable</label>
            <InputText
              value={filtros.codigoContable}
              onChange={(e) =>
                setFiltros({ ...filtros, codigoContable: e.target.value })
              }
              placeholder="Buscar por código"
              className="w-100"
            />
          </div>

          {/* <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              className="btn btn-phoenix-secondary"
              onClick={() =>
                setFiltros({
                  fechaInicio: null,
                  fechaFin: null,
                  numeroComprobante: "",
                  codigoContable: "",
                })
              }
            />
            <Button
              label="Buscar"
              icon="pi pi-search"
              className="btn btn-primary"
              onClick={() => console.log("Aplicar filtros")}
            />
          </div> */}
        </div>
      </Card>

      <Card title="Comprobantes Contables">
        <Accordion multiple>
          {vouchers.map((voucher) => (
            <AccordionTab key={voucher.id} header={voucherTemplate(voucher)}>
              <DataTable
                value={voucher.details}
                className="p-datatable-gridlines custom-datatable"
                stripedRows
                size="small"
              >
                <Column
                  field="description"
                  header="Descripcion"
                  style={{ width: "130px" }}
                />
                <Column
                  field="type"
                  header="Tipo"
                  body={(rowData: DetailsDto) =>
                    formatTypeMovement(rowData.type)
                  }
                  style={{ width: "120px" }}
                  bodyClassName="text-right"
                />
                <Column
                  field="amount"
                  header="Monto"
                  style={{ width: "120px" }}
                />
              </DataTable>
            </AccordionTab>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

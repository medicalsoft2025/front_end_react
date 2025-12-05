import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { CSSProperties } from "react";
import { useGeneralJournal } from "./hooks/useGeneralJournal";
import { useGeneralJournalFormat } from "../../documents-generation/hooks/useGeneralJournalFormat";
import { formatDateRange } from "../../../services/utilidades";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";

interface GeneralJournalProps {
  fetchData: (startDate: string, endDate: string) => Promise<any[]>;
}

export const GeneralJournal: React.FC<GeneralJournalProps> = ({
  fetchData,
}) => {
  const { dateRange, setDateRange, generalJournal, fetchGeneralJournal, loading } = useGeneralJournal();
  const { generarFormatoGeneralJournal } = useGeneralJournalFormat();

  const formatCurrency = (value: string) => {
    return value ? `$${parseFloat(value).toFixed(2)}` : '';
  };

  // Columnas para la CustomPRTable
  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'fecha',
      header: 'Fecha',
      body: (rowData: any) => new Date(rowData.fecha).toLocaleDateString(),
      sortable: true
    },
    {
      field: 'numero_asiento',
      header: 'N° Asiento',
      sortable: true
    },
    {
      field: 'cuenta',
      header: 'Cuenta',
      sortable: true
    },
    {
      field: 'debe',
      header: 'Debe',
      body: (rowData: any) => formatCurrency(rowData.debe),
      style: { textAlign: 'right' } as CSSProperties,
      sortable: true
    },
    {
      field: 'haber',
      header: 'Haber',
      body: (rowData: any) => formatCurrency(rowData.haber),
      style: { textAlign: 'right' } as CSSProperties,
      sortable: true
    },
    {
      field: 'descripcion',
      header: 'Descripción',
      sortable: true
    },
    {
      field: 'tercero',
      header: 'Tercero',
      sortable: true
    }
  ];

  const handleExportPDF = () => {
    generarFormatoGeneralJournal(generalJournal, formatDateRange(dateRange), 'Impresion');
  };

  const handleExport = (type: 'excel' | 'pdf' | 'csv') => {
    console.log("Exportando a:", type);
    if (type === 'pdf') {
      handleExportPDF();
    }
  };

  const renderFiltersAccordion = () => (
    <Accordion className="mb-3">
      <AccordionTab header={
        <div className="d-flex align-items-center">
          <i className="fas fa-filter me-2"></i>
          Filtros - Libro Diario
        </div>
      }>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="dateRange" className="form-label">Rango de fechas</label>
            <Calendar
              id="dateRange"
              selectionMode="range"
              value={dateRange}
              onChange={(e) => setDateRange(e.value)}
              className="w-100"
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="Seleccione un rango"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            label="Limpiar Filtros"
            icon="pi pi-trash"
            className="p-button-secondary"
            onClick={() => setDateRange(null)}
          />
          <Button
            label="Aplicar Filtros"
            icon="pi pi-filter"
            className="p-button-primary"
            onClick={fetchGeneralJournal}
            disabled={!dateRange || dateRange.length !== 2}
          />
        </div>
      </AccordionTab>
    </Accordion>
  );

  return (
    <main className="main" id="top">
      <div className="row g-3 justify-content-between align-items-start mb-4">
        <div className="col-12">

          <div
            className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
            style={{ minHeight: "400px" }}
          >
            <div className="card-body h-100 w-100 d-flex flex-column">
              <div className="tabs-professional-container">
                <div className="tabs-header">
                  <button className="tab-item active">
                    <i className="fas fa-book"></i>
                    Libro Diario
                  </button>
                </div>

                <div className="tabs-content">
                  <div className="tab-panel active">
                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        icon={<i className='fas fa-file-pdf me-2'></i>}
                        label="Exportar a PDF"
                        className="p-button-primary"
                        onClick={handleExportPDF}
                      />
                    </div>

                    {renderFiltersAccordion()}

                    <Card title="Asientos Contables" className="mb-3">
                      <CustomPRTable
                        columns={columns}
                        data={generalJournal}
                        loading={loading}
                        onReload={fetchGeneralJournal}
                        onExport={handleExport}
                        paginator={true}
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        emptyMessage="No se encontraron asientos contables"
                        stripedRows={true}
                        showGridlines={true}
                        size="normal"
                      />
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
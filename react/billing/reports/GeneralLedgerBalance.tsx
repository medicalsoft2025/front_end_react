import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { AccountingEntry, useAccountingEntries } from "./hooks/useAccountingEntries";
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { formatPrice } from '../../../services/utilidades';
import { useGeneralLedgerBalanceFormat } from '../../documents-generation/hooks/useGeneralLedgerBalanceFormat';

interface AccountGroup {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
  entries: AccountingEntry[];
}

export const GeneralLedgerBalance = () => {
  const [activeTab, setActiveTab] = useState<string>("ledger");
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | any>(null);
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const toast = useRef<Toast>(null);
  const { accountingEntries: data } = useAccountingEntries();
  const { generarFormatoGeneralLedgerBalance } = useGeneralLedgerBalanceFormat();

  // Procesar datos iniciales
  useEffect(() => {
    if (data && data.data.length > 0) {
      processAccountData(data.data);
    }
  }, [data]);

  // Procesar datos y agrupar por cuenta contable
  const processAccountData = (entries: AccountingEntry[]) => {
    const accountsMap = new Map<string, AccountGroup>();

    entries.forEach(entry => {
      const account = entry.accounting_account;
      if (!accountsMap.has(account.account_code)) {
        accountsMap.set(account.account_code, {
          account_code: account.account_code,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: parseFloat(account.balance),
          entries: []
        });
      }

      accountsMap.get(account.account_code)?.entries.push(entry);
    });

    setAccountGroups(Array.from(accountsMap.values()));
  };

  // Plantilla de expansión de fila
  const rowExpansionTemplate = (account: AccountGroup) => {
    return (
      <div className="p-3">
        <h5>Movimientos de {account.account_name}</h5>
        <DataTable value={account.entries} size="small">
          <Column field="entry_date" header="Fecha" body={(rowData) => new Date(rowData.entry_date).toLocaleDateString()} />
          <Column field="description" header="Descripción" />
          <Column
            header="Débito"
            body={(rowData) => rowData.type === "debit" ? formatPrice(rowData.amount) : "-"}
          />
          <Column
            header="Crédito"
            body={(rowData) => rowData.type === "credit" ? formatPrice(rowData.amount) : "-"}
          />
        </DataTable>
      </div>
    );
  };

  // Determinar si una fila puede expandirse
  const allowExpansion = (rowData: AccountGroup) => {
    return rowData.entries.length > 0;
  };

  const handleReload = () => {
    window.location.reload();
  };

  const renderFiltersAccordion = () => (
    <Accordion className="mb-3">
      <AccordionTab header={
        <div className="d-flex align-items-center">
          <i className="fas fa-filter me-2"></i>
          Filtros - Libro Mayor y Balance
        </div>
      }>
        <div className="row g-3">
          <div className="col-md-12">
            <p className="text-muted mb-0">
              Los datos se cargan automáticamente. Use los filtros de búsqueda en la tabla para refinar los resultados.
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            label="Limpiar Filtros"
            icon="pi pi-trash"
            className="p-button-secondary"
            onClick={handleReload}
          />
          <Button
            label="Recargar Datos"
            icon="pi pi-refresh"
            className="p-button-primary"
            onClick={handleReload}
          />
        </div>
      </AccordionTab>
    </Accordion>
  );

  const renderLedgerTab = () => {
    return (
      <Card>
        <div className="d-flex justify-content-between mb-3">
          <h5>Libro Mayor</h5>
          <Button
            icon={<i className='fas fa-file-pdf me-2'></i>}
            label="Exportar a PDF"
            onClick={() => generarFormatoGeneralLedgerBalance({ data: accountGroups, showMovements: true, title: "Libro Mayor", type: "Impresion" })}
          />
        </div>
        <DataTable
          value={accountGroups}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="account_code"
          tableStyle={{ minWidth: '60rem' }}
        >
          <Column expander={allowExpansion} style={{ width: '3rem' }} />
          <Column field="account_code" header="Código" sortable />
          <Column field="account_name" header="Nombre de Cuenta" sortable />
          <Column
            header="Tipo"
            body={(rowData) => {
              switch (rowData.account_type) {
                case "asset": return "Activo";
                case "liability": return "Pasivo";
                case "income": return "Ingreso";
                case "expense": return "Gasto";
                default: return rowData.account_type;
              }
            }}
            sortable
          />
          <Column
            header="Saldo"
            body={(rowData) => formatPrice(rowData.balance)}
            sortable
          />
        </DataTable>
      </Card>
    );
  };

  const renderBalanceTab = () => {
    return (
      <Card>
        <div className="d-flex justify-content-between mb-3">
          <h5>Balance</h5>
          <Button
            icon={<i className='fas fa-file-pdf me-2'></i>}
            label="Exportar a PDF"
            onClick={() => generarFormatoGeneralLedgerBalance({ data: accountGroups, showMovements: false, title: "Balance", type: "Impresion" })}
          />
        </div>
        <DataTable
          value={accountGroups}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="p-datatable-striped"
          emptyMessage="No se encontraron cuentas"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="account_code" header="Código" />
          <Column field="account_name" header="Nombre de Cuenta" />
          <Column
            header="Tipo"
            body={(rowData) => {
              switch (rowData.account_type) {
                case "asset": return "Activo";
                case "liability": return "Pasivo";
                case "income": return "Ingreso";
                case "expense": return "Gasto";
                default: return rowData.account_type;
              }
            }}
          />
          <Column
            header="Saldo"
            body={(rowData) => formatPrice(rowData.balance)}
          />
        </DataTable>
      </Card>
    );
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "ledger":
        return renderLedgerTab();
      case "balance":
        return renderBalanceTab();
      default:
        return renderLedgerTab();
    }
  };

  return (
    <main className="main" id="top">
      <div className="row g-3 justify-content-between align-items-start mb-4">
        <div className="col-12">

          <div
            className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
            style={{ minHeight: "400px" }}
          >
            <div className="card-body h-100 w-100 d-flex flex-column">
              <Toast ref={toast} />

              <div className="tabs-professional-container">
                <div className="tabs-header">
                  <button
                    className={`tab-item ${activeTab === "ledger" ? "active" : ""}`}
                    onClick={() => setActiveTab("ledger")}
                  >
                    <i className="fas fa-book"></i>
                    Libro Mayor
                  </button>
                  <button
                    className={`tab-item ${activeTab === "balance" ? "active" : ""}`}
                    onClick={() => setActiveTab("balance")}
                  >
                    <i className="fas fa-balance-scale"></i>
                    Balance
                  </button>
                </div>

                <div className="tabs-content">
                  <div className={`tab-panel ${activeTab === "ledger" ? "active" : ""}`}>
                    {renderFiltersAccordion()}
                    {renderActiveComponent()}
                  </div>
                  <div className={`tab-panel ${activeTab === "balance" ? "active" : ""}`}>
                    {renderFiltersAccordion()}
                    {renderActiveComponent()}
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
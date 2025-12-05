import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { AccountingClosingsTable } from "./table/AccountingClosingsTable.js";
import AccountingClosingModal from "./modal/AccountingClosingModal.js";
import { useAccountingClosings } from "./hooks/useAccountingClosings.js";
import { useAccountingClosingsCreate } from "./hooks/useAccountingClosingsCreate.js";
import { useAccountingClosing } from "./hooks/useAccountingClosing.js";
import { useAccountingClosingsUpdate } from "./hooks/useAccountingClosingsUpdate.js";
import { useAccountingClosingDelete } from "./hooks/useAccountingClosingDelete.js";
import { formatDate, stringToDate } from "../../../services/utilidades.js";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
import { Button } from 'primereact/button';
export const accountingClosings = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const {
    accountingClosings,
    fetchAccountingClosings,
    loading
  } = useAccountingClosings();
  const {
    createAccountingClosing
  } = useAccountingClosingsCreate();
  const {
    accountingClosing,
    fetchAccountingClosing,
    setAccountingClosing
  } = useAccountingClosing();
  const {
    updateAccountingClosing
  } = useAccountingClosingsUpdate();
  const {
    deleteAccountingClosing
  } = useAccountingClosingDelete();
  const handleCreate = () => {
    setInitialData(undefined);
    setAccountingClosing(null);
    setShowFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      if (accountingClosing) {
        await updateAccountingClosing(accountingClosing.data.id.toString(), data);
      } else {
        await createAccountingClosing(data);
      }
      fetchAccountingClosings();
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  const editAccountingClosing = id => {
    fetchAccountingClosing(id);
    setShowFormModal(true);
  };
  const deleteAccountingClosingHandler = async id => {
    const confirmed = await deleteAccountingClosing(id);
    if (confirmed) fetchAccountingClosings();
  };
  const getAccountingClosingColumns = ({
    editAccountingClosing,
    deleteAccountingClosingHandler
  }) => [{
    field: "age",
    header: "Año",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.status === "open" ? "bg-success" : "bg-secondary"}`
    }, rowData.status === "open" ? "Abierto" : "Cerrado"),
    sortable: true
  }, {
    field: "start_month",
    header: "Fecha Inicio",
    body: rowData => formatDate(rowData.start_month),
    sortable: true
  }, {
    field: "end_month",
    header: "Fecha Fin",
    body: rowData => formatDate(rowData.end_month),
    sortable: true
  }, {
    field: "warning_days",
    header: "Días Advertencia",
    sortable: true,
    width: '150px'
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center"
      }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
        menuItems: [{
          icon: /*#__PURE__*/React.createElement("i", {
            className: "fas fa-pencil-alt me-2"
          }),
          label: "Editar",
          command: () => editAccountingClosing(rowData.id.toString())
        }, {
          icon: /*#__PURE__*/React.createElement("i", {
            className: "fa-solid fa-trash me-2"
          }),
          label: "Eliminar",
          command: () => deleteAccountingClosingHandler(rowData.id.toString())
        }],
        rowData: rowData
      }));
    }
  }];
  const columns = getAccountingClosingColumns({
    editAccountingClosing,
    deleteAccountingClosingHandler
  });
  useEffect(() => {
    if (accountingClosing) {
      setInitialData({
        age: accountingClosing.data.age,
        status: accountingClosing.data.status,
        start_month: stringToDate(accountingClosing.data.start_month.split("T")[0]),
        end_month: stringToDate(accountingClosing.data.end_month.split("T")[0]),
        warning_days: accountingClosing.data.warning_days
      });
    }
  }, [accountingClosing]);
  const accountingClosingsData = accountingClosings?.data || [];
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "-2px 20px -20px"
    },
    className: "text-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Per\xEDodo",
    className: "p-button-primary",
    onClick: handleCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2",
    style: {
      marginLeft: "5px"
    }
  })))), /*#__PURE__*/React.createElement(AccountingClosingsTable, {
    data: accountingClosingsData,
    columns: columns,
    loading: loading,
    onReload: fetchAccountingClosings
  }), /*#__PURE__*/React.createElement(AccountingClosingModal, {
    isVisible: showFormModal,
    onSave: handleSubmit,
    onClose: () => setShowFormModal(false),
    initialData: initialData
  }));
};
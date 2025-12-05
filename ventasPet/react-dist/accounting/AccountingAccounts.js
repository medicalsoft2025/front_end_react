import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FilterService } from "primereact/api";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";

// Definición de tipos TypeScript

// Configuración de filtros
FilterService.register('customSearch', (value, filter) => {
  if (filter === undefined || filter === null || filter.trim() === '') {
    return true;
  }
  if (value === undefined || value === null) {
    return false;
  }
  return value.toString().toLowerCase().includes(filter.toLowerCase());
});

// Datos estáticos para dropdowns
const categorias = [{
  label: "Caja - bancos",
  value: "Caja - bancos"
}, {
  label: "Cuentas por cobrar",
  value: "Cuentas por cobrar"
}, {
  label: "Otros activos corrientes",
  value: "Otros activos corrientes"
}];
const detalleSaldos = [{
  label: "Sin detalle de vencimientos",
  value: "Sin detalle de vencimientos"
}, {
  label: "Clientes, controla vencimientos y estados de cuenta",
  value: "Clientes, controla vencimientos y estados de cuenta"
}, {
  label: "Proveedores, controla vencimientos y estado de cuenta",
  value: "Proveedores, controla vencimientos y estado de cuenta"
}];
const accountLevels = [{
  label: 'Clase',
  value: 'clase'
}, {
  label: 'Grupo',
  value: 'grupo'
}, {
  label: 'Cuenta',
  value: 'cuenta'
}, {
  label: 'SubCuenta',
  value: 'subcuenta'
}, {
  label: 'Auxiliar',
  value: 'auxiliar'
}, {
  label: 'SubAuxiliar',
  value: 'subauxiliar'
}];

// Función para validar códigos de cuenta
const validateCode = (code, level, parentCode) => {
  if (!code) return {
    valid: false,
    message: 'El código es requerido'
  };
  const levelDigits = {
    clase: 1,
    grupo: 2,
    cuenta: 4,
    subcuenta: 6,
    auxiliar: 8,
    subauxiliar: 10
  };
  if (code.length !== levelDigits[level]) {
    return {
      valid: false,
      message: `El nivel ${level} debe tener ${levelDigits[level]} dígitos`
    };
  }
  if (parentCode && !code.startsWith(parentCode.substring(0, levelDigits[level] - 2))) {
    return {
      valid: false,
      message: `Debe comenzar con el código del nivel superior`
    };
  }
  return {
    valid: true
  };
};

// Función para transformar datos de API a estructura jerárquica
const transformApiDataToTree = apiData => {
  const tree = [];
  const nodeMap = new Map();
  console.log("apiData", apiData);
  apiData.forEach(item => {
    const levels = [{
      code: item.account,
      fullCode: item.account,
      level: 'clase',
      name: `Clase ${item.account}`
    }, {
      code: item.sub_account,
      fullCode: `${item.account}${item.sub_account}`,
      level: 'grupo',
      name: `Grupo ${item.sub_account}`
    }, {
      code: item.auxiliary,
      fullCode: `${item.account}${item.sub_account}${item.auxiliary}`,
      level: 'cuenta',
      name: `Cuenta ${item.auxiliary}`
    }, {
      code: item.sub_auxiliary,
      fullCode: item.account_code,
      level: 'subcuenta',
      name: item.account_name,
      isLeaf: true
    }].filter(level => level.code); // Filtrar niveles vacíos

    let parentNodes = tree;
    levels.forEach((levelInfo, index) => {
      const {
        fullCode,
        name,
        level,
        isLeaf
      } = levelInfo;
      if (!nodeMap.has(fullCode)) {
        const newNode = {
          id: isLeaf ? item.id : -Math.random(),
          // ID negativo para nodos no-hoja
          account_code: fullCode,
          account_name: name,
          account_level: level,
          status: item.status,
          fiscal_difference: item.fiscal_difference || false,
          parent_id: index > 0 ? levels[index - 1].fullCode : undefined,
          children: isLeaf ? undefined : []
        };
        nodeMap.set(fullCode, newNode);
        if (index === 0) {
          parentNodes.push(newNode);
        } else {
          const parentNode = nodeMap.get(levels[index - 1].fullCode);
          if (parentNode?.children) {
            parentNode.children.push(newNode);
          }
        }
      }
    });
  });
  return tree;
};

// Componente principal
export const AccountingAccounts = () => {
  // Estados
  const [accounts, setAccounts] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeAccordionKeys, setActiveAccordionKeys] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [filters, setFilters] = useState({
    codigo: {
      value: '',
      matchMode: 'customSearch'
    },
    nombre: {
      value: '',
      matchMode: 'customSearch'
    }
  });
  const [fiscalChecked, setFiscalChecked] = useState(false);
  const [activaChecked, setActivaChecked] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedDetalle, setSelectedDetalle] = useState(null);
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    tipo: 'clase',
    codigo: '',
    nombre: '',
    fiscalDifference: false,
    activa: true
  });
  const [codeValidation, setCodeValidation] = useState({
    valid: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulación de hook useAccountingAccounts
  useEffect(() => {
    // Simulamos la carga de datos
    const fetchData = async () => {
      try {
        // Datos de ejemplo simulados
        const mockData = [{
          id: 1,
          account_code: "11010101",
          account_name: "Caja General",
          status: "active",
          initial_balance: "0.00",
          account_type: "asset",
          account: "1",
          sub_account: "10",
          auxiliary: "101",
          sub_auxiliary: "0101",
          fiscal_difference: false,
          created_at: "2023-01-01",
          updated_at: "2023-01-01"
        }, {
          id: 2,
          account_code: "11010102",
          account_name: "Caja Chica",
          status: "active",
          initial_balance: "0.00",
          account_type: "asset",
          account: "1",
          sub_account: "10",
          auxiliary: "101",
          sub_auxiliary: "0102",
          fiscal_difference: true,
          created_at: "2023-01-01",
          updated_at: "2023-01-01"
        }, {
          id: 3,
          account_code: "11020101",
          account_name: "Cuenta Corriente Banco X",
          status: "active",
          initial_balance: "0.00",
          account_type: "asset",
          account: "1",
          sub_account: "10",
          auxiliary: "102",
          sub_auxiliary: "0101",
          created_at: "2023-01-01",
          updated_at: "2023-01-01"
        }, {
          id: 4,
          account_code: "21010101",
          account_name: "Proveedores Nacionales",
          status: "active",
          initial_balance: "0.00",
          account_type: "liability",
          account: "2",
          sub_account: "10",
          auxiliary: "101",
          sub_auxiliary: "0101",
          created_at: "2023-01-01",
          updated_at: "2023-01-01"
        }];
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay de red
        setAccounts(transformApiDataToTree(mockData));
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos de cuentas contables");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Funciones auxiliares
  const findFirstLeaf = useCallback(nodes => {
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) {
        return node;
      }
      const leaf = findFirstLeaf(node.children);
      if (leaf) return leaf;
    }
    return null;
  }, []);
  const findNodePath = useCallback((nodes, id, path = []) => {
    for (const node of nodes) {
      if (node.id === id) return [...path, node];
      if (node.children) {
        const found = findNodePath(node.children, id, [...path, node]);
        if (found) return found;
      }
    }
    return null;
  }, []);
  const getActiveIndexesFromPath = useCallback((nodes, path) => {
    let currentNodes = nodes;
    const activeIndexes = {};
    let currentPath = 'root';
    for (const pathNode of path.slice(0, -1)) {
      const index = currentNodes.findIndex(n => n.id === pathNode.id);
      if (index === -1) break;
      if (!activeIndexes[currentPath]) {
        activeIndexes[currentPath] = [];
      }
      if (!activeIndexes[currentPath].includes(index)) {
        activeIndexes[currentPath].push(index);
      }
      currentNodes = currentNodes[index].children || [];
      currentPath = pathNode.id.toString();
    }
    return activeIndexes;
  }, []);

  // Efectos
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setActiveAccordionKeys({
        'root': [0]
      });
      const firstLeaf = findFirstLeaf(accounts);
      if (firstLeaf) {
        handleAccountSelect(firstLeaf.id);
      }
    }
  }, [accounts, findFirstLeaf]);
  useEffect(() => {
    if (showNewAccountDialog) {
      const parentCode = selectedAccount?.account_code;
      const validation = validateCode(newAccount.codigo, newAccount.tipo, parentCode);
      setCodeValidation(validation);
    }
  }, [newAccount.codigo, newAccount.tipo, selectedAccount, showNewAccountDialog]);

  // Handlers y funciones de renderizado
  const handleAccountSelect = useCallback((id, parentId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const path = findNodePath(accounts, id);
    if (path) {
      const account = path[path.length - 1];
      setSelectedAccount(account);
      setSelectedPath(path);
      setTableData(path.map(node => ({
        tipo: node.account_level.charAt(0).toUpperCase() + node.account_level.slice(1),
        codigo: node.account_code,
        nombre: node.account_name
      })));
      const newActiveIndexes = getActiveIndexesFromPath(accounts, path);
      setActiveAccordionKeys(prev => ({
        ...prev,
        ...newActiveIndexes
      }));
      setFiscalChecked(account.fiscal_difference || false);
      setActivaChecked(account.status === 'active');
    }
  }, [accounts, findNodePath, getActiveIndexesFromPath]);
  const renderAccordion = useCallback((data, depth = 0, parentId = 'root') => {
    return data.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeAccordionKeys[parentId]?.includes(index) || false;
      const isSelected = selectedAccount?.id === item.id;
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: `${item.id}-${depth}-${index}`,
        header: /*#__PURE__*/React.createElement("div", {
          className: classNames("accordion-header-content", {
            'selected-account': isSelected,
            'has-children': hasChildren
          }),
          onClick: e => {
            e.stopPropagation();
            handleAccountSelect(item.id, parentId);
          },
          style: {
            paddingLeft: `${depth * 16}px`
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "account-code"
        }, item.account_code), /*#__PURE__*/React.createElement("span", {
          className: "account-name"
        }, item.account_name), hasChildren && /*#__PURE__*/React.createElement("i", {
          className: `pi pi-chevron-${isActive ? 'down' : 'right'} accordion-arrow`
        }), item.fiscal_difference && /*#__PURE__*/React.createElement("i", {
          className: "pi pi-star-fill fiscal-icon",
          "data-pr-tooltip": "Diferencia fiscal",
          "data-pr-position": "right"
        }))
      }, hasChildren && /*#__PURE__*/React.createElement(Accordion, {
        multiple: true,
        activeIndex: activeAccordionKeys[item.id.toString()] || [],
        onTabChange: e => {
          setActiveAccordionKeys(prev => ({
            ...prev,
            [item.id.toString()]: e.index
          }));
        }
      }, renderAccordion(item.children || [], depth + 1, item.id.toString())));
    });
  }, [activeAccordionKeys, handleAccountSelect, selectedAccount]);
  const filteredAccounts = useMemo(() => {
    if (!filters.codigo.value && !filters.nombre.value) return accounts;
    const filterNodes = nodes => {
      return nodes.map(node => {
        const matchesCode = !filters.codigo.value || node.account_code.toLowerCase().includes(filters.codigo.value.toLowerCase());
        const matchesName = !filters.nombre.value || node.account_name.toLowerCase().includes(filters.nombre.value.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : undefined;
        if (matchesCode || matchesName || filteredChildren && filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
        return null;
      }).filter(node => node !== null);
    };
    return filterNodes(accounts);
  }, [accounts, filters]);
  const accordionContent = useMemo(() => renderAccordion(filteredAccounts, 0), [filteredAccounts, renderAccordion]);
  const getNextLevel = currentLevel => {
    const levels = ['clase', 'grupo', 'cuenta', 'subcuenta', 'auxiliar', 'subauxiliar'];
    const currentIndex = levels.indexOf(currentLevel);
    return levels[currentIndex + 1] || 'subauxiliar';
  };
  const handleCreateAccount = () => {
    if (!newAccount.codigo || !newAccount.nombre || !codeValidation.valid) return;
    console.log('Creando nueva cuenta:', newAccount);
    setShowNewAccountDialog(false);
  };
  const handleOpenNewAccountDialog = () => {
    if (selectedAccount) {
      const nextLevel = getNextLevel(selectedAccount.account_level);
      setNewAccount(prev => ({
        ...prev,
        tipo: nextLevel
      }));
    } else {
      setNewAccount(prev => ({
        ...prev,
        tipo: 'clase'
      }));
    }
    setShowNewAccountDialog(true);
  };

  // Renderizado condicional
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center min-h-screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center p-5"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-spinner pi-spin text-2xl mr-2"
    }), /*#__PURE__*/React.createElement("span", null, "Cargando datos contables...")));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center min-h-screen"
    }, /*#__PURE__*/React.createElement(Message, {
      severity: "error",
      text: `Error al cargar las cuentas: ${error}`,
      className: "w-full md:w-6"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "accounting-container"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    target: ".fiscal-icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-7"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0 fs-5 text-muted"
  }, "Estructura Contable"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 w-100 w-md-auto"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchCode",
    value: filters.codigo.value,
    onChange: e => setFilters({
      ...filters,
      codigo: {
        ...filters.codigo,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchCode"
  }, "C\xF3digo")), /*#__PURE__*/React.createElement("span", {
    className: "p-float-label flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputText, {
    id: "searchName",
    value: filters.nombre.value,
    onChange: e => setFilters({
      ...filters,
      nombre: {
        ...filters.nombre,
        value: e.target.value
      }
    }),
    className: "w-100"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchName"
  }, "Nombre")))), /*#__PURE__*/React.createElement("div", {
    className: "account-accordion-container flex-grow-1"
  }, /*#__PURE__*/React.createElement(Accordion, {
    multiple: true,
    activeIndex: activeAccordionKeys['root'] || [],
    onTabChange: e => {
      setActiveAccordionKeys(prev => ({
        ...prev,
        ['root']: e.index
      }));
    }
  }, accordionContent))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 gap-2"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "flex-grow-1 border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0 fs-5 text-muted"
  }, "Jerarqu\xEDa de la Cuenta"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Subcuenta",
    icon: "pi pi-plus",
    className: "p-button-sm p-button-outlined",
    onClick: handleOpenNewAccountDialog,
    disabled: !selectedAccount,
    tooltip: "Crear una nueva subcuenta bajo la seleccionada",
    tooltipOptions: {
      position: 'top'
    }
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: tableData,
    emptyMessage: "Seleccione una cuenta del plan",
    className: "p-datatable-sm",
    scrollable: true,
    scrollHeight: "flex",
    responsiveLayout: "scroll"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Nivel",
    style: {
      width: '25%'
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge level-${rowData.tipo.toLowerCase()}`
    }, rowData.tipo)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    style: {
      width: '25%'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    style: {
      width: '50%'
    }
  }))))))))))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Nueva Cuenta",
    visible: showNewAccountDialog,
    style: {
      width: '90vw',
      maxWidth: '600px'
    },
    onHide: () => setShowNewAccountDialog(false),
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: "pi pi-times",
      onClick: () => setShowNewAccountDialog(false),
      className: "p-button-text"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Crear",
      icon: "pi pi-check",
      onClick: handleCreateAccount,
      autoFocus: true,
      disabled: !newAccount.codigo || !newAccount.nombre || !codeValidation.valid
    })),
    breakpoints: {
      '960px': '75vw',
      '640px': '90vw'
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid grid formgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountType"
  }, "Tipo de Cuenta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountType",
    value: newAccount.tipo,
    options: accountLevels,
    onChange: e => setNewAccount({
      ...newAccount,
      tipo: e.value
    }),
    optionLabel: "label",
    placeholder: "Seleccione el tipo",
    disabled: !!selectedAccount,
    className: "w-full"
  }), selectedAccount && /*#__PURE__*/React.createElement("small", {
    className: "block mt-1 text-500"
  }, "Creando una subcuenta de nivel ", newAccount.tipo, " para la cuenta ", selectedAccount.account_name)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountCode"
  }, "C\xF3digo *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountCode",
    value: newAccount.codigo,
    onChange: e => setNewAccount({
      ...newAccount,
      codigo: e.target.value
    }),
    required: true,
    className: classNames('w-full', {
      'p-invalid': !codeValidation.valid && newAccount.codigo
    })
  }), !codeValidation.valid && newAccount.codigo && /*#__PURE__*/React.createElement("small", {
    className: "p-error block mt-1"
  }, codeValidation.message), selectedAccount && /*#__PURE__*/React.createElement("small", {
    className: "block mt-1 text-500"
  }, "C\xF3digo padre: ", selectedAccount.account_code)), /*#__PURE__*/React.createElement("div", {
    className: "field col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountName"
  }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, {
    id: "accountName",
    value: newAccount.nombre,
    onChange: e => setNewAccount({
      ...newAccount,
      nombre: e.target.value
    }),
    required: true,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountCategory"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountCategory",
    value: selectedCategoria,
    options: categorias,
    onChange: e => setSelectedCategoria(e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountDetail"
  }, "Detalle de saldos"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "accountDetail",
    value: selectedDetalle,
    options: detalleSaldos,
    onChange: e => setSelectedDetalle(e.value),
    optionLabel: "label",
    placeholder: "Seleccione opci\xF3n",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newFiscalDifference",
    checked: newAccount.fiscalDifference,
    onChange: e => setNewAccount({
      ...newAccount,
      fiscalDifference: e.checked ?? false
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newFiscalDifference",
    className: "ml-2"
  }, "Cuenta de diferencia fiscal")), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "newActive",
    checked: newAccount.activa,
    onChange: e => setNewAccount({
      ...newAccount,
      activa: e.checked ?? false
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newActive",
    className: "ml-2"
  }, "Cuenta activa")))), /*#__PURE__*/React.createElement("style", null, `
                .accounting-container {
                    padding: 1rem;
                    min-height: calc(100vh - 2rem);
                }
                
                .card {
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e5e7eb;
                }
                
                .account-accordion-container {
                    overflow-y: auto;
                    max-height: 60vh;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                
                .accordion-header-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border-radius: 6px;
                    margin: 2px 0;
                }
                
                .accordion-header-content:hover {
                    background-color: #f3f4f6;
                }
                
                .accordion-header-content.selected-account {
                    background-color: #e0e7ff;
                    font-weight: 600;
                }
                
                .account-code {
                    font-weight: 600;
                    color: #1f2937;
                    width: 80px;
                    font-family: monospace;
                }
                
                .account-name {
                    color: #374151;
                    flex-grow: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .accordion-arrow {
                    color: #6b7280;
                    transition: transform 0.2s;
                }
                
                .fiscal-icon {
                    color: #f59e0b;
                    margin-left: auto;
                    margin-right: 0.5rem;
                }
                
                .level-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .level-clase {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                
                .level-grupo {
                    background-color: #e0e7ff;
                    color: #1e3a8a;
                }
                
                .level-cuenta {
                    background-color: #e0f2fe;
                    color: #0369a1;
                }
                
                .level-subcuenta {
                    background-color: #ede9fe;
                    color: #5b21b6;
                }
                
                .level-auxiliar {
                    background-color: #fce7f3;
                    color: #9d174d;
                }
                
                .level-subauxiliar {
                    background-color: #ecfccb;
                    color: #365314;
                }
                
                @media (max-width: 768px) {
                    .accounting-container {
                        padding: 0.5rem;
                    }
                    
                    .account-accordion-container {
                        max-height: 40vh;
                    }
                    
                    .account-code {
                        width: 60px;
                    }
                }
            `));
};
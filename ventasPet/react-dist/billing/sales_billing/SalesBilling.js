function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, InputText, Dropdown, Calendar, DataTable, Column, Toast, InputNumber } from "primereact";
import { classNames } from "primereact/utils";

// Definición de tipos

export const SalesBilling = () => {
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      type: null,
      invoiceNumber: '',
      elaborationDate: null,
      expirationDate: null,
      costCenter: null,
      supplier: null,
      supplierInvoiceNumber: null,
      contact: null
    }
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const [productsArray, setProductsArray] = useState([{
    id: generateId(),
    typeProduct: "",
    product: "",
    description: "",
    quantity: 0,
    price: 0,
    discount: 0,
    iva: 0
  }]);
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([{
    id: generateId(),
    method: "",
    authorizationNumber: "",
    value: 0
  }]);

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del formulario
  const typeOptions = [{
    id: 1,
    name: "ELECTRONIC_INVOICE"
  }, {
    id: 2,
    name: "CREDIT_NOTE"
  }, {
    id: 3,
    name: "DEBIT_NOTE"
  }, {
    id: 4,
    name: "RETENTION_VOUCHER"
  }];
  const makepaymentOptions = [{
    id: 1,
    name: "CASH"
  }, {
    id: 2,
    name: "CREDIT_CARD"
  }, {
    id: 3,
    name: "BANK_TRANSFER"
  }, {
    id: 4,
    name: "CHECK"
  }];
  const costCenterOptions = [{
    id: 1,
    name: "NATIONAL_SALES"
  }, {
    id: 2,
    name: "EXPORTS"
  }, {
    id: 3,
    name: "MARKETING"
  }, {
    id: 4,
    name: "LOGISTICS"
  }];
  const typeProducts = [{
    id: "01",
    name: "PRODUCT_TYPE_1"
  }, {
    id: "02",
    name: "PRODUCT_TYPE_2"
  }, {
    id: "03",
    name: "PRODUCT_TYPE_3"
  }, {
    id: "04",
    name: "PRODUCT_TYPE_4"
  }, {
    id: "05",
    name: "PRODUCT_TYPE_5"
  }];
  const products = [{
    name: "PRODUCT_1",
    code: "001"
  }, {
    name: "PRODUCT_2",
    code: "002"
  }, {
    name: "PRODUCT_3",
    code: "003"
  }, {
    name: "PRODUCT_4",
    code: "004"
  }, {
    name: "PRODUCT_5",
    code: "005"
  }];
  const sellerOptions = [{
    name: "JUAN_PEREZ",
    code: "VEN001"
  }, {
    name: "MARIA_GOMEZ",
    code: "VEN002"
  }, {
    name: "CARLOS_ROJAS",
    code: "VEN003"
  }, {
    name: "ANA_MARTINEZ",
    code: "VEN004"
  }];
  const Contacto = [{
    id: 1,
    fullName: "Javier Antonio Moreno"
  }, {
    id: 2,
    fullName: "Sergio Lopez"
  }];
  const ivaOptions = [{
    id: 0,
    name: "0%"
  }, {
    id: 12,
    name: "12%"
  }, {
    id: 14,
    name: "14%"
  }];
  const retentionTaxOptions = [{
    id: 0,
    name: "No Aplica"
  }, {
    id: 1,
    name: "1%"
  }, {
    id: 2,
    name: "2%"
  }, {
    id: 5,
    name: "5%"
  }, {
    id: 10,
    name: "10%"
  }];

  // Funciones de cálculo en DOP
  const calculateLineTotal = product => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const ivaRate = product.iva || 0; // <-- Cambio aquí
    const withholdingRate = product.withholdingtax || 0; // <-- Cambio aquí

    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (ivaRate / 100);
    const withholdingAmount = subtotalAfterDiscount * (withholdingRate / 100);
    const lineTotal = subtotalAfterDiscount + taxAmount - withholdingAmount;
    return parseFloat(lineTotal.toFixed(2));
  };
  const calculateSubtotal = () => {
    return productsArray.reduce((total, product) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;
      return total + quantity * price;
    }, 0);
  };
  const calculateTotalDiscount = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discount = Number(product.discount) || 0;
      return total + subtotal * (discount / 100);
    }, 0);
  };
  const calculateTotalTax = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const ivaRate = product.iva || 0; // <-- Cambio aquí
      return total + subtotalAfterDiscount * (ivaRate / 100);
    }, 0);
  };
  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateTotalDiscount();
  };
  const calculateTotalWithholdingTax = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const withholdingRate = product.withholdingtax || 0;
      return total + subtotalAfterDiscount * (withholdingRate / 100);
    }, 0);
  };
  const calculateTotal = () => {
    return productsArray.reduce((total, product) => {
      return total + calculateLineTotal(product);
    }, 0);
  };
  const calculateTotalPayments = () => {
    return paymentMethodsArray.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };
  const paymentCoverage = () => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    // Permitimos un pequeño margen por redondeos
    return Math.abs(payments - total) < 0.01;
  };
  // Funciones para manejar productos
  const addProduct = () => {
    setProductsArray([...productsArray, {
      id: generateId(),
      typeProduct: "",
      product: "",
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      iva: 0
    }]);
  };
  const removeProduct = id => {
    if (productsArray.length > 1) {
      setProductsArray(prevProducts => prevProducts.filter(product => product.id !== id));
    }
  };
  const handleProductChange = (id, field, value) => {
    setProductsArray(prevProducts => prevProducts.map(product => product.id === id ? {
      ...product,
      [field]: value
    } : product));
  };

  // Funciones para manejar métodos de pago
  const addPayment = () => {
    setPaymentMethodsArray([...paymentMethodsArray, {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: 0
    }]);
  };
  const removePayment = id => {
    if (paymentMethodsArray.length > 1) {
      setPaymentMethodsArray(prevPayments => prevPayments.filter(payment => payment.id !== id));
    }
  };
  const handlePaymentChange = (id, field, value) => {
    setPaymentMethodsArray(prevPayments => prevPayments.map(payment => payment.id === id ? {
      ...payment,
      [field]: value
    } : payment));
  };

  // Funciones para guardar
  const save = formData => {
    // Validación básica
    if (productsArray.length === 0) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un producto',
        life: 5000
      });
      return;
    }
    if (paymentMethodsArray.length === 0) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un método de pago',
        life: 5000
      });
      return;
    }
    if (!paymentCoverage()) {
      window['toast'].show({
        severity: 'error',
        summary: 'Error',
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)} DOP) no cubren el total de la factura (${calculateTotal().toFixed(2)} DOP)`,
        life: 5000
      });
      return;
    }

    // Función para formatear fechas
    const formatDate = date => {
      if (!date) return '';
      if (date instanceof Date) return date.toISOString();
      return date;
    };

    // Construir objeto de datos
    const invoiceData = {
      // Información básica
      type: formData.type ? formData.type.name : "",
      invoiceNumber: formData.invoiceNumber || "",
      elaborationDate: formatDate(formData.elaborationDate),
      expirationDate: formatDate(formData.expirationDate),
      costCenter: formData.costCenter ? formData.costCenter.name : "",
      supplier: formData.supplier ? formData.supplier.name : "",
      supplierInvoiceNumber: formData.supplierInvoiceNumber || "",
      contact: formData.contact ? formData.contact.fullName : "",
      // Productos
      products: productsArray.map(product => ({
        type: typeof product.typeProduct === 'object' ? product.typeProduct.name : product.typeProduct,
        product: typeof product.product === 'object' ? product.product.name : product.product,
        description: product.description || "",
        quantity: product.quantity || 0,
        unitPrice: product.price || 0,
        discount: product.discount || 0,
        iva: product.iva || 0,
        withholdingTax: product.withholdingtax || 0,
        lineTotal: (product.quantity || 0) * (product.price || 0)
      })),
      // Métodos de pago
      paymentMethods: paymentMethodsArray.map(payment => ({
        method: typeof payment.method === 'object' ? payment.method.name : payment.method,
        authorizationNumber: payment.authorizationNumber || "",
        amount: payment.value || 0
      })),
      // Totales en DOP
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
      totalTax: calculateTotalTax(),
      totalWithholdingTax: calculateTotalWithholdingTax(),
      grandTotal: calculateTotal(),
      currency: "DOP" // Especificamos que todos los montos son en pesos dominicanos
    };
    console.log("📄 Datos completos de la factura:", invoiceData);
    // Aquí iría la llamada a la API para guardar los datos
  };
  const saveAndSend = formData => {
    save(formData); // Primero guarda
    console.log("Enviando factura...");
    // Lógica adicional para enviar
  };

  // Columnas para la tabla de productos
  const productColumns = [{
    field: "type",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.typeProduct,
      options: typeProducts,
      optionLabel: "name",
      placeholder: "Seleccione Tipo",
      className: "w-100",
      onChange: e => handleProductChange(rowData.id, 'typeProduct', e.value)
    })
  }, {
    field: "product",
    header: "Producto",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.product,
      options: products,
      optionLabel: "name",
      placeholder: "Seleccione Producto",
      className: "w-100",
      onChange: e => handleProductChange(rowData.id, 'product', e.value)
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingresar Descripci\xF3n",
      className: "w-100",
      onChange: e => handleProductChange(rowData.id, 'description', e.target.value)
    })
  }, {
    field: "quantity",
    header: "Cantidad",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.quantity,
      placeholder: "Cantidad",
      className: "w-100",
      min: 0,
      onValueChange: e => handleProductChange(rowData.id, 'quantity', e.value || 0)
    })
  }, {
    field: "price",
    header: "Valor unitario",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.price,
      placeholder: "Precio",
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      onValueChange: e => handleProductChange(rowData.id, 'price', e.value || 0)
    })
  }, {
    field: "discount",
    header: "Descuento %",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.discount,
      placeholder: "Descuento",
      className: "w-100",
      suffix: "%",
      min: 0,
      max: 100,
      onValueChange: e => handleProductChange(rowData.id, 'discount', e.value || 0)
    })
  }, {
    field: "iva",
    header: "IVA %",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.iva,
      options: ivaOptions,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione IVA",
      className: "w-100",
      onChange: e => handleProductChange(rowData.id, 'iva', e.value)
    })
  }, {
    field: "withholdingtax",
    header: "Retención %",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.withholdingtax,
      options: retentionTaxOptions,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione Retenci\xF3n",
      className: "w-100",
      onChange: e => handleProductChange(rowData.id, 'withholdingtax', e.value)
    })
  }, {
    field: "totalvalue",
    header: "Valor total",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: (rowData.quantity || 0) * (rowData.price || 0),
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      readOnly: true
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeProduct(rowData.id),
      disabled: productsArray.length <= 1,
      tooltip: "Eliminar producto"
    }, " ", /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }))
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h3 mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-invoice me-2"
  }), "Crear nueva factura de venta"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(save)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user-edit me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: typeOptions,
      optionLabel: "name",
      placeholder: "Seleccione un tipo",
      className: classNames("w-100")
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de factura *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "N\xFAmero de factura",
      className: classNames("w-100")
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de elaboraci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "elaborationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha vencimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "expirationDate",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Centro de costo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "costCenter",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: costCenterOptions,
      optionLabel: "name",
      placeholder: "Seleccione centro de costo",
      className: classNames("w-100")
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplier",
    control: control,
    rules: {
      required: 'Campo obligatorio'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: sellerOptions,
      optionLabel: "name",
      placeholder: "Seleccione proveedor",
      className: classNames("w-100")
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xB0 factura proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplierInvoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "N\xFAmero de factura",
      className: classNames("w-100")
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Contacto *"), /*#__PURE__*/React.createElement(Controller, {
    name: "contact",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: Contacto,
      optionLabel: "fullName",
      placeholder: "Seleccione Contacto",
      className: classNames("w-100")
    })))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Productos"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "A\xF1adir Producto",
    className: "btn btn-primary",
    onClick: addProduct
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: productsArray,
    responsiveLayout: "scroll",
    emptyMessage: "No hay productos agregados",
    className: "p-datatable-sm",
    showGridlines: true,
    stripedRows: true
  }, productColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: {
      minWidth: '150px'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todos de Pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar M\xE9todo",
    className: "btn btn-primary",
    onClick: addPayment
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, paymentMethodsArray.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: payment.method,
    options: makepaymentOptions,
    optionLabel: "name",
    placeholder: "Seleccione m\xE9todo",
    className: "w-100",
    onChange: e => handlePaymentChange(payment.id, 'method', e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xB0 Autorizaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: payment.authorizationNumber,
    placeholder: "N\xFAmero de autorizaci\xF3n",
    className: "w-100",
    onChange: e => handlePaymentChange(payment.id, 'authorizationNumber', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor *"), /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value,
    placeholder: "Valor",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    onValueChange: e => handlePaymentChange(payment.id, 'value', e.value || 0)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-danger p-button-text",
    onClick: () => removePayment(payment.id),
    disabled: paymentMethodsArray.length <= 1,
    tooltip: "Eliminar m\xE9todo"
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total factura:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalPayments(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, !paymentCoverage() ? /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-1"
  }), "Faltan ", (calculateTotal() - calculateTotalPayments()).toFixed(2), " DOP") : /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-1"
  }), "Pagos completos")))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calculator me-2 text-primary"
  }), "Totales (DOP)")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotal(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal con descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotalAfterDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "IVA"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Retenci\xF3n"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalWithholdingTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Total"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "w-100 font-weight-bold",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(saveAndSend),
    disabled: !paymentCoverage()
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: el => window['toast'] = el
  }));
};
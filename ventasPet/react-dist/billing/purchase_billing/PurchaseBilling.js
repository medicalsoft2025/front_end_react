function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, InputText, Dropdown, Calendar, DataTable, Column, Toast, InputNumber } from "primereact";
import { classNames } from "primereact/utils";

// Definición de tipos

export const PurchaseBilling = () => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const toast = useRef(null);
  const [productsArray, setProductsArray] = useState([{
    id: generateId(),
    typeProduct: null,
    product: null,
    description: "",
    quantity: 0,
    price: 0,
    discount: 0,
    iva: null,
    withholdingtax: null
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
    name: "FACTURA_ELECTRONICA",
    code: "FAC"
  }, {
    id: 2,
    name: "NOTA_CREDITO",
    code: "NCR"
  }, {
    id: 3,
    name: "NOTA_DEBITO",
    code: "NDB"
  }, {
    id: 4,
    name: "COMPROBANTE_RETENCION",
    code: "RET"
  }];
  const makepaymentOptions = [{
    id: 1,
    name: "EFECTIVO"
  }, {
    id: 2,
    name: "TARJETA_CREDITO"
  }, {
    id: 3,
    name: "TRANSFERENCIA"
  }, {
    id: 4,
    name: "CHEQUE"
  }];
  const costCenterOptions = [{
    id: 1,
    name: "COMPRAS"
  }, {
    id: 2,
    name: "INVENTARIO"
  }, {
    id: 3,
    name: "LOGISTICA"
  }, {
    id: 4,
    name: "ADMINISTRACION"
  }];
  const suppliers = [{
    id: 1,
    fullName: "PROVEEDOR_PRINCIPAL"
  }, {
    id: 2,
    fullName: "PROVEEDOR_SECUNDARIO"
  }, {
    id: 3,
    fullName: "IMPORTADOR"
  }, {
    id: 4,
    fullName: "DISTRIBUIDOR_LOCAL"
  }];
  const typeProducts = [{
    id: "01",
    name: "MATERIA_PRIMA"
  }, {
    id: "02",
    name: "EMPAQUE"
  }, {
    id: "03",
    name: "EQUIPO"
  }, {
    id: "04",
    name: "SUMINISTROS_OFICINA"
  }, {
    id: "05",
    name: "SERVICIOS"
  }];
  const products = [{
    name: "BARRAS_ACERO",
    code: "MAT001"
  }, {
    name: "CONTENEDORES_PLASTICO",
    code: "MAT002"
  }, {
    name: "COMPONENTES_ELECTRICOS",
    code: "MAT003"
  }, {
    name: "TABLAS_MADERA",
    code: "MAT004"
  }, {
    name: "QUIMICOS",
    code: "MAT005"
  }];
  const destinationOptions = [{
    id: 1,
    name: "BODEGA_PRINCIPAL",
    code: "WH001"
  }, {
    id: 2,
    name: "BODEGA_SECUNDARIA",
    code: "WH002"
  }, {
    id: 3,
    name: "LINEA_PRODUCCION",
    code: "PL001"
  }, {
    id: 4,
    name: "OFICINA",
    code: "OF001"
  }];
  const buyerOptions = [{
    id: 1,
    name: "DEPARTAMENTO_COMPRAS",
    code: "BUY001"
  }, {
    id: 2,
    name: "GERENTE_PRODUCCION",
    code: "BUY002"
  }, {
    id: 3,
    name: "GERENTE_BODEGA",
    code: "BUY003"
  }];
  const contactOptions = [{
    id: 1,
    name: "CONTACTO_PROVEEDOR_1",
    code: "CON001"
  }, {
    id: 2,
    name: "CONTACTO_PROVEEDOR_2",
    code: "CON002"
  }, {
    id: 3,
    name: "CONTACTO_LOGISTICA",
    code: "CON003"
  }];
  const supplierInvoiceOptions = [{
    id: 1,
    name: "PROV-001-2023",
    code: "SUP001"
  }, {
    id: 2,
    name: "PROV-002-2023",
    code: "SUP002"
  }, {
    id: 3,
    name: "PROV-003-2023",
    code: "SUP003"
  }];
  const ivaOptions = [{
    id: 0,
    name: "0%"
  }, {
    id: 12,
    name: "12%"
  }, {
    id: 18,
    name: "18%"
  }];
  const retentionTaxOptions = [{
    id: 0,
    name: "NO_APLICA"
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
    const ivaRate = product.iva ? Number(product.iva.id) : 0;
    const withholdingRate = product.withholdingtax ? Number(product.withholdingtax.id) : 0;
    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (ivaRate / 100);
    const withholdingAmount = subtotalAfterDiscount * (withholdingRate / 100);
    const lineTotal = subtotalAfterDiscount + taxAmount - withholdingAmount;

    // Redondeamos a 2 decimales para evitar errores de precisión
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
      const ivaRate = product.iva ? Number(product.iva.id) : 0;
      return total + subtotalAfterDiscount * (ivaRate / 100);
    }, 0);
  };
  const calculateTotalWithholding = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const withholdingRate = product.withholdingtax ? Number(product.withholdingtax.id) : 0;
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
      typeProduct: null,
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      iva: null,
      withholdingtax: null
    }]);
  };
  const removeProduct = id => {
    if (productsArray.length > 1) {
      setProductsArray(productsArray.filter(product => product.id !== id));
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe tener al menos un producto',
        life: 3000
      });
    }
  };
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
      setPaymentMethodsArray(paymentMethodsArray.filter(payment => payment.id !== id));
    } else {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe tener al menos un método de pago',
        life: 3000
      });
    }
  };
  const handleProductChange = (id, field, value) => {
    setProductsArray(prevProducts => prevProducts.map(product => product.id === id ? {
      ...product,
      [field]: value
    } : product));
  };

  // Función para manejar el cambio en los métodos de pago
  const handlePaymentChange = (id, field, value) => {
    setPaymentMethodsArray(prevPayments => prevPayments.map(payment => payment.id === id ? {
      ...payment,
      [field]: field === 'value' ? Number(value) : value
    } : payment));
  };

  // Función para guardar datos
  const save = formData => {
    // Validaciones
    if (productsArray.length === 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un producto',
        life: 5000
      });
      return;
    }
    if (paymentMethodsArray.length === 0) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe agregar al menos un método de pago',
        life: 5000
      });
      return;
    }
    if (!paymentCoverage()) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)}) no cubren el total de la factura (${calculateTotal().toFixed(2)})`,
        life: 5000
      });
      return;
    }

    // Construir objeto de datos
    const invoiceData = {
      // Información básica
      type: formData.type,
      invoiceNumber: formData.invoiceNumber,
      elaborationDate: formData.elaborationDate,
      expirationDate: formData.expirationDate,
      supplier: formData.supplier,
      supplierInvoiceNumber: formData.supplierInvoiceNumber,
      costCenter: formData.costCenter,
      buyer: formData.buyer,
      destination: formData.destination,
      contact: formData.contact,
      // Productos
      products: productsArray.map(product => ({
        typeProduct: product.typeProduct?.name || "",
        product: product.product?.name || "",
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        discount: product.discount,
        iva: product.iva?.id || 0,
        withholdingTax: product.withholdingtax?.id || 0,
        lineTotal: product.quantity * product.price
      })),
      // Métodos de pago
      paymentMethods: paymentMethodsArray.map(payment => ({
        method: payment.method,
        authorizationNumber: payment.authorizationNumber,
        value: payment.value
      })),
      // Totales en DOP
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      totalTax: calculateTotalTax(),
      totalWithholding: calculateTotalWithholding(),
      grandTotal: calculateTotal(),
      totalPayments: calculateTotalPayments(),
      paymentCoverage: paymentCoverage(),
      currency: "DOP"
    };
    console.log("Datos de la factura de compra:", invoiceData);
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Factura de compra guardada correctamente',
      life: 3000
    });
  };
  const saveAndSend = formData => {
    save(formData);
    console.log("Enviando factura de compra...");
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Factura de compra guardada y enviada',
      life: 3000
    });
  };

  // Columnas para la tabla de productos
  const productColumns = [{
    field: "typeProduct",
    header: "Tipo de producto",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.typeProduct,
      options: typeProducts,
      optionLabel: "name",
      placeholder: "Seleccione tipo",
      className: "w-full",
      onChange: e => handleProductChange(rowData.id, 'typeProduct', e.value)
    })
  }, {
    field: "product",
    header: "Producto",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.product,
      options: products,
      optionLabel: "name",
      placeholder: "Seleccione producto",
      className: "w-full",
      onChange: e => handleProductChange(rowData.id, 'product', e.value)
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingrese descripci\xF3n",
      className: "w-full",
      onChange: e => handleProductChange(rowData.id, 'description', e.target.value)
    })
  }, {
    field: "quantity",
    header: "Cantidad",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.quantity,
      placeholder: "Cantidad",
      className: "w-full",
      min: 0,
      onValueChange: e => handleProductChange(rowData.id, 'quantity', e.value || 0)
    })
  }, {
    field: "price",
    header: "Valor unitario",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.price,
      placeholder: "Valor unitario",
      className: "w-full",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0,
      minFractionDigits: 2,
      maxFractionDigits: 6,
      onValueChange: e => handleProductChange(rowData.id, 'price', e.value || 0)
    })
  }, {
    field: "discount",
    header: "Descuento",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.discount,
      placeholder: "Descuento %",
      className: "w-full",
      suffix: "%",
      min: 0,
      max: 100,
      onValueChange: e => handleProductChange(rowData.id, 'discount', e.value || 0)
    })
  }, {
    field: "iva",
    header: "IVA",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.iva,
      options: ivaOptions,
      optionLabel: "name",
      placeholder: "Seleccione IVA",
      className: "w-full",
      onChange: e => handleProductChange(rowData.id, 'iva', e.value)
    })
  }, {
    field: "withholdingtax",
    header: "Retención",
    body: rowData => /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.withholdingtax,
      options: retentionTaxOptions,
      optionLabel: "name",
      placeholder: "Seleccione retenci\xF3n",
      className: "w-full",
      onChange: e => handleProductChange(rowData.id, 'withholdingtax', e.value)
    })
  }, {
    field: "totalvalue",
    header: "Valor total",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: calculateLineTotal(rowData),
      className: "w-full",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      minFractionDigits: 2,
      maxFractionDigits: 2,
      readOnly: true
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeProduct(rowData.id),
      disabled: productsArray.length <= 1,
      tooltip: "Eliminar producto",
      tooltipOptions: {
        position: 'top'
      }
    })
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "h3 mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-invoice me-2"
  }), "Crear nueva factura de compra"))))))), /*#__PURE__*/React.createElement("div", {
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
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: typeOptions,
      optionLabel: "name",
      placeholder: "Seleccione tipo",
      className: classNames("w-100")
    }))
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
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "Generado autom\xE1ticamente",
      className: "w-100",
      readOnly: true
    }))
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
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha vencimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "expirationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplier",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: suppliers,
      optionLabel: "fullName",
      placeholder: "Seleccione proveedor",
      className: classNames("w-100")
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero factura proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplierInvoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: supplierInvoiceOptions,
      optionLabel: "name",
      placeholder: "N\xFAmero factura",
      className: classNames("w-100")
    }))
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
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: costCenterOptions,
      optionLabel: "name",
      placeholder: "Seleccione centro",
      className: classNames("w-100")
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Comprador *"), /*#__PURE__*/React.createElement(Controller, {
    name: "buyer",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: buyerOptions,
      optionLabel: "name",
      placeholder: "Seleccione comprador",
      className: classNames("w-100")
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Destino *"), /*#__PURE__*/React.createElement(Controller, {
    name: "destination",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: destinationOptions,
      optionLabel: "name",
      placeholder: "Seleccione destino",
      className: classNames("w-100")
    }))
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
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: contactOptions,
      optionLabel: "name",
      placeholder: "Seleccione contacto",
      className: classNames("w-100")
    }))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Productos/Servicios"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "A\xF1adir producto",
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
  }), "M\xE9todo de pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar m\xE9todo",
    className: "btn btn-primary",
    onClick: addPayment
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, paymentMethodsArray.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
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
    onChange: e => handlePaymentChange(payment.id, 'method', e.value || "")
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero autorizaci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
    value: payment.authorizationNumber,
    placeholder: "N\xFAmero autorizaci\xF3n",
    className: "w-100",
    onChange: e => handlePaymentChange(payment.id, 'authorizationNumber', e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor"), /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value,
    placeholder: "Ingrese valor",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    minFractionDigits: 2,
    maxFractionDigits: 6,
    onValueChange: e => handlePaymentChange(payment.id, 'value', e.value || 0)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-trash",
    className: "p-button-rounded p-button-danger p-button-text",
    onClick: () => removePayment(payment.id),
    disabled: paymentMethodsArray.length <= 1,
    tooltip: "Eliminar m\xE9todo",
    tooltipOptions: {
      position: 'top'
    }
  })))), /*#__PURE__*/React.createElement("div", {
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
  }), "Resumen de compra (DOP)")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "SUBTOTAL"), /*#__PURE__*/React.createElement(InputNumber, {
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
    value: calculateTotalWithholding(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "TOTAL"), /*#__PURE__*/React.createElement(InputNumber, {
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
    label: "Guardar y enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(saveAndSend),
    disabled: !paymentCoverage()
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};
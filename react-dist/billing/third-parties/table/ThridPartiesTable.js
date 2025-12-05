import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useThirdParties } from "../hooks/useThirdParties.js";
import { ThirdPartyModal } from "../modals/ThridPartiesModal.js";
import { useThirdPartyCreate } from "../hooks/useThirdPartyCreate.js";
import { useThirdPartyUpdate } from "../hooks/useThirdPartyUpdate.js";
import { useThirdPartyDelete } from "../hooks/useThirdPartyDelete.js";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { CustomPRTableMenu } from "../../../components/CustomPRTableMenu.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const ThridPartiesTable = () => {
  const {
    thirdParties,
    fetchThirdParties,
    loading
  } = useThirdParties();
  const {
    createThirdParty
  } = useThirdPartyCreate();
  const {
    updateThirdParty
  } = useThirdPartyUpdate();
  const {
    deleteThirdParty
  } = useThirdPartyDelete();
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTercero, setSelectedTercero] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [filtros, setFiltros] = useState({
    tipoTercero: null,
    documento: null,
    nombre: null,
    fechaDesde: null,
    fechaHasta: null
  });
  const tiposTercero = [{
    label: 'Cliente',
    value: 'client'
  }, {
    label: 'Proveedor',
    value: 'provider'
  }, {
    label: 'Entidad',
    value: 'entity'
  }];
  const handleSaveTercero = async formData => {
    try {
      if (selectedTercero) {
        await updateThirdParty(selectedTercero.id.toString(), {
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth
        });
      } else {
        await createThirdParty({
          name: formData.contact.name,
          type: formData.type,
          document_type: formData.contact.document_type,
          document_number: formData.contact.document_number,
          email: formData.contact.email,
          phone: formData.contact.phone,
          address: formData.contact.address,
          first_name: formData.contact.first_name,
          middle_name: formData.contact.middle_name,
          last_name: formData.contact.last_name,
          second_last_name: formData.contact.second_last_name,
          date_of_birth: formData.contact.date_of_birth
        });
      }
      fetchThirdParties();
      setModalVisible(false);
      setSelectedTercero(null);
      setInitialData(null);
    } catch (error) {
      console.error(error);
      SwalManager.error({
        title: "Error",
        text: "No se pudo guardar el tercero"
      });
    }
  };
  const handleEditTercero = tercero => {
    setInitialData({
      type: tercero?.type || '',
      contact: {
        name: tercero?.name || '',
        document_type: tercero?.document_type || '',
        document_number: tercero?.document_number || '',
        email: tercero?.email || '',
        phone: tercero?.phone || '',
        address: tercero?.address || '',
        first_name: tercero?.first_name || '',
        middle_name: tercero?.middle_name || '',
        last_name: tercero?.last_name || '',
        second_last_name: tercero?.second_last_name || '',
        date_of_birth: tercero?.date_of_birth || ''
      }
    });
    setSelectedTercero(tercero);
    setModalVisible(true);
  };
  const handleDeleteTercero = async tercero => {
    SwalManager.confirmDelete(async () => {
      const confirmed = await deleteThirdParty(tercero.id.toString());
      if (confirmed) {
        fetchThirdParties();
        SwalManager.success({
          title: "Tercero eliminado correctamente"
        });
      }
    });
  };
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = async () => {
    try {
      setError(null);
      // Aquí puedes implementar la lógica de filtrado si es necesario
      console.log('Aplicando filtros:', filtros);
    } catch (err) {
      setError('Ocurrió un error al aplicar los filtros');
    }
  };
  const limpiarFiltros = () => {
    setFiltros({
      tipoTercero: null,
      documento: null,
      nombre: null,
      fechaDesde: null,
      fechaHasta: null
    });
    setError(null);
  };
  const handleSearchChange = searchValue => {
    handleFilterChange('nombre', searchValue);
  };
  const handleRefresh = () => {
    limpiarFiltros();
    fetchThirdParties();
  };
  const getMenuItems = rowData => [{
    label: "Editar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt me-2"
    }),
    command: () => handleEditTercero(rowData)
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash me-2"
    }),
    command: () => handleDeleteTercero(rowData)
  }];
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };
  const tipoTerceroTemplate = rowData => {
    const tipoMap = {
      client: {
        severity: 'success',
        label: 'Cliente'
      },
      provider: {
        severity: 'info',
        label: 'Proveedor'
      },
      entity: {
        severity: 'primary',
        label: 'Entidad'
      }
    };
    const {
      severity = 'secondary',
      label = rowData.type
    } = tipoMap[rowData.type] || {};
    return /*#__PURE__*/React.createElement(Tag, {
      value: label,
      severity: severity
    });
  };
  const documentoTemplate = rowData => {
    return `${rowData.document_type || ''} ${rowData.document_number}`.trim();
  };
  const tableItems = thirdParties?.map(tercero => ({
    id: tercero.id,
    type: tercero.type,
    document_type: tercero.document_type,
    document_number: tercero.document_number,
    name: tercero.name,
    email: tercero.email,
    phone: tercero.phone,
    address: tercero.address,
    actions: tercero
  })) || [];
  const columns = [{
    field: 'id',
    header: 'ID',
    sortable: true
  }, {
    field: 'type',
    header: 'Tipo',
    sortable: true,
    body: rowData => tipoTerceroTemplate(rowData.actions)
  }, {
    field: 'document_number',
    header: 'Documento',
    sortable: true,
    body: rowData => documentoTemplate(rowData.actions)
  }, {
    field: 'name',
    header: 'Nombre Completo',
    sortable: true
  }, {
    field: 'email',
    header: 'Email',
    sortable: true
  }, {
    field: 'phone',
    header: 'Teléfono',
    sortable: true
  }, {
    field: 'address',
    header: 'Dirección',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false
  }];
  const styles = {
    card: {
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: '0.5rem',
      display: 'block'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(ThirdPartyModal, {
    visible: modalVisible,
    onHide: () => {
      setModalVisible(false);
      setSelectedTercero(null);
      setInitialData(null);
    },
    onSubmit: handleSaveTercero,
    onEdit: handleSaveTercero,
    initialData: initialData,
    loading: false,
    error: null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '10px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Crear Nuevo Tercero",
    icon: "pi pi-file-edit",
    className: "p-button-primary",
    onClick: () => {
      setInitialData(null);
      setSelectedTercero(null);
      setModalVisible(true);
    }
  })), error ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, error) : /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: fetchThirdParties,
    searchPlaceholder: "Buscar terceros por nombre..."
  })));
};
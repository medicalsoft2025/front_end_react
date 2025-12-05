import React, { useState } from "react";
import { useAdmissions } from "./hooks/useAdmissions.js";
import { PrimeReactProvider } from "primereact/api";
import { AdmissionTable } from "./AdmissionTable.js";
import { useMakeRequest } from "../general-request/hooks/useMakeRequest.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { MakeRequestForm } from "../general-request/components/MakeRequestForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { useDataPagination } from "../hooks/useDataPagination.js";
export const AdmissionApp = () => {
  const {
    admissions,
    fetchAdmissions,
    loading,
    totalRecords
  } = useAdmissions();
  const {
    makeRequest
  } = useMakeRequest();
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [filters, setFilters] = useState({});
  function getCustomFilters() {
    return filters;
  }
  const fetchAdmissionsForPagination = async params => {
    const result = await fetchAdmissions({
      ...params,
      ...filters,
      sort: "-createdAt"
    });

    // Retornar en el formato que espera useDataPagination
    return {
      data: result.data,
      // Los datos ya mapeados por useAdmissions
      total: result.total
    };
  };
  const {
    data: admissionData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords: totalRecordsPaginator,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: fetchAdmissionsForPagination,
    defaultPerPage: 10,
    getCustomFilters: getCustomFilters
  });
  const requestCancellation = id => {
    setSelectedItemId(id);
    setShowCancellationModal(true);
  };
  const handleMakeRequest = async requestData => {
    try {
      if (selectedItemId) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedItemId,
          requestable_type: "admission",
          notes: requestData.notes || null
        });
        setShowCancellationModal(false);
        refresh();
      } else {
        SwalManager.error({
          text: "No se ha seleccionado una admisión",
          title: "Error"
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFilter = filters => {
    // Formatear correctamente las fechas
    let dateFilter = null;
    if (filters.selectedDate && filters.selectedDate[0] && filters.selectedDate[1]) {
      dateFilter = filters.selectedDate.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(",");
    }
    const newFilters = {
      admittedBy: filters.selectedAdmittedBy,
      patientId: filters.selectedPatient,
      entityId: filters.selectedEntity,
      createdAt: dateFilter,
      productId: filters.selectedProduct
    };
    refresh(newFilters);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(AdmissionTable, {
    items: admissionData,
    onCancelItem: requestCancellation,
    first: first,
    rows: perPage,
    totalRecords: totalRecordsPaginator,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh,
    handleFilter: handleFilter
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    show: showCancellationModal,
    onHide: () => setShowCancellationModal(false),
    formId: "cancellationForm",
    title: "Solicitud de anulaci\xF3n"
  }, /*#__PURE__*/React.createElement(MakeRequestForm, {
    formId: "cancellationForm",
    onHandleSubmit: handleMakeRequest
  })));
};
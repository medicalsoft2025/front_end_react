import React, { useEffect, useState, useCallback } from "react";
import { useAdmissions, AdmissionTableItem } from "./hooks/useAdmissions";
import { PrimeReactProvider } from "primereact/api";
import { AdmissionTable, AdmissionTableFilters } from "./AdmissionTable";
import { useMakeRequest } from "../general-request/hooks/useMakeRequest";
import { CustomFormModal } from "../components/CustomFormModal";
import {
  MakeRequestForm,
  MakeRequestFormInputs,
} from "../general-request/components/MakeRequestForm";
import { SwalManager } from "../../services/alertManagerImported";
import { useDataPagination } from "../hooks/useDataPagination";

export const AdmissionApp: React.FC = () => {
  const { admissions, fetchAdmissions, loading, totalRecords } =
    useAdmissions();
  const { makeRequest } = useMakeRequest();

  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [filters, setFilters] = useState<any>({});

  function getCustomFilters() {
    return filters;
  }

  const fetchAdmissionsForPagination = async (params: any) => {
    
    const result = await fetchAdmissions({
      ...params,
      ...filters,
      sort: "-createdAt",
    });

    // Retornar en el formato que espera useDataPagination
    return {
      data: result.data, // Los datos ya mapeados por useAdmissions
      total: result.total,
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
    refresh,
  } = useDataPagination({
    fetchFunction: fetchAdmissionsForPagination,
    defaultPerPage: 10,
    getCustomFilters: getCustomFilters,
  });

  const requestCancellation = (id: string) => {
    setSelectedItemId(id);
    setShowCancellationModal(true);
  };

  const handleMakeRequest = async (requestData: MakeRequestFormInputs) => {
    try {
      if (selectedItemId) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedItemId,
          requestable_type: "admission",
          notes: requestData.notes || null,
        });
        setShowCancellationModal(false);
        refresh();
      } else {
        SwalManager.error({
          text: "No se ha seleccionado una admisión",
          title: "Error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (filters: AdmissionTableFilters) => {
    // Formatear correctamente las fechas
    let dateFilter = null;
    if (
      filters.selectedDate &&
      filters.selectedDate[0] &&
      filters.selectedDate[1]
    ) {
      dateFilter = filters.selectedDate
        .filter((date) => !!date)
        .map((date) => date.toISOString().split("T")[0])
        .join(",");
    }

    const newFilters = {
      admittedBy: filters.selectedAdmittedBy,
      patientId: filters.selectedPatient,
      entityId: filters.selectedEntity,
      createdAt: dateFilter,
      productId: filters.selectedProduct,
    };
    refresh(newFilters);
  };

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <AdmissionTable
          items={admissionData}
          onCancelItem={requestCancellation}
          first={first}
          rows={perPage}
          totalRecords={totalRecordsPaginator}
          loading={loadingPaginator}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={refresh}
          handleFilter={handleFilter}
        />
      </PrimeReactProvider>

      <CustomFormModal
        show={showCancellationModal}
        onHide={() => setShowCancellationModal(false)}
        formId="cancellationForm"
        title="Solicitud de anulación"
      >
        <MakeRequestForm
          formId="cancellationForm"
          onHandleSubmit={handleMakeRequest}
        />
      </CustomFormModal>
    </>
  );
};

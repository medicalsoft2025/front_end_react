import { useState, useEffect } from "react";
import { admissionService } from "../../../services/api";
import { cleanJsonObject } from "../../../services/utilidades";
import { formatDate } from "../../../services/utilidades";

export interface AdmissionTableItem {
  id: string;
  createdAt: string;
  admittedBy: string;
  patientName: string;
  patientDNI: string;
  authorizationNumber: string;
  authorizedAmount: string;
  entityName: string;
  koneksiClaimId: string | null;
  status: string;
  originalItem: any;
  invoiceCode: string;
  invoiceId: string;
  products: string;
}

export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState<AdmissionTableItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const mapAdmissionToTableItem = (item: any): AdmissionTableItem => {
    return {
      id: item.id,
      createdAt: formatDate(item.created_at),
      admittedBy: `${item.user.first_name || ""} ${
        item.user.middle_name || ""
      } ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
      patientName: `${item.patient.first_name || ""} ${
        item.patient.middle_name || ""
      } ${item.patient.last_name || ""} ${item.patient.second_last_name || ""}`,
      entityName: item.entity?.name || "--",
      koneksiClaimId: item.koneksi_claim_id,
      patientDNI: item.patient.document_number || "--",
      authorizationNumber: item.authorization_number || "--",
      authorizedAmount: item.entity_authorized_amount || "0.00",
      originalItem: item,
      status: item.status,
      invoiceCode: item?.invoice?.invoice_code || "",
      invoiceId: item?.invoice?.id || "",
      products:
        item?.invoice?.details
          ?.map((detail: any) => detail.product.name)
          .join(", ") || "",
    };
  };

  const fetchAdmissions = async (filters?: any) => {
    setLoading(true);
    try {
      const data = await admissionService.filterAdmissions(
        cleanJsonObject(filters)
      );

      setTotalRecords(data.data.total);

      const mappedAdmissions = data.data.data.map(mapAdmissionToTableItem);
      setAdmissions(mappedAdmissions);
      return {
        data: mappedAdmissions || data.data.data,
        total: data.data.total || data.data.count || 0,
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchAdmissions();
  // }, []);
  return { admissions, fetchAdmissions, totalRecords, loading };
};

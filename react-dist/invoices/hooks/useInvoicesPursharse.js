import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { invoiceService } from "../../../services/api/index.js";


export const useInvoicePursharse = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const mapInvoiceData = (response) => {
        const mapped = response.data.map(item => {
          const attr = item.attributes;
          return {
            id: attr.id.toString(),
            cliente: attr.customer?.name || "Sin cliente",
            fechaCreacion: new Date(attr.created_at),
            fechaVencimiento: new Date(attr.due_date),
            total: parseFloat(attr.total_amount),
            detalles: item.relationships.details.map(d => ({
              id: d.id,
              cantidad: d.attributes.quantity,
              precioUnitario: parseFloat(d.attributes.unit_price),
              subtotal: parseFloat(d.attributes.subtotal),
              productoId: d.attributes.product_id
            }))
          };
        });
        console.log("Mapped invoices:", mapped);
        return mapped;
      };
      
  
    const fetchInvoiceById = async (id) => {
      setLoading(true);
      try {
        const data = await invoiceService.getPurcharseInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        ErrorHandler.generic(err);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchAllInvoice = async (params = {}) => {
        setLoading(true);
        try {
          const response = await invoiceService.getAllPurcharseInvoice(params);
          if (response?.data) {
            const mapped = mapInvoiceData(response);
            return mapped;
          }
          return [];
        } catch (err) {
          ErrorHandler.generic(err);
          return [];
        } finally {
          setLoading(false);
        }
      };
      
  
    const storeInvoice = async (invoiceData) => {
      setLoading(true);
      try {
        const response = await invoiceService.storePurcharseInvoice(invoiceData);
        return response;
      } catch (err) {
        ErrorHandler.generic(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };
  
    return {
      invoice,
      setInvoice,
      fetchInvoiceById,
      storeInvoice,
      loading,
      fetchAllInvoice
    };
  };
  
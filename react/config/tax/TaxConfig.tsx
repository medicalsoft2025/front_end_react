import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import TaxConfigModal from './modal/TaxConfigModal';
import { TaxConfigTable } from './table/TaxConfigTable';
import { SwalManager } from '../../../services/alertManagerImported';
import { useTaxConfigById } from './hooks/useTaxConfigById';
import { TaxFormInputs } from './interfaces/taxConfigForm';
import { useTaxConfigCreate } from './hooks/useTaxConfigCreate';
import { useTaxConfigDelete } from './hooks/useTaxConfigDelete';
import { useTaxConfigUpdate } from './hooks/useTaxConfigUpdate';
import { CreateTaxDTO } from './interfaces/taxConfigDTO';
import { useTaxConfigTable } from './hooks/useTaxConfigTable';

export const TaxConfig = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<TaxFormInputs | undefined>(undefined);

    const { taxes, loading, error, refreshTaxes } = useTaxConfigTable();
    console.log(taxes, 'taxeeeesss');
    const { createTax, loading: createLoading } = useTaxConfigCreate();
    const { updateTax, loading: updateLoading } = useTaxConfigUpdate();
    const { fetchTaxById, taxById, setTaxById } = useTaxConfigById();
    const { deleteTax, loading: deleteLoading } = useTaxConfigDelete();

    const onCreate = () => {
        setInitialData(undefined);
        setTaxById(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: TaxFormInputs) => {
        try {
            const taxData: CreateTaxDTO = {
                name: data.name,
                document_type: data.document_type,
                document_number: data.document_number,
                email: data.email,
                address: data.address,
                phone: data.phone,
                city_id: data.city_id,
                tax_charge_id: data.tax_charge_id || null,
                withholding_tax_id: data.withholding_tax_id || null,
                koneksi_sponsor_slug: data.koneksi_sponsor_slug || null,
            };

            if (taxById) {
                await updateTax(taxById.id.toString(), taxData);
                SwalManager.success('Impuesto actualizado correctamente');
            } else {
                await createTax(taxData);
                SwalManager.success('Impuesto creado correctamente');
            }

            await refreshTaxes();
            setShowFormModal(false);
        } catch (error) {
        }
    };

    const handleTableEdit = async (id: string) => {
        try {
            await fetchTaxById(id);
            setShowFormModal(true);
        } catch (error) {
            console.error("Error fetching tax:", error);
        }
    };

    const handleDeleteTax = async (id: string) => {
        try {
            const success = await deleteTax(id);
            if (success) {
                await refreshTaxes();
            }
        } catch (error) {
            console.error("Error deleting tax:", error);
        }
    };

    useEffect(() => {
        if (taxById) {
            const data: TaxFormInputs = {
                name: taxById.name,
                document_type: taxById.document_type,
                document_number: taxById.document_number,
                email: taxById.email,
                address: taxById.address,
                phone: taxById.phone,
                city_id: taxById.city_id,
                tax_charge_id: taxById.tax_charge_id || '' || null,
                withholding_tax_id: taxById.withholding_tax_id || '' || null,
                koneksi_sponsor_slug: taxById.koneksi_sponsor_slug || '' || null,
            };
            setInitialData(data);
        }
    }, [taxById]);

    return (
        <PrimeReactProvider
            value={{
                appendTo: "self",
                zIndex: {
                    overlay: 100000,
                },
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Configuración de Impuestos</h4>
                <div style={{ margin: "-2px 20px -20px" }} className="text-end">
                    <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={onCreate}
                        disabled={createLoading || updateLoading || deleteLoading}
                    >
                        <i className="fas fa-plus me-2"></i>
                        {createLoading || updateLoading ? 'Procesando...' : 'Nuevo Impuesto'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <TaxConfigTable
                onEditItem={handleTableEdit}
                taxes={taxes}
                onDeleteItem={handleDeleteTax}
                loading={loading}
            />

            <TaxConfigModal
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => {
                    setShowFormModal(false);
                    setTaxById(null);
                    setInitialData(undefined);
                }}
                initialData={initialData}
                loading={createLoading || updateLoading || deleteLoading}
            />
        </PrimeReactProvider>
    );
};
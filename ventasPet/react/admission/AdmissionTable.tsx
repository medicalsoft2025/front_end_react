import { ConfigColumns } from 'datatables.net-bs5';
import React, { useState } from 'react';
import { useEffect } from 'react';
import CustomDataTable from '../components/CustomDataTable';
import { formatDate } from '../../services/utilidades';
import TableActionsWrapper from '../components/table-actions/TableActionsWrapper';
import { SwalManager } from '../../services/alertManagerImported';
import { cancelConsultationClaim } from '../../services/koneksiService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useUsers } from '../users/hooks/useUsers';
import { usePatients } from '../patients/hooks/usePatients';
import { useEntities } from '../entities/hooks/useEntities';
import { Nullable } from 'primereact/ts-helpers';
import { CustomFormModal } from '../components/CustomFormModal';
import { UpdateAdmissionAuthorizationForm } from './UpdateAdmissionAuthorizationForm';
import { CustomModal } from '../components/CustomModal';
import { admissionService } from '../../services/api';

interface AdmissionTableProps {
    items: any[],
    onReload?: () => void;
}

interface AdmissionTableItem {
    createdAt: string;
    admittedBy: string;
    patientName: string;
    patientDNI: string;
    authorizationNumber: string;
    authorizedAmount: string;
    entityName: string;
    koneksiClaimId: string | null;
    originalItem: any;
}

export const AdmissionTable: React.FC<AdmissionTableProps> = ({ items, onReload }) => {

    const { users } = useUsers();
    const { patients } = usePatients();
    const { entities } = useEntities();

    const [tableItems, setTableItems] = useState<AdmissionTableItem[]>([]);
    const [filteredTableItems, setFilteredTableItems] = useState<AdmissionTableItem[]>([]);
    const [selectedAdmittedBy, setSelectedAdmittedBy] = useState<string | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Nullable<(Date | null)[]>>([new Date(), new Date()]);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');

    const [showUpdateAuthorizationModal, setShowUpdateAuthorizationModal] = useState(false);

    const [showAttachFileModal, setShowAttachFileModal] = useState(false);

    useEffect(() => {
        const mappedItems: any[] = items.map(item => {
            return {
                createdAt: formatDate(item.created_at),
                admittedBy: `${item.user.first_name || ''} ${item.user.middle_name || ''} ${item.user.last_name || ''} ${item.user.second_last_name || ''}`,
                patientName: `${item.patient.first_name || ''} ${item.patient.middle_name || ''} ${item.patient.last_name || ''} ${item.patient.second_last_name || ''}`,
                entityName: item.entity.name || '--',
                koneksiClaimId: item.koneksi_claim_id,
                patientDNI: item.patient.document_number || '--',
                authorizationNumber: item.authorization_number || '--',
                authorizedAmount: item.entity_authorized_amount || '0.00',
                originalItem: item
            }
        })
        setTableItems(mappedItems);
    }, [items])

    // Aplicar filtros cuando cambia alguno de ellos
    useEffect(() => {
        if (tableItems.length === 0) return;

        let result = [...tableItems];

        if (selectedAdmittedBy) {
            result = result.filter(item =>
                item.originalItem.user.id === selectedAdmittedBy
            );
        }

        if (selectedPatient) {
            result = result.filter(item =>
                item.originalItem.patient.id === selectedPatient
            );
        }

        if (selectedEntity) {
            result = result.filter(item =>
                item.originalItem.entity.id === selectedEntity
            );
        }

        if (selectedDate && selectedDate[0] && selectedDate[1]) {

            selectedDate[0].setHours(0, 0, 0, 0);
            selectedDate[1].setHours(0, 0, 0, 0);

            const startDate = new Date(selectedDate[0]);
            const endDate = new Date(selectedDate[1]);

            endDate.setHours(23, 59, 59, 999);

            result = result.filter(item => {
                const itemDate = new Date(item.originalItem.created_at);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        setFilteredTableItems(result);
    }, [selectedAdmittedBy, selectedPatient, selectedEntity, selectedDate, tableItems]);

    const columns: ConfigColumns[] = [
        { data: 'createdAt', },
        { data: 'admittedBy', },
        { data: 'patientName', },
        { data: 'patientDNI', },
        { data: 'entityName', },
        { data: 'authorizationNumber', },
        { data: 'authorizedAmount', type: 'currency' },
        { orderable: false, searchable: false }
    ]

    const cancelClaim = (claimId: string) => {
        //console.log('Cancel claim with ID:', claimId);
        SwalManager.confirmCancel(
            async () => {

                try {

                    const response = await cancelConsultationClaim(claimId)

                    //console.log(response);

                    SwalManager.success({
                        title: 'Éxito',
                        text: 'Reclamación anulada con éxito.'
                    })

                } catch (error) {

                    SwalManager.error({
                        title: 'Error',
                        text: 'No se pudo anular la reclamación.'
                    })
                }
            }
        )
    }

    const openUpdateAuthorizationModal = (admissionId: string) => {
        //console.log('Open update authorization modal with admission ID:', admissionId);
        setSelectedAdmissionId(admissionId);
        setShowUpdateAuthorizationModal(true);
    }

    const openAttachDocumentModal = async (admissionId: string) => {
        setSelectedAdmissionId(admissionId);
        setShowAttachFileModal(true);
    }

    const handleUploadDocument = async () => {
        try {
            //@ts-ignore
            const minioId = await guardarDocumentoAdmision('admissionDocumentInput', selectedAdmissionId);

            if (minioId !== undefined) {
                //console.log("PDF de prueba:", minioId);
                //console.log("Resultado de la promesa:", minioId);
                await admissionService.update(selectedAdmissionId, {
                    document_minio_id: minioId.toString()
                });
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            setShowAttachFileModal(false);
            onReload && onReload()
        }
    }

    const seeDocument = async (minioId: string) => {
        if (minioId) {
            //@ts-ignore
            const url = await getFileUrl(minioId);
            window.open(url, '_blank');
            return;
        }

        SwalManager.error({
            title: 'Error',
            text: 'No se pudo visualizar el documento adjunto.'
        })
    }

    const slots = {
        7: (cell, data: AdmissionTableItem) => (
            <>
                <TableActionsWrapper>
                    <li>
                        <a className="dropdown-item" href="#" onClick={() => openUpdateAuthorizationModal(data.originalItem.id)}>
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fa-solid fa-pencil" style={{ width: '20px' }}></i>
                                <span>Actualizar información de autorización</span>
                            </div>
                        </a>
                    </li>
                    {!data.originalItem.document_minio_id &&
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => openAttachDocumentModal(data.originalItem.id)}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-file-pdf" style={{ width: '20px' }}></i>
                                    <span>Adjuntar documento</span>
                                </div>
                            </a>
                        </li>
                    }
                    {data.originalItem.document_minio_id &&
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => seeDocument(data.originalItem.document_minio_id)}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-file-pdf" style={{ width: '20px' }}></i>
                                    <span>Ver documento adjunto</span>
                                </div>
                            </a>
                        </li>
                    }
                    {data.koneksiClaimId &&
                        <>
                            <li>
                                <a className="dropdown-item" href="#" onClick={() => cancelClaim(data.koneksiClaimId!)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-ban" style={{ width: '20px' }}></i>
                                        <span>Anular reclamación</span>
                                    </div>
                                </a>
                            </li>
                        </>
                    }
                </TableActionsWrapper>
            </>
        )
    }

    return (
        <>
            <div className="accordion mb-3">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="filters">
                        <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#filtersCollapse"
                            aria-expanded="false"
                            aria-controls="filtersCollapse"
                        >
                            Filtrar admisiones
                        </button>
                    </h2>
                    <div
                        id="filtersCollapse"
                        className="accordion-collapse collapse"
                        aria-labelledby="filters"
                    >
                        <div className="accordion-body">
                            <div className="d-flex gap-2">
                                <div className="flex-grow-1">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label htmlFor="rangoFechasCitas" className="form-label">
                                                Admisionado entre
                                            </label>
                                            <Calendar
                                                id="rangoFechasCitas"
                                                name="rangoFechaCitas"
                                                selectionMode="range"
                                                dateFormat="dd/mm/yy"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.value)}
                                                className="w-100"
                                                placeholder="Seleccione un rango"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="admittedBy" className="form-label">
                                                Admisionado por
                                            </label>
                                            <Dropdown
                                                inputId="admittedBy"
                                                options={users}
                                                optionLabel="label"
                                                optionValue="id"
                                                filter
                                                placeholder="Admisionado por"
                                                className="w-100"
                                                value={selectedAdmittedBy}
                                                onChange={(e) => setSelectedAdmittedBy(e.value)}
                                                showClear
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="patient" className="form-label">
                                                Paciente
                                            </label>
                                            <Dropdown
                                                inputId="patient"
                                                options={patients}
                                                optionLabel="label"
                                                optionValue="id"
                                                filter
                                                placeholder="Paciente"
                                                className="w-100"
                                                value={selectedPatient}
                                                onChange={(e) => setSelectedPatient(e.value)}
                                                showClear
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="entity" className="form-label">
                                                Entidad
                                            </label>
                                            <Dropdown
                                                inputId="entity"
                                                options={entities}
                                                optionLabel="label"
                                                optionValue="id"
                                                filter
                                                placeholder="Entidad"
                                                className="w-100"
                                                value={selectedEntity}
                                                onChange={(e) => setSelectedEntity(e.value)}
                                                showClear
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={filteredTableItems}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Admisionado el</th>
                                {/* <th className="border-top custom-th">Sucursal</th> */}
                                <th className="border-top custom-th">Admisionado por</th>
                                <th className="border-top custom-th">Paciente</th>
                                <th className="border-top custom-th">Número de identificación</th>
                                <th className="border-top custom-th">Entidad</th>
                                <th className="border-top custom-th">Número de autorización</th>
                                <th className="border-top custom-th">Monto autorizado</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
            <CustomFormModal
                formId='updateAdmissionAuthorization'
                title='Actualizar información de autorización'
                show={showUpdateAuthorizationModal}
                onHide={() => setShowUpdateAuthorizationModal(false)}
            >
                <UpdateAdmissionAuthorizationForm formId='updateAdmissionAuthorization' admissionId={selectedAdmissionId} />
            </CustomFormModal>
            <CustomModal
                title='Subir documento adjunto'
                show={showAttachFileModal}
                onHide={() => setShowAttachFileModal(false)}
                footerTemplate={<>
                    <input
                        type="file"
                        accept=".pdf"
                        id="admissionDocumentInput"
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAttachFileModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            handleUploadDocument();
                            setShowAttachFileModal(false);
                        }}
                    >
                        Confirmar
                    </button>
                </>}
            >
                <p>Por favor, seleccione un archivo PDF.</p>
            </CustomModal>
        </>
    )
};


import { classNames } from 'primereact/utils';
import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Nullable } from 'primereact/ts-helpers';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { usePatientExamRecipes } from '../exam-recipes/hooks/usePatientExamRecipes';
import { useEffect } from 'react';
import { useState } from 'react';

export type ExamRecipeResultFormInputs = {
    date: Nullable<Date>;
    exam_recipe_id: string | null;
    comment: string | undefined;
    uploaded_by_user_id: string | undefined;
    result_minio_id?: string | undefined;
}

interface AddParaclinicalFormProps {
    formId: string;
    onHandleSubmit: (data: ExamRecipeResultFormInputs) => void;
}

const patientId = new URLSearchParams(window.location.search).get('patient_id');

export const AddParaclinicalForm: React.FC<AddParaclinicalFormProps> = ({ formId, onHandleSubmit }) => {

    const [file, setFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ExamRecipeResultFormInputs>()
    const onSubmit: SubmitHandler<ExamRecipeResultFormInputs> = (data) => onHandleSubmit(data)

    const { patientExamRecipes, fetchPatientExamRecipes } = usePatientExamRecipes();

    const getFormErrorMessage = (name: keyof ExamRecipeResultFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const previewFile = () => {
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');

        setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
    }

    useEffect(() => {
        if (!patientId) {
            console.error('No se encontró el ID del paciente en la URL.');
            return;
        }
        fetchPatientExamRecipes(patientId);
    }, []);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Fecha *</label>
                                <Calendar
                                    id={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames('w-100', { 'p-invalid': errors.date })}
                                    appendTo={'self'}
                                    placeholder="Seleccione una fecha"
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('date')}
                </div>
                <div className="mb-3">
                    <Controller
                        name='exam_recipe_id'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Receta de examen</label>
                                <Dropdown
                                    inputId={field.name}
                                    options={patientExamRecipes}
                                    optionLabel='label'
                                    optionValue='id'
                                    filter
                                    showClear
                                    placeholder="Seleccione una receta de examen"
                                    className={classNames('w-100', { 'p-invalid': errors.exam_recipe_id })}
                                    appendTo={'self'}
                                    {...field}
                                >
                                </Dropdown>
                            </>
                        }
                    />
                    {getFormErrorMessage('exam_recipe_id')}
                </div>
                <div className="mb-3">
                    <Controller
                        name='comment'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Comentarios (opcional)</label>
                                <InputTextarea
                                    id={field.name}
                                    autoResize
                                    {...field}
                                    rows={5}
                                    cols={30}
                                    className="w-100"
                                />
                            </>
                        }
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="addParaclinicalFormFile" className="form-label">Adjuntar resultados de exámenes</label>
                    <div className="d-flex">
                        <div className="d-flex flex-fill">
                            <input
                                className="form-control"
                                type="file"
                                id="addParaclinicalFormFile"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                            {file && <>
                                <div className="d-flex">
                                    <button className="btn btn-primary ms-2" type='button' onClick={previewFile}>
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>
                    <small className="text-muted">Haz clic para cargar o arrastra y suelta el archivo</small>
                </div>
            </form>
        </div>
    );
};


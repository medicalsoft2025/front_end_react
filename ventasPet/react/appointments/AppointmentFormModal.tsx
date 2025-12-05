import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { CustomModal } from '../components/CustomModal';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useUserSpecialties } from '../user-specialties/hooks/useUserSpecialties';
import { Patient, UserAvailability, UserSpecialtyDto } from '../models/models';
import { useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { userAvailabilityService, userService } from '../../services/api';
import { RadioButton } from 'primereact/radiobutton';
import { stringToDate } from '../../services/utilidades';
import { useProducts } from '../products/hooks/useProducts';
import { externalCauses as commonExternalCauses, purposeConsultations, typeConsults } from '../../services/commons';
import { usePatients } from '../patients/hooks/usePatients';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { useAppointmentBulkCreate } from './hooks/useAppointmentBulkCreate';
import { usePatientExamRecipes } from '../exam-recipes/hooks/usePatientExamRecipes';
import { useValidateBulkAppointments } from './hooks/useValidateBulkAppointments';
import { Tooltip } from 'primereact/tooltip';

export interface AppointmentFormInputs {
    uuid: string;
    user_specialty: UserSpecialtyDto | null;
    show_exam_recipe_field: boolean;
    exam_recipe_id: string | null;
    appointment_date: Nullable<Date>;
    appointment_time: string | null;
    assigned_user_availability: UserAvailability | null;
    assigned_user_assistant_availability_id: string | null;
    appointment_type: '1' | '2' | '3';
    product_id: string | null;
    consultation_purpose: string | null;
    consultation_type: string | null;
    external_cause: string | null;
    patient: Patient | null;
    patient_whatsapp: string;
    patient_email: string;
}

export interface FormAppointment extends AppointmentFormInputs {
    errors: Record<string, any>;
}

export const AppointmentFormModal = ({ isOpen, onClose }) => {

    const [appointments, setAppointments] = useState<FormAppointment[]>([]);
    const [currentAppointment, setCurrentAppointment] = useState<FormAppointment | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formValid, setFormValid] = useState(false);

    const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
    const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
    const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);

    const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
    const [userSpecialtyError, setUserSpecialtyError] = useState('');

    const [showRecurrentFields, setShowRecurrentFields] = useState(false);
    const [appointmentFrequency, setAppointmentFrequency] = useState('diary');
    const [appointmentRepetitions, setAppointmentRepetitions] = useState<Nullable<number | null>>(1);

    const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<any[]>([]);
    const [userAvailabilityOptions, setUserAvailabilityOptions] = useState<any[]>([]);
    const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState<any[]>([]);

    const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
    const [enabledDates, setEnabledDates] = useState<Date[]>([]);

    const { userSpecialties } = useUserSpecialties();
    const { products } = useProducts();
    const { patients } = usePatients();
    const { createAppointmentBulk } = useAppointmentBulkCreate();
    const { validateBulkAppointments } = useValidateBulkAppointments();
    const { patientExamRecipes, setPatientExamRecipes, fetchPatientExamRecipes } = usePatientExamRecipes();

    const consultationPurposes = Object.entries(purposeConsultations).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const consultationTypes = Object.entries(typeConsults).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const externalCauses = Object.entries(commonExternalCauses).map(([key, value]) => ({
        value: key,
        label: value,
    }));
    const frequencies = [
        { value: 'diary', label: 'Diario' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensual' },
        { value: 'bimestral', label: 'Bimestral' },
        { value: 'semestral', label: 'Semestral' },
        { value: 'annual', label: 'Anual' },
    ]

    const {
        control,
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<AppointmentFormInputs>({
        defaultValues: {
            uuid: '',
            appointment_date: null,
            appointment_time: '',
            assigned_user_availability: null,
            appointment_type: '1'
        }
    });

    const mapAppointmentsToServer = async (appointments: AppointmentFormInputs[]) => {

        const currentUser = await userService.getLoggedUser();

        return appointments.map(app => {

            const assignedUserAvailability = app.assigned_user_assistant_availability_id || app.assigned_user_availability?.id;
            const supervisorUserId = app.assigned_user_assistant_availability_id ? app.assigned_user_availability?.id : null;

            return {
                "appointment_date": app.appointment_date?.toISOString().split('T')[0],
                "appointment_time": app.appointment_time + ":00",
                "assigned_user_availability_id": assignedUserAvailability,
                "product_id": app.product_id,
                "created_by_user_id": currentUser?.id,
                "appointment_state_id": 1,
                "attention_type": "CONSULTATION",
                "consultation_purpose": app.consultation_purpose,
                "consultation_type": app.consultation_type,
                "external_cause": app.external_cause,
                "assigned_supervisor_user_availability_id": supervisorUserId,
                "exam_recipe_id": app.exam_recipe_id,
            }
        })
    }

    const addAppointments = async (data: AppointmentFormInputs) => {

        if (editingId && appointments.find(app => app.uuid === editingId)) {

            setAppointments(appointments.map(app =>
                app.uuid === editingId ? { ...app, ...data } : app
            ));
            setEditingId(null);

            clearAppointmentForm();

        } else {

            const newAppointments: any[] = [];
            let currentDate = data.appointment_date ? new Date(data.appointment_date) : null;

            for (let i = 0; i < (appointmentRepetitions || 1); i++) {

                if (currentDate) {

                    const appointmentDateCopy = new Date(currentDate);

                    const newAppointment = {
                        ...data,
                        uuid: crypto.randomUUID(),
                        appointment_date: appointmentDateCopy
                    };

                    newAppointments.push(newAppointment);

                    switch (appointmentFrequency) {
                        case 'diary':
                            currentDate.setDate(currentDate.getDate() + 1);
                            break;
                        case 'weekly':
                            currentDate.setDate(currentDate.getDate() + 7);
                            break;
                        case 'monthly':
                            currentDate.setMonth(currentDate.getMonth() + 1);
                            break;
                        case 'bimestral':
                            currentDate.setMonth(currentDate.getMonth() + 2);
                            break;
                        case 'semestral':
                            currentDate.setMonth(currentDate.getMonth() + 6);
                            break;
                        case 'annual':
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                            break;
                        default:
                            currentDate.setDate(currentDate.getDate() + 1);
                            break;
                    }
                }
            }

            const validatedAppointments = await validateAppointments(newAppointments);

            setAppointments(prev => [...prev, ...validatedAppointments]);
        }
    };

    const validateAppointments = async (_appointments: FormAppointment[]) => {
        const mappedAppointments = await mapAppointmentsToServer(_appointments);

        try {
            await validateBulkAppointments(mappedAppointments, patient?.id.toString() || '');

            // Si la validación es exitosa, limpiamos los errores
            return _appointments.map(appointment => ({
                ...appointment,
                errors: {}
            }));

        } catch (error: any) {
            if (error.response?.status === 422) {
                // Parseamos el error correctamente
                const errorData = error.data?.errors || {};

                return _appointments.map((appointment, index) => ({
                    ...appointment,
                    errors: errorData[index.toString()] || {}
                }));
            }

            // En caso de otros errores, mantenemos las citas como están
            return _appointments;
        }
    };

    const onSubmit = async (e: any) => {

        e.preventDefault();

        const data = await mapAppointmentsToServer(appointments);

        const res = await createAppointmentBulk({
            appointments: data
        }, patient!.id.toString());
    };

    const userSpecialty = useWatch({
        control,
        name: 'user_specialty',
    });

    const showExamRecipeField = useWatch({
        control,
        name: 'show_exam_recipe_field',
    });

    const appointmentDate = useWatch({
        control,
        name: 'appointment_date',
    });

    const appointmentTime = useWatch({
        control,
        name: 'appointment_time',
    });

    const appointmentType = useWatch({
        control,
        name: 'appointment_type',
    });

    const patient = useWatch({
        control,
        name: 'patient',
    });

    const assignedUserAvailability = useWatch({
        control,
        name: 'assigned_user_availability',
    });

    useEffect(() => {
        if (patient) {
            fetchPatientExamRecipes(patient.id.toString());
        } else {
            setPatientExamRecipes([]);
        }
    }, [patient?.id]);

    useEffect(() => {
        if (userSpecialty) {
            setShowUserSpecialtyError(false);
            setValue('appointment_date', null);
            setAppointmentTimeOptions([]);

            const asyncScope = async () => {
                const availableBlocks: any[] = await userAvailabilityService.availableBlocks({
                    user_specialty_id: userSpecialty?.id,
                } as any);

                console.log('availableBlocks', availableBlocks);

                setAvailableBlocks(availableBlocks);

                if (availableBlocks.length > 0) {
                    setAppointmentDateDisabled(false);
                    setAppointmentTimeDisabled(false);
                    setUserAvailabilityDisabled(false);
                } else {
                    setShowUserSpecialtyError(true);
                    setUserSpecialtyError(userSpecialty?.label);
                }

                setEnabledDates([]);

                let availableDates: Date[] = [];

                availableBlocks.forEach(item => {
                    item.days.forEach(day => {
                        if (!enabledDates.includes(day.date)) {
                            availableDates.push(stringToDate(day.date));
                        }
                    });
                });

                setEnabledDates(availableDates);

                updateAppointmentTimeOptions(availableBlocks, availableDates[0]);
            }
            asyncScope()
        } else {
            setShowUserSpecialtyError(false);
            setAppointmentDateDisabled(true);
            setAppointmentTimeDisabled(true);
            setUserAvailabilityDisabled(true);
            setValue('appointment_date', null);
            setValue('appointment_time', '');
            setValue('assigned_user_availability', null);
            setAvailableBlocks([]);
            setEnabledDates([]);
            setAppointmentTimeOptions([]);
            setUserAvailabilityOptions([]);
        }
    }, [userSpecialty]);

    useEffect(() => {
        if (appointmentDate) {
            updateAppointmentTimeOptions(availableBlocks, appointmentDate);
        }
    }, [appointmentDate]);

    useEffect(() => {
        if (appointmentTime && appointmentDate) {
            filterDoctors(availableBlocks, appointmentDate.toISOString().split('T')[0], appointmentTime, appointmentType);
        }
    }, [appointmentTime]);

    useEffect(() => {
        if (appointmentType && appointmentDate && appointmentTime) {
            filterDoctors(availableBlocks, appointmentDate.toISOString().split('T')[0], appointmentTime, appointmentType);
        }
    }, [appointmentType]);

    useEffect(() => {

        if (assignedUserAvailability) {

            const currentAvailableUserIds = userAvailabilityOptions.map((availability: any) => availability.user.id);

            const userAssistantAvailabilities = assignedUserAvailability.user.assistants.map((assistant: any) => {

                if (!currentAvailableUserIds.includes(assistant.id)) { return null }

                return {
                    id: assistant.id,
                    label: `${assistant.first_name} ${assistant.middle_name} ${assistant.last_name} ${assistant.second_last_name}`,
                    value: assistant.id,
                };

            }).filter((assistant: any) => assistant !== null);

            if (userAssistantAvailabilities.length > 0) {

                setAssistantAvailabilityOptions(userAssistantAvailabilities);
                setValue('assigned_user_assistant_availability_id', currentAppointment?.assigned_user_assistant_availability_id || null);

            } else {

                setAssistantAvailabilityOptions([]);
                setValue('assigned_user_assistant_availability_id', null);
            }
        } else {

            setAssistantAvailabilityOptions([]);
            setValue('assigned_user_assistant_availability_id', null);
        }
    }, [assignedUserAvailability]);

    useEffect(() => {
        if (editingId === null) {
            setCurrentAppointment(null);
        }
    }, [editingId]);

    useEffect(() => {
        if (patient) {
            const whatsapp = patient.whatsapp || '';
            const email = patient.email || '';

            if (getValues('patient_whatsapp') !== whatsapp) {
                setValue('patient_whatsapp', whatsapp);
            }

            if (getValues('patient_email') !== email) {
                setValue('patient_email', email);
            }
        } else {
            setValue('patient_whatsapp', '');
            setValue('patient_email', '');
        }
    }, [patient?.id, patient?.whatsapp, patient?.email]);

    useEffect(() => {
        if (!enabledDates.length) return;
        setValue('appointment_date', currentAppointment?.appointment_date || enabledDates.length > 0 ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0] : null);
    }, [enabledDates]);

    useEffect(() => {
        if (appointmentTimeOptions.length > 0 && appointmentDate) {

            const selectedTime = appointmentTimeOptions.length > 0 ? appointmentTimeOptions[0].value : null;

            setValue('appointment_time', currentAppointment?.appointment_time || selectedTime || null);

            filterDoctors(availableBlocks, appointmentDate?.toISOString().split('T')[0], currentAppointment?.appointment_time || selectedTime);
        }
    }, [appointmentTimeOptions]);

    useEffect(() => {
        setFormValid(appointments.length > 0 && !!patient);
    }, [appointments, patient]);

    const handleRemove = (id: string) => {
        setAppointments(appointments.filter(app => app.uuid !== id));
    };

    const handleEdit = (appointment: FormAppointment) => {
        setEditingId(appointment.uuid);
        fillAppointmentForm(appointment);
    };

    const handleClear = () => {
        clearAppointmentForm();
        setEditingId(null);
    };

    const handleCopy = (appointment: FormAppointment) => {
        setEditingId(null);
        fillAppointmentForm(appointment);
    };

    const fillAppointmentForm = (appointment: FormAppointment) => {
        setCurrentAppointment(appointment);
        setValue('user_specialty', appointment.user_specialty);
        setValue('show_exam_recipe_field', appointment.show_exam_recipe_field);
        setValue('exam_recipe_id', appointment.exam_recipe_id);
        setValue('appointment_type', appointment.appointment_type);
        setValue('product_id', appointment.product_id);
        setValue('consultation_purpose', appointment.consultation_purpose);
        setValue('consultation_type', appointment.consultation_type);
        setValue('external_cause', appointment.external_cause);
        setShowRecurrentFields(false)
        setAppointmentFrequency('diary')
        setAppointmentRepetitions(1)
    }

    const clearAppointmentForm = () => {
        setValue('user_specialty', null);
        setValue('show_exam_recipe_field', false);
        setValue('exam_recipe_id', null);
        setValue('appointment_type', '1');
        setValue('appointment_date', null);
        setValue('appointment_time', null);
        setValue('assigned_user_availability', null);
        setValue('product_id', null);
        setValue('consultation_purpose', null);
        setValue('consultation_type', null);
        setValue('external_cause', null);
        setShowRecurrentFields(false)
        setAppointmentFrequency('diary')
        setAppointmentRepetitions(1)
        setEditingId(null);
    }

    const getFormErrorMessage = (name: keyof AppointmentFormInputs) => {
        return errors[name] && errors[name].type !== 'required' && <small className="p-error">{errors[name].message}</small>
    };

    const hasValidationErrors = () => {
        return appointments.some((appointment) => {
            return Object.keys(appointment.errors).length > 0;
        });
    };

    const computeTimeSlots = (start: string, end: string, duration: number) => {
        const slots: string[] = [];
        let current = new Date(`1970-01-01T${start}`);
        const endTime = new Date(`1970-01-01T${end}`);

        while (current.getTime() + duration * 60000 <= endTime.getTime()) {
            const hours = current.getHours().toString().padStart(2, '0');
            const minutes = current.getMinutes().toString().padStart(2, '0');
            slots.push(`${hours}:${minutes}`);
            current = new Date(current.getTime() + duration * 60000);
        }

        return slots;
    }

    function filterDoctors(availableBlocks: any[], selectedDate: string, selectedTime: string, appointmentType: string = '1') {

        const selectedTimeDate = new Date(`1970-01-01T${selectedTime}`);
        let availableAvailabilities: any[] = [];
        let filteredAvailableBlocks: any[] = availableBlocks.filter((item) => item.appointment_type.id == appointmentType);

        filteredAvailableBlocks.forEach((item) => {
            item.days.forEach((day) => {
                if (day.date === selectedDate) {
                    day.blocks.forEach((block) => {
                        const blockStart = new Date(`1970-01-01T${block.start_time}`);
                        const blockEnd = new Date(`1970-01-01T${block.end_time}`);

                        if (selectedTimeDate >= blockStart && selectedTimeDate < blockEnd) {
                            availableAvailabilities.push(item);
                        }
                    });
                }
            });
        });

        const uniqueAvailabilities: any[] = [];
        const seenIds = new Set();

        availableAvailabilities.forEach((avail) => {
            if (!seenIds.has(avail.availability_id)) {
                seenIds.add(avail.availability_id);
                uniqueAvailabilities.push(avail);
            }
        });

        const doctorOptions = uniqueAvailabilities.map((avail) => ({
            ...avail,
            id: avail.availability_id,
            full_name: `${avail.user.first_name || ''} ${avail.user.middle_name || ''} ${avail.user.last_name || ''} ${avail.user.second_last_name || ''}`,
        }));

        setUserAvailabilityOptions(doctorOptions);
        setValue('assigned_user_availability', currentAppointment?.assigned_user_availability || doctorOptions[0] || null);
    }

    const updateAppointmentTimeOptions = (availableBlocks, date: Date) => {

        const dateString = date.toISOString().split('T')[0];
        setAppointmentTimeOptions([]);

        let blocks: any[] = [];

        availableBlocks.forEach((item) => {
            item.days.forEach((day) => {
                if (day.date === dateString) {
                    day.blocks.forEach((block) => {
                        blocks.push({
                            start: block.start_time,
                            end: block.end_time,
                            duration: item.appointment_duration,
                            user: item.user,
                            availability_id: item.availability_id
                        });
                    });
                }
            });
        });

        let options: any[] = [];

        blocks.forEach((block) => {
            const slots = computeTimeSlots(block.start, block.end, block.duration);
            options = options.concat(
                slots.map((slot) => ({
                    time: slot,
                    availability_id: block.availability_id,
                    user: block.user,
                }))
            );
        });

        let uniqueOptions: any[] = [];

        const seenTimes = new Set();
        options.forEach((option) => {
            if (!seenTimes.has(option.time)) {
                seenTimes.add(option.time);
                uniqueOptions.push(option);
            }
        });

        uniqueOptions.sort((a, b) => a.time.localeCompare(b.time));

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayDate = `${year}-${month}-${day}`;

        const currentTime = String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');

        if (appointmentDate?.toISOString().split('T')[0] === todayDate) {
            uniqueOptions = uniqueOptions.filter(opcion => opcion.time >= currentTime);
        }

        setAppointmentTimeOptions(uniqueOptions.map((opcion) => ({
            label: opcion.time,
            value: opcion.time,
        })));
    }

    return (
        <CustomModal
            show={isOpen}
            onHide={onClose}
            title="Crear cita"
        >
            {/* Columna izquierda - Formulario */}
            <form
                className="needs-validation row"
                noValidate
                onSubmit={onSubmit}
            >
                <div className="col-12">
                    <div className="mb-3">
                        <Controller
                            name='patient'
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) =>
                                <>
                                    <label htmlFor={field.name} className="form-label">Paciente *</label>
                                    <Dropdown
                                        inputId={field.name}
                                        options={patients}
                                        optionLabel='label'
                                        filter
                                        showClear
                                        placeholder="Seleccione un paciente"
                                        className={classNames('w-100', { 'p-invalid': errors.patient })}
                                        appendTo={'self'}
                                        {...field}
                                    >
                                    </Dropdown>
                                </>
                            }
                        />
                        {getFormErrorMessage('patient')}
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Controller
                                name='patient_whatsapp'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className="form-label">Whatsapp *</label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.patient_whatsapp })}
                                            {...field}
                                        />
                                    </>
                                }
                            />
                            {getFormErrorMessage('patient_whatsapp')}
                        </div>
                        <div className="col-md-6 mb-3">
                            <Controller
                                name='patient_email'
                                control={control}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className="form-label">Email</label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.patient_email })}
                                            {...field}
                                        />
                                    </>
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 px-3 mb-3">
                    <Card>
                        <div className="row">
                            <div className="col-md-7">

                                <div className="mb-3">
                                    <Controller
                                        name='user_specialty'
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) =>
                                            <>
                                                <label htmlFor={field.name} className="form-label">Especialidad médica *</label>
                                                <Dropdown
                                                    inputId={field.name}
                                                    options={userSpecialties}
                                                    optionLabel='label'
                                                    filter
                                                    showClear
                                                    placeholder="Seleccione una especialidad"
                                                    className={classNames('w-100', { 'p-invalid': errors.user_specialty })}
                                                    appendTo={'self'}
                                                    {...field}
                                                >
                                                </Dropdown>
                                            </>
                                        }
                                    />
                                    {getFormErrorMessage('user_specialty')}
                                </div>

                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <Checkbox
                                        inputId="showExamRecipeField"
                                        name="showExamRecipeField"
                                        checked={showExamRecipeField}
                                        onChange={(e) => setValue('show_exam_recipe_field', e.target.checked || false)}
                                    />
                                    <label htmlFor="showExamRecipeField" className="ml-2 form-check-label">Relacionar receta de examen</label>
                                </div>

                                {showExamRecipeField && <>
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
                                </>}

                                {showUserSpecialtyError && (
                                    <div className="alert alert-danger" role="alert">
                                        No hay especialistas de: <span>{userSpecialtyError}</span> disponibles en este momento
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label mb-2">Tipo de cita *</label>
                                    <div className="d-flex flex-wrap gap-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <Controller
                                                name='appointment_type'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <RadioButton
                                                            inputId={field.name + '1'}
                                                            checked={appointmentType === '1'}
                                                            className={classNames('', { 'p-invalid': errors.appointment_type })}
                                                            value="1"
                                                            onChange={(e) => field.onChange(e.value)}
                                                        />
                                                        <label htmlFor={field.name + '1'} className="ml-2 form-check-label">Presencial</label>
                                                    </>
                                                }
                                            />
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Controller
                                                name='appointment_type'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>

                                                        <RadioButton
                                                            inputId={field.name + '3'}
                                                            checked={appointmentType === '3'}
                                                            className={classNames('', { 'p-invalid': errors.appointment_type })}
                                                            onChange={(e) => field.onChange(e.value)}
                                                            value="3"
                                                        />
                                                        <label htmlFor={field.name + '3'} className="ml-2 form-check-label">Domiciliaria</label>
                                                    </>
                                                }
                                            />
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Controller
                                                name='appointment_type'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>

                                                        <RadioButton
                                                            inputId={field.name + '2'}
                                                            checked={appointmentType === '2'}
                                                            className={classNames('', { 'p-invalid': errors.appointment_type })}
                                                            onChange={(e) => field.onChange(e.value)}
                                                            value="2"
                                                        />
                                                        <label htmlFor={field.name + '2'} className="ml-2 form-check-label">Virtual</label>
                                                    </>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {getFormErrorMessage('appointment_type')}
                                </div>

                                <div className="mb-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Controller
                                                name='appointment_date'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Fecha de la consulta *</label>
                                                        <Calendar
                                                            id={field.name}
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.value)}
                                                            className={classNames('w-100', { 'p-invalid': errors.appointment_date })}
                                                            appendTo={'self'}
                                                            disabled={appointmentDateDisabled}
                                                            enabledDates={enabledDates}
                                                            placeholder="Seleccione una fecha"
                                                        />
                                                    </>
                                                }
                                            />
                                            {getFormErrorMessage('appointment_date')}
                                        </div>
                                        <div className="col-md-6">
                                            <Controller
                                                name='appointment_time'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Hora de la consulta *</label>
                                                        <Dropdown
                                                            inputId={field.name}
                                                            options={appointmentTimeOptions}
                                                            virtualScrollerOptions={{ itemSize: 38 }}
                                                            optionLabel='label'
                                                            filter
                                                            placeholder="Seleccione una hora"
                                                            className={classNames('w-100', { 'p-invalid': errors.appointment_time })}
                                                            appendTo={'self'}
                                                            disabled={appointmentTimeDisabled}
                                                            {...field}
                                                        >
                                                        </Dropdown>
                                                    </>
                                                }
                                            />
                                            {getFormErrorMessage('appointment_time')}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Controller
                                        name='assigned_user_availability'
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) =>
                                            <>
                                                <label htmlFor={field.name} className="form-label">Doctor(a) *</label>
                                                <Dropdown
                                                    inputId={field.name}
                                                    options={userAvailabilityOptions}
                                                    optionLabel='full_name'
                                                    filter
                                                    placeholder="Seleccione un usuario"
                                                    className={classNames('w-100', { 'p-invalid': errors.assigned_user_availability })}
                                                    appendTo={'self'}
                                                    disabled={userAvailabilityDisabled}
                                                    {...field}
                                                >
                                                </Dropdown>
                                            </>
                                        }
                                    />
                                    {getFormErrorMessage('assigned_user_availability')}
                                </div>

                                {assistantAvailabilityOptions.length > 0 && <>
                                    <div className="mb-3">
                                        <Controller
                                            name='assigned_user_assistant_availability_id'
                                            control={control}
                                            render={({ field }) =>
                                                <>
                                                    <label htmlFor={field.name} className="form-label">Asistente</label>
                                                    <Dropdown
                                                        inputId={field.name}
                                                        options={assistantAvailabilityOptions}
                                                        optionLabel='label'
                                                        optionValue='id'
                                                        filter
                                                        showClear
                                                        placeholder="Seleccione un asistente"
                                                        className={classNames('w-100', { 'p-invalid': errors.assigned_user_assistant_availability_id })}
                                                        appendTo={'self'}
                                                        disabled={userAvailabilityDisabled}
                                                        {...field}
                                                    >
                                                    </Dropdown>
                                                </>
                                            }
                                        />
                                    </div>
                                </>}

                                <div className="mb-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Controller
                                                name='product_id'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Procedimiento *</label>
                                                        <Dropdown
                                                            inputId={field.name}
                                                            options={products}
                                                            optionLabel='label'
                                                            optionValue='id'
                                                            virtualScrollerOptions={{ itemSize: 38 }}
                                                            filter
                                                            showClear
                                                            placeholder="Seleccione un procedimiento"
                                                            className={classNames('w-100', { 'p-invalid': errors.product_id })}
                                                            appendTo={'self'}
                                                            {...field}
                                                        >
                                                        </Dropdown>
                                                    </>
                                                }
                                            />
                                            {getFormErrorMessage('product_id')}
                                        </div>
                                        <div className="col-md-6">
                                            <Controller
                                                name='consultation_purpose'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Finalidad de la consulta *</label>
                                                        <Dropdown
                                                            inputId={field.name}
                                                            options={consultationPurposes}
                                                            optionValue='value'
                                                            optionLabel='label'
                                                            filter
                                                            showClear
                                                            placeholder="Seleccione una finalidad"
                                                            className={classNames('w-100', { 'p-invalid': errors.consultation_purpose })}
                                                            appendTo={'self'}
                                                            {...field}
                                                        >
                                                        </Dropdown>
                                                    </>
                                                }
                                            />
                                            {getFormErrorMessage('consultation_purpose')}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Controller
                                                name='consultation_type'
                                                control={control}
                                                rules={{ required: 'Este campo es requerido' }}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Tipo de consulta *</label>
                                                        <Dropdown
                                                            inputId={field.name}
                                                            options={consultationTypes}
                                                            optionLabel='label'
                                                            optionValue='value'
                                                            filter
                                                            showClear
                                                            placeholder="Seleccione un tipo de consulta"
                                                            className={classNames('w-100', { 'p-invalid': errors.consultation_type })}
                                                            appendTo={'self'}
                                                            {...field}
                                                        >
                                                        </Dropdown>
                                                    </>
                                                }
                                            />
                                            {getFormErrorMessage('consultation_type')}
                                        </div>
                                        <div className="col-md-6">
                                            <Controller
                                                name='external_cause'
                                                control={control}
                                                render={({ field }) =>
                                                    <>
                                                        <label htmlFor={field.name} className="form-label">Causa externa</label>
                                                        <Dropdown
                                                            inputId={field.name}
                                                            options={externalCauses}
                                                            optionLabel='label'
                                                            optionValue='value'
                                                            filter
                                                            showClear
                                                            placeholder="Seleccione una causa externa"
                                                            className={classNames('w-100')}
                                                            appendTo={'self'}
                                                            {...field}
                                                        >
                                                        </Dropdown>
                                                    </>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    {!editingId && (
                                        <div className="d-flex align-items-center gap-2">
                                            <Checkbox
                                                inputId="recurrent"
                                                name="recurrent"
                                                checked={showRecurrentFields}
                                                onChange={(e) => setShowRecurrentFields(e.target.checked || false)}
                                            />
                                            <label htmlFor="recurrent" className="ml-2 form-check-label">Cita recurrente</label>
                                        </div>
                                    )}
                                    {showRecurrentFields && (
                                        <div className="mt-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label htmlFor="appointment_frequency" className="form-label">Frecuencia de la cita</label>
                                                    <Dropdown
                                                        inputId="appointment_frequency"
                                                        options={frequencies}
                                                        optionLabel='label'
                                                        optionValue='value'
                                                        filter
                                                        showClear
                                                        placeholder="Seleccione una frecuencia"
                                                        className={classNames('w-100')}
                                                        appendTo={'self'}
                                                        value={appointmentFrequency}
                                                        onChange={(e) => setAppointmentFrequency(e.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="appointment_repetitions" className="form-label">Número de repeticiones</label>
                                                    <InputNumber
                                                        inputId="appointment_repetitions"
                                                        value={appointmentRepetitions}
                                                        onValueChange={(e) => setAppointmentRepetitions(e.value)}
                                                        className='w-100'
                                                        min={1}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => handleClear()}
                                    >
                                        Limpiar
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit(addAppointments)}>
                                        {editingId && appointments.find(a => a.uuid === editingId) ? 'Actualizar cita' : 'Agregar cita'}
                                    </button>
                                </div>
                            </div>

                            {/* Columna derecha - Listado de citas */}
                            <div className="col-md-5">

                                <h5>Citas programadas</h5>

                                <hr />

                                {appointments.length === 0 ? (
                                    <p className="text-muted">No hay citas programadas</p>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {appointments.map((appointment) => {

                                            const hasErrors = Object.keys(appointment.errors).length > 0;

                                            return (<div key={`${appointment.uuid}-${Object.keys(appointment.errors).length}`} className={`card ${hasErrors ? 'border-danger' : ''}`}>
                                                <div className="card-body">
                                                    <div className='mb-2'>
                                                        <div className="d-flex justify-content-between">
                                                            <p className="card-text mb-1">
                                                                Fecha: {appointment.appointment_date?.toLocaleDateString()}
                                                            </p>
                                                            {hasErrors && <>
                                                                <AppointmentErrorIndicator
                                                                    appointmentId={appointment.uuid}
                                                                    errors={appointment.errors}
                                                                />
                                                            </>}
                                                        </div>
                                                        <p className="card-text">Hora: {appointment.appointment_time}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(appointment)}
                                                        >
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleCopy(appointment)}
                                                        >
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleRemove(appointment.uuid)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>)
                                        })}

                                        {hasValidationErrors() && <>
                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={async () => {
                                                        const validated = await validateAppointments(appointments);
                                                        setAppointments(validated);
                                                    }}
                                                >
                                                    Validar citas
                                                </button>
                                            </div>
                                        </>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='d-flex justify-content-end gap-2'>
                    <button
                        className="btn btn-link text-danger px-3 my-0"
                        aria-label="Close"
                        type='button'
                        onClick={onClose}
                    >
                        <i className="fas fa-arrow-left"></i> Cerrar
                    </button>
                    <button
                        type='submit'
                        className="btn btn-primary my-0"
                        disabled={!formValid || hasValidationErrors()}
                    >
                        <i className="fas fa-bookmark"></i> Guardar
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

const AppointmentErrorIndicator = ({ appointmentId, errors }: { appointmentId: string, errors: any }) => {
    const errorMessages = Object.values(errors).flat();

    return (
        <>
            <Tooltip target={`#error-${appointmentId}`} position="top">
                <div className="p-2">
                    {errorMessages.map((msg: any, i) => (
                        <ul key={i}>{msg}</ul>
                    ))}
                </div>
            </Tooltip>
            <i
                id={`error-${appointmentId}`}
                className="fas fa-warning p-error cursor-pointer"
            ></i>
        </>
    );
};
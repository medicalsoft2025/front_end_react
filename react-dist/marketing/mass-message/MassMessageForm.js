function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { countryService, patientService } from "../../../services/api/index.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { genders } from "../../../services/commons.js";
import { useMassMessagesAll } from "./hooks/useMassMessagesAll.js";
export const MassMessageForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  const [countries, setCountries] = useState([]);
  const {
    massMessages,
    setMassMessages,
    fetchMassMessages,
    loading
  } = useMassMessagesAll();
  const {
    control,
    handleSubmit,
    reset
  } = useForm(initialData);
  const fetchPatientsWithFilters = async paginationParams => {
    try {
      const {
        per_page,
        page,
        search,
        ...filters
      } = paginationParams;

      // Transformar los filtros al formato del backend
      const backendFilters = transformFiltersForBackend(selectedFilters);

      // Combinar parámetros de paginación con filtros
      const params = {
        per_page: per_page,
        page,
        search,
        ...backendFilters
      };
      const response = await patientService.getWithFilters(params);
      return {
        data: response.data || response,
        // Ajusta según la estructura de tu API
        total: response.total || response.count || 0
      };
    } catch (error) {
      console.error("Error fetching patients:", error);
      return {
        data: [],
        total: 0
      };
    }
  };
  const {
    data: patientsData,
    loading: loadingPatients,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh: refreshPatients
  } = useDataPagination({
    fetchFunction: fetchPatientsWithFilters,
    defaultPerPage: 10,
    getCustomFilters: () => selectedFilters
  });
  const bloodTypes = [{
    label: "Seleccione",
    value: ""
  }, {
    label: "A+",
    value: "A_POSITIVE"
  }, {
    label: "A-",
    value: "A_NEGATIVE"
  }, {
    label: "B+",
    value: "B_POSITIVE"
  }, {
    label: "B-",
    value: "B_NEGATIVE"
  }, {
    label: "AB+",
    value: "AB_POSITIVE"
  }, {
    label: "AB-",
    value: "AB_NEGATIVE"
  }, {
    label: "O+",
    value: "O_POSITIVE"
  }, {
    label: "O-",
    value: "O_NEGATIVE"
  }];
  const marital_status = [{
    label: "Seleccione",
    value: ""
  }, {
    label: "Soltero",
    value: "SINGLE"
  }, {
    label: "Casado",
    value: "MARRIED"
  }, {
    label: "Divorciado",
    value: "DIVORCED"
  }, {
    label: "Viudo",
    value: "WIDOWED"
  }];
  const steps = [{
    label: "Segmentación"
  }, {
    label: "Pacientes"
  }, {
    label: "Formato de envío"
  }, {
    label: "Vista previa"
  }];
  const appointmentCounts = [{
    label: "Seleccione",
    value: ""
  }, {
    label: "1-3 citas",
    value: "1-3 citas"
  }, {
    label: "4-6 citas",
    value: "4-6 citas"
  }, {
    label: "7+ citas",
    value: "7+ citas"
  }];
  const genderOptions = [{
    label: "Seleccione",
    value: ""
  }, {
    label: "Masculino",
    value: "MALE"
  }, {
    label: "Femenino",
    value: "FEMALE"
  }, {
    label: "Otro",
    value: "OTHER"
  }, {
    label: "Indeterminado",
    value: "INDETERMINATE"
  }];
  const ageOptiones = [{
    label: "Seleccione",
    value: ""
  }, {
    label: "18-25",
    value: "18-25"
  }, {
    label: "26-35",
    value: "26-35"
  }, {
    label: "36-45",
    value: "36-45"
  }, {
    label: "46+",
    value: "46+"
  }];
  const filterGroups = [{
    label: "Seleccione un filtro",
    value: null
  }, {
    label: "De la A a la I grupo 1",
    value: "group1"
  }, {
    label: "De la J a la M grupo 2",
    value: "group2"
  }, {
    label: "De la N a la Z grupo 3",
    value: "group3"
  }];
  const customFilters = [{
    label: "Seleccione un filtro",
    value: null
  }, {
    label: "Filtro de prueba",
    value: "1"
  }, {
    label: "Filtro de test",
    value: "2"
  }];
  const message_types = [{
    label: "Seleccione una opción",
    value: ""
  }, {
    label: "Whatsapp",
    value: "whatsapp"
  }, {
    label: "Correo electrónico",
    value: "email"
  }];
  const patientColumns = [{
    field: "name",
    header: "Nombre",
    body: rowData => `${rowData.first_name ?? ""} ${rowData.middle_name ?? ""} ${rowData.last_name} ${rowData.second_last_name ?? ""}`
  }, {
    field: "email",
    header: "Email"
  }, {
    field: "whatsapp",
    header: "Teléfono"
  }, {
    field: "gender",
    header: "Género",
    body: rowData => {
      const genderKey = rowData.gender;
      return genders[genderKey] || rowData.gender;
    }
  }, {
    field: "age",
    header: "Edad"
  }, {
    field: "country_id",
    header: "País"
  }];
  const loadCountries = async () => {
    const response = await countryService.getAll();
    const responseMapped = response.data.map(country => ({
      label: country.name,
      value: country
    }));
    setCountries(responseMapped);
  };
  useEffect(() => {
    loadCountries();
    fetchMassMessages();
  }, []);
  useEffect(() => {
    console.log("initialData changed: ", initialData);
    if (initialData) {
      const transformedData = transformBackendToForm(initialData);
      console.log("Transformed Data: ", transformedData);
      reset(transformedData);
    }
  }, [initialData, reset, countries]);
  const transformBackendToForm = backendData => {
    if (!backendData) return {};
    const transformed = {
      message_type: backendData.message_type,
      message_description: backendData.message_description,
      sendDate: backendData.scheduled_at ? new Date(backendData.scheduled_at) : null,
      sendTime: backendData.scheduled_at ? new Date(backendData.scheduled_at) : null,
      whatsappFile: backendData.minio_url || null,
      emailTo: "",
      emailSubject: "",
      emailBody: "",
      emailAttachments: []
    };
    let filters = {};
    if (backendData.filters) {
      filters = handleFiltersChange(backendData.filters);
    }
    return {
      ...transformed,
      ...filters
    };
  };
  function handleFiltersChange(filters) {
    console.log("handleFiltersChange called with filters: ", filters);
    let transformed = {};
    // Filtros simples
    if (filters.age) transformed.age = filters.age;
    if (filters.gender) {
      transformed.gender = filters.gender.join(",");
    }
    if (filters.country && filters.country.length > 0) {
      const countryName = filters.country[0];
      const countryObj = countries.find(c => c.value.name === countryName);
      transformed.country = countryObj ? countryObj.value : countryName;
    }
    if (filters.marital_status && filters.marital_status.length > 0) {
      transformed.marital_status = filters.marital_status.join(",");
    }
    if (filters.blood_type) {
      transformed.blood_type = filters.blood_type.join(",");
    }
    if (filters.appointments_count) {
      transformed.appointments_count = filters.appointments_count;
    }
    if (filters.date_appointment) {
      // Para evitar que reste un día por la zona horaria
      const adjustTimezone = dateString => {
        if (!dateString) return null;
        const date = new Date(dateString);
        // Añadir el offset de tiempo para mantener la fecha correcta
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      };
      transformed.date_appointment = {
        startDate: filters.date_appointment.from ? adjustTimezone(filters.date_appointment.from) : null,
        endDate: filters.date_appointment.to ? adjustTimezone(filters.date_appointment.to) : null
      };
    }
    if (filters.last_clinical_record) {
      const adjustTimezone = dateString => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      };
      transformed.last_clinical_record = {
        startDate: filters.last_clinical_record.from ? adjustTimezone(filters.last_clinical_record.from) : null,
        endDate: filters.last_clinical_record.to ? adjustTimezone(filters.last_clinical_record.to) : null
      };
    }
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterKey !== "paginate_out" && transformed[filterKey] !== undefined) {
        activeFilters[filterKey] = true;
        selectedFilters[filterKey] = transformed[filterKey];
        setShowFilters(true);
      } else if (Object.keys(filters).length === 1 && filterKey === "paginate_out") {
        activeFilters[filterKey] = false;
        selectedFilters[filterKey] = "";
        setShowFilters(false);
      }
    });
    return transformed;
  }
  const handleFilterToggle = (filterType, checked) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: checked
    }));
    if (!checked) {
      // Si se desactiva el check, elimina el valor del filtro
      const newFilters = {
        ...selectedFilters
      };
      delete newFilters[filterType];
      setSelectedFilters(newFilters);
    } else {
      // Si se activa el check, inicializa con valor vacío
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: ""
      }));
    }
  };
  const handleFilterSelection = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      // Si vamos al paso 2 (índice 1), ejecutar la función
      if (activeIndex === 0) {
        handlePatientsSegmentation(); // Esta función se ejecutará al pasar del paso 1 al 2
      }
      setActiveIndex(activeIndex + 1);
    }
  };
  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  const handlePatientsSegmentation = async () => {
    await refreshPatients();
  };
  const transformFiltersForBackend = filters => {
    const transformed = {};

    // Rango de edad
    if (filters["age"]) {
      transformed.age = filters["age"];
    }
    if (filters["gender"]) {
      transformed.gender = [filters["gender"]];
    }
    if (filters["country"]) {
      transformed.country = [filters["country"].name];
    }
    if (filters["last_clinical_record"] && filters["last_clinical_record"].startDate && filters["last_clinical_record"].endDate) {
      transformed.last_clinical_record = {
        from: new Date(filters["last_clinical_record"].startDate).toISOString().split("T")[0],
        to: new Date(filters["last_clinical_record"].endDate).toISOString().split("T")[0]
      };
    }
    if (filters["date_appointment"] && filters["date_appointment"].startDate && filters["date_appointment"].endDate) {
      transformed.date_appointment = {
        from: new Date(filters["date_appointment"].startDate).toISOString().split("T")[0],
        to: new Date(filters["date_appointment"].endDate).toISOString().split("T")[0]
      };
    }
    if (filters["marital_status"]) {
      transformed.marital_status = [filters["marital_status"]];
    }
    if (filters["blood_type"]) {
      transformed.blood_type = [filters["blood_type"]];
    }
    if (filters["appointments_count"]) {
      transformed.appointments_count = filters["appointments_count"];
    }
    return transformed;
  };
  function formatedScheduledAt(date, time) {
    if (!(date instanceof Date && !isNaN(date.getTime())) || !(time instanceof Date && !isNaN(time.getTime()))) {
      throw new Error("Las fechas proporcionadas no son válidas");
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Formatear la segunda fecha como "hora:minutos"
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
  }
  function uploadImgToMinio(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      formData.append("model_type", "App\\Models\\MassMessage");
      formData.append("model_id", "0");

      //@ts-ignore
      guardarArchivo(formData, true).then(async response => {
        resolve({
          //@ts-ignore
          full_file_url: await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true),
          file_url: response.file.file_url,
          model_type: response.file.model_type,
          model_id: response.file.model_id,
          id: response.file.id
        });
      }).catch(reject);
    });
  }
  const onSubmit = async data => {
    const responseMinio = await uploadImgToMinio(data.whatsappFile);
    const backendFilters = transformFiltersForBackend(selectedFilters);
    const formData = {
      message_type: data.message_type,
      scheduled_at: formatedScheduledAt(data.sendDate, data.sendTime),
      message_description: data.message_description,
      minio_url: responseMinio.full_file_url,
      filters: {
        paginate_out: true,
        ...backendFilters
      }
    };
    onHandleSubmit(formData);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement(Steps, {
    model: steps,
    activeIndex: activeIndex,
    className: "mb-4",
    readOnly: true
  }), /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 0
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Filtros personalizados"), /*#__PURE__*/React.createElement(Controller, {
    name: "filterCustom",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: massMessages,
      placeholder: "Seleccione un filtro",
      className: "w-100",
      optionLabel: "message_description",
      onChange: e => handleFiltersChange(e.value.filters)
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "text-decoration-none",
    onClick: e => {
      e.preventDefault();
      setShowFilters(!showFilters);
    }
  }, "Configurar filtros de cliente"), showFilters && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-3 border rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "rango-edad",
    onChange: e => handleFilterToggle("age", e.checked || false),
    checked: !!activeFilters["age"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "rango-edad"
  }, "Rango de edad"), selectedFilters["age"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["age"],
    options: ageOptiones,
    placeholder: "Seleccione rango de edad",
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection("age", e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "sexo",
    onChange: e => handleFilterToggle("gender", e.checked || false),
    checked: !!activeFilters["gender"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "gender"
  }, "Sexo"), selectedFilters["gender"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["gender"],
    options: genderOptions,
    placeholder: "Seleccione sexo",
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection("gender", e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "pais",
    onChange: e => handleFilterToggle("country", e.checked || false),
    checked: !!activeFilters["country"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "country"
  }, "Pais"), selectedFilters["country"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["country"],
    options: countries,
    placeholder: "Seleccione Pais",
    className: "w-100 mt-1",
    onChange: e => {
      handleFilterSelection("country", e.value);
    },
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "ultima-consulta",
    onChange: e => handleFilterToggle("last_clinical_record", e.checked || false),
    checked: !!activeFilters["last_clinical_record"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ultima-consulta"
  }, "Consultas desde"), selectedFilters["last_clinical_record"] !== undefined && /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small"
  }, "Fecha inicio"), /*#__PURE__*/React.createElement(Calendar, {
    value: selectedFilters["last_clinical_record"]?.startDate ? new Date(selectedFilters["last_clinical_record"].startDate) : null,
    onChange: e => {
      handleFilterSelection("last_clinical_record", {
        ...selectedFilters["last_clinical_record"],
        startDate: e.value ? e.value.toISOString() : ""
      });
    },
    placeholder: "Fecha inicio",
    className: "w-100",
    dateFormat: "dd/mm/yy",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small"
  }, "Fecha fin"), /*#__PURE__*/React.createElement(Calendar, {
    value: selectedFilters["last_clinical_record"]?.endDate ? new Date(selectedFilters["last_clinical_record"].endDate) : null,
    onChange: e => {
      handleFilterSelection("last_clinical_record", {
        ...selectedFilters["last_clinical_record"],
        endDate: e.value ? e.value.toISOString() : ""
      });
    },
    placeholder: "Fecha fin",
    className: "w-100",
    dateFormat: "dd/mm/yy",
    showIcon: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "citas",
    onChange: e => handleFilterToggle("appointments_count", e.checked || false),
    checked: !!activeFilters["appointments_count"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "appointments_count"
  }, "Citas"), selectedFilters["appointments_count"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["appointments_count"],
    options: appointmentCounts,
    placeholder: "Seleccione citas",
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection("appointments_count", e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "citas-desde",
    onChange: e => handleFilterToggle("date_appointment", e.checked || false),
    checked: !!activeFilters["date_appointment"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "citas-desde"
  }, "Citas desde"), activeFilters["date_appointment"] && /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small"
  }, "Fecha inicio"), /*#__PURE__*/React.createElement(Calendar, {
    value: selectedFilters["date_appointment"]?.startDate ? new Date(selectedFilters["date_appointment"].startDate) : null,
    onChange: e => {
      handleFilterSelection("date_appointment", {
        ...selectedFilters["date_appointment"],
        startDate: e.value ? e.value.toISOString() : ""
      });
    },
    placeholder: "Fecha inicio",
    className: "w-100",
    dateFormat: "dd/mm/yy",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small"
  }, "Fecha fin"), /*#__PURE__*/React.createElement(Calendar, {
    value: selectedFilters["date_appointment"]?.endDate ? new Date(selectedFilters["date_appointment"].endDate) : null,
    onChange: e => {
      handleFilterSelection("date_appointment", {
        ...selectedFilters["date_appointment"],
        endDate: e.value ? e.value.toISOString() : ""
      });
    },
    placeholder: "Fecha fin",
    className: "w-100",
    dateFormat: "dd/mm/yy",
    showIcon: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "estado-civil",
    onChange: e => handleFilterToggle("marital_status", e.checked || false),
    checked: !!activeFilters["marital_status"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "estado-civil"
  }, "Estado civil"), selectedFilters["marital_status"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["marital_status"],
    options: marital_status,
    placeholder: "Seleccione estado civil",
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection("marital_status", e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "grupo-sanguineo",
    onChange: e => handleFilterToggle("blood_type", e.checked || false),
    checked: !!activeFilters["blood_type"],
    className: "me-2"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "grupo-sanguineo"
  }, "grupo sanguineo"), selectedFilters["blood_type"] !== undefined && /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedFilters["blood_type"],
    options: bloodTypes,
    placeholder: "Seleccione grupo sanguineo",
    className: "w-100 mt-1",
    onChange: e => handleFilterSelection("blood_type", e.value)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 1
    })
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Pacientes Segmentados",
    className: "shadow-2"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: patientColumns,
    data: patientsData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPatients,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refreshPatients
  }))), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 2
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Selecciona el m\xE9todo de env\xEDo:"), /*#__PURE__*/React.createElement(Controller, {
    name: "message_type",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: message_types,
      className: "w-100",
      required: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de env\xEDo"), /*#__PURE__*/React.createElement(Controller, {
    name: "sendDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      className: "w-100",
      dateFormat: "dd/mm/yy",
      showIcon: true
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Hora de env\xEDo"), /*#__PURE__*/React.createElement(Controller, {
    name: "sendTime",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      className: "w-100",
      timeOnly: true,
      showIcon: true
    }))
  }))), /*#__PURE__*/React.createElement(Controller, {
    name: "message_type",
    control: control,
    render: ({
      field: {
        value: method
      }
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, method === "whatsapp" && /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("h4", null, "Enviar por Whatsapp"), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Mensaje:"), /*#__PURE__*/React.createElement(Controller, {
      name: "message_description",
      control: control,
      render: ({
        field
      }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
        rows: 4,
        className: "w-100 mb-2",
        required: true
      }))
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Adjuntar archivo:"), /*#__PURE__*/React.createElement(Controller, {
      name: "whatsappFile",
      control: control,
      render: ({
        field: {
          onChange,
          value
        }
      }) => /*#__PURE__*/React.createElement(FileUpload, {
        mode: "basic",
        name: "whatsappFile",
        accept: "image/*",
        maxFileSize: 1000000,
        chooseLabel: "Seleccionar archivo",
        onSelect: e => {
          const file = e.files[0];
          onChange(file);
          if (file?.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = event => {
              setPreviewImage(event.target?.result);
            };
            reader.readAsDataURL(file);
          }
        },
        className: "w-100"
      })
    }), initialData?.minio_url && /*#__PURE__*/React.createElement("div", {
      className: "mt-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-check-circle text-success me-1"
    }), "Ya hay un archivo cargado"))), method === "email" && /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("h4", null, "Enviar por Correo Electr\xF3nico"), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Para:"), /*#__PURE__*/React.createElement(Controller, {
      name: "emailTo",
      control: control,
      render: ({
        field
      }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
        type: "email",
        className: "w-100 mb-2",
        required: true
      }))
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Asunto:"), /*#__PURE__*/React.createElement(Controller, {
      name: "emailSubject",
      control: control,
      render: ({
        field
      }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
        className: "w-100 mb-2",
        required: true
      }))
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Mensaje:"), /*#__PURE__*/React.createElement(Controller, {
      name: "emailBody",
      control: control,
      render: ({
        field
      }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
        rows: 6,
        className: "w-100 mb-2",
        required: true
      }))
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Adjuntar archivos:"), /*#__PURE__*/React.createElement(Controller, {
      name: "emailAttachments",
      control: control,
      render: ({
        field: {
          onChange,
          value
        }
      }) => /*#__PURE__*/React.createElement(FileUpload, {
        mode: "basic",
        name: "emailAttachments",
        multiple: true,
        accept: "image/*",
        maxFileSize: 1000000,
        chooseLabel: "Seleccionar archivos",
        onSelect: e => onChange(e.files),
        className: "w-100"
      })
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: classNames({
      "d-none": activeIndex !== 3
    })
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "message_type",
    control: control,
    render: ({
      field: {
        value: method
      }
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, method === "whatsapp" && /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Card, {
      className: "p-2 w-75"
    }, previewImage || initialData?.minio_url ? /*#__PURE__*/React.createElement("div", {
      className: "mb-3 text-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: previewImage || initialData?.minio_url,
      alt: "Imagen adjunta",
      className: "img-fluid rounded cursor-pointer",
      style: {
        maxHeight: "300px"
      },
      onClick: () => setShowImageModal(true)
    }), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 text-muted small"
    }, "Archivo actualmente cargado")) : null, /*#__PURE__*/React.createElement(Controller, {
      name: "message_description",
      control: control,
      render: ({
        field: {
          value
        }
      }) => /*#__PURE__*/React.createElement("div", {
        className: "p-3 border rounded bg-light"
      }, value || "Sin mensaje")
    }))), method === "email" && /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Card, {
      className: "p-3 w-75"
    }, /*#__PURE__*/React.createElement("h3", null, "Vista Previa del Correo"), /*#__PURE__*/React.createElement("div", {
      className: "mb-2"
    }, /*#__PURE__*/React.createElement("strong", null, "Para:"), " ", /*#__PURE__*/React.createElement(Controller, {
      name: "emailTo",
      control: control,
      render: ({
        field: {
          value
        }
      }) => /*#__PURE__*/React.createElement("span", null, value || "Sin destinatario")
    })), /*#__PURE__*/React.createElement("div", {
      className: "mb-2"
    }, /*#__PURE__*/React.createElement("strong", null, "Asunto:"), " ", /*#__PURE__*/React.createElement(Controller, {
      name: "emailSubject",
      control: control,
      render: ({
        field: {
          value
        }
      }) => /*#__PURE__*/React.createElement("span", null, value || "Sin asunto")
    })), /*#__PURE__*/React.createElement("div", {
      className: "p-3 border rounded bg-light mb-3"
    }, /*#__PURE__*/React.createElement(Controller, {
      name: "emailBody",
      control: control,
      render: ({
        field: {
          value
        }
      }) => /*#__PURE__*/React.createElement("span", null, value || "Sin mensaje")
    })), /*#__PURE__*/React.createElement(Controller, {
      name: "emailAttachments",
      control: control,
      render: ({
        field: {
          value
        }
      }) => /*#__PURE__*/React.createElement(React.Fragment, null, value?.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", null, "Archivos Adjuntos:"), /*#__PURE__*/React.createElement("ul", {
        className: "list-unstyled"
      }, value.map((file, index) => /*#__PURE__*/React.createElement("li", {
        key: index,
        className: "mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "pi pi-file me-2"
      }), file.name)))))
    }))))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: prevStep,
    disabled: activeIndex === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-chevron-left me-2"
  }), "Anterior"), activeIndex < steps.length - 1 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: e => {
      e.preventDefault();
      nextStep();
    }
  }, "Siguiente", /*#__PURE__*/React.createElement("i", {
    className: "pi pi-chevron-right ms-2"
  })) : /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check me-2"
  }), "Finalizar"))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showImageModal,
    onHide: () => setShowImageModal(false),
    header: "Vista previa de la imagen",
    style: {
      width: "50vw"
    },
    className: "bootstrap-dialog"
  }, /*#__PURE__*/React.createElement("img", {
    src: previewImage,
    alt: "Imagen adjunta",
    className: "img-fluid rounded"
  })));
};
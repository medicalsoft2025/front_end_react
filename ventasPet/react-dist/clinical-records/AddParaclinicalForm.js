function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { classNames } from 'primereact/utils';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { usePatientExamRecipes } from "../exam-recipes/hooks/usePatientExamRecipes.js";
import { useEffect } from 'react';
import { useState } from 'react';
const patientId = new URLSearchParams(window.location.search).get('patient_id');
export const AddParaclinicalForm = ({
  formId,
  onHandleSubmit
}) => {
  const [file, setFile] = useState(null);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => onHandleSubmit(data);
  const {
    patientExamRecipes,
    fetchPatientExamRecipes
  } = usePatientExamRecipes();
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const previewFile = () => {
    if (!file) return;
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
  };
  useEffect(() => {
    if (!patientId) {
      console.error('No se encontró el ID del paciente en la URL.');
      return;
    }
    fetchPatientExamRecipes(patientId);
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha *"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      className: classNames('w-100', {
        'p-invalid': errors.date
      }),
      appendTo: 'self',
      placeholder: "Seleccione una fecha"
    }))
  }), getFormErrorMessage('date')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "exam_recipe_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Receta de examen"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: patientExamRecipes,
      optionLabel: "label",
      optionValue: "id",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una receta de examen",
      className: classNames('w-100', {
        'p-invalid': errors.exam_recipe_id
      }),
      appendTo: 'self'
    }, field)))
  }), getFormErrorMessage('exam_recipe_id')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "comment",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Comentarios (opcional)"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      autoResize: true
    }, field, {
      rows: 5,
      cols: 30,
      className: "w-100"
    })))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "addParaclinicalFormFile",
    className: "form-label"
  }, "Adjuntar resultados de ex\xE1menes"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-fill"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    type: "file",
    id: "addParaclinicalFormFile",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx",
    onChange: e => setFile(e.target.files ? e.target.files[0] : null)
  }), file && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ms-2",
    type: "button",
    onClick: previewFile
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  })))))), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Haz clic para cargar o arrastra y suelta el archivo"))));
};
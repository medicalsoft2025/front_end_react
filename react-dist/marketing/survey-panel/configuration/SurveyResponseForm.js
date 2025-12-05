function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
// Componente para campos de texto
const TextFieldComponent = ({
  control,
  questionIndex,
  question,
  errors,
  preview
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `responses.${questionIndex}.answer`,
    control: control,
    rules: {
      required: question.required ? "Esta pregunta es obligatoria" : false
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({}, field, {
      rows: 3,
      className: "w-100",
      placeholder: "Escribe tu respuesta aqu\xED...",
      disabled: preview
    }))
  }), errors.responses?.[questionIndex]?.answer && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.responses[questionIndex]?.answer?.message));
};

// Componente para opciones (radio buttons)
const OptionsFieldComponent = ({
  control,
  questionIndex,
  question,
  errors,
  preview
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, question.questionOptions.map((option, optionIndex) => /*#__PURE__*/React.createElement("div", {
    key: optionIndex,
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `responses.${questionIndex}.answer`,
    control: control,
    rules: {
      required: question.required ? "Debes seleccionar una opción" : false
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(RadioButton, _extends({
      inputId: `option-${questionIndex}-${optionIndex}`
    }, field, {
      value: option,
      checked: field.value === option,
      disabled: preview
    }))
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `option-${questionIndex}-${optionIndex}`,
    className: "ms-2 cursor-pointer"
  }, option)))), errors.responses?.[questionIndex]?.answer && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.responses[questionIndex]?.answer?.message));
};

// Componente para casillas (checkboxes)
const BoxesFieldComponent = ({
  control,
  questionIndex,
  question,
  errors,
  preview
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, question.questionOptions.map((option, optionIndex) => /*#__PURE__*/React.createElement("div", {
    key: optionIndex,
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `responses.${questionIndex}.answers`,
    control: control,
    rules: {
      validate: value => {
        if (question.required && (!value || value.length === 0) && !preview) {
          return "Debes seleccionar al menos una opción";
        }
        return true;
      }
    },
    render: ({
      field
    }) => {
      const selectedAnswers = field.value || [];
      const isChecked = selectedAnswers.includes(option);
      return /*#__PURE__*/React.createElement(Checkbox, {
        inputId: `checkbox-${questionIndex}-${optionIndex}`,
        checked: isChecked,
        onChange: e => {
          const updatedAnswers = e.checked ? [...selectedAnswers, option] : selectedAnswers.filter(item => item !== option);
          field.onChange(updatedAnswers);
        },
        disabled: preview
      });
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `checkbox-${questionIndex}-${optionIndex}`,
    className: "ms-2 cursor-pointer"
  }, option)))), errors.responses?.[questionIndex]?.answers && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.responses[questionIndex]?.answers?.message));
};

// Componente principal
export const SurveyResponseForm = ({
  surveyData,
  onSubmit,
  preview = false
}) => {
  console.log("SurveyResponseForm surveyData:", surveyData);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      responses: surveyData.questions.map(question => ({
        answer: "",
        answers: []
      }))
    }
  });
  const handleFormSubmit = data => {
    if (!preview) {
      onSubmit(data);
    }
  };
  const renderQuestionField = (question, index) => {
    const commonProps = {
      control,
      questionIndex: index,
      question,
      errors,
      preview
    };
    switch (question.type) {
      case "text":
        return /*#__PURE__*/React.createElement(TextFieldComponent, commonProps);
      case "options":
        return /*#__PURE__*/React.createElement(OptionsFieldComponent, commonProps);
      case "boxes":
        return /*#__PURE__*/React.createElement(BoxesFieldComponent, commonProps);
      default:
        return null;
    }
  };
  return /*#__PURE__*/React.createElement(Card, {
    title: surveyData.title,
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-900 mb-2"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("p", {
    className: "text-700 line-height-3"
  }, surveyData.description)), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(handleFormSubmit)
  }, surveyData.questions.map((question, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "form-question mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "survey-question mb-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-900 mb-2"
  }, index + 1, ". ", question.question, question.required && /*#__PURE__*/React.createElement("span", {
    className: "text-red-500 ms-1"
  }, "*")), renderQuestionField(question, index)), index < surveyData.questions.length - 1 && /*#__PURE__*/React.createElement(Divider, null))), !preview && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    severity: "info",
    label: "Enviar Respuestas hola",
    icon: "fas fa-paper-plane"
  }))));
};
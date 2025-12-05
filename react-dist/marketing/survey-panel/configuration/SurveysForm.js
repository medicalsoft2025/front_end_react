function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Controller, useForm } from "react-hook-form";
import { FloatLabel } from "primereact";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { surveyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { SurveyResponseForm } from "./SurveyResponseForm.js";
export const SurveysForm = () => {
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      questions: [{
        question: "",
        questionType: null,
        isRequired: false,
        textAnswer: "",
        option1: "",
        checkbox1: ""
      }]
    }
  });
  const [questions, setQuestions] = useState([{
    id: 1
  }]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState({});
  const [onPreviewSSurvey, setOnPreviewSurvey] = useState(false);
  const [surveyPreviewData, setSurveyPreviewData] = useState(null);
  const questionOptions = [{
    id: "text",
    name: "Texto",
    icon: "fas fa-align-justify"
  }, {
    id: "options",
    name: "Varias opciones",
    icon: "fas fa-circle-dot"
  }, {
    id: "boxes",
    name: "Casillas",
    icon: "fas fa-square"
  }];
  const formattedData = data => {
    const transformedData = {
      ...data,
      questions: data.questions.map(question => {
        const {
          option1,
          checkbox1,
          textAnswer,
          ...rest
        } = question;
        const options = Object.keys(question).filter(key => key.startsWith("option") && question[key] !== "").map(key => question[key]).filter(value => value !== undefined && value !== "");
        const boxes = Object.keys(question).filter(key => key.startsWith("checkbox") && question[key] !== "").map(key => question[key]).filter(value => value !== undefined && value !== "");
        return {
          ...rest,
          ...(options.length > 0 && {
            options
          }),
          ...(boxes.length > 0 && {
            boxes
          }),
          ...(textAnswer && {
            textAnswer
          })
        };
      })
    };
    return transformedData;
  };
  const onSubmit = async data => {
    const transformedData = formattedData(data);
    const formData = {
      title: transformedData.title,
      description: transformedData.description,
      questions: transformedData.questions.map(question => {
        return {
          question: question.question,
          type: question.questionType.id,
          required: question.isRequired ?? false,
          questionOptions: question.options || question.boxes || []
        };
      })
    };
    await surveyService.create(formData);
    SwalManager.success("Encuesta creada correctamente");
    reset();
    setQuestions([{
      id: 1
    }]);
    setSelectedQuestionTypes({});
  };
  const handleSurveySubmit = data => {
    console.log("Respuestas:", data);
  };
  const handleOnPreviewSurvey = data => {
    const transformedData = formattedData(data);
    const formData = {
      title: transformedData.title,
      description: transformedData.description,
      questions: transformedData.questions.map(question => {
        return {
          question: question.question,
          type: question.questionType.id,
          required: question.isRequired ?? false,
          questionOptions: question.options || question.boxes || []
        };
      })
    };
    setSurveyPreviewData(formData);
    setOnPreviewSurvey(true);
  };
  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", null, option.name));
    }
    return /*#__PURE__*/React.createElement("span", null, props.placeholder);
  };
  const optionTempleate = option => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: `${option.icon}`
    }), /*#__PURE__*/React.createElement("span", null, option.name));
  };
  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, {
      id: newId
    }]);
  };
  const removeQuestion = id => {
    if (questions.length > 1) {
      const questionIndex = questions.findIndex(q => q.id === id);
      setQuestions(questions.filter(question => question.id !== id));
      setSelectedQuestionTypes(prev => {
        const newTypes = {
          ...prev
        };
        delete newTypes[id];
        return newTypes;
      });
      reset(formData => {
        const newQuestions = [...formData.questions];
        newQuestions.splice(questionIndex, 1);
        return {
          ...formData,
          questions: newQuestions
        };
      });
    }
  };
  const handleQuestionTypeChange = (questionId, value) => {
    setSelectedQuestionTypes(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  const renderDynamicField = (questionId, index) => {
    const selectedType = selectedQuestionTypes[questionId];
    switch (selectedType?.id) {
      case "text":
        return /*#__PURE__*/React.createElement(TextFieldComponent, {
          control: control,
          questionIndex: index
        });
      case "options":
        return /*#__PURE__*/React.createElement(OptionsFieldComponent, {
          control: control,
          questionIndex: index,
          reset: reset
        });
      case "boxes":
        return /*#__PURE__*/React.createElement(BoxesFieldComponent, {
          control: control,
          questionIndex: index,
          reset: reset
        });
      default:
        return null;
    }
  };
  const getQuestionFieldName = (index, field) => {
    return `questions.${index}.${field}`;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    title: "Creaci\xF3n de encuestas",
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Titulo"), /*#__PURE__*/React.createElement(Controller, {
    name: "title",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      variant: "filled"
    }, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      variant: "filled"
    }, field, {
      rows: 2,
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement(Divider, null), questions.map((question, index) => /*#__PURE__*/React.createElement("div", {
    key: question.id,
    className: "form-question mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "survey-inputs row align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Pregunta ", index + 1), /*#__PURE__*/React.createElement(Controller, {
    name: getQuestionFieldName(index, "question"),
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de pregunta"), /*#__PURE__*/React.createElement(Controller, {
    name: getQuestionFieldName(index, "questionType"),
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: questionOptions,
      placeholder: "Seleccione una opci\xF3n",
      className: "w-100",
      valueTemplate: selectedOptionTemplate,
      itemTemplate: optionTempleate,
      onChange: e => {
        field.onChange(e);
        handleQuestionTypeChange(question.id, e.value);
      }
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "survey-inputs-dinamics row"
  }, renderDynamicField(question.id, index)), /*#__PURE__*/React.createElement(Divider, {
    align: "left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("h3", null, "Pregunta ", index + 1), questions.length > 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    severity: "danger",
    tooltip: "Eliminar pregunta",
    tooltipOptions: {
      position: "bottom"
    },
    onClick: () => removeQuestion(question.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  })), index === questions.length - 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    severity: "info",
    tooltip: "A\xF1adir pregunta",
    tooltipOptions: {
      position: "bottom"
    },
    onClick: addQuestion
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: getQuestionFieldName(index, "isRequired"),
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputSwitch, {
      tooltip: "Obligatorio",
      tooltipOptions: {
        position: "bottom"
      },
      checked: field.value || false,
      onChange: e => field.onChange(e.value)
    })
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4 gap-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    severity: "info",
    label: "Guardar Encuesta"
  })))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Vista previa de la encuesta",
    visible: onPreviewSSurvey,
    style: {
      width: "70vw"
    },
    onHide: () => setOnPreviewSurvey(false)
  }, /*#__PURE__*/React.createElement(SurveyResponseForm, {
    surveyData: surveyPreviewData,
    onSubmit: handleSurveySubmit,
    preview: true
  })));
};
const TextFieldComponent = ({
  control,
  questionIndex
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: `questions.${questionIndex}.textAnswer`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100",
      readOnly: true,
      placeholder: "Campo de texto (solo lectura)"
    }))
  }));
};
const OptionsFieldComponent = ({
  control,
  questionIndex,
  reset
}) => {
  const [options, setOptions] = useState([{
    id: 1,
    value: ""
  }]);
  const addOption = () => {
    const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
    setOptions([...options, {
      id: newId,
      value: ""
    }]);
  };
  const removeOption = id => {
    if (options.length > 1) {
      setOptions(options.filter(option => option.id !== id));

      // Limpiar el campo del formulario cuando se elimina una opción
      reset(formData => {
        const newQuestions = [...formData.questions];
        const question = {
          ...newQuestions[questionIndex]
        };
        delete question[`option${id}`];
        newQuestions[questionIndex] = question;
        return {
          ...formData,
          questions: newQuestions
        };
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, options.map((option, index) => /*#__PURE__*/React.createElement("div", {
    key: option.id,
    className: "p-inputgroup flex-1 align-items-center gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-circle-dot"
  }), /*#__PURE__*/React.createElement(FloatLabel, null, /*#__PURE__*/React.createElement(Controller, {
    name: `questions.${questionIndex}.option${option.id}`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, field)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `option${option.id}`
  }, "Opci\xF3n ", index + 1)), options.length > 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    severity: "danger",
    tooltip: "Eliminar opcion",
    tooltipOptions: {
      position: "bottom"
    },
    onClick: () => removeOption(option.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  })), index === options.length - 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    severity: "info",
    tooltip: "A\xF1adir opci\xF3n",
    tooltipOptions: {
      position: "bottom"
    },
    onClick: addOption
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })))));
};
const BoxesFieldComponent = ({
  control,
  questionIndex,
  reset
}) => {
  const [checkboxes, setCheckboxes] = useState([{
    id: 1,
    value: ""
  }]);
  const addCheckbox = () => {
    const newId = checkboxes.length > 0 ? Math.max(...checkboxes.map(c => c.id)) + 1 : 1;
    setCheckboxes([...checkboxes, {
      id: newId,
      value: ""
    }]);
  };
  const removeCheckbox = id => {
    if (checkboxes.length > 1) {
      setCheckboxes(checkboxes.filter(checkbox => checkbox.id !== id));

      // Limpiar el campo del formulario cuando se elimina una casilla
      reset(formData => {
        const newQuestions = [...formData.questions];
        const question = {
          ...newQuestions[questionIndex]
        };
        delete question[`checkbox${id}`];
        newQuestions[questionIndex] = question;
        return {
          ...formData,
          questions: newQuestions
        };
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "col-12 mt-4"
  }, checkboxes.map((checkbox, index) => /*#__PURE__*/React.createElement("div", {
    key: checkbox.id,
    className: "p-inputgroup flex-1 align-items-center gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-square"
  }), /*#__PURE__*/React.createElement(FloatLabel, null, /*#__PURE__*/React.createElement(Controller, {
    name: `questions.${questionIndex}.checkbox${checkbox.id}`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, field)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `checkbox${checkbox.id}`
  }, "Casilla ", index + 1)), checkboxes.length > 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-danger",
    onClick: () => removeCheckbox(checkbox.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  })), index === checkboxes.length - 1 && /*#__PURE__*/React.createElement(Button, {
    type: "button",
    severity: "info",
    onClick: addCheckbox
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })))));
};
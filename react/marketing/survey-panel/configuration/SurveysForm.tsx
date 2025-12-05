import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Controller, Path, useForm } from "react-hook-form";
import { FloatLabel } from "primereact";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tooltip } from "primereact/tooltip";
import { InputSwitch } from "primereact/inputswitch";
import { surveyService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { SurveyResponseForm } from "./SurveyResponseForm";

interface SurveyFormData {
  title: string;
  description: string;
  questions: QuestionData[];
}

interface QuestionData {
  question: string;
  questionType: any;
  isRequired: boolean;
  textAnswer: string;
  option1: string;
  checkbox1: string;
}
export const SurveysForm = () => {
  const { control, handleSubmit, reset } = useForm<SurveyFormData>({
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          questionType: null,
          isRequired: false,
          textAnswer: "",
          option1: "",
          checkbox1: "",
        },
      ],
    },
  });

  const [questions, setQuestions] = useState([{ id: 1 }]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<any>({});
  const [onPreviewSSurvey, setOnPreviewSurvey] = useState<boolean>(false);
  const [surveyPreviewData, setSurveyPreviewData] = useState<any>(null);

  const questionOptions = [
    { id: "text", name: "Texto", icon: "fas fa-align-justify" },
    { id: "options", name: "Varias opciones", icon: "fas fa-circle-dot" },
    { id: "boxes", name: "Casillas", icon: "fas fa-square" },
  ];

  const formattedData = (data: any) => {
    const transformedData = {
      ...data,
      questions: data.questions.map((question: any) => {
        const { option1, checkbox1, textAnswer, ...rest } = question;

        const options = Object.keys(question)
          .filter((key) => key.startsWith("option") && question[key] !== "")
          .map((key) => question[key])
          .filter((value) => value !== undefined && value !== "");

        const boxes = Object.keys(question)
          .filter((key) => key.startsWith("checkbox") && question[key] !== "")
          .map((key) => question[key])
          .filter((value) => value !== undefined && value !== "");

        return {
          ...rest,
          ...(options.length > 0 && { options }),
          ...(boxes.length > 0 && { boxes }),
          ...(textAnswer && { textAnswer }),
        };
      }),
    };

    return transformedData;
  };

  const onSubmit = async (data: any) => {
    const transformedData = formattedData(data);

    const formData = {
      title: transformedData.title,
      description: transformedData.description,
      questions: transformedData.questions.map((question: any) => {
        return {
          question: question.question,
          type: question.questionType.id,
          required: question.isRequired ?? false,
          questionOptions: question.options || question.boxes || [],
        };
      }),
    };

    await surveyService.create(formData);

    SwalManager.success("Encuesta creada correctamente");

    reset();
    setQuestions([{ id: 1 }]);
    setSelectedQuestionTypes({});
  };

  const handleSurveySubmit = (data: any) => {
    console.log("Respuestas:", data);
  };

  const handleOnPreviewSurvey = (data: any) => {
    const transformedData = formattedData(data);

    const formData = {
      title: transformedData.title,
      description: transformedData.description,
      questions: transformedData.questions.map((question: any) => {
        return {
          question: question.question,
          type: question.questionType.id,
          required: question.isRequired ?? false,
          questionOptions: question.options || question.boxes || [],
        };
      }),
    };
    setSurveyPreviewData(formData);
    setOnPreviewSurvey(true);
  };

  const selectedOptionTemplate = (option: any, props: any) => {
    if (option) {
      return (
        <div className="d-flex align-items-center gap-2">
          <span>{option.name}</span>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const optionTempleate = (option: any) => {
    return (
      <div className="d-flex align-items-center gap-2">
        <i className={`${option.icon}`} />
        <span>{option.name}</span>
      </div>
    );
  };

  const addQuestion = () => {
    const newId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId }]);
  };

  const removeQuestion = (id: any) => {
    if (questions.length > 1) {
      const questionIndex = questions.findIndex((q) => q.id === id);
      setQuestions(questions.filter((question) => question.id !== id));
      setSelectedQuestionTypes((prev: any) => {
        const newTypes = { ...prev };
        delete newTypes[id];
        return newTypes;
      });

      reset((formData) => {
        const newQuestions = [...formData.questions];
        newQuestions.splice(questionIndex, 1);
        return { ...formData, questions: newQuestions };
      });
    }
  };

  const handleQuestionTypeChange = (questionId: any, value: any) => {
    setSelectedQuestionTypes((prev: any) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const renderDynamicField = (questionId: any, index: number) => {
    const selectedType = selectedQuestionTypes[questionId];

    switch (selectedType?.id) {
      case "text":
        return <TextFieldComponent control={control} questionIndex={index} />;
      case "options":
        return (
          <OptionsFieldComponent
            control={control}
            questionIndex={index}
            reset={reset}
          />
        );
      case "boxes":
        return (
          <BoxesFieldComponent
            control={control}
            questionIndex={index}
            reset={reset}
          />
        );
      default:
        return null;
    }
  };

  const getQuestionFieldName = (index: number, field: keyof QuestionData) => {
    return `questions.${index}.${field}` as Path<SurveyFormData>;
  };

  return (
    <>
      <Card title="Creación de encuestas" className="container-fluid">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Titulo</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <InputText variant="filled" {...field} className="w-100" />
              )}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  variant="filled"
                  {...field}
                  rows={2}
                  className="w-100"
                />
              )}
            />
          </div>
          <Divider />

          {questions.map((question, index) => (
            <div key={question.id} className="form-question mb-4">
              <div className="survey-inputs row align-items-center">
                <div className="col-6 mb-3">
                  <label className="form-label">Pregunta {index + 1}</label>
                  <Controller
                    name={getQuestionFieldName(index, "question")}
                    control={control}
                    render={({ field }) => (
                      <InputText {...field} className="w-100" />
                    )}
                  />
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label">Tipo de pregunta</label>
                  <Controller
                    name={getQuestionFieldName(index, "questionType")}
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={questionOptions}
                        placeholder="Seleccione una opción"
                        className="w-100"
                        valueTemplate={selectedOptionTemplate}
                        itemTemplate={optionTempleate}
                        onChange={(e) => {
                          field.onChange(e);
                          handleQuestionTypeChange(question.id, e.value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="survey-inputs-dinamics row">
                {renderDynamicField(question.id, index)}
              </div>

              <Divider align="left">
                <div className="d-flex align-items-center gap-3">
                  <h3>Pregunta {index + 1}</h3>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      severity="danger"
                      tooltip="Eliminar pregunta"
                      tooltipOptions={{ position: "bottom" }}
                      onClick={() => removeQuestion(question.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  )}

                  {index === questions.length - 1 && (
                    <Button
                      type="button"
                      severity="info"
                      tooltip="Añadir pregunta"
                      tooltipOptions={{ position: "bottom" }}
                      onClick={addQuestion}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  )}

                  <div className="mt-2">
                    <Controller
                      name={getQuestionFieldName(index, "isRequired")}
                      control={control}
                      render={({ field }) => (
                        <InputSwitch
                          tooltip="Obligatorio"
                          tooltipOptions={{ position: "bottom" }}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.value)}
                        />
                      )}
                    />
                  </div>
                </div>
              </Divider>
            </div>
          ))}
          <div className="d-flex justify-content-end mt-4 gap-4">
            {/* <Button
              type="button"
              severity="secondary"
              label="Vista previa"
              onClick={handleSubmit(handleOnPreviewSurvey)}
            /> */}
            <Button type="submit" severity="info" label="Guardar Encuesta" />
          </div>
        </form>
      </Card>

      <Dialog
        header="Vista previa de la encuesta"
        visible={onPreviewSSurvey}
        style={{ width: "70vw" }}
        onHide={() => setOnPreviewSurvey(false)}
      >
        <SurveyResponseForm
          surveyData={surveyPreviewData}
          onSubmit={handleSurveySubmit}
          preview={true}
        />
      </Dialog>
    </>
  );
};

const TextFieldComponent = ({ control, questionIndex }) => {
  return (
    <div className="col-12 mt-4">
      <Controller
        name={`questions.${questionIndex}.textAnswer`}
        control={control}
        render={({ field }) => (
          <InputText
            {...field}
            className="w-100"
            readOnly
            placeholder="Campo de texto (solo lectura)"
          />
        )}
      />
    </div>
  );
};

const OptionsFieldComponent = ({ control, questionIndex, reset }) => {
  const [options, setOptions] = useState([{ id: 1, value: "" }]);

  const addOption = () => {
    const newId =
      options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions([...options, { id: newId, value: "" }]);
  };

  const removeOption = (id: any) => {
    if (options.length > 1) {
      setOptions(options.filter((option) => option.id !== id));

      // Limpiar el campo del formulario cuando se elimina una opción
      reset((formData: any) => {
        const newQuestions = [...formData.questions];
        const question = { ...newQuestions[questionIndex] };
        delete question[`option${id}`];
        newQuestions[questionIndex] = question;
        return { ...formData, questions: newQuestions };
      });
    }
  };

  return (
    <div className="col-12">
      {options.map((option, index) => (
        <div
          key={option.id}
          className="p-inputgroup flex-1 align-items-center gap-2 mt-4"
        >
          <i className="fas fa-circle-dot"></i>
          <FloatLabel>
            <Controller
              name={`questions.${questionIndex}.option${option.id}`}
              control={control}
              render={({ field }) => <InputText {...field} />}
            />
            <label htmlFor={`option${option.id}`}>Opción {index + 1}</label>
          </FloatLabel>

          {options.length > 1 && (
            <Button
              type="button"
              severity="danger"
              tooltip="Eliminar opcion"
              tooltipOptions={{ position: "bottom" }}
              onClick={() => removeOption(option.id)}
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}

          {index === options.length - 1 && (
            <Button
              type="button"
              severity="info"
              tooltip="Añadir opción"
              tooltipOptions={{ position: "bottom" }}
              onClick={addOption}
            >
              <i className="fas fa-plus"></i>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

const BoxesFieldComponent = ({ control, questionIndex, reset }) => {
  const [checkboxes, setCheckboxes] = useState([{ id: 1, value: "" }]);

  const addCheckbox = () => {
    const newId =
      checkboxes.length > 0 ? Math.max(...checkboxes.map((c) => c.id)) + 1 : 1;
    setCheckboxes([...checkboxes, { id: newId, value: "" }]);
  };

  const removeCheckbox = (id: any) => {
    if (checkboxes.length > 1) {
      setCheckboxes(checkboxes.filter((checkbox) => checkbox.id !== id));

      // Limpiar el campo del formulario cuando se elimina una casilla
      reset((formData) => {
        const newQuestions = [...formData.questions];
        const question = { ...newQuestions[questionIndex] };
        delete question[`checkbox${id}`];
        newQuestions[questionIndex] = question;
        return { ...formData, questions: newQuestions };
      });
    }
  };

  return (
    <div className="col-12 mt-4">
      {checkboxes.map((checkbox, index) => (
        <div
          key={checkbox.id}
          className="p-inputgroup flex-1 align-items-center gap-2 mt-4"
        >
          <i className="fas fa-square"></i>
          <FloatLabel>
            <Controller
              name={`questions.${questionIndex}.checkbox${checkbox.id}`}
              control={control}
              render={({ field }) => <InputText {...field} />}
            />
            <label htmlFor={`checkbox${checkbox.id}`}>
              Casilla {index + 1}
            </label>
          </FloatLabel>

          {checkboxes.length > 1 && (
            <Button
              type="button"
              className="p-button-danger"
              onClick={() => removeCheckbox(checkbox.id)}
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}

          {index === checkboxes.length - 1 && (
            <Button type="button" severity="info" onClick={addCheckbox}>
              <i className="fas fa-plus"></i>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

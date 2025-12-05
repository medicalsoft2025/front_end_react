import React from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Controller, useForm } from "react-hook-form";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";

interface SurveyResponseData {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

interface SurveyQuestion {
  question: string;
  type: string;
  required: boolean;
  questionOptions: string[];
}

interface SurveyFormProps {
  surveyData: SurveyResponseData;
  onSubmit: (data: any) => void;
  preview?: boolean;
}

interface FormResponses {
  responses: {
    answer?: string;
    answers?: string[];
  }[];
}

// Componente para campos de texto
const TextFieldComponent = ({ control, questionIndex, question, errors, preview }) => {
  return (
    <div className="col-12 mt-3">
      <Controller
        name={`responses.${questionIndex}.answer`}
        control={control}
        rules={{
          required: question.required
            ? "Esta pregunta es obligatoria"
            : false,
        }}
        render={({ field }) => (
          <InputTextarea
            {...field}
            rows={3}
            className="w-100"
            placeholder="Escribe tu respuesta aquí..."
            disabled={preview}
          />
        )}
      />
      {errors.responses?.[questionIndex]?.answer && (
        <small className="p-error">
          {errors.responses[questionIndex]?.answer?.message}
        </small>
      )}
    </div>
  );
};

// Componente para opciones (radio buttons)
const OptionsFieldComponent = ({ control, questionIndex, question, errors, preview }) => {
  return (
    <div className="col-12 mt-3">
      <div className="d-flex flex-column gap-3">
        {question.questionOptions.map((option: any, optionIndex: any) => (
          <div key={optionIndex} className="d-flex align-items-center">
            <Controller
              name={`responses.${questionIndex}.answer`}
              control={control}
              rules={{
                required: question.required
                  ? "Debes seleccionar una opción"
                  : false,
              }}
              render={({ field }) => (
                <RadioButton
                  inputId={`option-${questionIndex}-${optionIndex}`}
                  {...field}
                  value={option}
                  checked={field.value === option}
                  disabled={preview}
                />
              )}
            />
            <label
              htmlFor={`option-${questionIndex}-${optionIndex}`}
              className="ms-2 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {errors.responses?.[questionIndex]?.answer && (
        <small className="p-error">
          {errors.responses[questionIndex]?.answer?.message}
        </small>
      )}
    </div>
  );
};

// Componente para casillas (checkboxes)
const BoxesFieldComponent = ({ control, questionIndex, question, errors, preview }) => {
  return (
    <div className="col-12 mt-3">
      <div className="d-flex flex-column gap-3">
        {question.questionOptions.map((option: any, optionIndex: any) => (
          <div key={optionIndex} className="d-flex align-items-center">
            <Controller
              name={`responses.${questionIndex}.answers`}
              control={control}
              rules={{
                validate: (value) => {
                  if (
                    question.required &&
                    (!value || value.length === 0) &&
                    !preview
                  ) {
                    return "Debes seleccionar al menos una opción";
                  }
                  return true;
                },
              }}
              render={({ field }) => {
                const selectedAnswers = field.value || [];
                const isChecked = selectedAnswers.includes(option);

                return (
                  <Checkbox
                    inputId={`checkbox-${questionIndex}-${optionIndex}`}
                    checked={isChecked}
                    onChange={(e) => {
                      const updatedAnswers = e.checked
                        ? [...selectedAnswers, option]
                        : selectedAnswers.filter(
                            (item: string) => item !== option
                          );
                      field.onChange(updatedAnswers);
                    }}
                    disabled={preview}
                  />
                );
              }}
            />
            <label
              htmlFor={`checkbox-${questionIndex}-${optionIndex}`}
              className="ms-2 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      {errors.responses?.[questionIndex]?.answers && (
        <small className="p-error">
          {errors.responses[questionIndex]?.answers?.message}
        </small>
      )}
    </div>
  );
};

// Componente principal
export const SurveyResponseForm = ({
  surveyData,
  onSubmit,
  preview = false,
}: SurveyFormProps) => {

    console.log("SurveyResponseForm surveyData:", surveyData);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormResponses>({
    defaultValues: {
      responses: surveyData.questions.map((question) => ({
        answer: "",
        answers: [],
      })),
    },
  });

  const handleFormSubmit = (data: FormResponses) => {
    if (!preview) {
      onSubmit(data);
    }
  };

  const renderQuestionField = (question: SurveyQuestion, index: number) => {
    const commonProps = {
      control,
      questionIndex: index,
      question,
      errors,
      preview
    };

    switch (question.type) {
      case "text":
        return <TextFieldComponent {...commonProps} />;
      case "options":
        return <OptionsFieldComponent {...commonProps} />;
      case "boxes":
        return <BoxesFieldComponent {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Card title={surveyData.title} className="container-fluid">
      <div className="mb-4">
        <h4 className="text-900 mb-2">Descripción</h4>
        <p className="text-700 line-height-3">{surveyData.description}</p>
      </div>

      <Divider />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {surveyData.questions.map((question, index) => (
          <div key={index} className="form-question mb-5">
            <div className="survey-question mb-3">
              <h5 className="text-900 mb-2">
                {index + 1}. {question.question}
                {question.required && (
                  <span className="text-red-500 ms-1">*</span>
                )}
              </h5>

              {renderQuestionField(question, index)}
            </div>

            {index < surveyData.questions.length - 1 && <Divider />}
          </div>
        ))}

        {!preview && (
          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              severity="info"
              label="Enviar Respuestas hola"
              icon="fas fa-paper-plane"
            />
          </div>
        )}
      </form>
    </Card>
  );
};
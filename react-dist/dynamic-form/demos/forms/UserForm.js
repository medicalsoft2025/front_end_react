import React, { useState } from "react";
import { DynamicForm } from "../../components/DynamicForm.js";
import { demoData } from "../jsons/demoData.js";
import { historiaCardiologia } from "../../forms/clinical-records/historiaCardiologia.js";
export const UserForm = () => {
  const [loading, setLoading] = useState(false);
  const onSubmit = data => {
    console.log(data);
    setLoading(true);
    new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 2000);
    }).then(() => {
      setLoading(false);
    });
  };
  return /*#__PURE__*/React.createElement(DynamicForm, {
    onSubmit: onSubmit,
    config: historiaCardiologia,
    loading: loading,
    data: demoData
  });
};
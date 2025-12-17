import { useMemo, useEffect } from "react";
export function useDynamicFormContainer({
  config,
  form,
  parentPath = ""
}) {
  const containerType = config.type || "default";
  const getActualFormGroupPath = () => {
    if (config.type === "form" && config.name) {
      return parentPath ? `${parentPath}.${config.name}` : config.name;
    }
    return parentPath;
  };
  const actualFormGroupPath = getActualFormGroupPath();

  // Helper para verificar si tiene campos
  const hasFields = useMemo(() => !!config.fields && config.fields.length > 0, [config.fields]);

  // Helper para verificar si tiene contenedores
  const hasContainers = useMemo(() => !!config.containers && config.containers.length > 0, [config.containers]);

  // Determinar si debe renderizar campos (solo en el caso default)
  const shouldRenderFields = containerType === "default" && hasFields;

  // Determinar si debe renderizar divider
  const shouldRenderDivider = !!config.divider;
  useEffect(() => {
    form.trigger();
  }, []);
  return {
    getActualFormGroupPath,
    actualFormGroup: actualFormGroupPath,
    containerType,
    hasFields,
    hasContainers,
    shouldRenderFields,
    shouldRenderDivider
  };
}
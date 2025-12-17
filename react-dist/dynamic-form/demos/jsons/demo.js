import { employeeInfo } from "./employeeInfo.js";
export const ultraComplexForm = {
  containers: [{
    type: "stepper",
    linear: true,
    hasSubmitButton: true,
    submitButtonLabel: "Enviar Solicitud Completa",
    submitButtonIcon: "pi pi-check",
    submitButtonIconPos: "right",
    styleClass: "p-4 bg-light rounded",
    containers: [
    // === PRIMER STEP: INFORMACIÓN PERSONAL ===
    {
      name: "Información Personal",
      containers: [{
        type: "card",
        name: "Datos Personales Básicos",
        styleClass: "mb-4 shadow-sm",
        contentStyleClass: "row g-3",
        containers: [{
          fields: [{
            name: "persona.nombreCompleto",
            type: "text",
            label: "Nombre Completo",
            placeholder: "Ej: Juan Pérez García",
            required: true,
            styleClass: "col-12",
            validation: {
              required: "El nombre es obligatorio",
              minLength: {
                value: 5,
                message: "Mínimo 5 caracteres"
              },
              maxLength: {
                value: 100,
                message: "Máximo 100 caracteres"
              }
            }
          }, {
            name: "persona.email",
            type: "email",
            label: "Correo Electrónico",
            placeholder: "ejemplo@dominio.com",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "El email es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            }
          }, {
            name: "persona.telefono",
            type: "text",
            label: "Teléfono",
            placeholder: "+34 600 000 000",
            styleClass: "col-md-6",
            validation: {
              pattern: {
                value: /^[+]?[\d\s\-]+$/,
                message: "Teléfono inválido"
              }
            }
          }, {
            name: "persona.fechaNacimiento",
            type: "date",
            label: "Fecha de Nacimiento",
            required: true,
            format: "dd/mm/yy",
            showClear: true,
            styleClass: "col-md-6",
            validation: {
              required: "La fecha de nacimiento es obligatoria",
              validate: value => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18 || "Debes ser mayor de 18 años";
              }
            }
          }, {
            name: "persona.dni",
            type: "text",
            label: "DNI/NIE",
            placeholder: "12345678A",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "El DNI es obligatorio",
              pattern: {
                value: /^[0-9]{8}[A-Z]$/i,
                message: "DNI inválido (8 dígitos + letra)"
              }
            }
          }]
        }]
      }, {
        type: "accordion",
        name: "Información Detallada",
        defaultActiveChildren: "address",
        styleClass: "mb-4",
        containers: [{
          name: "Dirección",
          contentStyleClass: "row g-3",
          containers: [{
            fields: [{
              name: "direccion.calle",
              type: "text",
              label: "Calle",
              placeholder: "Calle Principal, 123",
              required: true,
              styleClass: "col-12",
              validation: {
                required: "La dirección es obligatoria"
              }
            }, {
              name: "direccion.ciudad",
              type: "text",
              label: "Ciudad",
              required: true,
              styleClass: "col-md-6"
            }, {
              name: "direccion.codigoPostal",
              type: "text",
              label: "Código Postal",
              styleClass: "col-md-6",
              validation: {
                pattern: {
                  value: /^\d{5}$/,
                  message: "Código postal inválido (5 dígitos)"
                }
              }
            }, {
              name: "direccion.pais",
              type: "select",
              label: "País",
              required: true,
              styleClass: "col-md-6",
              options: [{
                label: "España",
                value: "ES"
              }, {
                label: "Francia",
                value: "FR"
              }, {
                label: "Alemania",
                value: "DE"
              }, {
                label: "Italia",
                value: "IT"
              }, {
                label: "Portugal",
                value: "PT"
              }, {
                label: "Reino Unido",
                value: "UK"
              }]
            }, {
              name: "direccion.provincia",
              type: "select",
              label: "Provincia",
              styleClass: "col-md-6",
              options: [{
                label: "Madrid",
                value: "M"
              }, {
                label: "Barcelona",
                value: "B"
              }, {
                label: "Valencia",
                value: "V"
              }, {
                label: "Sevilla",
                value: "SE"
              }, {
                label: "Zaragoza",
                value: "Z"
              }]
            }]
          }]
        }, {
          name: "Información Familiar",
          contentStyleClass: "row g-3",
          containers: [{
            fields: [{
              name: "persona.estadoCivil",
              type: "radio",
              label: "Estado Civil",
              options: [{
                label: "Soltero/a",
                value: "single"
              }, {
                label: "Casado/a",
                value: "married"
              }, {
                label: "Divorciado/a",
                value: "divorced"
              }, {
                label: "Viudo/a",
                value: "widowed"
              }, {
                label: "Pareja de hecho",
                value: "partner"
              }]
            }]
          }, {
            contentStyleClass: "row g-3",
            containers: [{
              fields: [{
                name: "persona.hijos",
                type: "number",
                label: "Número de Hijos",
                placeholder: "0",
                styleClass: "col-md-6",
                validation: {
                  min: {
                    value: 0,
                    message: "No puede ser negativo"
                  },
                  max: {
                    value: 20,
                    message: "Máximo 20 hijos"
                  }
                }
              }, {
                name: "persona.personasCargo",
                type: "number",
                label: "Personas a Cargo",
                placeholder: "0",
                styleClass: "col-md-6",
                validation: {
                  min: {
                    value: 0,
                    message: "No puede ser negativo"
                  }
                }
              }, {
                name: "persona.discapacidad",
                type: "checkbox",
                label: "Tiene discapacidad reconocida",
                styleClass: "col-md-12"
              }]
            }]
          }]
        }]
      }]
    },
    // === SEGUNDO STEP: FORMACIÓN Y EXPERIENCIA ===
    {
      name: "Formación y Experiencia",
      containers: [{
        type: "tabs",
        name: "formacionExperiencia",
        styleClass: "mb-4",
        containers: [{
          name: "Formación Académica",
          containers: [{
            type: "card",
            name: "Información de Empleo",
            containers: [employeeInfo]
          }, {
            type: "card",
            name: "Estudios",
            styleClass: "mb-3",
            contentStyleClass: "row g-3",
            containers: [{
              fields: [{
                name: "formacion.titulacion",
                type: "select",
                label: "Nivel de Estudios",
                required: true,
                styleClass: "col-md-6",
                options: [{
                  label: "Sin estudios",
                  value: "none"
                }, {
                  label: "Educación Secundaria",
                  value: "secondary"
                }, {
                  label: "Bachillerato",
                  value: "highschool"
                }, {
                  label: "Grado Universitario",
                  value: "university"
                }, {
                  label: "Máster",
                  value: "master"
                }, {
                  label: "Doctorado",
                  value: "phd"
                }, {
                  label: "Formación Profesional",
                  value: "vocational"
                }]
              }, {
                name: "formacion.titulo",
                type: "text",
                label: "Título Obtenido",
                styleClass: "col-md-6",
                placeholder: "Ej: Ingeniero Informático"
              }, {
                name: "formacion.universidad",
                type: "text",
                label: "Centro de Estudios",
                styleClass: "col-md-6",
                placeholder: "Ej: Universidad Complutense"
              }, {
                name: "formacion.anoGraduacion",
                type: "number",
                label: "Año de Graduación",
                styleClass: "col-md-6",
                validation: {
                  min: {
                    value: 1900,
                    message: "Año inválido"
                  },
                  max: {
                    value: 2024,
                    message: "Año no puede ser futuro"
                  }
                }
              }, {
                name: "formacion.certificaciones",
                type: "multiselect",
                label: "Certificaciones Adicionales",
                styleClass: "col-12",
                options: [{
                  label: "Microsoft Certified",
                  value: "microsoft"
                }, {
                  label: "AWS Certified",
                  value: "aws"
                }, {
                  label: "Google Cloud Certified",
                  value: "gcp"
                }, {
                  label: "Oracle Certified",
                  value: "oracle"
                }, {
                  label: "Scrum Master",
                  value: "scrum"
                }, {
                  label: "PMI/PMP",
                  value: "pmi"
                }, {
                  label: "ITIL",
                  value: "itil"
                }]
              }]
            }]
          }]
        }, {
          name: "Experiencia Laboral",
          containers: [{
            type: "card",
            name: "Experiencia Profesional",
            styleClass: "mb-3",
            contentStyleClass: "row g-3",
            containers: [{
              fields: [{
                name: "experiencia.anosExperiencia",
                type: "number",
                label: "Años de Experiencia",
                required: true,
                styleClass: "col-md-4",
                validation: {
                  required: "Los años de experiencia son obligatorios",
                  min: {
                    value: 0,
                    message: "No puede ser negativo"
                  },
                  max: {
                    value: 60,
                    message: "Máximo 60 años"
                  }
                }
              }, {
                name: "experiencia.sector",
                type: "select",
                label: "Sector",
                required: true,
                styleClass: "col-md-4",
                options: [{
                  label: "Tecnología",
                  value: "tech"
                }, {
                  label: "Finanzas",
                  value: "finance"
                }, {
                  label: "Salud",
                  value: "health"
                }, {
                  label: "Educación",
                  value: "education"
                }, {
                  label: "Manufactura",
                  value: "manufacturing"
                }, {
                  label: "Retail",
                  value: "retail"
                }, {
                  label: "Consultoría",
                  value: "consulting"
                }]
              }, {
                name: "experiencia.salarioActual",
                type: "number",
                label: "Salario Actual (€)",
                styleClass: "col-md-4",
                placeholder: "30000",
                validation: {
                  min: {
                    value: 0,
                    message: "No puede ser negativo"
                  }
                }
              }, {
                name: "experiencia.descripcion",
                type: "textarea",
                label: "Descripción de Experiencia",
                rows: 4,
                styleClass: "col-12",
                placeholder: "Describe tu experiencia profesional..."
              }, {
                name: "experiencia.habilidades",
                type: "multiselect",
                label: "Habilidades Técnicas",
                styleClass: "col-12",
                options: [{
                  label: "JavaScript",
                  value: "js"
                }, {
                  label: "TypeScript",
                  value: "ts"
                }, {
                  label: "React",
                  value: "react"
                }, {
                  label: "Angular",
                  value: "angular"
                }, {
                  label: "Vue.js",
                  value: "vue"
                }, {
                  label: "Node.js",
                  value: "node"
                }, {
                  label: "Python",
                  value: "python"
                }, {
                  label: "Java",
                  value: "java"
                }, {
                  label: "C#",
                  value: "csharp"
                }, {
                  label: "SQL",
                  value: "sql"
                }, {
                  label: "MongoDB",
                  value: "mongodb"
                }, {
                  label: "Docker",
                  value: "docker"
                }, {
                  label: "Kubernetes",
                  value: "kubernetes"
                }, {
                  label: "AWS",
                  value: "aws"
                }, {
                  label: "Azure",
                  value: "azure"
                }]
              }]
            }]
          }]
        }]
      }]
    },
    // === TERCER STEP: PREFERENCIAS LABORALES ===
    {
      name: "Preferencias Laborales",
      containers: [{
        type: "card",
        name: "Condiciones Laborales Deseadas",
        styleClass: "mb-4",
        contentStyleClass: "row g-3",
        containers: [{
          fields: [{
            name: "preferencias.tipoContrato",
            type: "select",
            label: "Tipo de Contrato Deseado",
            required: true,
            styleClass: "col-md-6",
            options: [{
              label: "Indefinido",
              value: "permanent"
            }, {
              label: "Temporal",
              value: "temporary"
            }, {
              label: "Prácticas",
              value: "internship"
            }, {
              label: "Autónomo",
              value: "freelance"
            }, {
              label: "Por obra",
              value: "project"
            }]
          }, {
            name: "preferencias.jornada",
            type: "select",
            label: "Jornada Preferida",
            styleClass: "col-md-6",
            options: [{
              label: "Completa",
              value: "full"
            }, {
              label: "Parcial",
              value: "part"
            }, {
              label: "Flexible",
              value: "flexible"
            }, {
              label: "Intensiva",
              value: "intensive"
            }]
          }, {
            name: "preferencias.modalidad",
            type: "radio",
            label: "Modalidad de Trabajo",
            options: [{
              label: "Presencial",
              value: "onsite"
            }, {
              label: "Remoto",
              value: "remote"
            }, {
              label: "Híbrido",
              value: "hybrid"
            }]
          }, {
            name: "preferencias.salarioMinimo",
            type: "number",
            label: "Salario Mínimo Esperado (€)",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "El salario mínimo es obligatorio",
              min: {
                value: 0,
                message: "No puede ser negativo"
              }
            }
          }, {
            name: "preferencias.salarioDeseado",
            type: "number",
            label: "Salario Deseado (€)",
            styleClass: "col-md-6",
            required: true,
            validation: {
              min: {
                value: 0,
                message: "No puede ser negativo"
              },
              validate: (value, formValues) => {
                const min = formValues.preferencias?.salarioMinimo || 0;
                return value >= min || "Debe ser mayor o igual al salario mínimo";
              }
            }
          }, {
            name: "preferencias.beneficios",
            type: "multiselect",
            label: "Beneficios Deseados",
            styleClass: "col-12",
            options: [{
              label: "Seguro médico",
              value: "health"
            }, {
              label: "Seguro dental",
              value: "dental"
            }, {
              label: "Plan de pensiones",
              value: "pension"
            }, {
              label: "Coche de empresa",
              value: "car"
            }, {
              label: "Ticket restaurante",
              value: "restaurant"
            }, {
              label: "Formación",
              value: "training"
            }, {
              label: "Gimnasio",
              value: "gym"
            }, {
              label: "Guardería",
              value: "childcare"
            }, {
              label: "Flexibilidad horaria",
              value: "flex"
            }]
          }]
        }]
      }, {
        type: "accordion",
        name: "Configuración Avanzada",
        containers: [{
          name: "Disponibilidad",
          containers: [{
            fields: [{
              name: "disponibilidad.inicioInmediato",
              type: "checkbox",
              label: "Disponibilidad inmediata",
              styleClass: "mb-3"
            }, {
              name: "disponibilidad.fechaDisponibilidad",
              type: "date",
              label: "Fecha de Disponibilidad",
              format: "dd/mm/yy",
              styleClass: "col-md-6",
              showClear: true,
              required: true,
              validation: {
                validate: (value, formValues) => {
                  if (formValues.disponibilidad?.inicioInmediato) return true;
                  if (!value) return "La fecha es obligatoria si no hay disponibilidad inmediata";
                  const selectedDate = new Date(value);
                  const today = new Date();
                  return selectedDate >= today || "La fecha debe ser futura";
                }
              }
            }, {
              name: "disponibilidad.horasSemanales",
              type: "number",
              label: "Horas Semanales Disponibles",
              styleClass: "col-md-6",
              placeholder: "40",
              validation: {
                min: {
                  value: 0,
                  message: "No puede ser negativo"
                },
                max: {
                  value: 80,
                  message: "Máximo 80 horas"
                }
              }
            }, {
              name: "disponibilidad.diasTrabajo",
              type: "multiselect",
              label: "Días Preferidos de Trabajo",
              styleClass: "col-12",
              options: [{
                label: "Lunes",
                value: "mon"
              }, {
                label: "Martes",
                value: "tue"
              }, {
                label: "Miércoles",
                value: "wed"
              }, {
                label: "Jueves",
                value: "thu"
              }, {
                label: "Viernes",
                value: "fri"
              }, {
                label: "Sábado",
                value: "sat"
              }, {
                label: "Domingo",
                value: "sun"
              }]
            }]
          }]
        }, {
          name: "Movilidad y Relocalización",
          containers: [{
            fields: [{
              name: "relocalizacion.disponibilidad",
              type: "checkbox",
              label: "Disponible para relocalización"
            }, {
              name: "relocalizacion.paises",
              type: "multiselect",
              label: "Países Disponibles",
              styleClass: "col-12",
              options: [{
                label: "España",
                value: "ES"
              }, {
                label: "Francia",
                value: "FR"
              }, {
                label: "Alemania",
                value: "DE"
              }, {
                label: "Reino Unido",
                value: "UK"
              }, {
                label: "Estados Unidos",
                value: "US"
              }, {
                label: "Canadá",
                value: "CA"
              }, {
                label: "Australia",
                value: "AU"
              }]
            }, {
              name: "relocalizacion.ayuda",
              type: "checkbox",
              label: "Necesita ayuda con relocalización"
            }]
          }]
        }]
      }]
    },
    // === CUARTO STEP: DOCUMENTACIÓN ===
    {
      name: "Documentación",
      containers: [{
        type: "tabs",
        styleClass: "mb-4",
        containers: [{
          name: "Documentos Opcionales",
          contentStyleClass: "row g-3",
          containers: [{
            type: "accordion",
            containers: [{
              name: "Portafolio",
              containers: [{
                fields: [{
                  name: "documentos.enlacePortafolio",
                  type: "text",
                  label: "Enlace a Portafolio Online",
                  styleClass: "col-12",
                  placeholder: "https://..."
                }]
              }]
            }, {
              name: "Recomendaciones",
              containers: [{
                fields: [{
                  name: "documentos.referencias",
                  type: "textarea",
                  label: "Referencias Personales",
                  rows: 3,
                  styleClass: "col-12",
                  placeholder: "Nombre, empresa, teléfono, email..."
                }]
              }]
            }]
          }]
        }]
      }, {
        type: "card",
        name: "Biografía y Presentación",
        styleClass: "mb-4",
        containers: [{
          fields: [{
            name: "biografia.resumen",
            type: "textarea",
            label: "Resumen Profesional",
            rows: 4,
            styleClass: "col-12 mb-3",
            placeholder: "Breve resumen de tu carrera profesional...",
            validation: {
              maxLength: {
                value: 500,
                message: "Máximo 500 caracteres"
              }
            }
          }, {
            name: "biografia.completa",
            type: "editor",
            label: "Biografía Completa",
            rows: 10,
            styleClass: "col-12",
            placeholder: "Desarrolla tu experiencia, logros, objetivos..."
          }]
        }]
      }]
    },
    // === QUINTO STEP: CUENTA Y SEGURIDAD ===
    {
      name: "Cuenta y Seguridad",
      containers: [{
        type: "card",
        name: "Configuración de la Cuenta",
        styleClass: "mb-4",
        contentStyleClass: "row g-3",
        containers: [{
          fields: [{
            name: "cuenta.username",
            type: "text",
            label: "Nombre de Usuario",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "El nombre de usuario es obligatorio",
              minLength: {
                value: 4,
                message: "Mínimo 4 caracteres"
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Solo letras, números y guiones bajos"
              }
            }
          }, {
            name: "cuenta.password",
            type: "password",
            label: "Contraseña",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "Mínimo 8 caracteres"
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: "Debe contener mayúsculas, minúsculas, números y caracteres especiales"
              }
            }
          }, {
            name: "cuenta.confirmPassword",
            type: "password",
            label: "Confirmar Contraseña",
            required: true,
            styleClass: "col-md-6",
            validation: {
              required: "Confirma tu contraseña",
              validate: (value, formValues) => value === formValues.cuenta?.password || "Las contraseñas no coinciden"
            }
          }, {
            name: "cuenta.emailNotificaciones",
            type: "email",
            label: "Email para Notificaciones",
            styleClass: "col-md-6",
            placeholder: "notificaciones@email.com"
          }]
        }]
      }, {
        type: "accordion",
        name: "configuracionSeguridad",
        containers: [{
          name: "Configuración de Seguridad",
          containers: [{
            fields: [{
              name: "seguridad.dobleFactor",
              type: "checkbox",
              label: "Habilitar autenticación de doble factor"
            }, {
              name: "seguridad.preguntaSeguridad",
              type: "select",
              label: "Pregunta de Seguridad",
              styleClass: "col-md-6",
              options: [{
                label: "¿Cuál es el nombre de tu primera mascota?",
                value: "pet"
              }, {
                label: "¿En qué ciudad naciste?",
                value: "city"
              }, {
                label: "¿Cuál es el nombre de tu madre?",
                value: "mother"
              }, {
                label: "¿Cuál es tu comida favorita?",
                value: "food"
              }]
            }, {
              name: "seguridad.respuestaSeguridad",
              type: "password",
              label: "Respuesta de Seguridad",
              styleClass: "col-md-6",
              validation: {
                required: "La respuesta de seguridad es obligatoria"
              }
            }, {
              name: "seguridad.recordarSesion",
              type: "checkbox",
              label: "Recordar sesión en este dispositivo",
              styleClass: "col-12"
            }]
          }]
        }, {
          name: "Privacidad y Comunicaciones",
          containers: [{
            fields: [{
              name: "privacidad.perfilPublico",
              type: "checkbox",
              label: "Perfil público visible"
            }, {
              name: "privacidad.recibirOfertas",
              type: "checkbox",
              label: "Recibir ofertas de empleo"
            }, {
              name: "privacidad.compartirDatos",
              type: "checkbox",
              label: "Compartir datos con empresas asociadas"
            }, {
              name: "privacidad.newsletter",
              type: "checkbox",
              label: "Suscribirse al newsletter"
            }]
          }]
        }]
      }]
    },
    // === SEXTO STEP: TÉRMINOS Y FINALIZACIÓN ===
    {
      name: "Términos y Finalización",
      containers: [{
        type: "card",
        name: "Términos y Condiciones",
        styleClass: "mb-4",
        containers: [{
          fields: [{
            name: "terminos.condiciones",
            type: "textarea",
            label: "Texto de Términos y Condiciones",
            rows: 10,
            styleClass: "col-12 mb-4",
            disabled: true,
            value: `TÉRMINOS Y CONDICIONES

1. INFORMACIÓN GENERAL
Este formulario recopila información para procesos de selección laboral. Los datos proporcionados serán tratados de acuerdo con la Ley Orgánica 3/2018 de Protección de Datos.

2. CONSENTIMIENTO
Al enviar este formulario, usted da su consentimiento para:
- El tratamiento de sus datos personales
- La evaluación de su candidatura
- El almacenamiento de su información por un período de 2 años

3. DERECHOS DEL USUARIO
Usted tiene derecho a acceder, rectificar, suprimir sus datos y oponerse a su tratamiento, según lo establecido en el RGPD.

4. CONFIDENCIALIDAD
Toda la información proporcionada será tratada con la máxima confidencialidad.`
          }, {
            name: "terminos.aceptoTerminos",
            type: "checkbox",
            label: "Acepto los términos y condiciones",
            required: true,
            validation: {
              required: "Debes aceptar los términos y condiciones"
            }
          }, {
            name: "terminos.aceptoPrivacidad",
            type: "checkbox",
            label: "Acepto la política de privacidad",
            required: true,
            validation: {
              required: "Debes aceptar la política de privacidad"
            }
          }, {
            name: "terminos.mayorEdad",
            type: "checkbox",
            label: "Declaro ser mayor de 18 años",
            required: true,
            validation: {
              required: "Debes ser mayor de 18 años"
            }
          }]
        }]
      }, {
        type: "card",
        name: "Confirmación Final",
        styleClass: "mb-4 bg-light",
        containers: [{
          fields: [{
            name: "confirmacion.veracidad",
            type: "checkbox",
            label: "Confirmo que toda la información proporcionada es verídica y completa",
            required: true,
            validation: {
              required: "Debes confirmar la veracidad de la información"
            }
          }, {
            name: "confirmacion.autorizacion",
            type: "checkbox",
            label: "Autorizo el tratamiento de mis datos para fines de selección",
            required: true,
            validation: {
              required: "Debes autorizar el tratamiento de datos"
            }
          }, {
            name: "confirmacion.comentarios",
            type: "textarea",
            label: "Comentarios o Observaciones Finales",
            rows: 4,
            styleClass: "col-12",
            placeholder: "Cualquier observación adicional que quieras agregar..."
          }]
        }]
      }]
    }]
  }]
};
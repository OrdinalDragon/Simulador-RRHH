export const SCENARIOS_DATA = [
  {
    code: 'SCEN-01',
    order: 1,
    title: 'Alta de legajo en el Centro Educativo Terapéutico (CET)',
    area: 'Legajos y Documentación',
    primaryCompetency: 'organizacionDetalle',
    context:
      'Una profesional recién incorporada al CET entrega su carpeta con documentación personal y profesional. Al revisarla para armar su legajo, notás que falta una copia legible de su constancia de estudios y un formulario administrativo sin firmar.',
    question: '¿Cómo procedés para organizar y mantener el legajo actualizado?',
    options: [
      {
        id: 'A',
        text: 'Archivo la carpeta tal como llegó para no demorar el alta y anoto en un papel suelto pedir lo faltante cuando la cruce en el pasillo.',
        feedback:
          'Archivar legajos incompletos sin registro formal genera desorden y riesgos administrativos en auditorías o controles del área.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -10,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: -2,
        },
      },
      {
        id: 'B',
        text: 'Cargo el legajo como "pendiente de documentación" en el registro de control, detallo exactamente qué falta y contacto formalmente a la profesional con un plazo claro para completarlo.',
        feedback:
          'Excelente criterio: combinás control documental riguroso, trazabilidad en el seguimiento y comunicación clara y respetuosa con la profesional.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 14,
          gestionDatos: 6,
          confidencialidadEtica: 4,
          comunicacionServicio: 6,
        },
      },
      {
        id: 'C',
        text: 'Le devuelvo toda la carpeta completa a la profesional para que la traiga nuevamente recién cuando tenga todo listo.',
        feedback:
          'Devolver toda la documentación ya entregada puede retrasar innecesariamente el proceso de incorporación y generar mala experiencia inicial.',
        isOptimal: false,
        scoreDelta: 2,
        impact: {
          organizacionDetalle: 2,
          gestionDatos: 0,
          confidencialidadEtica: 2,
          comunicacionServicio: -6,
        },
      },
    ],
  },
  {
    code: 'SCEN-02',
    order: 2,
    title: 'Seguimiento de planillas mensuales del SAIE',
    area: 'Registros Mensuales',
    primaryCompetency: 'gestionDatos',
    context:
      'Llega el cierre de mes y estás controlando las planillas mensuales de actividades del Servicio de Apoyo a la Integración Escolar (SAIE). Detectás que tres profesionales entregaron sus planillas con fechas superpuestas y otros dos todavía no las enviaron.',
    question: '¿Qué acción tomás para ordenar los registros mensuales?',
    options: [
      {
        id: 'A',
        text: 'Corrijo manualmente las fechas superpuestas según lo que supongo más lógico para cerrar rápido la planilla consolidada.',
        feedback:
          'Modificar registros de actividades por suposición compromete la veracidad de la información administrativa y puede impactar la liquidación.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -10,
          confidencialidadEtica: -4,
          comunicacionServicio: -2,
        },
      },
      {
        id: 'B',
        text: 'Dejo constancia en una planilla de seguimiento, consulto puntualmente a los tres profesionales para validar las fechas, envío recordatorio amable a quienes adeudan entrega e informo el estado a la Responsable de RR.HH.',
        feedback:
          'Muy bien: sostenés la integridad de los datos, hacés seguimiento ordenado y mantenés informada a tu referente directa.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 8,
          gestionDatos: 14,
          confidencialidadEtica: 4,
          comunicacionServicio: 8,
        },
      },
      {
        id: 'C',
        text: 'Espero dos días más sin escribirle a nadie para ver si envían las correcciones y planillas faltantes por iniciativa propia.',
        feedback:
          'La demora pasiva frente a cierres mensuales puede generar cuellos de botella en la preparación de documentación para honorarios.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: -4,
        },
      },
    ],
  },
  {
    code: 'SCEN-03',
    order: 3,
    title: 'Documentación previa a liquidación de honorarios',
    area: 'Liquidación y Honorarios',
    primaryCompetency: 'organizacionDetalle',
    context:
      'La Responsable del Departamento de RR.HH. te pide preparar y ordenar la documentación de respaldo para la liquidación de honorarios y remuneraciones del mes antes de las 15:00 hs. Al cruzar los comprobantes con el listado de personal activo, encontrás una diferencia en un profesional.',
    question: '¿Cómo resolvés la preparación de esa documentación?',
    options: [
      {
        id: 'A',
        text: 'Entrego todo el paquete sin mencionar la diferencia para cumplir con el horario, asumiendo que después alguien lo revisará.',
        feedback:
          'Omitir una inconsistencia detectada puede derivar en errores de liquidación y pérdida de confianza en el área.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -12,
          gestionDatos: -6,
          confidencialidadEtica: -4,
          comunicacionServicio: -4,
        },
      },
      {
        id: 'B',
        text: 'Freno la entrega de todo el paquete del personal hasta el día siguiente para resolver ese único caso.',
        feedback:
          'Retener toda la documentación del resto del equipo por un caso aislado afecta innecesariamente los tiempos operativos generales.',
        isOptimal: false,
        scoreDelta: 2,
        impact: {
          organizacionDetalle: 2,
          gestionDatos: 0,
          confidencialidadEtica: 2,
          comunicacionServicio: -4,
        },
      },
      {
        id: 'C',
        text: 'Entrego en tiempo y forma la documentación verificada, marco de manera visible el caso con diferencia adjuntando el detalle hallado y lo escalo de inmediato a la Responsable de RR.HH. para su validación.',
        feedback:
          'Resolución impecable: cumplís plazos, aplicás atención al detalle y escalás desvíos con información clara para decidir rápido.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 14,
          gestionDatos: 10,
          confidencialidadEtica: 4,
          comunicacionServicio: 6,
        },
      },
    ],
  },
  {
    code: 'SCEN-04',
    order: 4,
    title: 'Depuración y carga en base de datos de Excel',
    area: 'Bases de Datos y Excel',
    primaryCompetency: 'gestionDatos',
    context:
      'Debés actualizar la base de datos de personal en Excel con los ingresos y cambios del trimestre. Al abrir el archivo notás que el campo "Dispositivo" tiene cargas inconsistentes ("CET", "c.e.t.", "Centro Terap", "SAIE ") que rompen los filtros y conteos para reportes.',
    question: '¿Cómo abordás la actualización de la planilla?',
    options: [
      {
        id: 'A',
        text: 'Agrego los nuevos registros al final manteniendo los nombres variados para no tocar lo que cargaron antes.',
        feedback:
          'Mantener datos desnormalizados perpetúa errores en los reportes administrativos y dificulta cualquier consulta futura.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -10,
          confidencialidadEtica: 0,
          comunicacionServicio: 0,
        },
      },
      {
        id: 'B',
        text: 'Guardo una copia de respaldo, unifico criterios de nomenclatura (CET / SAIE / Administración), aplico validación de datos (lista desplegable) en Excel y verifico que los totales coincidan.',
        feedback:
          'Gran manejo técnico y preventivo: resguardar copia previa, estandarizar valores y aplicar validaciones evita errores recurrentes.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 8,
          gestionDatos: 16,
          confidencialidadEtica: 2,
          comunicacionServicio: 2,
        },
      },
      {
        id: 'C',
        text: 'Borro las filas con formato incorrecto y las vuelvo a escribir de memoria para ahorrar tiempo.',
        feedback:
          'Eliminar registros sin respaldo ni verificación puede provocar pérdida irreversible de información sensible del personal.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -12,
          confidencialidadEtica: -6,
          comunicacionServicio: 0,
        },
      },
    ],
  },
  {
    code: 'SCEN-05',
    order: 5,
    title: 'Solicitud informal de datos de un legajo',
    area: 'Confidencialidad',
    primaryCompetency: 'confidencialidadEtica',
    context:
      'Mientras trabajás con los legajos del personal, un integrante de otro sector se acerca a tu escritorio y te pide el domicilio particular y una copia de la documentación personal de una profesional, comentando que "es solo para agilizar un trámite interno".',
    question: '¿Cuál es tu respuesta ante este pedido?',
    options: [
      {
        id: 'A',
        text: 'Se lo paso en el momento porque es un compañero de la institución y seguramente lo necesita con urgencia.',
        feedback:
          'Compartir datos personales de legajos sin autorización vulnera gravemente la discreción y confidencialidad requeridas en RR.HH.',
        isOptimal: false,
        scoreDelta: -8,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -2,
          confidencialidadEtica: -18,
          comunicacionServicio: 0,
        },
      },
      {
        id: 'B',
        text: 'Le respondo con amabilidad que la información de los legajos es confidencial y que para brindarla necesito canalizar la solicitud a través de la Responsable del Departamento de RR.HH.',
        feedback:
          'Actuación ejemplar: protegés la confidencialidad de los datos personales manteniendo un trato cordial y respetando la línea de reporte.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 4,
          gestionDatos: 2,
          confidencialidadEtica: 18,
          comunicacionServicio: 8,
        },
      },
      {
        id: 'C',
        text: 'Le muestro la pantalla de mi computadora para que lo anote él mismo y así no entregarle ninguna copia impresa.',
        feedback:
          'Exhibir datos personales en pantalla sin autorización equivale igualmente a divulgar información confidencial.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -2,
          gestionDatos: 0,
          confidencialidadEtica: -14,
          comunicacionServicio: -2,
        },
      },
    ],
  },
  {
    code: 'SCEN-06',
    order: 6,
    title: 'Articulación con coordinadores de CET y SAIE',
    area: 'Articulación Interna',
    primaryCompetency: 'comunicacionServicio',
    context:
      'Necesitás relevar novedades de asistencia y cambios de disponibilidad de los equipos antes del viernes para actualizar los registros del área. La coordinación de CET suele responder por correo, mientras que la coordinación de SAIE está con agenda intensa en escuelas.',
    question: '¿Cómo coordinás el relevamiento para asegurar respuesta a tiempo?',
    options: [
      {
        id: 'A',
        text: 'Envío un único mensaje breve y claro con el detalle exacto de lo requerido, fecha límite y una plantilla simple para completar, y realizo un seguimiento cordial antes del cierre si falta confirmación.',
        feedback:
          'Excelente articulación: facilitás el trabajo de los coordinadores con consignas claras, formato ágil y seguimiento oportuno.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 8,
          gestionDatos: 6,
          confidencialidadEtica: 2,
          comunicacionServicio: 14,
        },
      },
      {
        id: 'B',
        text: 'Envío un correo extenso explicando todos los problemas administrativos del mes y exigiendo respuesta en el día.',
        feedback:
          'Los mensajes sobrecargados o con tono demandante dificultan la lectura rápida y deterioran el vínculo interdisciplinario.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -2,
          gestionDatos: 0,
          confidencialidadEtica: 0,
          comunicacionServicio: -12,
        },
      },
      {
        id: 'C',
        text: 'Registro solo lo que respondió CET y dejo en blanco lo de SAIE hasta el mes siguiente.',
        feedback:
          'Dejar información sin relevar genera vacíos en el seguimiento mensual y obliga a reprocesos posteriores.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -6,
          confidencialidadEtica: 0,
          comunicacionServicio: -6,
        },
      },
    ],
  },
  {
    code: 'SCEN-07',
    order: 7,
    title: 'Recepción y clasificación de CVs en búsqueda activa',
    area: 'Selección e Incorporación',
    primaryCompetency: 'organizacionDetalle',
    context:
      'Colaborás en una búsqueda laboral publicada por IZET S.A. En tres días ingresaron más de 40 currículums por el canal oficial, algunos sin asunto claro y con archivos en distintos formatos.',
    question: '¿Cómo organizás los CVs para apoyar el proceso de selección?',
    options: [
      {
        id: 'A',
        text: 'Reenvío los 40 correos sin filtrar a la Responsable de RR.HH. para que los revise uno por uno desde su bandeja.',
        feedback:
          'Reenviar correos sin orden ni pre-clasificación no aporta valor administrativo y sobrecarga a la Responsable del área.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -10,
          gestionDatos: -6,
          confidencialidadEtica: 0,
          comunicacionServicio: -4,
        },
      },
      {
        id: 'B',
        text: 'Descarto automáticamente todos los correos que no pusieron el asunto exacto aunque el CV sea muy bueno.',
        feedback:
          'Un filtro rígido sin criterio puede hacer perder perfiles valiosos para el equipo interdisciplinario de la institución.',
        isOptimal: false,
        scoreDelta: 0,
        impact: {
          organizacionDetalle: 0,
          gestionDatos: -2,
          confidencialidadEtica: 0,
          comunicacionServicio: -6,
        },
      },
      {
        id: 'C',
        text: 'Creo una carpeta ordenada por búsqueda, renombro los archivos con criterio uniforme (Apellido_Nombre) y armo una planilla resumen con datos clave y cumplimiento de requisitos para facilitar la preselección.',
        feedback:
          'Aporte de altísimo valor: organizás la información de forma sistemática y acelerás la toma de decisiones en selección.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 14,
          gestionDatos: 12,
          confidencialidadEtica: 4,
          comunicacionServicio: 4,
        },
      },
    ],
  },
  {
    code: 'SCEN-08',
    order: 8,
    title: 'Atención a consulta administrativa de un profesional',
    area: 'Atención al Personal',
    primaryCompetency: 'comunicacionServicio',
    context:
      'Un profesional del equipo terapéutico se comunica preocupado porque no comprende el paso a paso para presentar su documentación mensual y teme que haya demoras en su liquidación. Vos tenés además un informe pendiente para la tarde.',
    question: '¿Cómo manejás esta consulta?',
    options: [
      {
        id: 'A',
        text: 'Le respondo con trato cordial, le explico de forma clara y ordenada el procedimiento administrativo paso a paso (y se lo dejo por escrito como referencia) y luego retomo mi informe priorizando tiempos.',
        feedback:
          'Muy buena orientación al servicio: resolvés la inquietud con empatía y claridad, reduciendo además consultas repetitivas a futuro.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 6,
          gestionDatos: 2,
          confidencialidadEtica: 2,
          comunicacionServicio: 16,
        },
      },
      {
        id: 'B',
        text: 'Le digo que ahora estoy ocupado/a con un informe y que busque la información en correos viejos.',
        feedback:
          'Una respuesta distante afecta el clima laboral y no cumple con la responsabilidad de orientar al personal sobre procedimientos.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: 0,
          gestionDatos: 0,
          confidencialidadEtica: 0,
          comunicacionServicio: -14,
        },
      },
      {
        id: 'C',
        text: 'Le digo que no se preocupe y que me mande todo desordenado que yo me encargo de completarle sus planillas.',
        feedback:
          'Asumir tareas que corresponden a cada profesional genera dependencia operativa y errores en los registros.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: 2,
        },
      },
    ],
  },
  {
    code: 'SCEN-09',
    order: 9,
    title: 'Organización de capacitación interna',
    area: 'Reuniones y Capacitaciones',
    primaryCompetency: 'comunicacionServicio',
    context:
      'El Departamento de RR.HH. colabora en la organización de una capacitación interna para los equipos de CET y SAIE. Te asignan coordinar la convocatoria, el registro de asistencia y el material de apoyo para el encuentro.',
    question: '¿Cómo planificás esta actividad interna?',
    options: [
      {
        id: 'A',
        text: 'Envío la invitación el mismo día por la mañana para que nadie se olvide y anoto los asistentes en una hoja suelta al finalizar.',
        feedback:
          'Convocar sin anticipación afecta la asistencia de los equipos terapéuticos y complica el registro posterior de la actividad.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: -8,
        },
      },
      {
        id: 'B',
        text: 'Armo un checklist con anticipación: confirmo fecha y espacio con la Responsable de RR.HH., envío convocatoria clara con recordatorio, preparo lista de asistencia y archivo luego el registro de participación.',
        feedback:
          'Planificación sobresaliente: anticipás logística, asegurás buena comunicación con las áreas y dejás trazabilidad administrativa.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 10,
          gestionDatos: 6,
          confidencialidadEtica: 2,
          comunicacionServicio: 14,
        },
      },
      {
        id: 'C',
        text: 'Solo reenvío el enlace o fecha a los coordinadores y me desentiendo del seguimiento de confirmaciones y materiales.',
        feedback:
          'Delegar sin seguimiento puede derivar en ausencias imprevistas o faltantes el día de la capacitación.',
        isOptimal: false,
        scoreDelta: 0,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -2,
          confidencialidadEtica: 0,
          comunicacionServicio: -4,
        },
      },
    ],
  },
  {
    code: 'SCEN-10',
    order: 10,
    title: 'Reporte administrativo y resguardo de datos personales',
    area: 'Informes y Confidencialidad',
    primaryCompetency: 'confidencialidadEtica',
    context:
      'Te solicitan elaborar un reporte administrativo mensual con indicadores de dotación, entregas de planillas y estado de documentación para compartir en una reunión de coordinación de áreas. La base original incluye DNI, teléfonos personales y datos sensibles de legajo.',
    question: '¿Qué criterio aplicás al generar y distribuir el reporte?',
    options: [
      {
        id: 'A',
        text: 'Adjunto directamente la base de datos maestra completa en Excel para que cada coordinador filtre lo que quiera ver.',
        feedback:
          'Distribuir la base maestra expone datos personales innecesarios y viola el principio de confidencialidad y mínima exposición.',
        isOptimal: false,
        scoreDelta: -8,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -6,
          confidencialidadEtica: -18,
          comunicacionServicio: -2,
        },
      },
      {
        id: 'B',
        text: 'Oculto las columnas de DNI y teléfonos en el mismo Excel y lo envío así por correo a todos los participantes.',
        feedback:
          'Ocultar columnas en Excel no protege la información: cualquier destinatario puede mostrarlas en segundos.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -2,
          gestionDatos: -4,
          confidencialidadEtica: -12,
          comunicacionServicio: 0,
        },
      },
      {
        id: 'C',
        text: 'Genero un reporte limpio solo con los indicadores administrativos necesarios (sin datos personales sensibles), verifico los cálculos y lo valido con la Responsable de RR.HH. antes de compartirlo.',
        feedback:
          'Criterio profesional de excelencia: combinás calidad en reportes de gestión, precisión de datos y máximo resguardo ético.',
        isOptimal: true,
        scoreDelta: 10,
        impact: {
          organizacionDetalle: 8,
          gestionDatos: 12,
          confidencialidadEtica: 18,
          comunicacionServicio: 6,
        },
      },
    ],
  },
];

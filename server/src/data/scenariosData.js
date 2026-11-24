export const SCENARIOS_DATA = [
  {
    code: 'SCEN-01',
    order: 1,
    title: 'Alta de legajo en el Centro Educativo Terapéutico (CET)',
    area: 'Legajos y Documentación',
    primaryCompetency: 'organizacionDetalle',
    context:
      'Una profesional recién incorporada al CET entrega su carpeta de ingreso antes de su primer turno. Al revisarla, notás que falta una copia legible de su constancia de estudios y un formulario administrativo sin firmar.',
    question: '¿Cómo procedés para organizar y mantener el legajo actualizado?',
    options: [
      {
        id: 'A',
        text: 'Recibo la carpeta completa, registro el ingreso como activo y le envío un mensaje informal recordándole que acerque el faltante durante el mes.',
        feedback:
          'Dar el alta sin registrar formalmente el pendiente en el control de legajos hace que los faltantes se pierdan con la rutina diaria.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: 2,
        },
      },
      {
        id: 'B',
        text: 'Archivo lo recibido marcando el legajo como "pendiente de documentación" en la planilla de control y solicito formalmente el faltante con plazo claro.',
        feedback:
          'Excelente criterio: resguardás lo entregado, asegurás trazabilidad en el control documental y comunicás con claridad el plazo.',
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
        text: 'Devuelvo la carpeta entera a la profesional y le pido que regrese a RR.HH. recién cuando tenga todos los documentos completos y firmados.',
        feedback:
          'Aunque busca orden, rechazar toda la documentación ya reunida demora innecesariamente la incorporación y genera fricción inicial.',
        isOptimal: false,
        scoreDelta: 2,
        impact: {
          organizacionDetalle: 2,
          gestionDatos: 0,
          confidencialidadEtica: 2,
          comunicacionServicio: -8,
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
      'En el cierre mensual de planillas de actividades del SAIE detectás que tres profesionales tienen fechas superpuestas en sus registros y otros dos todavía no enviaron su planilla.',
    question: '¿Qué acción tomás para ordenar los registros mensuales?',
    options: [
      {
        id: 'A',
        text: 'Ajusto las fechas superpuestas según el cronograma habitual de cada profesional y envío un aviso general al grupo del SAIE por las entregas faltantes.',
        feedback:
          'Corregir registros de actividades sin validación del profesional compromete la exactitud de la información para honorarios.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -10,
          confidencialidadEtica: -4,
          comunicacionServicio: 0,
        },
      },
      {
        id: 'B',
        text: 'Registro las observaciones en la planilla de seguimiento, pido confirmación puntual de fechas, envío recordatorio individual y reporto el estado a RR.HH.',
        feedback:
          'Muy bien: cuidás la integridad de los datos, hacés seguimiento ordenado caso por caso y mantenés informada a la Responsable de RR.HH.',
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
        text: 'Cierro la planilla mensual únicamente con los registros correctos para cumplir la fecha y dejo los cinco casos pendientes para el mes siguiente.',
        feedback:
          'Dejar cinco casos fuera del cierre sin gestión activa genera reclamos y desordena la liquidación mensual del área.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: -8,
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
      'La Responsable de RR.HH. te pide la documentación ordenada para liquidación de honorarios antes de las 15:00 hs. Al cruzar los comprobantes con el personal activo, encontrás una diferencia en un profesional.',
    question: '¿Cómo resolvés la entrega de esa documentación?',
    options: [
      {
        id: 'A',
        text: 'Entrego el paquete completo en horario para no retrasar el proceso y dejo una nota interna para revisar esa diferencia después de la liquidación.',
        feedback:
          'Entregar una diferencia sin alertarla antes del cierre puede provocar un error de liquidación evitable.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -12,
          gestionDatos: -6,
          confidencialidadEtica: -2,
          comunicacionServicio: -4,
        },
      },
      {
        id: 'B',
        text: 'Postergo la entrega completa de toda la carpeta hasta el día siguiente para poder contactar al profesional y presentar todo sin observaciones.',
        feedback:
          'Frenar la documentación de todo el equipo por un caso puntual perjudica los plazos generales del departamento.',
        isOptimal: false,
        scoreDelta: 2,
        impact: {
          organizacionDetalle: 2,
          gestionDatos: 0,
          confidencialidadEtica: 2,
          comunicacionServicio: -6,
        },
      },
      {
        id: 'C',
        text: 'Entrego en tiempo la documentación verificada, señalo claramente el caso con diferencia adjuntando el detalle y lo escalo de inmediato a RR.HH.',
        feedback:
          'Resolución impecable: cumplís el plazo sin frenar al resto del equipo y aportás evidencia clara para que la Responsable decida rápido.',
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
      'Al actualizar la base de personal en Excel notás que la columna "Dispositivo" mezcla valores distintos ("CET", "c.e.t.", "Centro Terap", "SAIE "), lo que altera los filtros y conteos de los reportes.',
    question: '¿Cómo abordás la actualización de la planilla?',
    options: [
      {
        id: 'A',
        text: 'Cargo los nuevos ingresos con formato prolijo y dejo las filas anteriores intactas para evitar modificar registros históricos cargados por otros.',
        feedback:
          'Conservar inconsistencias históricas mantiene rotos los filtros y obliga a corregir manualmente cada reporte futuro.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -8,
          confidencialidadEtica: 0,
          comunicacionServicio: 0,
        },
      },
      {
        id: 'B',
        text: 'Guardo una copia de respaldo, unifico criterios de nomenclatura, configuro validación de datos en Excel y verifico que los totales coincidan.',
        feedback:
          'Gran manejo técnico y preventivo: resguardar copia, estandarizar y aplicar listas desplegables elimina el error de raíz.',
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
        text: 'Creo una pestaña nueva desde cero copiando solo los datos que necesito para el reporte actual y archivo la base original sin depurarla.',
        feedback:
          'Duplicar bases paralelas genera versiones desactualizadas y aumenta el riesgo de errores en la gestión del área.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -10,
          confidencialidadEtica: -2,
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
      'Un integrante de otro sector se acerca a tu escritorio y te pide el domicilio particular y una copia de la documentación personal de una profesional, argumentando que necesita agilizar una gestión interna urgente.',
    question: '¿Cuál es tu respuesta ante este pedido?',
    options: [
      {
        id: 'A',
        text: 'Le brindo solo el domicilio de manera verbal sin entregar copias impresas para ayudar con la urgencia sin sacar documentación del archivo.',
        feedback:
          'Divulgar datos personales de un legajo sin autorización vulnera la confidencialidad aunque no se entregue copia física.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -2,
          gestionDatos: 0,
          confidencialidadEtica: -16,
          comunicacionServicio: 2,
        },
      },
      {
        id: 'B',
        text: 'Le explico con amabilidad que los datos de los legajos son confidenciales y que el pedido debe canalizarse mediante la Responsable de RR.HH.',
        feedback:
          'Actuación ejemplar: resguardás la confidencialidad con firmeza, buen trato y respeto por la línea de reporte del área.',
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
        text: 'Le pido que me deje el pedido por correo para que quede registro escrito y, una vez recibido el mail, le reenvío el dato solicitado.',
        feedback:
          'Un correo de otro sector no reemplaza la autorización de la Responsable de RR.HH. para compartir datos personales.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: 0,
          gestionDatos: 0,
          confidencialidadEtica: -12,
          comunicacionServicio: 0,
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
      'Necesitás relevar novedades de asistencia y disponibilidad antes del viernes. La coordinación de CET suele responder por correo, mientras que la coordinación de SAIE está con agenda intensa visitando escuelas.',
    question: '¿Cómo coordinás el relevamiento para asegurar respuesta a tiempo?',
    options: [
      {
        id: 'A',
        text: 'Envío un mensaje breve y estructurado con fecha límite y una plantilla simple para completar, y hago un seguimiento cordial antes del cierre.',
        feedback:
          'Excelente articulación: respetás los tiempos de ambas coordinaciones con consignas claras, formato ágil y seguimiento oportuno.',
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
        text: 'Envío un correo detallado explicando el impacto administrativo de las demoras y solicito respuesta obligatoria dentro de las próximas horas.',
        feedback:
          'Un tono rígido o extenso frente a equipos en terreno dificulta la lectura rápida y puede generar fricción interdisciplinaria.',
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
        text: 'Consolido el informe con lo que responda CET el viernes y aclaro en una nota que SAIE enviará sus novedades la semana siguiente.',
        feedback:
          'Asumir la demora sin seguimiento previo deja incompletos los registros mensuales y genera reprocesos.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -4,
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
      'En tres días ingresaron más de 40 currículums para una búsqueda laboral de IZET S.A., varios sin asunto uniforme y en distintos formatos de archivo.',
    question: '¿Cómo organizás los CVs para apoyar el proceso de selección?',
    options: [
      {
        id: 'A',
        text: 'Creo una carpeta digital con todos los adjuntos descargados tal como llegaron y aviso a la Responsable de RR.HH. que ya puede revisarlos.',
        feedback:
          'Descargar sin renombrar ni resumir requisitos ahorra poco tiempo y traslada todo el filtro operativo a la Responsable.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -6,
          confidencialidadEtica: 0,
          comunicacionServicio: -2,
        },
      },
      {
        id: 'B',
        text: 'Filtro únicamente los correos que respetaron exactamente el asunto publicado y archivo el resto aparte por no seguir la consigna.',
        feedback:
          'Un descarte automático por asunto puede hacer perder buenos perfiles para el equipo interdisciplinario.',
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
        text: 'Ordeno los CVs en una carpeta por búsqueda con nombres uniformes y armo una planilla resumen con datos clave y encaje con los requisitos.',
        feedback:
          'Aporte de altísimo valor: organizás la documentación sistemáticamente y agilizás la preselección en RR.HH.',
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
      'Un profesional del equipo terapéutico te consulta preocupado porque no comprende el procedimiento para entregar su documentación mensual. Al mismo tiempo tenés un informe administrativo pendiente para la tarde.',
    question: '¿Cómo manejás esta consulta?',
    options: [
      {
        id: 'A',
        text: 'Lo atiendo con trato cordial, le explico el paso a paso de forma clara dejándoselo por escrito como guía y luego retomo mi informe.',
        feedback:
          'Excelente orientación al servicio: resolvés la duda con empatía, prevenís consultas repetidas y cuidás tus tiempos.',
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
        text: 'Le pido que me envíe los archivos sueltos por correo para completar yo su planilla esta vez y así no demorar más mi informe.',
        feedback:
          'Hacer tareas que corresponden a cada profesional genera dependencia operativa y riesgo de errores en el registro.',
        isOptimal: false,
        scoreDelta: -2,
        impact: {
          organizacionDetalle: -6,
          gestionDatos: -4,
          confidencialidadEtica: 0,
          comunicacionServicio: 2,
        },
      },
      {
        id: 'C',
        text: 'Le indico que estoy cerrando un informe prioritario y le sugiero consultar con su coordinador o revisar correos anteriores del área.',
        feedback:
          'Derivar una consulta propia de procedimientos administrativos de RR.HH. afecta la orientación al servicio.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: 0,
          gestionDatos: 0,
          confidencialidadEtica: 0,
          comunicacionServicio: -14,
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
      'Colaborás en la organización de una capacitación interna para los equipos de CET y SAIE. Te asignan coordinar la convocatoria, el registro de asistencia y el material de apoyo del encuentro.',
    question: '¿Cómo planificás esta actividad interna?',
    options: [
      {
        id: 'A',
        text: 'Envío la convocatoria a los coordinadores para que la reenvíen a sus equipos y el día del encuentro anoto a los presentes en una lista.',
        feedback:
          'Sin confirmar confirmaciones previas ni preparar materiales con anticipación, aumentan las ausencias y los imprevistos.',
        isOptimal: false,
        scoreDelta: 0,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -2,
          confidencialidadEtica: 0,
          comunicacionServicio: -4,
        },
      },
      {
        id: 'B',
        text: 'Armo un checklist previo: confirmo fecha y espacio con RR.HH., envío convocatoria con recordatorio, preparo planilla de asistencia y archivo el registro.',
        feedback:
          'Planificación sobresaliente: anticipás logística, asegurás buena convocatoria y dejás trazabilidad administrativa.',
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
        text: 'Preparo el material de apoyo primero y envío la invitación 24 horas antes para evitar cambios de agenda de último momento.',
        feedback:
          'Convocar con tan poca anticipación dificulta que los equipos terapéuticos organicen sus horarios en CET y SAIE.',
        isOptimal: false,
        scoreDelta: -4,
        impact: {
          organizacionDetalle: -8,
          gestionDatos: -2,
          confidencialidadEtica: 0,
          comunicacionServicio: -8,
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
      'Te piden preparar un reporte mensual con indicadores de dotación, entregas de planillas y estado documental para una reunión de coordinación. La base maestra incluye DNI y teléfonos personales del personal.',
    question: '¿Qué criterio aplicás al generar y compartir el reporte?',
    options: [
      {
        id: 'A',
        text: 'Oculto las columnas de DNI y teléfonos en el archivo Excel original y lo envío en formato protegido de solo lectura a los participantes.',
        feedback:
          'Ocultar columnas en Excel no elimina los datos sensibles del archivo: cualquier persona puede copiarlos o mostrarlos.',
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
        id: 'B',
        text: 'Envío la base maestra únicamente a los coordinadores de área aclarando en el correo que la información es de uso estrictamente interno.',
        feedback:
          'Una aclaración por correo no justifica compartir datos personales innecesarios para una reunión de indicadores.',
        isOptimal: false,
        scoreDelta: -6,
        impact: {
          organizacionDetalle: -4,
          gestionDatos: -4,
          confidencialidadEtica: -16,
          comunicacionServicio: -2,
        },
      },
      {
        id: 'C',
        text: 'Genero un reporte limpio solo con indicadores administrativos (sin datos personales), verifico cálculos y lo valido con la Responsable de RR.HH.',
        feedback:
          'Criterio profesional de excelencia: combinás precisión en reportes de gestión con máximo resguardo de datos personales.',
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

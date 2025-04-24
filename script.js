// Constantes y configuraciones
const WEIGHTS = {
  cognitive: 0.3,
  procedural: 0.3,
  attitudinal: 0.15, // 15% = 0.15
  selfEvaluation: 0.05, // 5% = 0.05
  periodTest: 0.2,
};
const COMPONENTS = {
  cognitive: {
    name: "Componente Cognitivo",
    icon: "fas fa-brain",
    description: "Evaluación de conocimientos teóricos",
    color: "#818cf8" // Indigo
  },
  procedural: {
    name: "Componente Procedimental",
    icon: "fas fa-cogs",
    description: "Aplicación práctica de conocimientos",
    color: "#60a5fa" // Azul
  },
  attitudinal: {
    name: "Componente Actitudinal",
    icon: "fas fa-hands-helping",
    description: "Comportamiento y participación",
    color: "#facc15" // Amarillo
  },
  selfEvaluation: {
    name: "Autoevaluación",
    icon: "fas fa-user-check",
    description: "Reflexión sobre el propio desempeño",
    color: "#4ade80" // Verde
  },
  periodTest: {
    name: "Prueba de Periodo",
    icon: "fas fa-file-alt",
    description: "Evaluación final del periodo",
    color: "#c084fc" // Púrpura
  },
};
// Lista fija de materias
const DEFAULT_SUBJECTS = [
  { id: "espanol", name: "Español", icon: "fas fa-pen", color: "#3b82f6" },
  { id: "matematicas", name: "Matemáticas", icon: "fas fa-calculator", color: "#ef4444" },
  { id: "fisica", name: "Física", icon: "fas fa-atom", color: "#8b5cf6" },
  { id: "quimica", name: "Química", icon: "fas fa-flask", color: "#10b981" },
  { id: "sociales", name: "Sociales", icon: "fas fa-globe-americas", color: "#f97316" },
  { id: "edufisica", name: "Educación Física", icon: "fas fa-running", color: "#ec4899" },
  { id: "religion", name: "Religión", icon: "fas fa-pray", color: "#ffd700" },
  { id: "artistica", name: "Artística", icon: "fas fa-paint-brush", color: "#14b8a6" },
  { id: "economia", name: "Economía", icon: "fas fa-chart-line", color: "#a855f7" },
  { id: "filosofia", name: "Filosofía", icon: "fas fa-brain", color: "#f43f5e" },
  { id: "etica", name: "Ética", icon: "fas fa-balance-scale", color: "#22c55e" },
  { id: "ingles", name: "Inglés", icon: "fas fa-language", color: "#3b82f6" },
  { id: "biologia", name: "Biología", icon: "fas fa-dna", color: "#f59e0b" },
  { id: "tecnologia", name: "Tecnología", icon: "fas fa-laptop-code", color: "#6366f1" },
  { id: "mediatecnica", name: "Media Técnica", icon: "fas fa-cogs", color: "#64748b" },
];
// Mensajes motivacionales
const MOTIVATIONAL_MESSAGES = [
  "¡Excelente trabajo! Sigue así y alcanzarás grandes logros.",
  "¡Impresionante! Tu esfuerzo está dando frutos.",
  "¡Bien hecho! Tu dedicación es admirable.",
  "¡Felicitaciones! Estás en el camino correcto.",
  "¡Increíble! Tu potencial es ilimitado."
];
// Estado de la aplicación
let currentSubject = null;
let cognitiveGrades = [0];
let proceduralGrades = [0];
let attitudinalGrades = [0];
let selfEvaluationGrade = 0;
let periodTestGrade = 0;
let savedGrades = [];
let showAllSubjects = false;
// Resultados
let results = {
  cognitive: { avg: 0, weighted: 0 },
  procedural: { avg: 0, weighted: 0 },
  attitudinal: { avg: 0, weighted: 0 },
  selfEvaluation: { value: 0, weighted: 0 },
  periodTest: { value: 0, weighted: 0 },
  final: 0,
};
// Referencias a elementos DOM
const subjectsContainer = document.getElementById('subjects-container');
const totalSubjectsCount = document.getElementById('total-subjects-count');
const viewMoreSubjectsButton = document.getElementById('view-more-subjects');
const selectedSubjectDisplay = document.getElementById('selected-subject-display');
const subjectNameDisplay = document.getElementById('subject-name-display');
const saveGradeButton = document.getElementById('save-grade-btn');
const resetDataButton = document.getElementById('reset-data-btn');
const currentYearElement = document.getElementById('current-year');
const confettiContainer = document.getElementById('confetti-container');
const motivationalAlert = document.getElementById('motivational-alert');
const motivationalMessage = document.getElementById('motivational-message');
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Establecer año actual en el footer
  currentYearElement.textContent = new Date().getFullYear();
  
  // Cargar notas guardadas del localStorage
  loadSavedGrades();
  
  // Renderizar la lista de materias
  renderSubjects();
  
  // Configurar event listeners
  setupEventListeners();
});
// Cargar notas guardadas
function loadSavedGrades() {
  const saved = localStorage.getItem('savedGrades');
  if (saved) {
    savedGrades = JSON.parse(saved);
    updateStatistics();
    renderGradeHistory();
  }
}
// Renderizar lista de materias
function renderSubjects() {
  subjectsContainer.innerHTML = '';
  totalSubjectsCount.textContent = DEFAULT_SUBJECTS.length;
  
  const displaySubjects = showAllSubjects 
    ? DEFAULT_SUBJECTS 
    : DEFAULT_SUBJECTS.slice(0, 9);
  
  displaySubjects.forEach(subject => {
    const subjectButton = document.createElement('button');
    subjectButton.className = 'subject-button';
    subjectButton.dataset.subjectId = subject.id;
    
    if (currentSubject && currentSubject.id === subject.id) {
      subjectButton.classList.add('active');
      subjectButton.style.backgroundColor = `${subject.color}20`;
      subjectButton.style.border = `1px solid ${subject.color}`;
    }
    
    subjectButton.innerHTML = `
      <div class="subject-icon-container" style="background-color: ${subject.color}30">
        <i class="${subject.icon} subject-icon" style="color: ${subject.color}"></i>
      </div>
      <span class="subject-name">${subject.name}</span>
    `;
    
    subjectButton.addEventListener('click', () => selectSubject(subject));
    subjectsContainer.appendChild(subjectButton);
  });
  
  // Mostrar u ocultar botón de "Ver más"
  if (DEFAULT_SUBJECTS.length > 9) {
    viewMoreSubjectsButton.parentElement.classList.remove('hidden');
    viewMoreSubjectsButton.innerHTML = showAllSubjects 
      ? '<i class="fas fa-chevron-up"></i> Ver menos'
      : `<i class="fas fa-chevron-down"></i> Ver todas las materias (${DEFAULT_SUBJECTS.length})`;
  } else {
    viewMoreSubjectsButton.parentElement.classList.add('hidden');
  }
}
// Seleccionar una materia
function selectSubject(subject) {
  currentSubject = subject;
  
  // Actualizar UI
  renderSubjects();
  updateSelectedSubjectDisplay();
  resetCalculator();
  updateSaveButton();
  
  // Mostrar la sección de materia seleccionada
  selectedSubjectDisplay.classList.remove('hidden');
  subjectNameDisplay.textContent = `de ${subject.name}`;
}
// Actualizar visualización de materia seleccionada
function updateSelectedSubjectDisplay() {
  if (!currentSubject) {
    selectedSubjectDisplay.classList.add('hidden');
    return;
  }
  
  selectedSubjectDisplay.innerHTML = `
    <div class="selected-subject-info">
      <div class="selected-subject-icon-container" style="background-color: ${currentSubject.color}30">
        <i class="${currentSubject.icon} subject-icon" style="color: ${currentSubject.color}"></i>
      </div>
      <div class="selected-subject-details">
        <div class="selected-subject-label">Materia seleccionada</div>
        <div class="selected-subject-name">${currentSubject.name}</div>
      </div>
    </div>
    <div>
      <span class="selected-badge" style="background-color: ${currentSubject.color}30; color: ${currentSubject.color}">
        Activa
      </span>
    </div>
  `;
  
  selectedSubjectDisplay.style.backgroundColor = `${currentSubject.color}15`;
  selectedSubjectDisplay.style.borderLeft = `4px solid ${currentSubject.color}`;
}
// Configurar event listeners
function setupEventListeners() {
  // Botón "Ver más materias"
  viewMoreSubjectsButton.addEventListener('click', () => {
    showAllSubjects = !showAllSubjects;
    renderSubjects();
  });
  
  // Botón resetear datos
  resetDataButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de querer borrar todas las notas guardadas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('savedGrades');
      savedGrades = [];
      updateStatistics();
      renderGradeHistory();
      currentSubject = null;
      resetCalculator();
      updateSelectedSubjectDisplay();
      renderSubjects();
    }
  });
  
  // Botón guardar nota
  saveGradeButton.addEventListener('click', () => saveGrade(results.final));
  
  // Configurar event listeners para los componentes
  setupComponentListeners();
}
// Configurar event listeners para los componentes
function setupComponentListeners() {
  // Botones para agregar notas
  document.querySelectorAll('.add-grade-btn').forEach(button => {
    const component = button.dataset.component;
    button.addEventListener('click', () => addGrade(component));
  });
  
  // Autoevaluación
  const selfEvaluationInput = document.getElementById('self-evaluation-input');
  selfEvaluationInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value < 0 || value > 5) return;
    handleSelfEvaluation(value);
  });
  
  // Prueba de periodo
  const periodTestInput = document.getElementById('period-test-input');
  periodTestInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value < 0 || value > 5) return;
    handlePeriodTest(value);
  });
}
// Agregar una nota a un componente
function addGrade(component) {
  if (component === 'cognitive') {
    cognitiveGrades.push(0);
    renderCognitiveGrades();
  } else if (component === 'procedural') {
    proceduralGrades.push(0);
    renderProceduralGrades();
  } else if (component === 'attitudinal') {
    attitudinalGrades.push(0);
    renderAttitudinalGrades();
  }
}
// Eliminar una nota de un componente
function removeGrade(component, index) {
  if (component === 'cognitive') {
    if (cognitiveGrades.length <= 1) return;
    cognitiveGrades.splice(index, 1);
    renderCognitiveGrades();
    calculateComponentAverage('cognitive');
  } else if (component === 'procedural') {
    if (proceduralGrades.length <= 1) return;
    proceduralGrades.splice(index, 1);
    renderProceduralGrades();
    calculateComponentAverage('procedural');
  } else if (component === 'attitudinal') {
    if (attitudinalGrades.length <= 1) return;
    attitudinalGrades.splice(index, 1);
    renderAttitudinalGrades();
    calculateComponentAverage('attitudinal');
  }
}
// Manejar cambio de notas cognitivas
function handleCognitiveGradeChange(index, value) {
  if (value < 0 || value > 5) return;
  cognitiveGrades[index] = value;
  
  // Calcular si todas las notas están completas
  const nonZeroGrades = cognitiveGrades.filter(g => g > 0);
  if (nonZeroGrades.length === cognitiveGrades.length) {
    calculateComponentAverage('cognitive');
  }
  
  // Mostrar estrellas si hay valor
  const inputContainer = document.querySelectorAll('.cognitive-grade')[index].closest('.grade-input-container');
  const starsContainer = inputContainer.querySelector('.stars-container');
  
  if (value > 0) {
    starsContainer.classList.remove('hidden');
    starsContainer.innerHTML = renderStarsHTML(value);
  } else {
    starsContainer.classList.add('hidden');
  }
}
// Manejar cambio de notas procedimentales
function handleProceduralGradeChange(index, value) {
  if (value < 0 || value > 5) return;
  proceduralGrades[index] = value;
  
  // Calcular si todas las notas están completas
  const nonZeroGrades = proceduralGrades.filter(g => g > 0);
  if (nonZeroGrades.length === proceduralGrades.length) {
    calculateComponentAverage('procedural');
  }
  
  // Mostrar estrellas si hay valor
  const inputContainer = document.querySelectorAll('.procedural-grade')[index].closest('.grade-input-container');
  const starsContainer = inputContainer.querySelector('.stars-container');
  
  if (value > 0) {
    starsContainer.classList.remove('hidden');
    starsContainer.innerHTML = renderStarsHTML(value);
  } else {
    starsContainer.classList.add('hidden');
  }
}
// Manejar cambio de notas actitudinales
function handleAttitudinalGradeChange(index, value) {
  if (value < 0 || value > 5) return;
  attitudinalGrades[index] = value;
  
  // Calcular si todas las notas están completas
  const nonZeroGrades = attitudinalGrades.filter(g => g > 0);
  if (nonZeroGrades.length === attitudinalGrades.length) {
    calculateComponentAverage('attitudinal');
  }
  
  // Mostrar estrellas si hay valor
  const inputContainer = document.querySelectorAll('.attitudinal-grade')[index].closest('.grade-input-container');
  const starsContainer = inputContainer.querySelector('.stars-container');
  
  if (value > 0) {
    starsContainer.classList.remove('hidden');
    starsContainer.innerHTML = renderStarsHTML(value);
  } else {
    starsContainer.classList.add('hidden');
  }
}
// Manejar cambio de autoevaluación
function handleSelfEvaluation(value) {
  selfEvaluationGrade = value;
  
  // Calcular el valor ponderado (5% de la nota)
  const weighted = value * WEIGHTS.selfEvaluation;
  
  // Actualizar el valor ponderado en la UI
  document.getElementById('self-evaluation-weighted').textContent = weighted.toFixed(2);
  
  // Guardar el resultado
  results.selfEvaluation = { value, weighted };
  
  // Mostrar estrellas si hay valor
  const starsContainer = document.getElementById('self-evaluation-stars');
  if (value > 0) {
    starsContainer.classList.remove('hidden');
    starsContainer.innerHTML = renderStarsHTML(value);
  } else {
    starsContainer.classList.add('hidden');
  }
  
  // Calcular nota final
  calculateFinalGrade();
}
// Manejar cambio de prueba de periodo
function handlePeriodTest(value) {
  periodTestGrade = value;
  
  // Calcular el valor ponderado (20% de la nota)
  const weighted = value * WEIGHTS.periodTest;
  
  // Actualizar el valor ponderado en la UI
  document.getElementById('period-test-weighted').textContent = weighted.toFixed(1);
  
  // Guardar el resultado
  results.periodTest = { value, weighted };
  
  // Mostrar estrellas si hay valor
  const starsContainer = document.getElementById('period-test-stars');
  if (value > 0) {
    starsContainer.classList.remove('hidden');
    starsContainer.innerHTML = renderStarsHTML(value);
  } else {
    starsContainer.classList.add('hidden');
  }
  
  // Calcular nota final
  calculateFinalGrade();
}
// Calcular el promedio de un componente
function calculateComponentAverage(component) {
  let grades;
  
  if (component === 'cognitive') {
    grades = cognitiveGrades;
  } else if (component === 'procedural') {
    grades = proceduralGrades;
  } else if (component === 'attitudinal') {
    grades = attitudinalGrades;
  }
  
  // Filtrar notas válidas (mayores a 0)
  const validGrades = grades.filter(grade => grade > 0);
  if (validGrades.length === 0) return;
  
  // Calcular promedio
  const sum = validGrades.reduce((total, grade) => total + grade, 0);
  const avg = sum / validGrades.length;
  
  // Calcular valor ponderado
  const weighted = avg * WEIGHTS[component];
  
  // Guardar resultados
  results[component] = { avg, weighted };
  
  // Actualizar UI
  document.getElementById(`${component}-avg`).textContent = avg.toFixed(1);
  document.getElementById(`${component}-avg`).className = `stats-value ${getGradeClass(avg)}`;
  
  // Para Actitudinal, corregir el valor ponderado (15%)
  if (component === 'attitudinal') {
    document.getElementById(`${component}-weighted`).textContent = (avg * WEIGHTS.attitudinal).toFixed(2);
  } else {
    document.getElementById(`${component}-weighted`).textContent = weighted.toFixed(1);
  }
  
  document.getElementById(`${component}-progress`).style.width = `${(avg / 5) * 100}%`;
  
  // Calcular nota final
  calculateFinalGrade();
}
// Calcular nota final
function calculateFinalGrade() {
  // Usamos los porcentajes correctos directamente
  const final = (
    results.cognitive.avg * WEIGHTS.cognitive +
    results.procedural.avg * WEIGHTS.procedural +
    results.attitudinal.avg * WEIGHTS.attitudinal +
    selfEvaluationGrade * WEIGHTS.selfEvaluation +
    periodTestGrade * WEIGHTS.periodTest
  );
  
  // Guardar resultado
  results.final = final;
  
  // Actualizar UI
  const finalGradeElement = document.getElementById('final-grade-value');
  finalGradeElement.textContent = final.toFixed(1);
  finalGradeElement.className = `final-grade ${getGradeClass(final)}`;
  
  // Mostrar estrellas
  const finalStarsElement = document.getElementById('final-stars');
  if (final > 0) {
    finalStarsElement.innerHTML = renderStarsHTML(final);
    finalStarsElement.classList.remove('hidden');
  } else {
    finalStarsElement.classList.add('hidden');
  }
  
  // Actualizar barra de progreso
  const progressBar = document.getElementById('final-progress-bar');
  progressBar.style.width = `${(final / 5) * 100}%`;
  progressBar.className = `final-progress-bar ${getProgressBarClass(final)}`;
  
  // Actualizar mensaje
  const messageElement = document.getElementById('final-message');
  if (final >= 4.5) {
    messageElement.innerHTML = `<div class="text-green-400 font-medium">¡Excelente! Continúa con tu buen desempeño</div>`;
  } else if (final >= 3.5) {
    messageElement.innerHTML = `<div class="text-green-400 font-medium">Buen trabajo, sigue mejorando</div>`;
  } else if (final >= 3.0) {
    messageElement.innerHTML = `<div class="text-yellow-400 font-medium">Aprobado, pero puedes mejorar</div>`;
  } else if (final > 0) {
    messageElement.innerHTML = `<div class="text-red-400 font-medium">Necesitas más estudio para aprobar</div>`;
  } else {
    messageElement.innerHTML = '';
  }
  
  // Actualizar botón de guardar
  updateSaveButton();
}
// Guardar una nota
function saveGrade(grade) {
  if (!currentSubject || grade === 0) return;
  
  const newGrade = {
    subject: currentSubject.name,
    icon: currentSubject.icon,
    grade,
    date: new Date().toISOString(),
    color: currentSubject.color
  };
  
  savedGrades.push(newGrade);
  localStorage.setItem('savedGrades', JSON.stringify(savedGrades));
  
  // Actualizar estadísticas e historial
  updateStatistics();
  renderGradeHistory();
  
  // Mostrar confeti y alerta motivacional si la nota es excelente
  if (grade >= 4.5) {
    showConfetti();
    showMotivationalAlert();
  }
}
// Eliminar una nota guardada
function deleteGrade(index) {
  savedGrades.splice(index, 1);
  localStorage.setItem('savedGrades', JSON.stringify(savedGrades));
  
  // Actualizar estadísticas e historial
  updateStatistics();
  renderGradeHistory();
}
// Actualizar estadísticas
function updateStatistics() {
  // Calcular promedio general
  let overallAverage = 0;
  if (savedGrades.length > 0) {
    const sum = savedGrades.reduce((total, grade) => total + grade.grade, 0);
    overallAverage = sum / savedGrades.length;
  }
  
  // Actualizar UI
  document.getElementById('overall-average').textContent = overallAverage.toFixed(1);
  document.getElementById('overall-average').className = `stat-value ${getGradeClass(overallAverage)}`;
  document.getElementById('grades-count').textContent = savedGrades.length;
  
  // Mostrar u ocultar detalles por materia
  const detailsContainer = document.getElementById('subject-details-container');
  if (savedGrades.length > 0) {
    detailsContainer.classList.remove('hidden');
    renderSubjectDetails();
  } else {
    detailsContainer.classList.add('hidden');
  }
}
// Renderizar detalles por materia
function renderSubjectDetails() {
  const subjectDetailsElement = document.getElementById('subject-details');
  subjectDetailsElement.innerHTML = '';
  
  // Obtener materias únicas
  const uniqueSubjects = Array.from(new Set(savedGrades.map(grade => grade.subject)));
  
  // Para cada materia, mostrar la última nota
  uniqueSubjects.forEach(subject => {
    const subjectGrades = savedGrades.filter(grade => grade.subject === subject);
    const latestGrade = subjectGrades[subjectGrades.length - 1];
    
    const detailItem = document.createElement('div');
    detailItem.className = 'subject-detail-item';
    
    detailItem.innerHTML = `
      <div class="subject-info">
        <div 
          class="subject-detail-icon-container" 
          style="background-color: ${latestGrade.color || '#4ade80'}20"
        >
          <i class="${latestGrade.icon} text-sm" style="color: ${latestGrade.color || '#4ade80'}"></i>
        </div>
        <div class="subject-detail-content">
          <div class="subject-detail-name">${subject}</div>
          <div class="subject-detail-date">${new Date(latestGrade.date).toLocaleDateString()}</div>
        </div>
      </div>
      <div class="subject-grade-info">
        <div class="subject-grade ${getGradeClass(latestGrade.grade)}">${latestGrade.grade.toFixed(1)}</div>
        <span 
          class="status-badge" 
          style="
            background-color: ${latestGrade.grade >= 3.0 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'};
            color: ${latestGrade.grade >= 3.0 ? '#4ade80' : '#f87171'}
          "
        >
          ${getStatusText(latestGrade.grade)}
        </span>
      </div>
    `;
    
    subjectDetailsElement.appendChild(detailItem);
  });
}
// Renderizar historial de notas
function renderGradeHistory() {
  const emptyHistory = document.getElementById('empty-history');
  const historyContent = document.getElementById('history-content');
  
  if (savedGrades.length === 0) {
    emptyHistory.classList.remove('hidden');
    historyContent.classList.add('hidden');
    return;
  }
  
  emptyHistory.classList.add('hidden');
  historyContent.classList.remove('hidden');
  historyContent.innerHTML = '';
  
  // Agrupar notas por materia
  const groupedGrades = {};
  savedGrades.forEach(grade => {
    if (!groupedGrades[grade.subject]) {
      groupedGrades[grade.subject] = [];
    }
    groupedGrades[grade.subject].push(grade);
  });
  
  // Ordenar materias alfabéticamente
  const sortedSubjects = Object.keys(groupedGrades).sort();
  
  sortedSubjects.forEach(subject => {
    const subjectGroup = document.createElement('div');
    subjectGroup.className = 'history-subject-group';
    
    const icon = groupedGrades[subject][0].icon;
    const color = groupedGrades[subject][0].color || '#4ade80';
    
    subjectGroup.innerHTML = `
      <div class="history-subject-header">
        <div 
          class="history-subject-icon-container" 
          style="background-color: ${color}20"
        >
          <i class="${icon} text-sm" style="color: ${color}"></i>
        </div>
        <h3 class="history-subject-name">${subject}</h3>
      </div>
    `;
    
    const gradesContainer = document.createElement('div');
    gradesContainer.className = 'history-grades';
    
    groupedGrades[subject].forEach((grade, index) => {
      const savedIndex = savedGrades.findIndex(g => 
        g.subject === grade.subject && g.date === grade.date && g.grade === grade.grade
      );
      
      const gradeItem = document.createElement('div');
      gradeItem.className = 'history-grade-item';
      
      gradeItem.innerHTML = `
        <div class="history-grade-info">
          <div class="history-grade ${getGradeClass(grade.grade)}">${grade.grade.toFixed(1)}</div>
          <div class="history-date">${new Date(grade.date).toLocaleDateString()}</div>
        </div>
        <button class="delete-grade-btn" data-index="${savedIndex}">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;
      
      gradesContainer.appendChild(gradeItem);
    });
    
    subjectGroup.appendChild(gradesContainer);
    historyContent.appendChild(subjectGroup);
  });
  
  // Agregar event listeners a botones de eliminación
  document.querySelectorAll('.delete-grade-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      deleteGrade(index);
    });
  });
}
// Renderizar notas cognitivas
function renderCognitiveGrades() {
  const container = document.getElementById('cognitive-grades-container');
  container.innerHTML = '';
  
  cognitiveGrades.forEach((grade, index) => {
    const gradeItem = document.createElement('div');
    gradeItem.className = 'grade-input-container';
    
    gradeItem.innerHTML = `
      <div class="grade-input-header">
        <label class="grade-label">Nota ${index + 1}</label>
        <button class="remove-grade-btn" ${cognitiveGrades.length <= 1 ? 'disabled' : ''}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <input 
        type="number" 
        min="0" 
        max="5" 
        step="0.1" 
        class="grade-input cognitive-grade" 
        placeholder="0.0"
        value="${grade || ''}"
      >
      <div class="stars-container ${grade > 0 ? '' : 'hidden'}">
        ${grade > 0 ? renderStarsHTML(grade) : ''}
      </div>
    `;
    
    container.appendChild(gradeItem);
  });
  
  // Agregar event listeners
  document.querySelectorAll('.cognitive-grade').forEach((input, index) => {
    input.addEventListener('input', (e) => {
      handleCognitiveGradeChange(index, parseFloat(e.target.value) || 0);
    });
  });
  
  document.querySelectorAll('#cognitive-grades-container .remove-grade-btn').forEach((button, index) => {
    button.addEventListener('click', () => removeGrade('cognitive', index));
  });
}
// Renderizar notas procedimentales
function renderProceduralGrades() {
  const container = document.getElementById('procedural-grades-container');
  container.innerHTML = '';
  
  proceduralGrades.forEach((grade, index) => {
    const gradeItem = document.createElement('div');
    gradeItem.className = 'grade-input-container';
    
    gradeItem.innerHTML = `
      <div class="grade-input-header">
        <label class="grade-label">Nota ${index + 1}</label>
        <button class="remove-grade-btn" ${proceduralGrades.length <= 1 ? 'disabled' : ''}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <input 
        type="number" 
        min="0" 
        max="5" 
        step="0.1" 
        class="grade-input procedural-grade" 
        placeholder="0.0"
        value="${grade || ''}"
      >
      <div class="stars-container ${grade > 0 ? '' : 'hidden'}">
        ${grade > 0 ? renderStarsHTML(grade) : ''}
      </div>
    `;
    
    container.appendChild(gradeItem);
  });
  
  // Agregar event listeners
  document.querySelectorAll('.procedural-grade').forEach((input, index) => {
    input.addEventListener('input', (e) => {
      handleProceduralGradeChange(index, parseFloat(e.target.value) || 0);
    });
  });
  
  document.querySelectorAll('#procedural-grades-container .remove-grade-btn').forEach((button, index) => {
    button.addEventListener('click', () => removeGrade('procedural', index));
  });
}
// Renderizar notas actitudinales
function renderAttitudinalGrades() {
  const container = document.getElementById('attitudinal-grades-container');
  container.innerHTML = '';
  
  attitudinalGrades.forEach((grade, index) => {
    const gradeItem = document.createElement('div');
    gradeItem.className = 'grade-input-container';
    
    gradeItem.innerHTML = `
      <div class="grade-input-header">
        <label class="grade-label">Nota ${index + 1}</label>
        <button class="remove-grade-btn" ${attitudinalGrades.length <= 1 ? 'disabled' : ''}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <input 
        type="number" 
        min="0" 
        max="5" 
        step="0.1" 
        class="grade-input attitudinal-grade" 
        placeholder="0.0"
        value="${grade || ''}"
      >
      <div class="stars-container ${grade > 0 ? '' : 'hidden'}">
        ${grade > 0 ? renderStarsHTML(grade) : ''}
      </div>
    `;
    
    container.appendChild(gradeItem);
  });
  
  // Agregar event listeners
  document.querySelectorAll('.attitudinal-grade').forEach((input, index) => {
    input.addEventListener('input', (e) => {
      handleAttitudinalGradeChange(index, parseFloat(e.target.value) || 0);
    });
  });
  
  document.querySelectorAll('#attitudinal-grades-container .remove-grade-btn').forEach((button, index) => {
    button.addEventListener('click', () => removeGrade('attitudinal', index));
  });
}
// Actualizar el estado del botón guardar
function updateSaveButton() {
  const saveButton = document.getElementById('save-grade-btn');
  saveButton.disabled = !currentSubject || results.final === 0;
  
  if (currentSubject) {
    saveButton.style.backgroundColor = currentSubject.color;
  }
}
// Reiniciar la calculadora
function resetCalculator() {
  cognitiveGrades = [0];
  proceduralGrades = [0];
  attitudinalGrades = [0];
  selfEvaluationGrade = 0;
  periodTestGrade = 0;
  
  results = {
    cognitive: { avg: 0, weighted: 0 },
    procedural: { avg: 0, weighted: 0 },
    attitudinal: { avg: 0, weighted: 0 },
    selfEvaluation: { value: 0, weighted: 0 },
    periodTest: { value: 0, weighted: 0 },
    final: 0,
  };
  
  // Reiniciar interfaces
  renderCognitiveGrades();
  renderProceduralGrades();
  renderAttitudinalGrades();
  
  // Autoevaluación
  document.getElementById('self-evaluation-input').value = '';
  document.getElementById('self-evaluation-weighted').textContent = '0.00';
  document.getElementById('self-evaluation-stars').classList.add('hidden');
  
  // Prueba de periodo
  document.getElementById('period-test-input').value = '';
  document.getElementById('period-test-weighted').textContent = '0.0';
  document.getElementById('period-test-stars').classList.add('hidden');
  
  // Componentes
  document.getElementById('cognitive-avg').textContent = '0.0';
  document.getElementById('cognitive-weighted').textContent = '0.0';
  document.getElementById('cognitive-progress').style.width = '0%';
  
  document.getElementById('procedural-avg').textContent = '0.0';
  document.getElementById('procedural-weighted').textContent = '0.0';
  document.getElementById('procedural-progress').style.width = '0%';
  
  document.getElementById('attitudinal-avg').textContent = '0.0';
  document.getElementById('attitudinal-weighted').textContent = '0.0';
  document.getElementById('attitudinal-progress').style.width = '0%';
  
  // Nota final
  document.getElementById('final-grade-value').textContent = '0.0';
  document.getElementById('final-stars').classList.add('hidden');
  document.getElementById('final-progress-bar').style.width = '0%';
  document.getElementById('final-message').innerHTML = '';
  
  // Botón guardar
  updateSaveButton();
}
// Mostrar confeti
function showConfetti() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  confettiContainer.appendChild(canvas);
  
  const context = canvas.getContext('2d');
  const particles = [];
  const particleCount = 150;
  const colors = [
    '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d',
    '#43aa8b', '#4d908e', '#577590', '#277da1', '#ff0a54',
    '#ff477e', '#ff5c8a', '#ff7096', '#ff85a1', '#ff99ac'
  ];
  
  // Crear partículas
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 0.2 - 0.1,
      tilt: Math.random() * 10 - 5
    });
  }
  
  // Animación
  let animationId;
  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
      context.beginPath();
      context.fillStyle = p.color;
      
      // Dibujar confeti
      context.save();
      context.translate(p.x, p.y);
      context.rotate(p.angle);
      context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 3);
      context.restore();
      
      // Actualizar posición
      p.y += p.speed;
      p.angle += p.rotation;
      p.x += Math.sin(p.angle) * 2;
      
      // Recrear partículas que salen de la pantalla
      if (p.y > canvas.height) {
        particles[i] = {
          x: Math.random() * canvas.width,
          y: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          speed: Math.random() * 3 + 1,
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * 0.2 - 0.1,
          tilt: Math.random() * 10 - 5
        };
      }
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Iniciar animación
  animate();
  
  // Detener después de 3 segundos
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    confettiContainer.removeChild(canvas);
  }, 3000);
}
// Mostrar alerta motivacional
function showMotivationalAlert() {
  const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  motivationalMessage.textContent = randomMessage;
  motivationalAlert.classList.add('show');
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    motivationalAlert.classList.remove('show');
  }, 3000);
}
// Utilidades
function getGradeClass(grade) {
  if (grade >= 4.5) return 'grade-excellent';
  if (grade >= 3.5) return 'grade-good';
  if (grade >= 3.0) return 'grade-average';
  return 'grade-poor';
}
function getProgressBarClass(grade) {
  if (grade >= 4.5) return 'bg-green-500';
  if (grade >= 3.5) return 'bg-green-500';
  if (grade >= 3.0) return 'bg-yellow-500';
  return 'bg-red-500';
}
function getStatusText(grade) {
  if (grade >= 4.5) return 'Excelente';
  if (grade >= 3.5) return 'Bueno';
  if (grade >= 3.0) return 'Aprobado';
  return 'Reprobado';
}
function renderStarsHTML(grade) {
  const maxStars = 5;
  const filledStars = Math.round(grade);
  let html = '';
  
  const starColor = 
    grade >= 4.5 ? 'text-yellow-400' : 
    grade >= 3.5 ? 'text-green-400' : 
    grade >= 3.0 ? 'text-yellow-500' : 
    'text-red-400';
  
  for (let i = 0; i < maxStars; i++) {
    html += `<i class="${i < filledStars ? 'fas' : 'far'} fa-star star ${starColor}"></i>`;
  }
  
  return html;
}
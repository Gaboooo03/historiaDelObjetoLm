// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/xyduguvyd/";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confianza = 0;
let firstDetection = {};

// Botones y resultados
const analyzeBtn = document.getElementById("analyze-btn");
const resetBtn = document.getElementById("reset-btn");
const detectedObject = document.getElementById("detected-object");
const firstDetectionElement = document.getElementById("first-detection");
const historyElement = document.getElementById("history");

// Diccionario de mensajes personalizados
const labelDescriptions = {
  fondoRoom: "Estás mostrando el fondo de tu habitación",
  objFosforo: "¡Detecté un fósforo!",
  objTarjeta: "¡Estás mostrando una tarjeta!",
  objMoneda: "Parece que estás mostrando una moneda",
  objTijera: "¡Eso es una tijera!",
};

// Diccionario de historias y datos curiosos
const labelHistory = {
  objFosforo: {
    history:
      "Los fósforos modernos aparecieron en 1826, inventados por el químico inglés John Walker. Antes de eso, encender fuego era un proceso mucho más complicado.",
    fact: "Un dato curioso es que los fósforos originalmente contenían fósforo blanco, que resultó ser tóxico, por lo que se sustituyó por fósforo rojo.",
  },
  objTarjeta: {
    history:
      "Las tarjetas fueron introducidas en el siglo XX como una forma de identificación y transacciones financieras, evolucionando con la tecnología hasta convertirse en las actuales tarjetas inteligentes.",
    fact: "Sabías que la primera tarjeta bancaria fue introducida en 1950 por Diners Club, exclusivamente para cenas en restaurantes.",
  },
  objMoneda: {
    history:
      "Las primeras monedas metálicas se acuñaron en el Reino de Lidia, en lo que hoy es Turquía, alrededor del año 600 a.C.",
    fact: "Un dato curioso es que las monedas antiguas se fabricaban con oro y plata, y su peso exacto determinaba su valor.",
  },
  objTijera: {
    history:
      "Las tijeras tienen una historia de más de 4,000 años. Las primeras tijeras se encontraron en Egipto, hechas de bronce.",
    fact: "Un dato curioso es que las tijeras modernas con un diseño cruzado fueron inventadas por Leonardo da Vinci.",
  },
};

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  const canvasContainer = document.getElementById("canvas-container");
  const canvas = createCanvas(800, 420);
  canvas.parent(canvasContainer);

  // Create the video
  video = createCapture(VIDEO);
  video.size(800, 420);
  video.hide();

  // Start classifying when the button is clicked
  analyzeBtn.addEventListener("click", classifyVideo);
  resetBtn.addEventListener("click", resetAnalysis);
}

function draw() {
  background(0);
  // Draw the video
  image(video, 0, 0);

  if (confianza > 0.9) {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text(getDescriptionForLabel(label), width / 2, height - 50);
  }
}

// Función para obtener el mensaje personalizado
function getDescriptionForLabel(label) {
  return labelDescriptions[label] || "Objeto no identificado";
}

// Función para obtener la historia y dato curioso
function getHistoryForLabel(label) {
  if (labelHistory[label]) {
    return `
      <strong>Historia:</strong> ${labelHistory[label].history}<br>
      <strong>Dato Curioso:</strong> ${labelHistory[label].fact}
    `;
  } else {
    return "No hay información histórica disponible para este objeto.";
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// Reset the analysis
function resetAnalysis() {
  label = "";
  confianza = 0;
  detectedObject.textContent = "Esperando análisis...";
  firstDetectionElement.textContent = "";
  historyElement.innerHTML = "";
  resetBtn.style.display = "none";
  analyzeBtn.style.display = "inline-block";
}

function gotResult(results, error) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;
  confianza = results[0].confidence;

  if (confianza > 0.9) {
    // Incrementar el contador
    analysisCount++;

    // Actualizar descripción personalizada
    detectedObject.textContent = getDescriptionForLabel(label);

    // Actualizar historia y dato curioso
    historyElement.innerHTML = getHistoryForLabel(label);

    // Registro del primer reconocimiento
    if (!firstDetection[label]) {
      const now = new Date();
      firstDetection[label] = now.toLocaleString();
    }
    firstDetectionElement.textContent = `Primer registro del objeto: "${getDescriptionForLabel(
      label
    )}" en: ${firstDetection[label]}`;

    // Actualizar contador en el DOM
    document.getElementById(
      "analysis-counter"
    ).textContent = `Total de análisis realizados: ${analysisCount}`;
  }

  // Mostrar botones de interacción
  analyzeBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
}

// When we get a result
function gotResult(results, error) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;
  confianza = results[0].confidence;

  if (confianza > 0.9) {
    // Mostrar descripción personalizada
    detectedObject.textContent = getDescriptionForLabel(label);

    // Mostrar historia y dato curioso
    historyElement.innerHTML = getHistoryForLabel(label);

    // Registro del primer reconocimiento
    if (!firstDetection[label]) {
      const now = new Date();
      firstDetection[label] = now.toLocaleString();
    }

    /* firstDetectionElement.textContent = `Primer registro del objeto: "${getDescriptionForLabel(
      label
    )}" en: ${firstDetection[label]}`;
     */
  }

  // Mostrar botones de interacción
  analyzeBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
}

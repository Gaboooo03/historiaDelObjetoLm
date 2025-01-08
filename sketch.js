let classifier;
function preload() {
  classifier = ml5.imageClassifier("MachineLearning");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

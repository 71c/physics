var nParticles = 2;
var isPlaying = true;

var deltaTime = -1;
var prevTime = 0;
var timeBias = 0;
var startPauseTime = 0;

var ps;

var cp5;

var visualizeVelocity = false;
var visualizeAcceleration = false;
var minMass = 50;
var maxMass = 200;

var addRandomParticlesButton;
var add2CollidingParticlesButton;
var showVelocityCheckbox;
var showAccelerationCheckbox;
var collideCheckbox;
var nSlider;
var gSlider;
var minMassSlider;
var maxMassSlider;
var elasticitySlider;

var minMassValue, maxMassValue, elasticityValue, gravityValue, nBallsValue;


function setup() {
  createCanvas(800, 500);
  document.body.append(document.createElement('br'));

  minMassValue = document.getElementById('minMassValue');
  maxMassValue = document.getElementById('maxMassValue');
  elasticityValue = document.getElementById('elasticityValue');
  gravityValue = document.getElementById('gravityValue');
  nBallsValue = document.getElementById('nBallsValue');

  addRandomParticlesButton = createButton('add random particles');
  addRandomParticlesButton.mousePressed(addRandomParticles);

  add2CollidingParticlesButton = createButton('add 2 colliding particles');
  add2CollidingParticlesButton.mousePressed(addTwoCollidingParticles);

  showVelocityCheckbox = createCheckbox('show velocity', false);
  showVelocityCheckbox.changed(showVelocity);

  showAccelerationCheckbox = createCheckbox('show acceleration', false);
  showAccelerationCheckbox.changed(showAcceleration);

  collideCheckbox = createCheckbox('collide', false);
  collideCheckbox.changed(setCollide);

  nSlider = createSlider(0, 100, 10, 1);
  nSlider.changed(changeN);
  nSlider.parent(document.getElementById('nBalls'));

  gSlider = createSlider(-1000, 0, -480);
  gSlider.size(100, 20);
  gSlider.changed(setGravity);
  gSlider.parent(document.getElementById('gravity'));

  minMassSlider = createSlider(0, 1000, 50);
  minMassSlider.size(200, 10);
  minMassSlider.changed(setMinMass);
  minMassSlider.parent(document.getElementById('minMass'));

  maxMassSlider = createSlider(0, 1000, 200);
  maxMassSlider.size(200, 10);
  maxMassSlider.changed(setMaxMass);
  maxMassSlider.parent(document.getElementById('maxMass'));

  elasticitySlider = createSlider(0, 1, 1, 0.01);
  elasticitySlider.size(100, 20);
  elasticitySlider.changed(setElasticity);
  elasticitySlider.parent(document.getElementById('elasticity'));


  ellipseMode(RADIUS);
  ps = new ParticleSystem(createVector(0, -480), true, true, 1.0, 0.5);
  fill(255);
}




function draw() {
  background(0);

  ps.run(deltaTime);

  //if (random(1) < 0.016) {
  //  prvarln(millis() + ", " + ps.totalK());
  //}

  deltaTime = getTime() - prevTime;
  prevTime = getTime();

}

function keyPressed() {
  if (key == 'r') {
    addRandomParticles();
    //ps.addRandomParticles(nParticles, 50, 200, true, 0, 0);
    //ps.addTwoCollidingParticles(50, 200, 300);
    if (!isPlaying)
      play();
  }
  else if (key == ' ') {
    if (isPlaying)
      pause();
    else
      play();
  }
  //} else if (key == 'f') {
  //  for (Particle p : particles) {
  //    var mag = 100000;
  //    //var f = new var(random(mag) - mag / 2.0, random(mag) - mag / 2.0);
  //    var f = createVector(10000, 10000);
  //    p.applyForce(f);
  //  }
  //}
}


function addRandomParticles() {
  //ps.addRandomParticles(nParticles, minMass, maxMass, true, 20000, 30000);
  //ps.addRandomParticles(nParticles, minMass, maxMass, true, 25000, 25000);
  ps.addRandomParticles(nParticles, minMass, maxMass, false, 125, 300);
  // 500 .. 200 .. 125
}

function addTwoCollidingParticles() {
  collideCheckbox.value(true);
  gSlider.value(0);
  nSlider.value(2);
  ps.addTwoCollidingParticles(minMass, maxMass, 300);
}

function showVelocity() {
  visualizeVelocity = !visualizeVelocity;
  ps.setVisualizeVelocity(visualizeVelocity);
}

function showAcceleration() {
  visualizeAcceleration = !visualizeAcceleration;
  ps.setVisualizeAcceleration(visualizeAcceleration);
}

function setCollide() {
  ps.setCollisionsOn(!ps.collisionsOn);
}

function changeN() {
  nParticles = nSlider.value();
  addRandomParticles();
  nBallsValue.innerHTML = nSlider.value();
}

function setMinMass() {
  minMass = minMassSlider.value();
  addRandomParticles();
  minMassValue.innerHTML = minMass;
}

function setMaxMass() {
  maxMass = maxMassSlider.value();
  addRandomParticles();
  maxMassValue.innerHTML = maxMass;
}


function setGravity() {
  ps.setGravity(createVector(0, gSlider.value()));
  gravityValue.innerHTML = gSlider.value();
}

function setElasticity() {
  ps.setElasticity(elasticitySlider.value());
  elasticityValue.innerHTML = elasticitySlider.value();
}

function pause() {
  startPauseTime = millis();
  noLoop();
  deltaTime = 0;
  isPlaying = false;
}

function play() {
  timeBias += startPauseTime - millis();
  loop();
  isPlaying = true;
}

function getTime() {
  return (millis() + timeBias) / 1000.0;
}

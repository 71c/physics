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

function setup() {
  createCanvas(800, 500);
  addRandomParticlesButton = createButton('add random particles');
  // addRandomParticlesButton.position(0, 0);
  addRandomParticlesButton.mousePressed(addRandomParticles);

  add2CollidingParticlesButton = createButton('add 2 colliding particles');
  // add2CollidingParticlesButton.position(0, 40);
  add2CollidingParticlesButton.size(100, 20);
  add2CollidingParticlesButton.mousePressed(addTwoCollidingParticles);

  showVelocityCheckbox = createCheckbox('show velocity', false);
  // showVelocityCheckbox.position(110, 0);
  showVelocityCheckbox.changed(showVelocity);

  showAccelerationCheckbox = createCheckbox('show acceleration', false);
  // showAccelerationCheckbox.position(180, 0);
  showAccelerationCheckbox.changed(showAcceleration);

  collideCheckbox = createCheckbox('collide', false);
  // collideCheckbox.position(300, 0);
  collideCheckbox.changed(setCollide);

  // should be labeled "particles"
  nSlider = createSlider(0, 100, 10, 1);
  // nSlider.position(100, 80);
  nSlider.changed(changeN);

  // should be labeled "g"
  gSlider = createSlider(-1000, 0, -480);
  // gSlider.position(300, 50);
  gSlider.size(100, 20);
  gSlider.changed(setGravity);

  // should be labeled "min mass"
  minMassSlider = createSlider(0, 1000, 50);
  // minMassSlider.position(400, 25);
  minMassSlider.size(200, 10);
  minMassSlider.changed(setMinMass); // todo: create this function

  // should be labeled "max mass"
  maxMassSlider = createSlider(0, 1000, 200);
  // maxMassSlider.position(400, 50);
  maxMassSlider.size(200, 10);
  maxMassSlider.changed(setMaxMass); // todo: create this function

  // should be labeled "elasticity"
  elasticitySlider = createSlider(0, 1, 1, 0.01);
  // elasticitySlider.position(500, 50);
  elasticitySlider.size(100, 20);
  elasticitySlider.changed(setElasticity);


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
}

function setMinMass() {
  minMass = minMassSlider.value();
  addRandomParticles();
}

function setMaxMass() {
  maxMass = maxMassSlider.value();
  addRandomParticles();
}


function setGravity() {
  ps.setGravity(createVector(0, gSlider.value()));
}

function setElasticity() {
  ps.setElasticity(elasticitySlider.value());
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

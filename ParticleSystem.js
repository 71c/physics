class ParticleSystem {
  totalK() {
    var total = 0;
    for (let p of this.particles) {
      total += p.mass * p.velocity.magSq();
    }
    return total * 0.5;
  }

  totalP() {
    var total = 0;
    for (let p of this.particles) {
      total += p.mass * p.velocity.mag();
    }
    return total;
  }

  totalE() {
    var totalUg = 0;
    for (let p of this.particles) {
      totalUg += p.netForce.mag() * p.position.y;
    }
    return totalUg + this.totalK();
  }

  constructor(g, ballCollide, wallBounce, elasticity, d) {
    this.gravity = g;
    this.collisionsOn = ballCollide;
    this.wallBounceOn = wallBounce;
    this.elasticity = elasticity;
    this.density = d;
    this.particles = [];
  }

  setVisualizeVelocity(b) {
    this.visualizeVelocity = b;
    for (let p of this.particles)
      p.visualizeVelocity = b;
  }

  setVisualizeAcceleration(b) {
    this.visualizeAcceleration = b;
    for (let p of this.particles)
      p.visualizeAcceleration = b;
  }

  setCollisionsOn(b) {
    this.collisionsOn = b;
    for (let p of this.particles)
      p.collisionsOn = b;
  }

  setGravity(g) {
    this.gravity = g;
    for (let p of this.particles) {
      p.setGravity(this.gravity);
    }
  }

  setElasticity(e) {
    this.elasticity = e;
    for (let p of this.particles)
      p.elasticity = e;
  }

  getRadius(mass, density) {
    return sqrt(mass / (PI * density));
  }

  addParticle(position, velocity, mass) {
    this.particles.push(new Particle(position, velocity, this.gravity, mass, this.getRadius(mass, this.density), this.collisionsOn, this.wallBounceOn, this.elasticity, this.visualizeVelocity, this.visualizeAcceleration));
  }

  run(deltaTime) {
    this.update(deltaTime);
    this.display();
  }

  display() {
    for (let p of this.particles) {
      p.show();
    }
  }


  applyCollisions() {
    for (let p1 of this.particles) {
      p1.touchingAnyParticles = false;
      for (let p2 of this.particles) {
        if (p1 === p2) {
          continue;
        }

        var intersectionDist = p1.intersectionDist(p2);
        if (intersectionDist >= 0) {

          var extraPos = p5.Vector.sub(p1.position, p2.position).setMag(intersectionDist * 1);
          var angleBetween = this.gravity.angleBetween(extraPos);
          if (isNaN(angleBetween))
            angleBetween = HALF_PI;
          var prop = 1 - angleBetween / PI;
          p2.position.add(p5.Vector.mult(extraPos, -prop));
          p1.position.add(p5.Vector.mult(extraPos, 1 - prop));

          var angle = p5.Vector.sub(p1.position, p2.position).heading();
          p1.velocity.rotate(-angle);
          p2.velocity.rotate(-angle);
          var vx1 = p1.velocity.x;
          var vx2 = p2.velocity.x;
          var totalM = p1.mass + p2.mass;
          var diffM = p1.mass - p2.mass;
          var vx1E = (diffM * vx1 + 2 * p2.mass * vx2) / totalM;
          var vx2E = (-diffM * vx2 + 2 * p1.mass * vx1) / totalM;
          var vxI = (p1.mass * vx1 + p2.mass * vx2) / totalM;
          p1.velocity.x = vx1E * this.elasticity + vxI * (1 - this.elasticity);
          p2.velocity.x = vx2E * this.elasticity + vxI * (1 - this.elasticity);
          p1.velocity.rotate(angle);
          p2.velocity.rotate(angle);

          p1.touchingAnyParticles = true;
          p2.touchingAnyParticles = true;
        }
      }
    }
  }

  update(deltaTime) {
    if (this.collisionsOn) {
      this.applyCollisions();
    }
    for (let p of this.particles) {
      p.advance(deltaTime);
    }
  }

  forceToVelocity(force, duration, mass) {
    return p5.Vector.mult(force, duration / mass);
  }


  addRandomParticles(n, minMass, maxMass, useForce, minQ, maxQ) {
    // typical force: 22956
    // typical velocity: 184
    this.particles = [];
    for (var i = 0; i < n; i++) {
      var mass = random(minMass, maxMass);
      var velocity;
      if (useForce) {
        var appliedForce = p5.Vector.random2D().setMag(random(minQ, maxQ));
        velocity = forceToVelocity(appliedForce, 1, mass);
      }
      else {
        velocity = p5.Vector.random2D().setMag(random(minQ, maxQ));
      }
      this.addParticle(this.randomPosition(), velocity, mass);
    }
  }

  addTwoCollidingParticles(minMass, maxMass, initialVelocity) {
    this.particles = [];
    // mass 50..200
    var m1 = random(minMass, maxMass);
    var r1 = this.getRadius(m1, this.density);
    var m2 = random(minMass, maxMass);
    var r2 = this.getRadius(m2, this.density);

    var pos1 = this.randomPosition();
    var p1 = new Particle(pos1, createVector(0, 0), createVector(0, 0), m1, r1, this.collisionsOn, this.wallBounceOn, this.elasticity, this.visualizeVelocity, this.visualizeAcceleration);

    var pos2 = this.randomPosition();
    var v2 = p5.Vector.sub(pos1, pos2);
    v2.setMag(initialVelocity);
    //v2.rotate(PI / 80.0);
    var p2 = new Particle(pos2, v2, createVector(0, 0), m2, r2, this.collisionsOn, this.wallBounceOn, this.elasticity, this.visualizeVelocity, this.visualizeAcceleration);

    this.particles.push(p1);
    this.particles.push(p2);
  }

  randomPosition() {
    return createVector(random(width), random(height));
  }
}

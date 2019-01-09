class Particle {
  constructor(position, velocity, gravity, mass, radius, collisionsOn, wallBounceOn, elasticity, visualizeVelocity_, visualizeAcceleration_) {
    this.netForce = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.time = 0;
    this.forceQueue = [];
    this.forceQueueTimes = [];

    this.position = position;
    this.velocity = velocity;

    this.gravity = gravity;
    this.radius = radius;
    this.mass = mass;
    this.applyForce(p5.Vector.mult(gravity, mass));
    this.wallBounceOn = wallBounceOn;
    this.collisionsOn = collisionsOn;
    this.elasticity = elasticity;
    this.visualizeVelocity = visualizeVelocity_;
    this.visualizeAcceleration = visualizeAcceleration_;
    this.hasCollided = false;

    this.visualizeVelocity = false;
    this.visualizeAcceleration = false;
    this.touchingAnyParticles = false;
  }

  setGravity(newG) {
    this.applyForce(p5.Vector.mult(gravity, -this.mass));
    this.gravity = newG;
    this.applyForce(p5.Vector.mult(gravity, this.mass));
  }

  getPosition() {
    return this.position;
  }

  show() {
    fill(255);
    stroke(255);
    ellipse(this.position.x, height - this.position.y, this.radius, this.radius);

    var scale = 0.25;

    if (this.visualizeVelocity && this.velocity.mag() != 0) {
      fill(255, 0, 0);
      stroke(255, 0, 0);
      this.vecArrow(this.position, this.velocity, scale);
    }
    if (this.visualizeAcceleration && this.acceleration.mag() != 0) {
      fill(0, 255, 0);
      stroke(0, 255, 0);
      this.vecArrow(this.position, this.acceleration, scale);
    }
  }

  vecArrow(startPos, vec, scaleFactor) {
    var x1 = startPos.x,
      y1 = height - startPos.y,
      x2 = startPos.x + vec.x * scaleFactor,
      y2 = height - (startPos.y + vec.y * scaleFactor);
    arrow(x1, y1, x2, y2);
  }

  arrow(x1, y1, x2, y2) {
    line(x1, y1, x2, y2);
    push();
    translate(x2, y2);
    var a = atan2(x1 - x2, y2 - y1);
    rotate(a);
    //line(0, 0, -10, -10);
    //line(0, 0, 10, -10);
    triangle(0, 0, -5, -10, 5, -10);
    pop();
  }

  advance(t) {
    this.time += t;

    if (this.forceQueueTimes.length >= 1) {
      var i = 0;
      while (i < this.forceQueueTimes.length) {
        if (this.time >= this.forceQueueTimes[i]) {
          this.applyForce(forceQueue.remove(i));
          this.forceQueueTimes.remove(i);
          continue;
        }
        i++;
      }
    }
    this.move(t);
  }

  // http://higuma.github.io/bouncing-balls/
  move(t) {
    var canAccelerateLeft = this.position.x > this.radius;
    var canAccelerateRight = this.position.x < width - this.radius;
    if (!this.wallBounceOn || canAccelerateLeft && canAccelerateRight /*&& !touchingAnyParticles*/ ) {
      this.velocity.x += this.acceleration.x * t;
    }
    this.position.x += this.velocity.x * t;

    // x part. Same thing done for y
    if (this.wallBounceOn) {
      if (this.position.x < this.radius) {
        // bounce by flipping this.velocity x. dampen by elasticity
        this.velocity.x = -this.velocity.x * this.elasticity;
        this.velocity.y *= this.elasticity;
        // this works like magic. found it in code of a similar physics simulator
        this.position.x = 2 * this.radius - this.position.x;
      }
      else if (this.position.x >= width - this.radius) { // same thing but on the other side of the wall
        this.velocity.x = -this.velocity.x * this.elasticity;
        this.velocity.y *= this.elasticity;
        this.position.x = 2 * (width - this.radius) - this.position.x;
      }
    }

    var canAccelerateDown = this.position.y > this.radius;
    var canAccelerateUp = this.position.y < height - this.radius;
    //prvarln(touchingAnyParticles);
    if (!this.wallBounceOn || canAccelerateDown && canAccelerateUp /*&& !touchingAnyParticles*/ ) {
      this.velocity.y += this.acceleration.y * t;
    }
    this.position.y += this.velocity.y * t;

    if (this.wallBounceOn) {
      if (this.position.y >= height - this.radius) {
        this.velocity.y = -this.velocity.y * this.elasticity;
        this.velocity.x *= this.elasticity;
        this.position.y = 2 * (height - this.radius) - this.position.y;
      }
      else if (this.position.y < this.radius) {
        this.velocity.y = -this.velocity.y * this.elasticity;
        this.velocity.x *= this.elasticity;
        this.position.y = 2 * this.radius - this.position.y;
      }
    }
  }

  applyForce(appliedForce) {
    this.netForce.add(appliedForce);
    this.acceleration = p5.Vector.div(this.netForce, this.mass);
  }

  applyTimedForce(appliedForce, duration) {
    this.applyForce(appliedForce);
    this.forceQueue.push(p5.Vector.mult(appliedForce, -1));
    this.forceQueueTimes.push(this.time + duration);
  }

  intersectionDist(other) {
    return -this.position.dist(other.position) + this.radius + other.radius;
  }

  intersects(other) {
    var distance = varersectionDist(other);
    return distance >= 0;
  }
}

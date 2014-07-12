define(['./meshes', './wrappable', './utils', './bullet' ], 
    function(meshes, Wrappable, utils, Bullet) {
  var Ship = function(x, y) {
    this.x = x;
    this.y = y;
    this.velx = 0;
    this.vely = 0;
    this.rotation = 0;
    this.thrust = false;
    this.timeUntilShot = 0;
  };
  utils.mixin(Wrappable, Ship);

  Ship.ROTATION_SPEED = 0.05;
  Ship.TIME_BETWEEN_SHOTS = 4;
  Ship.SHOT_RECOIL = 0.2;

  Ship.prototype.engageThrust = function(engaged) {
    this.thrust = engaged;
  };

  Ship.prototype.update = function() {
    if (this.thrust) {
      this.velx -= Math.sin(this.rotation);
      this.vely += Math.cos(this.rotation);
    }

    this.x += this.velx;
    this.y += this.vely;
    this.timeUntilShot -= 1;
  }

  Ship.prototype.rotateLeft = function() {
    this.rotation -= Ship.ROTATION_SPEED;
  };

  Ship.prototype.rotateRight = function() {
    this.rotation += Ship.ROTATION_SPEED;
  };

  Ship.prototype.shoot = function() {
    if (this.timeUntilShot <= 0) {
      this.timeUntilShot = Ship.TIME_BETWEEN_SHOTS;

      // recoil
      this.velx += Math.sin(this.rotation) * Ship.SHOT_RECOIL;
      this.vely -= Math.cos(this.rotation) * Ship.SHOT_RECOIL;

      return Bullet.create(this.x, this.y, this.velx, this.vely, this.rotation);
    }
  };

  Ship.prototype.draw = function(graphics) {
    var self = this;
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(self.x, self.y);
      context.rotate(self.rotation);
    
      graphics.drawMesh(meshes.ship);

      if (self.thrust) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  };

  return Ship;
});
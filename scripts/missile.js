define(['./gfx', './entity', './meshes', './utils', './explosion2'], 
    function(gfx, Entity, meshes, utils, Explosion2) {
  var Missile = Entity.subclass();

  Missile.prototype.init = function(x, y, velx, vely, direction, pathDecay) {
    this.x = x;
    this.y = y;
    this.r = direction;
    this.velx = velx;
    this.vely = vely;
    this.ttl = Missile.TTL;
    this.boundingRadius = 5;

    this.px = x;
    this.py = y;
    this.pm = utils.random(5, 40) * utils.randomSign();
    this.pathDecay = pathDecay || Missile.PATH_MAGNITUDE_DECAY;

    return this;
  };

  Missile.TTL = 29;
  Missile.ACCELERATION = 1.3;
  Missile.MAX_VELOCITY = Infinity;

  // How quickly the magnitude of the sine wave path decreases over time.
  Missile.PATH_MAGNITUDE_DECAY = 0.99;

  Missile.prototype.onStep = function() {
    if (this.velx * this.velx + this.vely * this.vely < Missile.MAX_VELOCITY * Missile.MAX_VELOCITY) {
      this.velx -= Math.sin(this.r) * Missile.ACCELERATION;
      this.vely += Math.cos(this.r) * Missile.ACCELERATION;
    }

    this.px += this.velx;
    this.py += this.vely;

    var path = Math.sin(this.time * 0.35) * this.pm;
    this.x = this.px - (Math.sin(this.r + Math.PI/2) * path);
    this.y = this.py + (Math.cos(this.r + Math.PI/2) * path);
    this.pm *= this.pathDecay;
  };

  Missile.prototype.onDie = function() {
    if (this.ttl === 0) {
      this.spawn(Explosion2.create().init(this.x, this.y, 100));
    }
  };

  Missile.prototype.onCollideWithAsteroid = function(asteroid) {
    this.die();
    this.spawn(Explosion2.create().init(this.x, this.y, 40));
    asteroid.die();
  };

  // TODO: i'd like to try this, but currently the missile blows up immediately upon launch :)
  Missile.prototype.onCollideWithShip = function(ship) {
    //this.die();
    //this.spawn(Explosion2.create().init(this.x, this.y, 40));
    //ship.die();
  };

  Missile.WIDTH = 8;
  Missile.LENGTH = 20;

  // TODO: meshify
  Missile.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);

    ctx.scale(0.8, 0.8);

    ctx.translate(0, -8);
    ctx.save();
    ctx.beginPath();
    gfx.circle(ctx, -3, -5, 3.5);
    ctx.closePath();
    ctx.fillStyle = '#666';
    ctx.fill();

    ctx.beginPath();
    gfx.circle(ctx, 3, -5, 3.5);
    ctx.closePath();
    ctx.fillStyle = '#666';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(-Missile.WIDTH/2, -Missile.LENGTH/2, Missile.WIDTH, Missile.LENGTH);
    ctx.closePath();
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.beginPath();
    gfx.circle(ctx, 0, Missile.LENGTH/2, Missile.WIDTH/2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, -9);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.stroke();
    
    ctx.restore();

    ctx.save();
    ctx.translate(0, 25);
    ctx.scale(0.4, 5);
    meshes.thrust.draw(ctx);
    ctx.restore();
  };

  return Missile;
});

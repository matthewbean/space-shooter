import Entity from './Entities'
export default class EnemyLaser extends Entity {
    constructor(scene, x, y, dx, dy, laserType, rotation, boxX, boxY, damageAmount) {
      super(scene, x, y, 'projectiles', 'enemy-laser', laserType);
      this.angle = rotation
      this.body.velocity.x = dx;
      this.body.velocity.y = dy;
      this.body.setSize(boxX, boxY)
      this.damageAmount=damageAmount
      
    }
  }
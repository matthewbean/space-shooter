import Entity from './Entities'
export default class PlayerLaser extends Entity {
  constructor(scene, x, y, laserType, damageAmount) {
    super(scene, x, y, 'projectiles', 'laser', laserType);
    this.setScale(3)
    
    this.body.setSize(4,6)
    this.damageAmount=damageAmount
    this.angle = 90
    this.body.velocity.x = 800;
  }
}
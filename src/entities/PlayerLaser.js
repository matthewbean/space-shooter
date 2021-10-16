import Entity from './Entities'
export default class PlayerLaser extends Entity {
  constructor(scene, x, y, laserType, level, damageAmount) {
    super(scene, x, y, 'projectiles', 'laser', laserType.sprite[level]);
    this.setScale(3)
    this.body.setSize(4,6)
    this.damageAmount=damageAmount
    this.angle = 90
    this.body.velocity.x = laserType.speed;
    if (laserType.rotating){
      this.rotating=this.scene.time.addEvent({
        delay: 10,
        callback: function () {
          this.angle+=10
        },
        callbackScope: this,
        loop: true,
      });
    }
    if (laserType.acceleration!=0){
    this.acceleration=this.scene.time.addEvent({
      delay: 30,
      callback: function () {
        this.body.velocity.x += laserType.acceleration
      },
      callbackScope: this,
      loop: true,
    });
  }
  }
  onDestroy() {
    if (this.acceleration !== undefined) {
      if (this.acceleration) {
        this.acceleration.remove(false);
      }
    }
    if (this.rotating !== undefined) {
      if (this.rotating) {
        this.rotating.remove(false);
      }
    }
  }
}
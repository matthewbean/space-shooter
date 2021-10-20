import Entity from './Entities'
export default class EnemyLaser extends Entity {
    constructor(scene, x, y, dx, dy, laserType, rotation, boxX, boxY, damageAmount) {
      super(scene, x, y, 'projectiles', 'enemy-laser', laserType);
      this.angle = rotation
      this.body.velocity.x = dx;
      this.body.velocity.y = dy;
      this.body.setSize(boxX, boxY)
      this.damageAmount=damageAmount
      if (laserType === 15){
      this.rotating=this.scene.time.addEvent({
        delay: 10,
        callback: function () {
          this.angle+=10
        },
        callbackScope: this,
        loop: true,
      });
    }
      
    }
    onDestroy(){
      if (this.rotating !== undefined) {
        if (this.rotating) {
          this.rotating.remove(false);
        }
      }  
    }
  }
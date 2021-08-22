import Entity from './Entities'
import EnemyLaser from './EnemyLaser'
export default class GunShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'enemy-ships', 'gunShip', 24, [83, 86]);
      
      this.body.velocity.x = Phaser.Math.Between(-50, -100);
      this.hp = 5;
      this.damageAmount=1
      this.setScale(4)
      this.angle = 90
      this.shootTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(1500, 2500),
        callback: function () {
          var laser = new EnemyLaser(this.scene, this.x, this.y, -200, 0, 3, -90,3,2, this.damageAmount);
          laser.setScale(3)
          this.scene.enemyLasers.add(laser);
        },
        callbackScope: this,
        loop: true,
      });
    }
    onDestroy() {
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
    }
    update() {
      this.body.velocity.y =
        Math.sin(this.x / Phaser.Math.Between(75, 100)) *
        Phaser.Math.Between(50, 75);
    }
    
  }
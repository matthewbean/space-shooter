import Entity from './Entities'
import EnemyLaser from './EnemyLaser'
import GunShip from './GunShip'
export default class CarrierShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'boss-ships', 'carrierShip', 1, [99, 102]);
      this.hp = 25;
      this.angle = 90
      this.setScale(5)
      this.damageAmount=2
      this.body.velocity.x = Phaser.Math.Between(-50, -100);
      this.shootTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(1500, 2500),
        callback: function () {
          var laser1 = new EnemyLaser(this.scene, this.x, this.y, -200, 10,31, 225,10,3, this.damageAmount);
          laser1.setScale(this.scaleX);
          this.scene.enemyLasers.add(laser1);
          var laser2 = new EnemyLaser(this.scene, this.x, this.y, -200, -10,31, 225,10,3, this.damageAmount);
          laser2.setScale(this.scaleX);
          this.scene.enemyLasers.add(laser2);
        },
        callbackScope: this,
        loop: true,
      });
      this.spawnShipTimer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(1500, 2500),
        callback: function () {
          
          if (!this.isDead) {
            let enemy1 = new GunShip(this.scene, this.x, this.y - 50);
            this.scene.enemies.add(enemy1);
            let enemy2 = new GunShip(this.scene, this.x, this.y + 50);
            this.scene.enemies.add(enemy2);
          }
        },
        callbackScope: this,
        loop: false,
      });
    }
    onDestroy() {
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
    }
    
  }
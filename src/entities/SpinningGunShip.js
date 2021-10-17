import Entity from './Entities'
import EnemyLaser from './EnemyLaser'
export default class SpinningGunShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'enemy-ships', 'SpinningGunShip', 13, [83, 86]);
      this.body.velocity.x = Phaser.Math.Between(-200, -300);
      this.states = {
        MOVE_LEFT: 'MOVE_LEFT',
        SHOOT: 'SHOOT',
        COOLDOWN: 'COOLDOWN'
      };
      this.damageAmount=1
      this.hp = 35;
      this.reward=75
      this.rays = []
      this.setScale(3)
      this.state = this.states.MOVE_LEFT;
  
      this.shootTimer = this.scene.time.addEvent({
        delay: 232,
        callback: function () {
          if (this.state === this.states.SHOOT) {
            for (let i = 0; i < 4; i++) {
              let angle =
                (this.angle * Math.PI) / 180 + Math.PI / 4 + (Math.PI / 2) * i;
              var laser = new EnemyLaser(
                this.scene,
                this.x,
                this.y,
                Math.cos(angle) * 100,
                Math.sin(angle) * 100,
                13,
                this.angle + 135 + 90 * i,
                4,
                4,
                this.damageAmount
              );
              
              laser.setScale(this.scaleX);
              this.scene.enemyLasers.add(laser);
            }
            

            
          }
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
      this.angle += 1;
      
    
      
      if (this.x <= 400 && this.state === this.states.MOVE_LEFT) {
        this.state = this.states.SHOOT;
        this.body.velocity.x = 0;
      }
    }
  }
import Entity from './Entities'

export default class ChaserShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'projectiles', 'ChaserShip', 22);
      this.hp = 5;
      this.body.setSize(6,6)
      this.setScale(4)
      this.damageAmount=1
      this.body.velocity.x = Phaser.Math.Between(-50, -100);
      
      this.states = {
        MOVE_LEFT: 'MOVE_LEFT',
        CHASE: 'CHASE',
      };
      this.state = this.states.MOVE_LEFT;
    }
  
    update() {
      if (!this.getData('isDead') && this.scene.player) {
        if (
          Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.scene.player.x,
            this.scene.player.y
          ) < 320
        ) {
          this.state = this.states.CHASE;
        }
  
        if (this.state == this.states.CHASE) {
          var dx = this.scene.player.x - this.x;
          var dy = this.scene.player.y - this.y;
  
          var angle = Math.atan2(dy, dx);
  
          var speed = 100;
          this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  
          if (this.x < this.scene.player.x) {
            this.angle -= 7;
          } else {
            this.angle += 7;
          }
        }
      }
    }
    
  }
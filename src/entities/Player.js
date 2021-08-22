import Entity from './Entities'
import PlayerLaser from './PlayerLaser'
export default class Player extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'player-ships', 1);
      this.setData('speed', 300);
      this.setData('canShoot', true)
      this.hp = 10;
      this.setScale(4)
      this.angle = 90
      this.damageAmount=1

      
      this.setData('isShooting', false);

      this.setData('timerShootDelay', 10);
      this.setData('timerShootTick', this.getData('timerShootDelay') - 1);

      this.blaster = this.scene.sound.add('player-laser', {volume:.8})

      this.keyW =  this.scene.input.keyboard.addKey('W');
      this.keyA =  this.scene.input.keyboard.addKey('A');
      this.keyS =  this.scene.input.keyboard.addKey('S');
      this.keyD =  this.scene.input.keyboard.addKey('D');
      this.keySpace = this.scene.input.keyboard.addKey('SPACE');

      this.anims.create({
        key:'straight',
        frames: [{ key:'player-ships', frame:1 }],
            frameRate:20,
    })
      this.anims.create({
        key:'up',
        frames: [{ key:'player-ships', frame:0 }],
            frameRate:20,
      })
      this.anims.create({
        key:'down',
        frames: [{ key:'player-ships', frame:2 }],
            frameRate:20,
    })
                
        
    }
    
    moveUp() {
      this.body.velocity.y = -this.getData('speed');
    }
  
    moveDown() {
      this.body.velocity.y = this.getData('speed');
    }
  
    moveLeft() {
      this.body.velocity.x = -this.getData('speed');
    }
  
    moveRight() {
      this.body.velocity.x = this.getData('speed');
    }
    update() {
      this.body.setVelocity(0, 0);
      this.x = Phaser.Math.Clamp(this.x, 17, this.scene.game.config.width);
      this.y = Phaser.Math.Clamp(this.y, 20, this.scene.game.config.height);
      if (this.getData('isShooting')) {
        if(this.getData('canShoot')){
          this.blaster.play()
          var laser = new PlayerLaser(this.scene, this.x+25, this.y, 5, this.damageAmount);
          this.scene.playerLasers.add(laser);
          this.setData('canShoot', false);
          this.scene.time.addEvent({
            delay: 100,
            callback: function () {
              this.setData('canShoot',true)
            },
            callbackScope: this,
            loop: false,
          });

        }
      }
      if (!this.getData('isDead')) {
        
        if (this.keyW.isDown) {
          this.moveUp();
          this.anims.play('up', true)
        } else if (this.keyS.isDown) {
          this.moveDown();
          this.anims.play('down', true)
        } else {
          this.anims.play('straight', true)
        }
        if (this.keyA.isDown) {
          this.moveLeft();
          
        } else if (this.keyD.isDown) {
          this.moveRight();
          
        }
  
        if (this.keySpace.isDown) {
          this.setData('isShooting', true);
        } else {
          this.setData(
            'timerShootTick',
            this.getData('timerShootDelay') - 1
          );
          this.setData('isShooting', false);
        }
      }
    }
  }
import Entity from './Entities'
import PlayerLaser from './PlayerLaser'
import Characters from '../utilities/Characters'
import Burner from './Burner'
export default class Player extends Entity {
    constructor(scene, x, y, choice) {
      super(scene, x, y, 'player-ships', Characters[choice].startFrame,'player', [87, 90]);
      this.character=Characters[choice]
      this.setData('speed', this.character.speed*75);
      this.setData('canShoot', true)
      this.hp = this.character.hp;
      this.setScale(4)
      this.angle = 90
      this.damageAmount=this.character.damage
      this.burner= new Burner(this.scene, this.x-20, this.y, 44,47, false, 3)

      
      this.setData('isShooting', false);

      this.setData('timerShootDelay', 10);
      this.setData('timerShootTick', this.getData('timerShootDelay') - 1);

      this.blaster = this.scene.sound.add('player-laser', {volume: this.scene.settings.sfx})

      this.keyW =  this.scene.input.keyboard.addKey('W');
      this.keyA =  this.scene.input.keyboard.addKey('A');
      this.keyS =  this.scene.input.keyboard.addKey('S');
      this.keyD =  this.scene.input.keyboard.addKey('D');
      this.keySpace = this.scene.input.keyboard.addKey('SPACE');

      this.anims.create({
        key:'straight',
        frames: [{ key:'player-ships', frame: this.character.startFrame+1 }],
            frameRate:20,
    })
      this.anims.create({
        key:'up',
        frames: [{ key:'player-ships', frame: this.character.startFrame }],
            frameRate:20,
      })
      this.anims.create({
        key:'down',
        frames: [{ key:'player-ships', frame: this.character.startFrame+2 }],
            frameRate:20,
    })
                
        
    }
    
    moveUp() {
      if (this.y>20){
      this.body.velocity.y = -this.getData('speed');
      }
    }
  
    moveDown() {
      if (this.y<this.scene.game.config.height-20){
      this.body.velocity.y = this.getData('speed');
      }
    }
  
    moveLeft() {
      if (this.x>20){
      this.body.velocity.x = -this.getData('speed');
      }
    }
  
    moveRight() {
      if (this.x< this.scene.game.config.width-20){
      this.body.velocity.x = this.getData('speed');
      }
    }
    update() {
      this.body.setVelocity(0, 0);
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
        this.burner.update(this.x-22+this.body.velocity.x/100, this.y+this.body.velocity.y/50)
        

      }
      this.cleanUp=function(){
        this.setData('isShooting', false)
        this.burner.destroy()
        this.scene.time.addEvent({
          delay: 3000,
          callback: function () {
            this.scene.scene.start('SceneGameOver', {character:this.scene.data.character, money:this.scene.money, music:true})
          },
          callbackScope: this,
          loop: false,
        });

      }
    }
  }
import Entity from './Entities'
import PlayerLaser from './PlayerLaser'
import Characters from '../utilities/Characters'
import Weapons from '../utilities/Weapons'
import Burner from './Burner'
export default class Player extends Entity {
    constructor(scene, x, y, data, weaponsOwned) {
      super(scene, x, y, 'player-ships', Characters[data.ship].startFrame,'player', [87, 90]);
      this.character=Characters[data.ship]
      this.weaponsOwned=weaponsOwned
      this.setData('speed', this.character.speed*75);
      this.setData('canShoot', true)
      this.setData('canDamage', true)
      this.maxHP=this.character.hp;
      this.hp = this.character.hp;
      this.setScale(4)
      this.angle = 90
      this.laserType=data.laser
      this.damageAmount=this.character.damage*Weapons[this.laserType].damage[this.weaponsOwned[this.laserType]]
      this.burner= new Burner(this.scene, this.x-20, this.y, 44,47, false, 3)
      
      this.setData('isShooting', false);

      this.setData('timerShootDelay', Weapons[this.laserType].reload);
      this.setData('timerShootTick', this.getData('timerShootDelay') - 1);

      this.blaster = this.scene.sound.add(Weapons[this.laserType].sound, {volume: this.scene.settings.sfx*Weapons[this.laserType].volume}).setDetune(0)

      this.keyW =  this.scene.input.keyboard.addKey('W');
      this.keyA =  this.scene.input.keyboard.addKey('A');
      this.keyS =  this.scene.input.keyboard.addKey('S');
      this.keyD =  this.scene.input.keyboard.addKey('D');
      this.keyE =  this.scene.input.keyboard.addKey('E');
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
          var laser = new PlayerLaser(this.scene, this.x+25, this.y, Weapons[this.laserType], this.weaponsOwned[this.laserType], this.damageAmount );
          this.scene.playerLasers.add(laser);
          this.setData('canShoot', false);
          this.scene.time.addEvent({
            delay: this.getData('timerShootDelay'),
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
        if (this.keyE.isDown && !this.scene.play){
          this.scene.scene.start('SceneShop', {character:this.scene.data.character, gameCounter: this.scene.gameCounter, money:this.scene.money, level:this.scene.level, weaponsOwned: this.weaponsOwned})
        }
  
        if (this.keySpace.isDown || this.scene.settings.autoFire) {
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
            this.scene.scene.start('SceneGameOver', {level: this.scene.level, gameCounter: this.scene.gameCounter, character:this.scene.data.character, money:this.scene.money, music:true, weaponsOwned: this.weaponsOwned})
          },
          callbackScope: this,
          loop: false,
        });

      }
    }
  }

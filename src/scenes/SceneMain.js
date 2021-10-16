import CarrierShip from '../entities/CarrierShip'
import ChaserShip from '../entities/ChaserShip'
import Player from '../entities/Player'
import GunShip from '../entities/GunShip'
import SpinningGunShip from '../entities/SpinningGunShip'
import Levels from '../utilities/Levels'
import HP from '../hud/HP'
export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
    
  }

  
  


  preload() {

    this.load.spritesheet('player-ships', 
            './assets/player-ships.png',
            { frameWidth: 8, frameHeight: 8 }
        );
    this.load.spritesheet('enemy-ships', 
            './assets/enemy-ships.png',
            { frameWidth: 8, frameHeight: 8 }
        );
    this.load.spritesheet('boss-ships', 
            './assets/boss-ships.png',
            { frameWidth: 16, frameHeight: 16 }
        );
    this.load.spritesheet('projectiles', 
            './assets/projectiles.png',
            { frameWidth: 8, frameHeight: 8 }
        );
    this.load.spritesheet('ui', 
            './assets/UI.png',
            { frameWidth: 8, frameHeight: 8 }
        );
    this.load.spritesheet('background', 
            './assets/background.png',
            { frameWidth: 128, frameHeight: 256 }
        );  
    this.load.spritesheet('misc', 
            './assets/misc.png',
            { frameWidth: 8, frameHeight: 8 }
        );  
        this.load.setPath('./assets/sounds')
      //load music and sound effects
      this.load.audio('player-laser', ['player-laser-2.wav']);  
      this.load.audio('explosion-1', ['explosion-1.wav']);  
      this.load.audio('explosion-2', ['explosion-2.wav']);  
      this.load.audio('explosion-3', ['explosion-3.wav']);  
      this.load.audio('explosion-4', ['explosion-4.wav']);  
      this.load.audio('soundtrack', ['neon-trip.mp3']);  
      this.load.audio('take-damage', ['take-damage.wav']);  

  }
  
  create(data) {
    //create background
    this.sound.stopByKey('the-longest-year')
    this.data=data
    this.settings=JSON.parse(localStorage.getItem('settings')) ??{
      music:1,
      sfx:1,
      autoFire: false,
      cameraShake:true
    }    
    for (let i = 4; i<6; i++){
      let element = this.add.tileSprite(this.game.config.height * 0.5,this.game.config.width * 0.5,this.game.config.width,(this.game.config.height*2+(i-4)*this.game.config.width*3),'background',i)
      element.angle = 90
      this.time.addEvent({
      delay: 40-(i-4)*25,
      callback: function () {
        element.tilePositionY-=2 
      },
      callbackScope: this,
      loop: true,
    });
    
    }

console.log(data)
      this.player = new Player(
        this,
        20,
        this.game.config.height * 0.5,
        data.character,
        data.weaponsOwned
      );
    
    
    
    this.health= new HP(this, 50,50, 15)
    if (!data.music){
      this.soundtrack = this.sound.add('soundtrack', {volume: this.settings.music })
      this.soundtrack.play()
    }
    this.takeDamage=this.sound.add('take-damage', {volume: this.settings.sfx/2}).setDetune(1200)
    
    


    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.physics.add.overlap(this.playerLasers, this.enemies, function (
      playerLaser,
      enemy
    ) {
      
      if (enemy) {
        enemy.flicker()
        enemy.damage(true, playerLaser.damageAmount);
        playerLaser.onDestroy();
        playerLaser.destroy()
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function (
      player,
      enemy
    ) {
      if (!player.getData('isDead') && !enemy.getData('isDead')) {
        player.damage(false, enemy.damageAmount);
        player.flicker()
        this.takeDamage.play()
        if (this.settings.cameraShake){this.cameras.main.shake(100, .009);}
        enemy.hp=1;
        enemy.damage(true, player.damageAmount);
      }
    }.bind(this));

    this.physics.add.overlap(this.player, this.enemyLasers, function (
      player,
      laser
    ) {
      if (!player.getData('isDead') && !laser.getData('isDead')) {
        player.flicker()
        this.takeDamage.play()
        player.damage(false, laser.damageAmount);
        if (this.settings.cameraShake){this.cameras.main.shake(100, .005);}
        laser.destroy();
      }
    }.bind(this));
    this.input.on('pointerdown', function () {
  }, this);
  this.money= data.money ?? 0
  this.moneyDisplay=this.add.text(this.game.config.width-20, 40, `$${this.money}`, {fontSize: `20px`, fontFamily: `font1`}).setOrigin(1)
  //control level

  this.level=0
  this.play=false
  this.announcement=this.add.text(this.game.config.width*.5, 200, `Wave ${this.level+1}`, {fontSize:'48px', fontFamily: 'font1'}).setOrigin(.5)
  this.announce=()=>this.time.addEvent({
    delay: 10000,
    callback: function(){
      console.log('play')
      this.play=true
      this.announcement.text=``
      this.levelTimer()
    },
    callbackScope: this,
    loop: false
  })
  this.levelTimer=()=>this.time.addEvent({
    delay: Levels[this.level].length,
    callback: function(){
      console.log('break')
      this.level++
      this.play=false
      this.announcement.text=`Wave ${this.level+1}`
      this.announce()
    },
    callbackScope: this,
    loop: false
  })
  this.announce()


  //add main loop to create enemies

    this.time.addEvent({
      delay: Levels[this.level].spawnTimer,
      callback: function () {
        if (this.play){
        let enemyNumber=Phaser.Math.Between(1,100)
        var enemy = null;

        if (enemyNumber<=Levels[this.level].enemies[0]) {
          enemy = new GunShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(50, this.game.config.height  - 50)
          );
          
        } else if (enemyNumber<=Levels[this.level].enemies[1]) {
          enemy = new ChaserShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(50, this.game.config.height  - 50)
          );
          
        } else if (
          enemyNumber<=Levels[this.level].enemies[2] &&
          this.getEnemiesByType('SpinningGunShip').length < 1
        ) {
          enemy = new SpinningGunShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(50, this.game.config.height  - 50)
          );
          
        } else if (enemyNumber<=Levels[this.level].enemies[3]){
          enemy = new CarrierShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(50, this.game.config.height  - 50)
          );
          
        }
        if (enemy)this.enemies.add(enemy);
      }

      },
      callbackScope: this,
      loop: true,
    });
    
  }

  

  update() {
    this.player.update()
    this.cleanUp()
    this.health.update()    
    
  }

  getEnemiesByType(type) {
    var arr = [];
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var enemy = this.enemies.getChildren()[i];
      if (enemy.getData('type') == type) {
        arr.push(enemy);
      }
    }
    return arr;
  }
  cleanUp(){
    
    for (var i = 0; i < this.enemies.getChildren().length; i++) {
        var enemy = this.enemies.getChildren()[i];
  
        enemy.update();
        if (
          enemy.x < -enemy.displayWidth ||
          enemy.x > this.game.config.width + enemy.displayWidth ||
          enemy.y < -enemy.displayHeight * 4 ||
          enemy.y > this.game.config.height + enemy.displayHeight
        ) {
          if (enemy) {
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
  
            enemy.destroy();
          }
        }
      }
      for (var i = 0; i < this.enemyLasers.getChildren().length; i++) {
        var laser = this.enemyLasers.getChildren()[i];
        laser.update();
  
        if (
          laser.x < -laser.displayWidth ||
          laser.x > this.game.config.width + laser.displayWidth ||
          laser.y < -laser.displayHeight * 4 ||
          laser.y > this.game.config.height + laser.displayHeight
        ) {
          if (laser) {
            laser.destroy();
          }
        }
      }
  
      for (var i = 0; i < this.playerLasers.getChildren().length; i++) {
        var laser = this.playerLasers.getChildren()[i];
        laser.update();
  
        if (
          laser.x < -laser.displayWidth ||
          laser.x > this.game.config.width + laser.displayWidth ||
          laser.y < -laser.displayHeight * 4 ||
          laser.y > this.game.config.height + laser.displayHeight
        ) {
          if (laser) {
            if (laser.onDestroy){
              laser.onDestroy()
            }
            laser.destroy();
          }
        }
      }
}

}

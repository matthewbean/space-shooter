import CarrierShip from '../entities/CarrierShip'
import ChaserShip from '../entities/ChaserShip'
import Player from '../entities/Player'
import GunShip from '../entities/GunShip'
import SpinningGunShip from '../entities/SpinningGunShip'
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
      this.load.audio('player-laser', ['player-laser-1.wav']);  
      this.load.audio('explosion-1', ['explosion-1.wav']);  
      this.load.audio('explosion-2', ['explosion-2.wav']);  
      this.load.audio('explosion-3', ['explosion-3.wav']);  
      this.load.audio('explosion-4', ['explosion-4.wav']);  
      this.load.audio('soundtrack', ['neon-trip.mp3']);  

  }
  
  create() {
    //create background
    
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
    
    this.player = new Player(
      this,
      20,
      this.game.config.height * 0.5
    );
    this.health= new HP(this, 50,50, 15)
    this.soundtrack = this.sound.add('soundtrack', {volume:.5})
    this.soundtrack.play()
    


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
        playerLaser.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function (
      player,
      enemy
    ) {
      if (!player.getData('isDead') && !enemy.getData('isDead')) {
        player.damage(false, enemy.damageAmount);
        player.flicker()
        this.cameras.main.shake(100, .005);
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
        player.damage(false, laser.damageAmount);
        this.cameras.main.shake(100, .005);
        laser.destroy();
      }
    }.bind(this));
    this.input.on('pointerdown', function () {
  }, this);
    this.time.addEvent({
      delay: 1500,
      callback: function () {
        var enemy = null;

        if (Phaser.Math.Between(0, 10) >= 3) {
          enemy = new GunShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(20, this.game.config.height - 20)
          );
          
        } else if (Phaser.Math.Between(0, 10) >= 5) {
          enemy = new ChaserShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(20, this.game.config.height - 20)
          );
          
        } else if (
          Phaser.Math.Between(0, 10) >= 5 &&
          this.getEnemiesByType('SpinningGunShip').length < 1
        ) {
          enemy = new SpinningGunShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(20, this.game.config.height - 20)
          );
          
        } else {
          enemy = new CarrierShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(20, this.game.config.height - 20)
          );
          
        }

        this.enemies.add(enemy);
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
            laser.destroy();
          }
        }
      }
}

}

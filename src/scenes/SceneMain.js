import CarrierShip from '../entities/CarrierShip'
import ChaserShip from '../entities/ChaserShip'
import Player from '../entities/Player'
import GunShip from '../entities/GunShip'
import Boss1 from '../entities/Boss1'
import SpinningGunShip from '../entities/SpinningGunShip'
import Levels from '../utilities/Levels'
import HP from '../hud/HP'
export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
    
  }
  preload() {
    var loadingText = this.make.text({
      x: this.game.config.width / 2,
      y: this.game.config.height / 2 - 50,
      text: 'Loading...',
      style: {fontSize: `20px`, fontFamily: `font1`}
  }).setOrigin(0.5);
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    this.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
  });
              
  this.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
  });
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
    this.load.spritesheet('corner', 
        './assets/corner.png',
        { frameWidth: 16, frameHeight: 16 }
    );
    this.load.spritesheet('side', 
            './assets/side.png',
            { frameWidth: 16, frameHeight: 16 }
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
      this.load.audio('player-laser', ['player-laser-2.mp3']);  
      this.load.audio('mp3e', ['player-laser2.mp3']);  
      this.load.audio('rocket', ['rocket.mp3']);  
      this.load.audio('explosion-1', ['explosion-1.mp3']);  
      this.load.audio('explosion-2', ['explosion-2.mp3']);  
      this.load.audio('explosion-3', ['explosion-3.mp3']);  
      this.load.audio('explosion-4', ['explosion-4.mp3']);  
      this.load.audio('soundtrack-intro', ['neon-trip-intro.mp3']);  
      this.load.audio('soundtrack-main', ['neon-trip-main.mp3']);  
      this.load.audio('take-damage', ['take-damage.mp3']);  

      this.load.plugin('rexmovetoplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexmovetoplugin.min.js', true);
      this.load.plugin('rexshakepositionplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshakepositionplugin.min.js', true);
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

      this.player = new Player(
        this,
        20,
        this.game.config.height * 0.5,
        data.character,
        data.weaponsOwned
      );
    
    
    
    this.health= new HP(this, 20,20, 15)
    if (!data.music){
      this.soundtrackIntro = this.sound.add('soundtrack-intro', {volume: this.settings.music })
      this.soundtrack = this.sound.add('soundtrack-main', {volume: this.settings.music, loop: true})
      this.soundtrackIntro.play()
      this.soundtrackIntro.once('complete', function(music){
        this.soundtrack.play()
      }.bind(this));
    }
    this.takeDamage=this.sound.add('take-damage', {volume: this.settings.sfx/2}).setDetune(1200)
    
    


    this.enemies = this.add.group();
    this.mines=this.add.group()
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();

    this.physics.add.overlap(this.playerLasers, this.enemies, function (
      playerLaser,
      enemy
    ) {
      
      if (enemy) {
        enemy.damage(true, playerLaser.damageAmount);
        playerLaser.onDestroy();
        playerLaser.destroy()
      }
    });
    this.physics.add.overlap(this.playerLasers, this.mines, function (
      playerLaser,
      mine
    ) {
      
      if (mine) {
        mine.damage(true, playerLaser.damageAmount);
        playerLaser.onDestroy();
        playerLaser.destroy()
      }
    });
    this.physics.add.overlap(this.player, this.mines, function (
      player,
      mine
    ) {
      if (!player.getData('isDead') && !mine.getData('isDead')) {
        player.damage(false, mine.damageAmount);
        this.takeDamage.play()
        if (this.settings.cameraShake){this.cameras.main.shake(100, .009);}
        mine.hp=1;
        mine.damage(true, player.damageAmount);
      }
    }.bind(this));
    this.physics.add.overlap(this.enemies, this.mines, function (
      enemy,
      mine
    ) {
      if (!enemy.getData('isDead') && !mine.getData('isDead') && mine.state === mine.states.CHASE) {
        enemy.damage(false, mine.hp);
        if (this.settings.cameraShake){this.cameras.main.shake(100, .009);}
        mine.hp=1;
        mine.damage(true, 100);
      }
    }.bind(this));

    this.physics.add.overlap(this.player, this.enemies, function (
      player,
      enemy
    ) {
      if (!player.getData('isDead') && !enemy.getData('isDead')) {
        player.damage(false, enemy.damageAmount);
        this.takeDamage.play()
        if (this.settings.cameraShake){this.cameras.main.shake(100, .009);}
        if (enemy.getData('type')!=='Boss1')enemy.hp=1;
        enemy.damage(true, player.damageAmount);
      }
    }.bind(this));

    this.physics.add.overlap(this.player, this.enemyLasers, function (
      player,
      laser
    ) {
      if (!player.getData('isDead') && !laser.getData('isDead')) {
        this.takeDamage.play()
        player.damage(false, laser.damageAmount);
        if (this.settings.cameraShake){this.cameras.main.shake(100, .005);}
        laser.destroy();
        laser.onDestroy();
      }
    }.bind(this));
    this.input.on('pointerdown', function () {
  }, this);
  this.money= data.money ?? 0
  this.moneyDisplay=this.add.text(this.game.config.width-20, 30, `$${this.money}`, {fontSize: `20px`, fontFamily: `font1`}).setOrigin(1)
  //control level
  this.level= data.level??0;
  this.gameCounter= data.gameCounter??0;
  this.levelsLength=Levels.length
  console.log(this.gameCounter)
  this.multiplier=1
  this.play=true
  this.multiplierText=this.add.text(this.game.config.width-20, 50, `Multiplier: ${this.multiplier}x`, {fontSize: `20px`, fontFamily: `font1`}).setOrigin(1)
  this.announcement=this.add.text(this.game.config.width*.5, 200, ``, {fontSize:'48px', fontFamily: 'font1'}).setOrigin(.5)
  this.subtitle=this.add.text(this.game.config.width*.5, 250, ``, {fontSize:'24px', fontFamily: 'font1'}).setOrigin(.5)
  
  this.announce=()=>this.time.addEvent({
    delay: 3000,
    callback: function(){
      this.play=true
      this.playLoop= this.addEnemies()
      this.announcement.text=``
      this.subtitle.text=``
      this.levelTimer()
    },
    callbackScope: this,
    loop: false
  })
  this.levelTimer=()=>{ 
    if (Levels[this.level].length >0){this.time.addEvent({
      delay: Levels[this.level].length,
      callback: function(){
        this.playLoop.remove(false)
        this.announcement.text=``
        this.break()
      },
      callbackScope: this,
      loop: false
  })}}
  this.break=()=>this.time.addEvent({
    delay: 10000,
    callback: function(){
      this.play=false
      if (this.level+1<this.levelsLength){
        this.level++}
       else {
        this.gameCounter++
        this.level=0
       }

      this.multiplier= Phaser.Math.RoundTo(this.multiplier+0.2, -1)
      this.multiplierText.text=`${this.multiplier}x`
      this.announcement.text=`Press E to enter shop`
      this.subtitle.text=`This will heal you but reset your multiplier`
      this.shop()
    },
    callbackScope: this,
    loop: false
  })
  this.shop=()=>this.time.addEvent({
    delay: 7000,
    callback: function(){

      this.announcement.text=`${Levels[this.level].name} ${this.gameCounter>0?`- game+${this.gameCounter}`:''}`
      this.subtitle.text=`${Levels[this.level].subtitle}`
      this.announce()
    },
    callbackScope: this,
    loop: false
  })
  this.time.addEvent({
    delay: 2500,
    callback: function(){

      this.announcement.text=`${Levels[this.level].name} ${this.gameCounter>0?`- game+${this.gameCounter}`:''}`
      this.subtitle.text=`${Levels[this.level].subtitle}`
      this.announce()
    },
    callbackScope: this,
    loop: false
  })
  


  //add main loop to create enemies

  this.addEnemies= ()=> this.time.addEvent({
      delay: Levels[this.level].spawnTimer,
      callback: function () {
        if (this.play){
        let enemyNumber=Phaser.Math.Between(1,100)
        var enemy = null;

        if (enemyNumber<=Levels[this.level].enemies[0]) {
          enemy = new GunShip(
            this,
            this.game.config.width + 20,
            Phaser.Math.Between(100, this.game.config.height  - 100)
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
        else if (enemyNumber<=Levels[this.level].enemies[4] &&
          this.getEnemiesByType('Boss1').length < 1) {
          enemy = new Boss1(
            this,
            this.game.config.width,
            300
          );
          }
        if (enemy?.getData('type') === 'ChaserShip')this.mines.add(enemy)
        else if (enemy)this.enemies.add(enemy);

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
    for (var i = 0; i < this.mines.getChildren().length; i++) {
    var mine = this.mines.getChildren()[i];
    mine.update();
    if (
      mine.x < -mine.displayWidth ||
      mine.x > this.game.config.width + mine.displayWidth ||
      mine.y < -mine.displayHeight * 4 ||
      mine.y > this.game.config.height + mine.displayHeight
    ) {
      if (mine) {
        if (mine.onDestroy !== undefined) {
          mine.onDestroy();
        }

        mine.destroy();
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

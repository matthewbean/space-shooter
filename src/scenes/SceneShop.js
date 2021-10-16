import Weapons from '../utilities/Weapons'
export default class SceneShop extends Phaser.Scene {
    constructor() {
      super({ key: 'SceneShop' });
    }
    preload(){
        this.load.spritesheet('background', 
      './assets/background.png',
      { frameWidth: 128, frameHeight: 256 }
    );  
        this.load.spritesheet('projectiles', 
      './assets/projectiles.png',
      { frameWidth: 8, frameHeight: 8 }
    );  
   
    this.load.setPath('./assets/sounds')
    this.load.audio('menu-move', ['menu-move.wav']);  
    this.load.audio('menu-select', ['menu-select.wav']);  
    }
    create(data) {
      this.equipped=data.character?.laser ?? 0
      this.character=data.character?.ship ?? 0
      this.weaponsOwned= data.weaponsOwned??[0,-1,-1, -1]      
      this.money = data.money??3000;
        this.settings=JSON.parse(localStorage.getItem('settings')) ??{
            music:1,
            sfx:1,
            autoFire: false,
            cameraShake:true
          }
          this.menuMove= this.sound.add('menu-move', { volume:this.settings.sfx })
          this.menuSelect= this.sound.add('menu-select', { volume:this.settings.sfx })
        this.background=this.add.tileSprite(this.game.config.width * 0.5,this.game.config.height * 0.5,this.game.config.height,this.game.config.width,'background',5)
        this.background.angle = 90
        this.time.addEvent({
          delay: 40,
          callback: function () {
            this.background.tilePositionY-=2 
            this.background.tilePositionX-=2
          },
          callbackScope: this,
          loop: true,
        });
        //Set up key binds
        this.keyA =  this.input.keyboard.addKey('A');
        this.keyS =  this.input.keyboard.addKey('S');
        this.keyW =  this.input.keyboard.addKey('W');
        this.keyD =  this.input.keyboard.addKey('D');
        this.keyE =  this.input.keyboard.addKey('E');
        this.keySPACE =  this.input.keyboard.addKey('SPACE');

        this.title = this.add.text(this.game.config.width*0.5, 125, 'Shop', {fontSize: '48px',fontFamily: 'font1' }).setOrigin(0.5);
        this.weapons= []
        Weapons.forEach((item, i)=>{
            let weapon= this.add.image(260, this.game.config.height*(i)*.1+193, 'projectiles', item.shopSprite).setScale(3)
            this.weapons.push(weapon)

        })
        this.labels=[]
        this.weapons.forEach((item, i)=>{
          let label = this.add.text(560, this.game.config.height*(i)*.1+205, `${Weapons[i].name} - ${ (this.weaponsOwned[i]+1) !== Weapons[i].levels? (this.weaponsOwned[i] === -1?`Buy `:'lv.'+(this.weaponsOwned[i]+2)):''} ${Weapons[i].cost[(this.weaponsOwned[i]+1)]? '$'+Weapons[i].cost[(this.weaponsOwned[i]+1)]:'Max'}` , {fontSize: '20px',fontFamily: 'font1' }).setOrigin(1);
          this.labels.push(label)
        })

        this.finishedLabel = this.add.text(this.game.config.width*0.5, this.game.config.height*(this.weapons.length)*.1+195, `Done` , {fontSize: '20px',fontFamily: 'font1' }).setOrigin(.5);
        this.moneyDisplay=this.add.text(this.game.config.width-20,40,`$${this.money}`, {fontSize: '20px',fontFamily: 'font1' }).setOrigin(1)
        this.cursor=this.add.image(225,this.game.config.height+192,'UI',138).setScale(3).setAngle(90).setOrigin(.5)
        this.cursor.setData('position', 0)
        this.cursor.setData('canMove', true)
        this.description=this.add.text(this.game.config.width*0.5, this.game.config.height-90, Weapons[this.cursor.getData('position')].description, {fontSize: '20px',fontFamily: 'font1', wordWrap: { width: 500 } }).setOrigin(.5).setAlign('center')
        this.equippedLabel = this.add.text(585, this.game.config.height*(this.equipped)*.1+205, `E` , {fontSize: '20px',fontFamily: 'font1' }).setOrigin(1);
        this.add.text(20,20, `CONTROLS:`, {fontSize: `20px`, fontFamily: `font1`})
        this.add.text(20,50, `W/S: UP/DOWN`, {fontSize: `16px`, fontFamily: `font1`})
        this.add.text(20,80, `SPACE: PURCHASE/SELECT`, {fontSize: `16px`, fontFamily: `font1`})
        this.add.text(20,110, `E: EQUIP`, {fontSize: `16px`, fontFamily: `font1`})
    }
    update(){
      if (this.cursor.getData('canMove')){
        if (this.keyW.isDown) {
          this.menuMove.play()
          this.cursor.setData('canMove',false)
          this.time.addEvent({
            delay: 200,
            callback: function () {
              this.cursor.setData('canMove',true)
            },
            callbackScope: this,
            loop: false,
          });
          if (this.cursor.getData('position')<=0){
            this.cursor.setData('position', this.weapons.length)
          } else {
            this.cursor.setData('position', this.cursor.getData('position')-1)
            
          }
          this.description.text= Weapons[this.cursor.getData('position')]?.description || '';
        } 
        else if (this.keyS.isDown){
          this.menuMove.play()
          this.cursor.setData('canMove', false)
          this.time.addEvent({
            delay: 200,
            callback: function () {
              this.cursor.setData('canMove',true)
            },
            callbackScope: this,
            loop: false,
          });
          if (this.cursor.getData('position')>=this.weapons.length){
            this.cursor.setData('position', 0)
          } else {
            this.cursor.setData('position', this.cursor.getData('position')+1)
          }
          this.description.text= Weapons[this.cursor.getData('position')]?.description || '';
        } 
        this.cursor.y=192+this.game.config.height*this.cursor.getData('position')*.1
        if (this.keyE.isDown){
          this.cursor.setData('canMove', false)
          if (this.cursor.getData('position') < this.weapons.length && this.weaponsOwned[this.cursor.getData('position')]>=0) this.equipped=this.cursor.getData('position')
          this.equippedLabel.y=this.game.config.height*(this.equipped)*.1+205
          this.time.addEvent({
            delay: 200,
            callback: function () {
              this.cursor.setData('canMove',true)
            },
            callbackScope: this,
            loop: false,
          });
        }
        if (this.keySPACE.isDown){
          this.menuSelect.play()
          this.cursor.setData('canMove', false)
          this.time.addEvent({
            delay: 200,
            callback: function () {
              this.cursor.setData('canMove',true)
            },
            callbackScope: this,
            loop: false,
          });

          
          if (this.cursor.getData('position')  == this.weapons.length){
            this.scene.start('SceneMain', {money: this.money, weaponsOwned: this.weaponsOwned, character: {laser: this.equipped, ship: this.character}  });
          } 
          else {
            let cost = Weapons[this.cursor.getData('position')].cost[this.weaponsOwned[this.cursor.getData('position')]+1]
          if (this.money-cost>=0){
            this.money-=cost
            this.moneyDisplay.text=`$${this.money}`
            this.weaponsOwned[this.cursor.getData('position')]++
            this.labels.forEach((item, i)=>{
            item.text=`${Weapons[i].name} - ${ (this.weaponsOwned[i]+1) !== Weapons[i].levels? (this.weaponsOwned[i] === -1?`Buy `:'lv.'+(this.weaponsOwned[i]+2)):''} ${Weapons[i].cost[(this.weaponsOwned[i]+1)]? '$'+Weapons[i].cost[(this.weaponsOwned[i]+1)]:'Max'}`
          })
          }
        }
          
        }
      }
   
     
        
    
      }
  }
  
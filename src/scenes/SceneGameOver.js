export default class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }
  preload(){
    
    
    this.load.spritesheet('background', 
      './assets/background.png',
      { frameWidth: 128, frameHeight: 256 }
    );  
    this.load.spritesheet('UI', 
      './assets/UI.png',
      { frameWidth: 8, frameHeight: 8 }
    );
    this.load.setPath('./assets/sounds')
    this.load.audio('menu-move', ['menu-move.wav']);  
    this.load.audio('menu-select', ['menu-select.wav']);  
  }
  create(data) {
    // this.scene.start('SceneMain', {character:1})
    //this.scene.start('CharacterSelect');
    this.settings=JSON.parse(localStorage.getItem('settings')) ??{
      music:1,
      sfx:1,
      autoFire: false,
      cameraShake:true
    }
    
    //set up sound in music
    
    this.menuMove= this.sound.add('menu-move', { volume:this.settings.sfx })
    this.menuSelect= this.sound.add('menu-select', { volume:this.settings.sfx })
    //play music
    
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
    //create controls
    this.keyW =  this.input.keyboard.addKey('W');
    this.keyS =  this.input.keyboard.addKey('S');
    this.keySPACE =  this.input.keyboard.addKey('SPACE');
    //create title
this.title = this.add.text(this.game.config.width*0.5, 200, 'Game Over', {fontSize: '48px',fontFamily: 'font1' }).setOrigin(0.5);
this.selectors=[]
//define menu items
this.menuItems=[{text:'Continue', onSelect: ()=>{this.scene.start('SceneMain', data);}},
{text:'Shop', onSelect: ()=>{this.scene.start('SceneShop', data);}},
{text:'Main Menu', onSelect: ()=>this.scene.start('SceneMainMenu', {music: false})}]

//create menu items
this.menuItems.forEach((item, i)=>{
  let element= this.add.text(this.game.config.width*0.43, 300+40*i, item.text, {fontSize: '20px',  fontFamily: 'font1' }).setOrigin(0);
  this.selectors.push(element)
})
//create cursor
this.cursor=this.add.image(this.game.config.width*0.41,311,'UI',149).setScale(3)  
this.cursor.setData('position', 0)
this.cursor.setData('canMove', true)


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
          this.cursor.setData('position', 1)
        } else {
          this.cursor.setData('position', this.cursor.getData('position')-1)
        }
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
        if (this.cursor.getData('position')>=this.menuItems.length-1){
          this.cursor.setData('position', 0)
        } else {
          this.cursor.setData('position', this.cursor.getData('position')+1)
        }
      } 
      this.cursor.y=311+40*this.cursor.getData('position')
    }
 
    if (this.keySPACE.isDown){
      this.menuSelect.play()
     
      this.menuItems[this.cursor.getData('position')].onSelect()
    }
    

  }


  }


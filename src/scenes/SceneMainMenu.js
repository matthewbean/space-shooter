export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
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
    this.load.audio('the-longest-year', ['the-longest-year.wav']);  
  }
  create(data) {
    this.settings=JSON.parse(localStorage.getItem('settings')) ??{
      music:0,
      sfx:1,
      cameraShake:true
    }
    console.log(this.settings)
    //set up sound in music
    if (!data.music){
      this.theLongestYear= this.sound.add('the-longest-year', { volume:this.settings.music })
      this.theLongestYear.play({ loop:true })
  } else {
    this.theLongestYear=data.music
  }
    this.menuMove= this.sound.add('menu-move', { volume:this.settings.sfx })
    this.menuSelect= this.sound.add('menu-select', { volume:this.settings.sfx })
    //play music
    
    // this.scene.start('SceneMain');
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
this.title = this.add.text(this.game.config.width*0.5, 200, 'Space Battle', {fontSize: '72px',fontFamily: 'font1' }).setOrigin(0.5);
this.selectors=[]
//define menu items
this.menuItems=[{text:'Play', onSelect: ()=>{this.scene.start('SceneMain'); this.theLongestYear.stop()}},{text:'Settings', onSelect: ()=>this.scene.start('Settings', {music:this.theLongestYear})}]
//create menu items
this.menuItems.forEach((item, i)=>{
  let element= this.add.text(this.game.config.width*0.45, 300+40*i, item.text, {fontSize: '24px',  fontFamily: 'font1' }).setOrigin(0);
  this.selectors.push(element)
})
//create cursor
this.cursor=this.add.image(this.game.config.width*0.43,313,'UI',149).setScale(3)  
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
    }
 
    if (this.keySPACE.isDown){
      this.menuSelect.play()
      if (this.cursor.getData('position') === 0){
        this.theLongestYear.stop()
      }
      this.menuItems[this.cursor.getData('position')].onSelect()
    }
    this.cursor.y=313+40*this.cursor.getData('position')

  }


  }


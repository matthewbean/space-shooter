export default class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }
  preload(){
    

    this.loadingText = this.make.text({
      x: this.game.config.width / 2,
      y: this.game.config.height / 2 - 50,
      text: 'Loading...',
      style: {fontSize: `20px`, fontFamily: `font1`}
  }).setOrigin(0.5);

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(240, 270, 320, 50);
 
  this.load.on('progress', function (value) {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
  }.bind(this));
              


    
    this.load.spritesheet('background', 
      './assets/background.png',
      { frameWidth: 128, frameHeight: 256 }
    );  
    this.load.spritesheet('UI', 
      './assets/UI.png',
      { frameWidth: 8, frameHeight: 8 }
    );
    this.load.setPath('./assets/sounds')
    this.load.audio('menu-move', ['menu-move.mp3']);  
    this.load.audio('menu-select', ['menu-select.mp3']);  
    this.load.audio('the-longest-year', ['the-longest-year.mp3']);  
  }
  create(data) {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.loadingText.destroy();
    this.sound.stopByKey('soundtrack-main')
    this.sound.stopByKey('soundtrack-intro')

    this.settings=JSON.parse(localStorage.getItem('settings')) ??{
      music:1,
      sfx:1,
      autoFire: false,
      cameraShake:true
    }
    
    //set up sound in music
    if (!data.music){
      this.theLongestYear= this.sound.add('the-longest-year').setVolume(this.settings.music)
      this.theLongestYear.play({ loop:true })
  } else {
    this.theLongestYear=data.music
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
    //create controls
    this.keyW =  this.input.keyboard.addKey('W');
    this.keyS =  this.input.keyboard.addKey('S');
    this.keySPACE =  this.input.keyboard.addKey('SPACE');
    //create instructions
    this.add.text(20,20, `CONTROLS:`, {fontSize: `20px`, fontFamily: `font1`})
    this.add.text(20,50, `W/A/S/D: MOVEMENT`, {fontSize: `16px`, fontFamily: `font1`})
    this.add.text(20,80, `SPACE: SHOOT/SELECT`, {fontSize: `16px`, fontFamily: `font1`})
    //create title
this.title = this.add.text(this.game.config.width*0.5, 200, 'Galactor', {fontSize: '48px',fontFamily: 'font1' }).setOrigin(0.5);
this.selectors=[]
//define menu items
this.menuItems=[{text:'Play', onSelect: ()=>{this.scene.start('CharacterSelect');}},{text:'Settings', onSelect: ()=>this.scene.start('Settings', {music:this.theLongestYear})}]
//create menu items
this.menuItems.forEach((item, i)=>{
  let element= this.add.text(this.game.config.width*0.45, 300+40*i, item.text, {fontSize: '20px',  fontFamily: 'font1' }).setOrigin(0);
  this.selectors.push(element)
})
//create cursor
this.cursor=this.add.image(this.game.config.width*0.43,312,'UI',149).setScale(3)  
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
      this.cursor.y=312+40*this.cursor.getData('position')
    }
 
    if (this.keySPACE.isDown){
      this.menuSelect.play()
     
      this.menuItems[this.cursor.getData('position')].onSelect()
    }
    

  }


  }


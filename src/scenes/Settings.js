export default class Settings extends Phaser.Scene {
    constructor() {
      super({ key: 'Settings' });
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
      //set up sound in music
      this.theLongestYear= data.music

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
      this.keyA =  this.input.keyboard.addKey('A');
      this.keyD =  this.input.keyboard.addKey('D');
      this.keySPACE =  this.input.keyboard.addKey('SPACE');
      //create title
  this.title = this.add.text(this.game.config.width*0.5, 200, 'Settings', {fontSize: '48px',fontFamily: 'font1' }).setOrigin(0.5);
  this.selectors=[]
  this.selectorsValues=[]
  //function to change value of menu
  this.handleNumberChange= function(i){
    if (this.menuItems[i].displayValue>=10){
        this.menuItems[i].displayValue=0
        this.menuItems[i].value=0
        this.settings[this.menuItems[i].name]=this.menuItems[i].value
        } else {
        this.menuItems[i].displayValue++
        this.menuItems[i].value =Phaser.Math.RoundTo(this.menuItems[i].value+.1, -1)
        this.settings[this.menuItems[i].name]=this.menuItems[i].value
  }

  localStorage.setItem('settings',JSON.stringify(this.settings))    
}
  this.handleBooleanChange= function(i){
    this.menuItems[i].value= !this.menuItems[i].value
    this.menuItems[i].displayValue=this.menuItems[i].value?'ON':'OFF'
    this.settings[this.menuItems[i].name]=this.menuItems[i].value
    localStorage.setItem('settings',JSON.stringify(this.settings))
  }

  //set default menu values
  this.settings=JSON.parse(localStorage.getItem('settings')) ??{
    music:1,
    sfx:1,
    autoFire: false,
    cameraShake:true
  }
  console.log(this.settings)
  this.menuMove= this.sound.add('menu-move', { volume:this.settings.sfx })
  this.menuSelect= this.sound.add('menu-select', { volume:this.settings.sfx })
//define menu items
    this.menuItems= [{text:'Music:', name:'music', value:this.settings.music, displayValue:this.settings.music*10, onSelect: ()=>this.handleNumberChange(0)},
    {text:'SFX:', name:'sfx', value:this.settings.sfx, displayValue:this.settings.sfx*10, onSelect: ()=>this.handleNumberChange(1)},
    {text:'Auto Fire:', name:'autoFire', value:this.settings.autoFire, displayValue:this.settings.autoFire?'ON':'OFF', onSelect: ()=>this.handleBooleanChange(2)},
    {text:'Camera Shake:', name:'cameraShake', value:this.settings.cameraShake, displayValue:this.settings.cameraShake?'ON':'OFF', onSelect: ()=>this.handleBooleanChange(3)},
    {text:'Done', name:'done', value:null, displayValue:'', onSelect: ()=>{this.scene.start('SceneMainMenu',{music:data.music})}}
    ]
  console.log(this.menuItems)

  //create menu items
  
  this.menuItems.forEach((item, i)=>{
    let element= this.add.text(this.game.config.width*0.33, 250+40*i, item.text, {fontSize: '20px',  fontFamily: 'font1' }).setOrigin(0);
    this.selectors.push(element)
  })
  //create menu values
  this.menuItems.forEach((item, i)=>{
    let element= this.add.text(this.game.config.width*0.65, 250+40*i, item.displayValue, {fontSize: '20px',  fontFamily: 'font1' }).setOrigin(0);
    this.selectorsValues.push(element)
  })
  //create cursor
  this.cursor=this.add.image(this.game.config.width*0.30, 263,'UI',149).setScale(3)  
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
            this.cursor.setData('position', this.menuItems.length-1)
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
        if (this.keySPACE.isDown){
            this.cursor.setData('canMove', false)
          this.time.addEvent({
            delay: 200,
            callback: function () {
              this.cursor.setData('canMove',true)
            },
            callbackScope: this,
            loop: false,
          });
            this.menuItems[this.cursor.getData('position')].onSelect()
            this.theLongestYear.setVolume(this.settings.music)
            this.menuMove.setVolume(this.settings.sfx)
            this.menuSelect.setVolume(this.settings.sfx)
            this.menuSelect.play()
        }
        this.cursor.y=260+40*this.cursor.getData('position')
      this.selectorsValues.forEach((item, i)=>{
          item.text=this.menuItems[i].displayValue
      })
      }
   
      
      
  
    }
  
  
    }
  
  
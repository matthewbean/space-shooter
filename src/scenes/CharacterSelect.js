import Characters from '../utilities/Characters'
export default class CharacterSelect extends Phaser.Scene {
    constructor() {
      super({ key: 'CharacterSelect' });
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
    this.load.spritesheet('player-ships', 
      './assets/player-ships.png',
      { frameWidth: 8, frameHeight: 8 }
    );
    this.load.setPath('./assets/sounds')
    this.load.audio('menu-move', ['menu-move.wav']);  
    this.load.audio('menu-select', ['menu-select.wav']);  
    }
    create() {
        this.settings=JSON.parse(localStorage.getItem('settings')) ??{
            music:1,
            sfx:1,
            autoFire: false,
            cameraShake:true
          }
          this.menuMove= this.sound.add('menu-move', { volume:this.settings.sfx })
          this.menuSelect= this.sound.add('menu-select', { volume:this.settings.sfx })
          this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x000000}, fillStyle: { color: 0xFFFFFF } });
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
        this.keyD =  this.input.keyboard.addKey('D');
        this.keySPACE =  this.input.keyboard.addKey('SPACE');

        this.title = this.add.text(this.game.config.width*0.5, 200, 'Select Character', {fontSize: '48px',fontFamily: 'font1' }).setOrigin(0.5);
        this.characters=[]
        for (let i=1;i<=10;i+=3){
            let character= this.add.image(this.game.config.width*i*.09, 300, 'player-ships', i).setScale(5)
            this.characters.push(character)
        }
        
        this.cursor=this.add.image(this.game.config.width*0.09,350,'UI',138).setScale(3)  
        this.cursor.setData('position', 0)
        this.cursor.setData('canMove', true)
        this.stats=['Health:', 'Attack:', 'Speed:']
        this.statsLabels=[]

        this.stats.forEach((item, i)=>{
          this.statsLabels.push(this.add.text( this.game.config.width*0.45-40,393+25*i, item, {fontSize: '20px',fontFamily: 'font1' }).setOrigin(0))
        })
        
        this.graphics.setDepth(2)
        this.graphics.fillRect(this.game.config.width*0.45+60, 400, Characters[this.cursor.getData('position')].hp*10, 10);
        this.graphics.fillRect(this.game.config.width*0.45+60, 425, Characters[this.cursor.getData('position')].damage*40, 10);
        this.graphics.fillRect(this.game.config.width*0.45+60, 450, Characters[this.cursor.getData('position')].speed*15, 10);

    }
    update(){
        if (this.cursor.getData('canMove')){
          if (this.keyA.isDown) {
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
              this.cursor.setData('position', this.characters.length-1)
            } else {
              this.cursor.setData('position', this.cursor.getData('position')-1)
            }
            this.graphics.clear()
            this.graphics.fillRect(this.game.config.width*0.45+60, 400, Characters[this.cursor.getData('position')].hp*10, 10);
            this.graphics.fillRect(this.game.config.width*0.45+60, 425, Characters[this.cursor.getData('position')].damage*40, 10);
            this.graphics.fillRect(this.game.config.width*0.45+60, 450, Characters[this.cursor.getData('position')].speed*15, 10);

          } 
          else if (this.keyD.isDown){
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
            if (this.cursor.getData('position')>=this.characters.length-1){
              this.cursor.setData('position', 0)
            } else {
              this.cursor.setData('position', this.cursor.getData('position')+1)
            }
            this.graphics.clear()
            this.graphics.fillRect(this.game.config.width*0.45+60, 400, Characters[this.cursor.getData('position')].hp*10, 10);
            this.graphics.fillRect(this.game.config.width*0.45+60, 425, Characters[this.cursor.getData('position')].damage*40, 10);
            this.graphics.fillRect(this.game.config.width*0.45+60, 450, Characters[this.cursor.getData('position')].speed*15, 10);

          } 
          this.cursor.x=this.game.config.width*.09*(this.cursor.getData('position')*3+1)
        }
     
        if (this.keySPACE.isDown){
            this.menuSelect.play()
            
            this.scene.start('SceneMain', {character:{ship:this.cursor.getData('position'), laser:0}, weaponsOwned:[0,-1,-1,-1]})

          
        }
        
    
      }
  }
  
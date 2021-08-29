import Hud from './Hud';
export default class HP extends Hud {
    constructor(scene, x, y){
        super(scene, x, y, 'ui', 70);
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0x228B22 } });
        this.setScale(3)
        this.setDepth(1)
        this.scene.add.existing(this);
        this.hp= this.scene.player.hp;
        this.maxHP=this.hp
        this.repeat=this.hp-2
        this.average=(this.repeat*8+26)/this.maxHP
        for (let i=1; i <= this.repeat; i++){
            this.end= new Hud(scene, this.x+8*i, this.y, 'ui', 71).setScale(3).setDepth(1)            
        } 
        this.end= new Hud(scene, this.x+8+8*this.repeat, this.y, 'ui', 72).setScale(3).setDepth(1) 
    }
    update(){
        this.graphics.clear()
        this.hp= this.scene.player.hp;
        this.graphics.setDepth(2)
        this.graphics.fillRect(this.x-9, this.y-6, this.hp*this.average, 6);
    }
}
export default class Burner extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, frameStart, frameEnd, mirrored, scale){
        super(scene, x, y, 'misc', frameStart);
        this.scene = scene;
        this.setScale(scale)
        this.scene.add.existing(this);
        if (mirrored){
            this.angle=270
        } else {
            this.angle=90
        }

        this.anims.create({
            key: 'burner',
            frames: this.anims.generateFrameNumbers('misc', { start: frameStart, end: frameEnd }),
            frameRate: 10,
            repeat: -1
        });
    }
    update(x,y){
        this.anims.play('burner', true)
        
        this.x=x
        this.y=y
    }
}
export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, frameStart, frameEnd, scale){
        super(scene, x, y, 'misc', frameStart);
        this.scene = scene;
        this.setScale(scale)
        this.scene.add.existing(this);

      
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('misc', { start: frameStart, end: frameEnd }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.play('explosion', true)

        this.scene.time.delayedCall(800, this.destroy, [], this);
    }

}
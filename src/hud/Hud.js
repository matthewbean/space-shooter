import Phaser from 'phaser';
export default class Hud extends Phaser.GameObjects.Image {
    constructor(scene, x, y, key, frame){
        super(scene, x, y, key, frame);
        this.setDepth(1)
        this.scene = scene;
        this.scene.add.existing(this);   
    }
}
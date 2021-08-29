import Explosion from './Explosion'
export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type, frame, explosionFrames) {
    super(scene, x, y, key, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.explosionFrames=explosionFrames
    this.setData('type', type);
    this.setData('isDead', false);

  }
  damage(canDestroy, damage) {
    if (!this.getData('isDead')) {

      this.hp-= damage;
      if (this.hp <= 0) {
        new Explosion(this.scene, this.x, this.y, this.explosionFrames[0], this.explosionFrames[1], this.scale)
        if (this.reward){
        this.scene.money+=this.reward
        this.scene.moneyDisplay.text=`$${this.scene.money}`
        }
        
        this.setAngle(0);
        this.body.setVelocity(0, 0);
        if (this.shootTimer !== undefined) {
          if (this.shootTimer) {
            this.shootTimer.remove(false);
          }
        }
        if (this.spawnShipTimer !== undefined) {
          if (this.spawnShipTimer) {
            this.spawnShipTimer.remove(false);
          }
        }
        if (canDestroy) {
          this.destroy();
        } else {
          this.setVisible(false);
        }
        this.setData('isDead', true);
        if (this.cleanUp){
          this.cleanUp()
        }
      }
    }
  }
  flicker(){
    this.scene.tweens.add({
      targets: this,
      alpha: .3,
      ease: 'Cubic.easeOut',  
      duration: 3,
      repeat: 1,
      yoyo: true
    })
  }
}








import Entity from './Entities'
export default class CarrierShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'boss-ships', 'Boss1', 4, [99, 102]);
      this.hp = 1000;
      this.reward=750;
      this.angle = -90
      this.setScale(10)
      this.damageAmount=2
      this.movement = this.scene.plugins.get('rexmovetoplugin').add(this, {
        speed: 800,
      });
      this.shake = this.scene.plugins.get('rexshakepositionplugin').add(this, {
        // duration: 500,
        magnitudeMode: 0, // 0|'constant'|1|'decay'
    });


      
      this.fourCorners=()=>{
        this.shake.shake()
          this.shake.once('complete', function(){this.movement.moveTo(20, 20)
            this.movement.once('complete', function(){this.movement.moveTo(20, 600)
              this.movement.once('complete', function(){this.movement.moveTo(600, 20)
                  this.movement.once('complete', function(){this.movement.moveTo(600, 600)
                    console.log('done moving')
                }.bind(this))
              }.bind(this))
            }.bind(this))
        }.bind(this))}
      // this.behaviors=[(()=>this.movement.moveTo())]
      this.fourCorners()
    }
    onDestroy() {
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
    }
    
  }
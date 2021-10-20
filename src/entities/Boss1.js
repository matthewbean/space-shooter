import Entity from './Entities'
import EnemyLaser from './EnemyLaser'
var shuffle = require('lodash/shuffle');


export default class CarrierShip extends Entity {
    constructor(scene, x, y) {
      super(scene, x, y, 'boss-ships', 'Boss1', 4, [99, 102]);
      this.hp = 1000;
      this.reward=750;
      this.angle = -90
      this.setScale(8)
      this.damageAmount=2
      this.movement = this.scene.plugins.get('rexmovetoplugin').add(this, {
        speed: 800,
      });
      this.shake = this.scene.plugins.get('rexshakepositionplugin').add(this, {
        // duration: 500,
        magnitudeMode: 0, // 0|'constant'|1|'decay'
    });


    this.generatePositions=(items)=>{
      let positions=[]
      items.forEach((item)=>{
        switch (item) {
          case 0:
            positions.push([100,100])
            break;
          case 1:
            positions.push([700,100])
            break;
          case 2:
            positions.push([700,500])
            break;
          case 3:
            positions.push([100,500])
            break;
        }
      })
      return positions
    }
      this.cross=()=>{
        this.shake.shake()
        this.shake.once('complete', function(){this.movement.moveTo(100, 300)
          this.movement.once('complete', function(){this.movement.moveTo(400, 300)
            this.movement.once('complete', function(){this.movement.moveTo(400, 100)
                this.movement.once('complete', function(){this.movement.moveTo(400, 500)
                this.movement.once('complete', function(){
                  this.rest()
              }.bind(this))
            }.bind(this))
            }.bind(this))
          }.bind(this))
      }.bind(this))}
      
      this.fourCorners=()=>{
        let arr=[0,1,2,3]
        let positions=this.generatePositions(shuffle(arr))
        this.shake.shake()
          this.shake.once('complete', function(){this.movement.moveTo(...positions[0])
            this.movement.once('complete', function(){this.movement.moveTo(...positions[1])
              this.movement.once('complete', function(){this.movement.moveTo(...positions[2])
                  this.movement.once('complete', function(){this.movement.moveTo(...positions[3])
                  this.movement.once('complete', function(){
                    this.rest()
                }.bind(this))
              }.bind(this))
              }.bind(this))
            }.bind(this))
        }.bind(this))}
        this.behaviors=[()=>this.cross(), ()=>this.fourCorners()]
      this.rest= ()=>{
        this.movement.setSpeed(400)
        this.movement.moveTo(600, 300)
        this.movement.once('complete', function(){
          this.scene.time.addEvent({
            delay: 2000,
            callback: function () {
              this.movement.setSpeed(800)
              this.behaviors[(Phaser.Math.Between(0, this.behaviors.length-1))]()
            }.bind(this),
            callbackScope: this,
            loop: false,
          });
        }.bind(this))
      }
      this.rest()
      this.shootTimer = this.scene.time.addEvent({
        delay: 1000,
        callback: function () {
          var dx = this.scene.player.x - this.x;
          var dy = this.scene.player.y - this.y;
          
          var angle = Math.atan2(dy, dx);
          for (let i=-.03; i<=.03; i+=.03){
            var laser = new EnemyLaser(this.scene, this.x, this.y, Math.cos(angle*(i+1))*400, Math.sin(angle*(i+1))*400, 15, 0,3,2, this.damageAmount);
            laser.setScale(3)
            this.scene.enemyLasers.add(laser);
          }
  
        },
        callbackScope: this,
        loop: true,
      });
    }
    onDestroy() {
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
    }
    
  }
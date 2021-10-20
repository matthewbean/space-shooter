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
            positions.push([25,25])
            break;
          case 1:
            positions.push([775,25])
            break;
          case 2:
            positions.push([775,575])
            break;
          case 3:
            positions.push([25,575])
            break;
        }
      })
      return positions
    }
    this.generateAngles=(items)=>{
      let positions=[]
      items.forEach((item)=>{
        switch (item) {
          case 0:
            positions.push(0)
            break;
          case 1:
            positions.push(90)
            break;
          case 2:
            positions.push(180)
            break;
          case 3:
            positions.push(270)
            break;
        }
      })
      return positions
    }

    this.cross=()=>{
        this.shake.shake()
        this.shake.once('complete', function(){this.movement.moveTo(25, 300)
          this.movement.once('complete', function(){this.movement.moveTo(400, 300)
            this.movement.once('complete', function(){this.movement.moveTo(400, 25)
                this.movement.once('complete', function(){this.movement.moveTo(400, 575)
                this.movement.once('complete', function(){
                  this.rest()
              }.bind(this))
            }.bind(this))
            }.bind(this))
          }.bind(this))
    }.bind(this))}
      
    this.fourCorners=()=>{
      let arr=[0,1,2,3]
      let order=shuffle(arr)
      let positions=this.generatePositions(order)
      let angles= this.generateAngles(order)
      let counter=0
      let overlay = this.scene.add.image(this.x, this.y, 'corner').setScale(8)
      overlay.alpha=0
      var cornerTimer = this.scene.time.addEvent({
        delay: 350,
        callback: function(){
          overlay.alpha=0
          if (counter>=4){
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
          }.bind(this))
        } else {
          overlay.angle=angles[counter]
          overlay.alpha=1
        } 
        counter++
        },
        callbackScope: this,
        repeat: 4
      });

    }

  

    this.behaviors=[()=>this.cross(), ()=>this.fourCorners()]

    this.rest= ()=>{
        this.movement.setSpeed(400)
        this.movement.moveTo(600, 300)
        this.movement.once('complete', function(){
          this.movement.setSpeed(100)
          this.movement.moveTo(Phaser.Math.Between(500,700), Phaser.Math.Between(150,550))
          this.movement.once('complete', function(){
            this.movement.moveTo(Phaser.Math.Between(500,700), Phaser.Math.Between(150,500))
            this.movement.once('complete', function(){
              this.movement.setSpeed(800)
              this.behaviors[(Phaser.Math.Between(0, this.behaviors.length-1))]()
        }.bind(this))
        }.bind(this))
        }.bind(this))
    }
    
    this.rest()

    this.shootTimer = this.scene.time.addEvent({
        delay: 2000,
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
      if (this.restTimer !== undefined) {
        if (this.restTimer) {
          this.restTimer.remove(false);
        }
      }
      if (this.cornerTimer !== undefined) {
        if (this.cornerTimer) {
          this.cornerTimer.remove(false);
        }
      }
    }
    
  }
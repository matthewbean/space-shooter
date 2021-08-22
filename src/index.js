import Phaser from 'phaser'
import PhaserRaycaster from 'phaser-raycaster'
import SceneMain from './scenes/SceneMain'
import SceneGameOver from './scenes/SceneGameOver'
import SceneMainMenu from './scenes/SceneMainMenu'
var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: 'black',
    physics: {
      default: 'arcade',
      arcade:{
        debug: false
      },
      gravity: { x: 0, y: 0 },
    },
    scene: [SceneMainMenu, SceneMain, SceneGameOver],
    plugins: {
      scene: [
          {
              key: 'PhaserRaycaster',
              plugin: PhaserRaycaster,
              mapping: 'raycasterPlugin'
          }
      ]
  },
    pixelArt: true,
    roundPixels: false,
  };
  
export var game = new Phaser.Game(config);
  
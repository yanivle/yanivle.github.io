import { ResourceManager } from "./corona/core/resource_manager.mjs";
import { game_engine } from "./corona/core/game_engine.mjs";
import { ClearScreen } from "./corona/standard_systems/clear_screen.mjs";
import { SpriteRenderer } from "./corona/standard_systems/sprite_renderer.mjs";
import { MouseCursor } from "./corona/standard_systems/mouse_cursor.mjs";
import { ExpirationSystem } from "./corona/standard_systems/expiration_system.mjs";
import { TrailSystem } from "./corona/standard_systems/trail_system.mjs";
import { CardsSystem, FlipSystem } from "./custom_systems/cards_system.mjs";
import { PhysicsSystem } from "./corona/standard_systems/physics_system.mjs";
import { BoxCollisionSystem } from "./corona/standard_systems/box_collision_system.mjs";
import { FadeSystem } from "./corona/standard_systems/fade_system.mjs";
import { RotationSystem } from "./corona/standard_systems/rotation_system.mjs";
import { KeepOnScreenSystem } from "./custom_systems/keep_on_screen_system.mjs";
import { TextRenderer } from "./corona/standard_systems/text_renderer.mjs";
import { RenderedPathSystem } from "./corona/standard_systems/rendered_path_system.mjs";
import { RotationWiggleSystem } from "./corona/standard_systems/rotation_wiggle_system.mjs";
import { ElectricitySystem } from "./corona/standard_systems/electricity_system.mjs";
import { Debug } from "./corona/core/debug.mjs";
import { AttractorSystem } from "./corona/standard_systems/attractor_system.mjs";
import { ParticleSystemsSystem } from "./corona/standard_systems/particle_systems_system.mjs";
import { ResizingSystem } from "./corona/standard_systems/resizing_system.mjs";
import { AutoOrientationSystem } from "./corona/standard_systems/auto_orientation_system.mjs";
import { BackgroundSystem } from "./corona/standard_systems/background_system.mjs";
import { MenuScene } from "./scenes/menu_scene.mjs";
import { GameScene } from "./scenes/game_scene.mjs";
import { PositionWiggleSystem } from "./corona/standard_systems/position_wiggle_system.mjs";
import { SceneSwitchSystem } from "./corona/standard_systems/scene_switch_system.mjs";
import { RectRenderingSystem } from "./corona/standard_systems/RectRenderingSystem.mjs";

let resource_manager = new ResourceManager(
  // '/memory_game/assets/',
  '/assets/',
  'loading',
  () => { document.getElementById('main').style.display = 'block'; },
  false);
Debug.debugInConsole('resource_manager', resource_manager);

let cursorImage = resource_manager.loadImage('cursor.png');
let backgroundImage = resource_manager.loadImage('hospital.jpg');
const mouseGlowImage = resource_manager.loadImage('glow1.png');

const doctorImage = resource_manager.loadImage('doctor.png');
const speechBubbleImage = resource_manager.loadImage('speech_bubble.png');

resource_manager.loadFont('AvocadoCreamy', 'AvocadoCreamy.ttf');

game_engine.addScene('menu', new MenuScene());
game_engine.addScene('game', new GameScene());

function start() {
  game_engine.reset();
  game_engine.addSystem(new FadeSystem());
  game_engine.addSystem(new ParticleSystemsSystem());
  game_engine.addSystem(new RotationWiggleSystem());
  game_engine.addSystem(new PositionWiggleSystem());
  game_engine.addSystem(new RotationSystem());
  game_engine.addSystem(new AutoOrientationSystem());
  game_engine.addSystem(new BoxCollisionSystem());
  game_engine.addSystem(new AttractorSystem());
  game_engine.addSystem(new PhysicsSystem());
  game_engine.addSystem(new ResizingSystem());
  game_engine.addSystem(new KeepOnScreenSystem());
  game_engine.addSystem(new MouseCursor(cursorImage, [mouseGlowImage]));
  game_engine.addSystem(new TrailSystem());
  game_engine.addSystem(new FlipSystem());
  game_engine.addSystem(new ElectricitySystem());
  // game_engine.addSystem(new DoctorSystem(doctorImage, speechBubbleImage, '22px AvocadoCreamy', startActualGame));
  // Rendering
  game_engine.addSystem(new ClearScreen('white'));
  game_engine.addSystem(new BackgroundSystem(backgroundImage));
  game_engine.addSystem(new SpriteRenderer());
  // Everything that debugs needs to run after this
  game_engine.addSystem(new RenderedPathSystem());
  game_engine.addSystem(new TextRenderer());
  game_engine.addSystem(new RectRenderingSystem());

  game_engine.addSystem(new ExpirationSystem());
  game_engine.addSystem(new SceneSwitchSystem());

  game_engine.startScene('menu');

  // ParticleSystemsSystem.createParticleSystem(
  //   400,
  //   400,
  //   ParticleSystemsSystem.createParticlePrefabs(
  //     starImages,
  //     {
  //       particleLifetime: 1,
  //       trailColor: 'rgba(0, 255, 0, 0.2)',
  //       trailLength: 20,
  //       rotationsPerSecond: 2
  //     }),
  //   {
  //     particlesPerSecond: 100,
  //     emitterExpirationTime: 30,
  //     maxParticles: 50000,
  //     particleMaxVelocity: 10,
  //     g: 0.1
  //   });

  game_engine.run(1440, 900, { fullScreen: true, showEngineStats: true });
}
document.getElementById('start').addEventListener("click", start);

import { EntityProcessorSystem } from "../corona/ecs/entity_processor_system.mjs";
import { canvas } from "../corona/core/canvas.mjs";
import { PhysicsBody } from "../corona/components/base_components.mjs";
import { Rotation } from "../corona/components/base_components.mjs";
import { RotationWiggle } from "../corona/components/base_components.mjs";
import { SpriteRenderer } from "../corona/standard_systems/sprite_renderer.mjs";
import { Entity } from "../corona/ecs/entity.mjs";
import { Position } from "../corona/components/base_components.mjs";
import { RenderedText } from "../corona/components/base_components.mjs";
import { Attractor } from "../corona/components/base_components.mjs";
import { TextRenderer } from "../corona/standard_systems/text_renderer.mjs";
import { game_engine } from "../corona/core/game_engine.mjs";
import { Alpha, RenderedRect, Box } from "../corona/components/base_components.mjs";
import { FadeSystem } from "../corona/standard_systems/fade_system.mjs";
import { AnchorSystem } from "../corona/standard_systems/AnchorSystem.mjs";
import { SchedulingSystem } from "../corona/standard_systems/SchedulingSystem.mjs";
import { event_manager } from "../corona/core/EventManager.mjs";
import { sequencer } from "../corona/core/Sequencer.mjs";
import { mouse } from "../corona/core/game_engine.mjs";

export class StopSpeaking {
  constructor(timeOnScreen) {
    this.removeFromScreenAt = game_engine.now + timeOnScreen;
  }
}

export class DoctorSystem extends EntityProcessorSystem {
  constructor(doctorImage, speechBubbleImage, font) {
    super(StopSpeaking);

    this.sounds = {
      mumble: resource_manager.loadAudio('mumble'),
    };

    this.doctor = SpriteRenderer.addComponents(new Entity('doctor'), doctorImage, { x: 10000, y: 10000, layer: 0, width: 400, height: 400 })
      .addComponent(new PhysicsBody(0, 0, 0, 0, 0.3))
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 6, 0));

    this.speechBubble = SpriteRenderer.addComponents(new Entity(), speechBubbleImage, { x: 10000, y: 10000, layer: 0, width: 400, height: 400 })
      .addComponent(new Rotation(0))
      .addComponent(new RotationWiggle(1 / 20, 6, 0));
    AnchorSystem.anchor(this.speechBubble, this.doctor, 100, -300);

    this.text = TextRenderer.createRenderedText('', font, 10000, 10000, null, 'black', true)
      .addComponent(new PhysicsBody(0, 0, 0, 0, 0.3));
    AnchorSystem.anchor(this.text, this.doctor, 100, -330);
  }

  init() {
    this.schedulingSystem = game_engine.getSystemByType(SchedulingSystem);
  }

  speak(text, timeout = 15) {
    // let fadeScreen = new Entity()
    //   .addComponent(new Position(0, 0))
    //   .addComponent(new RenderedRect('black'))
    //   .addComponent(new Box(canvas.width, canvas.height, false));
    // FadeSystem.fadeOut(fadeScreen, timeout * 4);
    // fadeScreen.getComponent(Alpha).opacity = 0.5;

    this.sounds.mumble.play();

    let pos = this.doctor.getComponent(Position);
    pos.x = canvas.width + 100;
    pos.y = canvas.height / 2 + 200;
    this.doctor.addComponent(new Attractor(canvas.width / 2, canvas.height / 2 + 200, 0, 0.001, 0, 0.05))

    this.text.getComponent(RenderedText).text = text;

    new Entity().addComponent(new StopSpeaking(timeout));
  }

  goOffscreen() {
    this.doctor.addComponent(new Attractor(canvas.width * 2, canvas.height / 2 + 200, 0, 0.001, 0, 0.05));
  }

  processEntity(_dt, _entity, stopSpeaking) {
    if (mouse.pressed || game_engine.now >= stopSpeaking.removeFromScreenAt) {
      this.goOffscreen();
      _entity.scheduleDestruction();
      this.schedulingSystem.scheduleIn(() => {
        sequencer.notifyEnded('doctor');
      }, 0.5);
    }
  }

  // update() {
  // if (this.state == 1) {
  //   if (mouse.pressed) {
  //     this.goOffscreen();
  //     this.state = 2;
  //     this.startTime = game_engine.now;
  //   }
  // } else if (this.state == 2) {
  //   if (game_engine.now >= this.startTime + 0.2) {
  //     this.speak('Oh, and good luck!');
  //     this.state = 3;
  //   }
  // } else if (this.state == 3) {
  //   if (game_engine.now >= this.startTime + 1.2) {
  //     this.goOffscreen();
  //     this.state = 4;
  //   }
  // } else if (this.state == 4) {
  //   if (game_engine.now >= this.startTime + 1.2) {
  //     this.finishCb();
  //     this.state = 5;
  //   }
  // }
  // }

  //   init() {
  //     this.speak(`Dear hero!
  // Please help us fight the corona!
  // By finding 5 cards of the same kind
  // you will get valuable powerups!
  // Beware of the viruses though
  // and try to find get all powerups ASAP!


  // CLICK TO CONTINUE`);
  //     this.state = 1;
  //   }
}

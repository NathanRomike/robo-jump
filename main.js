var mainState = {
  preload: function() {

    game.load.image('robot', 'assets/robot.png');

    game.load.image('robot', 'assets/robot-jump.png');

    game.load.image('pipe', 'assets/pipe.png');
  },

  create: function() {
//    game.stage.backgroundColor = '#71c5cf';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.robot = game.add.sprite(100, 245, 'robot');

    game.physics.arcade.enable(this.robot);

    this.robot.body.gravity.y = 1000;

    this.robot.anchor.setTo(-0.2, 0.5);

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    spaceKey.onDown.add(this.jump, this);

    this.pipes = game.add.group();

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {
      font: "30px Arial", fill: "#ffffff"
    });
  },

  update: function() {
    if (this.robot.y < 0 || this.robot.y > 490) {
      this.restartGame();
    }

    if (this.robot.angle < 20) {
      this.robot.angle += 1;
    }

    game.physics.arcade.overlap(this.robot, this.pipes, this.hitPipe, null, this);
  },

  jump: function() {
    if (this.robot.alive == false) {
      return;
    }
    this.robot.body.velocity.y = -300;

    game.add.tween(this.robot).to({angle: -20}, 100).start();
  },

  addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');

    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i * 60 + 10);
      }
    }

    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function() {
    if (this.robot.alive == false) {
      return;
    }

    this.robot.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);
  },

  restartGame: function() {
    game.state.start('main');
  }
};

var game = new Phaser.Game(600, 490);

game.state.add('main', mainState);

game.state.start('main');

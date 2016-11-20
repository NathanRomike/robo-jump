var mainState = {
  preload: function() {
    game.load.image('robot', 'assets/robot.png');
    game.load.image('block', 'assets/block.png');
    game.load.image('background', 'assets/stars.jpg');
  },

  create: function() {
    game.add.tileSprite(0, 0, 1000, 600, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.robot = game.add.sprite(100, 245, 'robot');
    game.physics.arcade.enable(this.robot);
    this.robot.body.gravity.y = 1000;
    this.robot.anchor.setTo(-0.2, 0.5);
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    game.input.onDown.add(this.jump, this);
    this.blocks = game.add.group();
    this.timer = game.time.events.loop(1500, this.addRowOfBlocks, this);
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
    game.physics.arcade.overlap(this.robot, this.blocks, this.restartGame, null, this);
  },

  jump: function() {
    this.robot.body.velocity.y = -300;
    game.add.tween(this.robot).to({angle: -20}, 100).start();
  },

  addOneBlock: function(x, y) {
    var block = game.add.sprite(x, y, 'block');
    this.blocks.add(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -200;
    block.checkWorldBounds = true;
    block.outOfBoundsKill = true;
  },

  addRowOfBlocks: function() {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOneBlock(700, i * 60 + 10);
      }
    }

    this.score += 1;
    if (this.score - 2 > 0) {
      this.labelScore.text = this.score -2  ;
    }
  },

  restartGame: function() {
    game.state.start('main');
  }
};
var game = new Phaser.Game();

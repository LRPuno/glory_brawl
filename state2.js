brawl.state2=function(){};
brawl.state2.prototype= {
    preload: function (){
        game.load.image('sky', 'assets/sky2.png');
        game.load.image('ground', 'assets/platform2.png');
        game.load.image('testGround','assets/platformY.png');
        game.load.image('bullet', 'assets/bullets/bullet206.png');
        game.load.image('spikes', 'assets/spikes.png');
        game.load.image('invertedSpikes', 'assets/invertedSpikesTrue.png')
        game.load.image('wing','assets/wings.png');
        game.load.image('shield','assets/shield2.png');
        game.load.image('fallingSpike',"assets/newSpikes.png");
        game.load.image('enemy','assets/trumpface.png');
        game.load.image('invisibleSpikes','assets/invisibleFloorSpikes.png');
        game.load.spritesheet('dude', 'assets/white.png',47,50,19);
        game.load.spritesheet('fire','assets/spritefire.png',150,500);
        game.load.audio('musical', ['assets/destination-01.mp3']);
        game.load.audio('smack',['assets/smack-1.mp3']);
        //game.load.spritesheet('secondDude','assets/white.png',47,50,19);
    },
    create: function (){
        console.log("state2");
        //GENERAL MAP SETTINGS
        game.physics.startSystem(Phaser.Physics.ARCADE); // We're going to be using physics, so enable the Arcade Physics system

        
        //Adding Music Functions
        music = game.add.audio('musical');
        smack = game.add.audio('smack');

        //Background music entire game that loops.
        music.loopFull();

        //Visuals of the Game
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Scales our Game
        game.add.sprite(0, 0, 'sky');   // A simple background for our game

        //GROUND PLATFORM FOR MAP
        platforms = game.add.group(); // The platforms group contains the ground and the 2 ledges we can jump on
        platforms.enableBody = true; // We will enable physics for any object that is created in this group

        //MAJOR LEDGE (quantity: one)
        var groundThree = platforms.create(200, 300, 'ground');
        groundThree.body.immovable = true;
        groundThree.body.velocity.setTo(10,100);
        groundThree.body.collideWorldBounds=true;
        groundThree.body.bounce.set(.5);

        // MINOR LEDGES (MOVING; Quantity: 8)
        ledge = game.add.group();
        ledge.enableBody = true;
        game.physics.arcade.enable(ledge)

        //Ledges in loop for randomization.
        for (var i=0;i<8;i++) {
            var randomNumber=Math.floor((Math.random() * 798) + 1);
            var randomNumber2=Math.floor((Math.random() * 500) + 1);
            if (i<4) {
            var randomNumber3=Math.floor((Math.random() * 60) + 1);
            var randomNumber4=Math.floor((Math.random() * 60) + 1);
            }
            else if (i>=4) {
            var randomNumber3=Math.floor((Math.random() * 120) - 240);
            var randomNumber4=Math.floor((Math.random() * 60) - 120);
            }
            ledges=ledge.create(randomNumber,randomNumber2,'testGround');
            ledges.body.velocity.setTo(randomNumber3,randomNumber4);
            ledges.body.collideWorldBounds=true;
            ledges.body.bounce.set(.5);
        }

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

        // PLAYER 1 SETTINGS
        player = game.add.sprite(250, 250, 'dude');
        game.physics.arcade.enable(player); //enables physics for player 1
        player.body.bounce.y = 0;
        player.body.gravity.y = 200;
        player.body.collideWorldBounds = true;

        // PLAYER 1 - ANIMATIONS
        player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
        player.animations.add('right', [9,10,11,12,13,14,15], 10, true);

        //PIT OF FIRE (visual; non functional without Ground spikes)
        fire = game.add.group();
        fire.enableBody=true
        var newFire=fire.create(300,340,'fire');
        newFire.body.setSize(0,100);
        newFire.animations.add('move');
        newFire.animations.play('move',4,true);
        newFire.body.immovable=true;

        var newFireTwo=fire.create(100,340,'fire');
        newFireTwo.body.setSize(0,100);
        newFireTwo.animations.add('move');
        newFireTwo.animations.play('move',4,true);
        newFireTwo.body.immovable=true;

        var newFireThree=fire.create(0,340,'fire');
        newFireThree.body.setSize(0,100);
        newFireThree.animations.add('move');
        newFireThree.animations.play('move',4,true);
        newFireThree.body.immovable=true;

        var newFireFour=fire.create(500,340,'fire');
        newFireFour.body.setSize(0,100);
        newFireFour.animations.add('move');
        newFireFour.animations.play('move',4,true);
        newFireFour.body.immovable=true;

        var newFireFive=fire.create(650,340,'fire');
        newFireFive.body.setSize(0,100);
        newFireFive.animations.add('move');
        newFireFive.animations.play('move',4,true);
        newFireFive.body.immovable=true;

        var newFireSix=fire.create(400,340,'fire');
        newFireSix.body.setSize(0,100);
        newFireSix.animations.add('move');
        newFireSix.animations.play('move',4,true);
        newFireSix.body.immovable=true;

        var newFireSeven=fire.create(200,340,'fire');
        newFireSeven.body.setSize(0,100);
        newFireSeven.animations.add('move');
        newFireSeven.animations.play('move',4,true);
        newFireSeven.body.immovable=true;

        var newFireEight=fire.create(550,340,'fire');
        newFireEight.body.setSize(0,100);
        newFireEight.animations.add('move');
        newFireEight.animations.play('move',4,true);
        newFireEight.body.immovable=true;

        var newFireNine=fire.create(-10,340,'fire');
        newFireNine.body.setSize(0,100);
        newFireNine.animations.add('move');
        newFireNine.animations.play('move',4,true);
        newFireNine.body.immovable=true;
        
        // GROUND SPIKES (to give fire damage)
        spikes = game.add.group();
        spikes.enableBody = true;
        spikes.visible=false;
        var spikesTwo = spikes.create(300, game.world.height -50, 'invisibleSpikes');
        spikesTwo.body.immovable = true;

        //Invisible Spikes in the Ground to simulate being squished.
        var spikesThree=spikes.create(0,game.world.height-50,'invisibleSpikes')
        spikesThree.body.immovable=true;
        var spikesFour=spikes.create(515,game.world.height-50,'invisibleSpikes')
        spikesFour.body.immovable=true;

        // ROOF SPIKES
        roofSpikes=game.add.group();
        roofSpikes.enableBody=true;
        var invertedSpikes=roofSpikes.create(0,game.world.height-600,'invertedSpikes');
        invertedSpikes.scale.setTo(1,.25);
        invertedSpikes.body.immovable=true;

        // Trump Sprite, One outside so a Trump Sprite exists at the beginning of the game.

        enemy=game.add.group();
        enemy.enableBody=true;
        game.physics.arcade.enable(enemy);
        var randomNumber=Math.floor((Math.random() * 700) + 1);
        var trumpImage=enemy.create(randomNumber,game.world.height-600,'enemy');
        trumpImage.body.bounce.y = .8;// 0.7 + Math.random() * 0.2;
        trumpImage.body.bounce.x = .8;
        trumpImage.body.gravity.y=10;
        trumpImage.body.collideWorldBounds = true;
        trumpImage.body.velocity.x = 200;

        //Timer for Item and Spike Generation
        
        game.time.events.repeat(Phaser.Timer.SECOND * 30,2, itemGenerator, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 7,10000, spikesFalling, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 15,6, trumpGenerator, this);
        

        function trumpGenerator () {
            var randomNumber=Math.floor((Math.random() * 700) + 1);
            var trumpImage=enemy.create(randomNumber,game.world.height-600,'enemy');
            trumpImage.body.bounce.y = .8;// 0.7 + Math.random() * 0.2;
            trumpImage.body.bounce.x = .8;
            trumpImage.body.gravity.y=10;
            trumpImage.body.collideWorldBounds = true;
            trumpImage.body.velocity.x = 200;
        }

        //To randomly generate items.
        function itemGenerator() {
            //Subject to change
            wing = game.add.group();
            shield = game.add.group();

            //enable physics
            wing.enableBody = true;
            shield.enableBody = true;

            wing.collideWorldBounds=true;
            shield.collideWorldBounds=true;

            for (var i = 0; i < 2; i++)
            {
            var randomNumberX=Math.floor((Math.random() * 2) + 1);

            if (randomNumberX===1) {
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                var shields = shield.create(randomNumber, game.world.height-600, 'shield');
                shields.body.gravity.y = 300;
                shields.body.bounce.y = 0.7 + Math.random() * 0.2; //  This just gives each stun a slightly random bounce value
            }

            else if (randomNumberX===2) {
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                var wings = wing.create(randomNumber, game.world.height-600, 'wing');
                wings.body.gravity.y = 300;
                wings.body.bounce.y = 0.7 + Math.random() * 0.2;
            }
            }
        }

        function spikesFalling () {
            fallingSpikes= game.add.group();
            fallingSpikes.enableBody = true;
            fallingSpikes.collideWorldBounds=true;

            for (var i=0;i<3;i++) {
            var randomNumber=Math.floor((Math.random() * 700) + 1);
            var spikeFall = fallingSpikes.create(randomNumber, game.world.height-600, 'fallingSpike');
            spikeFall.body.gravity.y = 300;
            }
        }

        //Timer to Keep Track of Score//  Create our Timer

        
        timer = game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
        timer.loop(1000, updateCounter, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();
        
        
    },
    update: function (){
            //  Collide the player and the stars with the platforms
        var hitPlatform = game.physics.arcade.collide(player, platforms);
        var hitLedge=game.physics.arcade.collide(player,ledge, platformMover);
        game.physics.arcade.collide(wing, ledge);
        game.physics.arcade.collide(shield, ledge);
        game.physics.arcade.collide(enemy,ledge);
        game.physics.arcade.collide(enemy,spikes);
        game.physics.arcade.collide(wing, platforms);
        game.physics.arcade.collide(shield, platforms);
        game.physics.arcade.collide(enemy,platforms);

        //Checks to see if overlap in assets.
        //game.physics.arcade.overlap(weapon.bullets, platforms, bulletHitPlatform, null, this);
        game.physics.arcade.overlap(player, enemy, deathOne, null, this);
        game.physics.arcade.overlap(player, spikes, deathOne, null, this);
        game.physics.arcade.overlap(player, roofSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, fallingSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, shield, runFaster, null, this);
        game.physics.arcade.overlap(player, wing, jumpHigher, null, this);
        
        game.physics.arcade.overlap(wing, spikes, deathTwo, null, this);
        game.physics.arcade.overlap(shield, spikes, deathTwo, null, this);
        
        game.physics.arcade.overlap(fallingSpikes, ledge, deathTwo, null, this);
        game.physics.arcade.overlap(fallingSpikes, platforms, deathTwo, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -200;
            player.animations.play('left');

            if (runFastX) {
                player.body.velocity.x = -400;
                player.animations.play('left');
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
            player.animations.play('right');

            if (runFastX) {
                player.body.velocity.x = 400;
                player.animations.play('right');
            }
        }

        // Function when you want to descend
        else if (cursors.down.isDown) {

                player.body.velocity.y = 200;

        }
        
        else
        {
            //  Stand still
            player.animations.stop();
            player.frame = 8;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && (hitPlatform || hitLedge))
        {
            player.body.velocity.y = -250;
            if (jumpHigherX) {
                player.body.velocity.y = -425;
            }
        }


    },

    render: function () {
        game.debug.text('Survived For: ' + total, 32, 64);
    }
    
    
    
};

//Event Handlers

function runFaster (player,shield) {
    runFastX=true;
    shield.kill();
}

function jumpHigher (player,wing) {
    jumpHigherX=true;
    wing.kill();
}

//Platfrom Moving Mechanics
function platformMover (player,ledge) {
  if (ledge.body.touching.left) {
    ledge.body.velocity.x = 600;
  }
  else if (ledge.body.touching.right) {
    ledge.body.velocity.x = -600;
  }
  else if (ledge.body.touching.up) {
    ledge.body.velocity.y = 150;
  }
  else if (ledge.body.touching.down) {
    ledge.body.velocity.y=-300;
  }
  smack.play();
}

//Removing Elements
function deathOne(victim, killer) {
  victim.kill();
  game.state.start('state3');
}

function deathTwo(victim,killer) {
  victim.kill();
}

//Timer Elements
function updateCounter() {
    total++;
}










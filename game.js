var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {

    game.load.image('sky', 'assets/sky2.png');
    game.load.image('ground', 'assets/platform2.png');
    game.load.image('testGround','assets/platformX.png');
    game.load.image('star', 'assets/diamond.png');
    game.load.image('bullet', 'assets/bullets/bullet08.png');
    game.load.image('spikes', 'assets/spikes.png');
    game.load.image('invertedSpikes', 'assets/invertedSpikes.png')
    game.load.image('knife','assets/trueKnife.png');
    game.load.image('crowbar','assets/crowbar.png');
    game.load.image('shield','assets/shield.png');
    game.load.image('fallingSpike',"assets/newSpikes.png");
    game.load.spritesheet('dude', 'assets/orangefight.png',47,50,19);
    //game.load.spritesheet('secondDude','assets/white.png',47,50,17);
    game.load.spritesheet('fire','assets/spritefire.png',150,500);
    game.load.spritesheet('enemy','assets/trumpface.png');

}

var player;
var enemy;
var platforms;
var ledge;
var cursors;


var knife;
var crowbar;
var shield;
var runFastX=false;


var spikes;
var roofSpikes;
var fire;
var fallingSpikes;




function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Scales our Game
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the first part of the ground.
    var groundOne = platforms.create(-100, game.world.height - 30, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    groundOne.scale.setTo(1, 1);

    //  This stops it from falling away when you jump on it
    groundOne.body.immovable = true;

    // Here we create the second part of the ground.
    var groundTwo = platforms.create(500, game.world.height - 30, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    groundTwo.scale.setTo(1, 1);

    //  This stops it from falling away when you jump on it
    groundTwo.body.immovable = true;

    var groundThree = platforms.create(200, 350, 'ground');
    groundThree.body.immovable = true; //Only Immovable groundThree ATM
    groundThree.body.velocity.setTo(50,50);
    groundThree.body.collideWorldBounds=true;
    groundThree.body.bounce.set(.5);

    /*
    var groundFour = platforms.create(300, 50, 'ground');
    groundFour.body.immovable = true; //Only Immovable groundFour ATM
    groundFour.body.velocity.setTo(-50,50);
    groundFour.body.collideWorldBounds=true;
    groundFour.body.bounce.set(.5);
    */



// This gets it movingplatform.body.velocity.setTo(200,200);// This makes the game world bounce-ableplatform.body.collideWorldBounds = true;// This sets the image bounce energy for the horizontal // and vertical vectors. "1" is 100% energy returnplatform.body.bounce.set(1); 

    //  We will enable physics for any object that is created in this group. Moving Ledges
    ledge = game.add.group();

    ledge.enableBody = true;

    game.physics.arcade.enable(ledge)

    ledges=ledge.create(300,150,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(100,200,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(60,300,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(20,55,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(150,120,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(40,80,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    ledges=ledge.create(90,40,'testGround');
    ledges.body.velocity.setTo(60,60);
    ledges.body.collideWorldBounds=true;
    ledges.body.bounce.set(.5);

    // The player and its settings
    player = game.add.sprite(0, game.world.height - 140, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 200;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.

    player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
    player.animations.add('right', [9,10,11,12,13,14,15], 10, true);
    


    //Adding Fire

    fire = game.add.group();
    fire.enableBody=true
    var newFire=fire.create(300,340,'fire');
    newFire.body.setSize(0,100);
    newFire.animations.add('move');
    newFire.animations.play('move',4,true);
    newFire.body.immovable=true;


    // Adding Ground Spikes (which are the invisible hitbox of the fire)

    //  
    spikes = game.add.group();

    //  
    spikes.enableBody = true;

    var spikesTwo = spikes.create(350, game.world.height -40, 'spikes');

    //  
    spikesTwo.scale.setTo(.75, .25);

    //  
    spikesTwo.body.immovable = true;

    spikes.visible=false;


    // Adding Roof Spikes

    roofSpikes=game.add.group();
    roofSpikes.enableBody=true;
    var invertedSpikes=roofSpikes.create(0,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(120,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(240,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(360,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(480,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(600,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;

    invertedSpikes=roofSpikes.create(700,game.world.height-600,'invertedSpikes');
    invertedSpikes.scale.setTo(1,.25);
    invertedSpikes.body.immovable=true;




    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    // Weapon Creation
    //  Creates 30 bullets, using the 'bullet' graphic

        
        weapon = game.add.weapon(200, 'bullet');

        game.physics.arcade.enable(weapon);

        //  The bullet will be automatically killed when it leaves the world bounds
        
        //weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        weapon.bulletKillDistance = 20;

        //  Because our bullet is drawn facing up, we need to offset its rotation:
        weapon.bulletAngleOffset = 0;

        //
        weapon.fireAngle=0;

        //  The speed at which the bullet is fired
        weapon.bulletSpeed = 100;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        weapon.fireRate = 10;

        //  Add a variance to the bullet speed by +- this value
        weapon.bulletSpeedVariance = 150;

        //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
        weapon.trackSprite(player, 30, 20);

        // Give weapons physical properties
        weapon.enableBody=true;
        weapon.physicsBodyType= Phaser.Physics.ARCADE;

        fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);


       
 

    // Trump Sprite

    

  
    enemy=game.add.sprite(200,270,'enemy');
    game.physics.arcade.enable(enemy);
    enemy.enableBody = true;
    enemy.body.bounce.y = 1;// 0.7 + Math.random() * 0.2;
    enemy.body.bounce.x = 1;
    enemy.body.gravity.y=20;
    enemy.body.collideWorldBounds = true;
    enemy.body.velocity.x = 200;

    


 
    //To randomly generate items.
    function itemGenerator() {
        
        //Subject to change
        knife = game.add.group();
        crowbar = game.add.group();
        shield = game.add.group();

        //  We will enable physics for any star that is created in this group
        knife.enableBody = true;
        crowbar.enableBody = true;
        shield.enableBody = true;

        knife.collideWorldBounds=true;
        crowbar.collideWorldBounds=true;
        shield.collideWorldBounds=true;

        //  Here we'll create 3 of them at random.
        for (var i = 0; i < 3; i++)
        {
            var randomNumberX=Math.floor((Math.random() * 3) + 1);
            
            if (randomNumberX===1) {
                //Random Number
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                //  Create a star inside of the 'stars' group
                var shields = shield.create(randomNumber, game.world.height-600, 'shield');

                //  Let gravity do its thing
                shields.body.gravity.y = 300;

                //  This just gives each shields a slightly random bounce value
                shields.body.bounce.y = 0.7 + Math.random() * 0.2;
            }

            if (randomNumberX===2) {
                //Random Number
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                //  Create a star inside of the 'stars' group
                var knives = knife.create(randomNumber, game.world.height-600, 'knife');
        
                //  Let gravity do its thing
                knives.body.gravity.y = 300;
        
                //  This just gives each star a slightly random bounce value
                knives.body.bounce.y = 0.7 + Math.random() * 0.2;
            }

            if (randomNumberX===3) {
                //Random Number
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                //  Create a star inside of the 'stars' group
                var crowbars = crowbar.create(randomNumber, game.world.height-600, 'crowbar');
        
                //  Let gravity do its thing
                crowbars.body.gravity.y = 300;
        
                //  This just gives each knife a slightly random bounce value
                crowbars.body.bounce.y = 0.7 + Math.random() * 0.2;
            }
        }
    }

  function spikesFalling () {
    fallingSpikes= game.add.group();
    fallingSpikes.enableBody = true;
    fallingSpikes.collideWorldBounds=true;

    for (var i=0;i<3;i++) {
        var randomNumber=Math.floor((Math.random() * 700) + 1);
        //  Create a star inside of the 'stars' group
        var spikeFall = fallingSpikes.create(randomNumber, game.world.height-600, 'fallingSpike');

        //  Let gravity do its thing
        spikeFall.body.gravity.y = 300;

    }
  }

  //Timer for Item and Spike Generation
  setInterval(itemGenerator,10000);
  setInterval(spikesFalling,7000);

    
}



function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    var hitLedge=game.physics.arcade.collide(player,ledge, platformMover);
    game.physics.arcade.collide(knife, ledge);
    //game.physics.arcade.collide(platforms, platforms);
    game.physics.arcade.collide(crowbar, ledge);
    game.physics.arcade.collide(shield, ledge);
    game.physics.arcade.collide(enemy,ledge);
    game.physics.arcade.collide(enemy,spikes);
    game.physics.arcade.collide(ledge,spikes);
    game.physics.arcade.collide(platforms,spikes)
    game.physics.arcade.collide(knife, platforms);
    //game.physics.arcade.collide(platforms, platforms);
    game.physics.arcade.collide(crowbar, platforms);
    game.physics.arcade.collide(shield, platforms);
    game.physics.arcade.collide(enemy,platforms);

    //  Checks to see if overlap in assets.
    //game.physics.arcade.overlap(weapon.bullets, platforms, bulletHitPlatform, null, this);
    game.physics.arcade.overlap(weapon.bullets, knife, killItemRange, null, this);
    game.physics.arcade.overlap(player, spikes, playerDeath, null, this);
    game.physics.arcade.overlap(player, roofSpikes, playerDeathTwo, null, this);
    game.physics.arcade.overlap(player,fallingSpikes,fallingSpikeDeath,null, this);
    game.physics.arcade.overlap(player,knife, runFaster,null, this);
    game.physics.arcade.overlap(spikes, knife, killKnife, null, this);
    game.physics.arcade.overlap(spikes, crowbar, killCrowbar, null, this);
    game.physics.arcade.overlap(spikes, shield, killShield, null, this);
    game.physics.arcade.overlap(fallingSpikes, ledge, fallingSpikeDeathTwo, null, this);
    game.physics.arcade.overlap(fallingSpikes, platforms, fallingSpikeDeathThree, null, this);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -200;

        player.animations.play('left');

        weapon.fireAngle=-180;

        if (runFastX) {
            player.body.velocity.x = -500;

            player.animations.play('left');

            weapon.fireAngle=-180;
        }

        
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 200;

        player.animations.play('right');

        weapon.fireAngle=0;

        if (runFastX) {
            player.body.velocity.x = 500;

            player.animations.play('right');

            weapon.fireAngle=0;
        }

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
        player.body.velocity.y = -300;

    }

    
    if (fireButton.isDown)
    {
        
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -90;
            player.frame=17;
            weapon.fire();
            weapon.fireAngle=-180;

            
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 90;
            player.frame=18;
            weapon.fire();
            weapon.fireAngle=0;

        }
    }
    
    


}



//Knife, Crowbar, Shield Functions
function killKnife(spikes,knife) {
    knife.kill();
}

function killCrowbar (spikes,crowbar) {
    crowbar.kill();
}

function killShield (spikes,shield) {
    shield.kill();
}

//Player Weapon Handlers
function killItemRange (weapon,knife) {
    knife.kill();
}

function runFaster (player,knife) {
    runFastX=true;
    knife.kill();
}

// Platform Movement

function platformMover (player,ledge) {
    if (ledge.body.touching.left) {
        ledge.body.velocity.x = 450;
    }
    else if (ledge.body.touching.right) {
        ledge.body.velocity.x = -450;
    }
    
    else if (ledge.body.touching.up) {
        ledge.body.velocity.y = -50;
    }

    
    else if (ledge.body.touching.down) {
        ledge.body.velocity.y=-300;
    }
    
}


function playerDeath (player,spikes) {
    player.kill();
}

function playerDeathTwo (player,roofSpikes) {
    player.kill();
}

//Function for Falling Spikes

function fallingSpikeDeath (player,fallingSpikes) {
    player.kill();
}

function fallingSpikeDeathTwo (fallingSpikes,ledge) {
    fallingSpikes.kill();
}

function fallingSpikeDeathThree (fallingSpikes,platforms) {
    fallingSpikes.kill();
}




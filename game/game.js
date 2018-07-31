var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-holder', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky2.gif');
    game.load.image('ground', 'assets/platform2.png');
    game.load.image('star', 'assets/diamond.png');
    game.load.image('bullet', 'assets/bullets/bullet08.png');
    game.load.image('spikes', 'assets/spikes.png')
    game.load.image('invertedSpikes', 'assets/invertedSpikes.png')
    game.load.spritesheet('dude', 'assets/metalslug.png', 37, 45, 18);

}

var player;
var platforms;
var cursors;

var stars;
var weapons;
var spikes;
var roofSpikes;


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the first part of the ground.
    var groundOne = platforms.create(-100, game.world.height - 35, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    groundOne.scale.setTo(1, 1);

    //  This stops it from falling away when you jump on it
    groundOne.body.immovable = true;

    // Here we create the second part of the ground.
    var groundTwo = platforms.create(500, game.world.height - 35, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    groundTwo.scale.setTo(1, 1);

    //  This stops it from falling away when you jump on it
    groundTwo.body.immovable = true;




    //  Now let's create two ledges
    var ledge = platforms.create(400, 350, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(0, 350, 'ground');
    ledge.body.immovable = true;

    ledge=platforms.create(0,150,'ground');
    ledge.body.immovable = true;

    ledge=platforms.create(400,150,'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(0, game.world.height - 500, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 100;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 50; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // Adding Ground Spikes

    //  
    spikes = game.add.group();

    //  
    spikes.enableBody = true;

    // 
    var spikesOne = spikes.create(295, game.world.height -25, 'spikes');

    //  
    spikesOne.scale.setTo(1.5, .25);

    //  
    spikesOne.body.immovable = true;

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
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 0;

    //
    weapon.fireAngle=0;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 10;

    //  Add a variance to the bullet speed by +- this value
    weapon.bulletSpeedVariance = 150;

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(player, 30, 15);

    // Give weapons physical properties
    weapon.enableBody=true;
    weapon.physicsBodyType= Phaser.Physics.ARCADE;

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    
}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(stars,spikes);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(weapon.bullets, stars, killStar, null, this);
    game.physics.arcade.overlap(weapon.bullets, platforms, bulletHitPlatform, null, this);
    game.physics.arcade.overlap(player, spikes, playerDeath, null, this);
    game.physics.arcade.overlap(player, roofSpikes, playerDeathTwo, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -100;

        player.animations.play('left');

        weapon.fireAngle=-180;
        
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 100;

        player.animations.play('right');

        weapon.fireAngle=0;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        weapon.fireAngle=-90;
        player.body.velocity.y = -300;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

    if (stars===0) {
            for (var i = 0; i < 50; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    }


}


function killStar (weapon,star) {
    star.kill();
    
}

function bulletHitPlatform (weapon,platforms) {
   weapon.kill();
}

function playerDeath (player,spikes) {
    player.kill();
}

function playerDeathTwo (player,roofSpikes) {
    player.kill();
}
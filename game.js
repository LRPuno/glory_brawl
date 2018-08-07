var player, player2, enemy, platforms, ledge, cursors, stun, wing, shield, spikes, roofSpikes, fire, fallingSpikes, userOut, userIn, positionX, positionX2, facing, facingTwo, jumpTimer, jumpTimerTwo, p1WeaponAngle, p2WeaponAngle;
var runFastX = false, jumpHigherX = false, stunGunWeapon = false;

//-------------------------------------------------------Firebase Initialization Module---------------------------------------------------------------

var config = {
  apiKey: "AIzaSyCo-BksCXLjbvyAkl462_8tpQeIVoRHyqk",
  authDomain: "glory-brawl.firebaseapp.com",
  databaseURL: "https://glory-brawl.firebaseio.com",
  projectId: "glory-brawl",
  storageBucket: "glory-brawl.appspot.com",
  messagingSenderId: "293343815413"
};

firebase.initializeApp(config);

var database = firebase.database();

//--------------------------------------------------------Firebase Authorization Module----------------------------------------------------------------
var auth = firebase.auth();
var uid, p1, p2;

auth.signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    uid = user.uid;

    firebase.database().ref().once("value").then(function(snapshot) {
      var data = snapshot;
      if(data.child("playerOne").val() === "empty" || data.child("playerOne").val() === uid) { database.ref().update({ playerOne:uid }); p1 = true;}
      else if(data.child("playerTwo").val() === "empty" || data.child("playerTwo").val() === uid) { database.ref().update({ playerTwo:uid }); p2 = true;}
      else { alert("The room is full, SPECTATOR MODE"); }
    });

  } else {
    // When User Signsout or closes window
  }
});

//Server Initialization
firebase.database().ref().once("value").then(function(snapshot) {

  var temp = snapshot;
  userIn = temp.child("numberOfUsers").val();
  userOut = userIn;
  userIn += 1;
  //server default values
  database.ref().update({
    jumpTime: 0,
    facings: 'left',
    posX: 0,
    playerOneWA: 0,
    numberOfUsers: userIn,
    posX2: 765,
    facings2: 'left',
    jumpTime2: 0,
    playerTwoWA: -180
  });
});

//caches database if it changes (faster loads for .once)
database.ref().on("value", function(snapshot){
});

//main server update() to sync server values with client values
var serverUpdate = setInterval(function() {
  database.ref().once("value", function(snapshot) {
    data = snapshot;
    userIn = data.child("numberOfUsers").val();
    //player1
    positionX = data.child("posX").val();
    facing = data.child("facings").val();
    jumpTimer = data.child("jumpTime").val();
    p1WeaponAngle = data.child("playerOneWA").val();

    //player2
    positionXTwo = data.child("posX2").val();
    facingTwo = data.child("facings2").val();
    jumpTimerTwo = data.child("jumpTime2").val();
    p2WeaponAngle = data.child("playerTwoWA").val();
  });
}, 15);

///////////////////////////////////////////////////////////////////////////////////////////////VARIABLE DECLARATIONS / PREGAME////////////////////////////////////////////////////////////////////////////////

var game;

function startGame() {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
}

////////////////////////////////////////////////////////////////PHASER 2 GAME (GLORY_BRAWL)////////////////////////////////////////////////////////////////
function preload() {
    game.load.image('sky', 'assets/sky2.png');
    game.load.image('ground', 'assets/platform2.png');
    game.load.image('testGround','assets/platformY.png');
    game.load.image('star', 'assets/diamond.png');
    game.load.image('bullet', 'assets/bullets/bullet206.png');
    game.load.image('spikes', 'assets/spikes.png');
    game.load.image('invertedSpikes', 'assets/invertedSpikesTrue.png')
    game.load.image('stun','assets/stungun.png');
    game.load.image('wing','assets/wings.png');
    game.load.image('shield','assets/shield2.png');
    game.load.image('fallingSpike',"assets/newSpikes.png");
    game.load.image('enemy','assets/trumpface.png');
    game.load.spritesheet('dude', 'assets/orangefight.png',47,50,19);
    game.load.spritesheet('fire','assets/spritefire.png',150,500);
    game.load.image('invisibleSpikes','assets/invisibleFloorSpikes.png');
    game.load.spritesheet('secondDude','assets/whiteStab.png',47,50,19);
}

function create() {

  //GENERAL MAP SETTINGS
  game.physics.startSystem(Phaser.Physics.ARCADE); // We're going to be using physics, so enable the Arcade Physics system
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Scales our Game
  game.add.sprite(0, 0, 'sky');   // A simple background for our game

  //GROUND PLATFORM FOR MAP
  platforms = game.add.group(); // The platforms group contains the ground and the 2 ledges we can jump on
  platforms.enableBody = true; // We will enable physics for any object that is created in this group
  var groundOne = platforms.create(-100, game.world.height - 30, 'ground'); // Here we create the first part of the ground.
  groundOne.scale.setTo(1, 1); // Scale it to fit the width of the game (the original sprite is 400x32 in size)
  groundOne.body.immovable = true; //  This stops it from falling away when you jump on it

  var groundTwo = platforms.create(500, game.world.height - 30, 'ground');
  groundTwo.scale.setTo(1, 1);
  groundTwo.body.immovable = true;

  //MAJOR LEDGE (quantity: one)
  var randomNumber=Math.floor((Math.random() * 798) + 1);
  var randomNumber2=Math.floor((Math.random() * 500) + 1);
  var groundThree = platforms.create(randomNumber, randomNumber2, 'ground');
  groundThree.body.immovable = true;
  groundThree.body.velocity.setTo(70,60);
  groundThree.body.collideWorldBounds=true;
  groundThree.body.bounce.set(.5);

  /*
  var groundFour = platforms.create(300, 50, 'ground');
  groundFour.body.immovable = true; //Only Immovable groundFour ATM
  groundFour.body.velocity.setTo(-50,50);
  groundFour.body.collideWorldBounds=true;
  groundFour.body.bounce.set(.5);
  */

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
      var randomNumber3=Math.floor((Math.random() * 60) - 120);
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
  player = game.add.sprite(0, game.world.height - 140, 'dude');
  game.physics.arcade.enable(player); //enables physics for player 1
  // player.body.bounce.y = 0;
  player.body.gravity.y = 200;
  player.body.collideWorldBounds = true;

  // PLAYER 1 - ANIMATIONS
  player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
  player.animations.add('right', [9,10,11,12,13,14,15], 10, true);

  // PLAYER 2 SETTINGS
  player2 = game.add.sprite(800, game.world.height - 140, 'secondDude');
  game.physics.arcade.enable(player2); //enables physics for player 2
  // player2.body.bounce.y = 0;
  player2.body.gravity.y = 200;
  player2.body.collideWorldBounds = true;

  // PLAYER 2 - ANIMATIONS
  player2.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
  player2.animations.add('right', [9,10,11,12,13,14,15], 10, true);

  //PIT OF FIRE (visual; non functional without Ground spikes)
  fire = game.add.group();
  fire.enableBody=true
  var newFire=fire.create(300,340,'fire');
  newFire.body.setSize(0,100);
  newFire.animations.add('move');
  newFire.animations.play('move',4,true);
  newFire.body.immovable=true;

  // GROUND SPIKES (to give fire damage)
  spikes = game.add.group();
  spikes.enableBody = true;
  var spikesTwo = spikes.create(350, game.world.height -40, 'spikes');
  spikesTwo.scale.setTo(.75, .25);
  spikesTwo.body.immovable = true;
  spikes.visible=false;

  //Invisible Spikes in the Ground to simulate being squished.
  var spikesThree=spikes.create(0,game.world.height-10,'invisibleSpikes')
  spikesThree.body.immovable=true;
  var spikesFour=spikes.create(515,game.world.height-10,'invisibleSpikes')
  spikesFour.body.immovable=true;

  // ROOF SPIKES
  roofSpikes=game.add.group();
  roofSpikes.enableBody=true;
  var invertedSpikes=roofSpikes.create(0,game.world.height-600,'invertedSpikes');
  invertedSpikes.scale.setTo(1,.25);
  invertedSpikes.body.immovable=true;

  // Weapon Creation, Creates 30 bullets, using the 'bullet' graphic, The bullet will be automatically killed when it leaves the world bounds
  weapon = game.add.weapon(200, 'bullet');
  game.physics.arcade.enable(weapon);

  //weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
  weapon.bulletKillDistance = 27;
  //  Because our bullet is drawn facing up, we need to offset its rotation:
  weapon.bulletAngleOffset = 0;
  weapon.fireAngle=0;
  weapon.bulletSpeed = 800;
  //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
  weapon.fireRate = 0;
  //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
  weapon.trackSprite(player, 25, 25);
  // Give weapons physical properties
  weapon.enableBody=true;
  weapon.physicsBodyType= Phaser.Physics.ARCADE;
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  weapon.bullets.visible=false;

  weapon2 = game.add.weapon(200, 'bullet');
  game.physics.arcade.enable(weapon2);
  //weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  weapon2.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
  weapon2.bulletKillDistance = 27;
  //  Because our bullet is drawn facing up, we need to offset its rotation:
  weapon2.bulletAngleOffset = 0;
  weapon2.fireAngle=0;
  weapon2.bulletSpeed = 800;
  //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
  weapon2.fireRate = 0;
  //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
  weapon2.trackSprite(player2, 25, 25);
  // Give weapon2s physical properties
  weapon2.enableBody=true;
  weapon2.physicsBodyType= Phaser.Physics.ARCADE;
  fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  weapon2.bullets.visible=false;

  // Trump Sprite, One outside so a Trump Sprite exists at the beginning of the game.

  enemy=game.add.group();
  enemy.enableBody=true;
  game.physics.arcade.enable(enemy);
  var randomNumber=Math.floor((Math.random() * 700) + 1);
  var trumpImage=enemy.create(randomNumber,game.world.height-600,'enemy');
  trumpImage.body.bounce.y = 1;// 0.7 + Math.random() * 0.2;
  trumpImage.body.bounce.x = 1;
  trumpImage.body.gravity.y=20;
  trumpImage.body.collideWorldBounds = true;
  trumpImage.body.velocity.x = 200;

  //Timer for Item and Spike Generation
  game.time.events.repeat(Phaser.Timer.SECOND * 10,15, itemGenerator, this);
  game.time.events.repeat(Phaser.Timer.SECOND * 7,200, spikesFalling, this);
  game.time.events.repeat(Phaser.Timer.SECOND * 15,2, trumpGenerator, this);

  function trumpGenerator () {
    var randomNumber=Math.floor((Math.random() * 700) + 1);
    var trumpImage=enemy.create(randomNumber,game.world.height-600,'enemy');
    trumpImage.body.bounce.y = 1;// 0.7 + Math.random() * 0.2;
    trumpImage.body.bounce.x = 1;
    trumpImage.body.gravity.y=20;
    trumpImage.body.collideWorldBounds = true;
    trumpImage.body.velocity.x = 200;
  }

  //To randomly generate items.
  function itemGenerator() {
    //Subject to change
    stun = game.add.group();
    wing = game.add.group();
    shield = game.add.group();

    //enable physics
    stun.enableBody = true;
    wing.enableBody = true;
    shield.enableBody = true;

    stun.collideWorldBounds=true;
    wing.collideWorldBounds=true;
    shield.collideWorldBounds=true;

    for (var i = 0; i < 3; i++)
    {
      var randomNumberX=Math.floor((Math.random() * 3) + 1);

      if (randomNumberX===1) {
        var randomNumber=Math.floor((Math.random() * 700) + 1);
        var shields = shield.create(randomNumber, game.world.height-600, 'shield');
        shields.body.gravity.y = 300;
        shields.body.bounce.y = 0.7 + Math.random() * 0.2; //  This just gives each stun a slightly random bounce value
      }

      else if (randomNumberX===2) {
        var randomNumber=Math.floor((Math.random() * 700) + 1);
        var stunGun = stun.create(randomNumber, game.world.height-600, 'stun');
        stunGun.body.gravity.y = 300;
        stunGun.body.bounce.y = 0.7 + Math.random() * 0.2;
      }

      else if (randomNumberX===3) {
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
}

function update() {

  //user joins - game time resets (sync)
  if(userOut !== userIn) {
    userOut = userIn;
    game.time.reset();
  }

  //Movement Update (Left - Right)
  if(positionX !== player.body.x) {
    player.body.x = positionX;
    player.animations.play(facing);
  } else {
    player.animations.stop();
  }

  if(positionXTwo !== player2.body.x) {
    player2.body.x = positionXTwo;
    player2.animations.play(facingTwo);
  } else {
    player2.animations.stop();
  }

  if(p2WeaponAngle !== weapon2.fireAngle) { weapon2.fireAngle = p2WeaponAngle; }

  //  Collide the player and the stars with the platforms
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  var hitPlatform2 = game.physics.arcade.collide(player2, platforms);
  var hitLedge=game.physics.arcade.collide(player,ledge, platformMover);
  var hitLedge2 = game.physics.arcade.collide(player2, ledge, platformMover);
  game.physics.arcade.collide(stun, ledge);
  //game.physics.arcade.collide(platforms, platforms);
  game.physics.arcade.collide(wing, ledge);
  game.physics.arcade.collide(shield, ledge);
  game.physics.arcade.collide(enemy,ledge);
  game.physics.arcade.collide(enemy,spikes);
  game.physics.arcade.collide(ledge,spikes);
  game.physics.arcade.collide(platforms,spikes)
  game.physics.arcade.collide(stun, platforms);
  //game.physics.arcade.collide(platforms, platforms);
  game.physics.arcade.collide(wing, platforms);
  game.physics.arcade.collide(shield, platforms);
  game.physics.arcade.collide(enemy,platforms);

  //Checks to see if overlap in assets.
  //game.physics.arcade.overlap(weapon.bullets, platforms, bulletHitPlatform, null, this);
  game.physics.arcade.overlap(weapon.bullets, stun, killItemRange, null, this);
  game.physics.arcade.overlap(player, spikes, deathOne, null, this);
  game.physics.arcade.overlap(player, roofSpikes, deathOne, null, this);
  game.physics.arcade.overlap(player, fallingSpikes, deathOne, null, this);
  game.physics.arcade.overlap(player, shield, runFaster, null, this);
  game.physics.arcade.overlap(player, wing, jumpHigher, null, this);
  game.physics.arcade.overlap(player, stun, extendedWeapon, null, this);
  game.physics.arcade.overlap(spikes, stun, deathTwo, null, this);
  game.physics.arcade.overlap(spikes, wing, deathTwo, null, this);
  game.physics.arcade.overlap(spikes, shield, deathTwo, null, this);
  game.physics.arcade.overlap(fallingSpikes, ledge, deathOne, null, this);
  game.physics.arcade.overlap(fallingSpikes, platforms, deathOne, null, this);
  game.physics.arcade.overlap(player, enemy, deathOne, null, this);

  //  Reset the players velocity (movement)
  // player.body.velocity.x = 0;

  //Client Movement Input to Server (Firebase)
  if (cursors.left.isDown && p1 === true)
  {
      if(positionX > 0) { positionX -= 5}
      database.ref().update({ posX: positionX, facings: 'left', playerOneWA: -180 });
  }
  else if (cursors.right.isDown && p1 === true)
  {
      if(positionX < 775) { positionX += 5; }
      database.ref().update({ posX: positionX, facings: 'right', playerOneWA: 0 });
  }
  if (cursors.left.isDown && p2 === true)
  {
      if(positionXTwo > 0) { positionXTwo -= 5}
      database.ref().update({ posX2: positionXTwo, facings2: 'left', playerTwoWA: -180 });
  }
  else if (cursors.right.isDown && p2 === true)
  {
      if(positionXTwo < 775) { positionXTwo += 5; }
      database.ref().update({ posX2: positionXTwo, facings2: 'right', playerTwoWA: 0 });
  }

  // if (cursors.left.isDown)
  // {
  //     player.body.velocity.x = -200;
  //     player.animations.play('left');
  //     weapon.fireAngle=-180;
  //
  //     if (runFastX) {
  //         player.body.velocity.x = -400;
  //         player.animations.play('left');
  //         weapon.fireAngle=-180;
  //     }
  // }
  // else if (cursors.right.isDown)
  // {
  //     player.body.velocity.x = 200;
  //     player.animations.play('right');
  //     weapon.fireAngle=0;
  //
  //     if (runFastX) {
  //         player.body.velocity.x = 400;
  //         player.animations.play('right');
  //         weapon.fireAngle=0;
  //     }
  // }
  // else if (cursors.down.isDown) {
  //     player.body.velocity.y = 200;
  // }
  // else
  // {
  //     //  Stand still
  //     player.animations.stop();
  //     player.frame = 8;
  // }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down && (hitPlatform || hitLedge))
  {
      player.body.velocity.y = -200;
      if (jumpHigherX) {
          player.body.velocity.y = -400;
      }
  }

  if (fireButton.isDown)
  {
    if (cursors.left.isDown)
    {
      player.body.velocity.x = -90;
      player.frame=17;
      weapon.fireAngle=-180;
      weapon.fire();
    }
    else if (cursors.right.isDown)
    {
      player.body.velocity.x = 90;
      player.frame=18;
      weapon.fireAngle=0;
      weapon.fire();
    }
    if (stunGunWeapon)
    {
      if (cursors.left.isDown)
      {
        player.body.velocity.x = -90;
        player.frame=17;
        weapon.fireAngle=-180;
        weapon.bulletKillDistance = 40;
        weapon.fire();
      }
      else if (cursors.right.isDown)
      {
        player.body.velocity.x = 90;
        player.frame=18;
        weapon.fireAngle=0;
        weapon.bulletKillDistance = 40;
        weapon.bullets.visible=true;
        weapon.fire();
      }
    }
  }
}

/////////////////////////////////////////////Other Functions (Ex: Player Weapon Handlers)////////////////////////////////////////////////////////////////////
function killItemRange (weapon,stun) {
    stun.kill();
}

function runFaster (player,shield) {
    runFastX=true;
    shield.kill();
}

function jumpHigher (player,wing) {
    jumpHigherX=true;
    wing.kill();
}

function extendedWeapon (player,stun) {
    stunGunWeapon=true;
    stun.kill();
}

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

function deathOne(victim, killer) {
  victim.kill();
}

function deathTwo(killer, victim) {
  victim.kill();
}

var player, player2, enemy, platforms, ledge, cursors, stun, wing, shield, spikes, roofSpikes, fire, fallingSpikes, userOut, userIn, facing, facingTwo, jumpTimer, jumpTimerTwo, p1WeaponAngle, p2WeaponAngle, groundThree, groundThreeX, groundThreeY;
var ledge1, ledge2, ledge1X, ledge1Y, ledge2X, ledge2Y;
var trump1, trump2, trump3, trump1X, trump1Y, trump2X, trump2Y, trump3X, trump3Y;
var runOne = false, jumpOne = false, weaponOne = false, weaponOneOn = 0;
var runTwo = false, jumpTwo = false, weaponTwo = false, weaponTwoOn = 0;
var positionX = 45; positionXTwo = 765;
var positionY = 0; positionYTwo = 0;
var gameState = false;
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

  setTimeout(startGame, temp.child("timer").val() * 20);

  userIn = temp.child("numberOfUsers").val();
  userOut = userIn;
  userIn += 1;

  //server default values
  database.ref().update({
    jumpTime: 0,
    run1: false,
    jump1: false,
    weapon1: false,
    weapon1On: 0,
    facings: 'right',
    posX: 45,
    posY: 0,
    playerOneWA: 0,
    numberOfUsers: userIn,
    posX2: 755,
    posY2: 0,
    facings2: 'left',
    jumpTime2: 0,
    run2: false,
    jump2: false,
    weapon2: false,
    weapon2On: 0,
    playerTwoWA: -180
  });

});

//caches database if it changes (faster loads for .once)
database.ref().on("value", function(snapshot){

});

//main server update() to sync server values with client values

var tempTimer, tempTimerTimer;
var tempTimerOn = true;

var serverUpdate = setInterval(function() {

  database.ref().once("value", function(snapshot) {
    data = snapshot;
    userIn = data.child("numberOfUsers").val();

    //player1
    positionX = data.child("posX").val();
    positionY = data.child("posY").val();
    facing = data.child("facings").val();
    jumpTimer = data.child("jumpTime").val();
    p1WeaponAngle = data.child("playerOneWA").val();
    runOne = data.child("run1").val();
    jumpOne = data.child("jump1").val();
    weaponOne = data.child("weapon1").val();
    weaponOneOn = data.child("weapon1On").val();

    //player2
    positionXTwo = data.child("posX2").val();
    positionYTwo = data.child("posY2").val();
    facingTwo = data.child("facings2").val();
    jumpTimerTwo = data.child("jumpTime2").val();
    p2WeaponAngle = data.child("playerTwoWA").val();
    tempTimer = data.child("timer").val();
    runTwo = data.child("run2").val();
    jumpTwo = data.child("jump2").val();
    weaponTwo = data.child("weapon2").val();
    weaponTwoOn = data.child("weapon2On").val();

    //misc
    groundThreeX = data.child("g3x").val();
    groundThreeY = data.child("g3y").val();
    ledge1X = data.child('l1x').val();
    ledge1Y = data.child("l1y").val();
    ledge2X = data.child('l2x').val();
    ledge2Y = data.child('l2y').val();

    //trump
    trump1X = data.child("t1x").val();
    trump1Y = data.child("t1y").val();

    trump2X = data.child("t2x").val();
    trump2Y = data.child("t2y").val();

    trump3X = data.child("t3x").val();
    trump3Y = data.child("t3y").val();

  });

  if(tempTimerOn === true && p1) {
    tempTimerTimer = tempTimer - 1;
  }

  if(p1 === true && tempTimerOn === true) { database.ref().update({ timer: tempTimerTimer }); }

}, 20);



///////////////////////////////////////////////////////////////////////////////////////////////VARIABLE DECLARATIONS / PREGAME////////////////////////////////////////////////////////////////////////////////

var game;

function startGame() {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
  tempTimerOn = false;
  tempTimerTimer = 250;
  database.ref().update({ timer: 250, playerOne: 'empty', playerTwo: 'empty' });
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
  // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Scales our Game
  game.add.sprite(0, 0, 'sky');   // A simple background for our game

  game.time.desiredFps = 30;

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
  // var randomNumber=Math.floor((Math.random() * 798) + 1);
  // var randomNumber2=Math.floor((Math.random() * 500) + 1);
  // var groundThree = platforms.create(randomNumber, randomNumber2, 'ground');
  groundThree = platforms.create(120, 300, 'ground');
  groundThree.body.immovable = true;
  groundThree.body.velocity.setTo(100,100);
  groundThree.body.collideWorldBounds=true;
  groundThree.body.bounce.set(.75);

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

  ledge1 = ledge.create(200, 300, 'testGround');
  ledge1.body.velocity.setTo(-120, -50);
  ledge1.body.collideWorldBounds = true;
  ledge1.body.bounce.set(0.5);

  ledge2 = ledge.create(600, 300, 'testGround');
  ledge2.body.velocity.setTo(120, -50);
  ledge2.body.collideWorldBounds = true;
  ledge2.body.bounce.set(0.5);

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

  // PLAYER 1 SETTINGS
  player = game.add.sprite(45, game.world.height - 140, 'dude');
  game.physics.arcade.enable(player); //enables physics for player 1
  // player.body.bounce.y = 0;
  player.body.gravity.y = 200;
  player.body.collideWorldBounds = true;

  // PLAYER 1 - ANIMATIONS
  player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
  player.animations.add('right', [9,10,11,12,13,14,15], 10, true);

  // PLAYER 2 SETTINGS
  player2 = game.add.sprite(755, game.world.height - 140, 'secondDude');
  game.physics.arcade.enable(player2); //enables physics for player 2
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
  weapon2.bullets.visible=false;

  // Trump Sprite, One outside so a Trump Sprite exists at the beginning of the game.

  enemy=game.add.group();
  enemy.enableBody=true;
  game.physics.arcade.enable(enemy);

  trump1 = enemy.create(50, 50, 'enemy');
  trump1.body.bounce.set(0.5);
  // trump1.body.bounce.x = 1;
  trump1.body.gravity.y=20;
  trump1.body.collideWorldBounds = true;
  trump1.body.velocity.x = -200;

  trump2 = enemy.create(300, 50, 'enemy');
  trump2.body.bounce.set(0.5);
  // trump2.body.bounce.x = 1;
  trump2.body.gravity.y=20;
  trump2.body.collideWorldBounds = true;
  trump2.body.velocity.x = 200;

  trump3 = enemy.create(550, 50, 'enemy');
  trump3.body.bounce.set(0.5);
  // trump3.body.bounce.x = 1;
  trump3.body.gravity.y=20;
  trump3.body.collideWorldBounds = true;
  trump3.body.velocity.x = 200;

  //Timer for Item and Spike Generation
  // game.time.events.repeat(Phaser.Timer.SECOND * 10,15, itemGenerator, this);
  // game.time.events.repeat(Phaser.Timer.SECOND * 7,200, spikesFalling, this);
  // game.time.events.repeat(Phaser.Timer.SECOND * 15,2, trumpGenerator, this);

  setInterval(randomNumberGenerator1, 4000);
  setInterval(randomNumberGenerator2, 14000);
  setInterval(spikesFalling, 5000);

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

    stun.collideWorldBounds = true;
    wing.collideWorldBounds = true;
    shield.collideWorldBounds = true;

    for(var i = 0; i < 3; i++) {
      database.ref().once("value", function(snapshot) {
        var a = snapshot.child("randomNumber").val();
        var b = snapshot.child("randomCoordinate").val();
        var item;
        if(a === 0) { item = shield.create(b, 0, 'shield'); }
        else if(a === 1) { item = stun.create(b, 0, 'stun'); }
        else if(a === 2) { item = wing.create(b, 0, 'wing'); }
        item.body.gravity.y = 300;
      });
    }

  }

  function randomNumberGenerator1() {
    if(p1 === true) { database.ref().update({ randomNumber: Math.floor(Math.random() * 3), randomCoordinate: Math.floor(Math.random() * 774) }); }
    setTimeout(itemGenerator, 1000);
  }

  function randomNumberGenerator2() {
    if(p1 === true) { database.ref().update({ randomCoordinate2: Math.floor(Math.random() * 774) }); }
  }

  function spikesFalling () {
    fallingSpikes= game.add.group();
    fallingSpikes.enableBody = true;
    fallingSpikes.collideWorldBounds=true;

    var spikeFall = fallingSpikes.create(player.body.x, game.world.height-600, 'fallingSpike');
    spikeFall.body.gravity.y = 300;
    spikeFall = fallingSpikes.create(player2.body.x, game.world.height-600, 'fallingSpike');
    spikeFall.body.gravity.y = 300;
  }
}

function update() {

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
  game.physics.arcade.overlap(player, enemy, deathOne, null, this);

  game.physics.arcade.overlap(player2, spikes, deathOne, null, this);
  game.physics.arcade.overlap(player2, roofSpikes, deathOne, null, this);
  game.physics.arcade.overlap(player2, fallingSpikes, deathOne, null, this);
  game.physics.arcade.overlap(player2, shield, runFaster2, null, this);
  game.physics.arcade.overlap(player2, wing, jumpHigher2, null, this);
  game.physics.arcade.overlap(player2, stun, extendedWeapon2, null, this);
  game.physics.arcade.overlap(player2, enemy, deathOne, null, this);

  game.physics.arcade.overlap(spikes, stun, deathTwo, null, this);
  game.physics.arcade.overlap(spikes, wing, deathTwo, null, this);
  game.physics.arcade.overlap(spikes, shield, deathTwo, null, this);
  game.physics.arcade.overlap(fallingSpikes, ledge, deathOne, null, this);
  game.physics.arcade.overlap(fallingSpikes, platforms, deathOne, null, this);

  if(p1) { database.ref().update({ g3x: groundThree.body.x , g3y: groundThree.body.y }); }
  if(groundThreeX !== groundThree.body.x && groundThreeY !== groundThree.body.y) {
    groundThree.body.x = groundThreeX;
    groundThree.body.y = groundThreeY;
  }

  if(p1) { database.ref().update({ l1x: ledge1.body.x, l1y: ledge1.body.y }); }
  if(ledge1X !== ledge1.body.x && ledge1Y !== ledge1.body.y) {
    ledge1.body.x = ledge1X;
    ledge1.body.y = ledge1Y;
  }

  if(p1) { database.ref().update({ l2x: ledge2.body.x, l2y: ledge2.body.y }); }
  if(ledge2X !== ledge2.body.x && ledge2Y !== ledge2.body.y) {
    ledge2.body.x = ledge2X;
    ledge2.body.y = ledge2Y;
  }

  if(p1) { database.ref().update({ t1x: trump1.body.x, t1y: trump1.body.y }) };
  if(trump1X !== trump1.body.x && trump1Y !== trump1.body.y) {
    trump1.body.x = trump1X;
    trump1.body.y = trump1Y;
  }

  if(p1) { database.ref().update({ t2x: trump2.body.x, t2y: trump2.body.y }) };
  if(trump2X !== trump2.body.x && trump2Y !== trump2.body.y) {
    trump2.body.x = trump2X;
    trump2.body.y = trump2Y;
  }

  if(p1) { database.ref().update({ t3x: trump3.body.x, t3y: trump3.body.y }) };
  if(trump3X !== trump3.body.x && trump3Y !== trump3.body.y) {
    trump3.body.x = trump3X;
    trump3.body.y = trump3Y;
  }


  //player 1 controls (left-right, animations, jump, weapon angle)
  if(positionX !== player.body.x) { player.body.x = positionX; player.animations.play(facing) }
  else if (player.body.x === positionX) { player.animations.stop(); }

  if(positionY !== player.body.velocity.y && game.time.totalElapsedSeconds() < jumpTimer) { player.body.velocity.y = positionY; }

  if(p1WeaponAngle !== weapon.fireAngle) { weapon.fireAngle = p1WeaponAngle; }

  if(weaponOneOn === 1) {
    player.frame = 17;
    weapon.fire();
  }
  else if (weaponOneOn === 2) {
    player.frame = 18;
    weapon.fire();
  }

  if(weaponOne) {
    weapon.bulletKillDistance = 40;
    weapon.bullets.visible=true;
  }

  if(weaponTwoOn === 1) {
    player2.frame = 17;
    weapon2.fire();
  }
  else if (weaponTwoOn === 2) {
    player2.frame = 18;
    weapon2.fire();
  }

  if(weaponTwo) {
    weapon2.bulletKillDistance = 40;
    weapon2.bullets.visible=true;
  }

  //player 2 controls (left-right, animations, jump, weapon angle)
  if(positionXTwo !== player2.body.x) { player2.body.x = positionXTwo; player2.animations.play(facingTwo); }
  else if (player2.body.x === positionXTwo) { player2.animations.stop(); }

  if(positionYTwo !== player2.body.velocity.y && game.time.totalElapsedSeconds() < jumpTimerTwo) { player2.body.velocity.y = positionYTwo; }

  if(p2WeaponAngle !== weapon2.fireAngle) { weapon2.fireAngle = p2WeaponAngle; }

  //Client Movement Input to Server (Firebase)
  if (cursors.left.isDown && p1 === true)
  {
      if (positionX > 0) {
        if (runOne) {
          positionX -= 10;
        } else if (!runOne) {
          positionX -= 5;
        }
        database.ref().update({ posX: positionX, facings: 'left', playerOneWA: -180 });
      }
      if(fireButton.isDown) {
        database.ref().update({ weapon1On: 1 });
      } else if (!fireButton.isDown) {
        database.ref().update({ weapon1On: 0 });
      }
  }
  else if (cursors.right.isDown && p1 === true)
  {
      if (positionX < 775) {
        if (runOne) {
          positionX += 10;
        } else if (!runOne) {
          positionX += 5;
        }
        database.ref().update({ posX: positionX, facings: 'right', playerOneWA: 0 });
      }
      if(fireButton.isDown) {
        database.ref().update({ weapon1On: 2 });
      } else if (!fireButton.isDown) {
        database.ref().update({ weapon1On: 0 });
      }
  }

  if (cursors.left.isDown && p2 === true)
  {
      if(positionXTwo > 0) {
        if(runTwo) {
          positionXTwo -= 10;
        } else if (!runTwo) {
          positionXTwo -= 5;
        }
        database.ref().update({ posX2: positionXTwo, facings2: 'left', playerTwoWA: -180 });
      }
      if(fireButton.isDown) {
        database.ref().update({ weapon2On: 1 });
      } else if (!fireButton.isDown) {
        database.ref().update({ weapon2On: 0 });
      }
  }
  else if (cursors.right.isDown && p2 === true)
  {
      if(positionXTwo < 775) {
        if(runTwo) {
          positionXTwo += 10;
        } else if (!runTwo) {
          positionXTwo += 5;
        }
        database.ref().update({ posX2: positionXTwo, facings2: 'right', playerTwoWA: 0 });
      }
      if(fireButton.isDown) {
        database.ref().update({ weapon2On: 2 });
      } else if (!fireButton.isDown) {
        database.ref().update({ weapon2On: 0 });
      }
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down && p1 === true && (hitPlatform || hitLedge))
  {
      jumpTimer = game.time.totalElapsedSeconds() + 0.5;
      if (jumpOne) { database.ref().update({ posY: -200, jumpTime: jumpTimer }); }
      else if (!jumpOne) { database.ref().update({ posY: -100, jumpTime: jumpTimer }); }
  }

  if (cursors.up.isDown && player2.body.touching.down && p2 === true && (hitPlatform2 || hitLedge2))
  {
      jumpTimerTwo = game.time.totalElapsedSeconds() + 0.5;
      if (jumpTwo) { database.ref().update({ posY2: -200, jumpTime2: jumpTimerTwo }); }
      else if (!jumpTwo) { database.ref().update({ posY2: -100, jumpTime2: jumpTimerTwo }); }
  }

  if (cursors.down.isDown && player.body.touching.down && p1 === true && (hitPlatform || hitLedge))
  {
      jumpTimer = game.time.totalElapsedSeconds() + 0.5;
      if (jumpOne) { database.ref().update({ posY: 200, jumpTime: jumpTimer }); }
      else if (!jumpOne) { database.ref().update({ posY: 100, jumpTime: jumpTimer }); }
  }

  // Stand Still - player.frame = 8;
}

/////////////////////////////////////////////Other Functions (Ex: Player Weapon Handlers)////////////////////////////////////////////////////////////////////
function killItemRange (weapon,stun) {
    stun.kill();
}

function runFaster (player,shield) {
    database.ref().update({ run1: true });
    shield.kill();
}

function jumpHigher (player,wing) {
    database.ref().update({ jump1: true });
    wing.kill();
}

function extendedWeapon (player,stun) {
    database.ref().update({ weapon1: true });
    stun.kill();
}

function runFaster2 (player,shield) {
    database.ref().update({ run2: true });
    shield.kill();
}

function jumpHigher2 (player,wing) {
    database.ref().update({ jump2: true });
    wing.kill();
}

function extendedWeapon2 (player,stun) {
    database.ref().update({ weapon2: true });
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

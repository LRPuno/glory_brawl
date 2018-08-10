var game = new Phaser.Game(800, 600, Phaser.AUTO)

var player, enemy, platforms, ledge, cursors, wing, shield, spikes, roofSpikes, fire, fallingSpikes;
var runFastX = false, jumpHigherX = false, stunGunWeapon = false;
var timer;
var smack;
var music;
var music1;
//Forces the next state of the game with a button that is not coded in phaser.
var forceGameStart4=false;
var trumpQuotes;
var total = 0;
var highestTotalLocal=0;

//////////////////////////////////////////////////Story///////////////////////////////////
var content = [
  "It's the year 2049, Donald Trump found the secret to immortality.",
  "He has seized all power and killed all of his enemies.",
  "In an attempt to calm down the masses.",
  "Trump created a game show.",
  "A game show that uses prisoners as contestants",
  "You've been selected as a contestant.",
  "Arrow Keys to Move.",
  "Welcome to Glory Brawl.",
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;

function nextLine() {

  if (lineIndex === content.length)
  {
      //  We're finished
      return;
  }

  //  Split the current line on spaces, so one word per array element
  line = content[lineIndex].split(' ');

  //  Reset the word index to zero (the first word in the line)
  wordIndex = 0;

  //  Call the 'nextWord' function once for each word in the line (line.length)
  game.time.events.repeat(wordDelay, line.length, nextWord, this);

  //  Advance to the next line
  lineIndex++;

}

function nextWord() {

  //  Add the next word onto the text string, followed by a space
  text.text = text.text.concat(line[wordIndex] + " ");

  //  Advance the word index to the next word in the line
  wordIndex++;

  //  Last word?
  if (wordIndex === line.length)
  {
      //  Add a carriage return
      text.text = text.text.concat("\n");

      //  Get the next line after the lineDelay amount of ms has elapsed
      game.time.events.add(lineDelay, nextLine, this);
  }

}
/////////////////////

////////////////////////////////////////////////////////////////GAME STATES////////////////////////////////////////////////////////////////
game.state.add('state1',brawl.state1);
game.state.add('state2',brawl.state2);
game.state.add('state3',brawl.state3);
game.state.add('state4',brawl.state4);
game.state.start('state1');
//game.state.start('state2');
//game.state.start('state3');
//game.state.start('state4');
////////////////////////////////////////////////////////////////PHASER 2 GAME (GLORY_BRAWL)////////////////////////////////////////////////////////////////

/*
//Changing Game States Where you Press Numbers
function changeState (i,stateNum) {
  console.log(i);
  game.state.start('state'+stateNum);
}

function addKeyCallback(key,fn,args) {
  game.input.keyboard.addKey(key).onDown.add(fn,null,null,args);
}

function addChangeStateEventListeners() {
  addKeyCallback(Phaser.Keyboard.TWO, changeState,2);
}
*/

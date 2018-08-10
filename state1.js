var brawl= {};
brawl.state1=function(){};
brawl.state1.prototype= {
    preload: function (){
        game.load.image('background-one', 'assets/trumpFirstBackground.jpg');
        game.load.audio('rock','assets/rockbit.mp3');
    },
    create: function (){

        //Trump Background
        game.add.sprite(200,250,'background-one');
        //Scaling
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        console.log("state1");

        //Adding Cool Looking Text
        text = game.add.text(40, 79, '', { font: "15px Arial", fill: "#19de65" });
        nextLine();
        addChangeStateEventListeners();

        /*
        //Loop Music
        musicOne = game.add.audio('rock');
        musicOne.play();
        */
    },
    update: function (){
        /*
        if(game.input.keyboard.isDown(Phaser.Keyboard.TWO)) {
            musicOne.stop(); 
        }
        */
    }
};



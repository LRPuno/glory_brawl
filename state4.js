brawl.state4=function(){};
brawl.state4.prototype= {
    preload: function (){
        // game.load.image('background-four', 'assets/win.png');
    },
    create: function (){

        $('#login, #button').css("display", "none");

        var text = game.add.text(400, 30, 'Leaderboard');
        // text.anchor.set(0.5);
        text.align = 'center';
        text.anchor.set(0.5);
        text.font = 'Arial Black';
        text.fontSize = 48;
        text.fill= "#E81302";
        text.fontWeight = 'bold';

        var nameArray = [];
        var scoreArray = [];

        firebase.database().ref('leaderboards').orderByValue().limitToLast(10).once("value", function(snapshot){
          snapshot.forEach(function(data) {
            nameArray.push(data.key);
            scoreArray.push(data.val());
          });

          var a = 0.55;
          var b = 70;
          for(var i = nameArray.length-1; i >= 0; i -= 1) {
            var temp = game.add.text(250, b, nameArray[i] + ":");
            temp.font = 'Arial Black';
            temp.fontSize = 28;
            temp.fill= "#ffffff";
            temp.fontWeight = 'bold';

            var foo = game.add.text(400, b, scoreArray[i]);
            foo.font = 'Arial Black';
            foo.fontSize = 28;
            foo.fill= "#ffffff";
            foo.fontWeight = 'bold';
            b += 40;
          }
        });
        var text2 = game.add.text(180, 475,'Press Spacebar to Play Again');
        // text.anchor.set(0.5);
        text2.align = 'center';
        //text2.anchor.set(0.5);
        text2.font = 'Arial Black';
        text2.fontSize = 28;
        text2.fill= "#E81302";
        text2.fontWeight = 'bold';


    },
    update: function (){
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {
        location.reload();
      }
    }
};

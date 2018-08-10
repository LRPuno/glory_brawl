brawl.state4=function(){};
brawl.state4.prototype= {
    preload: function (){
        // game.load.image('background-four', 'assets/win.png');
    },
    create: function (){

        $('#login, #button').css("display", "none");

        var text = game.add.text(400, 40, 'Leaderboard');
        // text.anchor.set(0.5);
        text.align = 'center';
        text.anchor.set(0.5);
        text.font = 'Arial Black';
        text.fontSize = 40;
        text.fill= "#19de65";
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
            var temp = game.add.text(290, b, nameArray[i] + ":");
            temp.font = 'Arial Black';
            temp.fontSize = 28;
            temp.fill= "#ffffff";
            temp.fontWeight = 'bold';

            var foo = game.add.text(475, b, scoreArray[i]);
            foo.font = 'Arial Black';
            foo.fontSize = 28;
            foo.fill= "#ffffff";
            foo.fontWeight = 'bold';
            b += 30;
          }
        });


    },
    update: function (){}
};

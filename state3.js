brawl.state3=function(){};
brawl.state3.prototype= {
    preload: function (){
        game.load.image('background-three', 'assets/trumpBackground.png');
    },
    create: function (){
        var config = {
          apiKey: "AIzaSyCo-BksCXLjbvyAkl462_8tpQeIVoRHyqk",
          authDomain: "glory-brawl.firebaseapp.com",
          databaseURL: "https://glory-brawl.firebaseio.com",
          projectId: "glory-brawl",
          storageBucket: "glory-brawl.appspot.com",
          messagingSenderId: "293343815413"
        };

        firebase.initializeApp(config);

        game.add.sprite(200,250, 'background-three');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        console.log("state3");

        text = game.add.text(350, 200, 'Spacebar to Play Again');

        //	Center align
        text.anchor.set(0.5);
        text.align = 'center';

        //	Font style
        text.font = 'Arial Black';
        text.fontSize = 20;
        text.fill= "#19de65";
        text.fontWeight = 'bold';

        text = game.add.text(350, 220, 'Press ENTER to see High Score Leaderboard!');
        text.anchor.set(0.295);
        text.align = 'center';

        //	Font style
        text.font = 'Arial Black';
        text.fontSize = 20;
        text.fill= "#19de65";
        text.fontWeight = 'bold';

        //  And now we'll color in some of the letters
        // text.addColor('#ff00ff', 9);
        // text.addColor('#43d637', 13);

        var name = game.add.text(260, 100, 'Name: _  _  _');
        name.anchor.set(0.1);
        name.align = 'center';

        //	Font style
        name.font = 'Arial Black';
        name.fontSize = 20;
        name.fill= "#19de65";
        name.fontWeight = 'bold';

        var counter = 0;

        $('#login, #button').css("display", "inline");

        $('#button').on("click", function(event) {
          event.preventDefault();
          var b = $('#login').val().toUpperCase();
          firebase.database().ref('leaderboards').once("value", function(snapshot) {
            var a = snapshot;
            if(a.child(b).val() < total ) {
              firebase.database().ref('leaderboards').update({ [b]: total })
            }
          });

          $('#login').val("");
          $('#login, #button').css("display", "none");
        });

        var queryURL = "https://api.whatdoestrumpthink.com/api/v1/quotes/random";
        console.log(queryURL);

        // Creating an AJAX call for trump quote.
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {

          console.log(response);
          trumpQuotes= game.add.text(200,500,response.message);

          //trumpQuotes.anchor.set(0);
          trumpQuotes.align = 'center';

          //	Font style
          trumpQuotes.font = 'Arial Black';
          trumpQuotes.fontSize = 15;
          trumpQuotes.fill= "#19de65";
          trumpQuotes.fontWeight = 'bold';

          //
          trumpQuotes.wordWrap=true;
          trumpQuotes.wordWrapWidth=450;

          //  And now we'll color in some of the letters
          // trumpQuotes.addColor('#ff00ff', 9);
          // trumpQuotes.addColor('#43d637', 13);

        });

    },
    update: function (){
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      {
        location.reload();
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
      {
        game.state.start('state4');
      }


    }
};

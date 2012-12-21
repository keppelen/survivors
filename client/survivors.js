if (Meteor.isClient) {

  Template.survivors_list.survivors = function() {
    // return Survivors.find({}, {sort: {likes: -1, name: 1}});
    return Survivors.find({}, {sort: {score: -1} });
  };

  Template.survivors.events = {
    'click #inset-survivors': function() {
       FB.login(function(response) {
          if (response.authResponse) {

            insert();

            var body = 'Reading Connect JS documentation';
             FB.api('/me/feed', 'post', { body: body, message: 'Eu sou um sobrevivente do FIM DO MUNDO, se você é um também avise aqui.' }, function(response) {
                 if (!response || response.error) {
                    console.log(response);
                  } else {
                    console.log('Post ID: ' + response);
                  }
            });

          }
        })
      }

  };

  function insert() {
    FB.api('/me', function(response) {

      var id = response.id,
      name = response.first_name + " " + response.middle_name,
      avatar = "https://graph.facebook.com/" + id + "/picture",
      location = response.location.name;

      var ids = function() {

        var userIds = new Array();

        Survivors.find({}).forEach(function(survivors) {
          if (userIds.indexOf(survivors.id) === -1) {
            userIds.push(survivors.id);
          }
        });

        return userIds;
      }


      var listIds = ids(),
          myUser = id,
          UserExist = $.inArray( myUser, listIds );

      if ( UserExist == -1 ) {
        Survivors.insert({ id: id, user: name, avatar: avatar, location: location });
      }
      else {
        alert("Você já é um sobrevivente");
      }

    })

  }


  //FACEBOOK
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '426808950720994', // App ID from the App Dashboard
      channelUrl : '', // Channel File for x-domain communication
      status     : true, // check the login status upon init?
      cookie     : true, // set sessions cookies to allow your server to access the session?
      xfbml      : true  // parse XFBML tags on this page?
    });

    // Additional initialization code such as adding Event Listeners goes here
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        $(".list").show();
      } else if (response.status === 'not_authorized') {
        // not_authorized
        $("#cad-usuario").show();
      } else {
        // not_logged_in
        $("#cad-usuario").show();
        $(".list").show();

      }
    });
  };

  // Load the SDK's source Asynchronously
  (function(d, debug){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "https://connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
     ref.parentNode.insertBefore(js, ref);
   }(document, /*debug*/ false));
}
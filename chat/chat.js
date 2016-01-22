Chats = new Mongo.Collection("chats");

if (Meteor.isClient) {
  // counter starts at 0
  Template.hello.created = function() {
    Session.set("who", true);
};
  Template.hello.rendered = function() {
      $('body').scrollTop($('body').get(0).scrollHeight);
      $('body').bind('DOMNodeInserted DOMNodeRemoved', function() {
          $('body').scrollTop($('body').get(0).scrollHeight);
      });
};

  Template.hello.helpers({
    conversation: function () {
      var list = Meteor.call("getMessages");
      console.log(list);

      return Chats.find().fetch();
  },

  isAuthor: function (str) {
      return str == "self";
  }
  });

  Template.hello.events({
      'keypress .textarea': function(evt, template) {
          // enter event

          if (evt.which === 13) {
              var msg = template.find(".textarea").value;
              console.log(msg);
              Meteor.call("insertMessage", Session.get("who"), msg);
              Session.set("who", !Session.get("who", true));
              $(".textarea").val("");
          }
      },

      'click .send': function(evt, template) {
          // enter event
          var msg = template.find(".textarea").value;
          console.log(msg);
          Meteor.call("insertMessage", Session.get("who"), msg);
          Session.set("who", !Session.get("who", true));
          $(".textarea").val("");
      }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });


  Meteor.methods({
  insertMessage: function (b, m) {

    if (b){
        var data ={
            author: "self",
            message: m
        };
        Chats.insert(data);
    }
    else{
        var data ={
            author: "other",
            message: m
        };
        Chats.insert(data);
    }

},

getMessages: function () {
    return Chats.find().fetch();
}
});
}

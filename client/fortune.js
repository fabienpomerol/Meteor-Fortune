
// Define Minimongo collections to match server/bootstrap.js.
Fortune = new Meteor.Collection("fortunes");
Session.set('fortunes', Fortune.find({}, {sort:{timestamp:-1}}));

// Store a collection of fortune id which the user already vote for
Session.set('votedCollection', []);

////////////// HANDLEBAR helpers /////////////////

Handlebars.registerHelper('fortuneHelper', function(context, block) {

//  return fortune.replace('@', '<br/>@', 'g') + ' <br/> ';
  var ret = "<ul>";
  var fortune = context;
  var fortunes = [];
  var firstIndice = 0;
  var i;

  while ((i = fortune.indexOf('@', firstIndice)) !== -1) {
    if(i == firstIndice)
    {
      firstIndice = i+1;
      continue;
    }

    fortunes.push(fortune.substr(0,i).trim());
    fortune = fortune.substr(i,fortune.length);
  }
  fortunes.push(fortune);

  var objects = fortunes.map(function(item, i){

    //we store the odd even pseudo class
    var pseudoClass = (i & 1) == 1 ? 'odd' : 'even';

    if (item[0] === '@') {
      var i = item.indexOf(' ');

      if (i === -1) {
        return {
          pseudo: item,
          pseudoClass: pseudoClass,
          message: undefined
        }
      }

      return {
        pseudo: item.substr(0, i),
        pseudoClass: pseudoClass,
        message: item.substr(i)
      }
    }
    else {
      return {
        pseudo: undefined,
        message: item
      }
    }
  });

  for(var i=0, j=objects.length; i<j; i++) {
    ret = ret + "<li>" + block(objects[i]) + "</li>";
  }

  return ret + "</ul>";
});

//////////////  Session init //////////////////

Session.set('list_id', null);

////////////// Leaderboard ////////////////////

Template.leaderboard.fortunes = function () {
  //var fortunesAll = fortune.find({}, {sort:{timestamp:-1}});
  fortunesAll = Session.get('fortunes');
  //fortunes = fortunesAll.fetch().slice(0,10);
  nbPages = Math.ceil(fortunesAll.length/10);
  return fortunesAll;
};

////////////// Big counter ////////////////////

Template.bigCounter.counter = function () {
  fortunes = Fortune.find();
  return fortunes.count();
};


///////////// Form add new fortune ////////////////

Template.form.events = {
  'click .add-fortune': function(event) {
    if ($('#input-new').val() != '') {

      date = new Date();

      Fortune.insert({
        fortune: $('#input-new').val(),
        date: date.toLocaleDateString()+' '+date.toLocaleTimeString(),
        timestamp: (new Date()).getTime(),
        score: 0
      });

      Template.leaderboard.fortunes = function () {
        return Fortune.find();
      };

      $('#input-new').val() = '';
    }
  }
};

//////////// Fortune counters ///////////////////

Template.fortune.events = {
  'click .up': function(event) {
    var votedColl = Session.get('votedCollection');

    if($.inArray(event.target.dataset.id, votedColl) == -1)
    {
      Fortune.update({ _id: event.target.dataset.id }, { $inc: { score : +1 } })
      votedColl.push(event.target.dataset.id);
      Session.set('votedCollection', votedColl);
    }
  },
  'click .down': function(event) {
    var votedColl = Session.get('votedCollection');

    if($.inArray(event.target.dataset.id, votedColl) == -1)
    {
      Fortune.update({ _id: event.target.dataset.id }, { $inc: { score : -1 } })
      votedColl.push(event.target.dataset.id);
      Session.set('votedCollection', votedColl);
    }
  }
}

//////////// ROUTING //////////////////////////

var FortuneRouter = Backbone.Router.extend({
  routes: {
    "top10": "topFortune",
    "top-flop": "flopFortune",
    "*actions": "defaultRoute",
  },
  defaultRoute: function ( actions ) {
    Session.set('fortunes', Fortune.find({}, {sort:{timestamp:-1}}));
  },
  topFortune: function () {
    Session.set('fortunes', Fortune.find({}, {sort:{score:-1}}));
  },
  flopFortune: function () {
    Session.set('fortunes', Fortune.find({}, {sort:{score:1}}));
  },
});

var app_router = new FortuneRouter;

Meteor.startup(function () {
  Backbone.history.start();
});


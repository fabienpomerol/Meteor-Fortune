Fortune = new Meteor.Collection("fortunes");
//Fortune.remove({});

Meteor.startup(function () {
  if (Fortune.find().count() === 0) {
    var fortunes = [
      "@julien tu rentre tellement dans un moule que tu vas finir tarte !",
      "@kévin je suis septique, même fosse septique !",
      "@Barbara j'ai perdu du temps à cause d'OpenOffice sa mère la Pu*te..",
      "@Julien Il était vachement grand Helmut Kohl @Fabien ou alors il était vraiment petit Mitterand @Kevin ils étaient vachement PD, ils se tiennent la main..."];

    for (var i = 0; i < fortunes.length; i++)
    {
      console.log(fortunes[i]);
      date = new Date();
      datetime = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();

      Fortune.insert({
        fortune: fortunes[i],
        date: datetime,
        timestamp: (new Date()).getTime(),
        score: 0
      });
    }
  }

});

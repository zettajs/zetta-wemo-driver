var zetta = require('zetta');
var Wemo = require('../index');

zetta()
  .expose('*')
  .use(Wemo)
  .listen(3000, function(err) {
    if(err) {
      console.log(err);
    }
    console.log('Listening on http://localhost:3000/');
  });

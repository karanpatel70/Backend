const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bycrypt = require('bcrypt');

app.use(cookieParser());
app.get('/', (req, res) => {
  res.cookie("name", "karan");
  res.send('done');
});

app.get('/getcookie', (req, res) => {
  bycrypt.genSalt(10, function(err, salt) {
    bycrypt.hash(req.cookies.name, salt, function(err, hash) {
      res.send(hash);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 

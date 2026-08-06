const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const bycrypt = require('bcrypt');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 

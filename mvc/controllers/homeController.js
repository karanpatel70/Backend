const Home = require("../models/homeModel");

exports.getHomePage = (req, res) => {
  const homes = Home.getAll();
  res.render("home", { homes });
};

exports.createHome = (req, res) => {
  const { title, location, price, description } = req.body;

  Home.add({
    title,
    location,
    price,
    description,
  });

  res.redirect("/");
};

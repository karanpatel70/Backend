let homes = [
  {
    id: 1,
    title: "Cozy Cabin",
    location: "Mountain View",
    price: 120,
    description: "A peaceful cabin near the hills.",
  },
  {
    id: 2,
    title: "Luxury Apartment",
    location: "Downtown",
    price: 250,
    description: "Modern apartment with city views.",
  },
];

module.exports = {
  getAll: () => homes,
  add: (home) => {
    homes.push({
      id: homes.length + 1,
      ...home,
    });
  },
};

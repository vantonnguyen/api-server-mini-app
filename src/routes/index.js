const newsRouter = require("./news.js");
function route(app) {
  app.use('/news', newsRouter);
  app.get("/", (req, res) => {
    res.render("home");
  });

  app.get("/search", (req, res) => {
    console.log("q value:", req.query.q);
    res.render("search");
  });

  app.get("/form", (req, res) => {
    res.render("form");
  });

  app.post("/submit", (req, res) => {
    const name = req.body.name;
    res.send(`Form submitted! Name: ${name}`);
  });
}
module.exports = route;

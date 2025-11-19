const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const session = require("express-session");
// express-handlebars v6+/v8 exports an `engine` function — import it by name
const { engine: exphbsEngine } = require("express-handlebars");
const port = 3000;
const route = require("./routes/index.js");
const { pool } = require("./config/db.js");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const vocabularyRoutes = require("./routes/vocabulary.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const progressRoutes = require("./routes/progress.routes");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://h5.zdn.vn",
      "https://mini.zalo.me",
      "https://n904dv9q-5173.asse.devtunnels.ms",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS
      sameSite: "lax", // không cần none vì cùng là HTTP
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    },
  })
);

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vocabularies", vocabularyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

app.engine(
  "hbs",
  exphbsEngine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

console.log("Path to views:", path.join(__dirname, "resources", "views"));
route(app);

app.listen(port, async () => {
  console.log(`Example app listening on port: http://localhost:${port}`);
  // const result = await pool.query('select * from zalo_user');
  // console.log('Database query result:', result.rows);
  // const result_2 = await pool.query('select * from vocabulary');
  // console.log('Database query result:', result_2.rows);
});

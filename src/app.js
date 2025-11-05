const path = require('path')
const express = require('express')
const app = express()
const morgan = require('morgan')
// express-handlebars v6+/v8 exports an `engine` function — import it by name
const { engine: exphbsEngine } = require('express-handlebars')
const port = 3000
const route = require('./routes/index.js')
const { pool } = require('./config/db.js')
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const vocabularyRoutes = require('./routes/vocabulary.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const progressRoutes = require('./routes/progress.routes');

// Register middleware early so they run for all routes (morgan must go before route handlers)
app.use(morgan('combined'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Mount API routes after middleware
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vocabularies', vocabularyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/progress', progressRoutes);

// Register the handlebars engine correctly (use the exported `engine`)
app.engine('hbs', exphbsEngine({
  extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

console.log('Path to views:', path.join(__dirname, 'resources', 'views'))
route(app)

app.listen(port, async () => {
  console.log(`Example app listening on port: http://localhost:${port}`)
  // const result = await pool.query('select * from zalo_user');
  // console.log('Database query result:', result.rows);
  // const result_2 = await pool.query('select * from vocabulary');
  // console.log('Database query result:', result_2.rows);
})

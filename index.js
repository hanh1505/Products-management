const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash")
require("dotenv").config();

const database = require("./config/database.js")
const route = require("./routes/client/index.route.js")
const routeAdmin = require("./routes/admin/index.route.js")

database.connect()
const systemConfig = require("./config/system.js")
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
//flash message
app.use(cookieParser("hanhdz"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//static files

app.use(express.static(`${__dirname}/public`));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
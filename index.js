let fs = require('fs');
let util = require('util');
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let artistRoutes = require('./routes/artist');

const database = "./artist.db";
const readFile = util.promisify(fs.readFile);
const expressHbs = require('express-handlebars');

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));  // middleware

// parse application/json
app.use(bodyParser.json()); // middleware

app.use(express.static(path.join(__dirname,'public')));

app.engine(
        'hbs',
        expressHbs({
        layoutsDir: 'views/layouts/',
        defaultLayout: 'main-layout',
        extname: 'hbs'
        })
    );
    app.set('view engine', 'hbs');
    app.set('views', 'views');

app.get('/' ,(req,res) => {
    readFile(database,"utf-8").
        then(data => {
            let artistsDB = JSON.parse(data);
            if (!artistsDB.hasOwnProperty('artist')) {
                artistsDB.artist = [];
            }
            res.render(path.join(__dirname,'views','lab5'), { pageTitle: 'Lab 5. Artist Directory', artist: artistsDB.artist});
        }).
        catch(e => console.log(e));
    });

app.use(artistRoutes);

app.listen(process.env.PORT || 3000);
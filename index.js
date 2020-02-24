let path = require('path');
let fs = require('fs');
let util = require('util');
let express = require('express');
let bodyParser = require('body-parser');

const expressHbs = require('express-handlebars');
const database = "./artist.db";
const readFile = util.promisify(fs.readFile);
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

app.post('/add' ,(req,res) => {
    let newArtist = new Object();
    newArtist.uid = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    newArtist.name = req.body.name;
    newArtist.desc = req.body.desc;
    newArtist.imgUrl = req.body.imgUrl;

    readFile(database,"utf-8").
        then(data => {
            let artistsDB = JSON.parse(data);
            if (!artistsDB.hasOwnProperty('artist')) {
                artistsDB.artist = [];
            }
            artistsDB.artist.push(newArtist);

            const newArtistDB = JSON.stringify(artistsDB);
            fs.writeFile(database, newArtistDB, "utf8", (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let result = '{"result": "true", "uid":"' + newArtist.uid + '"}';
                    res.send(result);
                }
            });
        }).
        catch(e => console.log(e));
    });

app.get('/search/:name' ,(req,res) => {
    name = req.params.name.substring(1, req.params.name.length);

    readFile(database,"utf-8").
        then(data => {
            let artistsDB = JSON.parse(data);
            let returnArtist = [];
            let re = new RegExp(name, "i");

            //delete artist
            for( var i = 0; i < artistsDB.artist.length; i++){
                let result = artistsDB.artist[i].name.search(re);
                if ( result > -1) {
                    returnArtist.push(artistsDB.artist[i]); 
                }
            }

            const returnArtistStr = JSON.stringify(returnArtist);
            let result = '{"result": "true", "artist":' + returnArtistStr + '}';
            res.send(result);
        }).
        catch(e => console.log(e));
    });
            
app.get('/delete/:uid' ,(req,res) => {
    uid = req.params.uid;

    readFile(database,"utf-8").
        then(data => {
            let artistsDB = JSON.parse(data);

            //delete artist
            for( var i = 0; i < artistsDB.artist.length; i++){
                let obj = artistsDB.artist[i];
                if ( obj.uid == uid) {
                    artistsDB.artist.splice(i, 1); 
                }
            }

            const newArtistDB = JSON.stringify(artistsDB);
            fs.writeFile(database, newArtistDB, "utf8", (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let result = '{"result": "true", "uid":"' + uid + '"}';
                    res.send(result);
                }
            });
        }).
        catch(e => console.log(e));
    });
    
app.get('/delete/:uid' ,(req,res) => {
    uid = req.params.uid;

    readFile(database,"utf-8").
        then(data => {
            let artistsDB = JSON.parse(data);

            //delete artist
            for( var i = 0; i < artistsDB.artist.length; i++){
                let obj = JSON.parse(artistsDB.artist[i]);
                if ( obj.uid === uid) {
                    artistsDB.artist.splice(i, 1); 
                }
            }

            const newArtistDB = JSON.stringify(artistsDB);
            fs.writeFile(database, newArtistDB, "utf8", (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let result = '{"result": "true", "uid":"' + uid + '"}';
                    res.send(result);
                }
            });
        }).
        catch(e => console.log(e));
    });
    
app.listen(process.env.PORT || 3000);
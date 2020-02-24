let fs = require('fs');
let util = require('util');
let express = require('express');
let router = express.Router();

const database = "./artist.db";
const readFile = util.promisify(fs.readFile);

router.post('/add' ,(req,res) => {
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

router.get('/search/:name' ,(req,res) => {
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
            
router.get('/delete/:uid' ,(req,res) => {
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
       
module.exports = router;
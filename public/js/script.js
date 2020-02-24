//configuration
const server = "http://localhost:3000";

//executed on load, to avoid global variables
(function() {
    let btnAddArtist = document.getElementById('btnToggleForm'); 
    let btnAdd = document.getElementById('btnAdd');
    let btnSearch = document.getElementById('btnSearch');
    
    //add event listeners
    btnAddArtist.addEventListener('click', toggleAddForm);
    btnAdd.addEventListener('click', addArtist);
    btnSearch.addEventListener('click', searchArtist);
})();

//toggle input form
function toggleAddForm() {
    var c = document.getElementById("addFormContainer");	//document.querySelector("#addFormContainer");
    if (c.style.display == "block") {
      c.style.display = "none";
	  clearAddFrom();
    } else {
      c.style.display = "block";
    }
}

//clear input form
function clearAddFrom() {
	document.getElementById("name").value = "";
	document.getElementById("desc").value = "";
	document.getElementById("imgUrl").value = "";
}

//search artist, case insensitive
function searchArtist() {
    //display searching artist
    let name = document.getElementById("searchName").value;

    fetch(server + '/search/s' + name).
        then((res) => res.json() ).   // obtain data as json
        then( (data) => { 
            //init
            hideArtists();
            if(data.result) {
                for (let i = 0; i < data.artist.length; i++){
                    addArtistToList(data.artist[i]);
                }
            } else {
                alert("Something wrong: Failed to save artist to database");
            }
        }).
        catch((err) => console.log(err));
}

//hide artists
function hideArtists() {
    var cards = document.getElementsByClassName("card");
    while(cards.length) {
      cards[0].remove();  
    }
}

//delete artist from database
function deleteArtist(btn) {
    var uid = btn.parentNode.id;
    fetch(server + '/delete/' + uid).
        then((res) => res.json() ).   // obtain data as json
        then( (data) => { 
            if(data.result) {
                btn.parentNode.remove();
            } else {
                alert("Something wrong: Failed to save artist to database");
            }
        }).
        catch((err) => console.log(err));
}

//add artist to database
function addArtist() {
    let artistInfo = new Object();
    artistInfo.name = document.getElementById("name").value;
    artistInfo.desc = document.getElementById("desc").value;
    artistInfo.imgUrl = document.getElementById("imgUrl").value;
    
	//verifying input values
	if(artistInfo.name.trim() == "") {
		alert("Please type: artist name");
		return;
	}
	if(artistInfo.desc.trim() == "") {
		alert("Please type: about artist");
		return;
	}
	if(artistInfo.imgUrl.trim() == "") {
		alert("Please type: url of artist's image");
		return;
	}

    //before adding artist, check if image exists
    imageExists(artistInfo.imgUrl,function() {
    
        fetch(server + '/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistInfo)      
        }).
        then((res) => res.json() ).   // obtain data as json
        then( (data) => { 
            if(data.result) {
                addArtistUI(data.uid);
            } else {
                alert("Something wrong: Failed to save artist to database");
            }
        }).
        catch((err) => console.log(err));
        
    },function() {
        alert("Please type: correct url of artist's image.\nThe image url you typed does not exist.");
        return;
    });

}

//add artist to UI
function addArtistUI(uid) {

    let name = document.getElementById("name").value;
    let desc = document.getElementById("desc").value;
    let imgUrl = document.getElementById("imgUrl").value;
    
    //save into local storage
    var artist = new Object();
    artist.uid = uid;
    artist.name = name;
    artist.desc = desc;
    artist.imgUrl = imgUrl;

    //display artist
    addArtistToList(artist);

    //hide & clear fields
    toggleAddForm();
}

function imageExists(image_url, good, bad){
    var img = new Image();
    img.onload = good; 
    img.onerror = bad;
    img.src = image_url;
}

function addArtistToList(o) {
    let name = o.name;
    let desc = o.desc;
    let imgUrl = o.imgUrl;
    let uid = o.uid;
    
    //div
    let node = document.createElement("div");
    node.setAttribute("class", "card clearfix");
    node.setAttribute("id", uid);
    
    //img
    let imgNode = document.createElement("img");
    imgNode.setAttribute("src", imgUrl);
    node.appendChild(imgNode);
    
    //span
    let spanNode = document.createElement("span");
    //name
    let nameNode = document.createElement("p");
    nameNode.setAttribute("class", "artist_name");
    nameNode.textContent = name;
    spanNode.appendChild(nameNode);
    //desc
    let descNode = document.createElement("p");
    descNode.setAttribute("class", "artist_desc");
    descNode.textContent = desc;
    spanNode.appendChild(descNode);
    node.appendChild(spanNode);
    
    //button
    let btnNode = document.createElement("button");
    btnNode.setAttribute("class", "btnDeleteArtist");
	btnNode.setAttribute("onclick","deleteArtist(this)");
    btnNode.textContent = "Delete";
    node.appendChild(btnNode);
    
    //Append and display
    let parent = document.getElementById("list");
    parent.appendChild(node);
}
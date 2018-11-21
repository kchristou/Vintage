
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        //TODO If response received (success).
        object = JSON.parse(this.responseText);
        console.log(this.responseText);
        var THchallenge = document.getElementById("Sample")
        for (var i = 0; i < object.treasureHunts.length; i++) {
            var newTreasureHunt = document.createElement("p");
            var linkElement = document.createElement("a");
            linkElement.innerHTML = object.treasureHunts[i].name;
            linkElement.href = "PlayPage.html";
            THchallenge.appendChild(newTreasureHunt);
            newTreasureHunt.appendChild(linkElement);
        }
    }
    else {
        //TODO If response not received (error).
    }
};
xhttp.open("GET", "https://codecyprus.org/th/api/list", true);
xhttp.send();
function LeaderBoard(){
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
            linkElement.href = "LeaderBoard.html";
            THchallenge.appendChild(newTreasureHunt);
            newTreasureHunt.appendChild(linkElement);

        }
        document.cookie = object.treasureHunts[0].uuid;
    } else {
        //TODO If response not received (error).
    }
};

xhttp.open("GET", "https://codecyprus.org/th/api/leaderboard", true);
xhttp.send();
}

function list() {
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
            document.cookie = object.treasureHunts[0].uuid;
        } else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/list", true);
    xhttp.send();

    function Submit() {
        document.getElementById("Submit").onclick = function saveCredentials() {
            var Username = document.getElementById("Username");
            var appName = document.getElementById("AppName");
            start(Username.value, appName.value);
        };
    }
}
function start(Username, appName){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            if(object.status==="error"){
            alert(object.errorMessege);

            } else{
                document.cookie=object.session;
                window.location.href="AnswerSheet.html";
            }
        }
        }  ;
    xhttp.open("GET", "https://codecyprus.org/th/api/start?player= "+uName + "Appname= "+appName+"&treasure-hunt-id="+getCookie("uuid"));
    xhttp.send();

}

function questions(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            if(object.currentQuestionIndex === object.numOfQuestions){




            }
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/question", true);
    xhttp.send();

}
console.log(Submit(Username,appName));
questions();

//list();
//start();
//LeaderBoard();
//console.log(document.cookie);
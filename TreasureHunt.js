function list() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            for (let i = 0; i < object.treasureHunts.length; i++) {
                var treasureHuntsDiv = document.getElementById("Sample");
                var treasureHunt = document.createElement("p");
                var thLink = document.createElement("a");
                thLink.innerHTML = (i + 1) + ". " + object.treasureHunts[i].name;
                thLink.href = "PlayPage.html";
                treasureHunt.appendChild(thLink);
                treasureHuntsDiv.appendChild(treasureHunt);
            }

            document.cookie = "uuid=" + object.treasureHunts[0].uuid+";";
            console.log(Cookie);
            console.log(document.cookie);

        }
        else {
            //TODO If response not received (error).
        }
    };

    xhttp.open("GET", "https://codecyprus.org/th/api/list", true);
    xhttp.send();
}

function Submit() {
        var Username = document.getElementById("Username").value;
        var appName = document.getElementById("AppName").value;
        console.log(Username);
        console.log(appName);
        start(Username, appName);
}

function start(Username, appName) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            object = JSON.parse(this.responseText);
            if (object.status === "ERROR") {
                alert(object.errorMessages);
            }
            else {

                let now = Date.now();
                now+= 300000;

                document.cookie = "session=" + object.session + "; expires=" + now;
                window.location.href = "AnswerSheet.html";
            }
        }
        else {
            //TODO If response not received (error).
        }
    };


    xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + Username + "&app=" + appName + "&treasure-hunt-id=" + Cookie('uuid'), true);
    xhttp.send();
}

function question() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            let object = JSON.parse(this.responseText);
            //If the questions are over send to leaderboard page.
            if (object.completed) {
                window.location.href = "Leaderboard.html";
            }
            
            if (object.currentQuestionIndex === object.numOfQuestions)
                // document.cookie = "session=" + Cookie("uuid");

                
            //Get location if needed
            if (object.requiresLocation === true) {
                object=JSON.parse(this.responseText);
                getLocation();

            }
            console.log(object);
            var QuestionText = document.getElementById("TextQuestion");
            QuestionText.innerHTML = "<p id='QuestionText'>" + object.questionText + "</p>";


            if (object.questionType === "MCQ") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "A<input class='mcq' type='radio' name='answer' value='A'>" +
                    "B<input class='mcq' type='radio' name='answer' value='B'>" +
                    "C<input class='mcq' type='radio' name='answer' value='C'>" +
                    "D<input class='mcq' type='radio' name='answer' value='D'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='mcqAnswer()'>" +
                    "<button class=\"Button\" type=\"button\"> <img class=\"ButtonImg\" src=\"SkipButton.PNG\" /></button>" +
                    "</form>";
            } else if (object.questionType === "TEXT") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "Your Answer: <input id='AnswerElement' type='text' name='answer' placeholder='Answer here...'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='textAnswer()'>" +
                    "<input type='button' name='skip' value='skip' onclick ='Skip()'>" + "</form>";

            } else if (object.questionType === "INTEGER") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "Your Answer: <input id='AnswerElement' type='number' step='number' name='answer' placeholder='Answer here...'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='textAnswer()'>" +
                    "<input type='button' name='skip' value='skip' onclick ='Skip()'>" + "</form>";
            } else if (object.questionType === "BOOLEAN") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "true<input class='bool' type='radio' name='answer' value='true'>" +
                    "false<input class='bool' type='radio' name='answer' value='false'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='boolAnswer()'>" +
                    "<input type='button' name='skip' value='skip' onclick ='Skip()'>" + "</form>";
            } else if (object.questionType === "NUMERIC") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "Your Answer: <input id='AnswerElement' type='number' step='any' name='answer'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='textAnswer()'>" +
                    "<input type='button' name='skip' value='skip' onclick ='Skip()'>" + "</form>";
            }

        } else {
            //TODO If response not received (error).
        }
    };

    let cookie = document.cookie;
    let cookieContents = cookie.split(";");
    let session;
    for (let i = 0; i <cookieContents.length ; i++) {
        let key = cookieContents[i].split("=")[0].trim();
        let val = cookieContents[i].split("=")[1].trim();
        if (key==="session"){
            session = val;
        }
    }

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + session, true);
    xhttp.send();

}

//Handles text,number and numeric questions.
function textAnswer() {
    var answerForm = document.getElementById("AnswerElement");
    var answer = answerForm.value;
    console.log(answer);
    if (answer === "")
        alert("Type an answer");
    else {
        Answer(answer);
    }

}

//Handles yes/no and multiple choice questions.
function mcqAnswer() {
    //Get answer from The user
    var rButtons = document.getElementsByClassName("mcq");
    for (let i = 0; i < rButtons.length; i++) {
        if (rButtons[i].checked)
            var answer = rButtons[i].value;
    }
    console.log(answer);
    if (answer === undefined)
        alert("Choose an answer.");
    else
        Answer(answer);
}

function boolAnswer() {
    //Get answer from The user
    var rButtons = document.getElementsByClassName("bool");
    for (let i = 0; i < rButtons.length; i++) {
        if (rButtons[i].checked)
            var answer = rButtons[i].value;
    }
    console.log(answer);
    if (answer === undefined)
        alert("Choose an answer.");
    else
        Answer(answer);
}


function Answer(answer) {
    // location.reload();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            console.log(object.correct);
            if (object.correct === true) {
                console.log(this.responseText);
                question();
            }
            else {
               // alert("Wrong, -3 points, Try again.");
                //Score();
            }
        }
        else {
            //TODO If response not received (error).
        }
    };

    let cookie = document.cookie;
    let cookieContents = cookie.split(";");
    let session;
    for (let i = 0; i <cookieContents.length ; i++) {
        let key = cookieContents[i].split("=")[0].trim();
        let val = cookieContents[i].split("=")[1].trim();
        if (key==="session"){
            session = val;
        }
    }

    xhttp.open("GET", "https://codecyprus.org/th/api/answer?session=" + session + "&answer=" + answer,true);
    xhttp.send();
}

//Shows the name of the player and their score.
function Score() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            var ScoreDiv = document.getElementsByClassName("Score");
            ScoreDiv.innerHTML = "<p>" + 'Player: ' + object.player + ' Score: ' + object.score + "</p>";
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/score?session=" + 'session', true);
    xhttp.send();
}

//Checks whether the question can be skipped.
function Skip() {
    var  xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            if (object.canBeSkipped === true) {
                skipq()
            }
            else {
                alert("This question can not be skipped.")
            }
        }
        else {
            //TODO If response not received (error).
        }
    };
    let cookie = document.cookie;
    let cookieContents = cookie.split(";");
    let session;
    for (let i = 0; i <cookieContents.length ; i++) {
        let key = cookieContents[i].split("=")[0].trim();
        let val = cookieContents[i].split("=")[1].trim();
        if (key==="session"){
            session = val;
        }
    }

    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + session, true);
    xhttp.send();
}

function skipq() {
    if (confirm('You will lose 5 points, are you sure you want to skip?')) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                //TODO If response received (success).
                question();
            }
            else {
                //TODO If response not received (error).
            }
        };
        let cookie = document.cookie;
        let cookieContents = cookie.split(";");
        let session;
        for (let i = 0; i <cookieContents.length ; i++) {
            let key = cookieContents[i].split("=")[0].trim();
            let val = cookieContents[i].split("=")[1].trim();
            if (key==="session"){
                session = val;
            }
        }

        xhttp.open("GET", "https://codecyprus.org/th/api/skip?session=" + session, true);
        xhttp.send();
    }
}

//Still a work in progress
function getLocation() {
    if (navigator.geolocation) {

        console.log(navigator.geolocation.getCurrentPosition(location));

    }

    function location(location) {
        console.log(location.coords.longitude);
        console.log(location.coords.latitude);

    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            object = JSON.parse(this.responseText);
            console.log(object);
        } else {
            //TODO If response not received (error).
        }
    };
//TODO get actual location from mobile device.
    xhttp.open("GET", "https://codecyprus.org/th/api/location?session=" + 'session' + "&latitude=35.00829" + "&longitude=33.697047", true);
    xhttp.send();
}
function Leaderboard() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            console.log(object.leaderboard);
            for (let i = 0; i < object.numOfPlayers; i++) {
                var Leaderboard = document.getElementById("LeaderBoard");
                var Leaderboardindex = document.createElement("p");
                Leaderboardindex.innerHTML = "Position: " + (i + 1) + "<br>" + "Name: " + object.leaderboard[i].player + "<br>";
                Leaderboardindex.innerHTML += " Score: " + object.leaderboard[i].score;
                Leaderboard.appendChild(Leaderboardindex);
            }

        }
        else {
            //TODO If response not received (error).
        }
    };
    let cookie = document.cookie;
    let cookieContents = cookie.split(";");
    let session;
    for (let i = 0; i <cookieContents.length ; i++) {
        let key = cookieContents[i].split("=")[0].trim();
        let val = cookieContents[i].split("=")[1].trim();
        if (key==="session"){
            session = val;
        }
    }

    xhttp.open("GET", "https://codecyprus.org/th/api/leaderboard?session="+session+ "&sorted&limit=5", true);
    xhttp.send();
}

//If cookie exists then direct to questions (still in development)
/*function checkSession() {
    console.log(Cookie("session"));
    if (Cookie("uuid") !== undefined) {
        if (confirm('You left a game in progress! Do you want to resume?')) {
            window.location.href = "AnswerSheet.html";
        }
        else {
            //Expire the session cookie.
            document.cookie = "session=" + Cookie("uuid") + "; expires=Thu, 01 Jan 2000 00:00:01 GMT";
        }
    }
}*/

//function to access the value of a specific cookie by name from stack overflow.
function Cookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}
//---> Reference for the above function: https://stackoverflow.com/questions/10730362/get-cookie-
// by-name?fbclid=IwAR11_jXjhMgY4hs90pYjQm8f4ua5O1Ev90WhH6zZJlmgvs8a8LnAYIVUEb0



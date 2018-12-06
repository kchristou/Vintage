const AppName="App_Vintage";

function list() {  //function that calls the /list. the function receives the lists from the server
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
                thLink.href = "PlayPage.html?uuid=" + object.treasureHunts[i].uuid;
                treasureHunt.appendChild(thLink);
                treasureHuntsDiv.appendChild(treasureHunt);
            }


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

function setCookie(uuid){ //Funtion that set cookies to save the uuid
    document.cookie = "uuid=" + uuid;
}

function Submit() {  // function that get the username and submit it to the server
        var Username = document.getElementById("Username").value;

        console.log(Username);

        start(Username);
}

function start(Username) {  // function that takes the username  from the user
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            object = JSON.parse(this.responseText);
            console.log("error messeges" + object.errorMessages);
            if (object.status === "ERROR") { // sends error
                alert(object.errorMessages);
            }
            else {

                let now = Date.now(); //get the date on Now
                now+= 300000;

                document.cookie = "session=" + object.session + "; expires=" + now;
                window.location.href = "AnswerSheet.html";
            }
        }
        else {
            //TODO If response not received (error).
        }
    };


    xhttp.open("GET", "https://codecyprus.org/th/api/start?player=" + Username + "&app=" + AppName + "&treasure-hunt-id=" + currentUUID, true);
    xhttp.send();
}

function question() { //Function that receives the questions from the server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            let object = JSON.parse(this.responseText);
            //If the questions are over send to leaderboard page.
            if (object.completed) { //checks if the quizes are completed and opens the leaderboard
                window.location.href = "Leaderboard.html";
            }

            let scoreAdjustment = Number(getCookie("scoreAdjustment")); //save the score in cookies and +- depending on the answer
            console.log("scoreAdjustment: " + scoreAdjustment );
            let scoreElement = document.getElementById("Score");
            scoreElement.innerHTML = scoreAdjustment;
            
            if (object.currentQuestionIndex === object.numOfQuestions)
                // document.cookie = "session=" + Cookie("uuid");
            console.log(object);
                
            //Get location if needed by the question
            if (object.requiresLocation === true) {
                if (confirm("The next question requires location. Do you want to give your location?")) {
                    getLocation();
                    object = JSON.parse(this.responseText);
                }
            }
            console.log(object);
            var QuestionText = document.getElementById("TextQuestion");
            QuestionText.innerHTML = "<p id='QuestionText'>" + object.questionText + "</p>";

            //all the possible types of questions + the types of answers that are available
            if (object.questionType === "MCQ") {
                let QDiv = document.getElementById("TypeOfQuestion");
                QDiv.innerHTML = "<form id='AnswerForm'>" +
                    "A<input class='mcq' type='radio' name='answer' value='A'>" +
                    "B<input class='mcq' type='radio' name='answer' value='B'>" +
                    "C<input class='mcq' type='radio' name='answer' value='C'>" +
                    "D<input class='mcq' type='radio' name='answer' value='D'>" +
                    "<input class='ansButton' type='button' name='answer' value='submit' onclick ='mcqAnswer()'>" +
                    "<input type='button' name='skip' value='skip' onclick ='Skip()'>" + "</form>";
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
        alert("Type the answer");
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
//HANDLES t/f
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
//cookies that saves name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function Answer(answer) {
     //location.reload();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            console.log(object.correct);
            if (object.status === "OK") { //if status=ok then +/- the score

                let scoreAdjustment = Number(getCookie("scoreAdjustment"));
                scoreAdjustment += object.scoreAdjustment;
                document.cookie = "scoreAdjustment=" + Number(scoreAdjustment);
                let scoreElement = document.getElementById("Score");
                scoreElement.innerHTML = scoreAdjustment;

                if (object.correct === true) {
                    console.log(this.responseText);
                    question();
                    Score();
                }
                else { //if the answer is wrong it sends a wrong message
                    alert("Wrong answer! Please Try again.");
                    Score();
                }


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
        if (key==="session"){ //gets the session
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


function Leaderboard() { //function that contains the leaderboard contents(score name etc)

    var Leaderboard = document.getElementById("LeaderBoard");
    var Leaderboardindex = document.createElement("p");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);

            var leaderboardHTML = "";

            for (let i = 0; i < object.leaderboard.length; i++) {
                leaderboardHTML += "Position: " + (i + 1) + "<br>" + "Name: " + object.leaderboard[i].player + "<br>";
                leaderboardHTML += " Score: " + object.leaderboard[i].score + "<br><br>";
            }

            Leaderboardindex.innerHTML = leaderboardHTML;
            Leaderboard.appendChild(Leaderboardindex);

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

    xhttp.open("GET", "https://codecyprus.org/th/api/leaderboard?session="+session+ "&sorted&limit=30", true);
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
    if (confirm('You will lose  points, are you sure you want to skip?')) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                console.log(this.responseText);
                var object = JSON.parse(this.responseText);


                //TODO If response received (success).
                if (object.status === "OK") {
                    console.log("Score adjustment: " + object.scoreAdjustment);
                    let scoreAdjustment = Number(getCookie("scoreAdjustment"));
                    scoreAdjustment += object.scoreAdjustment;
                    document.cookie = "scoreAdjustment=" + Number(scoreAdjustment);
                    let scoreElement = document.getElementById("Score");
                    scoreElement.innerHTML = scoreAdjustment;
                }
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



function Cookie(name) { //cookie for the score Adjustment
    var value = "; " + document.cookie;
    var scoreAdjustment = 0;
    document.cookie = "scoreAdjustment=" + scoreAdjustment;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}


//Get the location from the client.
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    function showPosition(position) {
        console.log("latitude: " + position.coords.latitude); //To check if the location is get by the server
        console.log("longitude: " + position.coords.longitude);
        sendLocation(position.coords.latitude, position.coords.longitude);
    }
}

//Send the location to the server.
function sendLocation(latitude,longitude) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            console.log("location received!");
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/location?" +
        "session=" + Cookie("session") + "&latitude=" + latitude + "&longitude=" + longitude, true);
    xhttp.send();
}


//Shows the name of the player and their score.
function score() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            var scoreDiv = document.getElementById("score");
            scoreDiv.innerHTML ="<p>" + 'Player: ' + object.player + "<br>" + ' Score: ' + object.score + "</p>";
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/score?session=" + Cookie("session"), true);
    xhttp.send();

    //Show current question number / last question number.
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            //TODO If response received (success).
            object = JSON.parse(this.responseText);
            var currentQuestion = parseInt(object.currentQuestionIndex) + 1;
            var scoreDiv = document.getElementById("score");
            scoreDiv.innerHTML+= "Questions: " + currentQuestion + "/" + object.numOfQuestions;
        }
        else {
            //TODO If response not received (error).
        }
    };
    xhttp.open("GET", "https://codecyprus.org/th/api/question?session=" + Cookie("session"), true);
    xhttp.send();
}

function checkSession() {
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
}
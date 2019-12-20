/*
Name: Anas Ahmed
Email: anas_ahmed@student.uml.edu
HW9: Scrabble Board
 */

var rack_letters = 0;
var images = "";
var tcount = 0;
var total_score = 0;
var word = new Array(8); // The board where you put the tiles. this is for tletter_racking the word
var scores = [
    {"letter": "A", "value": 1, "amount": 9},
    {"letter": "B", "value": 3, "amount": 2},
    {"letter": "C", "value": 3, "amount": 2},
    {"letter": "D", "value": 2, "amount": 4},
    {"letter": "E", "value": 1, "amount": 12},
    {"letter": "F", "value": 4, "amount": 2},
    {"letter": "G", "value": 2, "amount": 3},
    {"letter": "H", "value": 4, "amount": 2},
    {"letter": "I", "value": 1, "amount": 9},
    {"letter": "J", "value": 8, "amount": 1},
    {"letter": "K", "value": 5, "amount": 1},
    {"letter": "L", "value": 1, "amount": 4},
    {"letter": "M", "value": 3, "amount": 2},
    {"letter": "N", "value": 1, "amount": 5},
    {"letter": "O", "value": 1, "amount": 8},
    {"letter": "P", "value": 3, "amount": 2},
    {"letter": "Q", "value": 10, "amount": 1},
    {"letter": "R", "value": 1, "amount": 6},
    {"letter": "S", "value": 1, "amount": 4},
    {"letter": "T", "value": 1, "amount": 6},
    {"letter": "U", "value": 1, "amount": 4},
    {"letter": "V", "value": 4, "amount": 2},
    {"letter": "W", "value": 4, "amount": 2},
    {"letter": "X", "value": 8, "amount": 1},
    {"letter": "Y", "value": 4, "amount": 2},
    {"letter": "Z", "value": 10, "amount": 1}
] //for scores


$(document).ready(function () {
    populateBoard(); //randomly populates the board with tiles
    JQueryDragDrop(); //initializes the draggables and droppables

});

function newTiles()
{
    if(document.getElementById('messages').innerHTML === "You have submitted a correct word! Congratulations.")
    {
        total_score += parseInt(document.getElementById('score').innerHTML);
        document.getElementById('totalscore').innerHTML = "Total score: " + total_score;
        restart();
    }else{
        alert("Please submit a valid word and try again");
    }

}

function continuePlaying(){
    if(document.getElementById('messages').innerHTML === "You have submitted a correct word! Congratulations.")
    {
        total_score += parseInt(document.getElementById('score').innerHTML);
        document.getElementById('totalscore').innerHTML = "Total score: " + total_score;
        populateBoard();
    }else{
        alert("Please submit a valid word and try again");
    }
}
/**
 * *
 * @param word to convert into score using the array values in scores
 */
function updateScore(word) {
    var totalScore = 0;
    var scoreToAdd = 0;
    var doubleword = 0;
    //look through the array
    for (var i = 0; i < word.length; i++) {
        //find the letter in the scores array
        for (var j = 0; j < scores.length; j++) {
            //if it's here
            if (word[i] != "" && (word[i] == scores[j].letter)) {
                //if i == 2 (double letter score) then double the value
                if (i == 2) {
                    scoreToAdd = scores[j].value * 2;
                    totalScore += scoreToAdd;
                }if (i == 5) {
                    doubleword++;
                    scoreToAdd = scores[j].value;
                    totalScore += scoreToAdd;
                }if(i!=2 && i != 5) //else, just add the score normally
                {
                    totalScore += scores[j].value;
                }
            }
        }
    }
    if(doubleword!=0)
    {
        totalScore = totalScore * 2;
    }
    //put it in the score div
    document.getElementById('score').innerHTML = totalScore.toString();
}

/**
 * draggable and droppable stuff
 * @constructor
 */
function JQueryDragDrop() {
    //allow the tiles to be dropped back on the letter_rack
    $("#letter_rack").droppable({accept: '.letter_rack_blocks', out: Letters});

    /**
     * minuses leters from the deck
     * @param event
     * @param ui
     * @constructor
     */
    function Letters(event, ui) {
        rack_letters--;
    }

    //letter_rack blocks (the letters) are draggable and snap to board blocks in the inside, if it's not a valid droppable then revert
    $(".letter_rack_blocks").draggable({snap: ".board_blocks", snapMode: "inner", revert: 'invalid'});

    //if they're being dragged , make that array slot blank
    function Drag(event, ui) {
        if (ui.draggable.attr("id") == word[$(this).attr("id")]) {
            //remove tile from board
            word[$(this).attr("id")] = ""; //make it blank
            //tcount++;
        }
        updateWord(word);
    }

    // You can drag the letter_rack blocks onto the board(.board_blocks)
    $(".board_blocks").droppable({accept: '.letter_rack_blocks', drop: Drop, out: Drag});

    // Run this function when a tile is dropped
    function Drop(event, ui) {
        var letter = ui.draggable.prop('id');          // Take the ID of the draggable(letter tile) and assign it to letter
        var element = $(this).attr("id");              // Take the ID of the droppable(the board tile) and assign it to element
        var number = parseInt(element);                 // Make sure it's an int and not a string
        // A tile is added, increment tcount
        tcount++;
        // THIS CODE IS NOT WORKING ENTIRELY
        if (typeof word[number - 1] === 'undefined' && typeof word[number + 1] === 'undefined' && tcount < 1) {
            console.log();
            console.log("tcount is:" + tcount);
            ui.draggable.draggable({revert: true});
        } else {
            word[number] = letter;
            updateWord(word);
        }


    }
}

function newGame()
{
    restart();
    document.getElementById('totalscore').innerHTML = "";
}

// Sets up the board with tiles
function populateBoard() {
    var letter;
    var random;
    var lettersToAdd = 7 - rack_letters;

    lockWord();
    //we want seven tiles so add seven
    for (var i = 0; i < lettersToAdd; i++) {
        random = Math.floor((Math.random() * 25));      // random number 1-25
        letter = scores[random].letter;                 // letter = the letter at the random spot in the scores array
        console.log(random);
        $("#letter_rack").append(" <img id=\"" + letter + "\" class=\"letter_rack_blocks\" src=\"images/" + letter + ".png\">") //dynamically create images in the #letter_rack div
        rack_letters++;
    }

    console.log(images);

    JQueryDragDrop(); // Refresh the draggable code
}

// Locks the word on the board and ensures it will not move
function lockWord() {
    var object = "";
    // Goes through the entire word
    for (var i = 0; i <= word.length; i++) {
        //if the word slot isnt a letter do nothing
        if (typeof word[i] === 'undefined') {

        } else { //if it's a letter find that ID and make it undraggable (locked)
            $("#" + word[i]).draggable('disable')
        }
    }

}


function updateWord(varDraggableId) {
    var currentword = "";
    for (var i = 0; i < varDraggableId.length; i++) {
        if (typeof varDraggableId[i] === 'undefined') {

        } else {
            currentword += varDraggableId[i];
        }
    }
    if (currentword) {
        document.getElementById('word').innerHTML = currentword;
        updateScore(word);
    }
    submitWord();
}

// Restarts the board
function restart()
{
    var letter;
    var random;
    var lettersToAdd  = 7;
    var string ="";

    rack_letters = 7;

    for(var i =0; i<word.length;i++)
    {
        word[i]="";
    }

    //we want seven tiles so add seven
    for(var i = 0; i < 7; i++)
    {
        random = Math.floor((Math.random() * 25));      //random number 1-25
        letter = scores[random].letter;                 //letter = the letter at the random spot in the scores array
        console.log(random);
        string = string + (" <img id=\""+ letter + "\" class=\"letter_rack_blocks\" src=\"images/" + letter + ".png\">"); //dynamically create images in the #letter_rack div
    }

    console.log(images);

    document.getElementById('letter_rack').innerHTML = string;
    JQueryDragDrop(); //refresh the draggable code

    document.getElementById('score').innerHTML = " ";
    document.getElementById('word').innerHTML = " ";
    document.getElementById('messages').innerHTML = " ";

}

// The dictionary lookup object
var dict = {};

// Do a jQuery Ajax request for the text dictionary
$.get( "~/dict/dictionary.txt", function( txt ) {
    // Get an array of all the words
    var words = txt.split( "\n" );

    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < words.length; i++ ) {
        dict[ words[i] ] = true;

    }
});

// Submits the word for checking
function submitWord(){

    findWord();
    var submittedWord = document.getElementById('word').innerHTML;
    console.log("submitted word: " + submittedWord);
    submittedWord = submittedWord.toLowerCase();
    if ( dict[submittedWord] ) {
        console.log("this is a real word: " + submittedWord);
        document.getElementById('messages').innerHTML = 'You have submitted a correct word! Congratulations.';

    }else{
        document.getElementById('messages').innerHTML = 'The word you have submitted is not a real word, sorry.';
        console.log("this is a not a real word.");
    }

}
// Searches for the word in the dictionary file
function findWord( word ) {
    // See if it's in the dictionary
    if ( dict[ word ] ) {
        // If it is, return that word
        return word;
    }

    // Otherwise, it isn't in the dictionary.
    return "_____";
}

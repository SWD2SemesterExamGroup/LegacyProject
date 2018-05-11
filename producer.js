
let stompit = require('stompit');
/*require('jsdom').window("",function(error, window) {
    if (error) {
        console.log(error);
        return;
    }
    let $ = require('jquery')(window);
});*/

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

var connectOptions = {
    'host': 'localhost',
    'port': 61613,
    'connectHeaders':{
      'host': '/',
      'login': 'admin',
      'passcode': 'admin',
      'heart-beat': '5000,5000'
    }
  };
function send(divEL) {
    console.log(divEL); 
stompit.connect(connectOptions, function(error, client) {
    console.log('30 producer');
    if (error) {
      console.log('connect error ' + error.message);
      return;
    }
    console.log('35 producer');
    var sendHeaders = {
      'destination': '/topic/dk.godkode.html', 
      'content-type': 'text/plain',
      'ack': 'client-individual'
    };
    // problems do we get the message?
    var frame = client.publish(sendHeaders);
    frame.write('hello');
    frame.end();
    console.log('45 producer');
    var subscribeHeaders = {
        'destination': '/topic/dk.godkode.html',
        'ack': 'client-individual'
      };
      console.log('50 producer');
      
      client.subscribe(subscribeHeaders, function(error, message) {
        console.log('52 producer');
        if (error) {
          console.log('subscribe error ' + error.message);
          return;
        }
        
        message.readString('utf-8', function(error, body) {
            console.log('59 producer');
          if (error) {
            console.log('read message error ' + error.message);
            return;
          }
          console.log('64 producer');
          console.log('received message: ' + body);
        });
        console.log('68 producer');
        client.ack(message);
        client.disconnect();
    });
    console.log('70 producer');

  //  client.disconnect();
});

}

let reader; //GLOBAL File Reader object for demo purpose only
let divEL = {innerHTML: ''}; // GLOBAL: So i can write to it any where

var spreadsheetID = "14_HLgko6zg7R8CgcD7fZWuSQ5phmVMrjslwNkAhehpY";

var eventCounter = 5; // +1 is a whole week / add +1 to skip a week (from tuesday to tuesday)

function eventProgess() {
    // event start on 3 and every event takes out 8 spaces
    //console.log(3 + 8 * eventCounter);
    return (3 + 8 * eventCounter);
}

/**
 * Check for the various File API support.
 */
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }

}

function displayContent() {
    divEL.innerHTML='';
    // Get data and rework to data Array
    console.log('producer 67');
    readSheet();
    
}

var countCell = 0;

// Main HTML builder
// Parameter single Array with max length of 7
function htmlReturn(txt) {
    var valueReturn = "";

    // This is the Div of the coloum.. :)
    valueReturn += "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-4 borderMeTop'>";

    var title = "<H4>" + txt[2] + "</H4>";

    var status = "<ul><li><b>Status: </b>" + txt[1] + "</li>";
    var time = "<li><b>Date: </b>" + txt[0] + "</li>";
    var room = "<li><b>Room: </b>" + txt[6] + "</li>";
    var who = "<li><b>Who: </b> " + txt[7] + "</li>";

    var invited = "<li><b>Invited: </b> " + txt[5] + "</li>";

    var description = "<li><b>Description: </b></li>" + txt[3];

    valueReturn += title + "" +
        status + "" +
        time + "" +
        room + "" +
        who + "" +
        invited + "" +
        description;
    valueReturn += "</ul>";
    valueReturn += "</div>";

    if (txt[2].length > 0) {
        valueReturn = valueReturn;
        countCell++;
    } else if (txt[2] <= 0) {
        valueReturn = "";
    }

    // Html build DONE 

    return valueReturn;
}

// data put in eventDataArray
// BUILD: HTML from here
// All data lost after getJSON
function getValue(event) {
    if (countCell % 3 == 0) {
        divEL.innerHTML += "<div class='row'>";
        //console.log("Start row");
    }

    divEL.innerHTML += htmlReturn(event);

    if (countCell > 2 && countCell % 3 == 2) {
        // End Row
        divEL.innerHTML += "</div>";
        //console.log("End row");
    } else if (countCell == 2) {
        // End Row
        divEL.innerHTML += "</div>";
        //console.log("End row");
    }
}


// New reader from 
// SOURCE: https://ctrlq.org/code/20004-google-spreadsheets-json
function readSheet() {

    // ID of the Google Spreadsheet
    // var spreadsheetID = "1kyftHPSQ6t_YRkTD__kS78QlOPYENnGRRmwx_pGZQpY";

    // Make sure it is public or set to Anyone with link can view 
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

    //console.log(url3);
    var dataHolderOfArrays = [];

    $.getJSON(url, function(data) {

        if (typeof(data) == null) {
            console.log("Data == null");
        }
        var entry = data.feed.entry;
        //console.log("The Entry of the call back by url. FIND sheet former!!!");
        //console.log(entry);

        for (var i = eventProgess(); i < entry.length; i++) {

            var dataHolderArray = [];
            var counterArrat = 0;

            var date = entry[i].gsx$day.$t + " " + entry[i].gsx$info.$t;
            dataHolderArray[counterArrat] = date;
            counterArrat++;

            i++;
            // i = 4

            // status
            dataHolderArray[counterArrat] = isData(entry[i].gsx$info);
            counterArrat++;

            // title
            dataHolderArray[counterArrat] = isData(entry[i].gsx$title);
            counterArrat++;

            // description;
            dataHolderArray[counterArrat] = isData(entry[i].gsx$description);
            counterArrat++;

            i++;
            // i = 5

            // time
            dataHolderArray[counterArrat] = isData(entry[i].gsx$info);
            counterArrat++;
            //var time = entry[i].gsx$_cx0b9.$t;
            i++;
            // i = 6

            // invite
            dataHolderArray[counterArrat] = isData(entry[i].gsx$info);
            counterArrat++;

            //var invite = entry[i].gsx$_cpzh4.$t;
            i++;
            // i = 7

            // room
            dataHolderArray[counterArrat] = isData(entry[i].gsx$info);
            counterArrat++;

            i++;
            // i = 8

            // company/who
            dataHolderArray[counterArrat] = isData(entry[i].gsx$info);

            i += 2;
            // i = 10
            //console.log("dHA: " + dataHolderArray)
            getValue(dataHolderArray);

        } // i = 11

        //console.log(dataHolderOfArrays);

        // display content
        //console.log(dataHolderOfArrays);
       // console.log(divEL);
        send(divEL.innerHTML);
    });
    //console.log(divEL);
    //sendData(divEL);
}

function isData(cell) {
    if (cell) {
        return cell.$t;
    }
    return " ";
}






module.exports = {
    produce: displayContent()

    
}

    
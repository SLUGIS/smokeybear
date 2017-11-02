
function init()
{
	updateSmokey();
}

function low() 
{
    document.getElementById("smokey").setAttribute('src', './img/low.png');
}

function moderate() 
{
    document.getElementById("smokey").setAttribute('src', './img/moderate.png');
}

function high() 
{
    document.getElementById("smokey").setAttribute('src', './img/high.png');
}

function veryhigh() 
{
    document.getElementById("smokey").setAttribute('src', './img/veryhigh.png');
}

function extreme() 
{
    document.getElementById("smokey").setAttribute('src', './img/extreme.png');
}

function getTimestamps(station) 
{
    params = [ {name: "station", value: station}];
    jQuery.get('./xml/timestamps', function(data, params) {
        var stamps = data.split('\n');
        var times = ['', '', '', ''];
		// stamps[0]/times[0]: La Panza
		// stamps[1]/times[0]: Las Tablas
		// stamps[2]/times[0]: Arroyo Grande
		// stamps[3]/times[0]: San Simeon

		/* Current time, in seconds */
		var now = Math.floor((new Date).getTime()/1000);
		//console.log(now);

		for(var i=0; i<times.length; i++) {
			/* Timestamps are in seconds, so get time in hours */
			var units = "";
			var hours = ((now - stamps[i])/3600);

			//console.log(hours);
			if (hours < 1) {
				hours *= 60;
				units = " minute";
			}
			else {
				units = " hour";
			}
			hours = Math.floor(hours);
			if (hours > 1) { //plurality
				units += "s";
			}
			
			times[i] = hours + units;
        }

        if (station == "LP") document.getElementById("update_status").innerHTML = "Last updated " + times[0] + " ago";
        if (station == "LT") document.getElementById("update_status").innerHTML = "Last updated " + times[1] + " ago";
        if (station == "AG") document.getElementById("update_status").innerHTML = "Last updated " + times[2] + " ago";
        if (station == "SLC") document.getElementById("update_status").innerHTML = "Last updated " + times[3] + " ago";   
    });
}

function getICIndex(ic) 
{
    if (ic >= 0 && ic <= 20) {
        return 0;
    }
    else if (ic >= 21 && ic <= 45) {
        return 1;
    }
    else if (ic >= 46 && ic <= 65) {
        return 2;
    }
    else if (ic >= 66 && ic <= 80) {
        return 3;
    }
    else {
        return 4;
    }
}

function calc_rating(sl, ic, id) 
{
    var rating_matrix = [
        ['L', 'L', 'L', 'M', 'M'],
        ['L', 'M', 'M', 'M', 'H'],
        ['M', 'M', 'H', 'H', 'V'],
        ['M', 'H', 'V', 'V', 'E'],
        ['H', 'V', 'V', 'E', 'E']];

    var ic_result = getICIndex(ic);
    var rating_result = rating_matrix[sl - 1][ic_result];

    console.log("RATING BELOW for " + id + " based on sl=" + sl + " and ic=" + ic + ": ");
    console.log(rating_result);

    switch (rating_result) {
        case 'L':
            low();
            break;
        case 'M':
            moderate();
            break;
        case 'H':
            high();
            break;
        case 'V':
            veryhigh();
            break;
        case 'E':
            extreme();
            break;
        default:
            console.log("Something went wrong\n");
            break;
    }
    console.log("Finished calcing rating.\n");
}

function updateSmokey() 
{
    var selection = document.getElementById("zone_selection");
    var selected_area = document.getElementById("selected_area");
    var selected_city = document.getElementById("selected_city");
    var value = selection.options[selection.selectedIndex].value;

    switch (value) {
        case "AG":
            data = './xml/arroyogrande.xml';
            selected_area.innerHTML = 'Coastal Valley';
			selected_city.innerHTML = 'Arroyo Grande';
            break;
        case "LP":
            data = './xml/lapanza.xml';
            selected_area.innerHTML = 'Inland Valley';
			selected_city.innerHTML = 'La Panza';
            break;
        case "LT":
            data = './xml/lastablas.xml';
            selected_area.innerHTML = 'Coast Range';
			selected_city.innerHTML = 'Las Tablas';
            break;
        case "SLC":
            data = './xml/sansimeon.xml';
            selected_area.innerHTML = 'San Luis Coast';
			selected_city.innerHTML = 'San Simeon';
            break;
        default:
            console.log("Something went wrong updating smokey.\n");
	}
    getTimestamps(value);
    readJSON(data, value, selected_city.innerHTML);
}

function readJSON(xml, station, city) 
{
    var params = [
        { name: "station", value: station },
        { name:"city", value: city }
    ];
    
    jQuery.get(xml, function(data, params)
    {
        var json = xmlToJson(data);
        console.log("GOT JSON! FOR " + city);
        console.log(json.hasOwnProperty("nfdrs"));
        if (json.hasOwnProperty("nfdrs") && json.nfdrs.hasOwnProperty("row")) {
            console.log("row exists");
            for (var i = 0; i < json.nfdrs.row.length; i++) {
                var curEntry = json.nfdrs.row[i];
                if ((station == "LT" || station == "LP") && curEntry.nfdr_type['#text'] == "O" && curEntry.msgc['#text'] == "7G3A2") 
                {
                    calc_rating(curEntry.sl['#text'], curEntry.ic['#text'], station);
                    console.log("Smokey's Adjective Fire Danger Rating for " + city + " is up to date.");
                    break;
                }
                if ((station == "SLC" || station == "AG") && curEntry.nfdr_type['#text'] == "O" && curEntry.msgc['#text'] == "7G2A2")
                {
                    calc_rating(curEntry.sl['#text'], curEntry.ic['#text'], station);
                    console.log("Smokey's Adjective Fire Danger Rating for " + city + " is up to date.");
                    break;
                }
            }
            if (i == json.nfdrs.row.length) {
                console.log("The Adjective Fire Danger Rating for " + city + " has not yet been updated today.");
                document.getElementById("update_status").innerHtml = "*This station's rating is not up to date";
            }
        }
        else {
            console.log("The Adjective Fire Danger Rating for " + city + " has not yet been updated today.");
            document.getElementById("update_status").innerHtml = "*This station's rating is not up to date";
        }
        console.log("Got " + city + " Fire Rating");
    });
}

function xmlToJson(xml)
{
    // Create the return object
	var obj = {};
    
        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }
    
        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
};
/**
 * Gets a JSON string from the current locations
 * @returns 
 */
 function getJSON(){
    arr = [];
    locationGroups.forEach((group) => {
        arr.push(group.toJSON());
    })
    return JSON.stringify({"data": arr});
}

/**
 * Converts the current locations to json to the textarea #jsonValue
 */
function convertToJSON(){
    let a = document.getElementById("jsonValue");
    a.value = getJSON();
    $("#jsonDialog").modal("show");
    addClass(document.getElementById('jsonImportButton'), 'hidden');
}

/**
 * Opens the dialog to import JSON
 */
 function prepareImportFromJSON(){
    let a = document.getElementById("jsonValue");
    a.value = '';
    $("#jsonDialog").modal("show");
    removeClass(document.getElementById('jsonImportButton'), 'hidden');
}

/**
 * Opens the dialog to import JSON
 */
 function prepareAddFromJSON(){
    let a = document.getElementById("jsonToAdd");
    a.value = '';
    $("#jsonToAddDialog").modal("show");
}

/**
 * 
 * @returns Gets the text from #jsonValue and uses it as a JSON to create the locations
 */
function importFromJSON(){
    let a = document.getElementById("jsonValue");
    if(a.value === '') return;

    let json = JSON.parse(a.value);
    let data = json['data'];
    data.forEach((row) => {
        readImportGroup(row);
        
    })
    $("#jsonDialog").modal("hide");
    
}

function readImportGroup(row){
    let latlng = {'lat': row.lat, 'lng' : row.lng};
    let id = row.id;
    let group = addMarker(latlng, id);
    group.isFloorless = row.isFloorless;
    lastId = id;

    let locations = row.locations;
    for(const [floor, list] of Object.entries(locations)){
        list.forEach((location) => {
            if(locationId < location.id){
                locationId = location.id + 1;
            }
            group.addLocation(floor, new Location(location.id, location.type, location.args));
        });
    }
}

/**
 * Copies to the clipboard the text in the textarea #jsonValue
 */
function copyJSON(){
    let text = document.getElementById('jsonValue');
    text.select();
    text.setSelectionRange(0, 99999); /* For mobile devices */
    addGrowlMessage('Copied to clipboard', 'info');
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(text.value);
}

function addFromJSON(){
    let jsonToAdd = document.getElementById("jsonToAdd").value;
    let json = JSON.parse(jsonToAdd);
    let groupsList = json["data"];
    for(let i=0; i< groupsList.length; i++){
        groupsList[i].id = ++lastId;
        console.log(groupsList[i].locations);
        let keys = Object.keys(groupsList[i].locations);
        for(let j=0; j<keys.length; j++){
            let floor = groupsList[i].locations[keys[j]];
            for(let k=0; k<floor.length; k++){
                floor[k].id = ++locationId;
            }
        }

        readImportGroup(groupsList[i]);
    }
    
}
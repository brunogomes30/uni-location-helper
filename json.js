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
 * 
 * @returns Gets the text from #jsonValue and uses it as a JSON to create the locations
 */
function importFromJSON(){
    let a = document.getElementById("jsonValue");
    if(a.value === '') return;

    let json = JSON.parse(a.value);
    let data = json['data'];
    data.forEach((row) => {
        let latlng = {'lat': row.lat, 'lng' : row.lng};
        let id = row.id;
        let group = addMarker(latlng, id);
        group.isFloorless = row.isFloorless;
        lastId = id;

        let locations = row.locations;
        for(const [floor, list] of Object.entries(locations)){
            list.forEach((location) => {
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
 * 
 * @returns Gets the text from #jsonValue and uses it as a JSON to create the locations
 */
function importFromJSON(){
    let a = document.getElementById("jsonValue");
    if(a.value === '') return;

    let json = JSON.parse(a.value);
    let data = json['data'];
    data.forEach((row) => {
        let latlng = {'lat': row.lat, 'lng' : row.lng};
        let id = row.id;
        let group = addMarker(latlng, id);
        group.isFloorless = row.isFloorless;
        lastId = id;

        let locations = row.locations;
        for(const [floor, list] of Object.entries(locations)){
            list.forEach((location) => {
                if(locationId < location.id){
                    locationId = location.id;
                }
                group.addLocation(floor, new Location(location.id, location.type, location.args));
            });
        }
    })
    $("#jsonDialog").modal("hide");
    
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
                group.addLocation(floor, new Location(location.id, location.type, location.args));
            });
        }
    })
    $("#jsonDialog").modal("hide");
    
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
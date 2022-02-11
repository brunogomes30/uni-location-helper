function getJSON(){
    arr = [];
    locationGroups.forEach((group) => {
        arr.push(group.toJSON());
    })
    return JSON.stringify({"data": arr});
}

function convertToJSON(){
    let a = document.getElementById("jsonValue");
    a.value = getJSON();
    $("#jsonDialog").modal("show");
    addClass(document.getElementById('jsonImportButton'), 'hidden');
}

function prepareImportFromJSON(){
    let a = document.getElementById("jsonValue");
    a.value = '';
    $("#jsonDialog").modal("show");
    removeClass(document.getElementById('jsonImportButton'), 'hidden');
}

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
                group.addLocation(floor, location.type, location.args);
            });
        }
    })
    $("#jsonDialog").modal("hide");
    
}

function copyJSON(){
    let text = document.getElementById('jsonValue');
    text.select();
    text.setSelectionRange(0, 99999); /* For mobile devices */
    addGrowlMessage('Copied to clipboard', 'info');
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(text.value);
}
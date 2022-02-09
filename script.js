let locationId = 0;
let selectedLocation = null;
let addedIcons = L.divIcon({
        className: 'new-marker'
    }
);


function initInputs(){
    return {
        'name' : false,
        'room' : false,
        'firstRoom' : false,
        'lastRoom' : false
    };
}
function typeHasInputs(type){
    return type === 'ROOM' || type === 'SPECIAL_ROOM' || type === 'ROOMS' || type === 'RESTAURANT' || type === 'STORE';
}
function isSelected(elem){
    return elem.classList.contains('selected');
}
function selectElem(elem){
    console.log(elem);
    elem.classList.add('selected');
}
function removeSelection(elem){
    elem.classList.remove('selected');
}

function getFloorSelected(){
    let radios = document.getElementsByName('floorRadio');
    for(let i=0; i < radios.length; i++){
        if(radios[i].checked){
            let floor = document.querySelector("label[for='floorRadio" + i +"']").innerText;
            return floor;
        }
    }
}

function addMarker(latlng, id){
    let marker = new L.marker(latlng, {icon : addedIcons, title: id + '', draggable: true}).addTo(map);
    document.querySelector('.new-marker[title="'+id+'"]').innerHTML = id;
    let group = new LocationGroup(id, marker, latlng);
    locationGroups.push(group);
    selectMarker(group.id);
    marker.on('click', function(e){
        console.log(group.id);
        selectMarker(group.id);
    });
    marker.on("drag", function(e) {
        var marker = e.target;
        var position = marker.getLatLng();
        let latlng = new L.LatLng(position.lat, position.lng);
        locationGroups[group.id].latlng = latlng;
        console.log(latlng);
        //map.panTo(latlng);

    });
    return group;
}

function selectMarker(id){
    let previous = document.querySelector(".selected-marker");
    if(previous !== null){
        removeClass(previous, 'selected-marker');
    }
    let selectedMarker = document.querySelector('.new-marker[title="'+id+'"]');
    selectedMarker.classList.add("selected-marker");
    selectedLocation = locationGroups[id];
    updateGroupContent();
    switchRightView();
}
function removeSelectedMarker(){
    removeMarker(selectedLocation.id);
    selectedLocation = null;
    switchRightView();
}
function removeMarker(id){
    let selectedMarker = document.querySelector('.new-marker[title="'+id+'"]');
    selectedMarker.remove();
    delete locationGroups[id];
}

function changeFloorless(){
    let input = document.getElementById("isFloorlessInput");
    selectedLocation.isFloorless = input.checked;
}

function addFields(type){
    switch(type){
        case 'COFFEE_MACHINE':
            break;
        case 'VENDING_MACHINE':
            break;
        case 'ROOM':
            //Show room field
            break;
        case 'SPECIAL_ROOM':
            //Show room field
            //Show name field
            break;
        case 'ROOMS':
            //Show first room field
            //Show second room field
            break;
        case 'ATM':
            break;
        case 'PRINTER':
            break;
        case 'RESTAURANT':
            //Show name field
            break;
        case 'STORE':
            //Show name field
            break;
    }
}

function prepareAddLocation(type){
    
    let showDialog = false;
    switch(type){
        case 'COFFEE_MACHINE':
            selectedLocation.addLocation(getFloorSelected(),type, null);
            break;
        case 'VENDING_MACHINE':
            selectedLocation.addLocation(getFloorSelected(), type, null);
            break;
        case 'ROOM':
            showDialog = true;
            //Show room field
            break;
        case 'SPECIAL_ROOM':
            showDialog = true;
            //Show room field
            //Show name field
            break;
        case 'ROOMS':
            showDialog = true;
            //Show first room field
            //Show second room field
            break;
        case 'ATM':
            selectedLocation.addLocation(getFloorSelected(), type, null);
            break;
        case 'PRINTER':
            selectedLocation.addLocation(getFloorSelected(), type, null);
            break;
        case 'RESTAURANT':
            showDialog = true;
            //Show name field
            break;
        case 'STORE':
            showDialog = true;
            //Show name field
            break;
    }
    if(showDialog){
        openLocationDialog(type);
    }
}

function addClass(elem, c){
    
    if(!elem.classList.contains(c)){
        elem.classList.add(c);
    }
}

function removeClass(elem, c){
    if(elem.classList.contains(c)){
        elem.classList.remove(c);
    }
}
function initLocationDialog(title, inputs){
    let dialog = document.getElementById('addLocationDialog');
    for(const [key, value] of Object.entries(inputs)){
        console.log(key);
        const div = dialog.querySelector('#' + key +'InputDiv');
        if(value){
            removeClass(div, 'hidden');
            dialog.querySelector('#'+key+'Input').value = '';
        }
        else
            addClass(div, 'hidden');
    }
    dialog.querySelector(".modal-title").innerText = title;;
}
function openLocationDialog(type){
    let inputs = initInputs();
    let title = undefined;
    switch(type){
        case 'ROOM':
            title = 'Add Room to floor ' + getFloorSelected();
            inputs['room'] = true;
            break;
        case 'ROOMS':
            title = 'Add Rooms to floor ' + getFloorSelected();
            inputs['firstRoom'] = true;
            inputs['lastRoom'] = true;
            break;
        case 'SPECIAL_ROOM':
            title = 'Add Special Room to floor ' + getFloorSelected();
            inputs['name'] = true;
            inputs['room'] = true;
            break;
        case 'RESTAURANT':
            title = 'Add Restaurant to floor ' + getFloorSelected();
            inputs['name'] = true;
            break;
        case 'STORE':
            title = 'Add Store to floor ' + getFloorSelected();
            inputs['name'] = true;
    }

    initLocationDialog(title, inputs);
    $('#addLocationDialog').modal('show');
    document.type = type;
    document.inputs = inputs;
}


class Location{
    constructor(type, params){
        this.id = locationId++;
        this.type = type;
        switch(type){
            case 'COFFEE_MACHINE':
                break;
            case 'VENDING_MACHINE':
                break;
            case 'ROOM':
                this.room = params['room'];
                break;
            case 'SPECIAL_ROOM':
                this.room = params['room'];
                this.name = params['name'];
                break;
            case 'ROOMS':
                this.firstRoom = params['firstRoom'];
                this.lastRoom = params['lastRoom'];
                break;
            case 'ATM':
                break;
            case 'PRINTER':
                break;
            case 'RESTAURANT':
                this.name = params['name'];
                break;
            case 'STORE':
                this.name = params['name'];
                break;
        }

        

    }
    toHtml(){
        let content = 'undefined';
        switch(this.type){
            case 'COFFEE_MACHINE':
                content = 'Coffee Machine'
                break;
            case 'VENDING_MACHINE':
                content = 'Vending machine'
                break;
            case 'ROOM':
                content = 'Room ' + this.room;
                break;
            case 'SPECIAL_ROOM':
                content = this.room + " - " + this.name;
                break;
            case 'ROOMS':
                content = this.firstRoom + ' - ' + this.lastRoom;
                break;
            case 'ATM':
                content = 'ATM';
                break;
            case 'PRINTER':
                content = 'Printer';
                break;
            case 'RESTAURANT':
                content = 'Restaunt - ' + this.name
                break;
            case 'STORE':
                content = 'Store - ' + this.name;
                break;
        }
        let html = `<div id='location${this.id}' class="location">${content} <i  onclick="removeLocation(${this.id})" class="fa fa-trash removeLocation"></i></div>`;
        return html;
    }

    toJSON(){
        let json = {"type": this.type, 'args' : {}};
        switch(this.type){
            case 'COFFEE_MACHINE':
                break;
            case 'VENDING_MACHINE':
                break;
            case 'ROOM':
                json["args"].room = this.room;
                break;
            case 'SPECIAL_ROOM':
                json["args"].room = this.room;
                json["args"].name = this.name;
                break;
            case 'ROOMS':
                json["args"].firstRoom = this.firstRoom;
                json["args"].lastRoom = this.lastRoom;
                break;
            case 'ATM':
                break;
            case 'PRINTER':
                break;
            case 'RESTAURANT':
                json["args"].name = this.name;
                break;
            case 'STORE':
                json["args"].name = this.name;
                break;
        }
        return json;
    }
}

class LocationGroup{
    constructor(id, marker, latlng){
        this.id = id;
        this.locations = {};
        this.marker = marker;
        this.info = 'empty';
        this.latlng = latlng;
        this.isFloorless = false;
    }

    addLocation(floor, type, args)  {
        let floorLocations = this.locations[floor];
        if(floorLocations == undefined){
            this.locations[floor] = [];
            floorLocations = this.locations[floor];
        }

        floorLocations.push(new Location(type, args));
        updateGroupContent();
    }

    removeLocation(id){
        let foundAtFloor = null;
        let newLocations = null;
        for(const [floor, locations] of Object.entries(this.locations)){
            newLocations = locations.filter(function(location){
                return location.id !== id;
            });
            if(newLocations.length !== locations.length){
                foundAtFloor = floor;
                break;
            }
            //inputs[floor] = locations;
        }
        this.locations[foundAtFloor] = newLocations;
    }

    toJSON(){
        return {
            'id' : this.id,
            'lat' : this.latlng.lat,
            'lng' : this.latlng.lng,
            'isFloorless' : this.isFloorless,
            'locations': this.locationsToJSON()
        };
    }

    locationsToJSON(){
        let json = {};
        for(const [floor, locations] of Object.entries(this.locations)){
            let arr = [];

            locations.forEach((location) => arr.push(location.toJSON()) );
            json[floor] = arr;
        };
        return json;
    }
    
}

function addLocation(){
    let type = document.type;
    let inputs = document.inputs;
    let args = {};
    if(typeHasInputs){
        for(const [key, hasInput] of Object.entries(inputs)){
            if(!hasInput) continue;
            let input = document.getElementById(key+"Input");
            let value = input.value;
            if(value === undefined || value === ''){
                alert(key + " not defined");
                return;
            }
            args[key] = value;
        }
    }
    selectedLocation.addLocation(getFloorSelected(), type, args);
    $('#addLocationDialog').modal('hide');
}

function removeLocation(id){
    selectedLocation.removeLocation(id);
    updateGroupContent();
}

function updateGroupContent(){
    let group = selectedLocation;
    let content = document.getElementById("groupContent");
    content.innerHTML = '';
    for(const [floor, list] of Object.entries(group.locations)){
        if(list.length > 0)
            content.insertAdjacentHTML('afterbegin', buildFloorHtml(floor, list));
    }

    let isFloorlessInput = document.getElementById('isFloorlessInput');
    isFloorlessInput.checked = group.isFloorless;
}


function buildFloorHtml(floor, locations){
    let contentHTML = '';
    locations.forEach((location) => {
        contentHTML += location.toHtml();
    })
    let html = `
        <div class="w-100 mb-2 d-flex flex-column">
            <h6>${floor}</h6>
            <div class="w-100 px-2">
                ${contentHTML}
            </div>
        </div>
    `;
    return html;
}

function switchRightView(){
    let groupView = document.getElementById('groupView');
    let noGroupView = document.getElementById('noGroupView');
    if(selectedLocation == null){
        addClass(groupView, 'hidden');
        removeClass(noGroupView, 'hidden');
    } else {
        addClass(noGroupView, 'hidden');
        removeClass(groupView, 'hidden');
    }
}

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
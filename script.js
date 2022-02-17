let locationId = 0;
let selectedLocation = null;

let addedIcons = L.divIcon({
        className: 'new-marker'
    }
);


function isSelected(elem){
    return elem.classList.contains('selected');
}

/**
 * Happens when a marker is clicked, adds a .selected class to the marker.
 * @param {} elem 
 */
function selectElem(elem){
    elem.classList.add('selected');
}

/**
 * Removes the .selected class from the elem
 * @param {} elem 
 */
function removeSelection(elem){
    elem.classList.remove('selected');
}

/**
 * Get current floor selected by reading the radio buttons
 * @returns 
 */
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
    group = new LocationGroup(id, null, latlng);
    doAction(new AddLocationGroupAction(group, locationGroups));
    return group;
}


/**
 * Removes previous selected marker and selects the marker with the id, updates the right view and display it's locations(if any)
 * @param {*} id 
 */
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

/**
 * Removes the currently selected marker from the map
 */
function removeSelectedMarker(){
    doAction(new RemoveLocationGroupAction(selectedLocation));
    selectedLocation = null;
    switchRightView();
}

/**
 * Removes the marker with the id
 * @param {*} id 
 */
function removeMarker(id){
    
}

/**
 * Change's the isFloorless input
 */
function changeFloorless(){
    let input = document.getElementById("isFloorlessInput");
    selectedLocation.isFloorless = input.checked;
}


/**
 * Opens the add location dialog if it has any input, if not, adds location to the current locationGroup
 * @param {*} type 
 */
function prepareAddLocation(type){
    //let showDialog = false;
    let inputs = availableTypes[type].inputs;
    if(Object.values(inputs).includes(true)){
        openLocationDialog(type);
    } else {
        let location = new Location(locationId++, type, null);
        doAction(new AddLocationAction(location, selectedLocation));
        //selectedLocation.addLocation(getFloorSelected(),type, null);
    }
}

/**
 * 
 * @param {*} title 
 * @param {*} inputs 
 */
function initLocationDialog(title, inputs){
    let dialog = document.getElementById('addLocationDialog');
    for(const [key, value] of Object.entries(inputs)){
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

/**
 * 
 * @param {*} type 
 */
function openLocationDialog(type){
    let inputs = availableTypes[type].inputs;
    let title = availableTypes[type].title + getFloorSelected();
    initLocationDialog(title, inputs);
    $('#addLocationDialog').modal('show');
    document.type = type;
}

/**
 * 
 * @returns 
 */
function addLocation(){
    let type = document.type;
    let inputs = availableTypes[type].inputs;
    let args = {};

    //Get inputs
    if(Object.values(inputs).includes(true)){
        for(const [key, hasInput] of Object.entries(inputs)){
            if(!hasInput) continue;
            let input = document.getElementById(key+"Input");
            let value = input.value;
            if(value === undefined || value === ''){
                return;
            }
            args[key] = value;
        }
    }

    let location = new Location(locationId++, type, args);
    doAction(new AddLocationAction(location, selectedLocation));
    $('#addLocationDialog').modal('hide');
}

/**
 * 
 * @param {*} id 
 */
function removeLocation(id){
    selectedLocation.removeLocation(id);
    updateGroupContent();
}

/**
 * Adds location when Enter key is selected.
 * @param {*} e 
 */
function enterKeyDialog(e){
    if(e.keyCode == 13)  addLocation();
}


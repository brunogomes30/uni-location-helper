let locationId = 0;
let selectedLocation = null;
let addedIcons = L.divIcon({
        className: 'new-marker'
    }
);



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


function prepareAddLocation(type){
    //let showDialog = false;
    console.log("TYPE = " + type);
    let inputs = getInputs(type);
    if(Object.values(inputs).includes(true)){
        openLocationDialog(type);
    } else {
        selectedLocation.addLocation(getFloorSelected(),type, null);
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
    let inputs = getInputs(type);

    let title = getTitle(type, getFloorSelected());
    initLocationDialog(title, inputs);
    $('#addLocationDialog').modal('show');
    document.type = type;
}

function addLocation(){
    let type = document.type;
    
    let inputs = getInputs(type);
    
    let args = {};
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

function enterKeyDialog(e){
    if(e.keyCode == 13)  addLocation();
}


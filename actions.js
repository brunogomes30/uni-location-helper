let actions = [];
let actionGroups = [];
let actionsUndone = [];
class Action{
    constructor(){
        if(this.constructor == Action){
            throw new Error("Abstract class action can't be instantiated.");
        }
    }
    do(){
        throw new Error('Method do() must be implemented');
    }
    undo(){
        throw new Error('Method undo() must be implemented');
    }
}

class AddLocationGroupAction extends Action {
    constructor(group, groups){
        super();
        this.group = group;
        this.groups = groups;
    }

    do(){
        addMarkerAction(this.group, this.groups);
    }
    undo(){
        removeMarkerAction(this.group.id);
    }   

    /**
     * Adds and initializes a marker to the map. Also selects it in the end
     * @param {*} latlng 
     * @param {*} id 
     * @returns 
     */
    
}

class AddLocationAction extends Action {
    constructor(location, group){
        super();
        this.location = location;
        this.group = group;
    }

    do(){
        /*
        let groupId = this.group.id;
        if(!actionGroups[groupId]?.length > 0){
            //If is empty or doesn't exist
            actionGroups[groupId] = [this];
        } else {
            actionGroups[groupId].push(this);
        }
        */
        this.addLocationAction(this.location, this.group);
    }

    undo(){
        this.removeLocationAction(this.location, this.group);
    }

    addLocationAction(location, group){
        selectedLocation.addLocation(getFloorSelected(), location);
        updateGroupContent();
    }
    
    removeLocationAction(location, group){
        selectedLocation.removeLocation(location.id);
        updateGroupContent();
    }
    
}

class DragLocationAction extends Action{
    constructor(group, marker){
        super();
        this.group = group;
        this.marker = marker;
        this.previousLatlng = group.latlng;
        this.newLatlng = marker.getLatLng();
    }

    do(){
        this.group.latlng = this.newLatlng;
        let marker = findMarker(this.group.id);
        this.marker = marker;
        this.marker.setLatLng(this.newLatlng);

    }
    undo(){
        this.group.latlng = this.previousLatlng;
        this.marker.setLatLng(this.previousLatlng);
    }
}

class RemoveLocationGroupAction extends Action{
    constructor(group){
        super();
        this.group = group;
        this.locations = group.locations;
    }

    do(){
        removeMarkerAction(this.group.id);
    }

    undo(){
        addMarkerAction(this.group, locationGroups);
        this.group = locationGroups[this.group.id];
        this.group.locations = this.locations;
    }
}

function doAction(action){
    action.do();
    actions.push(action);
    
}

function undoAction(){
    if(actions.length == 0) return;

    const action = actions.pop();
    if(action instanceof AddLocationGroupAction){
        actions = actions.filter((elem) =>
        !(elem instanceof AddLocationAction && elem.group.id == action.group.id));
    }
    action.undo();
    actionsUndone.push(action);
}

function redoAction(){
    if(actionsUndone.length == 0) return;

    const action = actionsUndone.pop();
    doAction(action);
}


function removeMarkerAction(id){
    let selectedMarker = document.querySelector('.new-marker[title="'+id+'"]');
    selectedMarker.remove();
    delete locationGroups[id];
    
    if(selectedLocation !== undefined && selectedLocation.id === id ){
        selectedLocation = undefined;
        switchRightView();
    }
}

function addMarkerAction(group, locationGroups){
    let marker = new L.marker(group.latlng, {icon : addedIcons, title: group.id + '', draggable: true}).addTo(map);
    marker.isDragging = false;
    document.querySelector('.new-marker[title="'+group.id+'"]').innerHTML = group.id;
    group.marker = marker;

    locationGroups[group.id] = group;
    marker.on('click', function(e){
        selectMarker(group.id);
    });
    marker.on("drag", function(e) {
        
        let marker = e.target;
        

    });

    marker.on("dragend", function(e){
        let marker = e.target;
        doAction(new DragLocationAction(group, marker));
    })
    selectMarker(group.id);
    return group;
}
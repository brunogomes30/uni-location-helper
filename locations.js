class Location{
    constructor(type, params){
        this.id = locationId++;
        this.type = type;
        let inputs = getInputs(type);
        initVariables(inputs, this, params);
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
                content = this.firstRoom + ' -> ' + this.lastRoom;
                break;
            case 'ATM':
                content = 'ATM';
                break;
            case 'PRINTER':
                content = 'Printer';
                break;
            case 'RESTAURANT':
                content = 'Restaurant - ' + this.name
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
        initVariables(getInputs(this.type), json['args'], this);
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


function initInputs(){
    return {
        'name' : false,
        'room' : false,
        'firstRoom' : false,
        'lastRoom' : false
    };
}

function getInputs(type){
    let inputs = initInputs();
    switch(type){
        case 'COFFEE_MACHINE':
            break;
        case 'VENDING_MACHINE':
            break;
        case 'ROOM':
            inputs['room'] = true;
            break;
        case 'SPECIAL_ROOM':
            inputs['room'] = true;
            inputs['name'] = true;
            break;
        case 'ROOMS':
            inputs['firstRoom'] = true;
            inputs['lastRoom'] = true;
            break;
        case 'ATM':
            break;
        case 'PRINTER':
            break;
        case 'RESTAURANT':
            inputs['name'] = true;
            break;
        case 'STORE':
            inputs['name'] = true;
            break;
    }

    return inputs;
}


function initVariables(inputs, location, params = undefined){
    for(const [t, hasInput] of Object.entries(inputs)){
        if(hasInput){
            location[t] = params[t];
        }
    }
}


function getTitle(type, floor){
    switch(type){
        case 'ROOM':
            title = 'Add Room to floor ' + floor;
            break;
        case 'ROOMS':
            title = 'Add Rooms to floor ' + floor;
            break;
        case 'SPECIAL_ROOM':
            title = 'Add Special Room to floor ' + floor;
            break;
        case 'RESTAURANT':
            title = 'Add Restaurant to floor ' + floor;
            break;
        case 'STORE':
            title = 'Add Store to floor ' + floor;
    }
    return title;
}
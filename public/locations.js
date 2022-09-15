class LocationType{
    constructor(type, icon){
        this.inputs = initInputs();
        this.type = type;
        this.icon = icon;
        switch(type){
            case 'COFFEE_MACHINE':
                this.content = 'Coffee Machine';
                break;
            case 'VENDING_MACHINE':
                this.content = 'Vending Machine';
                break;
            case 'ROOM':
                this.content = ':room';
                this.inputs['room'] = true;
                this.title = 'Add room to floor ';
                break;
            case 'SPECIAL_ROOM':
                this.content = ':room - :name';
                this.inputs['room'] = true;
                this.inputs['name'] = true;
                this.title = 'Add special room to floor ';
                break;
            case 'ROOMS':
                this.content = ':firstRoom -> :lastRoom';
                this.inputs['firstRoom'] = true;
                this.inputs['lastRoom'] = true;
                this.title = 'Add special room to floor';
                break;
            case 'ATM':
                this.content = 'ATM'
                break;
            case 'PRINTER':
                this.content = 'Printer';
                break;
            case 'RESTAURANT':
                this.content = 'Restaurant - :name'
                this.inputs['name'] = true;
                this.title = 'Add restaurant to floor ';
                break;
            case 'STORE':
                this.content = 'Store - :name';
                this.inputs['name'] = true;
                this.title = 'Add store to floor ';
                break;
            case 'WC':
                this.content = 'Restroom ';
                //this.inputs['wctype'] = false;
                //this.title = 'Add restroom to floor ';
                console.log("here");
        }

    }

}

let availableTypes = {
    'COFFEE_MACHINE' : new LocationType('COFFEE_MACHINE', 'coffee'),
    'VENDING_MACHINE' : new LocationType('VENDING_MACHINE', 'cube'),
    'ROOM' : new LocationType('ROOM', 'book'),
    'SPECIAL_ROOM' : new LocationType('SPECIAL_ROOM', 'star'),
    'ROOMS' : new LocationType('ROOMS', 'users'),
    'ATM' : new LocationType('ATM', 'dollar-sign'),
    'PRINTER' : new LocationType('PRINTER', 'print'),
    'RESTAURANT' : new LocationType('RESTAURANT', 'utensils'),
    'STORE' : new LocationType('STORE', 'store'),
    'WC' : new LocationType('WC', 'restroom')
};
/**
 * 
 */
class Location{
    constructor(id, type, params){
        this.id = id;
        this.type = availableTypes[type];
        let inputs = this.type.inputs;
        initVariables(inputs, this, params);
    }
    toHtml(){
        let content = '' + this.type.content;
        for(const [key, hasParam] of Object.entries(this.type.inputs)){
            if(hasParam){
                content = content.replace(':'+key, this[key]);
            }
        }
        let html = `<div id='location${this.id}' class="location">${content} <i  onclick="removeLocation(${this.id})" class="fa fa-trash removeLocation"></i></div>`;
        return html;
    }

    toJSON(){
        let json = {'id': this.id, "type": this.type.type, 'args' : {}};
        initVariables(this.type.inputs, json['args'], this);
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

    addLocation(floor, location)  {
        let floorLocations = this.locations[floor];
        if(floorLocations == undefined){
            this.locations[floor] = [];
            floorLocations = this.locations[floor];
        }
        floorLocations.push(location);
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
        'lastRoom' : false,
        'wctype' : false
    };
}
/**
 * If key is true in inputs, add to location[key] the params[key]; location[key] = params[key]
 * @param {*} inputs 
 * @param {*} location 
 * @param {*} params 
 */
function initVariables(inputs, location, params = undefined){
    for(const [t, hasInput] of Object.entries(inputs)){
        if(hasInput){
            location[t] = params[t];
        }
    }
}

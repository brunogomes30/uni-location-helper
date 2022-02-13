/**
 * 
 */
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

function addLocationIcons(types){
    let typesDiv = document.getElementById('locationTypes');
    for(const [key, value] of Object.entries(types)){
        let html = '<i class="fa fa-:icon typeOfLocation" title=":title" type=":type"></i>';
        html = html.replace(':icon', value.icon).replace(':title', value.type).replace(':type', value.type);
        typesDiv.insertAdjacentHTML('beforeend', html);
    }
    let icons = document.querySelectorAll(".typeOfLocation");
    icons.forEach((icon) => {
        icon.addEventListener('click', function(event){
            let iElem = event.path[0];
            if(!isSelected(iElem)){
                //selectElem(iElem);
                prepareAddLocation(iElem.getAttribute('type'));
                //addLocation(getFloorSelected(),iElem.getAttribute('type'));
            } else {
                //removeSelection(iElem);
                //removeLocation(getFloorSelected(), iElem.getAttribute('type'));
            }
        });
    });
}

/**
 * 
 * @param {*} floor 
 * @param {*} locations 
 * @returns 
 */
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

/**
 * Update Location group's content, aka locations
 */
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

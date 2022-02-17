let growlId = 0;

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


function addGrowlMessage(message, type){
    let id = growlId++;
    let growls = document.getElementById("growls");
    let newGrowlHTML = 
    `
    <div id="growl${id}" class="growl growl-${type}">
    ${message}
    </div>
    `
    growls.insertAdjacentHTML("beforeEnd", newGrowlHTML);
    setTimeout(() => {document.getElementById("growl"+id).classList.add("invisible");}, 3000);
    setTimeout(() => {document.getElementById("growl"+id).remove();}, 4000);
  }

function findMarker(id){
    let marker = null;
    map.eachLayer(function (layer) {
        if(layer.options['title'] === (id + '')) {
            marker = layer;
        }
    });
    return marker;
}
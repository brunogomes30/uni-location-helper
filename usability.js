window.addEventListener('keyup', function (event){
    if(event.ctrlKey && event.key.toLowerCase() === 'z'){
        if(event.shiftKey){
            redoAction();
        } else {
            undoAction();
        }
    }
});
//Update row action
document.getElementById('submit').addEventListener('click', function(){
    var req = new XMLHttpRequest();
    
    //Check if name is filled in (required field)
    
    var queryString = '';
    queryString += 'name=' + document.getElementById('name').value;
    queryString += '&reps=' + document.getElementById('reps').value;
    queryString += '&weight=' + document.getElementById('weight').value;
    queryString += '&date=' + document.getElementById('date').value;
    queryString += '&lbs=' + document.getElementById('lbs').value;
    req.open('GET', '/update-row?' + queryString, true);
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            console.log('Update success?');
            //check success of add
            getTable();
        }
        else
            console.log('Update fail?');
    });
    req.send(null);
    event.preventDefault();
    
});
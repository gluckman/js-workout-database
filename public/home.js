function getTable() {
    var req = new XMLHttpRequest();
    
    req.open('GET', '/populate', true);
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {
            var table = document.createElement('table');
            
            var headerRow = document.createElement('tr');
            
            var nameHeader = document.createElement('th');
            nameHeader.textContent = 'Name';
            headerRow.appendChild(nameHeader);
            
            var repsHeader = document.createElement('th');
            repsHeader.textContent = 'Reps';
            headerRow.appendChild(repsHeader);
            
            var weightHeader = document.createElement('th');
            weightHeader.textContent = 'Weight';
            headerRow.appendChild(weightHeader);
            
            var unitHeader = document.createElement('th');
            unitHeader.textContent = 'Unit';
            headerRow.appendChild(unitHeader);
            
            var dateHeader = document.createElement('th');
            dateHeader.textContent = 'Date';
            headerRow.appendChild(dateHeader);
            
            var modifyHeader = document.createElement('th');
            modifyHeader.textContent = 'Modify';
            headerRow.appendChild(modifyHeader);
            
            table.appendChild(headerRow);
            
            var rows = JSON.parse(req.responseText);
            for(var i = 0; i < rows.length; i++) {
                console.log('In row loop, length:' + rows.length);
                var newRow = document.createElement('tr');
                
                var nameCell = document.createElement('td');
                nameCell.textContent = rows[i].name;
                newRow.appendChild(nameCell);
                
                var repsCell = document.createElement('td');
                repsCell.textContent = rows[i].reps;
                newRow.appendChild(repsCell);
                
                var weightCell = document.createElement('td');
                weightCell.textContent = rows[i].weight;
                newRow.appendChild(weightCell);
                
                var unitCell = document.createElement('td');
                if(rows[i].lbs == 1) {
                    unitCell.textContent = 'lbs';
                }
                else {
                    unitCell.textContent = 'kgs'
                }            
                newRow.appendChild(unitCell);
                
                var dateCell = document.createElement('td');
                dateCell.textContent = rows[i].date;
                newRow.appendChild(dateCell);
                
                var modifyCell = document.createElement('td');
                var modifyForm = document.createElement('form');
                //modifyForm.method = 'POST';
                //modifyForm.action = '/modify';
                var hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.value = rows[i].id;
                modifyForm.appendChild(hiddenId);
                var updateButton = document.createElement('input');
                updateButton.type = 'button';
                updateButton.value = 'Update';
                updateButton.name = 'update';
                updateButton.addEventListener('click', function() {
                   var req = new XMLHttpRequest();
                    var param = this.parentNode.firstChild.value;
                    req.open('GET', '/update?id=' + param, false);
                    req.addEventListener('load', function() {
                        if(req.status >= 200 && req.status < 400) {
                            console.log('Update success?');
                            //check success of delete
                            //getTable();
                        }
                        else
                            console.log('Update fail?');
                    });
                    req.send(null);
                    event.preventDefault();
                });
                modifyForm.appendChild(updateButton);
                var deleteButton = document.createElement('input');
                deleteButton.type = 'button';
                deleteButton.value = 'Delete';
                deleteButton.name = 'delete';
                deleteButton.addEventListener('click', function() {
                   var req = new XMLHttpRequest();
                    var param = this.parentNode.firstChild.value;
                    req.open('GET', '/delete?id=' + param, true);
                    req.addEventListener('load', function() {
                        if(req.status >= 200 && req.status < 400) {
                            console.log('Delete success?');
                            //check success of delete
                            getTable();
                        }
                        else
                            console.log('Delete fail?');
                    });
                    req.send(null);
                    event.preventDefault();
                }); 
                modifyForm.appendChild(deleteButton);
                modifyCell.appendChild(modifyForm);
                newRow.appendChild(modifyCell);
                
                table.appendChild(newRow);
            }
            document.getElementById('dbTable').innerHTML = '';
            document.getElementById('dbTable').appendChild(table);
            
        }
        else
            console.log('Table request failed.');
    });
    req.send(null);
}

getTable();

//Submit new row action
document.getElementById('submit').addEventListener('click', function(){
    //Check whether name is empty
    if(document.getElementById('name').value != "") {
        var req = new XMLHttpRequest();

        var queryString = '';
        queryString += 'name=' + document.getElementById('name').value;
        queryString += '&reps=' + document.getElementById('reps').value;
        queryString += '&weight=' + document.getElementById('weight').value;
        queryString += '&date=' + document.getElementById('date').value;
        queryString += '&lbs=' + document.getElementById('lbs').value;
        req.open('GET', '/insert?' + queryString, true);
        req.addEventListener('load', function() {
            if(req.status >= 200 && req.status < 400) {
                console.log('Insert success?');
                //check success of add
                getTable();
            }
            else
                console.log('Insert fail?');
        });
        req.send(null);   
    }

    event.preventDefault();
    
});
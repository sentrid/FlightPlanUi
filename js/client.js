const api_base_url = "http://localhost:3000/api/v1/flightplan/";

let username = "admin";
let password = "P@ssw0rd";

async function login() {

    username = document.getElementById("usernameTextBox").value;
    password = document.getElementById("passwordTextBox").value;

    const response = await fetch(api_base_url + "login", {
        method: "GET",
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
    });

    if(response.ok) {
        document.cookie = "username=" + username + ";password=" + password;
        window.location.href = 'flightplan.html';
    }
}

async function file_flight_plan() {

    let selected_flight_type = 'Unknown';
    if(document.getElementById('inlineVFR').checked) {
        selected_flight_type = 'VFR';
    }
    else if(document.getElementById('inlineVFR').checked) {
        selected_flight_type = 'IFR';
    }

    await fetch(api_base_url + "file", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            flight_plan_id: document.getElementById("flight_plan_id"),
            altitude: Number(document.getElementById('altitude').value),
            aircraft_identification: document.getElementById('tailNumber').value,
            aircraft_type: document.getElementById('aircraftType').value,
            airspeed: Number(document.getElementById('airspeed').value),
            arrival_airport: document.getElementById('arriveAirport').value,
            flight_type: selected_flight_type,
            departing_airport: document.getElementById('departAirport').value,
            departure_time: new Date(document.getElementById('departureTime').value).toISOString(),
            estimated_arrival_time: new Date(document.getElementById('arrivalTime').value).toISOString(),
            route: document.getElementById('route').value,
            remarks: document.getElementById('remarks').value,
            fuel_hours: Number(document.getElementById('fuelHours').value),
            fuel_minutes: Number(document.getElementById('fuelMinutes').value),
            number_onboard: Number(document.getElementById('paxOnBoard').value)
        })
    });
}

async function delete_flight_plan(flight_plan_id) {

    // Delete flight plan using aircraft tail number as the identifier
    await fetch(api_base_url + "delete/" + flight_plan_id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
    }).then(response => response.json());

    await get_all_flight_plans();
}

async function edit_flight_plan() {

    let flight_plan_id = document.getElementById("flightPlanId").value;
    let raw_result = (await fetch(api_base_url + flight_plan_id, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
            'Content-Type': 'application/json'
        }
    }));

    let result = await raw_result.json();

    document.getElementById('tailNumber').value = result.aircraft_identification;
    document.getElementById('aircraftType').value = result.aircraft_type;
    document.getElementById('airspeed').value = result.airspeed;
    document.getElementById('altitude').value = result.altitude;
    document.getElementById('paxOnBoard').value = result.number_onboard;
    document.getElementById('departureTime').value = result.departure_time.substring(0, result.departure_time.length - 1);
    document.getElementById('arrivalTime').value = result.estimated_arrival_time.substring(0, result.estimated_arrival_time.length - 1);
    document.getElementById('departAirport').value = result.departing_airport;
    document.getElementById('arriveAirport').value = result.arrival_airport;
    document.getElementById('route').value = result.route;
    document.getElementById('remarks').value = result.remarks;
    document.getElementById('fuelHours').value = result.fuel_hours;
    document.getElementById('fuelMinutes').value = result.fuel_minutes;
    document.getElementById('paxOnBoard').value = result.number_onboard;

    if (result.flight_type === 'VFR') {
        document.getElementById('inlineVFR').checked = true;
    }
    else if (result.flight_type === 'IFR') {
        document.getElementById('inlineIFR').checked = true;
    }

    document.getElementById('fileButton').hidden = true;
    document.getElementById('updateButton').hidden = false;
}

async function update_flight_plan() {

    let selected_flight_type = 'Unknown';
    if(document.getElementById('inlineVFR').checked) {
        selected_flight_type = 'VFR';
    }
    else if(document.getElementById('inlineVFR').checked) {
        selected_flight_type = 'IFR';
    }

    await fetch(api_base_url + "update", {
        method: "PUT",
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            flight_plan_id: document.getElementById("flightPlanId").value,
            altitude: Number(document.getElementById('altitude').value),
            aircraft_identification: document.getElementById('tailNumber').value,
            aircraft_type: document.getElementById('aircraftType').value,
            airspeed: Number(document.getElementById('airspeed').value),
            arrival_airport: document.getElementById('arriveAirport').value,
            flight_type: selected_flight_type,
            departing_airport: document.getElementById('departAirport').value,
            departure_time: new Date(document.getElementById('departureTime').value).toISOString(),
            estimated_arrival_time: new Date(document.getElementById('arrivalTime').value).toISOString(),
            route: document.getElementById('route').value,
            remarks: document.getElementById('remarks').value,
            fuel_hours: Number(document.getElementById('fuelHours').value),
            fuel_minutes: Number(document.getElementById('fuelMinutes').value),
            number_onboard: Number(document.getElementById('paxOnBoard').value)
        })
    });
}

async function get_all_flight_plans() {

    let arr_response = await fetch(api_base_url, {
        method: "GET",
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
            'Content-Type': 'application/json'
        }
    });

    let arr_data = await arr_response.json();
    let html = '';
    arr_data.forEach(obj => {
        html += '<div class="card mb-5">' +
            '       <div class="card-header container-fluid">' +
            '           <div class="row">' +
            '              <div class="col-md-10">' +
            '                   <h5>' + obj.flight_type + ' flight plan from ' + obj.departing_airport + ' to ' + obj.arrival_airport + '</h5>' +
            '               </div>' +
            '               <div class="col-md-2 float-right">' +
            '                  <button class="btn btn-danger" style="margin-left: 1em" ' +
            '                   onclick="delete_flight_plan(\'' + obj.flight_plan_id + '\')">Delete</button>' +
            '              </div>' +
            '           </div>' +
            '    </div>' +
            '    <div class="card-body">' +
            '        <div class="row m-3 mb-4">' +
            '            <div class="col-3">' +
            '                <h6>Flight Type:</h6> '+ obj.flight_type +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Aircraft Identification:</h6>' + obj.aircraft_identification +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Aircraft Type:</h6> ' + obj.aircraft_type +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Fuel on Board:</h6>' + obj.fuel_hours + ' hours ' + obj.fuel_minutes +
            '            </div>' +
            '        </div>' +
            '        <div class="row m-3 mb-4">' +
            '            <div class="col-3">' +
            '                <h6>Filed Altitude:</h6> ' + obj.altitude + ' feet' +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Filed Airspeed:</h6> ' + obj.airspeed + ' knots' +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Departure Time:</h6>' + new Date(obj.departure_time).toLocaleString()  +
            '            </div>' +
            '            <div class="col-3">' +
            '                <h6>Estimated Arrival Time:</h6>' + new Date(obj.estimated_arrival_time).toLocaleString()  +
            '            </div>' +
            '        </div>' +
            '        <div class="row m-3 mb-4">' +
            '            <div class="col-12"><h6>Route: </h6>' + obj.route + '</div>' +
            '        </div>' +
            '        <div class="row m-3 mb-4">' +
            '            <div class="col-12"><h6>Remarks: </h6>'+ obj.remarks + '   </div>' +
            '        </div>' +
            '    </div>' +
            '    <div class="card-footer text-muted"> ' +
            '    Flight Plan Id: ' +   obj.flight_plan_id   +
            '   </div>' +
            '</div>'

        document.getElementById('flight_plan_list').innerHTML = html;
    });
}

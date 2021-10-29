window.onload = () => {
    
    const FETCH_STATES_URL = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

    fetch(FETCH_STATES_URL,{
        method: 'GET',
    })
    .then( (response) => {
        return response.json()
    })
    .then((data) => {
        let states = data.states;
        let stateId = document.getElementById('state');
        for(let i=0; i<states.length; i++){
            stateId.innerHTML += `<option value="${states[i].state_id}">${states[i].state_name}</option>`;
        }
    })
}
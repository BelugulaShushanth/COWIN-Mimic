let stateId = document.getElementById('state');
stateId.addEventListener("change", () => {

    const FETCH_DISTRICTS_URL = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/";

    fetch(FETCH_DISTRICTS_URL + stateId.value,{
        method: 'GET',
    })
    .then( (response) => {
        return response.json()
    })
    .then((data) => {
        let districts = data.districts;
        let districtId = document.getElementById('district');
        districtId.innerHTML = `<option value="0">Select District</option>`;
        for(let i=0; i<districts.length; i++){
            districtId.innerHTML += `<option value="${districts[i].district_id}">${districts[i].district_name}</option>`;
        }
    })

})
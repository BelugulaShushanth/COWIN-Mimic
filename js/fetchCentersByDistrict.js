let districtId = document.getElementById('district');
districtId.addEventListener("change", () => {

    const FETCH_CENTERS_URL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId.value}&date=28-10-2021`;

    fetch(FETCH_CENTERS_URL,{
        method: 'GET',
    })
    .then( (response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data);
        let sessions = data.sessions;
        let sessionsId = document.getElementById('sessions');
        sessionsId.innerHTML = "";
        if(sessions.length != 0){
            sessionsId.innerHTML = `<h4 class="results"> Showing results for ${sessions[0].district_name}, ${sessions[0].state_name} </h4>`;
        }
        else{
            sessionsId.innerHTML = `<h4 class="results notAvaiable"> No vaccine centers available for the above selected state and district</h4>`;
        }
        for(let i=0; i<sessions.length; i++){
            let ageStatus = sessions[i].allow_all_age
            let age_limit = "& above";
            let max_age_limit = sessions[i].max_age_limit
            if(max_age_limit != undefined){
                age_limit = ageStatus === true ? "& above": "to "+max_age_limit;
            }
            sessionsId.innerHTML += `<br> <div class="card w-95">
            <div class="card-body">
              <h5 class="card-title">
              ${sessions[i].name}
              <span class="vaccineName">${sessions[i].vaccine}</span><br>
              <span class="badge feeType bg-${sessions[i].fee_type == "Paid" ? "danger" : "success"}">${sessions[i].fee_type}</span>
              </h5>
              <div class="capacity">
                <label class="l bg-success">Total capacity: ${sessions[i].available_capacity}</label>
                <label class="l bg-secondary">Dose1: ${sessions[i].available_capacity_dose1}</label>
                <label class="l bg-secondary">Dose2: ${sessions[i].available_capacity_dose2}</label>
              </div> <br>
              <label class="cost">Cost: ${sessions[i].fee} Rs</label><br>
              <b>Address:</b> <p class="card-text">${sessions[i].address}, ${sessions[i].pincode}</p>
              <span class="age">Age : ${sessions[i].min_age_limit} ${age_limit}</span>
              <a href="#" class="btn btn-primary">Button</a>
            </div>
          </div>`;
        }
    })

})
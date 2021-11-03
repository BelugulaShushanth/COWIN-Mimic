let districtId = document.getElementById('district');
let date = new Date();
districtId.addEventListener("change", () => {

    let sessionsId = document.getElementById('sessions');
    sessionsId.innerHTML = "";

    let wallpaper = document.getElementById('wallpaper');
    wallpaper.style.display = "none";

    let loadingImg = document.getElementById('loadingImg');
    loadingImg.classList.add('displayLoading');

    let dateSplit = date.toString().split(" ");
    let fmDate = dateSplit[2]+"-"+(date.getMonth()+1)+"-"+dateSplit[3];

    const FETCH_CENTERS_URL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId.value}&date=${fmDate}`;

    fetch(FETCH_CENTERS_URL,{
        method: 'GET',
    })
    .then( (response) => {
        return response.json()
    })
    .then((data) => {
        //console.log(data);
        let sessions = data.sessions;
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
            let slots = ``;
            let twoslots = "";
            let slotsObj = sessions[i].slots;
            slots = ` <div class="row one">
                        <div class="col">
                        <label class="slot">${slotsObj[0] == undefined ? "" : slotsObj[0]}</label>
                        <label class="slot">${slotsObj[1] == undefined ? "" : slotsObj[1]} </label>
                        </div>
                      </div>`
            if( slotsObj[2] !== undefined ){
                    slots += `<div class="row">
                        <div class="col">
                        <label class="slot">${slotsObj[2] == undefined ? "" : slotsObj[2]}</label>
                        <label class="slot">${slotsObj[3] == undefined ? "" : slotsObj[3]}</label>
                        </div>
                      </div>`
            }
           
            sessionsId.innerHTML += `<br> <div class="card w-95">
            <div class="card-body">
              <h5 class="card-title">
              ${sessions[i].name}
              <span class="badge feeType bg-${sessions[i].fee_type == "Paid" ? "danger" : "success"}">${sessions[i].fee_type}</span>
              </h5>
              <div class="capacity">
                <label class="value">
                 <label class="name">Total capacity:</label> 
                 ${sessions[i].available_capacity}
                 </label>
                <label class="value">
                <label class="name">Dose1:</label> 
                ${sessions[i].available_capacity_dose1}
                </label>
                <label class="value">
                <label class="name">Dose2:</label> 
                ${sessions[i].available_capacity_dose2}
                </label>
              </div> <br>
              <label class="cost">Cost: ${sessions[i].fee} Rs</label>
              <span class="vaccineName">${sessions[i].vaccine}</span>
              <br>
              <div>
                <div class="row slotcol">
                    <div class="col-1">
                        <label> <b>Slots:</b> </label>
                    </div>
                    <div class="col-11">
                    <div class="row">
                        <div class="col">${slots}</div>
                    </div>
                    </div>
                </div>
                <label></label>
              </div>
              <b>Address:</b> <p class="card-text">${sessions[i].address}, ${sessions[i].pincode}</p>
              <span class="age">Age : ${sessions[i].min_age_limit} ${age_limit}</span>
              <a href="#" class="btn btn-primary">Book Slot</a>
            </div>
          </div>`;
        }
        loadingImg.classList.remove('displayLoading');
    })

})
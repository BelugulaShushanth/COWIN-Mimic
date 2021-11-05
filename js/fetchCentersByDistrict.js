let districtId = document.getElementById('district');
let date = new Date();
districtId.addEventListener("change", () => {

    let wallpaper = document.getElementById('wallpaper');
    wallpaper.style.display = "none";

    let dateSplit = date.toString().split(" ");
    let thisDate = dateSplit[2];
    let thisMonth = parseInt(date.getMonth() + 1);
    let thisYear = parseInt(dateSplit[3]);
    let fmDate = thisDate + "-" + thisMonth + "-" + thisYear;
    thisDate = parseInt(thisDate);

    pullData(fmDate);
    populateFilterOptions(thisDate, thisMonth, thisYear, fmDate);

    let applyChanges = document.getElementById('applyChanges');
    applyChanges.addEventListener('click', () => {

        const dateOptObjects = document.querySelectorAll('input[name="dateOptions"]');
        let selectedDate = "";
        for (const dateOptObject of dateOptObjects) {
            if (dateOptObject.checked) {
                selectedDate = dateOptObject.value;
                break;
            }
        }

        const vaccineNameOptions = document.querySelectorAll('input[name="vaccineNameOpt"]');
        let selectedVaccine = "";
        for (const vaccineNameOption of vaccineNameOptions) {
            if (vaccineNameOption.checked) {
                selectedVaccine = vaccineNameOption.value;
                break;
            }
        }

        const feeTypeOptions = document.querySelectorAll('input[name="feeTypeOpt"]');
        let selectedFeeType = "";
        for (const feeTypeOption of feeTypeOptions) {
            if (feeTypeOption.checked) {
                selectedFeeType = feeTypeOption.value;
                break;
            }
        }

        const doseOptions = document.querySelectorAll('input[name="doseOpt"]');
        let selectedDose = "";
        for (const doseOption of doseOptions) {
            if (doseOption.checked) {
                selectedDose = doseOption.value;
                break;
            }
        }

        pullData(fmDate, selectedDate, selectedVaccine, selectedFeeType, selectedDose);

    })

})

function pullData(fmDate, selectedDate, selectedVaccine, selectedFeeType, selectedDose) {

    let sessionsId = document.getElementById('sessions');
    sessionsId.innerHTML = "";

    let loadingImg = document.getElementById('loadingImg');
    loadingImg.classList.add('displayLoading');


    fmDate = selectedDate === undefined ? fmDate : selectedDate;

    const FETCH_CENTERS_URL = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId.value}&date=${fmDate}`;

    // let filterBtn = document.getElementById('filterBtn');
    // filterBtn.style.display = "none";

    fetch(FETCH_CENTERS_URL, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data);
            populateCenters(data, sessionsId, fmDate, selectedVaccine, selectedFeeType, selectedDose);
            loadingImg.classList.remove('displayLoading');
            // filterBtn.style.display = 'block';

        })
}

function populateCenters(data, sessionsId, fmDate, selectedVaccine, selectedFeeType, selectedDose) {

    let sessions = data.sessions;
    if (sessions.length != 0) {
        sessionsId.innerHTML = `<h4 class="results"> Showing results for ${sessions[0].district_name}, ${sessions[0].state_name} </h4>`;
    }
    else {
        sessionsId.innerHTML = `<h4 class="results notAvaiable"> No vaccine centers available for the above selected state and district</h4>`;
    }

    sessionsId.innerHTML += `<label class="filterStatus"><b>Date: </b>${fmDate}&nbsp;
                            <b>Vaccine Name: </b>${selectedVaccine === undefined ? "ALL" : selectedVaccine}&nbsp;
                            <b>Fee Type: </b>${selectedFeeType === undefined ? "ALL" : selectedFeeType}&nbsp;
                            <b>Dose: </b>${selectedDose === undefined ? "ALL" : selectedDose}
                            </label>
                            <button id="filterBtn" type="button" class="btn btn-primary" data-bs-toggle="modal"
                                data-bs-target="#filterModal">
                                    Filter <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
                                    </svg>
                            </button><br>`;

    for (let i = 0; i < sessions.length; i++) {

        if (selectedVaccine !== undefined && selectedFeeType !== undefined && selectedDose !== undefined) {
            if (selectedVaccine !== "ALL" && selectedFeeType === "ALL" && selectedDose === "ALL") {
                if (validateVaccineName(selectedVaccine, sessions[i].vaccine)) continue;
            }
            else if (selectedVaccine === "ALL" && selectedFeeType !== "ALL" && selectedDose === "ALL") {
                if(validateFeeType(selectedFeeType, sessions[i].fee_type)) continue;
            }
            else if (selectedVaccine === "ALL" && selectedFeeType === "ALL" && selectedDose !== "ALL") {
                if(validateDose(selectedDose, sessions[i].available_capacity_dose1, sessions[i].available_capacity_dose2)) continue;
            }
            else if(selectedVaccine !== "ALL" && selectedFeeType !== "ALL" && selectedDose === "ALL"){
                if(validateVaccineName(selectedVaccine, sessions[i].vaccine) || validateFeeType(selectedFeeType, sessions[i].fee_type)) continue;
            }
            else if(selectedVaccine === "ALL" && selectedFeeType !== "ALL" && selectedDose !== "ALL"){
                if(validateFeeType(selectedFeeType, sessions[i].fee_type) || validateDose(selectedDose, sessions[i].available_capacity_dose1, sessions[i].available_capacity_dose2)) continue;
            }
            else if(selectedVaccine !== "ALL" && selectedFeeType == "ALL" && selectedDose !== "ALL"){
                if(validateVaccineName(selectedVaccine, sessions[i].vaccine) || validateDose(selectedDose, sessions[i].available_capacity_dose1, sessions[i].available_capacity_dose2)) continue;
            }
            else if(selectedVaccine !== "ALL" && selectedFeeType !== "ALL" && selectedDose !== "ALL"){
                if(validateVaccineName(selectedVaccine, sessions[i].vaccine) || validateFeeType(selectedFeeType, sessions[i].fee_type) || validateDose(selectedDose, sessions[i].available_capacity_dose1, sessions[i].available_capacity_dose2)) continue;
            }
        }
        let ageStatus = sessions[i].allow_all_age
        let age_limit = "& above";
        let max_age_limit = sessions[i].max_age_limit
        if (max_age_limit != undefined) {
            age_limit = ageStatus === true ? "& above" : "to " + max_age_limit;
        }

        let slotsObj = sessions[i].slots;
        let slots = ` <div class="row one">
                        <div class="col">
                        <label class="slot">${slotsObj[0] == undefined ? "" : slotsObj[0]}</label>
                        <label class="slot">${slotsObj[1] == undefined ? "" : slotsObj[1]} </label>
                        </div>
                      </div>`
        if (slotsObj[2] !== undefined) {
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
}

function populateFilterOptions(thisDate, thisMonth, thisYear, fmDate) {

    //to populate date filter options
    let next7Days = [];
    let noOfDays = parseInt(new Date(thisYear, thisMonth, 0).getDate());

    for (let i = 1; i < 8; i++) {
        if (thisDate > noOfDays) {
            if (thisMonth === 12) {
                thisDate = 1;
                thisMonth = 1;
                thisYear += 1
            }
            else {
                thisDate = 1;
                thisMonth += 1;
            }
        }
        if (thisDate < 10) {
            thisDate = "0" + thisDate.toString();
        }
        let tempDate = thisDate + "-" + thisMonth + "-" + thisYear;
        next7Days.push(tempDate);
        thisDate = parseInt(thisDate);
        thisDate++;
    }
    let dateContent = document.getElementsByClassName('dateContent')[0];
    let dateContents = "";

    for (let i = 0; i < next7Days.length; i++) {
        dateContents += `<label class="dateOptObjLabel" for="${next7Days[i]}">${next7Days[i]}</label>
                        <input type="radio" class="dateOptObj" ${next7Days[i] === fmDate ? "checked" : ""} id="${next7Days[i]}"" name="dateOptions" value="${next7Days[i]}"/><br>`
    }
    dateContent.innerHTML = dateContents;


    //to populate vaccine name filter options
    let vaccineNameContent = document.getElementsByClassName('vaccineNameContent')[0];
    vaccineNameContent.innerHTML = `<form>
                                    <label for="all1">ALL</label>
                                    <input type="radio" id="all1" name="vaccineNameOpt" value="ALL" checked /><br>
                                    <label for="covaxin">COVAXIN</label>
                                    <input type="radio" id="covaxin" name="vaccineNameOpt" value="COVAXIN" /><br>
                                    <label for="covishield" >COVISHIELD</label>
                                    <input type="radio" id="covishield" name="vaccineNameOpt" value="COVISHIELD" /><br>
                                    <label for="sputnikv">SPUTNIK V</label>
                                    <input type="radio" id="sputnikv" name="vaccineNameOpt" value="SPUTNIK V" />
                                    </form>`


    //to populate fee type filter options
    let feeTypeContent = document.getElementsByClassName('feeTypeContent')[0];
    feeTypeContent.innerHTML = `<label for="all2">ALL</label>
                                <input type="radio" id="all2" name="feeTypeOpt" value="ALL" checked /><br>
                                <label for="free">FREE</label>
                                <input type="radio" id="free" name="feeTypeOpt" value="FREE" /><br>
                                <label for="paid" >PAID</label>
                                <input type="radio" id="paid" name="feeTypeOpt" value="PAID" />`


    //to populate dose filter options
    let doseContent = document.getElementsByClassName('doseContent')[0];
    doseContent.innerHTML = `<label for="all3">ALL</label>
                                <input type="radio" id="all3" name="doseOpt" value="ALL" checked /><br>
                                <label for="dose1">DOSE1</label>
                                <input type="radio" id="dose1" name="doseOpt" value="DOSE1" /><br>
                                <label for="dose2" >DOSE2</label>
                                <input type="radio" id="dose2" name="doseOpt" value="DOSE2" />`
}

function validateVaccineName(selectedVaccine, actualVaccine) {
    if (selectedVaccine !== actualVaccine) {
        return true;
    }

    return false;
}

function validateFeeType(selectedFeeType , actual_feeType) {
    actual_feeType = actual_feeType.toString().toUpperCase();
    if (selectedFeeType !== actual_feeType) {
        return true;
    }

    return false;
}

function validateDose(selectedDose, actualDose1, actualDose2){
    if (selectedDose === "DOSE1") {
        if (actualDose1 == 0) return true;
    }
    else {
        if (actualDose2 == 0) return true;
    }
    
    return false;
}
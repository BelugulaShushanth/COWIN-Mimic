window.onload = () => {

    const FETCH_STATES_URL = "https://cdn-api.co-vin.in/api/v2/admin/location/states";

    let token = getCookie("token");

    console.log(token);

    let login = document.getElementById('login');
    let logout = document.getElementById('logout');

    // let notLoggedInModal = document.getElementById('notLoggedInModal');
    // let downloadCertModalLoggedIn = document.getElementById('downloadCertModalLoggedIn'); 
    
    if(token !== undefined && token!=null && token !== "" && token !== " " ){ //IF LOGGED IN
        login.classList.add('modalDontDisplay');
        logout.classList.add('modalDisplay');
        // notLoggedInModal.add('modalDontDisplay');
        // downloadCertModalLoggedIn.add('modalDisplay');
    }
    else{// IF NOT LOGGED IN
        // notLoggedInModal.add('modalDisplay');
        // downloadCertModalLoggedIn.add('modalDontDisplay');
    }

    // let login = document.getElementById('login');
    // login.click();


    fetch(FETCH_STATES_URL, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            let states = data.states;
            let stateId = document.getElementById('state');
            for (let i = 0; i < states.length; i++) {
                stateId.innerHTML += `<option value="${states[i].state_id}">${states[i].state_name}</option>`;
            }
        })
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
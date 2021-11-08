const GENERATE_OTP_URL = "https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP";

const CONFIRM_OTP_URL = "https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP";

const GET_BENEFICIARIES_URL = "https://cdndemo-api.co-vin.in/api/v2/appointment/beneficiaries";


let getOTPModal = document.getElementById('getOTPModal');
let verifyOTPModal = document.getElementById('verifyOTPModal');

let getOTPForm = document.getElementById('getOTPForm');
let verifyOTPForm = document.getElementById('verifyOTPForm');

let downloadCertId = document.getElementById('downloadCertId');

getOTPForm.addEventListener('submit', (event1) => {

    event1.preventDefault();

    const mobile_number = document.getElementById('mobileNo').value;

    getOTPFn(mobile_number);


})

function getOTPFn(mobile_number) {
    let status1;

    fetch(GENERATE_OTP_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "mobile": mobile_number
            }
        )
    })
        .then((response1) => {
            status1 = response1.status;
            return response1.json();
        })
        .then( (data1) => {
            
            if(status1 == 200) {
                let txnId = data1.txnId;
                getOTPModal.classList.add('modalDontDisplay');
                verifyOTPModal.classList.add('modalDisplay');

                verifyOTPForm.addEventListener('submit', (event2) => {
                    event2.preventDefault();

                    verifyOTPFn(txnId);
                });
            }
            else{
                alert("Unable to send OTP check your mobile number and try again!");
            }  

        })
        .catch((error) => {
            displayError();
            console.log(error);
        });
}

function verifyOTPFn(txnId) {
    let status2;

    let otp = document.getElementById('otp').value;
    let encryptedOtp = SHA256(otp.toString());
    fetch(CONFIRM_OTP_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "otp": encryptedOtp,
                "txnId": txnId
            }
        )
    })
        .then((response2) => {
            status2 = response2.status;
            return response2.json();
        })
        .then((data2) => {
            if(status2 == 200){
            const token = data2.token;
            document.cookie = `token=${token}`;
            let close= document.getElementById('close');
            close.click();
            populateBeneficaries(token);
            alert("You Have Logged In Successfully");
            let login = document.getElementById("login");
            let logout = document.getElementById('logout');
            login.classList.add('modalDontDisplay');
            logout.classList.add('modalDisplay');
            //const beneficiary_reference_id = "32600491890923";
            }
            else if(status2 == 500){
                alert("Unable to verify OTP internal server error!")
            }
            else{
                alert("Invalid OTP!");
            }

        })
        .catch((error) => {
            displayError();
            console.log(error);
        });
}

function populateBeneficaries(token){
    fetch(GET_BENEFICIARIES_URL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
    .then((response3) => {
        console.log(response3);
        return response3.json();
    })
    .then((data3) => {
        console.log(data3);
    })
}


function displayError(){
    alert("Unexpected error has occurred please try again after sometime!");
};

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


const DOWNLOAD_CERTFICATE_URL = "https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id=";


let toLogin = document.getElementById('toLogin');
toLogin.addEventListener('click', () => {
    let close2 = document.getElementById('close2');
    close2.click();
    let login = document.getElementById('login');
    login.click();
});

let downloadCertForm = document.getElementById('downloadCertForm');
downloadCertForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let downloadCertLoading = document.getElementById('downloadCertLoading');
    downloadCertLoading.classList.add('display-spinner');
    let beneficiaryId = document.getElementById('beneficiaryId').value;
    downloadCertificate(beneficiaryId);
});



function downloadCertificate(beneficiary_reference_id) {

    let token = getCookie('token');

    //let status;

    fetch(DOWNLOAD_CERTFICATE_URL + beneficiary_reference_id, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
        .then(async response3 => ({
            status : response3.status,
            filename: `Vaccine_Ceritficate-${beneficiary_reference_id}`,
            blob: await response3.blob()
        }))
        .then(resObj => {
            let status = resObj.status;
            
            if (status === 200) {
                //console.log("downloading certificate");
                // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
                const newBlob = new Blob([resObj.blob], { type: 'application/pdf' });

                // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(newBlob);
                } else {
                    // For other browsers: create a link pointing to the ObjectURL containing the blob.
                    const objUrl = window.URL.createObjectURL(newBlob);

                    let link = document.createElement('a');
                    link.href = objUrl;
                    link.download = resObj.filename;
                    link.click();

                    // For Firefox it is necessary to delay revoking the ObjectURL.
                    setTimeout(() => { window.URL.revokeObjectURL(objUrl); }, 250);
                }
            }
            else if (status === 500) {
                displayError();
            }
            else{
                alert("Invalid beneficiary reference id");
            }
            downloadCertLoading.classList.remove('display-spinner');
        })
        .catch((error) => {
            displayError();
            console.log(error);
            downloadCertLoading.classList.remove('display-spinner');
        })
}




function displayError() {
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
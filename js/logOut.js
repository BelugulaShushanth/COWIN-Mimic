let logout= document.getElementById('logout');
logout.addEventListener('click', () => {
    let ok = confirm("Are you sure do you want to logout?");
    if(ok){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //deletes cookie
    alert("You Have Logged Out Successfully");
    location.reload();
    }
})
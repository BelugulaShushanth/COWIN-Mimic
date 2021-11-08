let logout= document.getElementById('logout');
logout.addEventListener('click', () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //deletes cookie
    alert("You Have Logged Out Successfully");
    location.reload();
})
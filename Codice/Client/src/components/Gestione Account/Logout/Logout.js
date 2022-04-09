const FinestraLogout = () => {
    sessionStorage.removeItem("id_account");
    sessionStorage.removeItem("email");
    localStorage.clear();
}

export default FinestraLogout;

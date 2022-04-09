import React from "react";

const Header = () => {

    return (   
        <header className="bg-dark row m-0">
            <div id="logoHeader">
                <a href="/">
                    <img id='logo' src="/images/logo.png" alt="logo"/>
                </a>
            </div>
            <div>
                <a id="titoloHeader" href="/">Magic Travel</a>
            </div>
         </header>
    );
} 

export default Header;

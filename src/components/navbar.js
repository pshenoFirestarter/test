import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Logo from '../mit_logo_white_full.svg'
import PropTypes from 'prop-types';


const Nav = ({isAuth, logout}) => {
    const [menu, setMenu] = useState(false);


    useEffect(() => {

    }, [])


    return (
        <nav id={'navbar'}>
            <div className="nav-wrapper black lighten-2" style={{height: '100%'}}>
                <div className="home-wrapper">

                    {/*<a onClick={() => setMenu(!menu)}*/}
                    {/*   className="btn-floating btn-large waves-effect waves-light grey darken-3">*/}
                    {/*    <i className="material-icons burger">menu</i>*/}
                    {/*</a>*/}

                    <NavLink className={'logo'} to={'/stats'}><img src={Logo} alt=""/></NavLink>
                </div>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {isAuth ? <li style={{cursor: 'pointer'}} onClick={() => logout()}><b>LogOut</b></li> : null}
                </ul>
            </div>

            {/*<div className={`menu-wrapper black ${menu ? 'active' : ''}`}>*/}
            {/*    <ul>*/}
            {/*        <li onClick={() => setMenu(false)}><NavLink to={'/advertisers'}>advertisers</NavLink></li>*/}
            {/*        <li onClick={() => setMenu(false)}><NavLink to={'/statistics'}>statistics</NavLink></li>*/}
            {/*    </ul>*/}
            {/*</div>*/}

        </nav>
    )
}

Nav.prototype = {
    isAuth: PropTypes.bool,
    logout: PropTypes.func,
}

export default Nav
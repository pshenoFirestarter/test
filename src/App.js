import React, {useContext, useEffect} from 'react';
import {HashRouter as Router} from 'react-router-dom'
import {connect} from 'react-redux'
import {useRoutes} from "./routes";
import Nav from './components/navbar';
import Preload from './components/preloader';
import { hot } from 'react-hot-loader/root';
import {authorize} from "./redux/actions";

const App = (props) => {
    if (localStorage.token !== 'undefined') {
        props.authorize(!!localStorage.token)
    }
    const routes = useRoutes(props.isAuth);

    const logout = () => {
        localStorage.clear();
        props.authorize(false);
    }

    useEffect(() => {

    }, [hot])


    return (
        <Router>
            <Nav isAuth={props.isAuth} logout={logout} />
            {routes}

            {props.preloader ? <Preload /> : null}
        </Router>
    )
};


const mapDispatchToProps = {
    authorize
};


const mapStateToProps = state => {
    return {
        preloader: state.store.preloader,
        isAuth: state.store.isAuth
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(hot(App));

import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/msg.hook";
import {AuthContext} from "../context/AuthContext";
import {authorize, preloader} from "../redux/actions";
import {connect} from "react-redux";
import {func} from "prop-types";

const Auth = ({preloader, authorize}) => {
    const message = useMessage();
    const {load, err, req, clear} = useHttp(preloader);
    const [form, setForm] = useState({
        user: '',
        password: '',
    });

    useEffect(()=> {
        message(err);
        clear()
    }, [err, message, clear]);

    const checngeHandler = evt => {
        setForm(
            {...form, [evt.target.name]: evt.target.value}
        )
    };

    const loginHandler = async ($event) => {
        $event.preventDefault();

        if (form.user.length === 0 || form.password.length === 0) {
            message('Поля не заполнены')

            return
        }

        try {
            fetch(process.env.REACT_APP_API + 'login', {method: 'POST', body: JSON.stringify(form), headers: {
                    'content-type': 'application/json'
                }}).then(function(res) {
                    if (res.status === 200) {
                        localStorage.setItem('token', true)
                        authorize(true)

                        return
                    } else if (res.status === 401) {
                        message('No authorization')
                        localStorage.clear()
                    }

            })
        }  catch (e) {
            message('No authorization')
        }

    };


    return (

        <div className="row auth-page">
            <div className="s2 container" style={{width: '370px', paddingTop: '150px'}}>

                <form onSubmit={loginHandler} className="card grey darken-1">
                    <div className="card-content white-text">
                        <span className={'card-title'}>LOG IN</span>

                        <div>
                            <div className="input-field">
                                <input
                                    id="email"
                                    type="text"
                                    name='user'
                                    autoComplete='off'
                                    value={form.user}
                                    onChange={checngeHandler}
                                    disabled={load}
                                    className="validate" />

                                <label htmlFor="email">Login</label>
                            </div>

                            <div className="input-field">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    autoComplete={'off'}
                                    onChange={checngeHandler}
                                    className="password" />

                                <label htmlFor="password">Password</label>
                            </div>
                        </div>

                    </div>
                    <div className="card-action">
                        <button
                            type={'submit'}
                            disabled={load}
                            className="btn black waves-effect waves-light "
                            style={{marginRight:'20px'}}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    preloader,
    authorize
};

export default connect(null, mapDispatchToProps)(Auth);
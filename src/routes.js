import React from "react";
import {Switch, Route, Redirect} from 'react-router-dom';
import S404 from './pages/404';
import Auth from './pages/auth'
import Stats from './pages/statistic'


export const useRoutes = isAuth  => {
    if (isAuth) {
        return(
            <Switch>
                <Route path="/404" exact>
                    <S404 />
                </Route>

                <Route path="/stats" exact>
                    <Stats />
                </Route>

                <Redirect to={'/stats'} />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/auth" exact>
                <Auth />
            </Route>

            <Redirect to={'/auth'} />
        </Switch>
    )
}
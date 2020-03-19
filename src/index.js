//MAIN CORE
import React from 'react';
import { render } from 'react-dom';
import { Provider } from "react-redux";

import * as API from './shared/http';
import { getFirebaseToken, getFirebaseUser } from './backend/auth';
import { firebase } from './backend/core';

import Router from './components/router/Router';
import Route from './components/router/Route';
import {history} from './history/history';

import App from './App';
import { Home } from './pages/home';
import SignlePost from './pages/post';
import NotFound from './pages/404';
import { Login } from './pages/login';

import configureStore from './store/ConfigureStore';
import initialReduxState from "./constants/initialState";

import { createError } from "./actions/error";
import { loginSucces } from "./actions/auth";
import { loaded, loading } from "./actions/loading";

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import './styles/styles.scss';

const store = configureStore(initialReduxState);

//Функция рендера приложения, оборачиваем метод render, чтобы передавать местоположение и callback
export const renderApp = (state, callback = () => {}) => {
    render(
        <Provider store={store}>
            <Router {...state}> 
                <Route path="" component={App}> 
                    <Route path="/" component={Home} />
                    <Route path='/posts/:postId' component={SignlePost} />
                    <Route path="/login" component={Login} />
                    <Route path='*' component={NotFound} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById('app'), 
        callback
    );
};

//Объект состояния для отслеживания местоположения юзера
let initialState = {
    location: window.location.pathname
};

renderApp(initialState);

//Сигнализация изменения местоположения и обновление роутера (рендер с новыми состояниями)
history.listen(location => {
    const user = firebase.auth().currentUser;
    const newState = Object.assign(initialState, {location: user ? location.pathname : '/login'}) 
    renderApp(newState);
});

getFirebaseUser()
    .then(async user => {
        if (!user) {
            return history.push('/login');
        }
        store.dispatch(loading());
        const token = await getFirebaseToken();
        const res = await API.loadUser(user.id);
        if(res.status === 404){ //Если пользователя не существует - происходит регистрация
            const userPayload = {
                name: user.displayName,
                profilePicture: user.photoUrl,
                id: user.id
            };
            const newUser = await API.createUser(userPayload).then(res => res.json());
            dispatch(loginSucces(newUser, token));
            dispatch(loaded());
            history.push('/');
            return newUser;
        }
        
        const exisitngUser = await res.json();
        dispatch(loginSucces(exisitngUser, token));
        dispatch(loaded());
        history.push('/');
        return exisitngUser;
    })
    .catch(err => createError(err));
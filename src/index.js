import React from 'react';
import { render } from 'react-dom';

import * as API from './shared/http';
import App from './App';
import { Home } from './pages/home';
import SignlePost from './pages/post';
import Router from './components/router/Router';
import Route from './components/router/Route';
import {history} from './history/history';

import './shared/crash';
import './shared/service-worker';
import './shared/vendor';
// NOTE: this isn't ES*-compliant/possible, but works because we use Webpack as a build tool
import './styles/styles.scss';
import NotFound from './pages/404';
import { Login } from './pages/login';
import { getFirebaseToken } from './backend/auth';
import { firebase } from './backend/core';

//Функция рендера приложения, оборачиваем метод render, чтобы передавать местоположение и callback
export const renderApp = (state, callback = () => {}) => {
    render(
        /*Оператор распространения JSX для заполнения местоположения для Router*/
        <Router {...state}> 
            <Route path="" component={App}> 
                <Route path="/" component={Home} />
                <Route path='/posts/:postId' component={SignlePost} />
                <Route path="/login" component={Login} />
                <Route path='*' component={NotFound} />
            </Route>
        </Router>,
        document.getElementById('app'), 
        callback
    );
};

//Объект состояния для отслеживания местоположения юзера
let state = {
    location: window.location.pathname,
    user:{
        authenticated: false,
        profilePicture: null,
        id: null,
        name: null,
        token: null
    }
};

//renderApp(state);

//Сигнализация изменения местоположения и обновление роутера (рендер с новыми состояниями)
history.listen(location => {
    const user = firebase.auth().currentUser;
    console.log('renderApp-user: ',user);    
    state = Object.assign({}, state, {location: user ? location.pathname : '/login'}); //Проверяем, существует ли юзер в FireBase
    renderApp(state);
});

//Реагируем на изменение состояния юзера
firebase.auth().onAuthStateChanged(async user => {
    if (!user) { //Юзера нет - идем на логин
        state = {
            location: state.location,
            user: {
                authenticated: false
            }
        };
        return renderApp(state, () => {
            history.push('/login');
        });
    }

    const token = await getFirebaseToken(); //Получаем токен юзера
    const res = await API.loadUser(user.uid); //Пытаемся получить юзера из API
    let renderUser;

    if (res.status === 404) { //Нет юзера - регистрируем его
        const userPayload = {
            name: user.displayName,
            profilePicture: user.photoURL,
            id: user.uid
        };
        renderUser = await API.createUser(userPayload).then(res => res.json());
    } else {
        renderUser = await res.json(); //Юзер есть - рендерим всё приложение
    }
    history.push('/'); //Идем на главную
    state = Object.assign({}, state, { //Обновляем состояние
        user: {
            name: renderUser.name,
            id: renderUser.id,
            profilePicture: renderUser.profilePicture,
            authenticated: true
        },
        token
    });
    console.log('onAuthStateChanged-user: ', user);
    renderApp(state);
});

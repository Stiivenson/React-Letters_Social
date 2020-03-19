//Создатели действий для пользователя
import * as types from '../constants/types';
import * as API from '../shared/http';
import { history } from "../history/history";
import { createError } from "./error";
import { loading, loaded } from "./loading";
import { getFirebaseToken, getFirebaseUser, loginWithGoogle, logUserOut } from "../backend/auth";

//Вход в приложение
export function loginSucces(user, token){
    return{
        type: types.auth.LOGIN_SUCCESS,
        user,
        token
    };
}

//Выход из приложения
export function logoutSucces(){
    return{
        type: types.auth.LOGOUT_SUCCESS
    };
}

//Вход в пользователя
export function login(){
    return dispatch => {
        return loginWithGoogle().then(async () => { //Вход с помощью Google
            try{
                dispatch(loading());
                const user = await getFirebaseUser;
                const token = await getFirebaseToken;
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
            }
            catch(err){
                createError(err);
            }
        })
    };
}

//Выход при помощи FireBase
export function logout(){
    return dispatch => {
        return logUserOut()
            .then(() => {
                history.push('/login');
                dispatch(logoutSucces());
                window.Raven.setUserContext(); //Очистка контекста пользователя (библиотека отслеживания ошибок)
            })
            .catch(err => dispatch(createError(err)));
    };
}
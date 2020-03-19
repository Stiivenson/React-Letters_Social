//Редуктор пользователя
import initialState from "../constants/initialState";
import * as types from "../constants/types";
import Cookies from "js-cookie";

export function user(state = initialState.user, action){ //Принимаем состояние и действие
    switch(action.type){
        case types.auth.LOGIN_SUCCESS:{
            const {user, token} = action;
            Cookies.set('letters-token', token); //Сохраняем токен в cookie
            return Object.assign({}, state, {
                authenticated: true,
                profilePicture: user.profilePicture || '/static/assets/users/4.jpg',
                id: user.id,
                name: user.name,
                token
            });            
        }
        case types.auth.LOGOUT_SUCCESS:{
            Cookies.remove('letters-token');
            return initialState.user;            
        }
        default:
            return state;
    }
}
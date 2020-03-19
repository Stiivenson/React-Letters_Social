//Редуктор загрузки
import initialState from "../constants/initialState";
import * as types from "../constants/types";

export function loading(state = initialState.loading, action){ //Принимаем состояние и действие
    switch(action.type){
        case types.app.LOADING:
            return true;
        case types.app.LOADED:
            return false;
        default:
            return state;
    }
}
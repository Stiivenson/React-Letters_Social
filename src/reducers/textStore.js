import initialState from "../constants/initialState";

export function textStore(state = initialState.text, action){ //Принимаем состояние и действие
    switch(action.type){
        case 'SEND_TEXT':
            return action.text;
        default:
            return state;
    }
}
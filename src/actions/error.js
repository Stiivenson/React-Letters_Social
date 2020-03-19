//Создатели действия ошибки
import * as types from '../constants/types';

export function createError (error, info){ //Отпраляем инфу об ошибке в хранилище
    return{
        //Передаем тип ошибки, саму ошибку и инфу о ней
        type: types.app.ERROR,
        error,
        info
    };
}
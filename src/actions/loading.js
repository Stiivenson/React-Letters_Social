//Создатели загружающих и загруженных действий
import * as types from '../constants/types'; //Импорт типов из файла констант

export function loading(){
    return {
        type: types.app.LOADING //Возвращение объекта действия с нужным типом ключа с использованием определенного ранее загружающего типа
    };
}

export function loaded(){ //Экспорт создателя действия для загруженного действия
    return {
        type: types.app.LOADED
    };
}
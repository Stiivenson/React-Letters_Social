//Создатели действий для комментариев
import * as types from '../constants/types';
import * as API from "../shared/http";
import { createError } from "./error";

//Показать определенный раздел комментов
export function showComments(postId){
    return{
        type: types.comments.SHOW,
        postId
    };
}

//Переключение раздела комментов
export function toggleComments(postId){
    return{
        type: types.comments.TOGGLE,
        postId
    };
}

//Возможность получения комментов
export function updateAvailableComments(comments){
    return{
        type: types.comments.GET,
        comments
    };
}

//Создание коммента
export function createComment(payload){
    return dispatch => {
        return API.createComment(payload)
            .then(res => res.json())
            .then(comment => {
                dispatch({ //Отправляем полученный JSON-комментарий в хранилище
                    type: types.comments.CREATE,
                    comment
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

//Выбор комментов для определенного сообщения
export function getCommentsForPost(postId){
    return dispatch => {
        return API.fetchCommentsForPost(postId)
            .then(res => res.json())
            .then(comments => dispatch(updateAvailableComments(comments)))
            .catch(err => dispatch(createError(err)));
    };
}
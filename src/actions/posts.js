//Создатели действий для постов
import * as types from '../constants/types';
import * as API from "../shared/http";
import { createError } from "./error";
import { getCommentsForPost } from './comments';

//Возможность получения постов
export function updateAvailablePosts(posts){
    return{
        type: types.posts.GET,
        posts
    };
}

//Обновление ссылок на разбивку страниц в хранилище 
export function updatePaginationLinks(links){
    return{
        type: types.posts.UPDATE_LINKS,
        links
    };
}

//Отмечаем лайком конкретный пост
export function like(postId){
    return (dispatch, getState) => {
        const { user } = getState();
        return API.likePost(postId, user.id)
            .then(res => res.json())
            .then(post => {
                dispatch({
                    type: types.posts.LIKE,
                    post
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

//Отмечаем анлайком конкретный пост
export function unlike(postId){
    return (dispatch, getState) => {
        const { user } = getState();
        return API.unlikePost(postId, user.id)
            .then(res => res.json())
            .then(post => {
                dispatch({
                    type: types.posts.UNLIKE,
                    post
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}
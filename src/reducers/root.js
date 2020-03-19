//Создание корневого редуктора
import {combineReducers} from 'redux';

//Импортируем отельные редукторы
import { error } from "./error";
import { loading } from "./loading";
import { pagination } from "./pagination";
import { posts, postIds } from "./posts";
import { comments, commentIds } from "./comments";
import { user } from "./user";
import { textStore } from './textStore';

const rootReducer = combineReducers({
    loading,
    error,
    pagination,
    posts,
    postIds,
    comments,
    commentIds,
    user
}); 

export default rootReducer;
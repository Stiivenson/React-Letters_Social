import initialState from "../constants/initialState";
import * as types from "../constants/types";

export function comments(state = initialState.comments, action){ //Принимаем состояние и действие
    switch(action.type){
        case types.comments.GET: { //Для GET создается копия состояния и добавляются комменты, которых не было
            const {comments} = action;
            let nextState = Object.assign({}, state);
            for (let comment of comments) {
                if(!nextState[comment.id]){
                    nextState[comment.id] = comment;
                }
            }
            return nextState;
        }
        case types.comments.CREATE: { //Добавление коммента к состоянию
            const {comment} = action;
            let nextState = Object.assign({}, state);
            nextState[comment.id] = comment;
            return nextState;
        }
        default:
            return state;
    }
}

export function commentIds(state = initialState.commentIds, action){ 
    switch(action.type){
        case types.comments.GET: { 
            const nextCommentIds = action.comments.map(comment => comment.id); //Нужны только id, так как храним их отдельно от самих объектов
            let nextState = Array.from(state);
            for (let commentId of nextCommentIds) {
                if(!nextState.includes(commentId)){
                    nextState.push(commentId);
                }
            }
            return nextState;
        }
        case types.comments.CREATE: {
            const {comment} = action;
            let nextState = Array.from(state);
            nextState.push(comment.id);
            return nextState;
        }
        default:
            return state;
    }
}
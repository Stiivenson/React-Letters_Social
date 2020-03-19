import initialState from "../constants/initialState";
import * as types from "../constants/types";

/**
 * The posts reducer controls the state of the actual post objects. We are storing them here in a
 * Map because that data structure is well-suited to shallow key-value lookup with preserved insertion order
 * @method posts
 * @module letters/reducers
 * @param  {Map} [state=initialState.posts] initial state of the reducer
 * @param  {object} action                     Redux action
 * @return {object}                            next state for slice
 */
export function posts(state = initialState.posts, action){ 
    switch(action.type){
        case types.posts.GET: { 
            const {posts} = action;
            let nextState = Object.assign({}, state);
            for (let post of posts) {
                if(!nextState[post.id]){
                    nextState[post.id] = post;
                }
            }
            return nextState;
        }
        case types.posts.CREATE: { 
            const {post} = action;
            let nextState = Object.assign({}, state);
            nextState[post.id] = post;
            return nextState;
        }
        case types.comments.SHOW: { 
            let nextState = Object.assign({}, state);
            nextState[action.postId].showComments = true;
            return nextState;
        }
        case types.comments.TOGGLE: { 
            let nextState = Object.assign({}, state);
            nextState[action.postId].showComments = !nextState[action.postId].showComments;
            return nextState;
        }
        case types.posts.LIKE: { //Обновляем состояние одного сообщения с новыми данными API
            let nextState = Object.assign({}, state);
            const oldPost = nextState[action.post.id]
            nextState[action.post.id] = Object.assign({}, oldPost, action.post);
            return nextState;
        }
        case types.posts.UNLIKE: { 
            let nextState = Object.assign({}, state);
            const oldPost = nextState[action.post.id]
            nextState[action.post.id] = Object.assign({}, oldPost, action.post);
            return nextState;
        }
        case types.comments.CREATE: { 
            const {comment} = action;
            let nextState = Object.assign({}, state);
            nextState[comment.postId].comments.push(comment);
            return nextState;
        }

        default:
            return state;
    }
}

export function postIds(state = initialState.postIds, action){ 
    switch(action.type){
        case types.posts.GET: { 
            const nextPostIds = action.posts.map(post => post.id); 
            let nextState = Array.from(state);
            for (let post of nextPostIds) {
                if(!nextState.includes(post)){
                    nextState.push(post);
                }
            }
            return nextState;
        }
        case types.posts.CREATE: {
            const {post} = action;
            let nextState = Array.from(state);
            if(!nextState.includes(post.id)){
                nextState.push(post.id);
            }
            return nextState;
        }
        default:
            return state;
    }
}
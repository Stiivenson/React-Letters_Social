//Хранилище для разработки
import thunk from "redux-thunk"; //Библиотека для создания асинхронных действий
//Утилита compose позволяет комбинировать промежуточное ПО
//applyMiddleware - интегрировать промежуточное ПО
import { createStore, compose, applyMiddleware } from "redux"; 
import rootReducer from '../reducers/root';

let store;
export default initialState => {
    if (store){ //Проверка, что используется одно хранилище, чтобы не создавать несколько
        return store; 
    }
    const createdStore = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(thunk),
            window.devToolsExtension() //Используем расширение бразуера для Redux
        ) 
    );
    store = createdStore;
    return store;
}





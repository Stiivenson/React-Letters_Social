//Тестовый пример отправки действий
import configureStore from './ConfigureStore'; 
import { loaded, loading } from "../actions/loading";

const store = configureStore(); //Создаем хранилище

console.log('======= Example store =======');
store.dispatch(loading());
store.dispatch(loaded());
store.dispatch(loading());
store.dispatch(loaded());
console.log('======= end Example store =======');
/*Модуль для работы с API HTML5 History, позволяет задействовать навигацию с изменением состояния, без перезагрузки страницы*/
import {createBrowserHistory} from 'history';

const history = createBrowserHistory(); //Назначение одного экза history доступным приложению
const navigate = to => history.push(to); //Экспорт метода навигации и экза истории (если понадобится прямой доступ)
export {history, navigate};
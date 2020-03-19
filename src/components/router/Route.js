/*ПРЕДСТАВЛЕНИЕ URL-АДРЕС И КОМПОНЕНТА*/

import { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from "invariant"; //Библиотека для отображения ошибок рендера Route-компонентов

class Route extends Component{
    static propTypes = { //Каждый компонент Route принимает маршрут и функцию
        path: PropTypes.string,
        component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    };

    render() {
        //Компонент Route не должен ничего отображать, invariant следит за этим
        return invariant(false, '<Route> elements only for config, not render')
    }
}

export default Route;
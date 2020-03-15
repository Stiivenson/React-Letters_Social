/*КОМПОНЕНТ ДЛЯ ПЕРЕМЕЩЕНИЯ ПО ПРИЛОЖЕНИЮ, СОЗДАЕТ ССЫЛКИ "ВОКРУГ" ДРУГИХ КОМПОНЕНТОВ*/
import {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {navigate} from '../../history/history'

const Link = ({ to, children }) => {
    return cloneElement(Children.only(children), { //Клонирование только одного children компонента Link
        onClick: () => navigate(to) //Обработчик для перехода по URL через history
    });
}

Link.propTypes = {
    //to - целевой URL, children - целевой компонент
    to: PropTypes.string,
    children: PropTypes.node
};

export default Link;


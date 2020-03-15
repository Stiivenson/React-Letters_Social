/*РАЗВЕРТЫВАНИЕ РОУТЕРА*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from "invariant";
import enroute from 'enroute'; //Маленький роутер, для сопоставления строковых URL и параметритизаци маршрутов


export default class Router extends Component{
    static propTypes = {
        children: PropTypes.object,
        location: PropTypes.string.isRequired
    }

    constructor(props){
        super(props);
        this.routes = {}; //Объект для хранения маршрутов
        this.addRoutes(props.children); //Добавляем дочерние компоненты для Роутов      
        this.router = enroute(this.routes); //Роутер задействует возвращаемое enroute значение
    }

    addRoute(element, parent){
        const {component, path, children} = element.props; //Деструктурирование для получения компонента, маршрута и свойства потомков

        invariant(component, `Route ${path} is missing the 'path' property`); //Проверка, что каждый Route имеет свойство компонента и маршрут
        invariant(typeof path === "string", `Route ${path} is not a string`);

        const render = (params, renderProps) => { //Передаем render в enroute, которая принимает связанные с маршрутом параметры и доп. данные
            const finalProps = Object.assign({params}, this.props, renderProps); //Объединение свойств предка и дочернего компонента
            const children = React.createElement(component, finalProps); //Создание нового компонента с новыми свойствами
            return parent ? parent.render(params, {children}) : children; //Есть предок - вызываем render с родительсткими параметрами и потомками
        };

        const route = this.normalizeRoute(path, parent); //Проверка, что URL-путь настроен правильно

        if(children){ //Если в текущем компоненте Route есть другие дочерние компоненты - процесс повторяется, в маршрут передаеся родительский компонент
            this.addRoutes(children, {route, render});            
        }

        this.routes[this.cleanPath(route)] = render; //cleanPath для создания маршрута в объекте маршрутов и назначение ему законченной функции
    }
    //Добавление путей к потомкам
    addRoutes(routes, parent){
        React.Children.forEach(routes, route => this.addRoute(route, parent));
    }

    //Функция удаления двойных слешей из маршрута
    cleanPath(path){
        return path.replace(/\/\//g, '/');
    }
    //Проверка корректности задания маршрутов
    normalizeRoute(path, parent){
        if (path[0] === '/') { //Раз символ '/' - можно просто вернуть его, не нужно присоединять к предку
            return path;
        }
        if (!parent) { //Если ни один из предков не предоставлен, path не с чем соединять, можно его вернуть
            return path;
        }          
        return `${parent.route}/${path}`; //Есть предок - добавляем путь предка, объединяя их
    }

    render() {    
        const {location} = this.props; //Передача текущего положения роутеру в качестве свойства
        invariant(location, '<Router> needs a location to work!'); //Проверка, что местоположение указано
        return this.router(location); //Применяем роутер для нахождения компонента по заданному местоположению
    }
}
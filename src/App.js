//Библиотеки, необходимые для работы компонента
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from './components/error/Error'; //Импорт сообщения об ошибке и компонентов загрузчика
import Loader from './components/Loader';
import Nav from './components/nav/navbar';



/**
 * The app component serves as a root for the project and renders either children,
 * the error state, or a loading state
 * @method App
 * @module letters/components
 */

class App extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            error: null,
            loading: false,            
        };
    }
    static propTypes = {
        children: PropTypes.node,
    };

    //Настройка границы ошибки, для их обработки
    componentDidCatch(err, info){
        console.log(err);
        console.log(info);
        this.setState(() => ({
            error: err
        }));        
    }

    componentWillMount(){
        console.log('App-Mount-user: ', this.props.user);
    }

    componentDidUpdate(){
        console.log('App-Update-user: ', this.props.user);
    }
  
    render(){
        if(this.state.error){
            return(
                <div className='app'>
                    <ErrorMessage error={this.state.error}/>
                </div>
            );
        }
        return(
            <div className='app'>
                <Nav 
                    user={this.props.user} //Передача свойств пользователя - для Firebase
                /> 
                {this.state.loading ? ( //При загрузке рендерится загрузчик, а не тело приложения
                    <div className='loading'>
                        <Loader/>
                    </div>
                ) : (
                    this.props.children //Использование props.children для вывода текущего активного маршрута
                )}
            </div>
        );
    }
}

export default App;
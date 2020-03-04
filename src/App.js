//Библиотеки, необходимые для работы компонента
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parseLinkHeader from 'parse-link-header';
import orderBy from 'lodash/orderBy';

//Импорт сообщения об ошибке и компонентов загрузчика
import ErrorMessage from './components/error/Error';
import Loader from './components/Loader';
//Модуль API Letters - создание и извлечение сообщений
import * as API from './shared/http';

//Импорт других компонентов
import Ad from './components/ad/Ad';
import Nav from './components/nav/navbar';
import Welcome from './components/welcome/Welcome';
import Post from './components/post/Post';

/**
 * The app component serves as a root for the project and renders either children,
 * the error state, or a loading state
 * @method App
 * @module letters/components
 */

class App extends Component {
    constructor(props) {
        super(props);
        //Настройка отслеживания сообщений и конечной точки
        this.state = {
            error: null,
            loading: false,
            posts: [],
            endpoint: `${process.env
                .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`,
        };
        //Получение сообщений из API, когда компонент монтируется
        this.getPosts = this.getPosts.bind(this); 
    }
    static propTypes = {
        children: PropTypes.node,
    };

    //Монтирование -> загрузка постов
    componentDidMount(){
        this.getPosts();
    }
    //Настройка границы ошибки, для их обработки
    componentDidCatch(err, info){
        console.log(err);
        console.log(info);
        this.setState(() => ({
            error: err
        }));        
    }

    //Загрузка постов
    getPosts(){
        //Выбор сообщения с помощью модуля API
        API.fetchPosts(this.state.endpoint)
        .then(res => {
            return res
            //Модуль API использует API Fetch, поэтому нужно развернуть ответ JSON
            .json()
            .then(posts => {
                //API возвращает инфу о пагинации в заголовках, поэтому можно применять синт. анализатор для извлечения URL след. стр. сообщений
                const links = 
                    parseLinkHeader(res.headers.get('Link'));
                this.setState(() => ({
                    posts: orderBy(this.state.posts.concat(posts),
                    'data', 'desc'), //Добавление новых сообщений в состояние и проверка правильности сортировки
                    endpoint: links.next.url //Обновление состояния конечной точки
                }));
            })
            .catch(err => {
                this.setState(() => ({error: err})); 
            });
        });
    }

    render(){
        return(
            <div className='app'>
                <Nav/>
                {this.state.loading ? ( //При загрузке рендерится загрузчик, а не тело приложения
                    <div className='loading'>
                        <Loader/>
                    </div>
                ) : (
                    <div className='home'>
                        <Welcome/>
                        <div>
                            {this.state.posts.length && (
                                <div className='posts'>
                                    {this.state.posts.map(({id}) => ( //Итерация по извлеченным сообщениям + отобрежение Post для каждого
                                        <Post id={id} key={id}
                                        user={this.props.user}/>
                                    ))}
                                </div>
                            )}
                            <button className='block' onClick={this.getPosts}> 
                                Load more posts
                            </button>
                        </div>
                        <div>
                            <Ad
                                url='https://ifelse.io/book'
                                imageUrl='./static/assets/ads/ria.png'
                            />
                            <Ad
                                url='https://ifelse.io/book'
                                imageUrl='./static/assets/ads/orly.jpg'
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
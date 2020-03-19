/*ГЛАВНАЯ СТРАНИЦА ПРИЛОЖЕНИЯ*/
import React, { Component } from 'react';
import { connect } from "react-redux";
import parseLinkHeader from 'parse-link-header';
import orderBy from 'lodash/orderBy'; //Функция для сортировки сообщений

import * as API from '../shared/http'; //Модуль API Letters - создание и извлечение сообщений
import Ad from '../components/ad/Ad';
import Welcome from '../components/welcome/Welcome';
import Post from '../components/post/Post';
import CreatePost from '../components/post/Create';

export class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            posts: [],
            error: null,            
            endpoint: `${process.env
                .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`,
        }
    }

    //Загрузка постов
    getPosts = () => {
        //Выбор сообщения с помощью модуля API
        API.fetchPosts(this.state.endpoint)
        .then(res => {
            return res.json().then(posts => { //Модуль API использует API Fetch, поэтому нужно развернуть ответ JSON
                const links = parseLinkHeader(res.headers.get('Link')); //API возвращает инфу о пагинации в заголовках, поэтому можно применять синт. анализатор для извлечения URL след. стр. сообщений
                this.setState(() => ({
                    posts: orderBy(this.state.posts.concat(posts), 'data', 'desc'), //Добавление новых сообщений в состояние и проверка правильности сортировки
                    endpoint: links.next.url //Обновление состояния конечной точки
                }));
            })
            .catch(err => {
                this.setState(() => ({error: err})); 
            });
        });
    }

    //Добавление нового поста
    createNewPost = (post) => {
        console.log('createNewPost');
        console.log(post);
        post.userId = this.props.user.id;
        console.log(post);
        
        return API.createPost(post) //Применение API для создания сообщения
            .then(res => res.json())
            .then(newPost => { //Обновление состояния с использованием нового сообщения
                this.setState(prevState => {
                    return{                         
                        posts: orderBy(prevState.posts.concat(newPost), 'date', 'desc') //Конкатенация нового сообщения и проверка, что сообщения отсортированы
                    };
                });
            })
            .catch(err => {
                this.setState(() => ({error:err}));
            });
    }

    componentDidMount(){
        this.getPosts();
    }

    render(){
        return(
            <div className='home'>
                <Welcome/>
                <div>
                    <CreatePost />
                    {this.props.posts && ( //Сопоставление сообщений
                        <div className='posts'>
                            {this.props.posts.map(post => ( 
                                <Post key={post.id} post={post}/>
                            ))}
                        </div>
                    )}
                    <button className='block'> 
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
        );
    }
}

//Сопоставление и сортировка сообщений
export const mapStateToProps = state => {
    const posts = orderBy(state.postIds.map(postIds => state.posts[postId]), 'data', 'desc');
    return {posts};
}

export default connect(mapStateToProps)(Home);
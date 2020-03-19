/*Отображение одного сообщения*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';

export class SignlePost extends Component {
    static propTypes={
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired //Получаем id сообщений из свойств, переданных роутером
        })
    };

    //Router перейдет сюда по адресу '/posts/:postId', где postId - id одного поста
    render(){
        //Рендерим один пост, выбирая по полученному id
        return(
            <div className='signle-post'>
                <Post id={this.props.params.postId}/>
            </div>
        );
    }
}

export default SignlePost;
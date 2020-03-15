/*ОТОБРАЖЕНИЕ СООБЩЕНИЙ*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Post from '../components/post/Post';
import Ad from '../components/ad/Ad';

export class SignlePost extends Component {
    static propTypes={
        params: PropTypes.shape({
            postId: PropTypes.string.isRequired //Получаем id сообщений из свойств, переданных роутером
        })
    };

    render(){
        return(
            <div className='signle-post'>
                <Post id={this.props.params.postId}/>
            </div>
        );
    }
}

export default SignlePost;
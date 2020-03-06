/*СОЗДАНИЕ ПОСТА*/

import React, { Component } from "react";
import PropTypes from "prop-types";

//Модуль фильтрации нецензурщины
import Filter from 'bad-words';
import DisplayMap from "../map/DisplayMap";
const filter = new Filter();

class CreatePost extends Component{
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    }

    constructor(props){
        super(props);
        this.state={
            content:'',
            valid: false //Свойство проверки валидации введенного текста
        }
        this.handlePostChange = this.handlePostChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePostChange(event){
        const content = filter.clean(event.target.value); //Подключение фильтра нецензурщины
        this.setState(() => {
            return{
                content,
                valid: content.length <= 280 //280 - максимальная длина сообщения
            }
        });
    }
    //Создание нового поста
    handleSubmit(){
        event.preventDefault();
        if(!this.state.valid)
            return;
        if(this.props.onSubmit){
            const newPost = {
                date: Date.now(),
                //Присвоение публикации временного ключа, API создаст один
                id: Date.now(),
                content: this.state.content
            };

            //Обратный вызов onSubmit через свойства родительского компонента с передачей нового сообщения + сброс формы
            this.props.onSubmit(newPost);
            this.setState({
                content: '',
                valid: null
            })
        }
    }

    render(){
        return(
            <div className='create-post'>
                <textarea
                    value={this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?"
                />
                <div>
                    <button onClick={this.handleSubmit}>Post</button>
                </div>
                <DisplayMap/>
            </div>
        );
    }
}

export default CreatePost;
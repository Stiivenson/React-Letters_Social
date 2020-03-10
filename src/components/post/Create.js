/*СОЗДАНИЕ ПОСТА*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import Filter from 'bad-words'; //Модуль фильтрации нецензурщины
import classnames from "classnames";

import DisplayMap from "../map/DisplayMap"; 
import LocationTypeAhead from "../map/LocationMapAhead";

const filter = new Filter();

class CreatePost extends Component{
    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    }

    constructor(props){
        super(props);
        this.initialState={
            content:'',
            valid: false, //Свойство проверки валидации введенного текста
            showLocationPicker: false, //Свойства для отслеживания местоположения
            location:{
                lat: 34.1535641,
                lng: -118.1428115,
                name: null
            },
            locationSelected: false
        }
        this.state = this.initialState;
        this.handlePostChange = this.handlePostChange.bind(this);
        this.onLocationSelect = this.onLocationSelect.bind(this);
        this.onLocationUpdate = this.onLocationUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggleLocation = this.handleToggleLocation.bind(this);
        this.handleRemoveLocation = this.handleRemoveLocation.bind(this);
        this.renderLocationControls = this.renderLocationControls.bind(this);

    }

    //Фильтр текста сообщения
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
                id: Date.now(), //Присвоение публикации временного ключа, API создаст один
                content: this.state.content
            };
            if(this.state.locationSelected){ //Добавить местоположение, если оно выбрано
                newPost.location = this.state.location;
            }
            //Обратный вызов onSubmit через свойства родительского компонента с передачей нового сообщения + сброс формы
            this.props.onSubmit(newPost);
            this.setState({
                content: '',
                valid: false,
                showLocationPicker: false,
                location: this.initialState.location,
                locationSelected: false
            })
        }
    }
    //Обновление местоположения из компонента LocationTypeAhead
    onLocationUpdate(location){
        this.setState(() => ({location}));
    }
    //Выбор местоположения из компонента LocationTypeAhead
    onLocationSelect(location){
        this.setState(() => ({
            location,
            showLocationPicker: false,
            locationSelected: true
        }));
    }
    //Переключение отображения выбора местоположения
    handleToggleLocation(e){
        e.preventDefault();
        this.setState(state => ({showLocationPicker: !state.showLocationPicker}));
    }
    //Возможность удаления местоположения из сообщения
    handleRemoveLocation(){
        this.setState(() => ({
            locationSelected: false,
            location: this.initialState.location
        }));
    }

    renderLocationControls(){
        return(
            <div className='controls'>
                <button onClick={this.handleSubmit}>Post</button>
                {this.state.location && this.state.locationSelected ? (
                    <button className='open location-indicator' onClick={this.handleRemoveLocation}>
                        <i className='"fa-location-arrow fa'/>
                        <small>{this.state.location.name}</small>
                    </button>
                ) : (
                    <button className='open' onClick={this.handleToggleLocation}>
                        {this.state.showLocationPicker ? 'Cancel' : 'Add location'}{' '}
                        <i
                            className={classnames('fa', {
                                "fa-map-o": !this.state.showLocationPicker,
                                "fa-times": this.state.showLocationPicker
                            })}
                        />
                    </button>
                )}
            </div>
        );
    }

    render(){
        return(
            <div className='create-post'>
                <textarea
                    value={this.state.content}
                    onChange={this.handlePostChange}
                    placeholder="What's on your mind?"
                />
                {this.renderLocationControls()}
                <div
                    className='location-picker'
                    style={{display: this.state.showLocationPicker ? 'block' : 'none'}}
                >
                    {!this.state.locationSelected && [
                        <LocationTypeAhead
                            key="LocationTypeAhead"
                            onLocationSelect={this.onLocationSelect}
                            onLocationUpdate={this.onLocationUpdate}
                        />,
                        <DisplayMap
                            key="DisplayMap"
                            displayOnly={false}
                            location={this.state.location}
                            onLocationSelect={this.onLocationSelect}
                            onLocationUpdate={this.onLocationUpdate}
                        />
                    ]}
                </div>
            </div>
        );
    }
}

export default CreatePost;
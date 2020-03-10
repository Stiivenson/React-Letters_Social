/*ВЫБОР ГОТОВОГО МЕСТОПОЛОЖЕНИЯ ИЗ СПИСКА*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import MapBox from 'mapbox';

export default class LocationTypeAhead extends Component{
    static propTypes = {
        //Использование 2х методов: обновление и выбор местоположения
        onLocationUpdate: PropTypes.func.isRequired,
        onLocationSelect: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state={
            text: '',
            locations: [],
            selectedLocation: null
        };
        //Создание экземпляра клиента Mapbox
        this.mapbox = new MapBox(process.env.MAPBOX_API_TOKEN);
        this.attemptGeoLocation = this.attemptGeoLocation.bind(this);
        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.hanldeSelectLocation = this.hanldeSelectLocation.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
    };

    //Определение местоположения по геолокации
    attemptGeoLocation(){
        console.log('attemptGeoLocation');
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(   //Получение текущей позиции польз. устройства
                ({coords}) => {                    
                    const {latitude, longitude} = coords;   //Возвращение коорд. для использования                   
                    this.mapbox.geocodeReverse({latitude, longitude}, {}).then(loc => { //Применение Mapbox для геокодирования координат
                            if(!loc.entity.features || !loc.entity.features.length) return;
                            const feature = loc.entity.features[0]; //Получение первого ближайшего свойства                            
                            const [lng,lat] = feature.center;   //Выдача широты и долготы
                            const currentLocation = {    //Создание местоположения и обновление состояния
                                name: feature.place_name,
                                lat,
                                lng
                            };
                            this.setState(() => ({
                                locations: [currentLocation],
                                selectedLocation: currentLocation,
                                text: currentLocation.name
                            }));
                            this.handleLocationUpdate(currentLocation);
                        });
                },
                null,
                {   //Параметры, передаваемые API геолокации
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
    }
    //Обновление состояния при выборе местоположения
    handleLocationUpdate(location){
        console.log('handleLocationUpdate');
        this.setState(() => {
            return{
                text: location.name,
                locations: [],
                selectedLocation: location
            };
        });
        this.props.onLocationUpdate(location);
    }
    //Вывод списка мест при вводе в поле поиска
    handleSearchChange(event){
        console.log('handleSearchChange');
        const text = event.target.value;     //Извлекаем текст при вводе в поле поиска
        this.setState(() => ({text}));
        if(!text) return;
        this.mapbox.geocodeForward(text, {}).then(loc => {   //Используем Mapbox для поиска местоположения с учетом ввода пользователя 
            if(!loc.entity.features || !loc.entity.features.length){
                return;
            }
            const locations = loc.entity.features.map(feature => {  //Преобразование результатов Mapbox в формат, удобный в компонентах
                const [lng, lat] = feature.center;
                return{
                    name: feature.place_name,
                    lat,
                    lng
                };
            });
            this.setState(() => ({locations})); //Обновление состояния с новым местоположением 
        });
    }
    //Выбрано местоположение - локация передается вверх
    hanldeSelectLocation(){
        console.log('hanldeSelectLocation');
        this.props.onLocationSelect(this.state.selectedLocation);
    }
    //Сброс состояния компонента
    resetSearch(){
        console.log('resetSearch');
        this.setState(() => {
            return{
                text:'',
                locations:[],
                selectedLocation: null
            };
        });
    }

    componentDidUpdate(prevProps, prevState){
        console.log('componentDidUpdate');
        if(prevState.text === '' && prevState.locations.length){
            this.setState(() => ({locations: []}));
        }
    }
    componentWillUnmount(){
        console.log('componentWillUnmount');
        this.resetSearch();
    }

    render(){
        return[
           <div key='location-typeahead'
                className='location-typeahead'>
                <i  className='fa fa-location-arrow' onClick={this.attemptGeoLocation} />
                <input 
                    type='text'
                    placeholder='Enter a location...'
                    onChange={this.handleSearchChange}
                    value={this.state.text} />
                <button className='open'
                    disabled={!this.state.selectedLocation}
                    onClick={this.hanldeSelectLocation}>
                    Select
                </button>
           </div>,
           //Если есть поисковый запрос и получены соотв. результаты - вывод результатов
           this.state.text.length && this.state.locations.length ? (
               <div key='location-typeahead-results'
                    className='locationtypeahead-results'>
                        {this.state.locations.map(location => { 
                            return(
                                <div
                                    key={location.name}
                                    className='result'
                                    onClick={e => { //При выборе позции - установить местоположение
                                        e.preventDefault();
                                        this.handleLocationUpdate(location);
                                    }}
                                >
                                    {location.name}
                                </div>
                            );
                        })}
               </div>
           ) : null //Нет запроса - ничего не выводим
        ]; 
    }
}

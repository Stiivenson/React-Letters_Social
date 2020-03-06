/*СОЗДАНИЕ У НОВОГО ПОСТА МЕТКИ НА КАРТЕ*/

import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DisplayMap extends Component{
    static propTypes={
        location: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
            name: PropTypes.string
        }),
        displayOnly:PropTypes.bool
    };
    static defaultProps={
        displayOnly: true,
        location:{
            lat: 56.011279,
            lng: 92.809862,
            name: null
        }
    };

    constructor(props){
        super(props);
        this.state={
            mapLoaded: false,
            location:{
                lat: props.location.lat,
                lng: props.location.lng,
                name: props.location.name
            }
        };
        this.ensureMapExsists = this.ensureMapExsists.bind(this);
        this.upadteMapPosition = this.upadteMapPosition.bind(this);
    }

    ensureMapExsists(){
        //Проверка, что карта не была уже загружена
        if(this.state.mapLoaded) return;
        //Создание новой карты и сохранение ссылки на неё в компоненте (+ откл. ненужных функций карты)
        this.map = this.L.mapbox.map(this.mapNode, 'mapbox.streets', {
                zoomContol: false,
                scrollWheelZoom: false
            });
        //Установка вида карты на основе ширины/долготы
        this.map.setView(this.L.latLng(this.state.location.lat, this.state.location.lng), 12);
        this.addMarker(this.state.location.lat, this.state.location.lng);
        this.setState(() => ({mapLoaded: true}));
    }
    addMarker(lat, lng){
        if(this.marker){
            return this.marker.setLatLng(this.L.latLng(lat, lng)); //Обновление существующего маркера, а не создание заново
        }
        //Создание и добавление маркера на карту
        this.marker = this.L.marker([lat, lng], {
            icon: this.L.mapbox.marker.icon({
                'marker-color': '#4469af'
            })
        });
        this.marker.addTo(this.map);
    }
    //Обновление представления карты и состояния компонента
    upadteMapPosition(location){
        const {lat, lng} = location;
        this.map.setView(this.L.latLng(lat, lng));
        this.addMarker(lat, lng);
        this.setState(() => ({location}));
    }
   
    componentDidMount(){
        //В Mapbox исп. библиотека Leaflet, поэтому 'L'
        this.L = window.L;
        //Проверка, есть ли у карты инфа о местоположении
        if(this.state.location.lng && this.state.location.lat){
            this.ensureMapExsists();
        }
    }
    //Mapbox аннулирует размер карты, чтобы она отображалась корректно при скрытии/показе
    componentDidUpdate(){
        if(this.map && !this.props.displayOnly){
            this.map.invalidateSize(false);
        }
    }
    //Реакция на изменене местоположения
    componentWillReceiveProps(nextProps){
        if (nextProps.location){
            const locationsAreEqual = 
                //Если местоположение доступно, проверка старого/нового на соответствие
                Object.keys(nextProps.location).every(
                    k => nextProps.location[k] === this.props.location[k]
                );
            if(!locationsAreEqual){
                this.upadteMapPosition(nextProps.location);
            }
        }
    }

    render(){
        //Массив элементов от рендера
        return[
            <div key='displayMap' className='displayMap'>
                <div //DOM-элемент для создания карты
                    className='map' 
                    ref={node => { //Создание ссылки на элемента div.map
                        this.mapNode = node;
                    }}
                ></div>
            </div>
        ]
    }
}
import React, { Component } from 'react'
import GoogleMap from './GoogleMap';
import request from 'superagent';
import './search.css';
import './header.css';

export default class Search extends Component {
    state = { 
        favorites: [],
        input: '',
        coordinates: [],
        select: 8,
        allEvents: []
    }
    // componentDidMount(){
    //     const user = JSON.parse(localStorage.getItem('user'));

    // }

    handleSelect = (e) => {
        this.setState({ select: e.target.value })
    }

    handleSearch = async (e) => {
        e.preventDefault();
        const data = await request.get(`https://guarded-lake-55222.herokuapp.com/api/categories/${this.state.select}`)
        //Map through events and return an array of geometries.  
        const coordinates = data.body.events.map(event => {
            return event.geometries[0].coordinates
        })
        this.setState({
            coordinates: coordinates,
            allEvents: data.body.events,
        });
    }

    makeFavorite = async (pin) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const favorite = await request.post('https://guarded-lake-55222.herokuapp.com//api/me/favorites', this.state.event )
        .set('Authorization', user.token)
    }

    render() {
        return (
            <div className="search-container">
                <form id="search">
                    <select onChange= {this.handleSelect}id="events" name="events">
                        <option value='8'>Wildfire</option>
                        <option value='10'>storm</option>
                        <option value='12'>volcanoes</option>
                        <option value='6'>drought</option>
                        <option value='7'>dust and haze</option>
                        <option value='9'>floods</option>
                        <option value='13'>water color</option>
                        <option value='14'>landslides</option>
                        <option value='15'>sea and lake ice</option>
                        <option value='16'>earthquake</option>
                        <option value='17'>snow</option>
                        <option value='18'>temperature extremes</option>
                        <option value='19'>manmade</option>
                    </select>
                    <button onClick={this.handleSearch}>Search!</button>
                </form>  
                <div>
                    {this.state.allEvents && <GoogleMap coordinates={this.state.coordinates}
                    allEvents={this.state.allEvents} user={this.props.user} />}
                </div>
            </div>
        )
    }
}

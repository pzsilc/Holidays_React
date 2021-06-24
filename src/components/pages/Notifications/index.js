import React, { useState, useEffect } from 'react';
import { getNotifications, putNotification } from '../../../requests';
import { Link } from 'react-router-dom';
import './style.scss';



export default class Notifications extends React.Component{
    state = {
        notifications: []
    }

    componentDidMount = () => this.fetch()

    fetch = async () => {
        let res = await getNotifications();
        for(let i=0; i<res.data.length; i++){
            let sample = res.data[i];
            sample.clicked = true;
            if(!parseInt(sample.readed)){
                res.data[i].clicked = false;
            }
        }
        this.setState({ notifications: res.data.reverse() });
    }

    onClick = e => {
        const { id } = e.target.dataset;
        putNotification(id)
        .then(this.fetch)
    }

    clickAll = () => {
        this.state.notifications.forEach(notification => {
            if(!notification.clicked){
                this.onClick({
                    target: {
                        dataset: {
                            id: notification.id
                        }
                    }
                })
            }
        })
    }

    render = () => {
        return(
            <div className="border p-5 mx-auto" style={{ width: '90%', maxWidth: '700px' }}>
                <div className="d-flex justify-content-between mb-3">
                    <h3>Powiadomienia</h3>
                    <button type="button" onClick={this.clickAll} className="btn btn-default">Odznacz wszystkie</button>
                </div>
                <ul className="list-group">
                    {this.state.notifications.map((notification, key) => 
                        <li 
                            key={key} 
                            data-id={notification.id}
                            onClick={this.onClick} 
                            className={`notification list-group-item ${notification.clicked ? '' : 'font-weight-bold'}`}
                            dangerouslySetInnerHTML={{ __html: notification.content }}
                        >
                        </li>
                    )}
                    {!this.state.notifications.length &&
                        <p className="text-center mt-5">Nie masz żadnych powiadomień</p>
                    }
                </ul>
            </div>
        )
    }
}

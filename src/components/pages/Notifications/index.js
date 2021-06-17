import React, { useState, useEffect } from 'react';
import { getNotifications, putNotification } from '../../../requests';
import { Link } from 'react-router-dom';
import './style.scss';



export default class Notifications extends React.Component{
    state = {
        notifications: []
    }

    componentDidMount = async () => {
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
        const { key } = e.target.dataset;
        let notification = this.state.notifications[key];
        if(!notification.clicked){
            putNotification(notification.id);
            this.state.notifications[key].clicked = true;
            this.setState({ notifications: this.state.notifications });
        }
    }

    render = () => {
        return(
            <div className="border p-5 mx-auto" style={{ width: '90%', maxWidth: '700px' }}>
                <h3 className='my-5'>Powiadomienia</h3>
                <ul className="list-group">
                    {this.state.notifications.map((notification, key) => 
                        <li 
                            key={key} 
                            data-key={key}
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
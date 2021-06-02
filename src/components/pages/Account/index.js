import React, { Component } from 'react';
import { getHolidaysByEmployeeId, deleteHolidays, getStatuses, getUser } from '../../../requests';

export default class Account extends Component{
    
    state = {
        user: getUser(),
        events: [],
        statuses: []
    }

    componentDidMount = async () => {
        let st = await getStatuses();
        let ev = await getHolidaysByEmployeeId(this.state.user.id, true);
        this.setState({
            statuses: st.data,
            events: ev.data
        });
    }

    _delete = async(e) => {
        var { id } = e.target.dataset;
        id = parseInt(id);
        let res = await deleteHolidays(id);
        if(res.type === 'success'){
            let ev = this.state.events;
            for(var i=0; i<ev.length; i++){
                if(ev[i].id == id){
                    ev.splice(i, 1);
                }
            }
            this.setState({ events: ev })
        }
    }

    render = () => {
        this.state.events.forEach(e => {
            e.status = this.state.statuses.find(status => status.id === e.status_id);
            switch(parseInt(e.status.id)){
                case 1: e.status.color = 'dark'; break;
                case 2: e.status.color = 'success'; break;
                case 3: e.status.color = 'danger'; break;
            }
        })
        this.state.events.sort((a, b) => parseInt(a.id) === parseInt(b.id) ? 0 : (parseInt(a.id) > parseInt(b.id) ? -1 : 1));

        return(
            <div className="card p-5 m-5">
                <h3>Twoje urlopy</h3>
                <ul className="list-group mt-5">
                    {this.state.events.map((event, key) => 
                        <li className="list-group-item d-flex justify-content-between" key={key}>
                            <div>
                                <i className="fa fa-calendar mr-2"></i>
                                {event.from_date}<i className="fa fa-arrow-right mx-2"></i>{event.to_date}
                            </div>
                            <div className={`text-${event.status.color}`}>
                                {event.status.name}
                                {event.status.id == 1 &&
                                    <button 
                                        onClick={this._delete} 
                                        data-id={event.id}
                                        className="btn btn-default text-danger ml-2"
                                    >
                                        <i 
                                            className="fa fa-trash" 
                                        ></i>
                                    </button>
                                }
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}
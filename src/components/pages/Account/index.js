import React, { Component } from 'react';
import { getHolidaysByEmployeeId, deleteHolidays, getStatuses, getUser, getEmployeesOfUser, getPDF } from '../../../requests';
import { Link } from 'react-router-dom';

export default class Account extends Component{
    
    state = {
        user: getUser(),
        events: [],
        statuses: [],
        employeesNumber: 0
    }

    componentDidMount = async () => {
        let st = await getStatuses();
        let ev = await getHolidaysByEmployeeId(this.state.user.id, true);
        let en = await getEmployeesOfUser();
        this.setState({
            statuses: st.data,
            events: ev.data,
            employeesNumber: en.data.length
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

    print = e => {
        const { event_id } = e.target.dataset;
        getPDF(event_id)
        .then(res => {
            if(res){
                const linkSource = `data:application/pdf;base64,${res.data}`;
                const downloadLink = document.createElement("a");
                const fileName = "wniosek.pdf";
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
            }
        })
    }

    render = () => {
        this.state.events.forEach(e => {
            e.status = this.state.statuses.find(status => status.id === e.status_id);
            if(e.kind.id == 1)
                switch(parseInt(e.status.id)){
                    case 1: e.color = 'dark'; break;
                    case 2: e.color = 'success'; break;
                    case 3: e.color = 'danger'; break;
                }
        })
        this.state.events.sort((a, b) => parseInt(a.id) === parseInt(b.id) ? 0 : (parseInt(a.id) > parseInt(b.id) ? -1 : 1));

        return(
            <div>
                {this.state.user &&
                    <div className="ml-5 card p-5" style={{ width: '50%' }}>
                        <h3 className="mb-5">Dane personalne</h3>
                        <p><b>Imię:</b> {this.state.user.first_name}</p>
                        <p><b>Nazwisko:</b> {this.state.user.last_name}</p>
                        <p><b>Email:</b> {this.state.user.email}</p>
                        <p><b>Ilość urlopów:</b> {this.state.events.length}</p>
                        <p><b>Ilość pracowników:</b> {this.state.employeesNumber} <i className="fa fa-arrow-right mx-2"></i><Link to="/holidays/employees/requests">Zobacz pracowników</Link></p>
                        <Link to="/holidays/logout" className="btn btn-primary" style={{ width: '200px' }}>Wyloguj się</Link>
                    </div>
                }
                <div className="card p-5 m-5">
                    <h3>Twoje urlopy</h3>
                    <ul className="list-group mt-5">
                        {this.state.events.map((event, key) => 
                            <li className="list-group-item d-flex justify-content-between" key={key}>
                                <div>
                                    <i className="fa fa-calendar mr-2"></i>
                                    {event.from_date}<i className="fa fa-arrow-right mx-2"></i>{event.to_date}
                                    <span className="border-left ml-3 pl-3">{event.kind.name}</span>
                                </div>
                                {event.kind.id == 1 &&
                                    <div className={`text-${event.color}`}>
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
                                }
                                {event.kind_id != 2 &&
                                    <button className="btn btn-info" onClick={this.print} data-event_id={event.id}>
                                        <i className="fa fa-print"></i>
                                    </button>
                                }
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}
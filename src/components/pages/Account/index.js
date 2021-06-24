import React, { Component } from 'react';
import { getHolidaysByEmployeeId, deleteHolidays, getStatuses, getUser, getEmployeesOfUser } from '../../../requests';
import { Link } from 'react-router-dom';
import HolidaysList from '../../holidaysList';

export default class Account extends Component{
    
    state = {
        user: getUser(),
        events: [],
        statuses: [],
        employeesNumber: 0
    }

    componentDidMount = async () => {
        let st = await getStatuses();
        let en = await getEmployeesOfUser();
        this.setState({
            statuses: st.data,
            employeesNumber: en.data.length
        });
        this.fetchEvents();
    }

    fetchEvents = async() => {
        let ev = await getHolidaysByEmployeeId(this.state.user.id, true);
        ev.data.sort((a, b) => parseInt(a.id) === parseInt(b.id) ? 0 : (parseInt(a.id) > parseInt(b.id) ? -1 : 1));
        this.setState({ events: ev.data });
    }

    _delete = async(e) => {
        var { event_id } = e.target.dataset;
        let id = parseInt(event_id);
        let res = await deleteHolidays(id);
        if(res.type === 'success'){
            this.fetchEvents();
        }
    }

    render = () => {
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
                        <HolidaysList
                            title="Twoje urlopy"
                            events={this.state.events}
                            options={{
                                forOwner: true,
                                deleteFunction: this._delete
                            }}
                        />
                </div>
            </div>
        )
    }
}
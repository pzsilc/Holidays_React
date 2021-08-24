import React, { Component } from 'react';
import { getHolidaysByEmployeeId, deleteHolidays, getStatuses, getUser, getEmployeesOfUser, addNotification, setDeputy, getDeputy } from '../../../requests';
import { Link } from 'react-router-dom';
import HolidaysList from '../../holidaysList';

export default class Account extends Component{
    
    state = {
        user: getUser(),
        events: [],
        statuses: [],
        employees: [],
        deputy: null
    }

    componentDidMount = () => this.fetchData()

    fetchData = async () => {
        let st = await getStatuses();
        let en = await getEmployeesOfUser();
        let de = await getDeputy();
        this.setState({
            statuses: st.data,
            employees: en.data,
            deputy: de
        });
        this.fetchEvents();
    }

    fetchEvents = async() => {
        let ev = await getHolidaysByEmployeeId(this.state.user.id, true);
        ev.data.sort((a, b) => parseInt(a.id) === parseInt(b.id) ? 0 : (parseInt(a.id) > parseInt(b.id) ? -1 : 1));
        this.setState({ events: ev.data });
    }

    setDeputyId = e => {
        e.preventDefault();
        const { deputyId } = e.target;
        setDeputy(deputyId.value)
        .then(res => {
            this.fetchData();
            addNotification('success', 'Ustawiono zastępce');
        })
        .catch(err => {
            console.log(err)
            addNotification('danger', err.response.data.data);
        })
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
        if(!this.state.user){
            return <div className="text-center mt-5 pt-5">
                <i className="fa fa-circle-notch fa-spin mx-auto text-center h1"></i>
            </div>
        }
        return(
            <div className="m-5">
                <div className="d-flex justify-content-between">
                    <div className="card p-5">
                        <h3 className="mb-5">Dane personalne</h3>
                        <p><b>Imię:</b> {this.state.user.first_name}</p>
                        <p><b>Nazwisko:</b> {this.state.user.last_name}</p>
                        <p><b>Email:</b> {this.state.user.email}</p>
                        <p><b>Ilość urlopów:</b> {this.state.events.length}</p>
                        {this.state.deputy && <p><b>Zastępca:</b> {this.state.deputy.first_name} {this.state.deputy.last_name}</p>}
                        <p><b>Ilość pracowników:</b> {this.state.employees.length} <i className="fa fa-arrow-right mx-2"></i>
                        <Link to="/holidays/employees/requests">Zobacz pracowników</Link></p>
                        <Link to="/holidays/logout" className="btn btn-primary" style={{ width: '200px' }}>Wyloguj się</Link>
                    </div>
                    <div className="card p-5">
                        <form onSubmit={this.setDeputyId}>
                            <h3>Ustaw zastępce </h3>
                            <select 
                                name="deputyId"
                                className="form-control mt-4"
                                required
                            >
                                <option value="">...</option>
                                {this.state.employees.map((emp, key) =>
                                    <option key={key} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                )}    
                            </select>
                            <small className="text-muted">(np. w przypadku gdy idziesz na urlop)</small>
                            <br/>
                            <input
                                type="submit"
                                className="btn btn-primary mt-5 float-right"
                            />
                        </form>
                    </div>
                </div>
                <div className="card p-5 mt-5">
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
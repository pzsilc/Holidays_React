import React, { Component } from 'react';
import { getUser, getEmployeesOfUser, getHolidaysByEmployeeId, putHolidays } from '../../../requests';
import HolidaysList from '../../holidaysList';
import './style.scss';

export default class EmployeesRequests extends Component{
    

    state = {
        user: null,
        employees: [],
        events: {
            new: [],
            archival: []
        },
        loading: true
    }



    componentDidMount = async () => {
        this.setState({ user: getUser() });
        let emps = await getEmployeesOfUser();
        this.setState({ employees: emps.data, loading: false });
        this.fetchEvents();
    }



    fetchEvents = async() => {
        var newEvents = [];
        var archivalEvents = [];
        for(const employee of this.state.employees){
            let res = await getHolidaysByEmployeeId(employee.id, true);
            res.data.forEach(e => {
                if(e.status && e.status.id == 1)
                    newEvents.push(e);
                else
                    archivalEvents.push(e);
            })
        }
        this.setState({
            ...this.state,
            events: {
                new: newEvents,
                archival: archivalEvents
            }
        })
    }



    acceptOrReject = e => {
        const { event_id, action } = e.target.dataset;
        putHolidays(event_id, action)
        .then(res => {
            console.log(res)
            this.fetchEvents();
        })
    }



    render = () => {
        if(this.state.loading){
            return <div>
                <i className="fa fa-circle-notch fa-spin mx-auto text-center h1"></i>
            </div>
        }
        return(
            <div className="m-5">
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 border-right'>
                            <h3 className="mb-5">Twoi pracownicy</h3>
                            <ul className="list-group">
                                {this.state.employees.map((employee, key) => 
                                    <li key={key} className="list-group-item">{employee.first_name} {employee.last_name}</li>
                                )}
                            </ul>
                        </div>
                        <div className='col-6 border-right'>
                            <HolidaysList
                                title="Nowe prośby urlopowe"
                                events={this.state.events.new}
                                options={{
                                    forManager: true,
                                    acceptOrRejectFunction: this.acceptOrReject,
                                    displayEmployee: true
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container mt-5 pt-5">
                        <hr/>
                        <h3>Archiwalne urlopy pracowników</h3>
                        <div className="row">
                            {this.state.employees.map((employee, key) => 
                                <div key={key} className="col-6 p-3 my-5">
                                    <p>{employee.first_name} {employee.last_name}</p>
                                    <HolidaysList
                                        title=""
                                        events={this.state.events.archival.filter(i => i.employee.id == employee.id)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
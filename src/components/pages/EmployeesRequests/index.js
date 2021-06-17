import React, { Component } from 'react';
import { getUser, getEmployeesOfUser, getHolidaysByEmployeeId, putHolidays } from '../../../requests';
import './style.scss';

export default class EmployeesRequests extends Component{
    
    state = {
        user: null,
        employees: [],
        events: [],
        loading: true
    }

    constructor(props){
        super(props);
        this.onClickHandle = this.onClickHandle.bind(this);
    }

    componentDidMount = async () => {
        this.setState({ user: getUser() });
        let emps = await getEmployeesOfUser();
        emps.data.forEach(async(i) => {
            let ev = await getHolidaysByEmployeeId(parseInt(i.id));
            ev.data.forEach(e => {
                let _events = this.state.events;
                _events.push({
                    id: e.id,
                    user: i.first_name + ' ' + i.last_name,
                    from: e.from_date,
                    to: e.to_date,
                    info: e.additional_info
                });
                this.setState({ events: _events }); 
            })
        });
        this.setState({ employees: emps.data, loading: false });
        this.fetchArchivalRequests();
    }

    fetchArchivalRequests = async () => {
        var employees = this.state.employees;
        for(const employee of employees){
            let holidays = await getHolidaysByEmployeeId(employee.id, true);
            employee.holidays = holidays.data.filter(i => i.status.name !== 'BRAK');
        }
        this.setState({ ...this.state, employees });
    }

    onClickHandle = async (e) => {
        const { id, type } = e.target.type ? e.target.querySelector('i').dataset : e.target.dataset;
        let res = await putHolidays(id, type);
        if(res.type === 'success'){
            let _events = this.state.events;
            for(var i=0; i<_events.length; i++){
                if(_events[i].id === id){
                    _events.splice(i, 1);
                }
            }
            this.setState({
                events: _events
            });
        }
    }

    render = () => {
        if(this.state.loading){
            return <div>
                <i className="fa fa-circle-notch fa-spin"></i>
            </div>
        }

        const getColorByStatusId = id => {
            return id == 2 ? 'success' : id == 3 ? 'danger' : 'muted';
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
                            <h3 className="mb-5">Prośby urlopowe</h3>
                            {this.state.events.map((e, key) => 
                                <div key={key} className="border rounded-0 p-3 d-flex justify-content-between">
                                    <div>
                                        <p><i className='fa fa-calendar mr-2'></i>{e.from}<i className="mx-2 fa fa-arrow-right"></i>{e.to}</p>
                                        <p>{e.user}</p>
                                    </div>
                                    <div className="text-right">
                                        <button 
                                            type="button" 
                                            onClick={this.onClickHandle} 
                                            className="btn btn-success rounded-0"
                                        >
                                            <i 
                                                className="fa fa-check"
                                                data-id={e.id} 
                                                data-type="accept" 
                                                onClick={this.onClickHandle} 
                                            ></i>
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={this.onClickHandle} 
                                            className="btn btn-danger rounded-0"
                                        >
                                            <i 
                                                className="fa fa-times"
                                                data-id={e.id} 
                                                data-type="reject" 
                                                onClick={this.onClickHandle} 
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container mt-5 pt-5">
                        <h4 className="mb-5">Urlopy archiwalne pracowników</h4>
                        <hr/>
                        <div className="row">
                            {this.state.employees.map((emp, key) =>
                                <div key={key} className="col-4 border p-3 text-center">
                                    <b>{emp.first_name} {emp.last_name}</b>
                                    <br/>
                                    {emp.holidays &&
                                        <React.Fragment>
                                            {Boolean(emp.holidays.length) &&
                                                <ul className="list-group">
                                                    {emp.holidays.map((h, key2) => 
                                                        <li key={key2} className="list-group-item text-left mb-0 pb-0">
                                                            {h.from_date}<i className="fa fa-arrow-right mx-2"></i>{h.to_date}
                                                            <div className="d-flex justify-content-between mt-3">
                                                                <p className='text-muted'>{h.kind.name}</p>
                                                                <p className={`text-${getColorByStatusId(h.status.id)}`}>{h.status.name}</p>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            }
                                            {!emp.holidays.length &&   
                                                <p className="text-muted">Brak</p>
                                            }
                                        </React.Fragment>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
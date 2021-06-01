import axios from 'axios';
import React, { Component } from 'react';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom';
import { getUser, getEmployees, getEmployeeHolidayRequests, putHolidayEvent } from '../../../requests';


export default class EmployeesManagement extends Component{
    
    state = {
        user: null,
        employees: [],
        events: []
    }

    constructor(props){
        super(props);
        this.onClickHandle = this.onClickHandle.bind(this);
    }

    componentDidMount = async () => {
        this.setState({ user: getUser() });
        let emps = await getEmployees();
        emps.data.forEach(async(i) => {
            let ev = await getEmployeeHolidayRequests(parseInt(i.id));
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
        this.setState({ employees: emps.data });
    }

    onClickHandle = async (e) => {
        const { id, type } = e.target.type ? e.target.querySelector('i').dataset : e.target.dataset;
        let res = await putHolidayEvent(id, type);
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
        return(
            <div>
                {this.state.events.map((e, key) =>
                    <div 
                        className="border m-2 p-2"
                        key={key}
                    >
                        <div className="d-flex justify-content-between">
                            <b>{e.user}</b>
                            <p>
                                <i className="fa fa-calendar mr-2"></i>
                                {e.from}
                                <i className="fa fa-arrow-right mx-2"></i>
                                {e.to}
                            </p>
                        </div>
                        <div className="d-flex justify-content-between">
                            {e.info &&
                                <div>
                                    <small className="text-muted">Dodatkowe informacje</small>
                                    <br/>
                                    {e.info}
                                </div>
                            }
                            <div style={{ position: 'relative', left: '8px', top: '18px' }}>
                                <button 
                                    type="button" 
                                    onClick={this.onClickHandle} 
                                    className="btn btn-primary rounded-0"
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
                    </div>
                )}
            </div>
        )
    }
}
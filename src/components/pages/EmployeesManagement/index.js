import React, { Component } from 'react';
import { getUser, getEmployees, getEmployeeHolidayRequests, putHolidayEvent } from '../../../requests';
import './style.scss';

export default class EmployeesManagement extends Component{
    
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
        this.setState({ employees: emps.data, loading: false });
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
        if(this.state.loading){
            return <div>
                <i className="fa fa-circle-notch fa-spin"></i>
            </div>
        }
        return(
            <div className="d-flex justify-content-between">
                <div className="content border-right">
                    <h3 className="mb-5 color">Pracownicy</h3>
                    {Boolean(this.state.employees.length) &&
                        <ul className="list-group mx-auto" style={{ width: '80%' }}>
                            {this.state.employees.map((employee, key) => 
                                <li key={key} className="list-group-item">
                                    {employee.first_name} {employee.last_name}
                                </li>
                            )}
                        </ul>
                    }
                    {!this.state.employees.length && 
                        <p className="text-muted">Nie masz żadnych pracowników</p>
                    }
                </div>
                <div className="content border-left">
                    <h3 className="mb-5 color">Prośby urlopowe</h3>
                    {Boolean(this.state.events.length) &&
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
                                    <div className="text-left">
                                        {e.info &&
                                            <div style={{ wordWrap: 'break-word' }}>
                                                <small className="text-muted">Dodatkowe informacje</small>
                                                <br/>
                                                {e.info}
                                            </div>
                                        }
                                        <div style={{ position: 'relative', bottom: '-8px', left: '-8px' }}>
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
                    }
                    {!this.state.events.length &&
                        <p className="text-muted">Nie masz żadnych próśb urlopowych</p>
                    }
                </div>
            </div>
        )
    }
}
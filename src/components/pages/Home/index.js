import React, { Component } from 'react';
import { getUser, getEmployees, postHolidays } from '../../../requests';
import CalendarContainer from './Calendar';
import './style.scss';


export default class Home extends Component{

    state = {
        user: null,
        employees: [],
        suggestHolidays: {
            mode: false,
            from: null,
            to: null
        }
    }

    componentDidMount = () => {
        const user = getUser();
        this.setState({ user });
        this.fetchEmployees();
    }

    fetchEmployees = async () => {
        const employees = await getEmployees();
        this.setState({ employees });
    }

    getDaysArray = (start, end) => {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };

    changeMode = () => {
        let isMode = document.getElementById('changeModeInput').checked;
        this.setState({
            ...this.state,
            suggestHolidays: {
                mode: isMode,
                from: null,
                to: null
            }
        });
    }

    clearMarkedHolidays = () => {
        this.setState({
            ...this.state,
            suggestHolidays: {
                mode: true,
                from: null,
                to: null
            }
        });
    }

    pickDate = e => {
        if(this.state.suggestHolidays.mode){
            if(!this.state.suggestHolidays.from){
                this.setState({
                    ...this.state,
                    suggestHolidays: {
                        ...this.state.suggestHolidays,
                        from: e
                    }
                })
            } else {
                this.setState({
                    ...this.state,
                    suggestHolidays: {
                        ...this.state.suggestHolidays,
                        to: e
                    }
                })
            }
        }
    }

    resetSuggestHolidaysMode = () => {
        document.getElementById('additionalInfo').value = "";
        document.getElementById('changeModeInput').checked = false;
        this.setState({
            ...this.state,
            suggestHolidays: {
                mode: false,
                from: null,
                to: null
            }
        });
    }

    submitSuggestHolidays = async(e) => {
        e.preventDefault();
        const { from, to } = this.state.suggestHolidays;
        const { additionalInfo } = e.target;
        let res = await postHolidays(from, to, this.state.user, additionalInfo.value);
        if(res.type === 'success'){
            this.resetSuggestHolidaysMode();
        }
    }

    render = () => {
        const w0 = num => num >= 10 ? num : '0' + num;
        const { suggestHolidays } = this.state;
        var fromDate = suggestHolidays.from ? w0(suggestHolidays.from.getDate()) + '.' + w0(suggestHolidays.from.getMonth()+1) + '.' + suggestHolidays.from.getFullYear() : "";
        var toDate = suggestHolidays.to ? w0(suggestHolidays.to.getDate()) + '.' + w0(suggestHolidays.to.getMonth()+1) + '.' + suggestHolidays.to.getFullYear() : "";
        var datesToMark = [];
        if(this.state.suggestHolidays.mode && this.state.suggestHolidays.from && this.state.suggestHolidays.to){
            var days = this.getDaysArray(this.state.suggestHolidays.from, this.state.suggestHolidays.to);
            datesToMark = days;
        }
        const daysNum = datesToMark.length;
        return (
            <div>
                <CalendarContainer 
                    pickDate={this.pickDate}
                    datesToMark={datesToMark}
                />
                <form onSubmit={this.submitSuggestHolidays} id="add-form">
                    <input type="checkbox" id="changeModeInput" onChange={this.changeMode} />
                    <label htmlFor="changeModeInput" dangerouslySetInnerHTML={{ __html: this.state.suggestHolidays.mode ? '-' : '+' }}/>
                    <span className="text-muted h3 ml-4">Zaproponuj urlop</span>
                    {this.state.suggestHolidays.mode &&
                        <div>
                            <hr/>
                            <b>Od:</b>{fromDate}
                            <br/>
                            <b>Do:</b>{toDate}
                            <div className="d-flex justify-content-between my-2">
                                {daysNum !== 0 &&
                                    <small className="text-muted mt-2">Wybrano {daysNum} dni</small>
                                }
                                <button onClick={this.clearMarkedHolidays} type="button" className="btn btn-danger rounded-0"><i className="fa fa-eraser"></i></button>
                            </div>
                            <textarea className="form-control" id="additionalInfo" placeholder="Dodatkowe informacje" name="additionalInfo"></textarea>
                            <button type="submit" className="btn btn-primary" disabled={!(this.state.suggestHolidays.from && this.state.suggestHolidays.to)}>Wyślij</button>
                        </div>
                    }
                </form>
            </div>
        )
    }
}
import React, { Component } from 'react';
import { getUser, getEmployees, postHolidaysRequest } from '../../../requests';
import CalendarContainer from './Calendar';



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

    componentDidUpdate = () => {
        if(this.state.suggestHolidays.mode && this.state.suggestHolidays.from && this.state.suggestHolidays.to){
            //console.log(this.state);
        }
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

    submitSuggestHolidays = async (e) => {
        e.preventDefault();
        const { from, to } = this.state.suggestHolidays;
        const { additionalInfo } = e.target;
        postHolidaysRequest(from, to, this.state.user, additionalInfo.value);
    }

    render = () => {
        const { suggestHolidays } = this.state;
        var fromDate = suggestHolidays.from ? suggestHolidays.from.getDate() + '.' + suggestHolidays.from.getMonth() + '.' + suggestHolidays.from.getYear() : "";
        var toDate = suggestHolidays.to ? suggestHolidays.to.getDate() + '.' + suggestHolidays.to.getMonth() + '.' + suggestHolidays.to.getYear() : "";
        var datesToMark = [];
        if(this.state.suggestHolidays.mode && this.state.suggestHolidays.from && this.state.suggestHolidays.to){
            var days = this.getDaysArray(this.state.suggestHolidays.from, this.state.suggestHolidays.to);
            datesToMark= days;
        }
        const daysNum = datesToMark.length;
        return (
            <div>
                <CalendarContainer 
                    pickDate={this.pickDate}
                    datesToMark={datesToMark}
                />
                <form onSubmit={this.submitSuggestHolidays}>
                    <label>
                        <input type="checkbox" id="changeModeInput" onChange={this.changeMode} />
                        Zaproponuj urlop
                    </label>
                    {this.state.suggestHolidays.mode &&
                        <div>
                            Od: <b>{fromDate}</b>
                            <br/>
                            Do: <b>{toDate}</b>
                            <button onClick={this.clearMarkedHolidays} type="button" className="btn btn-danger">Wyczyść</button>
                            {daysNum &&
                                <small>Wybrano {daysNum} dni</small>
                            }
                        </div>
                    }
                    <textarea className="form-control" placeholder="Dodatkowe informacje" name="additionalInfo"></textarea>
                    <button type="submit" className="btn btn-primary" disabled={!(this.state.suggestHolidays.from && this.state.suggestHolidays.to)}>Wyślij</button>
                </form>
            </div>
        )
    }
}
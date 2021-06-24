import React, { Component } from 'react';
import { getUser, getEmployees, postHolidays, getHolidaysKinds } from '../../../requests';
import CalendarContainer from './Calendar';
import Form from './Form';
import './style.scss';


export default class Home extends Component{

    state = {
        user: null,
        employees: [],
        kinds: [],
        validForm: false,
        suggestHolidays: {
            mode: false,
            from: null,
            to: null,
            kindId: 4,
            optionNb: 1,
            fromHours: null,
            toHours: null
        }
    }


    fetchEmployees = async () => this.setState({ employees: await getEmployees() });


    fetchKinds = async() => this.setState({ kinds: (await getHolidaysKinds()).filter(i => i.name !== 'chorobowe') });


    componentDidMount = () => {
        const user = getUser();
        this.setState({ user });
        this.fetchEmployees();
        this.fetchKinds();
    }


    componentDidUpdate = (_, prevState) => {
        if(prevState.suggestHolidays.from !== this.state.suggestHolidays.from ||
            prevState.suggestHolidays.to !== this.state.suggestHolidays.to ||
            prevState.suggestHolidays.kindId !== this.state.suggestHolidays.kindId ||
            prevState.suggestHolidays.optionNb !== this.state.suggestHolidays.optionNb ||
            prevState.suggestHolidays.fromHours !== this.state.suggestHolidays.fromHours ||
            prevState.suggestHolidays.toHours !== this.state.suggestHolidays.toHours){
            let isValid = true;
            if(!this.state.suggestHolidays.from)
                isValid = false;
            if(!this.state.suggestHolidays.to)
                isValid = false;
            if(this.state.suggestHolidays.kindId == 7){
                if(this.state.suggestHolidays.optionNb == 1 && this.getDaysArray(this.state.suggestHolidays.from, this.state.suggestHolidays.to).length > 2)
                    isValid = false;
                if(this.state.suggestHolidays.optionNb == 2){
                    if(!this.state.suggestHolidays.fromHours || !this.state.suggestHolidays.toHours)
                        isValid = false;
                    if(this.state.suggestHolidays.fromHours >= this.state.suggestHolidays.toHours)
                        isValid = false;
                    if(this.state.suggestHolidays.from && this.state.suggestHolidays.to && this.state.suggestHolidays.from.getTime() !== this.state.suggestHolidays.to.getTime())
                        isValid = false;
                }
            }
            if(!this.state.suggestHolidays.kindId)
                isValid = false;

            this.setState({ validForm: isValid });
        }
    }


    getDaysArray = (start, end) => {
        for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    }


    changeMode = () => {
        let isMode = document.getElementById('changeModeInput').checked;
        this.setState({
            ...this.state,
            suggestHolidays: {
                mode: isMode,
                from: null,
                to: null,
                kindId: null,
                optionNb: 1,
                fromHours: null,
                toHours: null
            }
        });
    }


    clearMarkedHolidays = () => {
        this.setState({
            ...this.state,
            suggestHolidays: {
                mode: true,
                from: null,
                to: null,
                kindId: null,
                optionNb: 1,
                fromHours: null,
                toHours: null
            }
        });
    }


    onChange = e => {
        var { name, value } = e.target;
        if(name === 'fromHours' || name === 'toHours')
            value = parseInt(value);
        if(name === 'kindId' && value === '')
            value = null
        this.setState({ ...this.state, suggestHolidays: {
            ...this.state.suggestHolidays,
            [name]: value
        }});
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
                to: null,
                kindId: null,
                optionNb: 1,
                fromHours: null,
                toHours: null
            }
        });
    }


    submitSuggestHolidays = async(e) => {
        e.preventDefault();
        if(this.state.validForm){
            var { from, to, kindId } = this.state.suggestHolidays;
            var { additionalInfo, purpose } = e.target;
            var placeholder = "[]";
            if(this.state.suggestHolidays.kindId == 6){
                placeholder = JSON.stringify({ purpose: purpose.value });
            }
            else if(this.state.suggestHolidays.kindId == 7){
                const { optionNb, fromHours, toHours } = this.state.suggestHolidays;
                placeholder = JSON.stringify({ 
                    optionNb: parseInt(optionNb), 
                    fromHours, 
                    toHours 
                });
            }

            additionalInfo = additionalInfo.value;
            let res = await postHolidays(
                from, 
                to, 
                this.state.user, 
                additionalInfo, 
                kindId, 
                placeholder
            );

            if(res.type === 'success'){
                this.resetSuggestHolidaysMode();
            }
        }
    }


    render = () => {
        const w0 = num => num >= 10 ? num : '0' + num;
        const { suggestHolidays } = this.state;
        var fromDate = suggestHolidays.from ? w0(suggestHolidays.from.getDate()) + '.' + w0(suggestHolidays.from.getMonth()+1) + '.' + suggestHolidays.from.getFullYear() : "";
        var toDate = suggestHolidays.to ? w0(suggestHolidays.to.getDate()) + '.' + w0(suggestHolidays.to.getMonth()+1) + '.' + suggestHolidays.to.getFullYear() : "";
        var datesToMark = [];
        if(this.state.suggestHolidays.mode && this.state.suggestHolidays.from && this.state.suggestHolidays.to)
            var datesToMark = this.getDaysArray(this.state.suggestHolidays.from, this.state.suggestHolidays.to);

        return (
            <div>
                <CalendarContainer 
                    pickDate={this.pickDate}
                    datesToMark={datesToMark}
                />
                <form 
                    onSubmit={this.submitSuggestHolidays} 
                    id="add-form"
                >
                    <input 
                        type="checkbox" 
                        id="changeModeInput" 
                        onChange={this.changeMode} 
                    />
                    <label 
                        htmlFor="changeModeInput" 
                        dangerouslySetInnerHTML={{ __html: this.state.suggestHolidays.mode ? '-' : '+' }}
                    />
                    <span 
                        className="text-muted h3 ml-4"
                    >
                        Zaproponuj urlop
                    </span>
                    {this.state.suggestHolidays.mode &&
                        <div>
                            <span 
                                className="text-muted"
                            >
                                Zaznacz daty urlopu (od dnia - do dnia), jeśli stwierdzisz że chcesz zedytować daty po zaznaczeniu, użyj przycisku gumki poniżej i zaznacz jeszcze raz
                            </span>
                            <hr/>
                            <b>Od:</b>{fromDate}
                            <br/>
                            <b>Do:</b>{toDate}
                            <div 
                                className="d-flex justify-content-between my-2"
                            >
                                {datesToMark.length !== 0 &&
                                    <small 
                                        className="text-muted mt-2"
                                    >
                                        Wybrano {datesToMark.length} dni
                                    </small>
                                }
                                <button 
                                    onClick={this.clearMarkedHolidays} 
                                    type="button" 
                                    className="btn btn-danger rounded-0"
                                >
                                    <i 
                                        className="fa fa-eraser"
                                    ></i>
                                </button>
                            </div>
                            <Form
                                onChange={this.onChange}
                                kinds={this.state.kinds}
                                kindId={this.state.suggestHolidays.kindId}
                                optionNb={this.state.suggestHolidays.optionNb}
                                fromHours={this.state.suggestHolidays.fromHours}
                                toHours={this.state.suggestHolidays.toHours}
                                datesToMark={datesToMark}
                                from={this.state.suggestHolidays.from}
                                to={this.state.suggestHolidays.to}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={!this.state.validForm}
                            >
                                Wyślij
                            </button>
                        </div>
                    }
                </form>
            </div>
        )
    }
}
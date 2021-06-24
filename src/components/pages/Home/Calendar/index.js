import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './style.scss';

const CalendarContainer = props => {
    var value = new Date();
    return(
        <div className="text-center">
            <h1 className="mb-5">Kalendarz urlopowy</h1>
            <Calendar
                defaultValue={value}
                onClickDay={props.pickDate}
                tileClassName={({ date, view }) => {
                    for(let  i=0; i<props.datesToMark.length; i++){
                        let d = props.datesToMark[i];
                        if(date.getDate() === d.getDate() && date.getMonth() === d.getMonth() && date.getYear() === d.getYear()){
                            return 'picked';
                        }
                    }
                }}
            />
        </div>
    )
}

export default CalendarContainer;
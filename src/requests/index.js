import axios from 'axios';
import { store } from 'react-notifications-component';
const API = 'http://localhost/holidays/backend/';
const URL = 'http://localhost:3000/'


const getUser = () => {
    return JSON.parse(window.localStorage.getItem('holidaysAuth'));
}


const params = data => {
    const res = new URLSearchParams();
    for(const [key, value] of Object.entries(data)){
        res.append(key, value);
    }
    return res;
}


const login = (email, token) => {
    axios.post(API + 'auth/login', params({ email, token }), {})
    .then(res => res.data)
    .then(res => {
        window.localStorage.setItem('holidaysAuth', JSON.stringify(res.data));
        window.location.replace(URL);
    })
    .catch(err => addNotification('danger', err.response.data.data));
}


const logout = () => {
    window.localStorage.removeItem('holidaysAuth');
    window.location.replace(URL + 'login');
}


const getEmployees = () => {
    return new Promise(resolve => {
        const user = getUser();
        axios.post(API + 'user/employees', params({ user_id: user.id }), {})
        .then(res => res.data)
        .then(res => resolve(res))
        .catch(err => addNotification('danger', err.response.data.data));
    })
}


const getManager = () => {
    return new Promise(resolve => {
        const user = getUser();
        axios.post(API + 'user/managers', params({ user_id: user.id }))
        .then(res => res.data)
        .then(res => resolve(res))
        .catch(err => addNotification('danger', err.response.data.data));
    });
}


const postHolidaysRequest = (from, to, user, additionalInfo) => new Promise(resolve => {
    axios.post(API + 'holidays', params({ 
        from: from.getFullYear() + '-' + ((from.getMonth() + 1) < 10 ? '0' + (from.getMonth() + 1) : from.getMonth() + 1) + '-' + (from.getDate() < 10 ? '0' + from.getDate() : from.getDate()), 
        to: to.getFullYear() + '-' + ((to.getMonth() + 1) < 10 ? '0' + (to.getMonth() + 1) : to.getMonth() + 1) + '-' + (to.getDate() < 10 ? '0' + to.getDate() : to.getDate()), 
        user_id: user.id, 
        additionalInfo
    }))
    .then(res => res.data)
    .then(res => {
        addNotification('success', res.data);
        resolve(res);
    })
    .catch(err => addNotification('danger', err.response.data.data));
})


const getEmployeeHolidayRequests = employeeId => new Promise(resolve => {
    let user = getUser();
    axios.post(API + 'holidays/employees', params({ employee_id: employeeId, user_id: user.id }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => addNotification('danger', err.response.data.data));
})


const putHolidayEvent = (id, type) => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'holidays/update', params({ user_id: user.id, id, type }))
    .then(res => res.data)
    .then(res => {
        addNotification('success', res.data);
        resolve(res)
    })
    .catch(err => addNotification('danger', err.response.data.data));
})


const addNotification = (type, text) => {
    store.addNotification({
        message: text,
        type,
        insert: 'top',
        container: 'top-right',
        dismiss: {
            duration: 5000,
        }
    });
}


export{
    login,
    logout,
    getUser,
    getEmployees,
    getManager,
    postHolidaysRequest,
    getEmployeeHolidayRequests,
    putHolidayEvent,
    addNotification
}
import axios from 'axios';
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
    .catch(err => console.log(err))
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
        .catch(err => console.log(err))
    })
}


const getManager = () => {
    return new Promise(resolve => {
        const user = getUser();
        axios.post(API + 'user/managers', params({ user_id: user.id }))
        .then(res => res.data)
        .then(res => resolve(res))
        .catch(err => console.log(err))
    });
}


const postHolidaysRequest = (from, to, user, additionalInfo) => {
    axios.post(API + 'holidays', params({ 
        from: from.getFullYear() + '-' + ((from.getMonth() + 1) < 10 ? '0' + (from.getMonth() + 1) : from.getMonth() + 1) + '-' + (from.getDate() < 10 ? '0' + from.getDate() : from.getDate()), 
        to: to.getFullYear() + '-' + ((to.getMonth() + 1) < 10 ? '0' + (to.getMonth() + 1) : to.getMonth() + 1) + '-' + (to.getDate() < 10 ? '0' + to.getDate() : to.getDate()), 
        user_id: user.id, 
        additionalInfo
    }))
    .then(res => res.data)
    .then(res => {
        console.log(res);
        //window.location.replace(URL);
    });
}


const getEmployeeHolidayRequests = employeeId => new Promise(resolve => {
    let user = getUser();
    axios.post(API + 'holidays/employees', params({ employee_id: employeeId, user_id: user.id }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => console.log(err));
})


const putHolidayEvent = (id, type) => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'holidays/update', params({ user_id: user.id, id, type }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => console.log(err));
})


export{
    login,
    logout,
    getUser,
    getEmployees,
    getManager,
    postHolidaysRequest,
    getEmployeeHolidayRequests,
    putHolidayEvent
}
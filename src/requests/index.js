import axios from 'axios';
import { store } from 'react-notifications-component';
const API = 'http://localhost/holidays/backend/';
const URL = 'http://localhost:3000/holidays/'


//pobiera zalogowanego użytkownika
const getUser = () => {
    return JSON.parse(window.localStorage.getItem('holidaysAuth'));
}

//konwertuje dane do wysłania żądania
const params = data => {
    const res = new URLSearchParams();
    for(const [key, value] of Object.entries(data)){
        res.append(key, value);
    }
    return res;
}

//logowanie
const login = (email, token) => {
    axios.post(API + 'auth/login', params({ email, token }), {})
    .then(res => res.data)
    .then(res => {
        window.localStorage.setItem('holidaysAuth', JSON.stringify(res.data));
        window.location.replace(URL);
    })
    .catch(err => {
        addNotification('danger', err.response.data.data);
        document.querySelector('input[type="password"').value = "";
    });
}

//wylogowywanie
const logout = () => {
    window.localStorage.removeItem('holidaysAuth');
    window.location.replace(URL + 'login');
}

//pobiera pracowników zalogowanego użytkownika
const getEmployeesOfUser = () => {
    return new Promise(resolve => {
        const user = getUser();
        axios.post(API + 'user/employees', params({ user_id: user.id }), {})
        .then(res => res.data)
        .then(res => resolve(res))
        .catch(err => addNotification('danger', err.response.data.data));
    })
}

//pobiera kierownika zalogowanego pracownika
const getManager = () => {
    return new Promise(resolve => {
        const user = getUser();
        axios.post(API + 'user/managers', params({ user_id: user.id }))
        .then(res => res.data)
        .then(res => resolve(res))
        .catch(err => addNotification('danger', err.response.data.data));
    });
}

//utworzenie nowego urlopu
const postHolidays = (from, to, user, additionalInfo, kindId) => new Promise(resolve => {
    axios.post(API + 'holidays/add', params({ 
        from: from.getFullYear() + '-' + ((from.getMonth() + 1) < 10 ? '0' + (from.getMonth() + 1) : from.getMonth() + 1) + '-' + (from.getDate() < 10 ? '0' + from.getDate() : from.getDate()), 
        to: to.getFullYear() + '-' + ((to.getMonth() + 1) < 10 ? '0' + (to.getMonth() + 1) : to.getMonth() + 1) + '-' + (to.getDate() < 10 ? '0' + to.getDate() : to.getDate()), 
        user_id: user.id, 
        additionalInfo,
        kindId
    }))
    .then(res => res.data)
    .then(res => {
        console.log(res)
        addNotification('success', res.data);
        resolve(res);
    })
    .catch(err => addNotification('danger', err.response.data.data));
})

//pobiera urlopy po id pracownika
const getHolidaysByEmployeeId = (employeeId, all = false) => new Promise(resolve => {
    let user = getUser();
    axios.post(API + 'holidays/get-by-employee-id', params({ employee_id: employeeId, user_id: user.id, all }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => addNotification('danger', err.response.data.data));
})

//aktualizuje urlop po id
const putHolidays = (id, type) => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'holidays/update', params({ user_id: user.id, id, type }))
    .then(res => res.data)
    .then(res => {
        addNotification('success', res.data);
        resolve(res)
    })
    .catch(err => addNotification('danger', err.response.data.data));
})

//usuwa urlop
const deleteHolidays = id => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'holidays/delete', params({ id, user_id: user.id }))
    .then(res => res.data)
    .then(res => {
        addNotification('success', res.data);
        resolve(res);
    })
    .catch(err => addNotification('danger', err.response.data.data))
})

//dodaje informacje dla użytkownika
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

//pobiera statusy
const getStatuses = () => new Promise(resolve => {
    axios.get(API + 'statuses')
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => addNotification('danger', err.response.data.data))
})

//pobiera pracowników
const getEmployees = (id = null, keywords = '') => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'employees', params({ user_id: user.id, employee_id: id, keywords }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(() => resolve(false));
});

//pobieranie powiadomień
const getNotifications = () => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'notifications', params({ user_id: user.id }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => {
        addNotification('danger', err.response.data.data);
        resolve(false);
    });
})

//'przeczytanie powiadomienia'
const putNotification = notificationId => new Promise(resolve => {
    const user = getUser();
    axios.post(API + 'notifications/update', params({ notification_id: notificationId, user_id: user.id }))
    .then(res => res.data)
    .then(res => resolve(res))
    .catch(err => {
        addNotification('danger', err.response.data.data);
        resolve(false);
    });
})


export{
    login,
    logout,
    getUser,
    getEmployeesOfUser,
    getManager,
    postHolidays,
    getHolidaysByEmployeeId,
    putHolidays,
    deleteHolidays,
    addNotification,
    getStatuses,
    getEmployees,
    getNotifications,
    putNotification
}



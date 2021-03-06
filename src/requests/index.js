import axios from 'axios';
import { store } from 'react-notifications-component';
const API = 'http://192.168.0.234/holidays/backend/';
const URL = 'http://192.168.0.234/holidays/'


//pobiera zalogowanego użytkownika
const getUser = () => {
    let user = window.localStorage.getItem('holidaysAuth');
    return (user && user != 'undefined') ? JSON.parse(user) : null;
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
        console.log(res)
        if(res.data){
            window.localStorage.setItem('holidaysAuth', JSON.stringify(res.data));
            window.location.replace(URL);
        } else {
            addNotification('danger', 'Coś poszło nie tak');
        }
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
        .then(res => {
            console.log(res);
            resolve(res);
        })
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
const postHolidays = (from, to, user, additionalInfo, kindId, placeholder='[]') => new Promise(resolve => {
    console.log(from, to, user, additionalInfo, kindId, placeholder);
    if(from !== '0000-00-00'){
        from = from.getFullYear() + '-' + ((from.getMonth() + 1) < 10 ? '0' + (from.getMonth() + 1) : from.getMonth() + 1) + '-' + (from.getDate() < 10 ? '0' + from.getDate() : from.getDate());
    }
    if(to !== '0000-00-00'){
        to = to.getFullYear() + '-' + ((to.getMonth() + 1) < 10 ? '0' + (to.getMonth() + 1) : to.getMonth() + 1) + '-' + (to.getDate() < 10 ? '0' + to.getDate() : to.getDate());
    }
    axios.post(API + 'holidays/add', params({ 
        from, 
        to, 
        user_id: user.id, 
        additionalInfo,
        kindId,
        placeholder
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
        console.log(res)
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
    .catch(err => {
        addNotification('danger', err.response.data.data)
    })
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

//pobiera typy urlopów
const getHolidaysKinds = () => new Promise(resolve => {
    axios.get(API + 'kinds')
    .then(res => res.data)
    .then(res => resolve(res.data))
    .catch(err => {
        console.log(err);
        resolve([])
    })
})

//generuje pdfa z wnioskiem
const getPDF = id => new Promise(resolve => {
    axios.post(API + 'pdf', params({ id }))
    .then(res => resolve(res.data))
    .catch(err => {
        addNotification('error', 'Nie udało się wczytać wniosku');
        resolve(false);
    })
})


const setDeputy = deputyId => new Promise((resolve, reject) => {
    let user = getUser()
    axios.post(API + 'user/set-deputy', params({ user_id: user.id, deputy_id: deputyId }))
    .then(res => {
        console.log(res);
        resolve(res.data)
    })
    .catch(reject);
})


const getDeputy = () => new Promise((resolve, reject) => {
    let user = getUser()
    axios.post(API + 'user/deputy', params({ user_id: user.id }))
    .then(res => resolve(res.data.data))
    .catch(reject);
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
    putNotification,
    getHolidaysKinds,
    getPDF,
    setDeputy,
    getDeputy
}



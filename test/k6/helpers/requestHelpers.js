import http from 'k6/http';

export function login(username, password, url) {
    const response = http.post(`${url}`, 
        JSON.stringify({
            "username": username,
            "password": password
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return response;
}

export function getToken(response) {
    return response.json('token');
}

export function registerUser(username, password, url) {
    const response = http.post(`${url}`, 
        JSON.stringify({
            "username": username,
            "password": password
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    return response;
}

export function createNotes(title, content, token, url) {
    const response = http.post(`${url}`, 
        JSON.stringify({
            "title": title,
            "content": content
        }),
        {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        }
    );
    return response;
}
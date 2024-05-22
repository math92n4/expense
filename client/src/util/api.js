const apiUrl = "http://localhost:8080"

export async function fetchGet(path) {
    try {
        const res = await fetch(`${apiUrl}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const resData = await res.json();
        
        return {
            status: res.status,
            data: resData
        }

    } catch(error) {
        console.error(error.message)
    }
    
}

export async function fetchPost(path, body) {
    try {
        const res = await fetch(`${apiUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        })

        const resData = await res.json();

        return {
            status: res.status,
            data: resData
        }

    } catch(error) {
        throw new Error(error.message);
    }
}

export async function fetchPut(path, body) {
    try {
        const res = await fetch(`${apiUrl}${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        })

        const resData = await res.json();

        return {
            status: res.status,
            data: resData
        }

    } catch(error) {
        throw new Error(error.message);
    }
}

export async function fetchDelete(path) {
    try {
        const res = await fetch(`${apiUrl}${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        
        const resData = await res.json();

        return {
            status: res.status,
            data: resData
        }

    } catch(error) {
        throw new Error(error.message)
    }
}
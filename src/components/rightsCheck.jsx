import { apihost } from "../env";

const pageRights = (page, pageType, user) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        return fetch(`${apihost}/api/pagerights?menuid=${page}&menutype=${pageType}&user=${user}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': token
            }
        })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(e => console.log(e));
    } else {
        return Promise.reject(new Error('Token not available'));
    }
}

export { pageRights };

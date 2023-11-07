import { apihost } from "../env";

const pageRights = (pageType, page) => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('userToken');
        let res = {};
        if (!token) {
            reject(new Error('Token not available'));
        }
        fetch(`${apihost}/api/userid`, { 
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': token,
            }
         })
            .then((res) => res.json())
            .then((data) => {
                res.UserId = data.User_Id
            })
            .then(() => {
                return fetch(`${apihost}/api/pagerights?menuid=${page}&menutype=${pageType}&user=${res.UserId}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        'Authorization': token,
                        'Db': 'db1'
                    }
                })
            })
            .then((res) => res.json())
            .then((data) => {
                res.token = token;
                res.status = "success";
                if(data.data.Read_Rights === 0) {
                    window.location.href = '/'
                } else {
                    res.permissions = data.data;
                    resolve(res);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
}

export { pageRights };
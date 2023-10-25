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
                'Db': 'db1'
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
                res.permissions = data;
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

// UserId
// : 
// "1"
// permissions
// : 
// Add_Rights
// : 
// 1
// Delete_Rights
// : 
// 1
// Edit_Rights
// : 
// 1
// Read_Rights
// : 
// 1
// [[Prototype]]
// : 
// Object
// status
// : 
// "success"
// token
// : 
// ""

export { pageRights };
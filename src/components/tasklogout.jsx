import { useEffect } from "react"
import { apihost } from "../backendAPI"

const TaskLogout = () => {
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('loginResponse'))
        fetch(`${apihost}/api/logout?userid=${localStorage.getItem('UserId')}&sessionId=${session.SessionId}`,
            {
                method: 'PUT',
                headers: { 'Authorization': localStorage.getItem('userToken') }
            })
            .then((res) => { return res.json() })
            .then(data => {
                if (data.status === 'Success') {
                    localStorage.clear();
                    window.location.href = '/';
                }
            })
    }, [])

    return (
        <h2>Logging Out...</h2>
    )
}

export default TaskLogout;
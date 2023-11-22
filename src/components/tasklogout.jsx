import { useEffect } from "react"


const TaskLogout = () => {
    useEffect(() => {
        localStorage.clear();
        window.location.href = '/';
    },[])
    return (
        <>

        </>
    )
}

export default TaskLogout;
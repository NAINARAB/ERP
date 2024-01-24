import { useEffect, useState } from "react";


const PaymentFailure = () => {
    const [payID, setPayId] = useState('')

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentID = queryParams.get('payment_id');
        setPayId(paymentID)
    }, [])

    return (
        <>
            <div className="vh-100 bg-primary d-flex flex-column justify-content-center align-items-center p-2 text-white">
                <h3>Payment Failed!</h3>
                <h4>PaymentID: {payID}</h4>
            </div>

        </>
    )
}

export default PaymentFailure;
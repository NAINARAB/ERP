import { useEffect, useState } from "react";

const PaymentSuccess = () => {
    const [payID, setPayId] = useState('')

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentID = queryParams.get('payment_id');
        setPayId(paymentID)
    }, [])

    return (
        <>
            <div className="h-100 bg-primary d-flex flex-column justify-content-center align-content-center p-2">
                <h3>Payment Success</h3>
                <h4>PaymentID: </h4>
            </div>
        </>
    )
}

export default PaymentSuccess;
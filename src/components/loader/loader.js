import React from "react";
import './loading.css';
let Loader = () => {
    return (
        <>
            <section className="wrapper fulscrn">
                <div className="spinner">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </div>
            </section>
        </>
    );
}

export default Loader;
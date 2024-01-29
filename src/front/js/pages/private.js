// Private.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import Ofertas from "../component/ofertasCOMP"; // Correct import statement

const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(store.token);
        !store.token && navigate("/login");
    }, [store.token]);
    console.log(store.profile);

    return (
        <>
            {store?.token ? <Ofertas name={store.profile?.name} /> : navigate("/")}
        </>
    );
};

export default Private;

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import Dashboard from "../../component/dashboard";
import { useLocalStorage } from "../../hooks/hooks";

const PrivateAdmin = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!store.tokenAdmin) {
        actions.checkForTokenAdmin(); // Check for tokenAdmin in localStorage
      }
    }, [store.tokenAdmin, actions]);
  
    useEffect(() => {
      if (!store.tokenAdmin) {
        navigate("/admin/login");
      }
    }, [store.tokenAdmin, navigate]);
  
    return (
      <>
        {store.tokenAdmin && <Dashboard name={store.profile?.name} />}
      </>
    );
  };
  

export default PrivateAdmin;

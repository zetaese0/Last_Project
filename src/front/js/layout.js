// layout.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import injectContext from "./store/appContext"; // Adjust the path as needed

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";

import OfertaPage from "./pages/ofertaPage";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Private from "./pages/private"
import PrivateAdmin from "./pages/Admin/privateAdmin"
import Login from "./pages/login"
import LoginAdmin from "./pages/Admin/loginAdmin"
import Admin from "./pages/Admin/admin"


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";


    

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;
    

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login"/>
                        <Route element={<LoginAdmin />} path="/admin/login"/>
                        <Route element={<Private />} path="/private" />
                        <Route element={<Admin />} path="/admin" />
                        <Route element={<PrivateAdmin />} path="/admin/private" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<OfertaPage />} path="/oferta/:ofertaId" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Home from "./views/home.tsx";
import AppProvider from "./providers/AppProvider.tsx";
import {NextUIProvider} from '@nextui-org/react'
import {OAuthPopup} from "@tasoskakour/react-use-oauth2";
import AuthProvider from "./providers/AuthProvider.tsx";

import Dashboard from "./views/dashboard";
function Relocate() {
    window.location.href = `${document.location.origin}/client`
    return (<div></div>)
}

function App() {

    return (
        <div className="App">
            <NextUIProvider>
                <main className="dark text-foreground bg-background h-svh">
                <AppProvider url="https://sridonchai.chaowdev.xyz">
                    <AuthProvider>
                        <BrowserRouter basename="/client">
                            <Routes>
                                <Route path="" element={<Home></Home>}/> {/* 👈 Renders at /#/app/ */}
                                <Route path="/home" element={<Dashboard></Dashboard>}/> {/* 👈 Renders at /#/app/ */}
                                <Route path="/login" element={<OAuthPopup/>}/> {/* 👈 Renders at /#/app/ */}
                            </Routes>
                        </BrowserRouter>

                        <BrowserRouter basename="">
                            <Routes>
                                <Route path="" element={<Relocate/>}/> {/* 👈 Renders at /#/app/ */}
                            </Routes>
                        </BrowserRouter>
                    </AuthProvider>
                </AppProvider>
                    </main>
            </NextUIProvider>
        </div>
    )
}

export default App

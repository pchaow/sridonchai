import {useState} from 'react'
import './App.css'
import {FrappeProvider} from 'frappe-react-sdk'
import {HashRouter,Routes,Route} from "react-router-dom";
import Home from "./views/home.tsx";
import Test from "./views/test.tsx";


function App() {

    return (
        <div className="App">
            <FrappeProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Home></Home>}/> {/* 👈 Renders at /#/app/ */}
                        <Route path="/test" element={<Test></Test>}/> {/* 👈 Renders at /#/app/ */}
                    </Routes>
                </HashRouter>
            </FrappeProvider>
        </div>
    )
}

export default App
import React, {createContext, PropsWithChildren, useState} from "react";

export const AppProviderContext = createContext({})

export default  function AppProvider( {children}: PropsWithChildren) :  React.ReactElement | null{

    const [name,setName] = useState("Sridonchai")

    return (<AppProviderContext.Provider value={{ name,setName }}>{children}</AppProviderContext.Provider>)
}


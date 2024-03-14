import React, {createContext, PropsWithChildren, useContext, useState} from "react";
import _axios, {AxiosInstance} from "axios";

interface AppProviderContextInterface {
    name: string;
    url: string
    axios: AxiosInstance;
    client: AxiosInstance | null;
    setClient: any;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;

}

export const AppProviderContext = createContext<AppProviderContextInterface>({} as AppProviderContextInterface)

export default function AppProvider({url, children}: PropsWithChildren<{ url: string }>): React.ReactElement | null {

    const [name] = useState("Sridonchai")
    const [clientId] = useState("57d582555e")
    const [clientSecret] = useState("15dcf2439e")
    const [redirectUrl] = useState('http://localhost:8080/login')
    const [client, setClient] = useState(null)
    console.log(url)

    const axios = _axios.create({
        baseURL: url,
        withCredentials: true,
    })


    return (
        <AppProviderContext.Provider value={{name, axios, url, clientId, redirectUrl, clientSecret, client, setClient}}>
            {children}
        </AppProviderContext.Provider>)
}

export const useAppProvider = () => useContext(AppProviderContext)

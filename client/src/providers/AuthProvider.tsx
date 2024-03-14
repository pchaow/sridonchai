import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {TAuthTokenPayload, TState, useOAuth2} from "@tasoskakour/react-use-oauth2";
import {useAppProvider} from "./AppProvider.tsx";
import _axios, {AxiosInstance} from "axios";

interface AuthProviderContextInterface<TData = TAuthTokenPayload> {
    data: TState<TData>;
    loading: boolean;
    error: string | null;
    getAuth: () => () => void;
    logout: () => void;
    isPersistent: boolean;

    getSecureClient: () => AxiosInstance;
    user: string;
    checkLogin: () => Promise<void>
}

export const AuthProviderContext = createContext<AuthProviderContextInterface>({} as AuthProviderContextInterface)

export default function AuthProvider({children}: PropsWithChildren): React.ReactElement | null {

    const {axios, client, setClient, url, clientId} = useAppProvider()

    const [user, setUser] = useState(null)

    const oauth = useOAuth2({
        authorizeUrl: url + "/api/method/frappe.integrations.oauth2.authorize",
        clientId: clientId,
        redirectUri: `${document.location.origin}/client/login`,
        scope: "all openid",
        responseType: "code",
        exchangeCodeForTokenQueryFn: (callbackParameters) => {
            console.log(callbackParameters)
            return axios.post("/api/method/frappe.integrations.oauth2.get_token", {
                code: callbackParameters.code,
                grant_type: "authorization_code",
                client_id: clientId,
                redirect_uri: `${document.location.origin}/client/login`
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(r => r.data)
        },
        onSuccess: async (payload) => {
            console.log("Success", payload)
            //set default
            localStorage.setItem("token", JSON.stringify(payload))

            await checkLogin()
        },
        onError: (error_) => console.log("Error", error_)
    });

    const getSecureClient = (): AxiosInstance | null => {
        let token = getTokenFromLocalStorage()
        if (token == null) {
            if (user) {
                setUser(null)
                return null
            }

        }

        return _axios.create({
            baseURL: url,
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
    }

    const getTokenFromLocalStorage = () => {
        let payload = localStorage.getItem('token')
        if (payload) {
            let payload_data = JSON.parse(payload)
            if (payload_data.access_token) {
                return payload_data.access_token
            }
        }
        return null;
    }

    const checkLogin = async () => {
        let secure_client = getSecureClient()
        if (secure_client) {
            secure_client.post("/api/method/frappe.auth.get_logged_user").then(res => {
                console.log("get_logged_user", res)
                let user_name = res.data.message
                setUser(user_name)
            })
        }
    }

    useEffect(() => {
        if (user) {
            //check can login
            checkLogin().then(() => {
                console.log("checkLogin success")
            })
        } else {
            checkLogin()
        }
    }, [user])


    return (
        <AuthProviderContext.Provider
            value={{...oauth, getSecureClient, checkLogin, user}}>{children}</AuthProviderContext.Provider>
    )
}


export const useAuthProvider = () => useContext(AuthProviderContext)

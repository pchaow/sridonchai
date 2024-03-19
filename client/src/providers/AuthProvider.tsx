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
    const gotoLogin = () => {
        if (window.location.href != `${document.location.origin}/client/`) {
            window.location.href = `${document.location.origin}/client/`
        }

    }

    const oauth = useOAuth2({
        authorizeUrl: url + "/api/method/frappe.integrations.oauth2.authorize",
        clientId: clientId,
        redirectUri: `${document.location.origin}/client/login`,
        scope: "all openid",
        responseType: "code",
        exchangeCodeForTokenQueryFn: (callbackParameters) => {
            localStorage.setItem('code', callbackParameters.code)
            console.log(callbackParameters)
            return axios.post("/api/method/frappe.integrations.oauth2.get_token", {
                code: callbackParameters.code,
                grant_type: "authorization_code",
                client_id: clientId,
                redirect_uri: `${document.location.origin}/client/login`,
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

        let instance = _axios.create({
            baseURL: url,
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return instance
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

    
    const getRefreshTokenFromLocalStorage = () => {
        let payload = localStorage.getItem('token')
        if (payload) {
            let payload_data = JSON.parse(payload)
            if (payload_data.refresh_token) {
                return payload_data.refresh_token
            }
        }
        return null;
    }

    const refresh_token = () => {
        let refreshToken = localStorage.getItem('token')
        let code = localStorage.getItem('code')
        if (refreshToken) {
            let data = JSON.parse(refreshToken)
            let token = data?.refresh_token
            let secure_client = getSecureClient()
            if (secure_client) {
                axios.post("/api/method/frappe.integrations.oauth2.get_token", {
                    refresh_token: token,
                    grant_type: "refresh_token",
                    client_id: clientId,
                    redirect_uri: `${document.location.origin}/client/login`
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(async (response) => {
                    localStorage.setItem("token", JSON.stringify(response.data))
                    await checkLogin()

                }).catch(async err => {
                    //not pass
                    gotoLogin()
                })
            }
        }
    }

    const checkLogin = async () => {
        let secure_client = getSecureClient()
        if (secure_client) {
            secure_client.post("/api/method/frappe.auth.get_logged_user").then(res => {
                console.log("get_logged_user", res)
                let user_name = res.data.message
                setUser(user_name)
            }).catch(async err => {
                //not pass
                await refresh_token()
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

    const doLogout = async () => {
        let client = getSecureClient()
        let token = getTokenFromLocalStorage()
        let refresh_token = getRefreshTokenFromLocalStorage()
        await axios?.post("/api/method/frappe.integrations.oauth2.revoke_token", {
            token : token
        }, {
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }).then(r=>{
            localStorage.removeItem('token')
            localStorage.removeItem('code')
        })
        oauth.logout()

    }


    return (
        <AuthProviderContext.Provider
            value={{...oauth, getSecureClient, checkLogin, user,logout : doLogout}}>{children}</AuthProviderContext.Provider>
    )
}


export const useAuthProvider = () => useContext(AuthProviderContext)

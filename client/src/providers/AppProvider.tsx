import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import _axios, {AxiosInstance} from "axios";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Spinner
} from "@nextui-org/react"

interface AppProviderContextInterface {
    name: string;
    url: string
    axios: AxiosInstance;
    client: AxiosInstance | null;
    setClient: any;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;

    closeLoading: any;
    showLoading: any;
    isLoading: any;

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


    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    return (
        <AppProviderContext.Provider value={{
            axios,
            client,
            clientId,
            clientSecret,
            closeLoading: onClose,
            isLoading: isOpen,
            name,
            redirectUrl,
            setClient,
            showLoading: onOpen,
            url
        }}>
            <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}
                   isKeyboardDismissDisabled={true} hideCloseButton={true}
                   size="xs"
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">กรุณารอสักครู่</ModalHeader>
                        <ModalBody>
                            <Spinner/>
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                </ModalContent>
            </Modal>

            {children}
        </AppProviderContext.Provider>)
}

export const useAppProvider = () => useContext(AppProviderContext)

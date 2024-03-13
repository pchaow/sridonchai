import {useContext} from "react";
import {AppProviderContext} from "../providers/AppProvider.tsx";

export default function Home() {

    const {name,setName} = useContext(AppProviderContext)


    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div>{name}</div>
                <div>ABC</div>
            </div>
            <div className="flex flex-row">
                <div>ABC</div>
                <div>ABC</div>
            </div>
            <div className="flex flex-row">
                <div>ABC</div>
                <div>ABC</div>
            </div>
        </div>
    )

}

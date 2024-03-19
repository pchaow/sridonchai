import {Card, CardBody} from "@nextui-org/react";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import { FaListCheck,FaPen,FaArrowRightFromBracket  } from "react-icons/fa6";

export default function Dashboard() {

    const {user,logout}  = useAuthProvider()
    const _logout = async () => {
        logout().then(r=>{
            navigate("/")
        }).catch(err=>{
            navigate("/")
        })
        
    }
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-3">
            <div className="flex mb-6 text-xl font-bold text-white">ยินดีต้อนรับ {user}</div>
            <div className="flex  gap-3 items-center justify-center">
                <Card isPressable className="w-[100px] h-[100px] bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/search")}>
                    <CardBody className="items-center justify-center">
                        <FaListCheck className="w-10 h-10 text-success" />
                        <span className="text-center text-xs font-bold">ตรวจสอบค่าน้ำ</span>
                    </CardBody>
                </Card>

                <Card isPressable className="w-[100px] h-[100px] bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/report")} >
                    <CardBody className="items-center justify-center">
                        <FaPen className="w-16 h-10 text-success" />
                        <span className="text-center text-xs font-bold">ผลการดำเนินการ</span>
                    </CardBody>
                </Card>

                <Card isPressable className="w-[100px] h-[100px] bg-secondary-300 items-center justify-center" onClick={()=>{_logout()}} >
                    <CardBody className="items-center justify-center">
                        <FaArrowRightFromBracket className="w-16 h-10 text-success" />
                        <span className="text-center text-xs font-bold">ออกจากระบบ</span>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

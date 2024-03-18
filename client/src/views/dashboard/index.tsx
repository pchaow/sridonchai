import {Card, CardBody} from "@nextui-org/react";
import {WaterPipe, IconWrite, IconBahtSign} from "../../icons";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import { FaListCheck,FaPen  } from "react-icons/fa6";
import { TbCurrencyBaht } from "react-icons/tb";

export default function Dashboard() {

    const {user}  = useAuthProvider()
    const navigate = useNavigate()
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="flex mb-6 text-xl font-bold text-white">ยินดีต้อนรับ {user}</div>
            <div className="grid  gap-3 grid-cols-3 items-center justify-center">
                <Card isPressable className="bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/search")}>
                    <CardBody className="items-center justify-center">
                        <FaListCheck className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">ตรวจสอบค่าน้ำ</span>
                    </CardBody>
                </Card>

                <Card isPressable className="bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/report")} >
                    <CardBody className="items-center justify-center">
                        <FaPen className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">ผลการดำเนินการ</span>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

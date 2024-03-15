import {Card, CardBody} from "@nextui-org/react";
import {WaterPipe, IconWrite, IconBahtSign} from "../../icons";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {

    const {user}  = useAuthProvider()
    const navigate = useNavigate()
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="flex mb-6 text-xl font-bold text-white">ยินดีต้อนรับ {user}</div>
            <div className="grid  gap-3 grid-cols-3 items-center justify-center">
                <Card isPressable className="bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/search")}>
                    <CardBody className="items-center justify-center">
                        <WaterPipe className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">ตรวจสอบค่าน้ำ</span>
                    </CardBody>
                </Card>

                <Card isPressable className="bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/record")} >
                    <CardBody className="items-center justify-center">
                        <IconWrite className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">บันทึกมาตรน้ำ</span>
                    </CardBody>
                </Card>

                <Card isPressable className="bg-secondary-300 items-center justify-center" onClick={()=>navigate("/home/payment")} >
                    <CardBody className="items-center justify-center">
                        <IconBahtSign className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">รับชำระเงิน</span>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

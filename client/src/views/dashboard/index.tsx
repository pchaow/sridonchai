import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import {WaterPipe, IconWrite, IconBahtSign} from "../../icons";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";

export default function Dashboard() {

    const {user}  = useAuthProvider()

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="flex mb-6 text-xl font-bold text-white">ยินดีต้อนรับ {user}</div>
            <div className="grid  gap-3 grid-cols-3 items-center justify-center">
                <Card className="bg-secondary-300 items-center justify-center">
                    <CardBody className="items-center justify-center">
                        <WaterPipe className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">ตรวจสอบค่าน้ำ</span>
                    </CardBody>
                </Card>

                <Card className="bg-secondary-300 items-center justify-center">
                    <CardBody className="items-center justify-center">
                        <IconWrite className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">บันทึกมาตรน้ำ</span>
                    </CardBody>
                </Card>

                <Card className="bg-secondary-300 items-center justify-center">
                    <CardBody className="items-center justify-center">
                        <IconBahtSign className="w-16 h-16 text-success" />
                        <span className="text-center text-xs font-bold">รับชำระเงิน</span>
                    </CardBody>
                </Card>

            </div>
        </div>
    )
}

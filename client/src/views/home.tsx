import {Button, Card, CardBody, CardHeader, Input, Skeleton} from "@nextui-org/react";
import {useAuthProvider} from "../providers/AuthProvider.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Home() {

    const {getAuth, loading, user,checkLogin} = useAuthProvider()
    const navigate = useNavigate()
    const handleLoginFormSubmit = async (e: { preventDefault: () => void; }) => {
        getAuth()
    }
    const renderLoginButton = () => {
        if (user) {
            return (
                <Button className="w-full" color="primary" onClick={()=>navigate('/home')} disabled={loading}>
                    ยินดีต้อนรับ {user} เข้าสู่ระบบ
                </Button>)
        } else {
            return (<Button className="w-full" color="primary" onClick={handleLoginFormSubmit} disabled={loading}>
                    เข้าสู่ระบบ
                </Button>
            )
        }
    }

    return (
        <div className="flex min-h-screen justify-center items-center">
            <Card className="w-3/4 min-w-[300px]">
                <CardHeader>
                    <div className="flex flex-col">
                        <p className="text-md">ระบบน้ำประปาหมู่บ้าน</p>
                        <p className="text-small text-default-500">บ้านศรีดอนชัย</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="w-full">
                        {
                            renderLoginButton()
                        }
                    </div>
                </CardBody>
            </Card>
        </div>

    )

}

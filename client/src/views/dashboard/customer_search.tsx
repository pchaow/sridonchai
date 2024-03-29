import {useEffect, useState} from "react";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";
import {AxiosInstance} from "axios";
import {Button, Chip, Card, CardBody, CardHeader, Input, Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";
import {IoArrowBack} from "react-icons/io5";
import {FaSearch} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useAppProvider} from "../../providers/AppProvider.tsx";

export default function CustomerSearch() {

    const [keyword, setKeyword] = useState()

    const {getSecureClient} = useAuthProvider()
    const client: AxiosInstance = getSecureClient()
    const [customers, setCustomers] = useState([])
    const [filter_customers, setFilterCustomers] = useState([])
    const {showLoading, closeLoading} = useAppProvider()
    const load_customers = async () => {
        showLoading()
        let data = await client.get("/api/method/sridonchai.sridonchai.doctype.customer.customer.search", {
            params: {
                fields: ['name', 'firstname', 'lastname'],
                limit_page_length: 0
            }
        }).then(r => r.data.message ?? [])
        closeLoading()
        console.log(data)
        setCustomers(data)
        setFilterCustomers(data)
    }

    useEffect(() => {
        load_customers()
    }, []);

    useEffect(() => {

        if (keyword) {
            setFilterCustomers(customers.filter((x: any) => `${x.name} ${x.firstname} ${x.lastname} ${x.meter_address}`.includes(keyword)))
        } else {
            setFilterCustomers(customers)
        }

    }, [keyword])

    const handleKeyword = (e: any) => {
        setKeyword(e.target.value)
    }

    const navigate = useNavigate()

    const customer_card = (customer: any) => {
        return (
            <Card className="m-3 background-primary" isPressable key={customer.name} onClick={() => {
                navigate(`/home/customer/${customer.name}/view/`)
            }}>
                <CardBody>
                    <p className="font-bold">หมายเลขผู้ใช้น้ำ : {customer.name}</p>
                    <p className="font-bold">{customer.firstname} {customer.lastname}</p>
                    <p>ที่อยู่ : {customer.meter_address}</p>
                    <div className="flex justify-between">
                        <p>ยอดค้างชำระ : {customer.total ?? '-'} บาท</p>
                        <Chip
                            color={
                                customer.curinv_status ?
                                    customer.curinv_status == 'Paid' ?
                                        "success" : "primary"
                                    :
                                    "danger"
                            }
                        >{customer.curinv_status ? customer.curinv_status == "Paid" ? 'ชำระเงินแล้ว' : 'ยังไม่ได้ชำระเงิน' : 'ยังไม่ได้ดำเนินการ'}</Chip>
                    </div>


                </CardBody>
            </Card>
        )
    }

    return (
        <div className="flex flex-col">
            <Navbar className="" maxWidth="full">

                <NavbarContent className="m-0 p-0 gap-1">
                    <NavbarItem className="gap-1">
                        <Button isIconOnly variant="light" onClick={() => navigate("/home")}>
                            <IoArrowBack className="w-6 h-6"/>
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="w-full">
                        <Input type="text" placeholder="ค้นหา" value={keyword} startContent={<FaSearch/>}
                               onChange={handleKeyword}></Input>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-3">
                {filter_customers.map(x => customer_card(x))}
            </div>
        </div>
    )
}

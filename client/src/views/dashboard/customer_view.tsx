import {useEffect, useState} from "react";
import {useAuthProvider} from "../../providers/AuthProvider.tsx";
import {AxiosInstance} from "axios";
import {
    Chip,
    Button,
    Card,
    CardBody,
    Tabs,
    Tab,
    Navbar,
    NavbarContent,
    NavbarItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@nextui-org/react";
import {IoArrowBack} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {FaPen, FaMoneyBill,FaReceipt} from "react-icons/fa6";


export default function CustomerView() {

    const navigate = useNavigate()
    const params = useParams()
    const customerName = params.customer
    const {getSecureClient} = useAuthProvider()
    const client: AxiosInstance = getSecureClient()

    const [customer, setCustomer] = useState()
    const [invoices, setInvoices] = useState([])

    const load_customers = async () => {
        let customer_response = await client.post("/api/method/sridonchai.sridonchai.doctype.customer.customer.load_customer", {
            ...params
        }).then(r => r.data)
        console.log(customer_response)
        setCustomer(customer_response.message.customer)
        setInvoices(customer_response.message.invoices)

    }

    useEffect(() => {

        load_customers()


    }, [])

    const customer_card = (customer: any) => {
        if (customer) {
            return (
                <Card className="m-0 background-primary" isPressable key={customer.name}>
                    <CardBody>
                        <p className="font-bold">หมายเลขผู้ใช้น้ำ : {customer.name}</p>
                        <p className="font-bold">{customer.firstname} {customer.lastname}</p>
                        <p>ที่อยู่ : {customer.meter_address}</p>
                    </CardBody>
                </Card>
            )
        } else {
            return (<div></div>)
        }
    }

    const showInvoice = (invoice: any) => {
        if (invoice.type == "ค่าน้ำ") {
            return (
                <TableRow key={invoice.name}>
                    <TableCell>{invoice.month}</TableCell>
                    <TableCell>{invoice.total_unit}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                    <TableCell>
                        {invoice.status == 'Paid' ?
                            (<Chip color="success">{invoice.status}</Chip>)
                            : (<Chip color="default">{invoice.status}</Chip>)
                        }
                    </TableCell>
                </TableRow>
            )
        } else {
            return (
                <TableRow key={invoice.name}>
                    <TableCell>{invoice.month}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                    <TableCell>
                        {invoice.status == 'Paid' ?
                            (<Chip color="success">{invoice.status}</Chip>)
                            : (<Chip color="default">{invoice.status}</Chip>)
                        }
                    </TableCell>
                </TableRow>
            )
        }
    }

    return (
        <div className="flex flex-col">
            <Navbar className="" maxWidth="full">
                <NavbarContent className="m-0 p-0 gap-1">
                    <NavbarItem className="gap-1">
                        <Button isIconOnly variant="light" onClick={() => navigate("/home/search")}>
                            <IoArrowBack className="w-6 h-6"/>
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="gap-1">
                        <p>ข้อมูลผู้ใช้น้ำ {customerName}</p>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-6 my-0 gap-3">
                {customer_card(customer)}
                <Tabs aria-label="Options" classNames={{"tabList": "m-0"}} fullWidth size="md">
                    <Tab key="water_usage" title="ค่าน้ำประปา" className="m-0 p-0">
                        <Card>
                            <CardBody className="p-0 m-0">
                                <Table className="p-0 m-0" classNames={{'wrapper': 'min-h-60'}}
                                       aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>เดือน</TableColumn>
                                        <TableColumn>จำนวนหน่วย</TableColumn>
                                        <TableColumn>รวม</TableColumn>
                                        <TableColumn>สถานะ</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"No rows to display."}>
                                        {invoices.filter((x: any) => x.type == "ค่าน้ำ").map(x => showInvoice(x))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="maintenance_fee" title="ค่าบำรุงมิเตอร์" className="m-0 p-0">
                        <Card>
                            <CardBody className="p-0 m-0">
                                <Table className="p-0 m-0" classNames={{'wrapper': 'min-h-60'}}
                                       aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>เดือน</TableColumn>
                                        <TableColumn>รวม</TableColumn>
                                        <TableColumn>สถานะ</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent={"No rows to display."}>
                                        {invoices.filter(x => x.type == "ค่าบำรุงมิเตอร์").map(x => showInvoice(x))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>

                <Button color="success" startContent={<FaPen/>} onClick={() => {
                    navigate(`/home/customer/${customerName}/record`)
                }}>
                    บันทึกมาตรน้ำ
                </Button>

                <Button color="secondary" startContent={<FaMoneyBill/>} onClick={() => {
                    navigate(`/home/customer/${customerName}/payment`)
                }}>
                    ชำระเงิน
                </Button>

                <Button color="default" startContent={<FaReceipt/>} onClick={() => {
                    navigate(`/home/customer/${customerName}/receipt`)
                }}>
                    ใบเสร็จรับเงิน
                </Button>
            </div>
        </div>
    )
}

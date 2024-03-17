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
    TableRow,
    TableCell,
    Select, SelectItem
} from "@nextui-org/react";
import {IoArrowBack} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {FaPen, FaMoneyBill} from "react-icons/fa6";
import _ from 'underscore';

export default function CustomerRecord() {

    const navigate = useNavigate()
    const params = useParams()
    const customerName = params.customer
    const {getSecureClient} = useAuthProvider()
    const client: AxiosInstance = getSecureClient()

    const [customer, setCustomer] = useState()
    const [months, setMonths] = useState([])

    const [recordForm,setRecordForm] = useState({month : new Set([])})

    const load_customers = async () => {
        let customer_response = await client.post("/api/method/sridonchai.sridonchai.doctype.customer.customer.load_customer", {
            ...params
        }).then(r => r.data)
        console.log(customer_response)
        setCustomer(customer_response.message.customer)
    }

    const load_months = async () => {
        let response = await client.get("/api/resource/Month", {
            params : {
                fields : `["month","year","name"]`,
                order_by : "year desc,month desc",
                limit_page_length : 24
            }
        }).then(r => r.data)
        console.log('load_months ',response.data)

        let data = _.sortBy(response.data,(x)=> {
            return (parseInt(x.year) * 100 + parseInt(x.month))*-1
        })
         setRecordForm({
            ...recordForm,
            'month' : new Set([data[0].name])
        })
        setMonths(data)

    }

    useEffect(() => {
        load_customers()
        load_months()
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

    const load_lastinvoice = async (month) => {

        let payload = {
            'month' : month,
            'customer' : customerName,
            'type' : "ค่าน้ำ"
        }

        let res = await client.post("/api/method/sridonchai.sridonchai.doctype.invoice.invoice.get_record_invoice_data",payload,{
            headers : {
              "Content-Type" : "application/x-www-form-urlencoded"
            }
        }).then(r=>r.data)
        console.log(res)


    }

    const handleRecordForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e)
        setRecordForm({
            ...recordForm,
            [e.target.name] : e.target.name != 'month' ?  e.target.value : new Set([e.target.value])
        })

        if(e.target.name == 'month'){
            load_lastinvoice(e.target.value)
        }
    }

    return (
        <div className="flex flex-col">
            <Navbar className="" maxWidth="full">
                <NavbarContent className="m-0 p-0 gap-1">
                    <NavbarItem className="gap-1">
                        <Button isIconOnly variant="light"
                                onClick={() => navigate(`/home/customer/${customerName}/view`)}>
                            <IoArrowBack className="w-6 h-6"/>
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="gap-1">
                        <p>บันทักมาตรน้ำ {customerName}</p>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-6 my-0 gap-3">
                {customer_card(customer)}

                <Select label="เดือน" name="month" className="max-w-xs" selectedKeys={recordForm.month}  onChange={handleRecordForm}>
                    {months.map((m) => (
                        <SelectItem key={m.name} value={m.name}  textValue={m.name}>
                            {m.name}
                        </SelectItem>
                    ))}
                </Select>


                <Button color="success" startContent={<FaPen/>} onClick={() => {
                    navigate(`/home/customer/${customerName}/record`)
                }}>
                    บันทึกมาตรน้ำ
                </Button>

                <Button color="secondary" startContent={<FaMoneyBill/>}>
                    ชำระเงิน
                </Button>
            </div>
        </div>
    )
}

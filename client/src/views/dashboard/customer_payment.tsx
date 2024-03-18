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
    Table, TableBody,
    TableHeader,
    TableColumn,
    TableRow,
    TableCell,
    Input,
    Select, SelectItem,
    Checkbox
} from "@nextui-org/react";
import {IoArrowBack} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {FaPen, FaMoneyBill} from "react-icons/fa6";
import _ from 'underscore';

export default function CustomerPayment() {

    const navigate = useNavigate()
    const params = useParams()
    const customerName = params.customer
    const {getSecureClient} = useAuthProvider()
    const client: AxiosInstance = getSecureClient()
    const [error, setError] = useState({})
    const [customer, setCustomer] = useState()
    const [invoices, setInvoices] = useState([])
    const [config, setConfig] = useState()
    const [selectedColor, setSelectedColor] = useState("default");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]))


    const load_customers = async () => {
        let customer_response = await client.post("/api/method/sridonchai.sridonchai.doctype.customer.customer.load_customer", {
            ...params
        }).then(r => r.data)
        console.log(customer_response)
        setCustomer(customer_response.message.customer)
    }

    const load_unpaid_invoice = async () => {
        let {message} = await client.post("/api/method/sridonchai.sridonchai.doctype.invoice.invoice.load_unpiad_invoice", {
            customer: customerName
        }).then(r => r.data)
        setInvoices(message)
        console.log(message)

    }

    useEffect(() => {
        load_customers()
        load_unpaid_invoice()
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
        return (
            <TableRow key={invoice.name}>
                <TableCell>{invoice.month}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.total}</TableCell>

            </TableRow>
        )
    }

    const [total, setTotal] = useState()

    useEffect(() => {
        let selInvoice = []
        if (selectedKeys == "all") {
            selInvoice = invoices
        } else {
            let invs = Array.from(selectedKeys)
            selInvoice = invoices.filter(x => invs.find(y=> y == x.name))
        }

        if( selInvoice.length == 0){
            setTotal(0.00)
        }else {
            setTotal(selInvoice.reduce((a,b)=> a+b.total,0))
        }

    }, [selectedKeys]);

    const save = async () => {
        if (confirm("ยืนยันการชำระเงิน")) {
            let keys = []
            if (selectedKeys == "all") {
                keys = invoices.map(x => x.name)
            } else {
                keys = Array.from(selectedKeys)
            }

            console.log(keys)
            let {message} = await client.post('/api/method/sridonchai.sridonchai.doctype.receipt.receipt.create_receipt', {
                invoices: keys,
                customer: customerName

            }).then(r => r.data)
            console.log(message)
            load_unpaid_invoice()
            setSelectedKeys(new Set([]))
        }

    }

    const handleSelect = async (e) => {
        setSelectedKeys(e)
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
                        <p>ชำระเงิน {customerName}</p>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-6 my-0 gap-3 mb-3">
                {customer_card(customer)}
                <Table
                    color={selectedColor}
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelect}
                    aria-label="Example static collection table"
                    bottomContent={(
                        <div>
                            รวม : {total}
                        </div>
                    )}
                >
                    <TableHeader>
                        <TableColumn>Month</TableColumn>
                        <TableColumn>Type</TableColumn>
                        <TableColumn>Total</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {invoices.map(x => showInvoice(x))}
                    </TableBody>
                </Table>

                <Button color="secondary" startContent={<FaMoneyBill/>} onClick={save}>
                    ชำระเงิน
                </Button>
            </div>
        </div>
    )
}

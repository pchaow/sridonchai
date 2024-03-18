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
    Checkbox,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, useDisclosure

} from "@nextui-org/react";
import {IoArrowBack} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {FaPen, FaMoneyBill} from "react-icons/fa6";
import _ from 'underscore';
import {useAppProvider} from "../../providers/AppProvider.tsx";

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

    const {showLoading, closeLoading} = useAppProvider()

    const load_customers = async () => {
        showLoading()
        let customer_response = await client.post("/api/method/sridonchai.sridonchai.doctype.customer.customer.load_customer", {
            ...params
        }).then(r => r.data)
        closeLoading()
        console.log(customer_response)
        setCustomer(customer_response.message.customer)
    }

    const load_customer_receipt = async () => {
        showLoading()
        let {message} = await client.post("/api/method/sridonchai.sridonchai.doctype.receipt.receipt.load_customer_receipt", {
            customer: customerName
        }).then(r => r.data)
        setInvoices(message)
        console.log(message)
        closeLoading()

    }

    useEffect(() => {
        load_customers()
        load_customer_receipt()
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

    const [showReceiptData, setShowReceiptData] = useState()

    const showReceiptModal = async (receipt) => {
        showLoading()
        let {message} = await client.post("/api/method/sridonchai.sridonchai.doctype.receipt.receipt.load_receipt", {
            receipt: receipt.name
        }).then(r => {
            let {message} = r.data
            closeLoading()
            setShowReceiptData(message)

            onOpen()
        }).catch(err => closeLoading())
    }

    const showReceipt = (receipt: any) => {
        return (
            <TableRow key={receipt.name} onClick={() => {
                showReceiptModal(receipt)
            }}>
                <TableCell className="text-xs">{receipt.name}</TableCell>
                <TableCell className="text-sm">{receipt.date_received}</TableCell>
                <TableCell className="text-sm">{receipt.total}</TableCell>
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
            selInvoice = invoices.filter(x => invs.find(y => y == x.name))
        }

        if (selInvoice.length == 0) {
            setTotal(0.00)
        } else {
            setTotal(selInvoice.reduce((a, b) => a + b.total, 0))
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

            showLoading()
            console.log(keys)
            let {message} = await client.post('/api/method/sridonchai.sridonchai.doctype.receipt.receipt.create_receipt', {
                invoices: keys,
                customer: customerName

            }).then(r => r.data)
            console.log(message)
            closeLoading()
        }

    }

    const handleSelect = async (e) => {
        setSelectedKeys(e)
    }
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
                        <p>ใบเสร็จรับเงิน {customerName}</p>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <Modal

                isOpen={isOpen}
                placement="center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{showReceiptData.name}</ModalHeader>
                            <ModalBody>
                                <p>วันที่ : {showReceiptData.date_received}</p>
                                <p>ผู้รับเงิน : {showReceiptData.payee}</p>
                                <p>ผู้จ่ายเงิน : {showReceiptData.payor}</p>

                                <p>รายละเอียด</p>
                                <Table bottomContent={
                                    <p>รวม : {showReceiptData.total} </p>
                                } radius="none" shadow="none" fullWidth="true"
                                       classNames={{"wrapper": "p-0", "table": "p-0"}}>
                                    <TableHeader>
                                        <TableColumn>เลขที่</TableColumn>
                                        <TableColumn>ประเภท</TableColumn>
                                        <TableColumn>งวดเดือน</TableColumn>
                                        <TableColumn>รวม</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {showReceiptData.invoices.map(inv => (
                                            <TableRow key={inv.invoice}>
                                                <TableCell>{inv.invoice}</TableCell>
                                                <TableCell>{inv.invoice_type}</TableCell>
                                                <TableCell>{inv.month}</TableCell>
                                                <TableCell>{inv.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>


                            </ModalBody>
                            <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                    ปิด
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="flex flex-col mx-6 my-0 gap-3 mb-3">
                {customer_card(customer)}
                <Table
                    aria-label="ตารางใบเสร็จรับเงิน"
                >
                    <TableHeader>
                        <TableColumn>เลขที่</TableColumn>
                        <TableColumn>วันที่ใบเสร็จ</TableColumn>
                        <TableColumn>ยอดรวม</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {invoices.map(x => showReceipt(x))}
                    </TableBody>
                </Table>

            </div>
        </div>
    )
}

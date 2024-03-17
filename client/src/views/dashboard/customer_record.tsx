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
    Input,
    Select, SelectItem,
    Checkbox
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
    const [months, setMonths] = useState([] as { name: string, month: stirng, year: string }[])

    const [recordForm, setRecordForm] = useState({
        month: new Set([]),
        normal: true,
        customer: customerName,
        type: 'ค่าน้ำ',
        previous_meter_read: 0,
        current_meter_read: 0,
        total_unit: 0,
        unit_price: 0,
        total: 0,
        status: 'Draft',
    })

    const load_customers = async () => {
        let customer_response = await client.post("/api/method/sridonchai.sridonchai.doctype.customer.customer.load_customer", {
            ...params
        }).then(r => r.data)
        console.log(customer_response)
        setCustomer(customer_response.message.customer)
    }

    const load_months = async () => {
        let response = await client.get("/api/resource/Month", {
            params: {
                fields: `["month","year","name"]`,
                order_by: "year desc,month desc",
                limit_page_length: 24
            }
        }).then(r => r.data)
        console.log('load_months ', response.data)

        let data = _.sortBy(response.data, (x) => {
            return (parseInt(x.year) * 100 + parseInt(x.month)) * -1
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

    const load_lastinvoice = async (month: string) => {

        if (month) {
            let payload = {
                'month': month,
                'customer': customerName,
                'type': "ค่าน้ำ"
            }

            let res = await client.post("/api/method/sridonchai.sridonchai.doctype.invoice.invoice.get_record_invoice_data", payload, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(r => r.data)


            if (res.message.current_invoice) {
                let updateRecordForm = {
                    ...recordForm,
                    ...res.message.current_invoice
                }

                updateRecordForm.normal = updateRecordForm.normal == 'true' || updateRecordForm.normal == 1
                updateRecordForm.month = new Set([updateRecordForm.month])

                console.log(updateRecordForm)
                setRecordForm(updateRecordForm)
            } else {
                let updateRecordForm = {
                    normal: 'true',
                    month: month,
                    status: 'Draft',

                }

                updateRecordForm.normal = updateRecordForm.normal == 'true' || updateRecordForm.normal == 1
                updateRecordForm.month = new Set([updateRecordForm.month])

                if (res.message.prev_invoice) {
                    updateRecordForm.previous_meter_read = res.message.prev_invoice.current_meter_read
                }

                console.log(updateRecordForm)
                setRecordForm(updateRecordForm)
            }
        }else {
            setRecordForm({
                month : new Set([])
            })
        }


    }

    const handleRecordForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e)
        setRecordForm({
            ...recordForm,
            [e.target.name]: e.target.name != 'month' ? e.target.value : new Set([e.target.value])
        })

        if (e.target.name == 'month') {
            load_lastinvoice(e.target.value)
        }

        console.log(recordForm)
    }

    const handleCheck = (e: any) => {
        console.log(e)
        setRecordForm({
            ...recordForm,
            normal: e.target.checked

        })

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
                        <p>บันทึกมาตรน้ำ {customerName}</p>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-6 my-0 gap-3">
                {customer_card(customer)}

                <Select label="เดือน" name="month" className="max-w-xs" selectedKeys={recordForm.month}
                        onChange={handleRecordForm}>
                    {months.map((m) => (
                        <SelectItem key={m.name} value={m.name} textValue={m.name}>
                            {m.name}
                        </SelectItem>
                    ))}
                </Select>

                {
                    recordForm.month.size ? (
                        <div>
                            <Card>
                                <CardBody>
                                    <form className="flex flex-col gap-3">
                                        <Checkbox isSelected={recordForm.normal} value={true} name="normal"
                                                  isDisabled={recordForm.status != 'Draft'}
                                                  onChange={handleCheck}>ปกติ</Checkbox>
                                        <Input name="previous_meter_read" type="number" label='เลขมิเตอร์เดือนก่อน'
                                               readOnly={recordForm.status != 'Draft'}
                                               value={recordForm.previous_meter_read}
                                               onChange={handleRecordForm}/>
                                        <Input name="current_meter_read" type="number" label='เลขมิเตอร์เดือนปัจจุบัน'
                                               readOnly={recordForm.status != 'Draft'}
                                               value={recordForm.current_meter_read}
                                               onChange={handleRecordForm}/>
                                        <Input name="total_unit" type="number"
                                               value={recordForm.total_unit}
                                               readOnly={recordForm.status != 'Draft' || (recordForm.status == 'Draft' && !recordForm.normal)}
                                               label='จำนวนหน่วย' onChange={handleRecordForm}/>
                                        <Input name="unit_price" type="number" label='หน่วยละ'
                                               value={recordForm.unit_price}
                                               readOnly={recordForm.status != 'Draft' || (recordForm.status == 'Draft' && !recordForm.normal)}
                                               onChange={handleRecordForm}/>
                                        <Input name="total" type="number" label='รวม'
                                               value={recordForm.total}
                                               readOnly={recordForm.status != 'Draft' || (recordForm.status == 'Draft' && !recordForm.normal)}
                                               onChange={handleRecordForm}/>
                                    </form>
                                </CardBody>
                            </Card>
                            <Button color="success" startContent={<FaPen/>} onClick={() => {
                                navigate(`/home/customer/${customerName}/record`)
                            }}>
                                บันทึกมาตรน้ำ
                            </Button>

                            <Button color="secondary" startContent={<FaMoneyBill/>}>
                                ชำระเงิน
                            </Button>
                        </div>
                    ) : (<span></span>)
                }


            </div>
        </div>
    )
}

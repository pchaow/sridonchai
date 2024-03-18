import {
    Card, CardFooter, Chip,
    CardHeader,
    CardBody,
    Button,
    Input,
    Navbar,
    NavbarContent,
    NavbarItem, CircularProgress,
    Select,
    SelectItem
} from "@nextui-org/react";
import { IoArrowBack } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppProvider } from "../../providers/AppProvider.tsx";
import { useAuthProvider } from "../../providers/AuthProvider.tsx";
import _ from "underscore";
import { useEffect, useState } from "react";

export default function ManagerReport() {

    const navigate = useNavigate()
    const { showLoading, closeLoading } = useAppProvider()
    const { getSecureClient } = useAuthProvider()
    const client = getSecureClient()

    useEffect(() => {
        load_months().then(() => {
        })
    }, [])

    const [months, setMonths] = useState([])
    const [month, _setMonth] = useState()
    const [report, setReport] = useState([])

    const load_report = async (month) => {
        showLoading()
        let { message } = await client.post("/api/method/sridonchai.sridonchai.doctype.customermanager.customermanager.load_report", {
            'month': month
        }).then(r => r.data).catch(err => {
            closeLoading()
        })
        closeLoading()
        console.log(message)
        setReport(message)
    }

    useEffect(()=>{
        load_report(month)
    },[month])

    const setMonth = (keys: React.Key[]) => {
        _setMonth(keys)
    }
    const load_months = async () => {
        showLoading()
        let response = await client.get("/api/resource/Month", {
            params: {
                fields: `["month","year","name"]`,
                order_by: "year desc,month desc",
                limit_page_length: 24
            }
        }).then(r => r.data).catch(err => {
            closeLoading()
        })
        closeLoading()
        console.log('load_months ', response.data)

        let data = _.sortBy(response.data, (x) => {
            return (parseInt(x.year) * 100 + parseInt(x.month)) * -1
        })
        setMonths(data)
        setMonth(new Set([data[0].name]))
        closeLoading()

    }
    return (
        <div className="flex flex-col">
            <Navbar className="" maxWidth="full">

                <NavbarContent className="m-0 p-0 gap-1">
                    <NavbarItem className="gap-1">
                        <Button isIconOnly variant="light" onClick={() => navigate("/home")}>
                            <IoArrowBack className="w-6 h-6" />
                        </Button>
                    </NavbarItem>
                    <NavbarItem className="">
                        ผลการดำเนินการ
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col mx-6 my-0 gap-3 mb-3">

                <Select label="เดือน" name="month" className="w-full" selectedKeys={month}
                    onSelectionChange={setMonth}>
                    {months.map((m) => (
                        <SelectItem key={m.name} value={m.name} textValue={m.name}>
                            {m.name}
                        </SelectItem>
                    ))}
                </Select>

                {
                    report.map(x => (
                        <Card>
                            <CardBody className="justify-center items-center">
                                <p className="text-xl">{x.manager.firstname} {x.manager.lastname}</p>

                                <div className="flex flex-row gap-4">
                                    <Card
                                        className="w-[1/4] border-none shadow-none">
                                        <CardBody className="justify-center items-center pb-0">
                                            <p className="mb-1">จดมิเตอร์แล้ว</p>
                                            <CircularProgress
                                                classNames={{
                                                    svg: "w-16 h-16 drop-shadow-md",
                                                    indicator: "stroke-secondary",
                                                    track: "stroke-secondary/10",
                                                    value: "text-1xl font-semibold text-secondary",
                                                }}
                                                color="secondary"
                                                value={x.report.metered}
                                                minValue={0}
                                                maxValue={x.report.total}
                                                strokeWidth={4}
                                                showValueLabel={true}
                                            />
                                        </CardBody>
                                        <CardFooter className="justify-center items-center pt-0">
                                            <Chip
                                                classNames={{
                                                    base: "border-1 border-white/30 mt-1",
                                                    content: "text-white/90 text-small font-semibold",
                                                }}
                                                variant="bordered"
                                            >
                                                {x.report.metered} / {x.report.total}
                                            </Chip>
                                        </CardFooter>
                                    </Card>

                                    <Card
                                        className="w-[1/4] border-none shadow-none">
                                        <CardBody className="justify-center items-center pb-0">

                                            <p className="mb-1">ชำระเงินแล้ว</p>


                                            <CircularProgress
                                                classNames={{
                                                    svg: "w-16 h-16 drop-shadow-md",
                                                    indicator: "stroke-success",
                                                    track: "stroke-success/10",
                                                    value: "text-1xl font-semibold text-success",
                                                }}
                                                value={x.report.paid}
                                                minValue={0}
                                                maxValue={x.report.total}
                                                strokeWidth={4}
                                                showValueLabel={true}
                                            />
                                        </CardBody>
                                        <CardFooter className="justify-center items-center pt-0">
                                            <Chip
                                                classNames={{
                                                    base: "border-1 border-white/30 mt-1",
                                                    content: "text-white/90 text-small font-semibold",
                                                }}
                                                variant="bordered"
                                            >
                                                {x.report.paid} / {x.report.total}
                                            </Chip>
                                        </CardFooter>
                                    </Card>




                                </div>

                            </CardBody>
                        </Card>
                    ))
                }
            </div>

        </div>
    )
}

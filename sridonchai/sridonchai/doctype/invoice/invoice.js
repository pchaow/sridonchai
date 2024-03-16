// Copyright (c) 2024, chaow porkaew and contributors
// For license information, please see license.txt

function update_type_fields(frm) {

	if (frm.doc.type == "ค่าน้ำ") {
		frm.doc.unit_price = frm.config.unit_price
		frm.refresh_fields()
	} else if (frm.doc.type == "ค่าบำรุงมิเตอร์") {
		frm.doc.total = frm.config.maintenance_fee
		frm.refresh_fields()

	}
}

async function update_previous_meter_read(frm) {
	let is_water_bill = frm.doc.type == "ค่าน้ำ"
	let has_month = frm.doc.month != null && frm.doc.month != ''
	let has_customer = frm.doc.customer != null && frm.doc.customer != ''

	if (is_water_bill && has_month && has_customer) {
		console.log('load previous data')
		// load lastest month
		let response = await frappe.call('sridonchai.sridonchai.doctype.invoice.invoice.get_last_invoice', {
			'month': frm.doc.month,
			'customer': frm.doc.customer,
			'type': frm.doc.type
		})

		if (response['message']) {
			let last_invoice = response['message']
			frm.set_value('previous_meter_read', last_invoice['current_meter_read'])
		}
	} else {

	}
}

async function update_total_unit(frm) {

	let current_meter_read = frm.doc.current_meter_read
	let previous_meter_read = frm.doc.previous_meter_read

	let validate = [
		current_meter_read != null && current_meter_read != '',
		previous_meter_read != null && previous_meter_read != '',
	]

	if (validate.every(x => x)) {

		current_meter_read = parseFloat(current_meter_read)
		previous_meter_read = parseFloat(previous_meter_read)

		frm.set_value("total_unit",current_meter_read - previous_meter_read)
	}
}

async function update_total(frm){
	let total_unit = frm.doc.total_unit
	let unit_price = frm.doc.unit_price

	let validate = [
		total_unit != null && total_unit != '',
		unit_price != null && unit_price != '',
	]

	if(validate.every(x=>x)){
		total_unit = parseFloat(total_unit)
		unit_price = parseFloat(unit_price)

		frm.set_value('total', total_unit * unit_price)
	}

}

frappe.ui.form.on("Invoice", {
	async refresh(frm) {
		console.log(frm)

		let config = await frappe.db.get_doc('WaterBillConfig')
		frm.config = config

		if (frm.is_new()) {
			update_type_fields(frm)
		}

	},
	type(frm) {
		console.log(frm)
		update_type_fields(frm)
	},

	month(frm) {
		update_previous_meter_read(frm)
	},
	customer(frm) {
		update_previous_meter_read(frm)
	},

	current_meter_read(frm) {
		update_total_unit(frm)
	},
	previous_meter_read(frm) {
		update_total_unit(frm)
	},
	total_unit(frm) {
		update_total(frm)
	},
	unit_price(frm) {
		update_total(frm)
	},


});

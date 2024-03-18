# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe.model.naming import getseries
from sridonchai.sridonchai.doctype.month.month import Month


class Invoice(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amended_from: DF.Link | None
		current_meter_read: DF.Data | None
		customer: DF.Link
		month: DF.Link
		normal: DF.Check
		previous_meter_read: DF.Data | None
		status: DF.Literal["Draft", "Submitted", "Paid", "Cancelled"]
		total: DF.Currency
		total_unit: DF.Data | None
		type: DF.Literal[
			"\u0e04\u0e48\u0e32\u0e19\u0e49\u0e33", "\u0e04\u0e48\u0e32\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e21\u0e34\u0e40\u0e15\u0e2d\u0e23\u0e4c"]
		unit_price: DF.Data | None

	# end: auto-generated types

	def autoname(self):
		prefix = "WATER-INV"
		if self.type == "\u0e04\u0e48\u0e32\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e21\u0e34\u0e40\u0e15\u0e2d\u0e23\u0e4c":
			prefix = "METER-INV"

		number = getseries(prefix, 6)
		self.name = f"{prefix}-{number}"
		return self.name

	pass


@frappe.whitelist()
def get_last_invoice():
	month = frappe.form_dict['month'] if 'month' in frappe.form_dict else None
	customer = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None
	invoice_type = frappe.form_dict['type'] if 'type' in frappe.form_dict else None

	assert month != None and month != ''
	assert customer != None and customer != ''
	assert invoice_type != None and invoice_type != ''

	month_doc: Month = frappe.get_doc("Month", month)
	prv_month = month_doc.get_prev_month()

	list = frappe.get_list("Invoice", fields="*", filters={
		'month': prv_month.name,
		'customer': customer,
		'type': invoice_type
	})

	last_invoice_doc = list[0] if len(list) > 0 else None

	return last_invoice_doc


@frappe.whitelist()
def get_record_invoice_data():
	month = frappe.form_dict['month'] if 'month' in frappe.form_dict else None
	customer = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None
	invoice_type = frappe.form_dict['type'] if 'type' in frappe.form_dict else None

	assert month != None and month != ''
	assert customer != None and customer != ''
	assert invoice_type != None and invoice_type != ''

	month_doc: Month = frappe.get_doc("Month", month)

	prv_month = month_doc.get_prev_month()

	invoice = frappe.qb.DocType("Invoice")
	if prv_month:
		list = frappe.get_list("Invoice", fields="*", filters={
			'month': prv_month.name,
			'customer': customer,
			'type': invoice_type
		})

		# list = (frappe.qb.select(invoice.name,invoice.type)
		# 	.from_(invoice)
		# 	.where( (invoice.month == prv_month.name) & (invoice.customer == customer) & (invoice.type == invoice_type))).run(as_dict=True)

		last_invoice_doc = list[0] if len(list) > 0 else None
	else:
		last_invoice_doc = None

	current_list = frappe.get_list("Invoice", fields="*", filters={
		'month': month,
		'customer': customer,
		'type': invoice_type
	})

	current_invoice = current_list[0] if len(current_list) > 0 else None

	return {
		'prev_invoice': last_invoice_doc,
		'current_invoice': current_invoice
	}


@frappe.whitelist()
def create_update_invoice():
	invoice = frappe.form_dict["invoice"] if "invoice" in frappe.form_dict else None

	assert invoice != None
	if 'name' not in invoice:
		newdoc = {
			"doctype": "Invoice",
		}
		newinv = frappe.new_doc("Invoice")
		newinv.status = "Submitted"
		newinv.customer = invoice['customer']
		newinv.month = invoice['month']
		newinv.previous_meter_read = invoice['previous_meter_read']
		newinv.previous_meter_read = invoice['previous_meter_read']
		newinv.current_meter_read = invoice['current_meter_read']
		newinv.total_unit = invoice['total_unit']
		newinv.unit_price = invoice['unit_price']
		newinv.total = invoice['total']
		newinv.normal = invoice['normal']

		newinv.insert()

		return {
			"invoice": newinv
		}

	else:

		updateinv = frappe.get_doc("Invoice", invoice['name'])
		updateinv.update(invoice)
		updateinv.status = invoice['status']
		updateinv.previous_meter_read = invoice['previous_meter_read']
		updateinv.current_meter_read = invoice['current_meter_read']
		updateinv.statutotal_unit = invoice['total_unit']
		updateinv.unit_price = invoice['unit_price']
		updateinv.total = invoice['total']
		updateinv.save()

		return {
			"invoice": updateinv
		}

	pass


@frappe.whitelist()
def load_unpiad_invoice():
	customer_name = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None

	assert customer_name != None or customer_name != ''

	invoicedoc = frappe.qb.DocType("Invoice")
	invoices = (
		frappe.qb.select(invoicedoc.name, invoicedoc.type, invoicedoc.status, invoicedoc.total,invoicedoc.month)
		.from_(invoicedoc)
		.where(invoicedoc.customer == customer_name)
		.where(
			(invoicedoc.status == "Submitted") | ((invoicedoc.status == "Draft"))
		)
	).run(as_dict=True)

	return invoices

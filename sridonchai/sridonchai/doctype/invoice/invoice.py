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
		type: DF.Literal["\u0e04\u0e48\u0e32\u0e19\u0e49\u0e33", "\u0e04\u0e48\u0e32\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e21\u0e34\u0e40\u0e15\u0e2d\u0e23\u0e4c"]
		unit_price: DF.Data | None
	# end: auto-generated types

	def autoname(self):
		prefix = "WATER-INV"
		if self.type == "\u0e04\u0e48\u0e32\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e21\u0e34\u0e40\u0e15\u0e2d\u0e23\u0e4c" :
			prefix = "METER-INV"

		number = getseries(prefix,6)
		self.name = f"{prefix}-{number}"
		return self.name


	pass


@frappe.whitelist()
def get_last_invoice():

	month = frappe.form_dict['month'] if 'month' in frappe.form_dict else None
	customer = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None
	invoice_type = frappe.form_dict['type'] if 'type' in frappe.form_dict else None

	assert month != None
	assert customer != None
	assert invoice_type != None

	month_doc : Month = frappe.get_doc("Month",month)
	prv_month = month_doc.get_prev_month()


	list = frappe.get_list("Invoice",fields="*",filters={
		'month' : prv_month.name,
		'customer' : customer,
		'type' : invoice_type
	})

	last_invoice_doc = list[0] if len(list) > 0 else None

	return last_invoice_doc

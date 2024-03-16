# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.naming import getseries

from sridonchai.sridonchai.doctype.customermanager.customermanager import CustomerManager


class Customer(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address: DF.SmallText | None
		customer_id: DF.Data | None
		firstname: DF.Data
		lastname: DF.Data | None
		meter_address: DF.SmallText | None
		personal_id: DF.Data | None
		phonenumber: DF.Data | None
		status: DF.Check

	# end: auto-generated types

	def before_insert(self):
		serire = getseries("CUSTOMER", 5)
		self.customer_id = f'CUS-{serire}'

	pass


@frappe.whitelist()
def search():
	req = frappe.form_dict
	fields = req['fields'] if 'fields' in req else "*"
	frappe.session.user = 'rewadee@sridonchai.chaowdev.xyz'
	if frappe.session.user == 'Administrator':

		customers = frappe.db.get_list("Customer", fields=fields)
		return customers

	else:

		customer: Customer = frappe.qb.DocType('Customer')
		manager: CustomerManager = frappe.qb.DocType('CustomerManager')
		manage = frappe.qb.DocType('CustomerManagerChild')
		invoice = frappe.qb.DocType("Invoice")

		sum_total = frappe.qb.functions('Sum',invoice.total).as_('total')

		query = frappe.qb.select(customer.name, customer.firstname, customer.lastname, customer.meter_address,sum_total)\
			.from_(manager)\
			.join(manage).on(manage.parent == manager.name)\
			.join(customer).on(manage.customer == customer.name)\
			.left_join(invoice).on((customer.name == invoice.customer) & (invoice.status == 'Draft'))\
			.groupby(customer.name)\
			.orderby(customer.name)\
			.where( (manager.name == frappe.session.user))


		result = (query).run(as_dict=True)

		return result

@frappe.whitelist()
def load_customer():

	customer_name = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None
	if(customer_name) :
		customer = frappe.get_doc("Customer",customer_name)
		invoices = frappe.db.get_list('Invoice',fields="*",filters={
			'customer' : customer_name
		},order_by="name desc")

		return {
			"customer" : customer,
			"invoices" : invoices
		}

	return 
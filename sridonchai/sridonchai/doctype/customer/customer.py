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

	import datetime
	now = datetime.datetime.now()
	month = now.month
	year = now.year

	monthcheck = f"{month:>02}-{year:>04}"

	customer: Customer = frappe.qb.DocType('Customer')
	manager: CustomerManager = frappe.qb.DocType('CustomerManager')
	manage = frappe.qb.DocType('CustomerManagerChild')
	invoice = frappe.qb.DocType("Invoice")

	if frappe.session.user == 'Administrator':

		result = frappe.db.sql("""
					select customer.name,
		       customer.firstname,
		       customer.lastname,
		       customer.meter_address,
		       sum(inv.total) as total,
		       curinv.status as curinv_status,
		       curinv.month as curinv_month

				from tabCustomerManager as manager
						 join tabCustomerManagerChild as chd on manager.name = chd.parent
						 join tabCustomer as customer on chd.customer = customer.name
						 left join tabInvoice as inv on inv.customer = chd.customer and inv.status in ('Draft', 'Submitted')
						 left join tabInvoice as curinv
								   on curinv.customer = chd.customer
									   and curinv.month = %(current_month)s
									   and curinv.status in ('Draft', 'Submitted', 'Paid')
				group by chd.customer
				""", {
			'current_user': frappe.session.user,
			'current_month': monthcheck
		}, as_dict=True)

		return result

	else:


		result = frappe.db.sql("""
			select customer.name,
       customer.firstname,
       customer.lastname,
       customer.meter_address,
       sum(inv.total) as total,
       curinv.status as curinv_status,
       curinv.month as curinv_month

		from tabCustomerManager as manager
				 join tabCustomerManagerChild as chd on manager.name = chd.parent
				 join tabCustomer as customer on chd.customer = customer.name
				 left join tabInvoice as inv on inv.customer = chd.customer and inv.status in ('Draft', 'Submitted')
				 left join tabInvoice as curinv
						   on curinv.customer = chd.customer
							   and curinv.month = %(current_month)s
							   and curinv.status in ('Draft', 'Submitted', 'Paid')
				where manager = %(current_user)s
		group by chd.customer
		""", {
			'current_user': frappe.session.user,
			'current_month': monthcheck
		}, as_dict=True)


		return result


@frappe.whitelist()
def load_customer():
	customer_name = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None
	if (customer_name):
		customer = frappe.get_doc("Customer", customer_name)
		invoices = frappe.db.get_list('Invoice', fields="*", filters={
			'customer': customer_name
		}, order_by="name desc")

		return {
			"customer": customer,
			"invoices": invoices
		}

	return

# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt
import frappe
# import frappe
from frappe.model.document import Document


class CustomerManager(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from sridonchai.sridonchai.doctype.customermanagerchild.customermanagerchild import \
			CustomerManagerChild

		customers: DF.Table[CustomerManagerChild]
		manager: DF.Link
	# end: auto-generated types

	pass


@frappe.whitelist()
def load_report():
	

	monthcheck = frappe.form_dict['month']['currentKey']
	#monthcheck = "01-2023"

	result = frappe.db.sql("""
						select customer.name,
			       customer.firstname,
			       customer.lastname,
			       customer.meter_address,
			       curinv.status as curinv_status,
			       curinv.month as curinv_month,
			       manager.name as manager_name,
			       user.first_name as manager_firstname,
			       user.last_name as manager_lastname
					from tabCustomerManager as manager
							 join tabCustomerManagerChild as chd on manager.name = chd.parent
							 join tabCustomer as customer on chd.customer = customer.name
							 join tabUser as user on user.name = manager.name
							 left join tabInvoice as curinv
									   on curinv.customer = chd.customer
										   and curinv.month = %(current_month)s
										   and curinv.status in ('Draft', 'Submitted', 'Paid')
					group by chd.customer
					""", {
		'current_month': monthcheck
	}, as_dict=True)

	from itertools import groupby
	from functools import reduce

	resultlist = []

	for key, group in groupby(result, lambda x: x['manager_name']):
		list_group = list(group)

		resultlist.append({
			"month" : monthcheck,
			"manager" : {
				'name' : list_group[0]['manager_name'],
				'firstname' : list_group[0]['manager_firstname'],
				'lastname': list_group[0]['manager_lastname']
			},
			'report' : {
				'total' : len(list_group),
				'metered' : reduce(lambda a,b : a + 1 if b['curinv_status'] in ['Draft','Submitted','Paid'] else a,list_group,0),
				'paid' : reduce(lambda a,b : a + 1 if b['curinv_status'] in ['Paid'] else a,list_group,0)
			},
			"group" : list_group
		})

	return resultlist

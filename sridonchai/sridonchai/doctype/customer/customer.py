# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.naming import getseries


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

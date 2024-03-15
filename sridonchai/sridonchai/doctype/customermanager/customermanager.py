# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class CustomerManager(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from sridonchai.sridonchai.doctype.customermanagerchild.customermanagerchild import CustomerManagerChild

		customers: DF.Table[CustomerManagerChild]
		manager: DF.Link
	# end: auto-generated types

	pass

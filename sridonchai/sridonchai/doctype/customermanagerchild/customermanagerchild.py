# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class CustomerManagerChild(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		customer: DF.Link
		firstname: DF.Data | None
		lastname: DF.Data | None
		meter_address: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
	# end: auto-generated types

	pass

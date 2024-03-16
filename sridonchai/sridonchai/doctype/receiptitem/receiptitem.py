# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class ReceiptItem(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		invoice: DF.Link | None
		invoice_type: DF.Data | None
		month: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		total: DF.Data | None
		total_unit: DF.Data | None
		unit_price: DF.Data | None
	# end: auto-generated types

	pass

# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Invoice(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		current_meter_read: DF.Data | None
		customer: DF.Link
		month: DF.Link
		previous_meter_read: DF.Data | None
		status: DF.Literal["Draft", "Submitted", "Paid", "Canceled"]
		total: DF.Currency
		total_unit: DF.Data | None
		type: DF.Literal["\u0e04\u0e48\u0e32\u0e19\u0e49\u0e33", "\u0e04\u0e48\u0e32\u0e1a\u0e33\u0e23\u0e38\u0e07\u0e21\u0e34\u0e40\u0e15\u0e2d\u0e23\u0e4c"]
		unit_price: DF.Data | None
	# end: auto-generated types

	pass

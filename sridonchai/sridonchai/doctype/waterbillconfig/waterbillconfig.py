# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt
import frappe
# import frappe
from frappe.model.document import Document


class WaterBillConfig(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		maintenance_fee: DF.Data | None
		unit_price: DF.Data | None
	# end: auto-generated types

	pass


@frappe.whitelist()
def load():
	return frappe.get_doc("WaterBillConfig")

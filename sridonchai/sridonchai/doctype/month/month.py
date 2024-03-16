# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Month(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		month: DF.Literal["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
		year: DF.Data | None

	# end: auto-generated types

	def autoname(self):
		self.name = f"{self.month:>02}-{self.year:>04}"
		return self.name


	def get_month_name(self,month,year):
		return f"{month:>02}-{year:>04}"
	def get_prev_month(self):
		month = int(self.month)
		year = int (self.year)

		month = month = 1

		year = year - 1 if month == 0 else year
		month = month if month >= 1 else 12

		return frappe.get_doc("Month",self.get_month_name(month,year))

	pass


@frappe.whitelist()
def add_year(year: str):
	if year and year != '':
		try:

			for i in range(1, 12 + 1):
				month: Month = frappe.new_doc("Month")
				month.month = str(i)
				month.year = year
				month.save()

			frappe.db.commit()
		except Exception as e:
			frappe.log(e)
	else:
		frappe.throw("Year is required")

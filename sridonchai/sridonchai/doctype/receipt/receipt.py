# Copyright (c) 2024, chaow porkaew and contributors
# For license information, please see license.txt
import frappe
import json

# import frappe
from frappe.model.document import Document
from frappe.utils import nowdate


class Receipt(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from sridonchai.sridonchai.doctype.receiptitem.receiptitem import ReceiptItem

		amended_from: DF.Link | None
		date_received: DF.Date | None
		invoices: DF.Table[ReceiptItem]
		payee: DF.Link | None
		payor: DF.Link | None
		status: DF.Literal["Draft", "Submitted", "Cancelled"]
		total: DF.Currency
	# end: auto-generated types

	def on_cancel(self):
		for receiptItem in self.invoices :
			invoice = frappe.get_doc("Invoice",receiptItem.invoice)
			invoice.status = "Submitted"
			invoice.save(ignore_permissions=True)

		self.status = "Cancelled"
		self.save()
		self._cancel()

		frappe.db.commit()
	pass


@frappe.whitelist()
def submitted_paid():
	doc = json.loads(frappe.form_dict['doc'])

	for receiptItem in doc['invoices']:
		invoice = frappe.get_doc("Invoice", receiptItem['invoice'])
		invoice.status = "Paid"
		invoice.save()


	doc = frappe.get_doc('Receipt', doc['name'])
	doc.status = 'Submitted'
	doc.payee = frappe.session.user
	doc.date_received = nowdate()
	doc.save()
	frappe.db.commit()


	doc.reload()
	return doc

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
		for receiptItem in self.invoices:
			invoice = frappe.get_doc("Invoice", receiptItem.invoice)
			invoice.status = "Submitted"
			invoice.save(ignore_permissions=True)

		self.status = "Cancelled"
		self.save()
		self._cancel()

		frappe.db.commit()

	pass


@frappe.whitelist()
def load_customer_receipt():
	customerName = frappe.form_dict['customer'] if 'customer' in frappe.form_dict else None

	assert customerName != None and customerName != ''

	receiptdoc = frappe.qb.DocType("Receipt")
	receipts = (frappe.qb.select(receiptdoc.name, receiptdoc.total, receiptdoc.payee,receiptdoc.date_received)
				.from_(receiptdoc)
				.where(receiptdoc.payor == customerName)).run(as_dict=True)

	return receipts


def background_receipt_submit(receipt):
	doc = receipt
	total = 0
	for receiptItem in doc.invoices:
		invoice = frappe.get_doc("Invoice", receiptItem.invoice)
		invoice.status = "Paid"
		total += float(invoice.total)
		invoice.save()

		if (receipt.payor == '' or receipt.payor == None):
			receipt.payor = invoice.customer

	doc.total = total

	doc.status = 'Submitted'
	doc.payee = frappe.session.user
	doc.date_received = nowdate()
	doc.save()
	frappe.db.commit()

	doc.reload()
	return doc


@frappe.whitelist()
def submitted_paid():
	doc = json.loads(frappe.form_dict['doc'])
	receipt = frappe.get_doc('Receipt', doc['name'])
	background_receipt_submit(receipt)
	return receipt


@frappe.whitelist()
def create_receipt():
	req = frappe.form_dict
	invoices = req['invoices'] if 'invoices' in req else None
	customer = req['customer'] if 'customer' in req else None

	assert invoices != None and len(invoices) > 0
	assert customer != None and customer != ''

	receipt = frappe.get_doc({
		"doctype": "Receipt",
		"status": "Draft",
		"date_received": frappe.utils.nowdate(),
		"payee": frappe.session.user,
		"payer": customer,
	})

	for invoice in invoices:
		receipt.append("invoices", {
			"invoice": invoice
		})

	receipt.save()

	background_receipt_submit(receipt)
	frappe.db.commit()
	return receipt

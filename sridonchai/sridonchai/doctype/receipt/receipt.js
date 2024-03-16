// Copyright (c) 2024, chaow porkaew and contributors
// For license information, please see license.txt

function updateTotal(frm, cdt, cdn) {
	let total_value = 0;
	console.log(frm)

	frm.doc.invoices.forEach(x => {

		let total = x.total ? parseFloat(x.total) : 0
		console.log(total)
		total_value += total
	})


	frm.set_value('total', total_value)
}

function hide_paid_button(frm) {
	if (frm.doc.status == "Submitted" || frm.doc.status == "Cancel") {
		frm.custom_buttons.Paid.hide()
	}else {
		frm.custom_buttons.Paid.show()
	}
}

frappe.ui.form.on("Receipt", {
	onload_post_render	(frm){
		hide_paid_button(frm)
	},
	refresh(frm) {
		console.log(frm)


		frm.fields_dict['invoices'].grid.get_field('invoice').get_query = (doc, cdt, cdn) => {
			return {
				filters: [
					['Invoice', 'status', 'in', 'Draft, Submitted'],
					['Invoice', 'customer', '=', frm.doc.payor]
				]
			}
		}
	},

	status(frm) {
		hide_paid_button(frm)

	}


});

frappe.ui.form.on("ReceiptItem", {
	refresh(frm) {
		console.log(frm)
	},
	invoices_add(frm, cdt, cdn) {

	},
	invoices_remove(frm, cdt, cdn) {
		updateTotal(frm, cdt, cdn)
	},

});


frappe.ui.form.on("ReceiptItem", "total", function (frm, cdt, cdn) {
	updateTotal(frm, cdt, cdn)
});

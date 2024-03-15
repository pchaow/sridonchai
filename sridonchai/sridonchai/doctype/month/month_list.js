frappe.listview_settings['Month'] = frappe.listview_settings['Month'] || {}

frappe.listview_settings['Month'].onload = (listview) => {
	console.log('listview',listview)
	listview.page.add_button(__("เพิ่มงวดเดือน"), function() {
		test(listview);
	})
}

function test( listview )
{
    let df = new frappe.ui.Dialog({
		title : "Add Year",
		fields : [{
			label : 'ปี ค.ศ.',
			fieldname : 'year',
			fieldtype : "Data"

		}],
		primary_action_label : 'Add Year',
		primary_action(values) {
			console.log(values)
			df.hide()
			frappe.call("sridonchai.sridonchai.doctype.month.month.add_year",{
				...values
			})
		}
	})

	df.show()
}

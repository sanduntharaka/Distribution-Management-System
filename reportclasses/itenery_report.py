import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class IteneryReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']

    def generate(self):
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})

        worksheet = workbook.add_worksheet()
        f1 = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'align': 'center', 'valign': 'vcenter'})
        f2 = workbook.add_format({'border': 2, 'border_color': 'black'})
        f1_payments = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#C4BD97', 'num_format': '#,##0', 'align': 'center', 'valign': 'vcenter'})
        f2_payments = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': '#C4BD97', 'num_format': '#,##0.#0'})

        f1_sales = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#FFFF00', 'align': 'center', 'valign': 'vcenter'})
        f2_sales = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': '#FFFF00', 'num_format': '#,##0'})
        worksheet.set_column('A:A', 20)
        merge_format = workbook.add_format({
            'bold': 1,
            'align': 'center',
            'valign': 'vcenter',
            'font_size': 18
        })
        worksheet.freeze_panes(8, 3)
        worksheet.merge_range(
            1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - Itenery Report", merge_format)
        worksheet.write('A3', 'Distributor')
        worksheet.write('B3', self.main_details['distributor'])

        worksheet.write('A4', 'Area')
        worksheet.write('B4', self.main_details['area'])

        worksheet.write('A5', 'month')
        worksheet.write('B5', self.main_details['month'])

        worksheet.write('A6', 'Sales Rep')
        worksheet.write('B6', self.main_details['sales_rep'])

        worksheet.merge_range(
            6, 0, 7, 0, "Routes/PSA", f1)
        worksheet.merge_range(
            6, 1, 7, 1, "Last Visited", f1)
        worksheet.merge_range(
            6, 2, 7, 2, "Last Invoice Date", f1)

        column = 4
        start_col = column

        sale_list = self.item_details[0]['sales']

        for item in sale_list:
            for salekey, saleqty in item.items():
                worksheet.write(7, column-1, salekey, f1_sales)
                column += 1

        worksheet.merge_range(
            6, start_col-1, 6, column-2, "Past 3 Months Sales", f1_sales)

        start_col = column-1

        worksheet.merge_range(
            6, start_col, 6, start_col+4, "Payments", f1_payments)
        worksheet.write(7, start_col, 'Cash', f1_payments)
        worksheet.write(7, start_col+1, 'Cheque', f1_payments)
        worksheet.write(7, start_col+2, 'Credit', f1_payments)
        worksheet.write(7, start_col+3, 'Total', f1_payments)
        worksheet.write(7, start_col+4, 'Since When', f1_payments)

        for row, item in enumerate(self.item_details, start=1):
            worksheet.write(row+7, 0, item['psa'], f2)
            worksheet.write(row+7, 1, f"{item['visited']}", f2)
            worksheet.write(row+7, 2, f"{item['last_inv_date']}", f2)

            i = 0
            for saleitem in item['sales']:
                for key, qty in saleitem.items():
                    i = i+1
                    worksheet.write(row+7, 2+i, qty, f2_sales)

            worksheet.write(row+7, i+3, item['cash'], f2_payments)
            worksheet.write(row+7, i+4, item['cheque'], f2_payments)
            worksheet.write(row+7, i+5, item['credit'], f2_payments)
            worksheet.write(row+7, i+6, item['total'], f2_payments)

            worksheet.write(
                row+7, i+7, f"{item['not_settled_date']}", f2_payments)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

        return response

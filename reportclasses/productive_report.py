import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class ProductiveReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.days_worked = data['days_worked']
        self.turnover_cash = data['turnover_cash']
        self.turnover_credit = data['turnover_credit']
        self.turnover_cheque = data['turnover_cheque']
        self.callage_tot_calls = data['callage_tot_calls']
        self.callage_tot_productive = data['callage_tot_productive_calls']
        self.product_categories = data['product_categories']
        self.callage_tot_products = data['product_categories_collage']
        # self.credit_sales = data['product_categories']

    def generate(self):
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})

        worksheet = workbook.add_worksheet()
        f1 = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black'})
        f2 = workbook.add_format({'border': 2, 'border_color': 'black'})
        f3 = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': 'yellow'})

        worksheet.set_column('A:A', 20)
        merge_format = workbook.add_format({
            'bold': 1,
            'align': 'center',
            'valign': 'vcenter',
            'font_size': 18
        })
        worksheet.merge_range(
            1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - Productive Report", merge_format)
        worksheet.write('A3', 'As at')
        worksheet.write('B3', self.main_details['as_at'])

        worksheet.write('A4', 'Month')
        worksheet.write('B4', self.main_details['month'])

        worksheet.write('A5', 'Date')
        worksheet.write('B5', self.main_details['date'])

        worksheet.write('A6', 'Sales Rep')
        worksheet.write('B6', self.main_details['sales_ref'])

        worksheet.merge_range(
            6, 0, 7, 0, "Sales Rep's Productivity", f1)

        worksheet.write(7, 1, 'Actual', f1)
        worksheet.write(7, 2, 'Lst Month Actual', f1)
        worksheet.merge_range(6, 1, 6, 2, "Month", f1)

        worksheet.write(7, 3, 'Actual', f1)
        worksheet.write(7, 4, 'Varience %', f1)
        worksheet.merge_range(6, 3, 6, 4, "Cumulative", f1)

        worksheet.write(8, 0, 'Days Worked', f2)
        worksheet.write(8, 1, self.days_worked['month']['this_actual'], f2)
        worksheet.write(8, 2,  self.days_worked['month']['last_actual'], f2)
        worksheet.write(
            8, 3,  self.days_worked['cumulative']['this_actual'], f2)
        worksheet.write(8, 4,  ' ', f2)

        worksheet.write(9, 0, 'Turnover', f3)
        worksheet.write(10, 0, 'Cash Sales', f2)
        worksheet.write(10, 1, self.turnover_cash['month']['this_actual'], f2)
        worksheet.write(10, 2,  self.turnover_cash['month']['last_actual'], f2)
        worksheet.write(
            10, 3,  self.turnover_cash['cumulative']['this_actual'], f2)
        worksheet.write(10, 4,  ' ', f2)

        worksheet.write(11, 0, 'Cheques', f2)
        worksheet.write(
            11, 1, self.turnover_cheque['month']['this_actual'], f2)
        worksheet.write(
            11, 2,  self.turnover_cheque['month']['last_actual'], f2)
        worksheet.write(
            11, 3,  self.turnover_cheque['cumulative']['this_actual'], f2)
        worksheet.write(11, 4,  ' ', f2)

        worksheet.write(12, 0, 'Credit Sales', f2)
        worksheet.write(
            12, 1, self.turnover_credit['month']['this_actual'], f2)
        worksheet.write(
            12, 2,  self.turnover_credit['month']['last_actual'], f2)
        worksheet.write(
            12, 3,  self.turnover_credit['cumulative']['this_actual'], f2)
        worksheet.write(12, 4,  ' ', f2)

        worksheet.write(13, 0, 'Callage', f3)
        worksheet.write(14, 0, 'Total Calls', f2)
        worksheet.write(
            14, 1, self.callage_tot_calls['month']['this_actual'], f2)
        worksheet.write(
            14, 2,  self.callage_tot_calls['month']['last_actual'], f2)
        worksheet.write(
            14, 3,  self.callage_tot_calls['cumulative']['this_actual'], f2)
        worksheet.write(14, 4,  ' ', f2)

        worksheet.write(14, 0, 'Total Productive Calls', f2)
        worksheet.write(
            14, 1, self.callage_tot_productive['month']['this_actual'], f2)
        worksheet.write(
            14, 2,  self.callage_tot_productive['month']['last_actual'], f2)
        worksheet.write(
            14, 3,  self.callage_tot_productive['cumulative']['this_actual'], f2)
        worksheet.write(14, 4,  ' ', f2)

        row = 1
        for i in self.product_categories:
            worksheet.write(
                14+row, 0, i, f2)

            worksheet.write(
                14+row, 1, self.callage_tot_products[row-1][row]['month']['this_actual'], f2)
            worksheet.write(
                14+row, 2,  self.callage_tot_products[row-1][row]['month']['last_actual'], f2)
            worksheet.write(
                14+row, 3,  self.callage_tot_products[row-1][row]['cumulative']['this_actual'], f2)
            worksheet.write(14+row, 4,  ' ', f2)
            row += 1

        worksheet.write(row, 0, 'Average Productivity per call', f3)
        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

        return response

import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class MonthIteneryReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['planing_data']

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
        worksheet.freeze_panes(7, 0)
        worksheet.merge_range(
            1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD -Month Itenery Report", merge_format)
        worksheet.write('A3', 'Distributor')
        worksheet.write('B3', self.main_details['distributor'])

        worksheet.write('A4', 'month')
        worksheet.write('B4', self.main_details['month'])

        worksheet.write('A5', 'Sales Rep')
        worksheet.write('B5', self.main_details['sales_rep'])

        worksheet.merge_range(
            5, 0, 6, 0, "Date", f1)
        worksheet.merge_range(
            5, 1, 6, 1, "Route", f1)
        worksheet.merge_range(
            5, 2, 6, 2, "Sales", f1)

        for row, item in enumerate(self.item_details, start=1):
            worksheet.write(row+6, 0, str(item['date']), f2)
            worksheet.write(row+6, 1, f"{item['psa']}", f2)
            worksheet.write(row+6, 2, f"{item['sales_total']}", f2)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="month_itenery.xlsx"'

        return response

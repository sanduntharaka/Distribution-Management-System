import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class RetailerPerformanceReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']

    def generate(self):
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})

        worksheet = workbook.add_worksheet()
        f1 = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'valign': 'vcenter', 'align': 'center'})
        f2 = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'valign': 'vcenter', 'align': 'center'})
        f2_value = workbook.add_format(
            {'border': 2, 'num_format': '#,##0', 'border_color': 'black', 'valign': 'vcenter', 'align': 'center'})

        worksheet.set_column('A:A', 20)
        merge_format = workbook.add_format({
            'bold': 1,
            'align': 'center',
            'valign': 'vcenter',
            'font_size': 18
        })
        worksheet.merge_range(
            1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - Retailer Performance Report", merge_format)
        worksheet.write('A3', 'Name')
        worksheet.write('B3', self.main_details['name'])

        worksheet.write('A4', 'Address')
        worksheet.write('B4', self.main_details['address'])

        worksheet.write('A5', 'Contact')
        worksheet.write('B5', self.main_details['contact'])

        worksheet.write('A6', 'Type')
        worksheet.write('B6', self.main_details['type'])

        worksheet.write('A7', 'Classification')
        worksheet.write('B7', self.main_details['grade'])

        worksheet.write('A8', 'Mode of Payment')
        worksheet.write('B8', self.main_details['pay_mode'])

        worksheet.write('A9', 'Last Transaction Date')
        worksheet.write('B9', f"{self.main_details['last_pay_date']}")

        worksheet.write('A10', 'Current Outstanding')
        worksheet.write('B10', self.main_details['outstanding'])

        worksheet.write('A11', 'Since when is the outstanding')
        worksheet.write('B11', f"{self.main_details['outstanding_when']}")

        worksheet.write('A12', 'Any Return Cheques')
        worksheet.write('B12', self.main_details['return_cheques'])

        worksheet.merge_range(
            12, 0, 13, 0, "Product", f1)
        worksheet.merge_range(
            12, 1, 12, 4, "Purchases", f1)
        worksheet.write(13, 1, 'Current Month', f2)
        worksheet.write(13, 2, 'Last Month', f2)
        worksheet.write(13, 3, 'Previously', f2)
        worksheet.write(13, 4, 'Last Purchase Date', f2)

        row = 14

        for i in self.item_details:
            worksheet.write(row, 0, i['category'], f2)
            worksheet.write(row, 1, i['this_month']
                            if i['this_month'] != 0 else '', f2_value)
            worksheet.write(row, 2, i['last_month']
                            if i['last_month'] != 0 else '', f2_value)
            worksheet.write(row, 3, i['previous']
                            if i['previous'] != 0 else '', f2_value)
            worksheet.write(row, 4, f"{i['last_p_date']}", f2)

            row += 1
        # worksheet.write(row+7, i+4, item['credit'], f2)
        worksheet.write(row, 0, 'Total', f2)
        worksheet.write(row, 1, sum([i['this_month']
                        for i in self.item_details]), f2_value)
        worksheet.write(row, 2, sum([i['last_month']
                        for i in self.item_details]), f2_value)
        worksheet.write(row, 3, sum([i['previous']
                        for i in self.item_details]), f2_value)
        worksheet.write(row, 4, ' ', f2)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

        return response

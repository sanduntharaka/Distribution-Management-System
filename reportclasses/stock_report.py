import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class GenerateStockReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']

    def generate(self):
        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})

        worksheet = workbook.add_worksheet()

        f1 = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black'})
        f2 = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'num_format': '#,##0'})

        worksheet.set_column('A:A', 20)
        merge_format = workbook.add_format({
            'bold': 1,
            'align': 'center',
            'valign': 'vcenter',
            'font_size': 18
        })
        worksheet.merge_range(
            1, 1, 1, 10, "Stock Report", merge_format)
        worksheet.write('A3', 'Distributor')
        worksheet.write('B3', self.main_details['distributor'])

        worksheet.write('A5', 'Date', f1)
        worksheet.write('B5', 'Prodcut/Item', f1)
        worksheet.write('C5', 'Opening Stock', f1)
        worksheet.write('D5', 'Purchases', f1)
        worksheet.write('E5', 'Sales', f1)
        worksheet.write('F5', 'Free Issues', f1)
        worksheet.write('G5', 'Market Returns', f1)
        worksheet.write('H5', 'Closing Stock', f1)

        for row, item in enumerate(self.item_details, start=1):
            worksheet.write(row+4, 0,  self.main_details['date'], f2)
            worksheet.write(row+4, 1, item['product_name'], f2)
            worksheet.write(row+4, 2, item['os']
                            if item['os'] != 0 else ' ', f2)
            worksheet.write(
                row+4, 3, item['purchase'] if item['purchase'] != 0 else ' ', f2)
            worksheet.write(row+4, 4, item['sales']
                            if item['sales'] != 0 else ' ', f2)
            worksheet.write(
                row+4, 5, item['free_issues'] if item['free_issues'] != 0 else ' ', f2)
            worksheet.write(
                row+4, 6, item['market_returns'] if item['market_returns'] != 0 else ' ', f2)
            worksheet.write(row+4, 7, item['cs']
                            if item['cs'] != 0 else ' ', f2)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="foc_{self.main_details["distributor"]}_{self.main_details["date"]}.xlsx"'

        return response

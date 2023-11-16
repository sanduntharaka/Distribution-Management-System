import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response


class DistributorPerformanceReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']

    def generate(self):
        try:
            output = io.BytesIO()
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})

            worksheet = workbook.add_worksheet()
            f1 = workbook.add_format(
                {'bold': True, 'border': 2, 'border_color': 'black'})
            f2 = workbook.add_format({'border': 2, 'border_color': 'black'})

            worksheet.set_column('A:A', 20)
            merge_format = workbook.add_format({
                'bold': 1,
                'align': 'center',
                'valign': 'vcenter',
                'font_size': 18
            })
            worksheet.merge_range(
                1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - Distributor Performance Report", merge_format)
            worksheet.write('A3', 'Name')
            worksheet.write('B3', self.main_details['name'])

            worksheet.write('A4', 'Distributor')
            worksheet.write('B4', self.main_details['distributor'])

            worksheet.write('A5', 'month')
            worksheet.write('B5', self.main_details['month'])

            worksheet.write('A6', 'Current DSR')
            worksheet.write('B6', self.main_details['current_dsr'])

            worksheet.merge_range(
                6, 0, 7, 0, "Product Description", f1)

            worksheet.merge_range(
                6, 1, 6, 5, "month", f1)
            worksheet.write(7, 1, "Quantity", f1)
            worksheet.write(7, 2, "Value", f1)
            worksheet.write(7, 3, "GP", f1)
            worksheet.write(7, 4, "Free Issues", f1)
            worksheet.write(7, 5, "Market Ret.", f1)

            worksheet.merge_range(
                6, 6, 6, 10, "Cumulative", f1)
            worksheet.write(7, 6, "Quantity", f1)
            worksheet.write(7, 7, "Value", f1)
            worksheet.write(7, 8, "GP", f1)
            worksheet.write(7, 9, "Free Issues", f1)
            worksheet.write(7, 10, "Market Ret.", f1)

    #

            for row, item in enumerate(self.item_details, start=1):
                worksheet.write(row+7, 0, item['product_name'], f2)
                worksheet.write(row+7, 1, item['mqty'], f2)
                worksheet.write(row+7, 2, item['mvalue'], f2)
                worksheet.write(row+7, 3, item['mgp'], f2)
                worksheet.write(row+7, 4, item['mfoc'], f2)
                worksheet.write(row+7, 5, item['mmret'], f2)
                worksheet.write(row+7, 6, item['cqty'], f2)
                worksheet.write(row+7, 7, item['cvalue'], f2)
                worksheet.write(row+7, 8, item['cgp'], f2)
                worksheet.write(row+7, 9, item['cfoc'], f2)
                worksheet.write(row+7, 10, item['cmret'], f2)

            worksheet.write(row+8, 0, 'Total', f2)
            worksheet.write(row+8, 1, sum([i['mqty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 2, sum([i['mvalue']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 3, ' ', f2)
            worksheet.write(row+8, 4, sum([i['mfoc']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 5, sum([i['mmret']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 6, sum([i['cqty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 7, sum([i['cvalue']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 8, ' ', f2)
            worksheet.write(row+8, 9, sum([i['cfoc']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 10, sum([i['cmret']
                            for i in self.item_details]), f2)

            workbook.close()
            response = HttpResponse(output.getvalue(
            ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

            return response
        except Exception as e:
            return Response(data={'error': e, 'msg': 'excell error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# NAN/INF not supported in write_number() without 'nan_inf_to_errors' Workbook() option

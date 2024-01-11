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
            f1_month = workbook.add_format(
                {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#C4BD97',  'align': 'center', 'valign': 'vcenter'})
            f1_cumulative = workbook.add_format(
                {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#d3e0a4', 'align': 'center', 'valign': 'vcenter'})
            f2 = workbook.add_format({'border': 2, 'border_color': 'black'})
            f2_month = workbook.add_format(
                {'border': 2, 'border_color': 'black', 'bg_color': '#C4BD97', 'num_format': '#,##0', 'align': 'center', 'valign': 'vcenter'})
            f2_month_price = workbook.add_format(
                {'border': 2, 'border_color': 'black', 'bg_color': '#C4BD97', 'num_format': '#,##0.#0', 'align': 'center', 'valign': 'vcenter'})
            f2_cumulative = workbook.add_format(
                {'border': 2, 'border_color': 'black', 'bg_color': '#d3e0a4', 'num_format': '#,##0', 'align': 'center', 'valign': 'vcenter'})
            f2_cumulative_price = workbook.add_format(
                {'border': 2, 'border_color': 'black', 'bg_color': '#d3e0a4', 'num_format': '#,##0.#0', 'align': 'center', 'valign': 'vcenter'})

            worksheet.set_column('A:A', 20)
            worksheet.freeze_panes(8, 0)
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

            worksheet.merge_range(
                6, 0, 7, 0, "Product Description", f1)

            worksheet.merge_range(
                6, 1, 6, 4, "month", f1_month)
            worksheet.write(7, 1, "Quantity", f1_month)
            worksheet.write(7, 2, "Value", f1_month)
            worksheet.write(7, 3, "Free Issues", f1_month)
            worksheet.write(7, 4, "Market Ret.", f1_month)

            worksheet.merge_range(
                6, 5, 6, 8, "Cumulative", f1_cumulative)
            worksheet.write(7, 5, "Quantity", f1_cumulative)
            worksheet.write(7, 6, "Value", f1_cumulative)
            worksheet.write(7, 7, "Free Issues", f1_cumulative)
            worksheet.write(7, 8, "Market Ret.", f1_cumulative)

    #

            for row, item in enumerate(self.item_details, start=1):
                worksheet.write(row+7, 0, item['product_name'], f2)
                worksheet.write(
                    row+7, 1, item['mqty'] if item['mqty'] != 0 else ' ', f2_month)
                worksheet.write(
                    row+7, 2, item['mvalue'] if item['mvalue'] != 0 else ' ', f2_month_price)
                worksheet.write(
                    row+7, 3, item['mfoc'] if item['mfoc'] != 0 else ' ', f2_month)
                worksheet.write(
                    row+7, 4, item['mmret'] if item['mmret'] != 0 else ' ', f2_month)
                worksheet.write(
                    row+7, 5, item['cqty'] if item['cqty'] != 0 else ' ', f2_cumulative)
                worksheet.write(
                    row+7, 6, item['cvalue'] if item['cvalue'] != 0 else ' ', f2_cumulative_price)
                worksheet.write(
                    row+7, 7, item['cfoc'] if item['cfoc'] != 0 else ' ', f2_cumulative)
                worksheet.write(
                    row+7, 8, item['cmret'] if item['cmret'] != 0 else ' ', f2_cumulative)

            worksheet.write(row+8, 0, 'Total', f2)
            worksheet.write(row+8, 1, sum([i['mqty']
                            for i in self.item_details]), f2_month)
            worksheet.write(row+8, 2, sum([i['mvalue']
                            for i in self.item_details]), f2_month_price)
            worksheet.write(row+8, 3, sum([i['mfoc']
                            for i in self.item_details]), f2_month)
            worksheet.write(row+8, 4, sum([i['mmret']
                            for i in self.item_details]), f2_month)
            worksheet.write(row+8, 5, sum([i['cqty']
                            for i in self.item_details]), f2_cumulative)
            worksheet.write(row+8, 6, sum([i['cvalue']
                            for i in self.item_details]), f2_cumulative_price)
            worksheet.write(row+8, 7, sum([i['cfoc']
                            for i in self.item_details]), f2_cumulative)
            worksheet.write(row+8, 8, sum([i['cmret']
                            for i in self.item_details]), f2_cumulative)

            workbook.close()
            response = HttpResponse(output.getvalue(
            ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

            return response
        except Exception as e:
            return Response(data={'error': e, 'msg': 'excell error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# NAN/INF not supported in write_number() without 'nan_inf_to_errors' Workbook() option

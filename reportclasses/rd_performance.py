import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response


class RDPerformanceReportExcell:
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
                1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - RD Performance Report", merge_format)
            worksheet.write('A3', 'Name')
            # worksheet.write('B3', self.main_details['name'])

            worksheet.write('A4', 'Distributor')
            # worksheet.write('B4', self.main_details['distributor'])

            worksheet.write('A5', 'month')
            # worksheet.write('B5', self.main_details['month'])

            worksheet.merge_range(
                6, 0, 8, 0, "Product Description", f1)

            worksheet.merge_range(
                6, 1, 6, 12, "Month's Perfromance", f1)
            worksheet.merge_range(
                7, 1, 7, 3, "Volume Performance", f1)
            worksheet.write(8, 1, "Current Month", f1)
            worksheet.write(8, 2, "Last Month", f1)
            worksheet.write(8, 3, "% Change", f1)

            worksheet.merge_range(
                7, 4, 7, 6, "Value Performance", f1)
            worksheet.write(8, 4, "Current Month", f1)
            worksheet.write(8, 5, "Last Month", f1)
            worksheet.write(8, 6, "% Change", f1)

            worksheet.merge_range(
                7, 7, 7, 9, "Free Issues", f1)
            worksheet.write(8, 7, "Current Month", f1)
            worksheet.write(8, 8, "Last Month", f1)
            worksheet.write(8, 9, "% Change", f1)

            worksheet.merge_range(
                7, 10, 7, 12, "Market returns", f1)
            worksheet.write(8, 10, "Current Month", f1)
            worksheet.write(8, 11, "Last Month", f1)
            worksheet.write(8, 12, "% Change", f1)

            worksheet.merge_range(
                6, 13, 6, 16, "YTD  Perfromance", f1)
            worksheet.write(
                7, 13, "Volume Performance", f1)
            worksheet.write(8, 13, "for the period", f1)
            worksheet.write(
                7, 14, "Value Performance", f1)
            worksheet.write(8, 14, "for the period", f1)
            worksheet.write(
                7, 15, "Free Issues", f1)
            worksheet.write(8, 15, "for the period", f1)
            worksheet.write(
                7, 16, "Market returns", f1)
            worksheet.write(8, 16, "for the period", f1)

            for row, item in enumerate(self.item_details, start=1):
                worksheet.write(row+8, 0, item['product_name'], f2)
                worksheet.write(
                    row+8, 1, '-' if item['this_vol_qty'] == 0 else item['this_vol_qty'], f2)
                worksheet.write(
                    row+8, 2, '-' if item['last_vol_qty'] == 0 else item['last_vol_qty'], f2)
                worksheet.write(
                    row+8, 3, '-' if item['vol_var'] == 0 else item['vol_var'], f2)
                worksheet.write(
                    row+8, 4, '-' if item['this_val_qty'] == 0 else item['this_val_qty'], f2)
                worksheet.write(
                    row+8, 5, '-' if item['last_val_qty'] == 0 else item['last_val_qty'], f2)
                worksheet.write(
                    row+8, 6, '-' if item['val_var'] == 0 else item['val_var'], f2)
                worksheet.write(
                    row+8, 7, '-' if item['this_vol_foc'] == 0 else item['this_vol_foc'], f2)
                worksheet.write(
                    row+8, 8, '-' if item['last_vol_foc'] == 0 else item['last_vol_foc'], f2)
                worksheet.write(
                    row+8, 9, '-' if item['foc_var'] == 0 else item['foc_var'], f2)
                worksheet.write(
                    row+8, 10, '-' if item['this_vol_mret'] == 0 else item['this_vol_mret'], f2)
                worksheet.write(
                    row+8, 11, '-' if item['last_vol_mret'] == 0 else item['last_vol_mret'], f2)
                worksheet.write(
                    row+8, 12, '-' if item['mret_var'] == 0 else item['mret_var'], f2)
                worksheet.write(
                    row+8, 13, '-' if item['year_vol_qty'] == 0 else item['year_vol_qty'], f2)
                worksheet.write(
                    row+8, 14, '-' if item['year_val_qty'] == 0 else item['year_val_qty'], f2)
                worksheet.write(
                    row+8, 15, '-' if item['year_vol_foc'] == 0 else item['year_vol_foc'], f2)
                worksheet.write(
                    row+8, 16, '-' if item['year_vol_mret'] == 0 else item['year_vol_mret'], f2)

            worksheet.write(row+8, 0, 'Total', f2)
            worksheet.write(row+8, 1, sum([i['this_vol_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 2, sum([i['last_vol_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 3, '-', f2)
            worksheet.write(row+8, 4, sum([i['this_val_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 5, sum([i['last_val_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 6,  '-', f2)
            worksheet.write(row+8, 7, sum([i['this_vol_foc']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 8, sum([i['last_vol_foc']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 9, '-', f2)
            worksheet.write(row+8, 10, sum([i['this_vol_mret']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 11, sum([i['last_vol_mret']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 12, '-', f2)
            worksheet.write(row+8, 13, sum([i['year_vol_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 14, sum([i['year_val_qty']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 15, sum([i['year_vol_foc']
                            for i in self.item_details]), f2)
            worksheet.write(row+8, 16, sum([i['year_vol_mret']
                            for i in self.item_details]), f2)

            workbook.close()
            response = HttpResponse(output.getvalue(
            ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

            return response
        except Exception as e:
            return Response(data={'error': e, 'msg': 'excell error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# NAN/INF not supported in write_number() without 'nan_inf_to_errors' Workbook() option

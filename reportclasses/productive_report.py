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

        column = 3
        start_col = column

        # sale_list = self.item_details[0]['sales']

        # for item in sale_list:
        #     for salekey, saleqty in item.items():
        #         worksheet.write(7, column-1, salekey, f1)
        #         column += 1

        # worksheet.merge_range(
        #     6, start_col-1, 6, column-2, "Past 3 months Sales", f1)

        # start_col = column-1

        # worksheet.merge_range(
        #     6, start_col, 6, start_col+2, "Payments", f1)
        # worksheet.write(7, start_col, 'cash', f1)
        # worksheet.write(7, start_col+1, 'cheque', f1)
        # worksheet.write(7, start_col+2, 'credit', f1)

        # for row, item in enumerate(self.item_details, start=1):
        #     worksheet.write(row+7, 0, item['psa'], f2)
        #     worksheet.write(row+7, 1, item['visited'], f2)
        #     i = 0
        #     for saleitem in item['sales']:
        #         for key, qty in saleitem.items():
        #             i = i+1
        #             worksheet.write(row+7, 1+i, qty, f2)

        #     worksheet.write(row+7, i+2, item['cash'], f2)
        #     worksheet.write(row+7, i+3, item['cheque'], f2)
        #     worksheet.write(row+7, i+4, item['credit'], f2)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

        return response

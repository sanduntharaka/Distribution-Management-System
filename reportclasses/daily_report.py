import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse
from reportdata.models import DailyReport, SalesData, FocData, MarketReturnData


class GenerateDailyReportExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']
        self.sub_details_calls = data['sub_detail_1']
        self.target_data = data['target_details']

    # def clean_data(self):
    #     grouped_data = defaultdict(list)

    #     for item in self.item_details:
    #         key = (item['category'], item['invoice'], item['date'])
    #         grouped_data[key].append(item)

    #     result = [grouped_items[-1] for grouped_items in grouped_data.values()]

    #     return result

    def generate(self):
        try:
            report_data = DailyReport.objects.get(
                sales_ref=self.main_details['sales_rep_id'], date=self.main_details['date'])
        except DailyReport.DoesNotExist:
            report_data = None

        output = io.BytesIO()
        workbook = xlsxwriter.Workbook(output, {'in_memory': True})

        worksheet = workbook.add_worksheet()
        f1 = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'align': 'center'})
        f1_sales = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#bfff00'})
        f1_foc = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#00bfff'})
        f1_mret = workbook.add_format(
            {'bold': True, 'border': 2, 'border_color': 'black', 'bg_color': '#ff00ff'})
        f2 = workbook.add_format({'border': 2, 'border_color': 'black'})
        f2_sales = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': '#bfff00'})
        f2_foc = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': '#00bfff'})
        f2_mret = workbook.add_format(
            {'border': 2, 'border_color': 'black', 'bg_color': '#ff00ff'})

        worksheet.set_column('A:A', 20)
        merge_format = workbook.add_format({
            'bold': 1,
            'align': 'center',
            'valign': 'vcenter',
            'font_size': 18
        })
        worksheet.freeze_panes(8, 2)
        worksheet.merge_range(
            1, 1, 1, 10, "BIXTON DISTRIBUTORS (PVT) LTD - Sales Reps Daily Report", merge_format)
        worksheet.write('A3', 'Distributor')
        worksheet.write('B3', self.main_details['distributor'])

        worksheet.write('A4', 'Area')
        worksheet.write('B4', self.main_details['area'])

        worksheet.write('A5', 'Date')
        worksheet.write('B5', self.main_details['date'])

        worksheet.write('A6', 'Sales Rep')
        worksheet.write('B6', self.main_details['sales_rep'])

        # H,I

        worksheet.write('H3', 'No of Calls for the Day')
        worksheet.write('I3', self.sub_details_calls['no_calls_p_day'])
        worksheet.write('H4', 'Total Productive Calls for the Day')
        worksheet.write(
            'I4', self.sub_details_calls['no_productive_calls_p_day'])
        worksheet.write('H5', 'Total Calls to date')
        worksheet.write('I5', self.sub_details_calls['no_calls_p_month'])
        worksheet.write('H6', 'Total Productive Calls todate')
        worksheet.write(
            'I6', self.sub_details_calls['no_productive_calls_p_month'])

        worksheet.merge_range(
            6, 0, 7, 0, "Name of outlet", f1)
        worksheet.merge_range(
            6, 1, 7, 1, "Location/Town", f1)
        worksheet.merge_range(
            6, 2, 6, 3, "Present O/S", f1)

        worksheet.write('C8', 'Amount', f1)
        worksheet.write('D8', 'Since When', f1)

        column = 5
        start_col = column

        sale_list = self.item_details[0]['sales']

        for key in sale_list:
            worksheet.write(7, column-1, key, f1_sales)
            column += 1

        worksheet.merge_range(
            6, start_col-1, 6, column-2, "Sales Made", f1_sales)

        foc_list = self.item_details[0]['foc']

        start_col = column
        for key in foc_list:

            worksheet.write(7, column-1, key, f1_foc)
            column += 1

        worksheet.merge_range(
            6, start_col-1, 6, column-2, "FOC", f1_foc)

        mret_list = self.item_details[0]['market_return']

        start_col = column
        for key in mret_list:

            worksheet.write(7, column-1, key, f1_mret)
            column += 1

        worksheet.merge_range(
            6, start_col-1, 6, column-2, "Market returns", f1_mret)

        start_col = column-1

        worksheet.merge_range(
            6, start_col, 7, start_col, "Total", f1)
        worksheet.merge_range(
            6, start_col+1, 7, start_col+1, "Not buy Reason", f1)

        for row, item in enumerate(self.item_details, start=1):
            worksheet.write(row+7, 0, item['dealer'], f2)
            worksheet.write(row+7, 1, item['address'], f2)
            worksheet.write(row+7, 2, "{:,.2f}".format(item['amount']), f2)
            worksheet.write(row+7, 3, f"{item['since']}", f2)
            i = 0
            for key in item['sales']:
                i = i+1
                worksheet.write(row+7, 3+i, item['sales'][key], f2_sales)

            j = 0
            for key in item['foc']:

                j = j+1
                worksheet.write(row+7, i+j+3, item['foc'][key], f2_foc)

            k = 0
            for key in item['market_return']:

                k = k+1
                worksheet.write(
                    row+7, i+j+k+3, item['market_return'][key], f2_mret)
            worksheet.write(
                row+7, i+j+k+4, "{:,.2f}".format(item['total']), f2)
            worksheet.write(row+7, i+j+k+5, item['not_buy_reason'], f2)

        target_row = row+8
        worksheet.write(target_row, 0, "Total", f2)
        worksheet.write(target_row, 1, " ", f2)
        worksheet.write(target_row, 2, sum(
            [i['amount'] for i in self.item_details]), f2)
        worksheet.write(target_row, 3, ' ', f1)
        column = 4
        for key in sale_list:
            worksheet.write(target_row, column, sum(
                [d['sales'][key] if d['sales'][key] != ' ' else 0 for d in self.item_details]), f2_sales)
            column += 1

        for key in foc_list:
            worksheet.write(target_row, column, sum(
                [d['foc'][key] if d['foc'][key] != ' ' else 0 for d in self.item_details]), f2_foc)
            column += 1

        for key in mret_list:
            worksheet.write(target_row, column, sum(
                [d['market_return'][key] if d['market_return'][key] != ' ' else 0 for d in self.item_details]), f2_mret)
            column += 1

        worksheet.write(
            target_row, column, "{:,.2f}".format(sum([t['total'] for t in self.item_details])), f2)
        worksheet.write(target_row, column+1, ' ', f2)

        if report_data is not None:
            target_row = target_row+1

            worksheet.write(target_row, 0, 'Cumulative B/F', f1)
            worksheet.write(target_row, 1, ' ', f1)
            worksheet.write(target_row, 2, "{:,.2f}".format(
                report_data.amount), f1)
            worksheet.write(target_row, 3, ' ', f1)
            column = 4
            for key in sale_list:
                worksheet.write(target_row, column, SalesData.objects.get(
                    category__short_code=key, report=report_data).value, f1_sales)
                column += 1
            for key in foc_list:

                worksheet.write(target_row, column, FocData.objects.get(
                    category__short_code=key, report=report_data).value, f1_sales)
                column += 1

            for key in mret_list:

                worksheet.write(target_row, column, MarketReturnData.objects.get(
                    category__short_code=key, report=report_data).value, f1_sales)
                column += 1

            worksheet.write(target_row, column,
                            "{:,.2f}".format(report_data.total), f1)
            worksheet.write(target_row, column+1,
                            " ", f1)

        target_row = target_row+3

        worksheet.merge_range(
            target_row-1, 0, target_row-1, 2, "Targets", f1)
        worksheet.write(target_row, 0, 'PSA', f1)
        worksheet.write(target_row, 1, 'Target', f1)
        worksheet.write(target_row, 2, 'Achieved', f1)
        for target in self.target_data:
            if target['value'] < target['covered']:
                row_colour = '#ff0000'
                f2 = workbook.add_format(
                    {'border': 2, 'border_color': 'black', 'bg_color': '#00bfff'})
            worksheet.write(target_row+1, 0, target['psa'], f2)
            worksheet.write(target_row+1, 1,
                            "{:,.2f}".format(target['value']), f2)
            worksheet.write(target_row+1, 2,
                            "{:,.2f}".format(target['covered']), f2)
            target_row += 1

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="daily_test.xlsx"'

        return response

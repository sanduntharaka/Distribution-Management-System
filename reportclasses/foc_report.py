import xlsxwriter
from collections import defaultdict
import io
from django.http import HttpResponse


class GenerateFocExcell:
    def __init__(self, data) -> None:
        self.main_details = data['main_details']
        self.item_details = data['category_details']

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
        worksheet.merge_range(1, 1, 1, 10, "Free Issues", merge_format)
        worksheet.write('A3', 'Distributor')
        worksheet.write('B3', self.main_details['distributor'])

        worksheet.write('A4', 'Area')
        worksheet.write('B4', self.main_details['area'])

        worksheet.write('A5', 'Month')
        worksheet.write('B5', self.main_details['month'])

        worksheet.write('A6', 'Sales Rep')
        worksheet.write('B6', self.main_details['sales_rep'])

        unique_categories = list(
            set(item['category'] for item in self.item_details))

        worksheet.write('A8', 'Date', f1)
        worksheet.write('B8', 'Inv. No', f1)
        for index, category in enumerate(unique_categories, start=2):
            worksheet.write(7, index, category, f1)

        for row, item in enumerate(self.item_details, start=1):
            worksheet.write(row+7, 0, item['date'].isoformat(), f2)
            worksheet.write(row+7, 1, item['invoice'], f2)
            for index, category in enumerate(unique_categories, start=2):
                if item['category'] == category:
                    worksheet.write(
                        row+7, index, item['foc'] if item['foc'] != 0 else ' ', f2)
                else:
                    worksheet.write(row+7, index, ' ', f2)
        last_row = row+7

        worksheet.write(last_row+1, 0, 'Total', f2)
        worksheet.write(last_row+1, 1, ' ', f2)

        category_sums = {}

        # Calculate the sum of 'foc' for each category

        for item in self.item_details:
            category = item['category']
            foc = item['foc']
            if category in category_sums:
                category_sums[category] += foc
            else:
                category_sums[category] = foc

        for index, category in enumerate(unique_categories, start=2):
            worksheet.write(last_row+1, index, category_sums[category], f2)

        workbook.close()
        response = HttpResponse(output.getvalue(
        ), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="foc_{self.main_details["sales_rep_id"]}_{self.main_details["month"]}.xlsx"'

        return response

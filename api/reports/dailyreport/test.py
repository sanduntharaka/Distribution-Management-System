
from collections import defaultdict
import openpyxl
import xlsxwriter
import datetime
data = {
    "main_details": [
        {
            "dealer": "Cct deniyaya",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "18:12:29"
        },
        {
            "dealer": "Ishadhi power cctv",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "16:56:23"
        },
        {
            "dealer": "New gamini tea factory",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:40:06"
        },
        {
            "dealer": "Ishadhi power cctv",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "11:28:42"
        },
        {
            "dealer": "Dishanvally tea factory",
            "psa": "Ginnaliya, Kooppakanda, Kella Juction, Kolonna, Sooriyakanda, Buthkanda",
            "visited_time": "11:57:02"
        },
        {
            "dealer": "Kingsbury tea factory",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "11:28:42"
        },
        {
            "dealer": "Dishanvally tea factory",
            "psa": "Ginnaliya, Kooppakanda, Kella Juction, Kolonna, Sooriyakanda, Buthkanda",
            "visited_time": "12:31:13"
        },
        {
            "dealer": "Ishadhi power cctv",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "11:43:15"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:43:50"
        },
        {
            "dealer": "Ishadhi power cctv",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:51:25"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:52:17"
        },
        {
            "dealer": "Manahara builders",
            "psa": "Weerapana, opatha, Thawalama, Hiniduma",
            "visited_time": "11:28:42"
        },
        {
            "dealer": "Ishadhi power cctv",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:52:17"
        },
        {
            "dealer": "V bekers",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "11:28:42"
        },
        {
            "dealer": "Maduragoda store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "10:50:30"
        },
        {
            "dealer": "Technomart deniyaya",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:49:21"
        },
        {
            "dealer": "New gamini tea factory",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "14:17:16"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "14:46:50"
        },
        {
            "dealer": "D N traders",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "14:59:18"
        },
        {
            "dealer": "Lumbini tea factory",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "10:52:37"
        },
        {
            "dealer": "Vidanapathirana group Pvt LTD",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "12:32:24"
        },
        {
            "dealer": "D N traders",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "18:12:59"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "18:41:08"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "18:41:08"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "19:46:27"
        },
        {
            "dealer": "Manel food city",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "20:06:05"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "16:57:32"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "20:50:49"
        },
        {
            "dealer": "Cct deniyaya",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "21:02:56"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "21:08:04"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "13:32:03"
        },
        {
            "dealer": "Cct deniyaya",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "20:22:02"
        },
        {
            "dealer": "Kumara store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "10:52:37"
        },
        {
            "dealer": "Cct deniyaya",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "22:01:56"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "20:12:10"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "11:28:42"
        },
        {
            "dealer": "Ranasinha store",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "21:10:58"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "15:11:38"
        },
        {
            "dealer": "Super sale cen8",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "17:38:10"
        },
        {
            "dealer": "Vidanapathirana group Pvt LTD",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "10:52:37"
        },
        {
            "dealer": "Kingsbury tea factory",
            "psa": "Kotapola, Kirilipana, Beralapanathara, Urubokka",
            "visited_time": "10:52:37"
        },
        {
            "dealer": "Dasatha book shop",
            "psa": "Weerapana, opatha, Thawalama, Hiniduma",
            "visited_time": "12:21:12"
        }
    ],
    "sales": [
        {
            "dealer": "Cct deniyaya",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Ishadhi power cctv",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "New gamini tea factory",
            "items": []
        },
        {
            "dealer": "Ishadhi power cctv",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Dishanvally tea factory",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 11450.0
                }
            ]
        },
        {
            "dealer": "Kingsbury tea factory",
            "items": [
                {
                    "category": "Bixton High Power Lamps",
                    "total": 5250.0
                }
            ]
        },
        {
            "dealer": "Dishanvally tea factory",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Ishadhi power cctv",
            "items": [
                {
                    "category": "Bixton Flood Light",
                    "total": 2625.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Ishadhi power cctv",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Manahara builders",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Ishadhi power cctv",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "V bekers",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Maduragoda store",
            "items": []
        },
        {
            "dealer": "Technomart deniyaya",
            "items": [
                {
                    "category": "Bixton House Hold Bulbs",
                    "total": 475.0
                }
            ]
        },
        {
            "dealer": "New gamini tea factory",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Super sale cen8",
            "items": [
                {
                    "category": "Bixton High Power Lamps",
                    "total": 5250.0
                }
            ]
        },
        {
            "dealer": "D N traders",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 5950.0
                }
            ]
        },
        {
            "dealer": "Lumbini tea factory",
            "items": []
        },
        {
            "dealer": "Vidanapathirana group Pvt LTD",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 11300.0
                }
            ]
        },
        {
            "dealer": "D N traders",
            "items": [
                {
                    "category": "Bixton High Power Lamps",
                    "total": 10500.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Bixton Tube T5",
                    "total": 6450.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Bixton Tube T5",
                    "total": 6450.0
                }
            ]
        },
        {
            "dealer": "Super sale cen8",
            "items": [
                {
                    "category": "Others",
                    "total": 1925.0
                }
            ]
        },
        {
            "dealer": "Manel food city",
            "items": [
                {
                    "category": "Bixton High Power Lamps",
                    "total": 52500.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Bixton High Power Lamps",
                    "total": 5250.0
                }
            ]
        },
        {
            "dealer": "Super sale cen8",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Cct deniyaya",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Super sale cen8",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 4330.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Others",
                    "total": 1000.0
                },
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 4580.0
                }
            ]
        },
        {
            "dealer": "Cct deniyaya",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 1717.5
                }
            ]
        },
        {
            "dealer": "Kumara store",
            "items": []
        },
        {
            "dealer": "Cct deniyaya",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 8587.5
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 2290.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": [
                {
                    "category": "Others",
                    "total": 385.0
                }
            ]
        },
        {
            "dealer": "Ranasinha store",
            "items": []
        },
        {
            "dealer": "Super sale cen8",
            "items": []
        },
        {
            "dealer": "Super sale cen8",
            "items": [
                {
                    "category": "Bixton Panel light (Metal)",
                    "total": 4580.0
                }
            ]
        },
        {
            "dealer": "Vidanapathirana group Pvt LTD",
            "items": []
        },
        {
            "dealer": "Kingsbury tea factory",
            "items": [
                {
                    "category": "Bixton Flood Light",
                    "total": 3500.0
                }
            ]
        },
        {
            "dealer": "Dasatha book shop",
            "items": [
                {
                    "category": "Bixton Flood Light",
                    "total": 26250.0
                }
            ]
        }
    ],
    "foc": [],
    "market_return": [
        {
            "category": None,
            "total": 1
        },
        {
            "category": None,
            "total": 3
        },
        {
            "category": None,
            "total": 2
        }
    ],
    "payment_details": [
        {
            "cash": 385.0,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 5250.0,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 0,
            "cheque": 385.0,
            "credit": 0.0
        },
        {
            "cash": 2290.0,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 0,
            "cheque": 0,
            "credit": 135.0
        },
        {
            "cash": 0,
            "cheque": 0,
            "credit": 135.0
        },
        {
            "cash": 0,
            "cheque": 0,
            "credit": 85.0
        },
        {
            "cash": 475.0,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 11300.0,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 0,
            "cheque": 0,
            "credit": 5250.0
        },
        {
            "cash": 0,
            "cheque": 1717.5,
            "credit": 0.0
        },
        {
            "cash": 8587.5,
            "cheque": 0,
            "credit": 0.0
        },
        {
            "cash": 0,
            "cheque": 2290.0,
            "credit": 0.0
        },
        {
            "cash": 0,
            "cheque": 0,
            "credit": 215.0
        },
        {
            "cash": 385.0,
            "cheque": 0,
            "credit": -170.0
        }
    ],
    "not_buy_details": [
        {
            "dealer": "Cct deniyaya",
            "reason": " Only have our goods."
        },
        {
            "dealer": "Cct deniyaya",
            "reason": " Only have our goods."
        },
        {
            "dealer": "Cct deniyaya",
            "reason": " Only have our goods."
        },
        {
            "dealer": "Kingsbury tea factory",
            "reason": " Only have our goods."
        },
        {
            "dealer": "Sudesh store",
            "reason": " Only have competitor goods."
        },
        {
            "dealer": "Ranasinha store",
            "reason": " Only have competitor goods."
        },
        {
            "dealer": "New gamini tea factory",
            "reason": " Only have our goods."
        }
    ]
}

main_details = data['main_details']
sales = data['sales']
# category = []
# for sale in sales:
#     category.append(sale['category'])

# unique_categories = set(text for text in category if text is not None)

# # Convert the set back to a list if needed
# unique_categories_list = list(unique_categories)
# print(unique_categories_list)


unique_categories = set()

# Iterate through the 'sales' data and collect unique categories
for sale in sales:
    for item in sale['items']:
        category = item.get('category')
        if category is not None:
            unique_categories.add(category)

# Convert the set to a list if needed
unique_categories_list = list(unique_categories)

category_column_mapping = {category: column_index +
                           5 for column_index, category in enumerate(unique_categories)}

grouped_sales = defaultdict(list)
for sale in sales:
    dealer = sale['dealer']

    items = sale['items']

    # Check if the dealer is already in the grouped_sales dictionary
    if dealer in grouped_sales:
        grouped_sales[dealer]['items'].extend(items)
    else:
        # Create a new entry for the dealer
        grouped_sales[dealer] = {'dealer': dealer, 'items': items}

# Convert the grouped_sales dictionary values to a list
grouped_sales_list = list(grouped_sales.values())
print(grouped_sales_list)

# Create an new Excel file and add a worksheet.
workbook = xlsxwriter.Workbook('demo.xlsx')
worksheet = workbook.add_worksheet()

# Widen the first column to make the text clearer.


# Add a bold format to use to highlight cells.


column = 5
for category, column_index in category_column_mapping.items():
    worksheet.write(1, column_index, category)

i = 3
row_no = 1
for md in main_details:
    worksheet.write(f'A{i}', row_no)
    worksheet.write(f'B{i}', md['dealer'])
    worksheet.write(f'C{i}', md['psa'])
    worksheet.write(f'D{i}', md['visited_time'])
    row_no += 1
    i += 1

current_row = 2
current_column = 5

# openworkbook = openpyxl.load_workbook('demo.xlsx')
# openworksheet = openworkbook.active
# Iterate through the sales data and add total values to the corresponding columns
for sale in data['sales']:
    if len(sale['items']) > 0:
        for i in range(len(sale['items'])):
            category = sale['items'][i]['category']
            total = sale['items'][i]['total']
            column_index = category_column_mapping[category]
            worksheet.write(current_row, column_index, total)
            current_row += 1
            # print(category)

# Write some simple text.


# Text with formatting.
# worksheet.write('A2', 'World', bold)

# Write some numbers, with row/column notation.
# worksheet.write(2, 0, 123)
# worksheet.write(3, 0, 123.456)

# Insert an image.
# worksheet.insert_image('B5', 'logo.png')

workbook.close()

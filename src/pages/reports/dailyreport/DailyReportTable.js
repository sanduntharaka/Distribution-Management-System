import React from 'react'
import './testcss.css'
const DailyReportTable = () => {

    let data = {
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
                "category": "Others",
                "total": 385.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": null,
                "total": 8750.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 11450.0
            },
            {
                "category": "Bixton High Power Lamps",
                "total": 5250.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Bixton Flood Light",
                "total": 2625.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": null,
                "total": 8750.0
            },
            {
                "category": "Bixton House Hold Bulbs",
                "total": 475.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Bixton High Power Lamps",
                "total": 5250.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 5950.0
            },
            {
                "category": null,
                "total": 3500.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 11300.0
            },
            {
                "category": "Bixton High Power Lamps",
                "total": 10500.0
            },
            {
                "category": "Bixton Tube T5",
                "total": 6450.0
            },
            {
                "category": "Bixton Tube T5",
                "total": 6450.0
            },
            {
                "category": "Others",
                "total": 1925.0
            },
            {
                "category": "Bixton High Power Lamps",
                "total": 26250.0
            },
            {
                "category": "Bixton High Power Lamps",
                "total": 5250.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 4330.0
            },
            {
                "category": "Others",
                "total": 1000.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 4580.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 1717.5
            },
            {
                "category": null,
                "total": 3500.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 8587.5
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 2290.0
            },
            {
                "category": "Others",
                "total": 385.0
            },
            {
                "category": null,
                "total": 5250.0
            },
            {
                "category": null,
                "total": 8750.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "total": 4580.0
            },
            {
                "category": null,
                "total": 3500.0
            },
            {
                "category": "Bixton Flood Light",
                "total": 3500.0
            },
            {
                "category": "Bixton Flood Light",
                "total": 26250.0
            }
        ],
        "foc": [
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Bixton High Power Lamps",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 1.0
            },
            {
                "category": "Bixton Flood Light",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Bixton House Hold Bulbs",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Bixton High Power Lamps",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 1.0
            },
            {
                "category": "Bixton High Power Lamps",
                "qty": 0.0
            },
            {
                "category": "Bixton Tube T5",
                "qty": 1.0
            },
            {
                "category": "Bixton Tube T5",
                "qty": 1.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Bixton High Power Lamps",
                "qty": 0.0
            },
            {
                "category": "Bixton High Power Lamps",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 1.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 1.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 1.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": "Others",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Bixton Panel light (Metal)",
                "qty": 0.0
            },
            {
                "category": null,
                "qty": 0.0
            },
            {
                "category": "Bixton Flood Light",
                "qty": 0.0
            },
            {
                "category": "Bixton Flood Light",
                "qty": 0.0
            }
        ],
        "market_return": [
            {
                "category": null,
                "total": 1
            },
            {
                "category": null,
                "total": 3
            },
            {
                "category": null,
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

    console.log(data.main_details.length)
    console.log(data.sales.length)
    console.log(data.market_return.length)

    return (
        <div style={{ overflow: "scroll" }}>
            <table class="tg">
                <thead>
                    <tr>
                        <th class="tg-0pky" rowspan="2"><br />no</th>
                        <th class="tg-0pky" rowspan="2"><br />Name of outlet</th>
                        <th class="tg-0pky" rowspan="2"><br />Location/Town</th>
                        <th class="tg-0pky" rowspan="2"><br />Time</th>
                        <th class="tg-0pky" colspan="2">Present O/S</th>
                        <th class="tg-0pky" colspan="7">Targeted Sale</th>
                        <th class="tg-0pky" colspan="7">Sales Made</th>
                        <th class="tg-0pky" colspan="7">Free Issues</th>
                        <th class="tg-0lax" colspan="7">Market Returns</th>
                        <th class="tg-0lax" colspan="2">Old Payment Collected</th>
                        <th class="tg-0lax" colspan="2">Non Buying dealers</th>
                    </tr>
                    <tr>
                        <th class="tg-0pky">Amount</th>
                        <th class="tg-0pky">Since When</th>

                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0pky"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax"></th>
                        <th class="tg-0lax">Dealer Name</th>
                        <th class="tg-0lax">Reason</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>{
                        data.length > 0 ?
                            data.main_details.map((main, i) => (
                                <tr color='black'>
                                    <td class="tg-0pky">{i + 1}</td>
                                    <td class="tg-0pky">{main.dealer}</td>
                                    <td class="tg-0pky">{main.psa}</td>
                                    <td class="tg-0pky">{main.visited_time}</td>
                                </tr>
                            ))
                            : ''
                    }

                        {/* <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0pky"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td>
                        <td class="tg-0lax"></td> */}
                    </tr>
                </tbody>
            </table>
        </div>
    )

}

export default DailyReportTable
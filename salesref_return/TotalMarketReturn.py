from salesref_return.models import SalesRefReturn, SalesRefReturnItem
from django.db.models import Prefetch, Sum


class TotalMarketReturn:
    def __init__(self, date) -> None:
        self.market_return = SalesRefReturn.objects.filter(date=date)

    def getCountReturnGoods(self):
        goods_returns = [i for i in self.market_return if i.is_return_goods]
        print(goods_returns)
        return len(goods_returns)

    def totalReturnGoodsItems(self):
        sales_ref_returns = SalesRefReturn.objects.filter(is_return_goods=True).prefetch_related(
            Prefetch('salesrefreturnitem_set', queryset=SalesRefReturnItem.objects.all(
            ), to_attr='return_items')
        )

        total_qty = sum(
            [item.qty for sales_ref_return in sales_ref_returns for item in sales_ref_return.return_items])
        return total_qty

    def getCountDeductBill(self):
        returns = [i.amount for i in self.market_return if i.is_deduct_bill]
        return len(returns), sum(returns)

    def totalDeductBillItems(self):

        sales_ref_returns = SalesRefReturn.objects.filter(is_deduct_bill=True).prefetch_related(
            Prefetch('salesrefreturnitem_set', queryset=SalesRefReturnItem.objects.all(
            ), to_attr='return_items')
        )

        total_qty = sum(
            [item.qty for sales_ref_return in sales_ref_returns for item in sales_ref_return.return_items])
        return total_qty

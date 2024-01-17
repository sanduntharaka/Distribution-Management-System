from django.db.models.signals import post_save
from django.dispatch import receiver
from distrubutor_salesref_invoice.models import SalesRefInvoice
from sales_route.models import SalesRoute, DailyStatus
from dealer_details.models import Dealer
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist

date = datetime.today()
day_name = date.strftime("%A").lower()


@receiver(post_save, sender=SalesRefInvoice)
def daily_sales_routes_handler(sender, instance, created, *args, **kwargs):
    try:
        if instance.added_by.user.is_salesref:
            route = SalesRoute.objects.get(
                salesref=instance.dis_sales_ref.sales_ref, day=day_name)
            try:
                daily_status = DailyStatus.objects.get(
                    date=date, route=route)
                data = {
                    'id': instance.dealer.id,
                    'time': instance.time.strftime('%H:%M:%S'),
                    'status': 'Bill'
                }

                covered = daily_status.coverd
                covered.append(data)

                daily_status.coverd = covered
                daily_status.save()

            except DailyStatus.DoesNotExist:

                data = {
                    'id': instance.dealer.id,
                    'time': instance.time.strftime('%H:%M:%S'),
                    'status': 'Bill'
                }
                data_list = [data]
                to_create_new = DailyStatus(
                    route=route, current_plan=route.dealers, date=date, coverd=data_list)

                to_create_new.save()
    except:
        pass

from django.db.models.signals import post_save
from django.dispatch import receiver
from not_buy_details.models import NotBuyDetails
from sales_route.models import SalesRoute, DailyStatus
from dealer_details.models import Dealer
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist


@receiver(post_save, sender=NotBuyDetails)
def daily_sales_routes_handler(sender, instance, created, *args, **kwargs):
    try:
        route = SalesRoute.objects.get(
            salesref=instance.dis_sales_ref.sales_ref)

        try:
            # update existing data
            daily_status = DailyStatus.objects.get(
                date=datetime.today(), route=route)
            data = {
                'id': instance.dealer.id,
                'time': instance.datetime.time().strftime('%H:%M:%S'),
                'status': 'Not Buy'
            }

            covered = daily_status.coverd
            covered.append(data)

            daily_status.coverd = covered
            daily_status.save()

        except DailyStatus.DoesNotExist:
            # add new data

            data = {
                'id': instance.dealer.id,
                'time': instance.datetime.time().strftime('%H:%M:%S'),
                'status': 'Not Buy'

            }
            data_list = [data]
            to_create_new = DailyStatus(
                route=route, current_plan=route.dealers, date=datetime.today(), coverd=data_list)

            to_create_new.save()
        except Exception as e:
            print(e)
    except:
        pass

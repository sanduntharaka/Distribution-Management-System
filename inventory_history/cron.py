from django_cron import CronJobBase, Schedule
from distributor_inventory.models import DistributorInventoryItems
from inventory_history.models import DistributorHistoryItem


class AutoCreateCronJob(CronJobBase):
    RUN_AT_TIMES = ['23:00']
    RETRY_AFTER_FAILURE_MINS = 15
    schedule = Schedule(run_at_times=RUN_AT_TIMES,
                        retry_after_failure_mins=RETRY_AFTER_FAILURE_MINS)
    code = 'inventory_history.auto_create_cron_job'

    def do(self):
        items = DistributorInventoryItems.objects.filter(qty__gt=0)
        for item in items:

            history = DistributorHistoryItem(
                item=item, qty=item.qty, foc=item.foc)
            history.save()

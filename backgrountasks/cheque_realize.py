
from distrubutor_salesref_invoice.models import ChequeDetails
from datetime import datetime, timedelta
current_date = datetime.now()
yesterday = current_date - timedelta(days=1)


def realizeAllCheques():
    yesterday_cheques = ChequeDetails.objects.filter(
        date=yesterday, status='pending')
    for cheque in yesterday_cheques:
        cheque.status = 'cleared'
        cheque.save()

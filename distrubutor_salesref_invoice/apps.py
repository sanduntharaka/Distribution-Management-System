from django.apps import AppConfig


class DistrubutorSalesrefInvoiceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'distrubutor_salesref_invoice'

    def ready(self) -> None:
        import distrubutor_salesref_invoice.signals

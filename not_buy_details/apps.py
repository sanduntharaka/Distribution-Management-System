from django.apps import AppConfig


class NotBuyDetailsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'not_buy_details'

    def ready(self) -> None:
        import not_buy_details.signals

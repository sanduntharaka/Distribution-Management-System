from .models import CompanyInventory


class CountCompanyInventory:
    def __init__(self, date):
        self.date = date

    def getCountWthoutZero(self):
        return CompanyInventory.objects.exclude(qty=0).count()

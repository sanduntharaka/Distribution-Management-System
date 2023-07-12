from distrubutor_salesref.models import SalesRefDistributor
from executive_distributor.models import ExecutiveDistributor
from manager_distributor.models import ManagerDistributor
from exceutive_manager.models import ExecutiveManager
from userdetails.models import UserDetails


class UsersUnderManager:
    def __init__(self, id) -> None:
        self.id = id
        self.users = []

    def get_users_under_to_me_ids(self):
        exectives = ExecutiveManager.objects.filter(
            manager=self.id).values_list('executive', flat=True)
        self.users.append(exectives)
        destributors = ManagerDistributor.objects.filter(
            manager=self.id).values_list('distributor', flat=True)
        self.users.extend(destributors)
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=destributors).values_list('sales_ref', flat=True)
        self.users.extend(salesrefs)

        return self.users

    def get_users_under_to_me_with_me_ids(self):
        self.users.append(self.id)
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=self.id).values_list('sales_ref', flat=True)
        self.users.extend(salesrefs)
        return self.users

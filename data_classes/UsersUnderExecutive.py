from distrubutor_salesref.models import SalesRefDistributor
from executive_distributor.models import ExecutiveDistributor
from manager_distributor.models import ManagerDistributor
from userdetails.models import UserDetails


class UsersUnderExecutive:
    def __init__(self, id) -> None:
        self.id = id
        self.users = []

    def get_users_under_to_me_ids(self):
        destributors = ExecutiveDistributor.objects.filter(
            executive__user=self.id).values_list('distributor', flat=True)
        self.users.extend(list(destributors))
        salesrefs = SalesRefDistributor.objects.filter(
            distributor__in=destributors).values_list('sales_ref', flat=True)
        self.users.extend(list(salesrefs))

        return self.users

    def get_users_under_to_me_with_me_ids(self):
        self.users.append(self.id)
        salesrefs = SalesRefDistributor.objects.filter(
            distributor=self.id).values_list('sales_ref', flat=True)
        self.users.extend(salesrefs)
        return self.users

from distrubutor_salesref.models import SalesRefDistributor
from manager_distributor.models import ManagerDistributor
from executive_distributor.models import ExecutiveDistributor
from userdetails.models import UserDetails


class UsersUnderDestributor:
    def __init__(self, id) -> None:
        self.id = id
        self.users = []

    def get_users_under_to_me_ids(self):
        self.users = SalesRefDistributor.objects.filter(
            distributor=self.id).values_list('sales_ref', flat=True)
        return self.users

    def get_users_under_to_me_with_me_ids(self):
        self.users.append(self.id)
        manager = ManagerDistributor.objects.get(
            distributor=self.id).manager.id
        self.users.append(manager)
        executive = ExecutiveDistributor.objects.get(
            distributor=self.id).executive.id
        self.users.append(executive)

        salesrefs = SalesRefDistributor.objects.filter(
            distributor=self.id).values_list('sales_ref', flat=True)
        self.users.extend(salesrefs)
        return self.users

    # def get_users_my_cluster_ids(self):
    #     managers = ManagerDistributor.objects.get(
    #             distributor__user=user)
    #     salesrefs = SalesRefDistributor.objects.filter(distributor=self.id).values_list('sales_ref', flat=True)
    #     return salesrefs

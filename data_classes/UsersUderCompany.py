from userdetails.models import UserDetails


class UsersUnderCompany:
    def __init__(self, id) -> None:
        self.id = id
        self.users = []

    def get_users_under_to_me_ids(self):
        """
        return all users without me. returns as list.
        ex:- [12, 6, 7, 8]
        this numbers all user details ids
        """
        self.users = list(UserDetails.objects.exclude(
            id=self.id).values_list('id', flat=True))
        return self.users

    def get_users_under_to_me_with_me_ids(self):
        self.users = list(UserDetails.objects.all())
        return self.users

from rest_framework import serializers
from sales_ref_leave.models import SalesRefLeave


class CreateLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefLeave
        fields = ('salesref', 'leave_apply_date', 'leave_end_date', 'reason',
                  'number_of_dates', 'is_annual', 'is_casual', 'is_sick', 'return_to_work', 'created_by')


class GetAllLeavesSerializer(serializers.ModelSerializer):
    leave_type = serializers.CharField(source='get_leave_type')
    leave_status = serializers.CharField(source='get_aproved_status')

    class Meta:
        model = SalesRefLeave
        fields = ('id', 'salesref', 'leave_apply_date', 'leave_end_date', 'reason',
                  'number_of_dates', 'is_annual', 'is_casual', 'is_sick', 'return_to_work', 'created_by', 'leave_type', 'leave_status')


class ApproveLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRefLeave
        fields = ('approved', 'approved_by')

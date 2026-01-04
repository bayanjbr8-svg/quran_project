from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        # السماح بالقراءة فقط
        if request.method in SAFE_METHODS:
            return True

        # السماح فقط للمعلم
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "teacher"
        )

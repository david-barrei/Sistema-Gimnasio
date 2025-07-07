from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'


class MembershipConfig(AppConfig):
    name = 'users'
    verbose_name = "Usuarios"
    

    def ready(self):
        from django_celery_beat.models import PeriodicTask, IntervalSchedule
        from .tasks import remind_expiring_clients

        # crear un schedule que corra cada dia
        schedule, _ = IntervalSchedule.objects.get_or_create(
            every =1,
            period = IntervalSchedule.DAYS
        )
        # registra la tarea si no existe

        PeriodicTask.objects.get_or_create(
            interval=schedule,
            name='Recordatorio vencimiento membresias',
            task = 'memberships.tasks.remind_expiring_memberships',
        )
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

        # Intenta limpiar duplicados si los hay
        qs = IntervalSchedule.objects.filter(every=1, period=IntervalSchedule.DAYS)
        if qs.count() > 1:
            # deja solo la más antigua
            first = qs.earliest('id')
            qs.exclude(pk=first.pk).delete()

        # crear un schedule que corra cada dia
        schedule, _ = IntervalSchedule.objects.get_or_create(
            every =1,
            period = IntervalSchedule.DAYS
        )
        # registra la tarea si no existe

        PeriodicTask.objects.update_or_create(
            name="Tarea periódica",  # campo único
            defaults={
                "interval": schedule,
                "task": "users.tasks.remind_expiring_clients",
                # si pasas args, kwargs, start_time, etc. ponlos aquí dentro de defaults
            }
        )
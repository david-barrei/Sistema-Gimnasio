
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from .models import Client


@shared_task
def remind_expiring_clients():
    #calculamos dentro de 3 dias
    target_date = timezone.now().date() + timedelta(days=3)
    #buscamos todos los clientes cuya end_date coincida
    expiring = Client.objects.filter(end_date=target_date)
    for client in expiring:
         send_mail(
            subject="Tu membresía está por vencer",
            message=(
                f"Hola {client.first_name},\n\n"
                f"Tu membresía de tipo “{client.get_membership_type_display()}” vence el {client.end_date:%d/%m/%Y}.\n"
                "¡No olvides renovarla a tiempo para seguir disfrutando del gimnasio!\n\n"
                "— El equipo del Gym"
            ),
            from_email="kevtamay@gmail.com",
            recipient_list=[client.email],
        )



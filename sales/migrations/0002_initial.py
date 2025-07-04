# Generated by Django 5.2.1 on 2025-06-01 19:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sales', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='saledetail',
            name='product_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.product'),
        ),
        migrations.AddField(
            model_name='saledetail',
            name='sale_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sales.sale'),
        ),
    ]

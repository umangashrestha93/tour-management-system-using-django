# Generated by Django 4.0.3 on 2022-05-04 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TourM', '0025_delete_provinces_remove_post_provinces'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='Provinces',
            field=models.CharField(default='', max_length=255),
        ),
    ]
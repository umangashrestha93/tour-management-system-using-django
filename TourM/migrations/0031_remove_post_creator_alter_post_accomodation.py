# Generated by Django 4.0.3 on 2022-05-04 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TourM', '0030_alter_post_accomodation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='creator',
        ),
        migrations.AlterField(
            model_name='post',
            name='Accomodation',
            field=models.CharField(default='', max_length=255),
        ),
    ]
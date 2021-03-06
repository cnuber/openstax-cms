# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-12 22:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields
import wagtail.wagtailcore.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0010_change_on_delete_behaviour'),
        ('wagtailcore', '0023_alter_page_revision_on_delete_behaviour'),
        ('wagtaildocs', '0004_capitalizeverbose'),
        ('pages', '0025_auto_20160112_1045'),
    ]

    operations = [
        migrations.CreateModel(
            name='OpenStaxTeam',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link_external', models.URLField(blank=True, verbose_name='External link')),
                ('name', models.CharField(help_text='Team Member Name', max_length=255)),
                ('description', wagtail.wagtailcore.fields.RichTextField()),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.Image')),
                ('link_document', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtaildocs.Document')),
                ('link_page', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtailcore.Page')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StrategicAdvisors',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link_external', models.URLField(blank=True, verbose_name='External link')),
                ('name', models.CharField(help_text='Strategic Advisor Name', max_length=255)),
                ('description', wagtail.wagtailcore.fields.RichTextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RenameField(
            model_name='funders',
            old_name='logo',
            new_name='image',
        ),
        migrations.AddField(
            model_name='aboutus',
            name='openstax_team_intro',
            field=wagtail.wagtailcore.fields.RichTextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='aboutus',
            name='strategic_advisors_intro',
            field=wagtail.wagtailcore.fields.RichTextField(default=''),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='AboutUsOpenStaxTeam',
            fields=[
                ('strategicadvisors_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='pages.StrategicAdvisors')),
                ('sort_order', models.IntegerField(blank=True, editable=False, null=True)),
                ('page', modelcluster.fields.ParentalKey(on_delete=django.db.models.deletion.CASCADE, related_name='openstax_team', to='pages.AboutUs')),
            ],
            options={
                'ordering': ['sort_order'],
                'abstract': False,
            },
            bases=('pages.strategicadvisors', models.Model),
        ),
        migrations.CreateModel(
            name='AboutUsStrategicAdvisors',
            fields=[
                ('strategicadvisors_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='pages.StrategicAdvisors')),
                ('sort_order', models.IntegerField(blank=True, editable=False, null=True)),
                ('page', modelcluster.fields.ParentalKey(on_delete=django.db.models.deletion.CASCADE, related_name='strategic_advisors', to='pages.AboutUs')),
            ],
            options={
                'ordering': ['sort_order'],
                'abstract': False,
            },
            bases=('pages.strategicadvisors', models.Model),
        ),
        migrations.AddField(
            model_name='strategicadvisors',
            name='image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.Image'),
        ),
        migrations.AddField(
            model_name='strategicadvisors',
            name='link_document',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtaildocs.Document'),
        ),
        migrations.AddField(
            model_name='strategicadvisors',
            name='link_page',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='wagtailcore.Page'),
        ),
    ]

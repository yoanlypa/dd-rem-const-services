from django.db import models

from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from wagtail import blocks
from wagtail.images.models import Image


class NavItemBlock(blocks.StructBlock):
    label = blocks.CharBlock(max_length=24)
    href = blocks.CharBlock(
        max_length=200,
        help_text="Use #anchor, /path/ or full URL"
    )

    class Meta:
        icon = "link"
        label = "Navigation item"


@register_setting
class SiteChromeSettings(BaseSiteSetting):
    logo_desktop = models.ForeignKey(
        Image, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )
    logo_mobile = models.ForeignKey(
        Image, null=True, blank=True, on_delete=models.SET_NULL, related_name="+"
    )

    support_label = models.CharField(max_length=30, blank=True, default="Support 24/7")
    support_phone = models.CharField(max_length=40, blank=True, default="+34 600 000 000")

    show_mobile_header = models.BooleanField(default=True)
    show_mobile_support = models.BooleanField(default=True)

    navigation = StreamField(
        [
            ("item", NavItemBlock()),
        ],
        use_json_field=True,
        blank=True,
    )

    panels = [
        FieldPanel("logo_desktop"),
        FieldPanel("logo_mobile"),
        FieldPanel("support_label"),
        FieldPanel("support_phone"),
        FieldPanel("show_mobile_header"),
        FieldPanel("show_mobile_support"),
        FieldPanel("navigation"),
    ]

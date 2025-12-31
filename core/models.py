from django.db import models
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey
from wagtail.images.models import Image
from wagtail.models import Page, Orderable, Site
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel
from wagtail import blocks

from .blocks import (
    HeroBlock, FeatureBandBlock, PricingBlock, TestimonialsBlock,
    FaqBlock, ValuesBlock, StatsBlock,
)


class SiteChrome(ClusterableModel):
    site = models.OneToOneField(Site, on_delete=models.CASCADE, related_name="chrome")

    logo_desktop = models.ForeignKey(Image, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    logo_mobile = models.ForeignKey(Image, null=True, blank=True, on_delete=models.SET_NULL, related_name="+")

    support_label = models.CharField(max_length=30, blank=True, default="Support 24/7")
    support_phone = models.CharField(max_length=40, blank=True, default="+34 600 000 000")

    show_mobile_header = models.BooleanField(default=True)
    show_mobile_support = models.BooleanField(default=True)

    panels = [
        FieldPanel("site"),
        FieldPanel("logo_desktop"),
        FieldPanel("logo_mobile"),
        FieldPanel("support_label"),
        FieldPanel("support_phone"),
        FieldPanel("show_mobile_header"),
        FieldPanel("show_mobile_support"),
        InlinePanel("nav_items", label="Navigation items"),
    ]

    def __str__(self):
        return f"SiteChrome ({self.site.hostname})"


class NavItem(Orderable):
    chrome = ParentalKey(SiteChrome, on_delete=models.CASCADE, related_name="nav_items")

    label = models.CharField(max_length=24)
    href = models.CharField(max_length=200, help_text="Use #anchor (e.g. #projects) or /path/ or full URL.")

    panels = [
        FieldPanel("label"),
        FieldPanel("href"),
    ]

    def __str__(self):
        return self.label
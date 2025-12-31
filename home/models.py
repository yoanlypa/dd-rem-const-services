from django.db import models
from core.models import SiteChrome

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel

from core.blocks import (
    HeroBlock,
    FeatureBandBlock,
    PricingBlock,
    TestimonialsBlock,
    FaqBlock,
    ValuesBlock,
    StatsBlock,
    HeroSplitSliderBlock,
)


class HomePage(Page):
    header_phone = models.CharField(max_length=40, blank=True)
    header_cta_text = models.CharField(max_length=20, blank=True, default="Discover")
    header_cta_url = models.URLField(blank=True)

    body = StreamField(
        [
            ("hero_split_slider", HeroSplitSliderBlock()),  # mejor primero
            ("hero", HeroBlock()),
            ("feature_band", FeatureBandBlock()),
            ("stats", StatsBlock()),
            ("values", ValuesBlock()),
            ("pricing", PricingBlock()),
            ("testimonials", TestimonialsBlock()),
            ("faq", FaqBlock()),
        ],
        use_json_field=True,
        blank=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("header_phone"),
        FieldPanel("header_cta_text"),
        FieldPanel("header_cta_url"),
        FieldPanel("body"),
    ]

    max_count = 1

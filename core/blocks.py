from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class ButtonBlock(blocks.StructBlock):
    text = blocks.CharBlock(required=True, max_length=40)
    url = blocks.URLBlock(required=True)

    class Meta:
        icon = "link"
        label = "Button"


class HeroBlock(blocks.StructBlock):
    headline = blocks.CharBlock(required=False, max_length=80)
    subheadline = blocks.TextBlock(required=False, max_length=200)
    primary_button = ButtonBlock(required=False)

    image_1 = ImageChooserBlock(required=False)
    image_2 = ImageChooserBlock(required=False)
    image_3 = ImageChooserBlock(required=False)

    class Meta:
        template = "core/blocks/hero.html"
        icon = "image"
        label = "Hero (Collage)"


class FeatureBandBlock(blocks.StructBlock):
    eyebrow = blocks.CharBlock(required=False, max_length=40)
    title = blocks.CharBlock(required=True, max_length=80)
    text = blocks.TextBlock(required=False, max_length=400)
    button = ButtonBlock(required=False)
    image = ImageChooserBlock(required=False)
    badge_value = blocks.CharBlock(required=False, max_length=10, default="13k")
    badge_label = blocks.CharBlock(required=False, max_length=40, default="Happy customers")

    class Meta:
        template = "core/blocks/feature_band.html"
        icon = "placeholder"
        label = "Feature Band (Dark)"


class PricingPlanBlock(blocks.StructBlock):
    is_recommended = blocks.BooleanBlock(required=False, default=False)
    name = blocks.CharBlock(required=True, max_length=30)
    price = blocks.CharBlock(required=True, max_length=20)
    period = blocks.CharBlock(required=False, max_length=20, default="monthly")
    features = blocks.ListBlock(blocks.CharBlock(max_length=60), required=False)
    button = ButtonBlock(required=False)

    class Meta:
        icon = "tag"
        label = "Pricing Plan"


class PricingBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, max_length=80)
    text = blocks.TextBlock(required=False, max_length=400)
    helper_title = blocks.CharBlock(required=False, max_length=50, default="Get in touch")
    helper_text = blocks.TextBlock(required=False, max_length=250)
    helper_phone = blocks.CharBlock(required=False, max_length=40)

    plans = blocks.ListBlock(PricingPlanBlock(), min_num=1, max_num=3)

    class Meta:
        template = "core/blocks/pricing.html"
        icon = "list-ul"
        label = "Pricing"


class TestimonialBlock(blocks.StructBlock):
    quote = blocks.TextBlock(required=True, max_length=400)
    author_name = blocks.CharBlock(required=True, max_length=60)
    author_role = blocks.CharBlock(required=False, max_length=60)
    avatar = ImageChooserBlock(required=False)

    class Meta:
        icon = "user"
        label = "Testimonial"


class TestimonialsBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=False, max_length=80)
    items = blocks.ListBlock(TestimonialBlock(), min_num=1, max_num=8)

    class Meta:
        template = "core/blocks/testimonials.html"
        icon = "group"
        label = "Testimonials"


class FaqItemBlock(blocks.StructBlock):
    question = blocks.CharBlock(required=True, max_length=120)
    answer = blocks.TextBlock(required=True, max_length=600)

    class Meta:
        icon = "help"
        label = "FAQ Item"


class FaqBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=False, max_length=80)
    items = blocks.ListBlock(FaqItemBlock(), min_num=1, max_num=10)
    image = ImageChooserBlock(required=False)

    class Meta:
        template = "core/blocks/faq.html"
        icon = "help"
        label = "FAQ"


class ValueCardBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, max_length=60)
    text = blocks.TextBlock(required=False, max_length=300)
    image = ImageChooserBlock(required=False)

    class Meta:
        icon = "doc-full"
        label = "Value Card"


class ValuesBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=False, max_length=80, default="Our values")
    cards = blocks.ListBlock(ValueCardBlock(), min_num=1, max_num=6)

    class Meta:
        template = "core/blocks/values.html"
        icon = "form"
        label = "Values"


class StatItemBlock(blocks.StructBlock):
    value = blocks.CharBlock(required=True, max_length=20)
    label = blocks.CharBlock(required=True, max_length=40)

    class Meta:
        icon = "plus"
        label = "Stat"


class StatsBlock(blocks.StructBlock):
    items = blocks.ListBlock(StatItemBlock(), min_num=2, max_num=6)

    class Meta:
        template = "core/blocks/stats.html"
        icon = "bars"
        label = "Stats"

class HeroSlideBlock(blocks.StructBlock):
    image = ImageChooserBlock(required=True)
    alt = blocks.CharBlock(required=False, max_length=120, default="Hero slide")
    eyebrow = blocks.CharBlock(required=False, max_length=40)
    title = blocks.CharBlock(required=False, max_length=80)

    class Meta:
        icon = "image"
        label = "Slide"


class HeroSplitSliderBlock(blocks.StructBlock):

    show_slide_captions = blocks.BooleanBlock(
        required=False,
        default=True,
        help_text="Show title and eyebrow text on slider images"
    )

    slides = blocks.ListBlock(
        blocks.StructBlock([
            ("image", ImageChooserBlock(required=True)),
            ("eyebrow", blocks.CharBlock(required=False)),
            ("title", blocks.CharBlock(required=False)),
            ("alt", blocks.CharBlock(required=False)),
        ])
    )

    autoplay = blocks.BooleanBlock(required=False, default=True)
    autoplay_seconds = blocks.IntegerBlock(required=False, default=6)
    show_arrows = blocks.BooleanBlock(required=False, default=True)
    show_dots = blocks.BooleanBlock(required=False, default=True)

    class Meta:
        template = "core/blocks/hero_split_slider.html"
        icon = "image"
        label = "Hero Split Slider"

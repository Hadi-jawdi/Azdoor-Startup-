from django.db import models
from django.conf import settings

CATEGORY_CHOICES = [
    ("real-estate", "املاک"),
    ("vehicles", "وسایط نقلیه"),
    ("digital", "دیجیتال"),
    ("home-goods", "لوازم خانه"),
    ("jobs", "استخدام"),
    ("services", "خدمات"),
]


class Listing(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=150)
    price = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
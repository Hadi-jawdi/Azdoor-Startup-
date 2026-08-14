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


#for uploading images of the ads 
class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="listings/")
    created_at = models.DateTimeField(auto_now_add=True)



# for user favorites


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "listing")
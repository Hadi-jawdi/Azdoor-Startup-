from django.db import models
from django.conf import settings



CATEGORY_CHOICES = [
    ("real-estate", "املاک"),
    ("vehicles", "وسایط نقلیه"),
    ("home-goods", "لوازم خانه"),
    ("jobs", "استخدام"),
]

DEAL_TYPE_CHOICES = [
    ("rent", "اجاره"),
    ("sale", "فروش"),
    ("mortgage", "رهن"),
]

PROPERTY_TYPE_CHOICES = [
    ("residential", "مسکونی"),
    ("commercial", "تجاری"),
    ("admin-commercial", "اداری و تجاری"),
    
]

EMPLOYMENT_TYPE_CHOICES = [
    ("full-time", "تمام وقت"),
    ("part-time", "پاره وقت"),
    ("remote", "دورکار"),
    ("internship", "کارآموزی"),
]


class Listing(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=150)
    price = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=100)
    address = models.CharField(max_length=500, default='لطفآ تماس  بگیرید')

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    deal_type = models.CharField(max_length=10, choices=DEAL_TYPE_CHOICES, blank=True, null=True)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, blank=True, null=True)
    employment_type = models.CharField(max_length=15, choices=EMPLOYMENT_TYPE_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    #for video 
    video = models.FileField(upload_to="listing_videos/", blank=True, null=True)
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


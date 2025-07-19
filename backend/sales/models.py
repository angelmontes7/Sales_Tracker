from django.db import models

# Sales table
class Sale(models.Model):
    user_display_name = models.CharField(max_length=255) # Users name
    amount = models.DecimalField(max_digits=10, decimal_places=2) # sale amount
    issued_carrier = models.CharField(max_length=100, blank=True, null=True) # carrier that is issuing policy
    raw_message = models.TextField() # the entire context of message sent
    is_verified = models.BooleanField(default=False) # if policy is confirmed or being review by carrier
    timestamp = models.DateTimeField(auto_now_add=True) # time the message was sent
    date_of_sale = models.DateField(blank=True, null=True) # the date the policy actually drafts

    def __str__(self):
        return f"{self.user_display_name} - ${self.amount}"

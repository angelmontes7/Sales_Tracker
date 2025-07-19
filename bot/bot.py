from dotenv import load_dotenv
import discord
import os
import re
import requests
import threading
from datetime import datetime, timezone

# in terminal type ""python bot.py"" to run bot
load_dotenv()  # Load variables from .env

# Sets the intents for the bot and registers the client
intents = discord.Intents.all()
intents.message_content = True
client = discord.Client(intents=intents)

# Backend API url
API_URL = "http://127.0.0.1:8000/api/sales/"

CARRIER_KEYWORDS = {
    "americo": "Americo",
    "amam": "AmAm",
    "am am": "AmAm",
    "ethos": "Ethos",
    "aetna": "Aetna",
    "corebridge": "Corebridge",
    "transunion": "Transunion",
    "mu": "Mutual of Omaha",
    "moo": "Mutual of Omaha",
    "mo": "Mutual of Omaha",
    "mutual of omaha": "Mutual of Omaha"
}

negative_verification_keywords = ["ho", "h/o", "home office"]

def send_sale_to_api(sale_data):
    headers = {"Content-Type": "application/json",
               "Authorization": f"Token {os.getenv('DJANGO_API_TOKEN')}"}
    try:
        response = requests.post(API_URL, json=sale_data, headers=headers) # stores the repose got from post request in response variable
        response.raise_for_status() # raises error if one occurs
        print("Sale data sent successfully:", response.json()) # logging if post request was a success
    except requests.exceptions.RequestException as e:
        print("Failed to send sale data:", e)

# Logs when bot is online
@client.event
async def on_ready():
    print(f"We have logged in as {client.user}")

# Filters through users and logs sale
@client.event
async def on_message(message):

    # Cancels check if message is from the bot
    if message.author == client.user:
        return
    
    # Checks if the user is from the correct organization
    display_name = message.author.display_name
    if "viper" not in display_name.lower():
        return
    
    # Number extraction and logging starts here:
    pattern = r"\$(\d+(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)" # regex pattern for pulling sale number out of message
    date_pattern = r'\b\d{1,2}/\d{1,2}\b'
    matches = re.findall(pattern, message.content) # stores all occurences that match regex pattern into a list

    # Checks if list is not empty
    if matches:
        raw_amount = matches[0].replace(',', '') # removes commas
        amount = float(raw_amount) if '.' in raw_amount else int(raw_amount) #converts string to integer or float
        time_iso = datetime.now(timezone.utc).isoformat() # Gets the timestamp for when the message was made
        lower_message = message.content.lower() #convert message to lowercase

        # loops through all keywords. First match breaks the loop and stores the carrier. no match stays None.
        issued_carrier = None
        for keyword, standard_name in CARRIER_KEYWORDS.items():
            if keyword in lower_message:
                issued_carrier = standard_name
                break
        
        # if any of the negative_verification keywords are in message then is_verified is false otherwise its true
        is_verified = not any(keyword in lower_message for keyword in negative_verification_keywords)

        # Extract date_of_sale using regex search
        date_match = re.search(date_pattern, message.content)
        if date_match:
            date_str = date_match.group(0)
            try:
                # Parse month/day
                parsed_date = datetime.strptime(date_str, "%m/%d")
                # Add current year
                parsed_date = parsed_date.replace(year=datetime.now().year)
                date_of_sale = parsed_date.strftime("%Y-%m-%d")  # Format: '2025-08-03'
            except ValueError:
                date_of_sale = None
        else:
            date_of_sale = None

        print(f"[{display_name}] sent sale of ${amount} at time: {time_iso}") # logs the result

        # Build the sale data dictionary
        sale_data = {
            "user_display_name": display_name,
            "amount": amount,
            "issued_carrier": issued_carrier, 
            "raw_message": message.content,
            "is_verified": is_verified,
            "timestamp": time_iso,
            "date_of_sale": date_of_sale
        }

        # Send to backend API in a separate thread so bot doesn't freeze
        threading.Thread(target=send_sale_to_api, args=(sale_data,)).start()

client.run(os.getenv('DISCORD_TOKEN'))

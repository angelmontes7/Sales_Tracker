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
    matches = re.findall(pattern, message.content) # stores all occurences that match regex pattern into a list

    # Checks if list is not empty
    if matches:
        raw_amount = matches[0].replace(',', '') # removes commas
        amount = float(raw_amount) if '.' in raw_amount else int(raw_amount) #converts string to integer or float
        time_iso = datetime.now(timezone.utc).isoformat() # Gets the timestamp for when the message was made
        print(f"[{display_name}] sent sale of ${amount} at time: {time_iso}") # logs the result

        # Build the sale data dictionary
        sale_data = {
            "user_display_name": display_name,
            "amount": amount,
            "issued_carrier": None,  # TODO create string parsing to extract carrier
            "raw_message": message.content,
            "is_verified": False, # TODO create string parsing to extract whether theres a home office message (HO)
            "timestamp": time_iso,
            "date_of_sale": None # TODO create string parsing to extract whether it was a DOA or theres a date in the message
        }

        # Send to backend API in a separate thread so bot doesn't freeze
        threading.Thread(target=send_sale_to_api, args=(sale_data,)).start()

client.run(os.getenv('DISCORD_TOKEN'))

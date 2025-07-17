from dotenv import load_dotenv
import discord
import os
import re

load_dotenv()  # Load variables from .env

# Sets the intents for the bot and registers the client
intents = discord.Intents.all()
intents.message_content = True
client = discord.Client(intents=intents)

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
        print(f"[{display_name}] sent sale of ${amount}") # logs the result

client.run(os.getenv('DISCORD_TOKEN'))

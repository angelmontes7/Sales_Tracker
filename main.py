from dotenv import load_dotenv
import discord
import os

load_dotenv()  # Load variables from .env

intents = discord.Intents.all()
intents.message_content = True
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"We have logged in as {client.user}")

@client.event
async def on_message(message):
    if message.content.startswith('$hello'):
        await message.channel.send("Hello!")

client.run(os.getenv('DISCORD_TOKEN'))

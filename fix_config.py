#!/usr/bin/env python3
import sys

# Read the file
with open('/var/www/AksharJobs/backend/config.py', 'r') as f:
    content = f.read()

# Replace the problematic line
old_line = "load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.production'))"
new_line = "load_dotenv('.env.production')"

content = content.replace(old_line, new_line)

# Write back
with open('/var/www/AksharJobs/backend/config.py', 'w') as f:
    f.write(content)

print("Fixed config.py to load .env.production correctly")


#!/usr/bin/env python3

# Read the file
with open('/var/www/AksharJobs/backend/routes/contact_routes.py', 'r') as f:
    content = f.read()

# Replace the broken line
old_line = '''        logging.info(f'Contact form submitted by {data.get(" name\)} ({data.get(\email\)}): {data.get(\message\, \\)[:100]}...')'''
new_line = '''        logging.info(f'Contact form submitted by {data.get("name")} ({data.get("email")}): {data.get("message", "")[:100]}...')'''

content = content.replace(old_line, new_line)

# Write back
with open('/var/www/AksharJobs/backend/routes/contact_routes.py', 'w') as f:
    f.write(content)

print("Fixed contact_routes.py syntax error")


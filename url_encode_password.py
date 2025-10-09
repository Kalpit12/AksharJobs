#!/usr/bin/env python3
"""
URL Encoder for MongoDB Atlas Password
Use this when your password contains special characters
"""

import urllib.parse
import sys

def url_encode_password(password):
    """URL encode a password for MongoDB connection string"""
    return urllib.parse.quote(password, safe='')

def build_connection_string(username, password, cluster_url):
    """Build a complete MongoDB Atlas connection string"""
    encoded_password = url_encode_password(password)
    return f"mongodb+srv://{username}:{encoded_password}@{cluster_url}/?retryWrites=true&w=majority"

def main():
    print("=" * 60)
    print("MongoDB Atlas Password URL Encoder")
    print("=" * 60)
    print()
    print("Use this tool if your password contains special characters like:")
    print("@ : / ? # [ ] & = + $ , ; % < >")
    print()
    
    # Get input
    if len(sys.argv) > 1:
        # Password provided as argument
        password = sys.argv[1]
    else:
        # Interactive mode
        password = input("Enter your MongoDB Atlas password: ")
    
    if not password:
        print("❌ No password provided!")
        return
    
    # Encode password
    encoded = url_encode_password(password)
    
    print()
    print("-" * 60)
    print("Results:")
    print("-" * 60)
    print()
    print(f"Original Password:  {password}")
    print(f"Encoded Password:   {encoded}")
    print()
    
    # Check if encoding was needed
    if password == encoded:
        print("✅ No special characters found - password doesn't need encoding")
    else:
        print("⚠️  Special characters detected - use the encoded version!")
        print()
        print("Character encoding table:")
        for char in set(password):
            encoded_char = urllib.parse.quote(char, safe='')
            if char != encoded_char:
                print(f"   '{char}' → '{encoded_char}'")
    
    print()
    print("-" * 60)
    
    # Ask for more details to build complete connection string
    print()
    build_complete = input("Build complete connection string? (y/n): ").lower()
    
    if build_complete == 'y':
        print()
        username = input("Enter username (e.g., akshar_admin): ")
        print()
        print("Enter cluster URL (without mongodb+srv://)")
        print("Example: cluster0.ab1cd.mongodb.net")
        cluster_url = input("Cluster URL: ")
        
        if username and cluster_url:
            connection_string = build_connection_string(username, password, cluster_url)
            print()
            print("-" * 60)
            print("Complete Connection String:")
            print("-" * 60)
            print()
            print(connection_string)
            print()
            print("Copy this to your .edn.local file:")
            print(f"MONGO_URI={connection_string}")
            print()
    
    print("=" * 60)
    print("Done! Use the encoded password in your connection string.")
    print("=" * 60)

if __name__ == "__main__":
    main()


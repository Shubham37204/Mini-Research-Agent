import os

def vulnerable_function(user_input):
    # Potential OS command injection
    os.system("echo " + user_input)

def leaky_function():
    # Potential secret leak
    api_key = "gsk_1234567890abcdef"
    print(f"Using key: {api_key}")

def bug_function(items):
    # Potential IndexError
    return items[10]

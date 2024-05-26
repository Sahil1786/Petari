import sys
import json

def process_command(command):
    if 'donate' in command.lower():
        return {
            'action': 'donate',
            'details': {
                'type': 'food',
                'quantity': 10  # Example quantity, implement NLP to extract real data
            }
        }
    else:
        return {'action': 'unknown'}

if __name__ == '__main__':
    command = sys.argv[1]
    result = process_command(command)
    print(json.dumps(result))

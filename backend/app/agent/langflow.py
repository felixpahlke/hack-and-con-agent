import os

import requests


def run_langflow():
    # API Configuration
    try:
        api_key = os.environ["LANGFLOW_API_KEY"]
    except KeyError:
        raise ValueError(
            "LANGFLOW_API_KEY environment variable not found. Please set your API key in the environment variables."
        )

    url = "https://langflow-langflow-1-5-1.ce-dev-cluster-e35fa0051812cc24b064c01c5a512ff2-0000.eu-de.containers.appdomain.cloud/api/v1/run/2b02eb27-fe3e-49f1-ad29-0a2ed87231bc"  # The complete API endpoint URL for this flow

    # Request payload configuration
    payload = {
        "output_type": "chat",
        "input_type": "chat",
        "input_value": """Wann überweist die AOK das Krankengeld auf mein Konto??""",
    }

    # Request headers
    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,  # Authentication key from environment variable
    }

    try:
        # Send API request
        response = requests.request("POST", url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for bad status codes

        # Print response
        print(response.text)
        return response.text

    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
    except ValueError as e:
        print(f"Error parsing response: {e}")

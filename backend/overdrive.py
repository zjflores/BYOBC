import requests
import base64
import json
from data.keys.secret_keys import overdrive


def check_overdrive():
    """Check if title available at library"""
    # data = request.get_json()
    # print(data)

    # book = Book.query.get(data['id'])

    keys = '{}:{}'.format(overdrive.key, overdrive.secret)
    print(keys)
    encoded = base64.b64encode(keys.encode('utf8'))
    formatted = b'Basic ' + encoded
    print(encoded)

    headers = {b'Authorization': formatted,
               b'Content-Type': b'application/x-www-form-urlencoded;charset=UTF-8'}
    # payload = {b'grant_type', b'client_credentials'}
    payload = b'grant_type=client_credentials'

    r = requests.post(b"https://oauth.overdrive.com/token",
                      headers=headers, data=payload)

    response = r.json()

    search_overdrive(response)


def search_overdrive(response):
    token = response['access_token']
    token = token.encode('utf8')
    auth_token = b'Bearer ' + token
    headers = {b'Authorization': auth_token}
    payload = {b'q': b'The Adventure of Sherlock Holmes'}
    r = requests.get(
        b'https://api.overdrive.com/v1/collections/v1L1BBQ0AAA2_/products',
        headers=headers, params=payload)

    returned = r.json()
    # returned["products"][0]
    print(returned)

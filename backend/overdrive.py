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
    encoded = base64.b64encode(keys.encode('utf8'))
    formatted = b'Basic ' + encoded

    headers = {b'Authorization': formatted,
               b'Content-Type': b'application/x-www-form-urlencoded;charset=UTF-8'}

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
    title = b'The Adventures of Sherlock Holmes'
    payload = {b'q': title}
    r = requests.get(
        b'https://api.overdrive.com/v1/collections/v1L1BBQ0AAA2_/products',
        headers=headers, params=payload)

    returned = r.json()
    # print(returned)
    for product in returned['products']:
        # print(product)
        if product['mediaType'] == 'eBook':

            print(product['title'].lower())
            print(title.lower())
            url = product['links']['availability']['href']
            print(url)
            check_availability(headers, url)
        else:
            print("Not available")


def check_availability(headers, url):

    url = url.encode('utf8')

    r = requests.get(url, headers=headers)
    print(r.json())

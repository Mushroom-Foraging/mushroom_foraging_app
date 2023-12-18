import requests
import pickle
import time

total_data = []
has_more = True
page_index = 0
while has_more:
    url = "https://api.inaturalist.org/v1/observations/species_counts"

    querystring = {
        "verifiable": "true",
        "spam": "false",
        "taxon_id": "47169",
        "locale": "en-US",
        "page": page_index
    }
    print(f"Reading page {page_index}")
    response = requests.request("GET", url, headers=None, params=querystring)
    if response.status_code != 200:
        print("Something went horribly wrong! :(")
        exit(1)

    data = response.json()
    total_data = total_data + data['results']

    if len(data['results']) < 500:
        has_more = False

    page_index = page_index + 1
    time.sleep(1)
    pickle.dump(total_data, open('mushroom_info.p', 'wb'))
    print("Wrote to file. Total is %d" % len(total_data))

print("Done reading all pages. Total is %d" % len(total_data))


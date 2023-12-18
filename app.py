from flask import Flask, render_template, request, jsonify
import pickle
import os
import requests
import wikipedia

app = Flask(__name__)
script_dir = os.path.dirname(__file__)
mushroom_path = os.path.join(script_dir, 'scripts/mushroom_info.p')
print(f"Looking for mushroom file in {mushroom_path}")

mushroom_info = []
if os.path.exists(mushroom_path):
    mushroom_info = pickle.load(open(mushroom_path, 'rb'))
    print(f"Read mushroom file of {len(mushroom_info)} names.")


def remove_seen(data, new_data):
    seen_uuids = set([observation['uuid'] for observation in data])
    new_observations = []
    for observation in new_data:
        if observation['uuid'] not in seen_uuids:
            new_observations.append(observation)
    return new_observations


def save_observations(data):
    if len(data) == 0:
        return
    location_info = []
    location_path = os.path.join(script_dir, 'scripts/location_info.p')
    if os.path.exists(location_path):
        try:
            location_info = pickle.load(open(location_path, 'rb'))
        except:
            location_info = []
    new_data = remove_seen(location_info, data)
    location_info = location_info + new_data
    pickle.dump(location_info, open(location_path, 'wb'))
    print(f"Saved {len(new_data)} new observations to file.")


def inaturalist_request_observations(taxon_id, lat, lng, radius):
    url = "https://api.inaturalist.org/v1/observations/"

    querystring = {
        "taxon_id": taxon_id,
        "lat": lat,
        "lng": lng,
        "radius": max(0, min(90, int(radius)))

    }
    response = requests.request("GET", url, headers=None, params=querystring)
    if response.status_code != 200:
        print("Something went horribly wrong! :(")
        return []
    data = response.json()
    results = []
    for observation in data['results']:
        result = {'time_observed_at': observation['time_observed_at']}
        for identification in observation['identifications']:
            result['name'] = identification['taxon']['name']
            if 'preferred_common_name' in identification['taxon']:
                result['preferred_common_name'] = identification['taxon']['preferred_common_name']
            result['wikipedia_url'] = identification['taxon']['wikipedia_url']

        photos = []
        for photo in observation['observation_photos']:
            photos.append(photo['photo']['url'])
        result['photos'] = photos

        result['coordinates'] = observation['geojson']['coordinates']
        results.append(result)

    save_observations(data['results'])
    return results


@app.route('/contact')
def contact_page():
    return render_template('contact.html')


@app.route('/about')
def about_page():
    return render_template('about.html')


@app.route('/map')
def map_page():
    return render_template('map.html')


@app.route('/')
def home_page():
    return render_template('home.html')


@app.route('/api/v1/search')
def search_mushrooms():
    term = request.args.get('mushroom_name')
    print(f"User searched for mushroom starting with: {term}")
    if term == '':
        return jsonify([])

    return jsonify([
                       item for item in mushroom_info
                       if term.lower() in item['taxon'].get('name', '').lower()
                       or term.lower() in item['taxon'].get('preferred_common_name', '').lower()
                       or term.lower() in item['taxon'].get('english_common_name', '').lower()
                   ][0:5])


@app.route('/api/v1/locations')
def mushroom_locations():
    taxon_id = request.args.get("taxon_id")
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    radius = request.args.get("radius")
    print(f"Getting observations coordinates from taxon ID: {taxon_id}")
    return jsonify(inaturalist_request_observations(taxon_id, lat, lng, radius))


@app.route('/api/v1/summary')
def mushroom_summary():
    wikipedia_id = request.args.get("id")
    print("Searching for %s" % wikipedia_id)
    return wikipedia.summary(wikipedia_id, sentences=5, auto_suggest=False)


if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, extra_files=['templates/home.html'], host='0.0.0.0', port=8082)

from flask import Flask, render_template, request, jsonify
import pickle
import os

app = Flask(__name__)
script_dir = os.path.dirname(__file__)
mushroom_path = os.path.join(script_dir, 'scripts/mushroom_info.p')
print(f"Looking for mushroom file in {mushroom_path}")

mushroom_info = []
if os.path.exists(mushroom_path):
    mushroom_info = pickle.load(open(mushroom_path, 'rb'))
    print(f"Read mushroom file of {len(mushroom_info)} names.")


@app.route('/')
def hello_world():
    return render_template('home.html')


@app.route('/api/v1/search')
def search_mushrooms():
    term = request.args.get('mushroom_name')
    print(f"User searched for mushroom starting with: {term}")
    if term == '':
        return jsonify([])

    return jsonify([
        item for item in mushroom_info
        if term in item['taxon'].get('name', '')
        or term in item['taxon'].get('preferred_common_name', '')
        or term in item['taxon'].get('english_common_name', '')
    ][0:5])


if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, extra_files=['templates/home.html'], host='0.0.0.0')

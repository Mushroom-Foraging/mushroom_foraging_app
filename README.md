# Mushrooms Finder
A work-in-progress website for mushroom foragers.


## Backend
Written in Python using Flask

## Frontend
Written in Javascript, HTML, and CSS.

## How to deploy

[![publish](https://github.com/Mushroom-Foraging/mushroom_foraging_app/actions/workflows/publish.yml/badge.svg)](https://github.com/Mushroom-Foraging/mushroom_foraging_app/actions/workflows/publish.yml)

1) Make changes and commit to this repository (`git add`, `git commit`, `git push`).

1) The [publish](https://github.com/Mushroom-Foraging/mushroom_foraging_app/actions/workflows/publish.yml) workflow will automatically run. It will build the backend and frontend Docker containers into Github Container Registry (GCR).
1) Go to http://192.168.1.36/Docker and click "Check for updates", then "apply update". This is necessary to pull the image from GCR and push it to the server.
1) That's all. The app should be available at https://mushmushfinder.com

<p align="center">
  <img src="https://github.com/Mushroom-Foraging/mushroom_foraging_app/blob/master/static/home_page.png?raw=true" width="1600"/>
</p>


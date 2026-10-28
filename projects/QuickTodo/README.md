# QuickTodo

**QuickTodo** is a lightweight, mobile‑first Progressive Web App (PWA) for managing a personal to‑do list. It runs entirely in the browser, stores data locally using IndexedDB, and can be installed on supported devices.

## Features

- Add, edit, and delete tasks  
- Mark tasks as complete / pending  
- Filter view to show **All**, **Pending**, or **Completed** tasks  
- Optional due date for each task  
- Persistent storage with IndexedDB (data survives page reloads and browser restarts)  
- PWA support: installable on desktop and mobile browsers, offline‑ready service worker  

## Project Structure

```
projects/
└─ QuickTodo/
   ├─ index.html          # Main HTML page
   ├─ styles.css          # Mobile‑first CSS
   ├─ app.js              # Application logic and IndexedDB handling
   ├─ manifest.webmanifest# Web app manifest
   ├─ service-worker.js   # Service worker for offline support
   ├─ Dockerfile          # Minimal container to serve the static files
   └─ README.md           # This document
```

## Prerequisites

- Docker Engine (v20.10 or newer) installed on the host machine  
- A modern web browser (Chrome, Edge, Firefox, Safari) for testing the PWA  

## Building the Docker Image

From the `projects/QuickTodo` directory run:

```sh
docker build -t quicktodo .
```

The Dockerfile uses the official **nginx:alpine** image and copies the static files into the default web root.

## Running the Container

Choose any free host port between **9000** and **9999**. The example below uses **9090**:

```sh
docker run -d --name quicktodo_app -p 9090:80 quicktodo
```

The application will be reachable at:

```
http://localhost:9090
```

## Verifying the Container (Health Check)

After the container starts, you can verify it is serving the app:

```sh
curl -I http://localhost:9090
```

Expected response header includes `HTTP/1.1 200 OK`. Opening the URL in a browser should display the QuickTodo UI.

*No automated tests have been executed yet; manual verification was performed as described above.*

## Installing the PWA

When visiting the app in a supported browser:

1. Open the browser’s menu (e.g., Chrome’s three‑dot menu).  
2. Choose **“Install QuickTodo”** or **“Add to Home screen.”**  
3. The app will be added to the device and can be launched offline.

## Development

If you wish to modify the source:

1. Edit `index.html`, `styles.css`, or `app.js` as needed.  
2. Re‑build the Docker image (`docker build …`).  
3. Re‑run the container (or use `docker restart quicktodo_app`).  

All data is stored locally in the browser; clearing site data will reset the task list.

## License

This project is released under the MIT License. Feel free to use, modify, and distribute it.

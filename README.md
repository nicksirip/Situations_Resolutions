# 🏊 USA Swimming Officials: Situations & Resolutions Study Tool

An interactive, mobile-responsive web application designed to help USA Swimming officials master the **Situations & Resolutions (Stroke & Turn)**. This tool provides a modern, accessible way to review official interpretations, ensuring consistency on the deck.

## 🚀 Live App
**Access the tool here:** [https://usas-situations.streamlit.app/]

---

## ✨ Key Features

* **Four Study Modes:**
    * **Sequential Review:** Cycle through situations in order, with automatic "wrap-around" navigation.
    * **Random Shuffle:** Test your knowledge with a randomized experience across all topics.
    * **Keyword Search:** Search for words or phrases across the ALL, or specific Stokes / Topics.
    * **Search by Number:** Jump directly to a specific situation number.

* **Mobile Optimized:** Designed specifically for portrait orientation on smartphones for use during breaks at swim meets.
* **Customizable UI:** Adjust font sizes for readability and toggle resolution visibility for self-testing.
* **Automatic Resets:** Smart logic resets item numbers when switching categories to ensure a smooth flow.

---

## 🛠️ How to Use

1.  **Select a Mode:** Use the sidebar navigation to choose your preferred study method.
2.  **Filter Topics:** In Mode 1 or 2, use the segmented buttons at the top to filter by stroke.
3.  **Navigate:** Use the `+` and `-` buttons in Sequential Review to move through the deck.
4.  **Self-Test:** Check the **"Hide Resolution"** box in the sidebar to hide answers until you click the "Show Resolution" button.

---

## 📂 Project Structure

* `Situations-app_web.py`: The core Streamlit application logic.
* `Situations-n-Resolutions-with-sections.xlsx`: The data source containing the situations, resolutions, and rules.
* `requirements.txt`: List of Python dependencies for cloud deployment.
* `assets/`: Contains the USA Swimming and PNS logos.

---

## 🛠️ Installation (Local Development)

If you wish to run this app locally:

1. Clone the repository:
``` bash
git clone https://github.com/gduryee/Situations_Resolutions/
```

2. Install dependencies:
``` bash
pip install -r requirements.txt
```
3. Run the app:

streamlit run Situations-app_web.py

## 📝 Credits & Versioning
Content: © 2025 USA Swimming,  National Officials Committee.

[USAS Situations & Resolutions Sroke & Turn Version: 03/07/2025](https://www.usaswimming.org/docs/default-source/officialsdocuments/officials-training-resources/situations-and-resolutions/situations-and-resolutions-stroke-and-turn.pdf)

Resources:

* [USA Swimming Website](https://www.usaswimming.org)

* [USA Swimming 2026 Rulebook](https://websiteprodcoresa.blob.core.windows.net/sitefinity/docs/default-source/governance/governance-lsc-website/rules_policies/rulebooks/2026-rulebook.pdf)

* [Pacific Northwest Swimming (PNS) Website](https://www.pns.org)

Maintainer: [Guy Duryee]


---

## 🐳 WordPress Environment (Docker)

A `docker-compose.yml` is included to spin up a local WordPress environment with MySQL and phpMyAdmin.

### Services

| Service      | Default URL                  | Description                       |
|--------------|------------------------------|-----------------------------------|
| WordPress    | http://localhost:8080        | WordPress site                    |
| phpMyAdmin   | http://localhost:8081        | Database management UI            |

### Quick Start

1. Copy the example environment file and edit it as needed:
   ```bash
   cp .env.example .env
   ```

2. Start all services:
   ```bash
   docker compose up -d
   ```

3. Open http://localhost:8080 in your browser and complete the WordPress installation wizard.

4. To stop and remove containers (data volumes are preserved):
   ```bash
   docker compose down
   ```

5. To also remove all persisted data:
   ```bash
   docker compose down -v
   ```

---

## 🤝 Feedback & Enhancements
For support, bug notification, or post idea for enhancement, please post in [discussions](https://github.com/gduryee/Situations_Resolutions/discussions/). 

We are actively working on improvements based on official feedback. Current roadmap includes:

[x] Search by keyword functionality.

[ ] Performance tracking.

[x] Enhanced Sequential Review stability.

... and more. 

Let us know if you have ideas to improve the project.

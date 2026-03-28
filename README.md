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

* `Situations-app_web.py`: The core Streamlit application logic (original Python app).
* `Situations-n-Resolutions-with-sections.xlsx`: The data source containing the situations, resolutions, and rules.
* `requirements.txt`: List of Python dependencies for Streamlit cloud deployment.
* `situations-resolutions/`: **WordPress plugin** (see below).
* `tools/export_json.py`: Helper script to re-export the Excel data to the plugin's JSON file.

---

## 🌐 WordPress Plugin

A self-contained WordPress plugin is included in the `situations-resolutions/` folder. It replicates all features of the Streamlit app and runs **entirely in the browser using vanilla JavaScript** — no Python server, no Streamlit, and no paid plugins are required.

### ✨ Plugin Features

All four study modes are supported:
* **Sequential Review** – step through situations per stroke/topic with +/− navigation.
* **Random Shuffle** – randomised pick from all strokes or a single stroke.
* **Keyword Search** – search situations and/or resolutions with yellow highlighting.
* **Search by Number** – jump directly to any situation by number.

Plus: Hide Resolution checkbox (self-test mode), adjustable font size slider, and mobile-responsive layout.

### 🚀 Installation

1. Download or clone this repository.
2. Zip the `situations-resolutions/` folder.
3. In your WordPress admin go to **Plugins → Add New Plugin → Upload Plugin**.
4. Upload the zip and click **Activate**.
5. Add the shortcode `[situations_resolutions]` to any Page or Post.

#### Manual upload

Upload the `situations-resolutions/` folder to `/wp-content/plugins/` via FTP, then activate it from the Plugins screen.

### 🔄 Updating the Data

When USA Swimming publishes a new Situations & Resolutions document:

1. Update `Situations-n-Resolutions-with-sections.xlsx` in the repository root.
2. Run the export helper (requires Python 3 + pandas + openpyxl):
   ```bash
   python3 tools/export_json.py
   ```
3. Replace `situations-resolutions/assets/data/situations.json` with the newly generated file.
4. Re-upload the updated plugin to WordPress.

---

## 🛠️ Streamlit App – Local Development

If you wish to run the original Python/Streamlit app locally:

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


## 🤝 Feedback & Enhancements
For support, bug notification, or post idea for enhancement, please post in [discussions](https://github.com/gduryee/Situations_Resolutions/discussions/). 

We are actively working on improvements based on official feedback. Current roadmap includes:

[x] Search by keyword functionality.

[ ] Performance tracking.

[x] Enhanced Sequential Review stability.

... and more. 

Let us know if you have ideas to improve the project.

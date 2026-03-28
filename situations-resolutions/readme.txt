=== USA Swimming – Situations & Resolutions ===
Contributors: gduryee
Tags: swimming, officials, training, study tool
Requires at least: 5.6
Tested up to: 6.7
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive study tool for USA Swimming officials: Situations & Resolutions (Stroke & Turn). Runs entirely in the browser—no paid plugins needed.

== Description ==

This plugin converts the original Python/Streamlit Situations & Resolutions study application into a self-contained WordPress plugin that runs entirely in the visitor's browser using vanilla JavaScript.

**No paid plugins or external services are required.**

= Features =

* **Four study modes:**
  * **Sequential Review** – cycle through situations in order per stroke/topic, with +/− navigation and wrap-around.
  * **Random Shuffle** – test yourself with a randomised pick across all topics or a single stroke.
  * **Keyword Search** – search across situations, resolutions, or both, with optional stroke filter and yellow highlighting of matched terms.
  * **Search by Number** – jump directly to a situation by its number.
* **Hide Resolution** checkbox for self-testing.
* **Adjustable font size** (14 px – 36 px slider).
* **Mobile-responsive** layout.
* All 148 situations and resolutions are bundled in a JSON file served directly from your WordPress install—no external API calls.

= Usage =

1. Install and activate the plugin (see Installation).
2. Create or edit any Page or Post.
3. Add the shortcode: `[situations_resolutions]`
4. Save/Publish. The study tool will appear on that page.

== Installation ==

= From the WordPress admin (recommended) =

1. Download the plugin `.zip` file from the [GitHub releases page](https://github.com/nicksirip/Situations_Resolutions/releases).
2. In your WordPress admin go to **Plugins → Add New Plugin → Upload Plugin**.
3. Choose the `.zip` file and click **Install Now**.
4. Click **Activate Plugin**.
5. Add `[situations_resolutions]` to any page.

= Manual upload =

1. Upload the `situations-resolutions/` folder to `/wp-content/plugins/`.
2. Activate the plugin from the **Plugins** screen.
3. Add `[situations_resolutions]` to any page.

= Updating the situation data =

The situations and resolutions are stored in:

    situations-resolutions/assets/data/situations.json

Each entry has the fields: `stroke`, `number`, `situation`, `resolution`, `rule`.

To update the data when USA Swimming publishes a new version:

1. Open `Situations-n-Resolutions-with-sections.xlsx` in the repository root.
2. Run the helper script (requires Python 3 + pandas + openpyxl):
   ```bash
   python3 tools/export_json.py
   ```
3. Replace `situations-resolutions/assets/data/situations.json` with the newly generated file.
4. Re-upload the updated plugin.

== Frequently Asked Questions ==

= Does this plugin need Streamlit or Python on the server? =

No. The original app required a Streamlit Python server. This plugin is entirely client-side HTML/CSS/JavaScript and works on any standard WordPress hosting.

= Are any paid plugins required? =

No. The plugin uses only WordPress core functionality and vanilla JavaScript.

= Will it work with page builders (Elementor, Divi, etc.)? =

Yes. You can paste the shortcode `[situations_resolutions]` into any shortcode block.

= The tool shows "Configuration error: data URL not set." =

This usually means the plugin was not activated properly or the file structure was changed. Re-upload the full `situations-resolutions/` folder and reactivate.

== Screenshots ==

1. Sequential Review mode on a desktop browser.
2. Keyword Search mode with highlighted matches.
3. Random Shuffle mode on a mobile device.

== Changelog ==

= 1.0.0 =
* Initial release – full port of Streamlit application to WordPress shortcode plugin.

== Upgrade Notice ==

= 1.0.0 =
Initial release.

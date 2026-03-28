<?php
/**
 * Plugin Name:       USA Swimming – Situations & Resolutions
 * Plugin URI:        https://github.com/nicksirip/Situations_Resolutions
 * Description:       Interactive study tool for USA Swimming officials to review Situations & Resolutions (Stroke & Turn). Add the shortcode [situations_resolutions] to any page or post.
 * Version:           1.0.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Guy Duryee
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       situations-resolutions
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'SR_PLUGIN_VERSION', '1.0.0' );
define( 'SR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueue plugin assets (CSS + JS) only on pages/posts that contain
 * the [situations_resolutions] shortcode, keeping the global page
 * weight as low as possible.
 */
function sr_enqueue_assets() {
    // Enqueue on all pages; WordPress short-circuits parsing automatically.
    // For a tighter scope, inspect global $post content here.
    wp_enqueue_style(
        'sr-style',
        SR_PLUGIN_URL . 'assets/css/style.css',
        array(),
        SR_PLUGIN_VERSION
    );

    wp_enqueue_script(
        'sr-app',
        SR_PLUGIN_URL . 'assets/js/app.js',
        array(),          // no jQuery dependency needed
        SR_PLUGIN_VERSION,
        true              // load in footer
    );

    // Pass the URL of the JSON data file to the JS layer.
    wp_localize_script(
        'sr-app',
        'srAppConfig',
        array(
            'dataUrl' => SR_PLUGIN_URL . 'assets/data/situations.json',
        )
    );
}
add_action( 'wp_enqueue_scripts', 'sr_enqueue_assets' );

/**
 * Shortcode: [situations_resolutions]
 *
 * Renders the full interactive app container. All interactivity is
 * handled by the bundled vanilla JavaScript – no server-side Python
 * or paid plugins required.
 *
 * @return string  HTML for the app shell.
 */
function sr_render_shortcode() {
    $usas_logo_url = esc_url( SR_PLUGIN_URL . 'assets/images/USA_Swimming_Logo.svg' );
    $pns_logo_url  = esc_url( SR_PLUGIN_URL . 'assets/images/pns_logo.png' );

    $rulebook_url  = 'https://websiteprodcoresa.blob.core.windows.net/sitefinity/docs/default-source/governance/governance-lsc-website/rules_policies/rulebooks/2026-rulebook.pdf';
    $sit_res_url   = 'https://www.usaswimming.org/docs/default-source/officialsdocuments/officials-training-resources/situations-and-resolutions/situations-and-resolutions-stroke-and-turn.pdf';

    ob_start();
    ?>
    <div id="sr-app">

      <!-- ── Header ── -->
      <div class="sr-header">
        <a href="https://www.usaswimming.org/" target="_blank" rel="noopener noreferrer">
          <img src="<?php echo $usas_logo_url; ?>" alt="USA Swimming logo" height="60" />
        </a>
        <div class="sr-header-titles">
          <h2><a href="https://www.usaswimming.org/" target="_blank" rel="noopener noreferrer">USA Swimming</a> Officials</h2>
          <p>Situations &amp; Resolutions – Stroke &amp; Turn</p>
        </div>
        <a href="https://www.pns.org/page/home" target="_blank" rel="noopener noreferrer">
          <img src="<?php echo $pns_logo_url; ?>" alt="Pacific Northwest Swimming logo" height="60" />
        </a>
      </div>

      <!-- ── Resource links ── -->
      <div class="sr-resources">
        <a href="<?php echo esc_url( $rulebook_url ); ?>" target="_blank" rel="noopener noreferrer">2026 USA Swimming Rulebook</a>
        <a href="<?php echo esc_url( $sit_res_url ); ?>" target="_blank" rel="noopener noreferrer">Mar. 2025 Situations &amp; Resolutions (PDF)</a>
      </div>

      <hr class="sr-divider" />

      <!-- ── Mode tabs ── -->
      <div class="sr-toolbar">
        <div class="sr-mode-tabs" role="tablist" aria-label="Study modes">
          <button class="sr-mode-tab active" data-mode="sequential" role="tab" aria-selected="true">Sequential Review</button>
          <button class="sr-mode-tab"        data-mode="random"     role="tab" aria-selected="false">Random Shuffle</button>
          <button class="sr-mode-tab"        data-mode="keyword"    role="tab" aria-selected="false">Keyword Search</button>
          <button class="sr-mode-tab"        data-mode="number"     role="tab" aria-selected="false">Search by Number</button>
        </div>
      </div>

      <!-- ── Options ── -->
      <div class="sr-options">
        <label>
          <input type="checkbox" id="sr-hide-resolution" />
          Hide Resolution (self-test)
        </label>
        <div class="sr-font-size-control">
          <span>Font size:</span>
          <input type="range" id="sr-font-size" min="14" max="36" value="18" />
          <span id="sr-font-size-label">18px</span>
        </div>
      </div>

      <hr class="sr-divider" />

      <!-- ── Dynamic mode panel (populated by JS) ── -->
      <div id="sr-mode-panel"></div>

      <!-- ── Card display (populated by JS) ── -->
      <div id="sr-card-container"></div>

      <!-- ── Footer ── -->
      <div class="sr-footer">
        <div>
          <a href="https://www.pns.org/page/home" target="_blank" rel="noopener noreferrer">
            <img src="<?php echo $pns_logo_url; ?>" alt="Pacific Northwest Swimming" />
          </a>
        </div>
        &copy; 2025 <a href="https://www.usaswimming.org/" target="_blank" rel="noopener noreferrer">USA Swimming</a>,
        National Officials Committee &mdash; Version 03/07/2025
      </div>

    </div><!-- #sr-app -->
    <?php
    return ob_get_clean();
}
add_shortcode( 'situations_resolutions', 'sr_render_shortcode' );

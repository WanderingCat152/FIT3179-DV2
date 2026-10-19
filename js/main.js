const charts = [
  ["#chart-overall-access", "charts/chart01_overall_access.vl.json?v=20261019b"],
  ["#chart-facility-points", "charts/chart02_facility_points.vl.json?v=20261019b"],
  ["#chart-domain-maps", "charts/chart03_domain_small_multiples.vl.json?v=20261019b"],
  ["#chart-domain-heatmap", "charts/chart04_domain_heatmap.vl.json?v=20261019b"],
  ["#chart-domain-gap", "charts/chart05_domain_gap.vl.json?v=20261019b"],
  ["#chart-no-car-map", "charts/chart06_no_car_symbols.vl.json?v=20261019b"],
  ["#chart-bivariate-map", "charts/chart07_bivariate_access_need.vl.json?v=20261019b"],
  ["#chart-access-need-scatter", "charts/chart08_access_need_scatter.vl.json?v=20261019b"],
  ["#chart-alluvial", "charts/chart09_alluvial.vg.json?v=20261019b"],
  ["#chart-lga-ranking", "charts/chart10_lga_ranking.vl.json?v=20261019b"],
  ["#chart-domain-boxplot", "charts/chart11_domain_boxplot.vl.json?v=20261019b"],
];

const embedOptions = {
  actions: false,
  renderer: "svg",
};

async function embedChart(selector, specificationPath) {
  const host = document.querySelector(selector);

  try {
    await vegaEmbed(selector, specificationPath, embedOptions);
  } catch (error) {
    console.error(`Unable to render ${specificationPath}`, error);
    host.innerHTML =
      '<p class="chart-error">This chart could not be loaded. Run the site through a local web server and check the browser console.</p>';
  }
}

Promise.all(charts.map(([selector, path]) => embedChart(selector, path)));

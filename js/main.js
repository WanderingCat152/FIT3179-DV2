const charts = [
  ["#chart-overall-access", "charts/chart01_overall_access.vl.json"],
  ["#chart-facility-points", "charts/chart02_facility_points.vl.json"],
  ["#chart-domain-maps", "charts/chart03_domain_small_multiples.vl.json"],
  ["#chart-domain-heatmap", "charts/chart04_domain_heatmap.vl.json"],
  ["#chart-domain-gap", "charts/chart05_domain_gap.vl.json"],
  ["#chart-no-car-map", "charts/chart06_no_car_symbols.vl.json"],
  ["#chart-bivariate-map", "charts/chart07_bivariate_access_need.vl.json"],
  ["#chart-access-need-scatter", "charts/chart08_access_need_scatter.vl.json"],
  ["#chart-alluvial", "charts/chart09_alluvial.vg.json"],
  ["#chart-lga-ranking", "charts/chart10_lga_ranking.vl.json"],
  ["#chart-domain-boxplot", "charts/chart11_domain_boxplot.vl.json"],
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

// Initialize the dashboard function
function init() {
    // Use D3 to read the JSON file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        // Populate dropdown with sample IDs
        var dropdown = d3.select("#selDataset");
        data.names.forEach(sample => {
            dropdown.append("option").text(sample).property("value", sample);
        });

        // Initial sample
        var initialSample = data.names[0];
        updateCharts(initialSample);
    });
}

// Update charts based on selected sample function
function updateCharts(selectedSample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
        // Filter data for the selected sample
        var selectedData = data.samples.find(sample => sample.id === selectedSample);

        // Bar chart
        var barData = [{
            x: selectedData.sample_values.slice(0, 10).reverse(),
            y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: selectedData.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        var barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart
        var bubbleData = [{
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            text: selectedData.otu_labels,
            mode: "markers",
            marker: {
                size: selectedData.sample_values,
                color: selectedData.otu_ids
            }
        }];
        var bubbleLayout = {
            title: `Bacteria Cultures for Sample ${selectedSample}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Sample metadata
        var metadata = data.metadata.find(meta => meta.id === parseInt(selectedSample));
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Event listener for dropdown change
function optionChanged(selectedSample) {
    updateCharts(selectedSample);
}

// Initialize the dashboard
init();

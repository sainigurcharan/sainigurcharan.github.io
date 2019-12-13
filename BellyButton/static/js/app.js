function buildMetadata(newSample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelMetadata.html("");
    // read metada for panel and gauge chart
    var sampleData = "./static/data/samples.json";
    d3.json(sampleData).then((data) => {
        data.metadata.map(sample => {
            if (sample.id.toString() === newSample.toString()) {
                panelMetadata.append("h6").html(`<b>ID</b>: ${sample.id}`);
                panelMetadata.append("h6").html(`<b>Ethnicity</b>: ${sample.ethnicity}`);
                panelMetadata.append("h6").html(`<b>Gender</b>: ${sample.gender}`);
                panelMetadata.append("h6").html(`<b>Age</b>: ${sample.age}`);
                panelMetadata.append("h6").html(`<b>Location</b>: ${sample.location}`);
                panelMetadata.append("h6").html(`<b>BBType</b>: ${sample.bbtype}`);
                panelMetadata.append("h6").html(`<b>WFREQ</b>: ${sample.wfreq}`);
                // BONUS: Build the Gauge Chart
                // Enter a speed between 0 and 180
                var level = sample.wfreq;
                console.log(level);
                // Trig to calc meter point
                var degrees = 180 - (level*20),
                    radius = .7;
                var radians = degrees * Math.PI / 180;
                var x = radius * Math.cos(radians);
                var y = radius * Math.sin(radians);

                // Path: may have to change to create a better triangle
                var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                    pathX = String(x),
                    space = ' ',
                    pathY = String(y),
                    pathEnd = ' Z';
                var path = mainPath.concat(pathX, space, pathY, pathEnd);

                var data = [
                    {
                        type: 'scatter',
                        x: [0],
                        y:[0],
                        marker: {size: 28, color:'850000'},
                        showlegend: false,
                        name: 'speed',
                        text: level,
                        hoverinfo: 'text+name'
                    },
                    {
                        values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
                        rotation: 90,
                        text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                        textinfo: 'text',
                        textposition:'inside',
                        marker: {
                                    colors:['#84B589','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                            '#F4F1E4','#F8F3EC', 'rgba(255, 255, 255, 0)',]
                                },
                        labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                        hoverinfo: 'label',
                        hole: .5,
                        type: 'pie',
                        showlegend: false
                    }];

                var layout = {
                    shapes:[{   type: 'path',
                                path: path,
                                fillcolor: '850000',
                                line: { color: '850000'}
                            }],
                    xaxis: {
                                zeroline:false,
                                showticklabels:false,
                                showgrid: false,
                                range: [-1, 1]
                            },
                    yaxis: {
                                zeroline:false,
                                showticklabels:false,
                                showgrid: false, range: [-1, 1]
                            }
                };
                Plotly.newPlot('gauge', data, layout, {responsive: true});
            }
        });
    });
}

function buildCharts(newSample) {
    // read data to make bubble and bar chart
    var sampleData = "./static/data/samples.json";
    // bar chart y axis values from otu ids
    var otuId = [];
    var otuLabel = [];
    d3.json(sampleData).then((data) => {
        data.samples.map(samples => {
            if (samples.id.toString() === newSample.toString()) {
                samples.otu_labels.forEach(value => {
                    otuLabel.push(value.replace(/;/g, ", "));
                });
                var trace1 = {
                                x: samples.otu_ids,
                                y: samples.sample_values,
                                mode: 'markers',
                                text: otuLabel,
                                marker: {
                                            color: samples.otu_ids,
                                            size: samples.sample_values,
                                            colorscale: "Earth"
                                }
                };
                var trace1 = [trace1];
                var layout = {
                                showlegend: false,
                                autosize: true
                };

                Plotly.newPlot('bubble', trace1, layout, {responsive: true});

                // otu_ids, and labels (10 each).
                samples.otu_ids.forEach(id => {
                    //console.log(`OTU ${id}`);
                    otuId.push(`OTU ${id}`);
                });
                var data = [{
                            x: samples.sample_values.slice(0, 10).reverse(),
                            y: otuId.slice(0, 10).reverse(),
                            text: otuLabel.slice(0, 10).reverse(),
                            //textposition: 'auto',
                            type: 'bar',
                            orientation: "h",
                            marker: {
                                color: samples.otu_ids,
                                colorscale: "Earth",
                                opacity: 0.6,
                                line: {
                                  color: 'rgb(8,48,107)',
                                  width: 1.5
                                }
                              }
                }];
                var layout = {
                        barmode: "group",
                        yaxis : { showgrid : false },
                        xaxis: { zeroline : false, showgrid : false }
                };

                Plotly.newPlot('bar', data, layout, {responsive: true});
            }
        });
    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    var sampleData = "./static/data/samples.json";
    // Use the list of sample names to populate the select options
    d3.json(sampleData).then((data) => {
        const firstSample = data.names[0];
        data.names.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
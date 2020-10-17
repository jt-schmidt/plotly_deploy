console.log("Hello Jeff");
//d3.json("samples.json").then(function(data){
//    console.log("hello");
//    var metadata = data.metadata;
//});

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  //d3.json("samples.json").then((data) => {
    d3.json("https://raw.githubusercontent.com/jt-schmidt/plotly_deploy/main/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//DELIVERABLE 1
//https://plotly.com/javascript/bar-charts/
// D1.1. Create the buildCharts function.
function buildCharts(sample) {
  // D1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // D1.3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    //console.log(sampleArray);

    // D1.4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //console.log(resultArray);

    //DELIVERABLE 3
    // D3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata
    var desiredSample = meta.filter(extract => extract.id == sample);
    //console.log(desiredSample);

    //  D1.5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    //console.log(result);
    
    // D3.2. Create a variable that holds the first sample in the metadata array.
    var firstSample = desiredSample[0];
    //console.log(firstSample);

    // D1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    //console.log(otu_ids);
    
    //var otu_labels = data.samples[0].otu_labels;
    var otu_labels = result.otu_labels;
    //console.log(otu_labels);

    //var sample_values = data.samples[0].sample_values;
    var sample_values = result.sample_values;
    //console.log(sample_values);
     
    // D3.3. Create a variable that holds the washing frequency.  
    var wfreq = firstSample.wfreq
    //console.log(wfreq);

    // D1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top10 = (data.samples[0].otu_ids.slice(0, 10)).reverse();

    //console.log(top10);
    var yticks = top10.map(d => "OTU " + d);
    //console.log(yticks);
    var xticks = data.samples[0].sample_values.slice(0, 10).reverse();
    //console.log(xticks);
    
    // D1.8. Create the trace for the bar chart. 
    var trace_bar = {
      //Top 10 of ALL DATA
      x: xticks,
      y: yticks,
      //SELECTED DATA
      //x: sample_values, 
      //y: otu_ids,
      text: otu_labels,
      marker: {
          color: 'blue' //https://www.w3schools.com/colors/colors_names.asp
      },
      type: "bar",
      orientation: "h",
  };
    var barData = [trace_bar];
    // D1.9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures</b>",
      yaxis: {
          tickmode: "linear",
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: {
          l: 200,
          r: 50,
          t: 75,
          b: 50
      }
  };
    // D1.10. Use Plotly to plot the data with the layout. 
    Plotly.react("bar", barData, barLayout);

    //DELIVERABLE 2
    //https://plotly.com/javascript/bubble-charts/
    // D2.1. Create the trace for the bubble chart.
    var trace_bubble = {
      //SELECTED DATA
      x: otu_ids,
      y: sample_values,
      type: "scatter",
      mode: "markers",
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Portland", //https://plotly.com/javascript/colorscales/#blackbody-colorscale
          sizeref: .018,
          sizemode: 'area',
      },
      text: otu_labels
    };
    var bubbleData = [trace_bubble];
    
    // D2.2. Create the layout for the bubble chart.
    //https://plotly.com/python-api-reference/generated/plotly.graph_objects.Layout.html
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample</b>",
      xaxis: { title: "OTU ID" },
      showgrid: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      height: 600,
      width: 1200
      };
    
    // D2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // D3.4. Create the trace for the gauge chart.
    //https://plotly.com/javascript/gauge-charts/
    var trace_gauge = {
    domain: { x: [0, 1], y: [0, 1] },
    value: parseFloat(wfreq),
    title: { text: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week` },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
        axis: { range: [null, 10], dtick: 2, tickcolor: 'black' },
        bar: { color: 'black' },
        bgcolor: "white",
        borderwidth: 1,
        steps: [
            { range: [0, 2], color: "red" }, //https://www.w3schools.com/colors/colors_names.asp
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
        ]}};
    var gaugeData = [trace_gauge];
        
    // D3.5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 400,
      margin: { t: 20, b: 40, l: 60, r: 60 },
      paper_bgcolor: "rgba(0,0,0,0)",
      font: { color: "black", family: "Arial" }
    };
    
    // D3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);    

  });
}

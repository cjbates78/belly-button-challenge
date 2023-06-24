// Use D3 library to read in json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {
  //Build dropdown and initial graphs
    let dropdown = d3.select("#selDataset");

        d3.json(url).then((data) => {
            let subject = data.names;
            subject.forEach((id) => {
                dropdown
                .append("option")
                .text(id)
                .property("value, id");
            });

    let firstId = subject[0]
    charts(firstId);
    demoInfo(firstId);
  });
}

//create variables for c
function charts(sample) {    
    d3.json(url).then((data) => {
    let samples = data.samples;
    let filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    let result = filterArray[0];
    let sample_values = result.sample_values;
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;   

// bar chart
    let trace1 = {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    };
    let data1 = [trace1];
    let layout1 = {
        title: "Top Ten OTUs",
        margin: {l: 100, r: 100, t: 100, b: 100}
    };
    Plotly.newPlot("bar", data1, layout1);  

// bubble chart
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale:"Earth"
        }
    };
    let data2 = [trace2];
    let layout = {
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU ID "},
        margin: {t:30}
    };
Plotly.newPlot('bubble', data2, layout); 
}); 
}
//sample metadata
function demoInfo(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
        let result = filterArray[0];
        let metaPanel = d3.select("#sample-metadata");
        metaPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toLowerCase()}: ${value}`)
         })   
    });
}
//update when new id selected
function newData(newID) {
    charts(newID);
    demoInfo(newID);
}

init();
function init() {
    // access mongodb data via flask route
    d3.json("/api/intensity").then(function(data){
        let ids = data[0].PKID;
        let dates = data[0].Date;
        let ranges = data[0].Range;
        let mxdvs = data[0].MXDV;
        let max_shears = data[0].Max_Shear;

        //scatterplot showing tornadoes by date and intensity
        let trace1 = {
            x: dates,
            y: mxdvs, 
            mode: 'markers',
            type: 'scatter',
            hovertext: ids
        };
        let data1 = [trace1];
        let layout1 = {
            title: {text:"Date v. Maximum Delta-Velocity"},
            yaxis: {title: {text: "Maximum Delta-Velocity"}}
        };
        Plotly.newPlot("plot", data1, layout1);


        //scatterplt showing tornadoes by range v. max shear: 
        let trace2 = {
            x: mxdvs,
            y: max_shears, 
            mode: 'markers',
            type: 'scatter',
            hovertext: ids,
            width: 200,
            height: 200
        };
        let layout2 = {
            title: {text:"Maximum Delta Velocity v. Maximum Wind Shear"}, 
            xaxis: {title: {text: "Maximum Delta Velocity)"}}, 
            yaxis: {title: {text: "Maximum Wind Shear"}}
        };
        let data2 = [trace2];
        Plotly.newPlot("plot2", data2, layout2);

        });
};

init();


# Tornadoes!

## Contributors

- Taylor Bohl
- Harish Korrapati
- Corey Lawson-Enos
- Rhiana Schafer
- Ishanjit Sidhu

## Description
Extracted NEXRAD Level-3 Radar data identifying Tornado Vortex Signatures from the last two months (source NOAA: www.ncdc.noaa.gov.) Cleaned and organized in Pandas, tornado cell activity data is subsequently launched to MongoDB for storage. Python Flask API powers web application for dynamic interaction with tornado data (see file app.py). Visualizations created using Leaflet and Plotly.

![methods](imgs/methods.png)

## Dataset

Data was retrieved using the following API:

https://www.ncdc.noaa.gov/swdiws/

Some notes on the data:

- Fields Retained:  
&nbsp;&nbsp;&nbsp;&nbsp;Cell_Type: Type of rotation, TVS indicates tornado  
&nbsp;&nbsp;&nbsp;&nbsp;Shape: Point (lon, lat)  
&nbsp;&nbsp;&nbsp;&nbsp;Max_Shear: Change in wind speed and/or direction with height  
&nbsp;&nbsp;&nbsp;&nbsp;WSR_ID: ID of the data collecting tower/radar  
&nbsp;&nbsp;&nbsp;&nbsp;MXDV: Maximum Delta-Velocity describes intensity of storm  
&nbsp;&nbsp;&nbsp;&nbsp;Cell_ID: ID of the storm  
&nbsp;&nbsp;&nbsp;&nbsp;zTime: Measure of time used in meteorology  
&nbsp;&nbsp;&nbsp;&nbsp;Azimuth: Angular direction of storm, in degrees  
&nbsp;&nbsp;&nbsp;&nbsp;Range: Distance between tornado and data collecting tower/radar 

- Fields Added:  
&nbsp;&nbsp;&nbsp;&nbsp;Latitude  
&nbsp;&nbsp;&nbsp;&nbsp;Longitude  
&nbsp;&nbsp;&nbsp;&nbsp;Primary Key combining Cell_ID and date  
&nbsp;&nbsp;&nbsp;&nbsp;Date  
&nbsp;&nbsp;&nbsp;&nbsp;Time  
&nbsp;&nbsp;&nbsp;&nbsp;Year  
&nbsp;&nbsp;&nbsp;&nbsp;Month  


## Visuals

### Landing
![homepage](imgs/homepage.png)

### Storm Tracking
On the Cell Tracking page, view tornado activity by date; cycle through a day's tornado cell activity using the hour slider:

![tracking](imgs/tracking.png)

### Heat Map
Plotted data showing the density of recorded cell activity in particular areas:

![heatmap](imgs/heatmap.png)

### Intensity Plots
Relationship between Max Shear, MXDV and date charted:

![image](imgs/image.png)

![image2](imgs/image2.png)

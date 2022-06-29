#Importing Dependencies
import pandas as pd
import requests
import datetime 

def pull():
    # Code for 60 days' retro data
    today = pd.to_datetime("today") + datetime.timedelta(days=1)  

    start_str_list = []
    end_str_list = []

    retro_start = 60
    retro_end = 30

    # For start dates
    for x in range(0,2):
        if retro_start >= 0:
            start = today - datetime.timedelta(days=retro_start)
            start_str_list.append(start.strftime('%Y%m%d'))
            retro_start -=30
            
        else:
            pass

    # For end dates
    for y in range(0,1):
        if retro_end > 0:
            end = today - datetime.timedelta(days=retro_end)
            end_str_list.append(end.strftime('%Y%m%d'))        
            retro_end -=30
            
        else:
            pass

    end_str_list.append(today.strftime('%Y%m%d'))

    #List of endpoints for API
    complete_endpoints = []
    for i in range(0,len(start_str_list)):
        complete_endpoints.append(f"{start_str_list[i]}:{end_str_list[i]}")

    #Base URL setup
    base_url = "https://www.ncdc.noaa.gov/swdiws/json/nx3tvs/"

    #List of all URLs
    all_urls = []
    for dates in complete_endpoints:
        complete_url = base_url + dates
        all_urls.append(complete_url)

    #List/Variables setup
    cell_type =[]
    shape =[]
    max_shear = []
    wsr_id =[]
    mxdv = []
    cell_id =[]
    ztime = []
    azimuth = []
    range_ = []
    lat = []
    lon = []

    #----BEGIN Loop----
    # Looping through urls and appending data to lists
    for url in all_urls:
        response = requests.get(url).json()
        for i in range(len(response["result"])):
            cell_type.append(response["result"][i]["CELL_TYPE"])
            shape.append(response["result"][i]["SHAPE"])
            max_shear.append(response["result"][i]["MAX_SHEAR"])
            wsr_id.append(response["result"][i]["WSR_ID"])
            mxdv.append(response["result"][i]["MXDV"])
            cell_id.append(response["result"][i]["CELL_ID"])
            ztime.append(response["result"][i]["ZTIME"])
            azimuth.append(response["result"][i]["AZIMUTH"])
            range_.append(response["result"][i]["RANGE"])
            lon.append(response["result"][i]["SHAPE"].split()[1:][0].split('(')[1])
            lat.append(response["result"][i]["SHAPE"].split()[1:][1].split(')')[0])

    #----END Loop-----

    #Creating dataframe of all records
    dict = {"Cell_Type": cell_type,
            "Shape": shape,
            "Max_Shear": max_shear,
            "WSR_ID": wsr_id,
            "MXDV": mxdv,
            "Cell_ID": cell_id,
            "zTime": ztime,
            "Azimuth": azimuth,
            "Range": range_,
            "Lat": lat,
            "Lon": lon
        }

    # df = pd.DataFrame(dict)

    # #Creating additional columns
    # df['Date']=pd.to_datetime(df['zTime']).dt.date
    # df['Time']=pd.to_datetime(df['zTime']).dt.time
    # df['Year']=pd.to_datetime(df['zTime']).dt.year
    # df['Month']=pd.to_datetime(df['zTime']).dt.month
    date = []
    time = []
    year = []
    month = []
    for x in ztime:
        date.append(datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%SZ').strftime('%m/%d/%Y'))
        time.append(datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%SZ').strftime('%H:%M:%S'))
        year.append(datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%SZ').year)
        month.append(datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%SZ').month)
    dict['Date']= date
    dict['Time']= time
    dict['Year']= year
    dict['Month']= month


    #Primary Key to id tornados
    # df['PKID']=df['Cell_ID']+df['zTime'].astype(str)
    pkid = []
    for x in range(len(cell_id)):
        pkid.append(cell_id[x] + date[x])
    dict['PKID'] = pkid

    #convert df back to dictionary for app.py
    # dict = df.to_dict()

    return dict


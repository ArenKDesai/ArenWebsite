import pandas as pd
from django.http import HttpResponse
from django.shortcuts import render
import requests
import regex as re

def index(request):
    return render(request, 'index.html')

def aquire_csv(start_year, end_year):
    base_url = 'https://ftp.cpc.ncep.noaa.gov/htdocs/products/analysis_monitoring/cdus/degree_days/archives/Heating%20degree%20Days/monthly%20states/'

    months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec'
    ]
    months_cap = {
        months[0] : 'Jan',
        months[1] : 'Feb',
        months[2] : 'Mar',
        months[3] : 'Apr',
        months[4] : 'May',
        months[5] : 'Jun',
        months[6] : 'Jul',
        months[7] : 'Aug',
        months[8] : 'Sep',
        months[9] : 'Oct',
        months[10] : 'Nov',
        months[11] : 'Dec'
    }
    df_complete = None

    for year in range(start_year, end_year + 1):
        # Grab the correct URL
        url = f'{base_url}{year}'
        # Iterate by month
        for month in months:
            # They changed the spelling in 2008
            if year < 2008:
                key = month
            else:
                key = months_cap[month]
            month_data_url = f'{url}/{key} {year}.txt'
            html = requests.get(month_data_url)

            # Turn month data into dataframe
            data_lines = html.text.split('\n')[15:78]
            df_dict = {'Region':[], f'{year} Total Degree Days':[], f'{year} Deviation From Norm':[], }
            for line in data_lines:
                name = re.search(r'\S+ \S* \S*', line)
                if name:
                    name_str = name.group(0)
                    
                    # Get the names of the regions
                    if name_str.strip() not in df_dict['Region'] and name_str.strip() != 'REGION':
                        df_dict['Region'].append(name_str.strip())

                    # Get the values of both columns
                    dd_values = re.search(r'\d+ +\-*\d+', line)
                    if dd_values:
                        split_vals = dd_values.group(0).split(' ')
                        tdd = int(split_vals[0])
                        if tdd == -999: tdd = 0
                        dfn = int(split_vals[-1])
                        if dfn == -999: dfn = 0
                        df_dict[f'{year} Total Degree Days'].append(tdd)
                        df_dict[f'{year} Deviation From Norm'].append(dfn)
                month_df = pd.DataFrame(df_dict)

                # Merge the previous data with the new data
                if df_complete is not None:
                    # Check if a previous month has been processed
                    if f'{year} Total Degree Days' in df_complete.columns:
                        df_complete[f'{year} Total Degree Days'] = df_complete[f'{year} Total Degree Days'] + month_df[f'{year} Total Degree Days']
                    else:
                        df_complete[f'{year} Total Degree Days'] = month_df[f'{year} Total Degree Days']

                    # Repeat for other column
                    if f'{year} Deviation From Norm' in df_complete.columns:
                        df_complete[f'{year} Deviation From Norm'] = df_complete[f'{year} Deviation From Norm'] + month_df[f'{year} Deviation From Norm']
                    else:
                        df_complete[f'{year} Deviation From Norm'] = month_df[f'{year} Deviation From Norm']
                # Complete df is new
                else:
                    df_complete = month_df
    return df_complete

def download_csv(request):
    if request.method == 'POST':
        start_year = int(request.POST.get('start_year'))
        end_year = int(request.POST.get('end_year'))
        
        df = aquire_csv(start_year, end_year)
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="degree_days.csv"'
        
        df.to_csv(path_or_buf=response, index=False)
        
        return response
    else:
        return HttpResponse("Method not allowed")
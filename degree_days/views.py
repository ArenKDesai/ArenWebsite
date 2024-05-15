import pandas as pd
from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

def download_csv(request):
    if request.method == 'POST':
        start_year = int(request.POST.get('start_year'))
        end_year = int(request.POST.get('end_year'))
        
        # Generate CSV content using pandas
        data = {'Year': [], 'Degree Days': []}
        for year in range(start_year, end_year + 1):
            # Calculate degree days for each year (example: dummy value)
            degree_days = year * 10  
            data['Year'].append(year)
            data['Degree Days'].append(degree_days)
        
        df = pd.DataFrame(data)
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="degree_days.csv"'
        
        df.to_csv(path_or_buf=response, index=False)
        
        return response
    else:
        return HttpResponse("Method not allowed")
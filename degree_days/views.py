import csv
from django.http import HttpResponse
from django.shortcuts import render

html2 = '''
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Degree Days</title>

    <link href="../media/styles.css" rel="stylesheet" />
  </head>

  <body>
    <div class="scrollbox">
      <div class="textbox">

        <header>
          <br />
          <h1>Download Degree Days CSV</h1>
          <br />
        </header>

        <form method="post" action="{% url 'download_csv' %}">
        <p>From: (start year, inclusive)</p> 
        <input type="text" name="start_year">
        <br />
        <p>To: (end year, inclusive)</p>
        <input type="text" name="end_year">
        <br />
        <br />
        {% csrf_token %}
        <p><button type="submit">Download CSV</button></p>
        </form>
      </div>
    </div>

  </body>
</html>
'''

def index(request):
    return render(request, 'degree_days/index.html')

def download_csv(request):
    if request.method == 'POST':
        start_year = int(request.POST.get('start_year'))
        end_year = int(request.POST.get('end_year'))
        
        # Generate CSV content
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="degree_days.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Year', 'Degree Days'])
        for year in range(start_year, end_year + 1):
            # Calculate degree days for each year (example: dummy value)
            degree_days = year * 10  
            writer.writerow([year, degree_days])
        
        return response
    else:
        return HttpResponse("Method not allowed")

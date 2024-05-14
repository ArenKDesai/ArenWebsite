from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ValidationError  # for handling invalid input

import csv  # for CSV generation

def index(request):
    if request.method == 'POST':
        # Handle form submission
        try:
            start_year = int(request.POST['start_year'])
            end_year = int(request.POST['end_year'])
            # Perform calculations or data retrieval based on start_year and end_year
            # (Replace this section with your logic to generate the CSV data)

            # Generate CSV data (replace with your actual data)
            csv_data = [
                ['Year', 'Degree Days'],
                [2020, 1234],
                [2021, 2345],
                # ... more data based on start_year and end_year
            ]

            # Create the HttpResponse object with CSV content
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename=degree_days.csv'

            writer = csv.writer(response)
            writer.writerows(csv_data)

            return response
        except (ValueError, ValidationError):
            # Handle invalid input (e.g., non-numeric values)
            return render(request, 'index.html', {'error': 'Please enter valid years.'})

    else:
        # Render the initial form
        return render(request, 'index.html')
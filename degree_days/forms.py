from django import forms

class YearInputForm(forms.Form):
    year1 = forms.IntegerField(label="Start Year")
    year2 = forms.IntegerField(label="End Year")
from django.shortcuts import render
import requests
import os

# Create your views here.
from django.http import HttpResponse
html = '''
<!DOCTYPE html>

<html>

<body style="background-color:#b9ffe9;">

<!-- inspiration from bettermotherfuckingwebsite.com -->

<meta charset="utf-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<a href="home">arendesai.com</a>

<title>Aren's Ed Pol 140 Final</title>

<style type="text/css">body{margin:40px auto;max-width:650px;line-height:1.6;font-size:18px;color:#444;padding:0 10px}h1,h2,h3{line-height:1.2}</style>

<h1>Sustainability Education</h1>

<aside>by Aren Desai</aside>

<h2>Intro</h2>

<p>Climate change most likely needs no introduction. If it does, there are most likely countless reports of how devasting the impacts of climate change have already been, and how much worse it's going to get. 
A comprehensive introduction to climate change, including it's potential impacts, can be found at the <a href="https://www.un.org/en/climatechange/what-is-climate-change">UN's website</a>, where they highlight 
that many industrialized countries have commited to spending $100 billion a year fighting climate change. Clearly, the climate change issue is large, problematic, and concerning. </p>

<h3>Figure 1: Temperature Anomoly (difference from average) by Year</h3>

<img border="0" src="../media/cc_plt.png" width="650" height="390" />

<aside><em>Data from NASA climate data API. Code in Appendix.</em></aside>

<p>However, while much work is being done to further the fight against climate change, the same could not be said for climate change education. Specifically in America, Katie Worth's piece 
<em>Miseducation: How Climate Change Is Taught in America</em> is a harrowing tale that spells out (as its title suggests) how poor the USA's climate change education is. Specifically, Worth details the issue of
miseducation, stating:</p>

<blockquote>"<em>It’s safe to say that across
the country, intrepid teachers rigorously educate their students
about climate science. It’s also safe to say that, commonly, a
teacher down the hall is miseducating them about it.</em>" (Worth, 2021)</blockquote>

<p>While miseducation is an incredible issue for the USA to face (as Worth can attest), it is also not the only problem. Climate change being part of a K-12 curriculum isn't only miseducated, it often may not be educated at all. 
Jennifer Clare Ball reports in her article <a href="https://www.earthisland.org/journal/index.php/articles/entry/new-science-standards-bring-climate-to-classroom/">"New Science Standards Bring Climate to the Classroom"</a> that New Jersey 
and Connecticut are the only states that require a climate change education, while the other 48 don't.</p>

<p>There is a clear issue with climate change education in the USA. The issue can be summarised with a few keypoints:</p>

<li>Climate change education isn't required, and may not be taught. </li>

<li>Miseducation (infactual information spread) is real and unmanaged.</li>

<p>Fortunately, some reasearch has already been done on ways to manage this issue.</p>

<h2>Research & Proposed Solutions</h2>

<p>Proposing potential solutions to the US's failing sustainability edcuation is difficult due to the large nature of the problem. As stated before, there are two strong notions in the American mindset that 
sustainability educaiton is either not important or not a real issue. Even if the majority of Americans wanted better sustainability education, it still may be difficult to achieve due to budget and resource
restraints, so this issue can seem incredibly daunting with all its downfalls. </p>

<p>Stephen Sterling, in his book <em>Sustainability Education: Perspectives and Practice Across Higher Education</em>, believes that separating the issue into segments makes it easier to manage. 
With this divided approach, he proposes methods of incorporating sustainability education into higher education through each division. For example, "Chapter 10: Engineering our World Towards a Sustainable 
Future: Edited by Simon Steiner" focuses on the role that engineers can play in improving sustainability, and how that role can be better taught. He highlights a few case studies, such as 
chemical and civil engineering majors being required to complete projects based on controlling sustainable water use. 
</p>

<p>Most sustainability education policy suggestions are similar in structure, proposing either classes or assignments that students can complete in order to learn about sustainablility. The proposals are 
often good suggestions that rely on tested and achievable case studies, like those in Sterling's book. However, these proposals don't challenge the question of whether sustainability education should be 
taught at all. It is clear from a scientific standpoint that sustainability education should be taught, but as established previously, not all Americans agree.</p>

<h2>Improving the American Opinion of Sustainability Education</h2>

<p>I would argue that most solutions presented to improve sustainability education would work to at least a minimally successful degree. Many of the programs suggested by Sterling work well in the UK. 
Furthermore, it seems that many young people actually enjoy working on sustainable project. Often, students complain that they have to learn subjects in school that won't be useful in adult life, with 
the most cited subject being math. However, more often then not, students and young people are among the demograohic that believe in sustainability, and are willing to learn about it.</p>

<p>In other words, while meaningful proposals are plentiful for improving sustainability education, and it appears that the students are willing to be taught, it only leaves the teachers and the American 
voters as the culprits for our subpar sustainability education. For this reason, I don't believe that sustainability education policy changes should be optional. As stated before in the piece, one of the 
two greatest problems being faced by sustainability education is that sustainability education isn't manditory, so it may be ignored. In my opionion, this is a much more important topic to target than specifics 
on how to implement sustainability education./p>

<p>For example, as Sterling suggested, it could be manditory that schools must place a few sustainability-related projects within their other classes. For example, STEM courses could research a sustainable technology. 
English classes could write essays on sustainability, and so on. While this may not be a perfect solution, and this may be met with great opposition, it is still important to attempt to establish a manditory basis 
for sustainability education.</p>

<h2>Citations</h2>

<li>
 Angrist,Noam; Winseck,Kevin; Patrinos,Harry Anthony; Zivin,Joshua S. Graff.

Human Capital and Climate Change (English). Policy Research working paper ; no. WPS 10316 Washington, D.C. : World Bank Group. http://documents.worldbank.org/curated/en/099509302242338718/IDU054e742ca083900487a0955e0f1e36d80c5db
</li>

<li>
Worth, Katie. (2021). <em>Miseducation: How Climate Change Is Taught in America</em>.
</li>

<li>
Sustainability Education : Perspectives and Practice Across Higher Education, edited by Stephen Sterling, Taylor & Francis Group, 2010. ProQuest Ebook Central, https://ebookcentral.proquest.com/lib/wisc/detail.action?docID=585460.
</li>

<h2>Appendix</h2>

<code>

<pre>

insert_code_here

</pre>

</code>

</body>

</html>
'''

code_section = r'''
import requests
import pandas as pd
import flask

api_url = "https://data.giss.nasa.gov/gistemp/graphs_v4/graph_data/Monthly_Mean_Global_Surface_Temperature/graph.txt"
response = requests.get(api_url)

# Split the response into lines
api_response = response.text
lines = api_response.split('\n')

# Extract column names from the second line
columns = ['Date','Station','Land+Ocean','Land_Only','Open_Ocean']

# Extract data rows from the remaining lines
data_rows = [line.split() for line in lines[5:]]

# Create DataFrame
df = pd.DataFrame(data_rows, columns=columns)

# Convert 'Year+Month' column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# Convert other columns to numeric
df.iloc[:, 1:] = df.iloc[:, 1:].apply(pd.to_numeric)

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(df['Date'], df['Land+Ocean'], label='Land+Ocean')
# plt.plot(df['Date'], df['Land_Only'], label='Land Only')
# plt.plot(df['Date'], df['Open_Ocean'], label='Open Ocean')
plt.xlabel('Date')
plt.ylabel('Temperature Anomaly (C)')
plt.title('Monthly Mean Surface Temperature Anomaly')
plt.legend()
plt.grid(True)
plt.savefig('cc_plt.png')
plt.show()

'''
def index(request):
    new_html = html.replace('insert_code_here',code_section)
    return HttpResponse(new_html)

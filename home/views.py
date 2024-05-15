from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
html = '''
<!DOCTYPE html>
<html>
<!-- inspiration from bettermotherfuckingwebsite.com -->

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>arendesai.com</title>
<style type="text/css">body{margin:40px auto;max-width:650px;line-height:1.6;font-size:18px;color:#444;padding:0 10px}h1,h2,h3{line-height:1.2}</style>
</head>
<body style="background-color:#b9ffe9;>

<h1>welcome to aren's website</h1>
<p>I'm a deep learning engineer, data scientist, and guitar player. I've optimized this website with Django to save energy. And time. </p>
<h2>github links</h2>
<p>Projects I'm proud of.</p>
<li><a href="https://github.com/ArenKDesai/AIAssistant">AI Companion</a> (wip) --> An AI assistant built with GPT3.5, OpenAI Whisper, YOLO detection, and ElevenLabs voice synthesization. </li>
<li><a href="https://github.com/ArenKDesai/Arcade">Arcade</a> (hiatus) --> A custom arcade game based on competitive Pokemon developed with Pygame and no imported template, framework, or engine.</li>
<li><a href="https://github.com/ArenKDesai/Stock-Predictor">Stock Predictor</a> (hiatus) --> A Keras LSTM trained on Tech stock data with a frontend built with Java for speed.</li>
<li><a href="https://github.com/ArenKDesai/Murder-Mod">Stardew Valley Termination Mod</a> (complete) --> A mod for Stardew Valley to allow the termination of NPCs. Written in C#.</li>

<h2>academics</h2>

<p>Fall 2025 undergrad of computer science & data science @ UW - Madison.</p>

<li>Introduction to Educational Policy (Ed Pol 140): <a href="sustainability-education">Sustainability Education Policy Analysis</a></li>

<li>Applied Multivariate Analysis (Stats 456): <a href="../media/akdesaia_finalproj.pdf">GPU Similarity vs Performance</a></li>

<h2>socials</h2>
<li><a href="https://www.linkedin.com/in/aren-desai-aba931241">LinkedIn</a></li>
</body>
</html>
'''

html2 = '''
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>aren</title>

    <link href="../media/styles.css" rel="stylesheet" />
  </head>

  <body>
    <div class="scrollbox">
      <div class="textbox">

        <header>
          <br />
          <h1>welcome to arendesai.com</h1>
          <br />
          <p>I'm a deep learning engineer, data scientist, and guitar player. 
          <br />
          I've optimized this website with Django to save energy. And time. </p>
        </header>

        <br />
        <br />
        <h2>useful links</h2>
        <p>Completed projects that can be accessed from the web</p>
        <br />
        <br />

        <a href="degree-days"><button class="linkbutton"<u>Degree Days CSV</u></a>
        <p>An easy-to-download CSV of the degree days for all states and USA total between two given years. Put the same year twice for one year. <b>IMPORTANT:</b> 
        Any degree day per month from the CPC that couldn't be measured was recorded as -999 in their database, but this was switched to 0 to avoid errors. 
        </p>

        <br />
        <br />
        <h2>github links</h2>
        <p>Projects I'm proud of.</p>
        <br />
        <br />

        <a href="https://github.com/ArenKDesai/AIAssistant"><button class="linkbutton"><u>AI Companion <em>Beans</em></u></button></a>
        <p>
        An AI assistant built with GPT3.5, OpenAI Whisper, YOLO detection, and ElevenLabs voice synthesization.
        <br />
        (w.i.p.)
        </p>
        <br />

        <a href="https://github.com/ArenKDesai/Arcade"><button class="linkbutton"><u>Arcade Game</u></button></a>
        <p>
        A custom arcade game based on competitive Pokemon developed with Pygame and no imported template, framework, or engine.
        <br />
        (hiatus)
        </p>
        <br />

        <a href="https://github.com/ArenKDesai/Stock-Predictor"><button class="linkbutton"><u>Stock Predictor</u></button></a>
        <p>
        A Keras LSTM trained on Tech stock data with a frontend built with Java for speed.
        <br />
        (hiatus)
        </p>
        <br />

        <a href="https://github.com/ArenKDesai/Murder-Mod"><button class="linkbutton"><u>Stardew Valley Termination Mod</u></button></a>
        <p>
        A mod for Stardew Valley to allow the termination of NPCs. Written in C#.
        <br />
        (complete)
        </p>
        <br />

        <br />
        <h2>academics</h2>
        <p>Fall 2025 undergraduate student of computer science & data science @ UW - Madison.</p>

        <br />
        <br />
        <a href="sustainability-education"><button class="linkbutton"><u>Sustainability Education Policy Analysis</u></button></a>
        <p>
        A concise report with cited papers to provide background on the evidence. The paper explores the need for better sustainability education in the USA. 
        <br />
        (introduction to education policy // ed pol 140)
        </p>
        <br />

        <br />
        <a href="../media/akdesaia_finalproj.pdf"><button class="linkbutton"><u>GPU Similarity vs Performance</u></button></a>
        <p>
        A thorough exploration of similarity in GPUs spanning multiple decades. Includes PCA, K-NN, K-Means, and spectral clustering, as well as various statistical descriptions of the dataset.
        <br />
        (applied multivatiate analysis // stats 456)
        </p>
        <br />


      </div>
    </div>

    <div class="footer">
      <div class="links2">
        <a href="https://www.linkedin.com/in/aren-desai-aba931241"><button class="linkbutton">LinkedIn</button></a>
        •
        <a href="https://github.com/ArenKDesai"><button class="linkbutton">Github</button></a>
      </div>
    </div>

  </body>
</html>
'''

def index(request):
    return HttpResponse(html2)

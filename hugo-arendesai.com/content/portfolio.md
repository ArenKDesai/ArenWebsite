+++
date = '2024-11-12T14:01:21-06:00'
title = 'Portfolio'
+++

## Degrees

I am a senior undergraduate student at the University of Wisconsin - Madison getting a Bachelor's of Science with two majors: Computer Science and Data Science. 

I specialize in Data Science and Machine Learning, but I also have deep experience with Linux systems and databases. 

I'm currently learning computer graphics.

Here's my <a href="/resume_nodetails.pdf" download="/resume_nodetails.pdf">resume</a> with the sensitive details removed. 

## Developed Projects

### Unity HDRP Boat ([github](https://github.com/ArenKDesai/Boat))
Tags: *Blender, Unity, 3D, Mesh, Graphics*
![Boat](/boat.png)
A mesh of a fishing vessel designed in Blender and shaders designed to handle water and snow in Unity. 

### Hourly Dispatch Simulator (<a href="/MarketSimulatorDocs.md" download="/MarketSimulatorDocs.md">documentation</a>)

While I can't post the code due to company policy, I developed a highly efficient simulator of the Blount Generating Station for Madison Gas & Electric. 

It used scipy.optimize's minimize function with a custom objective function as it's MISO market simulation with over twenty parameters, and double checked against real LMP data for validity. Then, it used a dynamic programming approach to optimize the hourly dispatch of Blount by generating every possible daily hourly dispatch option (over 1 billion options!), then filtering out the impossible configurations, using the previous market simulation as a vector to mat-mul against the hourly dispatch matrix, and taking the maximum index. This returns the maximum possible daily revenue. 

### AI Assistant (<a href="https://github.com/ArenKDesai/AI-Assistant">github</a>)
Tags: *AI, Machine Learning (ML), LLM, HuggingFace, Group Project*

An LLM running Google's Gemma that uses JSONformer to call user-defined functions as an object-oriented AI-Assistant with plugin capabilities. 

### This GCP Website 
Tags: *Google Cloud, GCP, Web*

This website was developed using <a href="https://gohugo.io">hugo</a> and the risotto theme. It lives on a Google Cloud Platform bucket where HTTP/HTTPS requests are managed with an automatic load balancer with a manual SSL certificate. 

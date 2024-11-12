+++
date = '2024-11-12T14:01:21-06:00'
title = 'Portfolio'
+++

## Degrees

I am a senior undergraduate student at the University of Wisconsin - Madison getting a Bachelor's of Science with two majors: Computer Science and Data Science. 

I've also been the Finance Lead of the Google Developer Student Club and a software developer for the UW Robotics team (Software - Arm division).

Here's my <a href="/resume_nodetails.pdf" download="/resume_nodetails.pdf">resume</a> with the sensitive details removed. 

## Developed Projects

### Hourly Dispatch Simulator --- Madison Gas & Electric
While I can't post the code due to company policy, I developed a highly efficient simulator of the Blount Generating Station for Madison Gas & Electric. 

It used scipy.optimize's minimize function with a custom objective function as it's MISO market simulation with over twenty parameters, and double checked against real LMP data for validity. Then, it used a dynamic programming approach to optimize the hourly dispatch of Blount by generating every possible daily hourly dispatch option (over 1 billion options!), then filtering out the impossible configurations, using the previous market simulation as a vector to mat-mul against the hourly dispatch matrix, and taking the maximum index. This returns the maximum possible daily revenue. 

<a href="/MarketSimulatorDocs.md" download="/MarketSimulatorDocs.md">Documentation</a>

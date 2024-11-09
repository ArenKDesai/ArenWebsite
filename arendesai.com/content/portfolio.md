+++
title = "Portfolio"
description = "Aren Desai's Portfolio"
date = "2024-11-08"
author = "Aren Desai"
+++

Aren Desai is a Computer Science / Data Science dual major at the University of Wisconsin, currently completing his senior year. You can view his code on [his github](https://github.com/ArenKDesai). 

[Here](/resume_nodetails.pdf) is my resume (with my address taken out of course). 

# Notable Projects

## Hourly Dispatch Simulator - MGE

While I can't post the code due to company policy, I developed a highly efficient simulator of the Blount Generating Station for Madison Gas & Electric. 

It used scipy.optimize's minimize function with a custom objective function as it's MISO market simulation with over twenty parameters, and double checked against real LMP data for validity. Then, it used a dynamic programming approach to optimize the hourly dispatch of Blount by generating every possible daily hourly dispatch option (over 1 billion options!), then filtering out the impossible configurations, using the previous market simulation as a vector to mat-mul against the hourly dispatch matrix, and taking the maximum index. This returns the maximum possible daily revenue. 

[Documentation](/MarketSimulatorDocs.md)

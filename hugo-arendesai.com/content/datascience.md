+++
date = '2025-01-14T22:29:24-06:00'
title = 'Data Science'
+++

Unfortunately, most of my real-world work is company property, so I can't show you the details. I can provide metrics and documentation instead. 

## Professional

### Locational Market Price (LMP) Forecasting
*Forecasting, Machine Learning (ML), LASSO Regression, Deep Neural Networks (DNN)*

A deep exploration of locational market price (LMP) data focused on Madison, WI. Multiple data sources were used and coordinated with data engineers to develop a [LEAR](https://www.mdpi.com/1996-1073/9/8/621) and deep neural network (DNN) model that captures the spatiotemporal nature of LMP data, and allows for a 2-week forecast. This is used by Madison Gas & Electric's (MGE's) energy traders to maximize potential revenue. 

### Hourly Dispatch Simulator (<a href="/MarketSimulatorDocs.txt" download="/MarketSimulatorDocs.txt">documentation</a>)
*scikit-learn, NumPy*

The simulator uses scipy.optimize's minimize function with a custom objective function as it's MISO market simulation with over twenty parameters, and double checked against real LMP data for validity. Then, it used a dynamic programming approach to optimize the hourly dispatch of Blount by generating every possible daily hourly dispatch option (over 1 billion options!), then filtering out the impossible configurations, using the previous market simulation as a vector to mat-mul against the hourly dispatch matrix, and taking the maximum index. This returns the maximum possible daily revenue. 

The tool is currently being used by MGE's energy traders to predict minute changes' effects to unit parameters. 

## Personal

### AI Assistant ([github](https://github.com/ArenKDesai/AI-Assistant))
*HuggingFace, LLM, RAG, Docker, gRPC*

An LLM running Google's Gemma that uses JSONformer to call user-defined functions as an object-oriented AI-Assistant with plugin capabilities. 

### This GCP Website ([github](https://github.com/ArenKDesai/ArenWebsite))
*Google Cloud Platform (GCP), Hugo, Linux, Bucket, HTTPS*

This website was developed using <a href="https://gohugo.io">hugo</a> and the risotto theme. It lives on a Google Cloud Platform bucket where HTTP/HTTPS requests are managed with an automatic load balancer with a manual SSL certificate. 

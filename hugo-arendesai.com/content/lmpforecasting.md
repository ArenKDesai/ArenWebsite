+++
draft = false
title = 'Locational Market Price (LMP) Forecasting'
+++
<link rel="stylesheet" href="../style.css">

<a href="../index.html">home</a>

A deep exploration of locational market price (LMP) data focused on Madison, WI for Madison Gas & Electric (MGE). Multiple data sources were used and coordinated with data engineers to develop a [temporal fusion transformer](https://arxiv.org/abs/1912.09363) that captures the spatiotemporal nature of LMP data, allows for a 2-week forecast, and maintains explainability. This is used by MGE energy traders to maximize potential revenue. 
PyTorch and Tensorflow were both used for the temporal fusion transformer, and a large quantity of SQL and BeanShell (Java child language) was written to move and download data. 

Code is restricted. Ask me for details. 
+++
draft = false
title = 'GCP Website (arendesai.com)'
+++
<link rel="stylesheet" href="../style.css">

<a href="../index.html">home</a>

*Google Cloud Platform (GCP), Hugo, Linux, Bucket, HTTPS, OIDC, GitHub Actions*

This website was developed using <a href="https://gohugo.io">hugo</a> and the risotto theme. It lives on a Google Cloud Platform bucket where HTTP/HTTPS requests are managed with an automatic load balancer with a manual SSL certificate. It also uses OIDC and two GitHub actions to automatically deploy the changes on the GitHub hugo page and the GCP bucket when the `main` branch is updated. 

<a href="https://github.com/ArenKDesai/ArenWebsite" target="_blank">GitHub</a>
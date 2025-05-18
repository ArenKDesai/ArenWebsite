+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
+++

<style>
    Body {
        background-image: url("../paper.jpg");
        background-size: cover;
    }
</style>
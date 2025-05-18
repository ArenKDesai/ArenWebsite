+++
draft = false
title = 'Market Simulation Optimizer'
+++

<style>
    Body {
        background-image: url("../paper.jpg");
        background-size: cover;
    }
</style>

### Market Simulation Optimizer (<a href="/MarketSimulatorDocs.txt" download="/MarketSimulatorDocs.txt">documentation</a>)
*scikit-learn, NumPy*

The simulator uses scipy.optimize's minimize function with a custom objective function as it's MISO market simulation with over twenty parameters, and double checked against real LMP data for validity. Then, it used a dynamic programming approach to optimize the hourly dispatch of Blount by generating every possible daily hourly dispatch option (over 1 billion options!), then filtering out the impossible configurations, using the previous market simulation as a vector to mat-mul against the hourly dispatch matrix, and taking the maximum index. This returns the maximum possible daily revenue. 

The tool is currently being used by MGE's energy traders to predict minute changes' effects to unit parameters. 
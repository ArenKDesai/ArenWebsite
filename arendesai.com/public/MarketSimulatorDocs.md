<h1>Overview</h1>

MarketSimulator.py is an hourly dispatch simulator that runs on user-input data to simulate the energy market targeting one energy generation unit. It takes in a variety of simulation data, some hourly and some constants, and uses these to predict key targets, such as the MW dispatch and the maximum marginal profit. This can be used to simulate changing conditions, such as ramp rate or adders, to see how the hourly dispatch would respond. 

<h2>Table of Contents</h2>

- [Usage](#usage)
- [Setup](#setup)
- [CSV](#csv)
- [JSON](#json)
- [Process](#process)

<h1 id="usage">Usage</h1>

<h2 id="setup">Setup</h2>

1. Create the [CSV](#csv). If you plan on running the program twice to compare market simulations, consider making a copy so you'll have the original and changed copies to reference.
2. Create the [JSON](#json).
3. Run the program
   1. If you have Python installed, replace the information in the brackets and run this command: ```pip install -r requirements.txt & MarketSimulator.py --csv={./path/to/.csv} --json={./path/to/.json}```
      1. Or, if you have run the program before, just run ```MarketSimulator.py --csv={./path/to/.csv} --json={./path/to/.json}```
   2. If you don't have Python, replace the information in the brackets and run this command: ```MarketSimulator.exe --csv={./path/to/.csv} --json={./path/to/.json}```
4. The program will append the results to your CSV file.

NOTE: Specifying "Include Startup" will increase the runtime from around 2-3 minutes to around 12-15 minutes. 

<h2 id="csv">CSV</h2>

<h3>Creation</h3>

To begin with, the user needs to create a CSV file that includes the following columns:

- **date** (any): This date column is helpful for the user but isn't used in the simulation. This is intended to be an *hourly* dispatch. 
- **LMP** (float): The locational market price of the unit. 
- **REG MCP** (float): Regulation market clearing price. 
- **SPIN MCP** (float): Spinning reserve market clearing price.
- **GAS PRICE** (float): The current gas price. 

Example:

<table>
    <tr>
        <th>date</th>
        <th>LMP</th>
        <th>REG MCP</th>
        <th>SPIN MCP</th>
        <th>GAS PRICE</th>
    </tr>
    <tr>
        <td><i>datetime</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
    </tr>
    <tr>
        <td><i>datetime</i></td>
        <td><i>float</td>
        <td><i>float</td>
        <td><i>float</td>
        <td><i>float</td>
    </tr>
</table>

<h3>Output</h3>

After the program is done running, it will append the following columns to your CSV file: 

- **en MW** (float): The MW allocated straight to energy
- **reg MW** (float): The MW allocated for regulation. 
- **spin MW** (float): The MW allocated for spinup. 
- **en $** (float): The money made from energy production. 
- **reg $** (float): The money made from regulation. 
- **spin $** (float): The money made from spinup. 
- **REV** (float): The total revenue. 
- **COST** (float): The total costs occured. 
- **MARGIN** (float): **REV** - **COST**
- **schedule** (int): Whether the unit was selected to be on during this hour. 
- **startup_cost** (float): If this unit is starting up, this is the cost for doing so. 

Example:

<table>
    <tr>
        <th>date</th>
        <th>LMP</th>
        <th>REG MCP</th>
        <th>SPIN MCP</th>
        <th>GAS PRICE</th>
        <th>en MW</th>
        <th>reg MW</th>
        <th>spin MW</th>
        <th>en $</th>
        <th>reg $</th>
        <th>spin $</th>
        <th>REV</th>
        <th>COST</th>
        <th>MARGIN</th>
        <th>schedule</th>
        <th>startup_cost</th>
    </tr>
    <tr>
        <td><i>datetime</td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>bool</td>
        <td><i>bool</td>
    </tr>
    <tr>
        <td><i>datetime</td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>float</i></td>
        <td><i>bool</td>
        <td><i>bool</td>
    </tr>
</table>

<h2 id="json">JSON</h2>

The JSON is a configuration file of constants the program uses. Most of the fields are self-explanatory. Here are some optional fields:

- **Include Startup** (bool/int): whether to include the startup costs in the optimization. 1 for "yes", 0 for "no". 

Example:

```{JSON}
{
    "O&M hourly" : int,
    "O&M per MWH" : float,
    "Spin Offer" : float,
    "Reg Offer" : float,
    "x2" : float,
    "x" : float,
    "c" : float,
    "efficiency" : float,
    "Hot Start MBTU" : int,
    "Hot Start $" : int,
    "Cold Start MBTU" : int,
    "Cold Start $" : int,
    "Int Start MBTU" : int,
    "Int Start $" : int,
    "Hot to Int Hours" : int,
    "Hot to Cold Hours" : int,
    "Minimum Run Hours" : int,
    "Minimum Down Hours" : int,
    "Minimum MW" : int,
    "Maximum MW" : int,
    
    "Include Startup" : bool
}
```

<h1 id="process">Process</h1>

This is a breakdown of how to program generates the simulation. 

<h3>Step 1: Starting the Program</h3>

The program runs the ```if __name__ == '__main__':``` field, which checks the passed arguments for --csv={.csv}, --json={.json}, and --help. --csv and --json specify the CSV and JSON files for the program to run, while --help will print the help string and exit the program. It then passes the arguments to ```main(csv_path:str, json_path:str) -> None```

<h3>Step 2: Beginning the Simulation</h3>

```main(csv_path, json_path)``` is called, which initializes the passes CSV file into the object ```df``` and the JSON file into the object ```config```, which is a newly defined object called ```SimConfig```. This just makes it easier to pass the data into other methods without having to declare each value every time. A timer is started, and ```calculate_res_rows(df:pd.DataFrame, config:SimConfig) -> pd.DataFrame``` is called. 

<h3>Step 3: Optimizing the MW allocation</h3>

The function ```__get_nine_opres``` will take one row of the dataframe, which represents one hour of the market, extract relevent data, and call ```call_scipy_optimize``` with that data. ```call_scipy_optimize``` organizes all the data required to call scikit-learn's powerful optimization routines into one objective function, four constraints, and three bounds. The solution object is returned, which is used to create the allocated MW and financial columns. The dataframe with the optimized MW allocation is returned. 

<h3>Step 4: Optimizing the hourly dispatch</h3>

The "MARGIN" column from the previous step represents the money that the unit will make (or lose) if turned on. This column is turned into a vector titled ```total_margin```. 

In order to simulate possible hourly dispatches for a whole day, a decision matrix is created. This deision matrix is a 2D matrix of 0s and 1s, where each 1 represents the unit being turned on. This matrix starts as the ```combinations``` object, which is a 16777216,24 matrix where each row represents a day and each column represents one hour of the day. The ```filter_schedule``` function filters this matrix to only include hourly dispatch options that are possible for the current unit depending on the information provided in the configuration JSON. 

Next, the algorithm will iterate through the dataframe in 24 hour (daily) batches. It will take a slice of the "MARGIN" column as a 24,1 vector and a new ```valid_day_matrix``` filtered to match the current hourly dispatch possibilities, and it will use NumPy's matrix multiplication routine to multiply the matrix (*n*,24 x 24,1) to generate a vector of all possible revenues from hourly dispatch. If "Include Startup" is specified, startup costs will also be calculated using dynamic programming to speed up the processing of every possible startup cost. These startup costs will be a sum of the possible daily startup costs, and be subtracted from the possible daily revenues. 

From the possible daily revenues vector, the maximum possible daily revenue found, and the index of that dispatch is taken. This index is used to find the original hourly dispatch and add it to the dataframe. 
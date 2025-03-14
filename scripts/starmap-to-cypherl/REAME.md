This script creates cypherl dump file from the starmap data to be used in the Neo4j/memgraph database.

## Requirements

1. A working installation of conda (https://docs.conda.io/projects/conda/en/stable/user-guide/getting-started.html)
1. The game client starmap extracted using https://github.com/frontier-reapers/frontier-static-data?tab=readme-ov-file#export_starmappy

## Setup conda environment

```
conda env create -f environment.yml
conda activate eve-pytorch
```

## Run the script

Output systems to a cypherl dump file in the `output` directory.

```
python main.py
```

Also output jumps up to 100ly to a cypherl dump file in the `output` directory.

```
python main.py --jumps-max 100
```
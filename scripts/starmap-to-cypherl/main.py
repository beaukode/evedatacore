import json
import torch
import os
import tqdm
import argparse
import systems
import math

def parse_args():
    parser = argparse.ArgumentParser(description='Convert starmap data to Cypher queries')
    
    parser.add_argument('-o', '--output', type=str, default="./output",
                        help='Path to output directory')
    parser.add_argument('-s', '--source', type=str, default="./starmap.json",
                        help='Path to source JSON file')
    parser.add_argument('--solar-systems', '--ss', dest='solar_systems', action='store_true', default=True,
                        help='Process solar systems (default: True)')
    parser.add_argument('--no-solar-systems', '--no-ss', dest='solar_systems', action='store_false',
                        help='Do not process solar systems')
    parser.add_argument('--jumps-min', '-jmin', type=int, default=0,
                        help='Minimum jump distance in light years (default: 0)')
    parser.add_argument('--jumps-max', '-jmax', type=int, default=0,
                        help='Maximum jump distance in light years, 0 means do not process jumps (default: 0)')
    parser.add_argument('--jumps-batch', '-jb', type=int, default=1000,
                        help='Number of jumps per batch file (default: 1000)')
    
    args = parser.parse_args()
    
    # Validate arguments
    if args.jumps_min < 0:
        parser.error("--jumps-min must be a positive integer")
    
    if args.jumps_max < 0:
        parser.error("--jumps-max must be a positive integer")
    
    if args.jumps_max > 0 and args.jumps_min > args.jumps_max:
        parser.error("--jumps-min must be lower than --jumps-max")
    
    if args.jumps_batch < 100:
        parser.error("--jumps-batch must be at least 100")
    
    if not os.path.isfile(args.source):
        parser.error(f"Source file {args.source} does not exist")
    
    return args

args = parse_args()

if not os.path.exists(args.output):
    os.makedirs(args.output)

with open(args.source, 'r') as file:
    starmap_data = json.load(file)

py_solarsystems = {}

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device {device}")

for solar_system_id in starmap_data['solarSystems']:
    [x, y, z] = starmap_data['solarSystems'][solar_system_id]["center"]
    [ix, iy, iz] = [int(x), int(y), int(z)]
    py_solarsystems[int(solar_system_id)] = torch.tensor([ix, iy, iz], dtype=torch.float64, device=device)

print(f"Loaded {len(py_solarsystems)} solar systems")

if(args.solar_systems):
   systems.solarsystems_to_cypherl(f"{args.output}/solarsystems.cypherl", py_solarsystems)

if(args.jumps_max > 0):
    file_idx = 0
    file_count = 0
    output_file = open(f"{args.output}/jumps-{file_idx}.cypherl", 'w', encoding='utf-8')
    for src in tqdm.tqdm(py_solarsystems, desc=f"Processing jumps between {args.jumps_min} and {args.jumps_max} light years"):
        file_count += 1
        if(file_count > args.jumps_batch):
            file_idx += 1 
            file_count = 0
            output_file.close()
            output_file = open(f"{args.output}/jumps-{file_idx}.cypherl", 'w', encoding='utf-8')
        count = 0
        # TODO: Optimize this loop by processing tensors in parallel
        for dest in py_solarsystems:
            if(src == dest or src > dest):
                continue
            dist = int(math.ceil(systems.distance3d(py_solarsystems[src], py_solarsystems[dest])))
            
            if dist < args.jumps_min or dist > args.jumps_max:
                continue
                
            count += 1
            output_file.write(f"MATCH (s1:SolarSystem {{id: {src}}}) MATCH (s2:SolarSystem {{id: {dest}}}) MERGE (s1)-[:JUMP {{weight: {dist}}}]-(s2);\n")
    

import tqdm
import torch

def solarsystems_to_cypherl(dest:str, data: dict[int, dict[str, torch.Tensor]]):
    # PCA transform to reduce dimensionality
    data2d =__pca_transform(data)
    reference_system_3d = data[30000001]
    reference_system_2d = data2d[30000001]

    output_file = open(dest, 'w', encoding='utf-8')
    output_file.write("CREATE INDEX ON :SolarSystem(id);\n")
    output_csv = open(f"{dest}.csv", 'w', encoding='utf-8')
    output_csv.write("id,3d_x,3d_y,3d_z,3d_dist,2d_x,2d_y,2d_dist,dist_ratio\n")
    count = 0
    for id in tqdm.tqdm(data2d, desc=f"Processing solar systems"):
        [x, y] = [data2d[id][i].item() for i in range(2)] 
        [x3d, y3d, z3d] = data[id]
        d3d = distance3d(reference_system_3d, data[id])
        d2d = distance2d(reference_system_2d, data2d[id])
        ratio = 0 if d2d == 0 else d3d / d2d
        output_file.write(f"MERGE (s:SolarSystem {{id: {id}}}) SET s.x = {x:.8f}, s.y = {y:.8f};\n")
        output_csv.write(f"{id},{x3d:.0f},{y3d:.0f},{z3d:.0f},{d3d:.8f},{x:.8f},{y:.8f},{d2d:.8f},{(ratio):.8f}\n")
    output_file.close()

def distance3d(a: torch.Tensor, b: torch.Tensor) -> float:
    assert a.shape == (3,), "a must be a tensor containing a tuple of 3 integers"
    assert b.shape == (3,), "b must be a tensor containing a tuple of 3 integers"

    # Calculate the distance in meters using PyTorch    
    meters = torch.sqrt(torch.sum((a - b) ** 2))

    # Convert meters to light-years
    ly = meters / 9.46073047258e15

    # Move the result back to CPU and convert to Python float
    return ly.item()

def distance2d(a: torch.Tensor, b: torch.Tensor) -> float:
    assert a.shape == (2,), "a must be a tensor containing a tuple of 2 integers"
    assert b.shape == (2,), "b must be a tensor containing a tuple of 2 integers"
    # Calculate the distance in meters using PyTorch    
    dist = torch.sqrt(torch.sum((a - b) ** 2))

    # Move the result back to CPU and convert to Python float
    return dist.item()

def __pca_transform(data: dict[int, dict[str, torch.Tensor]]):
    tensor_list = list(data.values())

    # Stack tensors into a single 2D tensor
    data_3d_tensor = torch.stack(tensor_list) / 1e18

    min = torch.min(data_3d_tensor).item()
    max = torch.max(data_3d_tensor).item()
    print(f"Min value: {min}")
    print(f"Max value: {max}")    

    # Center the data
    mean = torch.mean(data_3d_tensor, dim=0)
    data_centered = data_3d_tensor - mean

    # Compute covariance matrix
    cov_matrix = torch.mm(data_centered.t(), data_centered) / (data_centered.size(0) - 1)

    # Singular value decomposition (SVD)
    u, s, v = torch.svd(cov_matrix)

    # Select first two principal components
    components = v[:, :2]

    # Project data onto principal components
    data_2d_tensor = torch.mm(data_centered, components)

    r = {}
    for idx, k in enumerate(data.keys()):
        r[k] = data_2d_tensor[idx]

    return r
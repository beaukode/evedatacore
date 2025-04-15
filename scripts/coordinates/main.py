# GLOBAL_RATIO = 1000000
GLOBAL_RATIO_2 = 1

def get_msb_value(value, position):
    """
    Get the value of the most significant bit (MSB) of an integer.

    Parameters:
    value (int): The integer from which to get the MSB value.

    Returns:
    int: The value of the MSB (0 or 1).
    """
    if value == 0:
        return 0

    # Determine the number of bits required to represent the integer
    num_bits = value.bit_length()

    # Create a mask with a 1 at the MSB position
    msb_mask = 1 << (num_bits - position)

    # Isolate the MSB using bitwise AND
    msb_value = (value & msb_mask) >> (num_bits - position)

    return msb_value

def get_bit_value(value, x):
    """
    Get the value of the x-th bit of an integer.

    Parameters:
    value (int): The integer from which to get the bit value.
    x (int): The position of the bit to retrieve (1-based index).

    Returns:
    int: The value of the x-th bit (0 or 1).
    """
    # Shift 1 to the left by (x-1) positions to create a mask
    mask = 1 << (x - 1)
    # Perform bitwise AND with the mask and shift the result right by (x-1) positions
    bit_value = (value & mask) >> (x - 1)
    return bit_value

def isBitOn(value: int, bit: int) -> bool:
    return get_bit_value(value, bit) != 0

def print_hex(label: str, point):
    print(f"{label}: {hex(point['x'])} {hex(point['y'])} {hex(point['z'])}")

def to_int128(value: int) -> int:
    # int128 (-170141183460469231731687303715884105728 to 170141183460469231731687303715884105727)
    int128_val = (value & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
    if int128_val > 170141183460469231731687303715884105727:
        int128_val -= 340282366920938463463374607431768211456
    return int128_val

def decode_location(location):
    x = to_int128(location['x'])
    y = to_int128(location['y'])
    z = to_int128(location['z'])
    # print(f"x: {get_msb_value(location['x'], 2)} y: {get_msb_value(location['y'], 2)} z: {get_msb_value(location['z'], 2)}")
    # if(get_msb_value(x, 2) == 1):
    #     x = -x
    # if(get_msb_value(y, 2) == 1):
    #     y = -y
    # if(get_msb_value(z, 2) == 1):
    #     z = -z
    return {
        "x": x,
        "y": -y,
        "z": z,
    }

def calculate_3d_distance(point1, point2):
    # print(f"point1: {point1}")
    # print(f"point2: {point2}")
    dx = point1["x"] - point2["x"]
    dy = point1["y"] - point2["y"] 
    dz = point1["z"] - point2["z"]
    # print(f"dx: {dx}m {(dx/1000):.2f}km {(dx/299792458):.2f}ls")
    # print(f"dy: {dy}m {(dy/1000):.2f}km {(dy/299792458):.2f}ls")
    # print(f"dz: {dz}m {(dz/1000):.2f}km {(dz/299792458):.2f}ls")
    return (dx**2 + dy**2 + dz**2) ** 0.5

# OFD-D0B 30022226
ofd_star = {
    "x": -17391118353044603000,
    "y": -764848738144354399,
    "z": -16251680159529173000,
}
ofd_star_api = {
    "x": -17391118870654126080,
    "y": -764848730884144512,
    "z": -16251680436592746496,      
    "radius": 559370530,
}

# EL1-LN9 30022165
el1_star_api = {
    "x": -17551117186879700992,
    "y": -828398744407579392,
    "z": -15838342011342823424,
    "radius": 212713756,
}


# 11 182 km from star
ssu1 = {
    "x": 57896044618658097711785492504343953926634992332820282019711400885085360586752,
    "y": 57896044618658097711785492504343953926634992332820282019729556852687560838144,
    "z": 57896044618658097711785492504343953926634992332820282019712540323520074024960,
}
ssu1_api = {
    "x": -1055625202505318400,
    "y": -764848730996018200,
    "z": -2195063637218756600,
}
ssu1_128 = decode_location(ssu1)
ssu2 = {
    "x": 57896044618658097711785492504343953926634992332820282019711400885085361127424,
    "y": 57896044618658097711785492504343953926634992332820282019729556852687560727680,
    "z": 57896044618658097711785492504343953926634992332820282019712540323520073924608,
}
ssu2_api = {
    "x": -1055625202505859100,
    "y": -764848730995907700,
    "z": -2195063637218656300,
}

# https://main.eve.beaukode.net/explore/assemblies/112868525755626718892292168215665462376781764527384853640704472525578044964792
ssu3 = {
    "x": 57896044618658097711785492504343953926634992332820282019698047234200956604416,
    "y": 57896044618658097711785492504343953926634992332820282019731401693324623421440,
    "z": 57896044618658097711785492504343953926634992332820282019711864656801322913792,
}
ssu3_128 = decode_location(ssu3)


# https://main.eve.beaukode.net/explore/assemblies/40129488290070565180850902156544640796479777432709860403902974548606999062646
ssu4 = {
    "x": 57896044618658097711785492504343953926634992332820282019729778621530205123968,
    "y": 57896044618658097711785492504343953926634992332820282019730573886548845417472,
    "z": 57896044618658097711785492504343953926634992332820282019739723329127564130304,
}
ssu4_128 = decode_location(ssu4)

# https://main.eve.beaukode.net/explore/assemblies/109812521192785324252193513962753536872714377335732873403388249604671828653307
#  ~ 4 000 km from star
el1_ssu = {
    "x": 57896044618658097711785492504343953926634992332820282019711240886769484859392,
    "y": 57896044618658097711785492504343953926634992332820282019729620402701014941440,
    "z": 57896044618658097711785492504343953926634992332820282019712953661945293993984,
}
el1_ssu_128 = decode_location(el1_ssu)

import math

def get_sun_warp_in_point(radius: float) -> tuple[float, float, float]:
    x = (radius + 100000) * math.cos(radius)
    y = 0.2 * radius
    z = -(radius + 100000) * math.sin(radius)
    return round(x), round(y), round(z)

[x,y,z] = get_sun_warp_in_point(ofd_star_api['radius'])
print(f"x: {x} y: {y} z: {z}")
ofd_star_warp = {"x": ofd_star_api['x'] - z, "y": ofd_star_api['y'] - y, "z": ofd_star_api['z'] + x}
print(f"Ofd star warp: {ofd_star_warp}")

# print_hex("SSU1", ssu1)
# print(ssu1_128)
# print_hex("SSU2", ssu2)
# print_hex("SSU3", ssu3)
# print(ssu3_128)
# print_hex("SSU4", ssu4)
# print(ssu4_128)
# print_hex("EL1 SSU", el1_ssu)
# print(el1_ssu_128)


# print(f"Distance ssu1_api: {distance:.2f}m {(distance/1000):.2f}km {(distance/299792458):.2f}ls")

print("--- ODF ---")
print(f"ofd_star_warp: {ofd_star_warp} ofd_star_api: {ofd_star_api}")
distance_warp = calculate_3d_distance(ofd_star_warp, ofd_star_api) - ofd_star_api['radius']
print(f"Distance ofd warp: {(distance_warp/1000):.2f}km {(distance_warp/299792458):.2f}ls")
distance_ofd = calculate_3d_distance(ssu1_128, ofd_star_api) - ofd_star_api['radius']
print(f"Distance ssu1_128: {(distance_ofd/1000):.2f}km {(distance_ofd/299792458):.2f}ls")
distance_ssu_warp = calculate_3d_distance(ssu1_128, ofd_star_warp)
print(f"Distance ssu1_128 warp: {(distance_ssu_warp/1000):.2f}km {(distance_ssu_warp/299792458):.2f}ls")

distance_ofd_ssu_center = calculate_3d_distance(ssu1_128, {"x":0, "y":0, "z":0})
print(f"Distance ofd_ssu_center: {(distance_ofd_ssu_center/1000):.0f}km {(distance_ofd_ssu_center/299792458):.0f}ls")
distance_ofd_star_center = calculate_3d_distance(ofd_star_api, {"x":0, "y":0, "z":0})
print(f"Distance ofd_star_center: {(distance_ofd_star_center/1000):.0f}km {(distance_ofd_star_center/299792458):.0f}ls")
center_ofd = distance_ofd_ssu_center - distance_ofd_star_center
print(f"Diff: {(center_ofd/1000):.0f}km {ofd_star_api['radius']}")


print("--- EL1 ---")
distance_el1 = calculate_3d_distance(el1_ssu_128, el1_star_api)
print(f"Distance el1_ssu: {(distance_el1/1000):.2f}km {(distance_el1/299792458):.2f}ls")

distance_el1_ssu_center = calculate_3d_distance(el1_ssu_128, {"x":0, "y":0, "z":0})
print(f"Distance el1_ssu_center: {(distance_el1_ssu_center/1000):.2f}km {(distance_el1_ssu_center/299792458):.2f}ls")
distance_el1_star_center = calculate_3d_distance(el1_star_api, {"x":0, "y":0, "z":0})
print(f"Distance el1_star_center: {(distance_el1_star_center/1000):.2f}km {(distance_el1_star_center/299792458):.2f}ls")
center_el1 = distance_el1_ssu_center - distance_el1_star_center
print(f"Diff: {(center_el1/1000):.0f}km {el1_star_api['radius']}")

print("--- RATIO ---")
ratio = ofd_star_api['radius']/el1_star_api['radius'] 
radio_distance = center_ofd / center_el1
print(f"Ratio: {ratio} {radio_distance} {distance_el1*ratio/1000:.2f}km {distance_ofd/ratio/1000:.2f}km")

import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

# Create a figure with 2x2 subplots
fig = plt.figure(figsize=(20, 20))

# Create sphere
def create_sphere(center, radius):
    u = np.linspace(0, 2 * np.pi, 100)
    v = np.linspace(0, np.pi, 100)
    x = center['x']/GLOBAL_RATIO_2 + radius/GLOBAL_RATIO_2 * np.outer(np.cos(u), np.sin(v))
    y = center['y']/GLOBAL_RATIO_2 + radius/GLOBAL_RATIO_2 * np.outer(np.sin(u), np.sin(v))
    z = center['z']/GLOBAL_RATIO_2 + radius/GLOBAL_RATIO_2 * np.outer(np.ones(np.size(u)), np.cos(v))
    return x, y, z

# Create horizontal plane
def create_plane(center, size=1000000):  # size in km
    xx, yy = np.meshgrid(
        np.linspace(center['x'] - size, center['x'] + size, 10),
        np.linspace(center['y'] - size, center['y'] + size, 10)
    )
    zz = np.full_like(xx, center['z'])
    return xx, yy, zz

def plot_view(star, ssu, ax, view_angle, title):
    # Plot the OFD star as a sphere
    x_sphere, y_sphere, z_sphere = create_sphere(star, star["radius"])
    ax.plot_surface(x_sphere, y_sphere, z_sphere, color='yellow', alpha=0.3)

    # Plot Star center
    ax.scatter(star['x']/GLOBAL_RATIO_2, star['y']/GLOBAL_RATIO_2, star['z']/GLOBAL_RATIO_2, 
            c='black', marker='o', s=100, label='Star center')

    # Plot SSU1 point
    ax.scatter(ssu['x']/GLOBAL_RATIO_2, ssu['y']/GLOBAL_RATIO_2, ssu['z']/GLOBAL_RATIO_2, 
            c='blue', marker='o', s=100, label='SSU')
    
    print(f"SSU: {ssu['x']/GLOBAL_RATIO_2} {ssu['y']/GLOBAL_RATIO_2} {ssu['z']/GLOBAL_RATIO_2}")
    print(f"Star: {star['x']/GLOBAL_RATIO_2} {star['y']/GLOBAL_RATIO_2} {star['z']/GLOBAL_RATIO_2}")
    print(f"Warp: {ofd_star_warp['x']/GLOBAL_RATIO_2} {ofd_star_warp['y']/GLOBAL_RATIO_2} {ofd_star_warp['z']/GLOBAL_RATIO_2}")
    
    # Plot warp point
    ax.scatter(ofd_star_warp['x']/GLOBAL_RATIO_2, ofd_star_warp['y']/GLOBAL_RATIO_2, ofd_star_warp['z']/GLOBAL_RATIO_2, 
            c='red', marker='x', s=100, label='Warp point')

    # Set labels
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')

    # Add legend
    ax.legend()

    # Set the view angle
    ax.view_init(elev=view_angle[0], azim=view_angle[1])
    
    # Set title
    ax.set_title(title)

# Create four different views
views = [
    {'angle': (45, 45), 'title': 'Isometric View', 'pos': 221},
    {'angle': (90, 0), 'title': 'Top View', 'pos': 222},
    {'angle': (0, 0), 'title': 'Side View', 'pos': 223},
    {'angle': (0, 90), 'title': 'Front View', 'pos': 224}
]

# Plot each view
for view in views:
    ax = fig.add_subplot(view['pos'], projection='3d')
    plot_view(ofd_star_api, ssu1_128, ax, view['angle'], view['title'])

# Adjust layout to prevent overlap
plt.tight_layout()

# Save the combined plot
plt.savefig('ssu_locations_all_views.svg', bbox_inches='tight', dpi=300)
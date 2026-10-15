import colorsys
import os
import subprocess
import time

def build_lut():
    # 64x64x64 lookup table is 262,144 points, takes < 0.1s to compute
    # and provides smooth quantization
    lut = {}
    for r in range(256):
        # We can directly do a formula or fast calculation
        pass

def process_file(in_path, out_path):
    ppm_temp = in_path + ".temp.ppm"
    ppm_out = out_path + ".out.ppm"
    
    # Convert input to PPM P6
    subprocess.run(["convert", in_path, ppm_temp], check=True)
    
    with open(ppm_temp, "rb") as f:
        header = b""
        while True:
            line = f.readline()
            if line.startswith(b"#"):
                continue
            header += line
            parts = header.split()
            if len(parts) >= 4:
                break
        
        fmt = parts[0].decode()
        width = int(parts[1])
        height = int(parts[2])
        maxval = int(parts[3])
        
        raw_data = bytearray(f.read())
        
    os.remove(ppm_temp)
    
    # Build 3D LUT (64x64x64)
    # Step = 4
    lut = bytearray(64 * 64 * 64 * 3)
    for ir in range(64):
        r = (ir * 4 + 2) / 255.0
        for ig in range(64):
            g = (ig * 4 + 2) / 255.0
            for ib in range(64):
                b = (ib * 4 + 2) / 255.0
                h, s, v = colorsys.rgb_to_hsv(r, g, b)
                
                # Check for blue/cyan range: 170° (0.47) to 270° (0.75)
                # s >= 0.08 (ignore pure gray / parchment paper)
                if s >= 0.08 and 0.46 <= h <= 0.75:
                    # Calculate weight for smooth transition at boundaries
                    if h < 0.52:
                        # transition from cyan to blue: weight increases from 0 to 1
                        weight = (h - 0.46) / (0.52 - 0.46)
                    elif h > 0.70:
                        # transition from indigo to violet: weight decreases from 1 to 0
                        weight = (0.75 - h) / (0.75 - 0.70)
                    else:
                        weight = 1.0
                    
                    # Target emerald green: 0.40 (144°)
                    target_h = 0.40
                    new_h = (1.0 - weight) * h + weight * target_h
                    
                    # Ensure rich royal emerald: keep saturation vibrant
                    new_s = s * 1.05 if s < 0.9 else s
                    new_s = min(1.0, new_s)
                    new_v = v
                    
                    nr, ng, nb = colorsys.hsv_to_rgb(new_h, new_s, new_v)
                else:
                    nr, ng, nb = r, g, b
                    
                idx = (ir * 64 * 64 + ig * 64 + ib) * 3
                lut[idx] = min(255, max(0, int(nr * 255 + 0.5)))
                lut[idx + 1] = min(255, max(0, int(ng * 255 + 0.5)))
                lut[idx + 2] = min(255, max(0, int(nb * 255 + 0.5)))
                
    # Process raw image data using LUT
    total_bytes = len(raw_data)
    for i in range(0, total_bytes, 3):
        r = raw_data[i]
        g = raw_data[i+1]
        b = raw_data[i+2]
        
        ir = r >> 2
        ig = g >> 2
        ib = b >> 2
        
        idx = (ir * 4096 + ig * 64 + ib) * 3
        raw_data[i] = lut[idx]
        raw_data[i+1] = lut[idx+1]
        raw_data[i+2] = lut[idx+2]
        
    # Write PPM P6
    with open(ppm_out, "wb") as f:
        f.write(f"P6\n{width} {height}\n255\n".encode())
        f.write(raw_data)
        
    # Convert back to target format
    if out_path.lower().endswith(".png"):
        subprocess.run(["convert", ppm_out, "-quality", "95", out_path], check=True)
    else:
        subprocess.run(["convert", ppm_out, "-quality", "92", out_path], check=True)
        
    os.remove(ppm_out)
    print(f"Processed {in_path} -> {out_path} successfully ({width}x{height})")

if __name__ == "__main__":
    targets = [
        ("./public/assets/img/c1.jpg", "./public/assets/img/c1.jpg"),
        ("./public/assets/img/c2.jpg", "./public/assets/img/c2.jpg"),
        ("./public/assets/img/c3.jpg", "./public/assets/img/c3.jpg"),
        ("./public/assets/img/c4.jpg", "./public/assets/img/c4.jpg"),
        ("./public/assets/img/c5.jpg", "./public/assets/img/c5.jpg"),
        ("./public/assets/img/55.PNG", "./public/assets/img/55.PNG"),
        ("./public/assets/img/about1.jpg", "./public/assets/img/about1.jpg"),
        ("./public/assets/img/about2.jpg", "./public/assets/img/about2.jpg"),
    ]
    for src, dst in targets:
        if os.path.exists(src):
            process_file(src, dst)

import math
import subprocess
import os
import sys

WIDTH = 720
HEIGHT = 1280
FPS = 30
DURATION = 12
TOTAL_FRAMES = FPS * DURATION

print(f"Generating intro video: {WIDTH}x{HEIGHT} @ {FPS}fps, duration={DURATION}s ({TOTAL_FRAMES} frames)...")

# 1. Background
subprocess.run([
    "convert", "-size", f"{WIDTH}x{HEIGHT}",
    "gradient:#071224-#0d254c",
    "-fill", "#1e3a8a33",
    "-draw", "circle 360,450 360,200",
    "/tmp/bg.png"
], check=True)

# 2. Globe
subprocess.run([
    "convert", "-size", f"{WIDTH}x{HEIGHT}", "xc:none",
    "-fill", "#2563eb",
    "-draw", "circle 360,450 360,610",
    "-fill", "#93c5fd",
    "-draw", "roundrectangle 260,400 380,470 30,30",
    "-draw", "roundrectangle 340,350 440,410 25,25",
    "-draw", "roundrectangle 300,480 390,530 20,20",
    "-stroke", "rgba(255,255,255,0.25)", "-strokewidth", "2", "-fill", "none",
    "-draw", "ellipse 360,450 160,70 0,360",
    "-draw", "ellipse 360,450 80,160 0,360",
    "-draw", "line 200,450 520,450",
    "-draw", "line 360,290 360,610",
    "/tmp/globe.png"
], check=True)

# 3. Orbit
subprocess.run([
    "convert", "-size", f"{WIDTH}x{HEIGHT}", "xc:none",
    "-stroke", "rgba(255,255,255,0.4)", "-strokewidth", "2",
    "-fill", "none",
    "-draw", "ellipse 360,450 230,95 0,360",
    "/tmp/orbit.png"
], check=True)

# 4. Text
subprocess.run([
    "convert", "-size", f"{WIDTH}x350", "xc:none",
    "-font", "/usr/share/fonts/truetype/kacst/KacstTitle.ttf",
    "-gravity", "center",
    "-fill", "#ffffff", "-pointsize", "44",
    "-annotate", "+0-60", "أكاديمية الأفق",
    "-fill", "#ffffff", "-pointsize", "34",
    "-annotate", "+0+10", "للتدريب والاستشارات",
    "-fill", "#7dd3fc", "-pointsize", "22",
    "-annotate", "+0+75", "نحلق معك نحو التميز",
    "/tmp/text.png"
], check=True)

# 5. Airplane
subprocess.run([
    "convert", "-size", "80x80", "xc:none",
    "-fill", "#ffffff",
    "-draw", "polygon 40,10 47,40 75,55 75,62 47,56 46,72 54,78 54,82 40,79 26,82 26,78 34,72 33,56 5,62 5,55 33,40",
    "-fill", "#38bdf8",
    "-draw", "polygon 40,15 44,38 36,38",
    "/tmp/plane.png"
], check=True)

print("All elements generated successfully!")

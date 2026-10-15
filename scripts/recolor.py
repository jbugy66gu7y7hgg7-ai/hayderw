import sys
import colorsys

def transform(r, g, b):
    rn = r / 255.0
    gn = g / 255.0
    bn = b / 255.0

    h, l, s = colorsys.rgb_to_hls(rn, gn, bn)
    h_deg = h * 360.0

    # Green range is typically between 70 and 170 degrees with saturation > 0.10
    if 68.0 <= h_deg <= 172.0 and s > 0.10:
        # Smooth weight transition near boundaries
        if h_deg < 85.0:
            weight = (h_deg - 68.0) / 17.0
        elif h_deg > 155.0:
            weight = (172.0 - h_deg) / 17.0
        else:
            weight = 1.0

        # Elegant color mapping based on luminance:
        # High luminance: luminous cyan / azure sheen (202 deg)
        # Mid luminance: rich royal blue (218 deg)
        # Dark luminance: deep luxury navy (225 deg)
        if l > 0.62:
            target_h = 202.0
            target_s = min(1.0, s * 1.15)
            target_l = l
        elif l < 0.28:
            target_h = 225.0
            target_s = min(1.0, s * 1.25)
            target_l = l * 0.88
        else:
            # Interpolate smoothly between dark navy and cyan-blue
            t = (l - 0.28) / (0.62 - 0.28)
            target_h = 224.0 - t * (224.0 - 206.0) # 224 down to 206
            target_s = min(1.0, s * 1.22)
            target_l = l * (0.88 + t * 0.10)

        final_h = (h_deg * (1.0 - weight) + target_h * weight) / 360.0
        final_s = min(1.0, max(0.0, s * (1.0 - weight) + target_s * weight))
        final_l = min(1.0, max(0.0, l * (1.0 - weight) + target_l * weight))

        ro, go, bo = colorsys.hls_to_rgb(final_h, final_l, final_s)
        return (
            int(min(255, max(0, ro * 255.0 + 0.5))),
            int(min(255, max(0, go * 255.0 + 0.5))),
            int(min(255, max(0, bo * 255.0 + 0.5)))
        )
    return (r, g, b)

def main():
    data = sys.stdin.buffer.read()
    total_pixels = len(data) // 3
    out = bytearray(len(data))
    cache = {}

    for i in range(total_pixels):
        offset = i * 3
        r = data[offset]
        g = data[offset + 1]
        b = data[offset + 2]

        key = (r << 16) | (g << 8) | b
        res = cache.get(key)
        if res is None:
            res = transform(r, g, b)
            cache[key] = res

        out[offset] = res[0]
        out[offset + 1] = res[1]
        out[offset + 2] = res[2]

    sys.stdout.buffer.write(out)

if __name__ == '__main__':
    main()

import os
import re
import base64

def bundle():
    dist_dir = 'dist'
    html_file = os.path.join(dist_dir, 'index.html')
    if not os.path.exists(html_file):
        print("dist/index.html not found. Run npm run build first.")
        return

    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find CSS file
    css_files = [f for f in os.listdir(os.path.join(dist_dir, 'assets')) if f.endswith('.css')]
    # Find JS file
    js_files = [f for f in os.listdir(os.path.join(dist_dir, 'assets')) if f.endswith('.js') and not f.endswith('.map')]

    if not css_files or not js_files:
        print("Could not find css/js bundles.")
        return

    css_path = os.path.join(dist_dir, 'assets', css_files[0])
    js_path = os.path.join(dist_dir, 'assets', js_files[0])

    print("Embedding CSS from:", css_path)
    print("Embedding JS from:", js_path)

    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    with open(js_path, 'r', encoding='utf-8') as f:
        js = f.read()

    # Prepare base64 embedded logo for 100% offline self-containment
    logo_path = 'public/assets/img/alofuk_logo.jpg'
    opt_logo = '/tmp/logo_opt.jpg'
    if not os.path.exists(opt_logo) and os.path.exists(logo_path):
        os.system(f'convert {logo_path} -resize 200x200 -quality 85 {opt_logo}')
    
    if os.path.exists(opt_logo):
        with open(opt_logo, 'rb') as lf:
            logo_b64 = "data:image/jpeg;base64," + base64.b64encode(lf.read()).decode('utf-8')
            js = js.replace('/assets/img/alofuk_logo.jpg', logo_b64)
            html = html.replace('/assets/img/alofuk_logo.jpg', logo_b64)

    # In HTML, replace stylesheet link with inline <style>
    style_tag = "<style>\n" + css + "\n</style>"
    html = re.sub(r'<link[^>]*rel=["\']stylesheet["\'][^>]*>', lambda m: style_tag, html)

    # In HTML, replace script src with inline <script>
    safe_js = js.replace('</script>', '<\\/script>')
    script_tag = '<script type="module">\n' + safe_js + '\n</script>'
    html = re.sub(r'<script[^>]*src=["\'][^"\']+["\'][^>]*></script>', lambda m: script_tag, html)

    # Save to standalone directory
    os.makedirs('github_pages_single_file', exist_ok=True)
    out_file = 'github_pages_single_file/index.html'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = os.path.getsize(out_file) / 1024
    print(f"SUCCESS: Generated {out_file} ({size_kb:.1f} KB)")

if __name__ == '__main__':
    bundle()

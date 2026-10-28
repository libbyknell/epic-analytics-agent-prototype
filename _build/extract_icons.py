"""Extract tinyspeck (real Slack) icons from slack-proto-kit's icon-components.tsx into icons.json {name: svg}."""
import re, json, sys
src = open(sys.argv[1]).read()
out = {}
def kebab(n):
    return re.sub(r'(?<!^)(?=[A-Z])|(?<=[a-z])(?=[0-9])', '-', n).lower()
for m in re.finditer(r'const Icon(\w+) = React\.forwardRef.*?=> (<svg .*?</svg>)\);', src):
    name, svg = kebab(m.group(1)), m.group(2)
    svg = svg.replace(' ref={ref} {...props}', '')
    svg = re.sub(r'\b(fill|clip|stroke)([A-Z])(\w*)=', lambda x: x.group(1)+'-'+x.group(2).lower()+x.group(3)+'=', svg)
    svg = svg.replace(' />', '/>').replace('clipPath', 'clipPath')
    out[name] = svg
json.dump(out, open(sys.argv[2], 'w'), indent=0)
print(len(out))

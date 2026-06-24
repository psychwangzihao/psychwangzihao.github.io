#!/usr/bin/env python3
import base64, json, subprocess, os

REPO = "psychwangzihao/psychwangzihao.github.io"
full = os.path.expanduser("~/personal-homepage/_pages/group.md")

r = subprocess.run(['gh', 'api', f'repos/{REPO}/git/ref/heads/main', '--jq', '.object.sha'],
                   capture_output=True, text=True, timeout=10)
HEAD = r.stdout.strip()
print(f"HEAD: {HEAD}")

content_b64 = base64.b64encode(open(full, 'rb').read()).decode()
blob = json.loads(subprocess.run(
    ['gh','api','--method','POST',f'repos/{REPO}/git/blobs','--input','-'],
    input=json.dumps({'content': content_b64, 'encoding': 'base64'}),
    capture_output=True, text=True, timeout=10).stdout)
print(f"Blob: {blob['sha']}")

tree = json.loads(subprocess.run(
    ['gh','api','--method','POST',f'repos/{REPO}/git/trees','--input','-'],
    input=json.dumps({'base_tree': HEAD, 'tree': [
        {'path': '_pages/group.md', 'mode': '100644', 'type': 'blob', 'sha': blob['sha']}
    ]}),
    capture_output=True, text=True, timeout=10).stdout)
print(f"Tree: {tree['sha']}")

commit = json.loads(subprocess.run(
    ['gh','api','--method','POST',f'repos/{REPO}/git/commits','--input','-'],
    input=json.dumps({'message': 'Group: external link to CO-LAB', 'tree': tree['sha'], 'parents': [HEAD]}),
    capture_output=True, text=True, timeout=10).stdout)
print(f"Commit: {commit['sha']}")

subprocess.run(['gh','api','--method','PATCH',f'repos/{REPO}/git/refs/heads/main','--input','-'],
               input=json.dumps({'sha': commit['sha'], 'force': False}),
               capture_output=True, text=True, timeout=10)
print("DONE")

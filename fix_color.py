import base64, json, subprocess
REPO = 'psychwangzihao/psychwangzihao.github.io'
r = subprocess.run(['gh', 'api', f'repos/{REPO}/git/ref/heads/main', '--jq', '.object.sha'], capture_output=True, text=True)
HEAD = r.stdout.strip()
print(f'HEAD: {HEAD}')
with open('/Users/henrywzh/personal-homepage/_sass/_variables.scss', 'rb') as f:
    content = base64.b64encode(f.read()).decode()
blob = json.loads(subprocess.run(['gh','api','--method','POST',f'repos/{REPO}/git/blobs','--input','-'], input=json.dumps({'content':content,'encoding':'base64'}), capture_output=True, text=True).stdout)
print(f'Blob: {blob["sha"][:7]}')
tree = json.loads(subprocess.run(['gh','api','--method','POST',f'repos/{REPO}/git/trees','--input','-'], input=json.dumps({'base_tree':HEAD,'tree':[{'path':'_sass/_variables.scss','mode':'100644','type':'blob','sha':blob['sha']}]}), capture_output=True, text=True).stdout)
print(f'Tree: {tree["sha"][:7]}')
commit = json.loads(subprocess.run(['gh','api','--method','POST',f'repos/{REPO}/git/commits','--input','-'], input=json.dumps({'message':'Revert dark mode to original cyan','tree':tree['sha'],'parents':[HEAD]}), capture_output=True, text=True).stdout)
print(f'Commit: {commit["sha"][:7]}')
subprocess.run(['gh','api','--method','PATCH',f'repos/{REPO}/git/refs/heads/main','--input','-'], input=json.dumps({'sha':commit['sha'],'force':False}), capture_output=True)
print('DONE')

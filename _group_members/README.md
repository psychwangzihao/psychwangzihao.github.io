# Group Member Profiles

Place individual member profile files and images here.

## How to Add a Member

1. Place the member's photo in `assets/img/`
2. Edit `_data/group_members.yml` and add a new entry:

```yaml
- name: Full Name
  role: Your Role (e.g., PhD Student)
  image: your_photo.jpg
  research: One-sentence research focus
  contact: your.email@example.com
  website: https://your-site.com  # optional
  bio: >
    Longer biography or description. 
    Can span multiple lines with YAML > syntax.
```

3. The group page will automatically display the new member.

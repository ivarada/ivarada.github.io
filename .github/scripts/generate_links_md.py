import pandas as pd

# Read the CSV from _config/
df = pd.read_csv('_config/links.csv')

# Sort by Category, then Name
df = df.sort_values(['Category', 'Name'])

# Group by Category
output = []
for category, group in df.groupby('Category'):
    output.append(f"### {category}")
    for _, row in group.iterrows():
        output.append(f"* [{row['Name']}]({row['Link']})")
    output.append("")  # Blank line for spacing

# Write to Markdown file in _config/
with open('_config/links.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

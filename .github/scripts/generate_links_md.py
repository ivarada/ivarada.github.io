import pandas as pd
import re

# Read the CSV from _config/
df = pd.read_csv('_config/links.csv')
df.columns = df.columns.str.strip()

required_cols = {'Category', 'Name', 'Link'}
if not required_cols.issubset(df.columns):
    raise ValueError(f"CSV file must contain columns: {required_cols}. Found: {df.columns.tolist()}")

# Sort by Category, then Name
df = df.sort_values(['Category', 'Name'])

# Group by Category
output = []
for category, group in df.groupby('Category'):
    output.append(f"### {category}")
    for _, row in group.iterrows():
        output.append(f"* [{row['Name']}]({row['Link']})")
    output.append("")  # Blank line for spacing

md_content = '\n'.join(output)

# Write to Markdown file in _config/
with open('_config/links.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

# Now update index.md between markers
start_marker = '<!-- LINKS-INSERT-START -->'
end_marker = '<!-- LINKS-INSERT-END -->'

with open('index.md', 'r', encoding='utf-8') as f:
    index_content = f.read()

pattern = re.compile(
    rf"({start_marker}\n)(.*?)(\n{end_marker})",
    re.DOTALL
)

replacement = rf"\1{md_content}\3"
new_index_content, count = pattern.subn(replacement, index_content)

if count == 0:
    raise ValueError("Markers not found in index.md!")

with open('index.md', 'w', encoding='utf-8') as f:
    f.write(new_index_content)

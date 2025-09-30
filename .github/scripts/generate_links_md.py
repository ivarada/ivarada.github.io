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

# Now update index.md between markers (very robust)
start_marker = '<!-- LINKS-INSERT-START -->'
end_marker = '<!-- LINKS-INSERT-END -->'

with open('index.md', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Pattern matches anything between the markers, allowing for whitespace, blank lines, etc.
pattern = re.compile(
    rf"({re.escape(start_marker)}\s*\n?)(.*?)(\n?\s*{re.escape(end_marker)})",
    re.DOTALL
)

replacement = rf"\1{md_content}\3"
new_index_content, count = pattern.subn(replacement, index_content)

if count == 0:
    # If markers not found, optionally insert them at the top
    new_index_content = f"{start_marker}\n{md_content}\n{end_marker}\n{index_content}"
    print("Markers not found in index.md! Markers and links inserted at the top.")

with open('index.md', 'w', encoding='utf-8') as f:
    f.write(new_index_content)

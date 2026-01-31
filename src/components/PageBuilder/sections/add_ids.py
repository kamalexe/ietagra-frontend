
import os
import re

directory = "/home/kamal/Projects/MERN/Major Project/ietagra-frontend/src/components/PageBuilder/sections"

for filename in os.listdir(directory):
    if filename.startswith("Design") and filename.endswith(".js"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r") as f:
            content = f.read()
        
        # 1. Add 'id' to props
        # Matches: const DesignOne = ({ 
        new_content = re.sub(r'(const Design\w+ = \(\{)', r'\1 id,', content)
        
        # 2. Add id={id} to root elements in return statements
        # Matches: return ( <div or return ( <section, allow whitespace
        # We capture the tag name to reuse it
        # We verify it doesn't already have id=
        
        def add_id(match):
            prefix = match.group(1) # "return (" 
            whitespace = match.group(2) # newline and spaces
            tag = match.group(3) # "div" or "section"
            rest = match.group(4) # existing attrs
            
            if 'id=' in rest:
                return match.group(0) # Already has ID
            
            return f'{prefix}{whitespace}<{tag} id={{id}} {rest}'

        # Regex explanation:
        # return\s*\(\s* -> Matches return ( with optional spaces
        # <(div|section|header|main) -> Matches start of tag
        # ([^>]+) -> Matches attributes
        
        # This regex is a bit simplistic, it relies on the formatting "return (\n <tag"
        # Let's try to match specifically the tag opening after a return
        
        new_content = re.sub(r'(return\s*\(\s*)(<[a-zA-Z0-9]+)(\s)', r'\1\2 id={id}\3', new_content)
        
        # Also handle cases where there is no parentheses? unlikely in this codebase but good to check.
        # Most components here use return ( ... )
        
        if content != new_content:
            print(f"Updating {filename}")
            with open(filepath, "w") as f:
                f.write(new_content)
        else:
            print(f"No changes for {filename}")

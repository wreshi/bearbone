#!/bin/bash

# Dependencies: ripgrep, fzf, bat (for previews)
# Usage: ./remove-unused.sh [directory]

# Set target directory or default to current directory
dir="${1:-.}"

# Function to check for dependencies
check_dependencies() {
    for cmd in rg fzf bat; do
        if ! command -v "$cmd" &> /dev/null; then
            echo "Error: $cmd not found. Please install it and try again."
            exit 1
        fi
    done
}

# Function to find unused imports
find_unused() {
    # Find all JS/TS/JSX/TSX files with import statements
    rg --no-ignore --type js --type ts --type jsx --type tsx -l "\bimport\b" "$dir" | while read -r file; do
        # Extract imports from each file
        imports=$(rg -Po 'import\s+(\*\s+as\s+\w+|{[^}]+}|\w+)(?=\s+from)' "$file" | \
                  sed -E 's/import\s*\* as ([^ ]+).*/\1/; s/import\s*\{([^}]*)\}.*/\1/; s/,/\n/g' | \
                  sed 's/^\s*//;s/\s*$//')

        # Check if each import is unused
        echo "$imports" | while read -r imp; do
            [[ -z "$imp" ]] && continue # Skip empty lines

            # Search for import usage in the file
            if ! rg -q "\b${imp}\b" "$file" --ignore-file "$file"; then
                echo "$file:$imp"
            fi
        done
    done
}

# Function to delete unused imports interactively
delete_unused() {
    find_unused | fzf -m --delimiter : \
        --preview 'bat --style=numbers --color=always {1} --highlight-line {2}' \
        --preview-window '50%,+3/3,~3' \
        --bind "enter:execute(
            sed -i.bak '/import.*\\b{2}\\b/d' {1} && echo '{2} removed from {1}'
        )"
}

# Main function
main() {
    check_dependencies
    echo "Scanning for unused imports in: $dir"
    delete_unused
}

main

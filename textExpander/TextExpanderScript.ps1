
# Hashtable of shortcuts and their expansions
$expansions = @{
    ":eml" = "example@email.com"
    ":addr" = "1234 Main St, Anytown, USA"
}

# Function to expand text
function Expand-Text {
    param (
        [string]$InputText
    )
    foreach ($shortcut in $expansions.Keys) {
        $InputText = $InputText.Replace($shortcut, $expansions[$shortcut])
    }
    return $InputText
}

# Main script loop
while ($true) {
    $userInput = Read-Host "Enter text (type 'exit' to quit)"
    if ($userInput -eq 'exit') {
        break
    }
    $expandedText = Expand-Text -InputText $userInput
    Write-Host "Expanded text: $expandedText"
}

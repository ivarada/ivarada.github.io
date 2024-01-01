from pynput import keyboard
import pyperclip
import time

# Dictionary of shortcuts and their expansions
expansions = {
    ":eml": "example@email.com",
    ":addr": "1234 Main St, Anytown, USA"
}

# Function to replace the shortcut with the expanded text
def replace_text(shortcut):
    pyperclip.copy(expansions[shortcut])
    with keyboard.Controller() as controller:
        for _ in range(len(shortcut)):
            controller.press(keyboard.Key.backspace)
            controller.release(keyboard.Key.backspace)
        time.sleep(0.05)  # Short delay to ensure clipboard content is updated
        controller.press(keyboard.Key.ctrl)
        controller.press('v')
        controller.release('v')
        controller.release(keyboard.Key.ctrl)

# Callback for each keypress
def on_press(key):
    try:
        if key.char in expansions:  # Check if the key is a shortcut
            replace_text(key.char)
    except AttributeError:
        pass

# Start listening for keypresses
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()

#pip install pynput pyperclip
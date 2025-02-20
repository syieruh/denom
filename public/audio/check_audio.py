import os
from pathlib import Path

def check_audio_files():
    # Get the audio directory path
    audio_dir = Path('D:/newDown2/New folder (3)/public/audio')
    
    # Valid audio extensions
    valid_extensions = ['.mp3', '.wav', '.m4a', '.ogg']
    
    # Get all files in the directory
    files = list(audio_dir.glob('*'))
    
    print(f"Found {len(files)} files in the audio directory")
    print("-" * 50)
    
    for file in files:
        if file.is_file():
            extension = file.suffix.lower()
            file_size = os.path.getsize(file)
            
            print(f"\nFile: {file.name}")
            print(f"Size: {file_size / 1024 / 1024:.2f} MB")
            
            if extension in valid_extensions and file_size > 0:
                print(f"✅ Valid audio file ({extension})")
            else:
                print(f"❌ Not a valid audio file or empty file")
                if extension not in valid_extensions:
                    print(f"   Invalid extension: {extension}")
                if file_size == 0:
                    print("   File is empty")

    print("\nDone checking files!")

if __name__ == "__main__":
    check_audio_files()
#!/usr/bin/env python3
"""
Test Code Generator for CodeBuddy App
Generates code images with intentional bugs for testing the OCR -> AI explanation flow.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_code_image(code, filename, width=600, height=400):
    """Create an image from code text"""
    # Create a blank white image
    img = Image.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Try to use a monospace font, fall back to default if not available
    try:
        font = ImageFont.truetype("consola.ttf", 16)  # Windows Consolas
    except:
        try:
            font = ImageFont.truetype("DejaVuSansMono.ttf", 16)  # Linux
        except:
            font = ImageFont.load_default()
    
    # Draw the code on the image
    draw.text((20, 20), code, fill=(0, 0, 0), font=font)
    
    # Save the image
    img.save(filename)
    print(f"Created {filename}")

# Test cases with intentional bugs
test_codes = [
    {
        "name": "python_syntax_error",
        "code": """def greet(name)
    print("Hello, " + name)

greet("Alice")""",
        "description": "Missing colon after function definition"
    },
    
    {
        "name": "javascript_missing_brace",
        "code": """function calculateSum(a, b) 
    return a + b;
}

console.log(calculateSum(5, 3));""",
        "description": "Missing opening brace"
    },
    
    {
        "name": "python_indentation_error",
        "code": """def fibonacci(n):
if n <= 1:
return n
else:
return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))""",
        "description": "Incorrect indentation"
    },
    
    {
        "name": "java_semicolon_missing",
        "code": """public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World")
    }
}""",
        "description": "Missing semicolon"
    },
    
    {
        "name": "python_variable_typo",
        "code": """def calculate_area(radius):
    pi = 3.14159
    area = pi * raduis ** 2
    return area

print(calculate_area(5))""",
        "description": "Variable name typo (raduis instead of radius)"
    }
]

def main():
    # Create assets directory if it doesn't exist
    assets_dir = "assets"
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
    
    print("Generating test code images for CodeBuddy app...")
    
    for test_case in test_codes:
        filename = os.path.join(assets_dir, f"{test_case['name']}.png")
        create_code_image(test_case['code'], filename)
        print(f"  - {test_case['description']}")
    
    print(f"\nGenerated {len(test_codes)} test images in the {assets_dir} directory.")
    print("You can now use these images to test the CodeBuddy app's OCR and AI explanation features.")

if __name__ == "__main__":
    main()
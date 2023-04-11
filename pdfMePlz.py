import os
import pdfkit

# Path to the directory containing the JS files
input_dir = './'

# Path to the directory where the PDFs will be saved
output_dir = './Output'

# List of directories to ignore
ignore_dirs = ['node_modules', 'dist', '.parcel-cache']

# Loop through all subdirectories and files in the input directory
for root, dirs, files in os.walk(input_dir):
    # Remove ignored directories from the list of subdirectories
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    
    for filename in files:
        # Check if the file is a JS file
        if filename.endswith('.js'):
            # Construct the input and output paths
            input_path = os.path.join(root, filename)
            output_path = os.path.join(output_dir, os.path.relpath(input_path, input_dir).replace('.js', '.pdf'))
            
            # Create the output directory structure if it doesn't exist
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Use pdfkit to convert the JS file to a PDF
            pdfkit.from_file(input_path, output_path, configuration=pdfkit.configuration(wkhtmltopdf=r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'))
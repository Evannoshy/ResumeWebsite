import extract_msg
import os
import hashlib
from pathlib import Path


def is_pdf(file_data) -> bool:
    if not isinstance(file_data, (bytes, bytearray)):
        return False
    return file_data.startswith(b"%PDF")



def safe_filename(filename: str, content: bytes) -> str:
    name, ext = os.path.splitext(filename)
    digest = hashlib.md5(content).hexdigest()[:8]
    return f"{name}_{digest}{ext}"


def extract_pdfs_from_msg(msg_path: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    msg = extract_msg.Message(msg_path)

    for attachment in msg.attachments:
        filename = attachment.longFilename or attachment.shortFilename
        if not filename:
            continue

        data = attachment.data
        if data is None:
            continue

        if is_pdf(data):
            filename = filename if filename.lower().endswith(".pdf") else filename + ".pdf"
            filename = safe_filename(filename, data)

            output_path = os.path.join(output_dir, filename)
            with open(output_path, "wb") as f:
                f.write(data)

            print(f"[✔] Extracted: {filename}")

    msg.close()

def extract_pdfs_from_folder(msg_folder: str, output_dir: str):
    print("Scanning folder:", msg_folder)

    for file in os.listdir(msg_folder):
        print("Found file:", file)

        if file.lower().endswith(".msg"):
            msg_path = os.path.join(msg_folder, file)
            extract_pdfs_from_msg(msg_path, output_dir)


extract_pdfs_from_folder(
    msg_folder="input",
    output_dir="output"
)

import os
import time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from supabase import create_client

load_dotenv(".env.local")

# Initialise clients
client = genai.Client(api_key=os.environ["GOOGLE_AI_API_KEY"])
supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"]
)

CORPUS_DIR = Path("./tech notes")  # folder with your markdown files
CHUNK_SIZE  = 500              # words per chunk
OVERLAP     = 50               # word overlap between chunks

def chunk_text(text: str) -> list[str]:
    words  = text.split()
    chunks = []
    start  = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunks.append(" ".join(words[start:end]))
        start += CHUNK_SIZE - OVERLAP
    return chunks

def embed(text: str) -> list[float]:
    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=text,
        config={
            "task_type": "RETRIEVAL_DOCUMENT",
            "output_dimensionality": 768
        }
    )
    return result.embeddings[0].values

def ingest():
    md_files = list(CORPUS_DIR.glob("*.md"))
    print(f"Found {len(md_files)} files in corpus/")

    for filepath in md_files:
        print(f"\nProcessing: {filepath.name}")
        text   = filepath.read_text(encoding="utf-8")
        chunks = chunk_text(text)
        print(f"  {len(chunks)} chunks")

        for i, chunk in enumerate(chunks):
            if not chunk.strip():
                continue

            embedding = embed(chunk)

            supabase.table("documents").insert({
                "filename":    filepath.name,
                "chunk_index": i,
                "content":     chunk,
                "embedding":   embedding
            }).execute()

            print(f"  Inserted chunk {i+1}/{len(chunks)}")
            time.sleep(0.1)  # avoid rate limit

    print("\nIngestion complete.")

if __name__ == "__main__":
    ingest()
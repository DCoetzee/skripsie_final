import os
import openai
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

# Load environment variables. Assumes the project contains .env file with API keys
load_dotenv()
openai.api_key = os.environ['OPENAI_API_KEY']


def load_embedding_function():
    # Implement the OpenAIEmbedding function.
    # (This can be replaced with another such as Ollama etc.)
    embeddings = OpenAIEmbeddings(model='text-embedding-3-large')

    return embeddings

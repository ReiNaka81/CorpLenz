import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

load_dotenv()

def load_documents() -> list[Document]:   
    folders = glob.glob("./data/*")

    documents = []
    for folder in folders:  
        doc_type = os.path.basename(folder)
        loader = DirectoryLoader(folder, glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})    # glob="**/*.md": folder 以下の全サブディレクトリから .md ファイルのみ対象
        folder_docs = loader.load()
        for doc in folder_docs: 
            doc.metadata["doc_type"] = doc_type
            documents.append(doc)

    print(f"{len(documents)}つのファイルを読み込みました。")
    return documents

def split_text(documents: list[Document]) -> list[Document]:   
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)

    print(f"{len(chunks)}つのチャンクに分割されました。")
    return chunks

if __name__ == "__main__":  
    documents = load_documents()
    results = split_text(documents)
    print(f"chuns[0]は{results[0]}です。")
import os.path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseDownload
from google_auth_oauthlib.flow import InstalledAppFlow

from flask_cors import CORS
from flask import Flask, jsonify, request
from langchain.schema.document import Document
from langchain_community.vectorstores import Chroma
from load_embedding_function import load_embedding_function
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFDirectoryLoader

# Declare global variable for Google Drive creds.
creds = None

# Declare Google Drive Scopes.
SCOPES = ["https://www.googleapis.com/auth/drive"]

# Create a Flask app.
app = Flask(__name__)

# Enable CORS for all routes.
CORS(app)

# Chroma database path.
CHROMA_PATH = "vector_db_openai"

# PDF data_landing_zone files path.
DATA_PATH = "data_landing_zone"


@app.route('/update_db', methods=['POST'])
def main():
    # Extract username needed to identify Drive Folder.
    data = request.get_json()
    foldername = data['foldername']

    # Get the newly added docs.
    get_new_docs(foldername)

    # Call the function to load the pdf files.
    documents = load_documents()

    # Call the function splitting the pdf files into chunks.
    chunks = split_documents(documents)

    # Call the function adding the chunks to the Chroma database.
    after_training = add_to_chroma(chunks)

    return jsonify({'results': after_training})


def setup_creds():
    # Declare global variable for the Google Drive credentials.
    global creds

    # Initialize creds to none.
    creds = None

    # Test to see if the token.json file is already present or not.
    if os.path.exists("googledrive_creds/token.json"):
        # Load the Google Drive credentials into the creds global variable.
        creds = Credentials.from_authorized_user_file("googledrive_creds/token.json", SCOPES)

    # Test to see if the loaded creds is valid or not.
    if not creds or not creds.valid:

        # Test to see if the creds have expired or not.
        if creds and creds.expired and creds.refresh_token:
            # If expired, refresh the creds.
            creds.refresh(Request())
        else:
            # Load creds using the credentials.json file.
            flow = InstalledAppFlow.from_client_secrets_file(
                "googledrive_creds/credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Create the token.json file to allow connection to Google Drive.
        with open("googledrive_creds/token.json", "w") as token:
            token.write(creds.to_json())

    return creds


def get_new_docs(foldername):
    """
    Check for new files added to Google Drive.

    This function queries the Google Drive API to retrieve a list of files
    that have been added or modified since the provided timestamp. It ensures
    that the data_prop folder is up-to-date with the newest pdfs.
    """
    # Declare global variable for Google Drive credentials.
    global creds

    # Load the current data_prop directory and extract the file names on which the database is currently created on.
    directory = 'data_landing_zone'
    current_files = os.listdir(directory)
    current_files.sort()
    print(current_files)

    try:
        # Build the Google Drive API service.
        service = build("drive", "v3", credentials=creds)

        # Declare the directory where the data_prop is located in Google Drive.
        folder_name = foldername + "_ProPal"

        # Query the location of the above declared folder.
        response = service.files().list(
            q=f"mimeType='application/vnd.google-apps.folder' and name contains '{folder_name}'",
            fields="files(id, name)",
            supportsAllDrives=True,
            includeItemsFromAllDrives=True,
            corpora="user"
        ).execute()

        # Test to determine if the above declared folder is found or not.
        folders = response.get("files", [])
        if not folders:
            print('Folder "External Data" not found')
        else:
            # Extract the folder id out of the results of the query.
            folder_id = folders[0]['id']

            # Query all the pdf files found in the folder.
            results = (
                service.files()
                .list(
                    q=f"mimeType='application/pdf' and '{folder_id}' in parents",
                    pageSize=1000,
                    fields="nextPageToken, files(id, name)",
                    supportsAllDrives=True,
                    includeItemsFromAllDrives=True,
                    corpora="user"
                )
                .execute()
            )

            files_drive = results.get("files", [])

            # Test if any files were found or not.
            if not files_drive:
                print('No PDF files found in the External Data folder')
            else:
                # Test to ensure the data_prop folder is present in backend directory.
                if not os.path.exists('data_landing_zone'):
                    os.makedirs('data_landing_zone')

                # Add all the pdf files found to a list.
                files_drive_list = []
                for file in files_drive:
                    file_name = file['name']
                    files_drive_list.append(file_name)

                files_drive_list.sort()
                print(files_drive_list)

                # Test to determine if a new files are present in the drive folder or not.
                if len(current_files) != len(files_drive_list):
                    # Calculate the number of newly added files in Google Drive.
                    num_new_files = len(files_drive_list) - len(current_files)
                    print("New files is added")
                    print(f"{num_new_files} file/files was/were added")

                    # Convert the lists containing the pdf file names into a set.
                    set_drive_files = set(files_drive_list)
                    set_current = set(current_files)

                    # Determine the files not present in both.
                    new_files_set = set_drive_files - set_current

                    # Convert the sets back into lists.
                    new_files_list = list(new_files_set)
                    print(new_files_list)

                    # Download and update the data_prop directory so that the vector store can be updated.
                    for file in files_drive:
                        # Extract the pdf file id and name.
                        file_id = file['id']
                        file_name = file['name']

                        # If it is a newly added pdf, download and update the data_prop folder.
                        if file_name in new_files_list:
                            request = service.files().get_media(fileId=file_id)
                            file_path = os.path.join('data_landing_zone', file_name)

                            with open(file_path, 'wb') as fh:
                                downloader = MediaIoBaseDownload(fh, request)
                                done = False

                                while done is False:
                                    status, done = downloader.next_chunk()
                                    print(f'Downloaded {file_name} to {file_path}')

                else:
                    print("No new files were added")

    except HttpError as error:
        # Implement error handling.
        print(f"An error occurred: {error}")


def load_documents():
    # Load the pdf files using the Directory Loader.
    document_loader = PyPDFDirectoryLoader(DATA_PATH)

    return document_loader.load()


def split_documents(documents: list[Document]):
    # Split the pdf text into chunks with chunk size 512 and an overlap of 150.
    # (These are hyperparameters and can be modified to improve performance)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=150,
        length_function=len,
        is_separator_regex=False,
    )

    return text_splitter.split_documents(documents)


def add_to_chroma(chunks: list[Document]):
    # Load the existing Chroma vector database.
    db = Chroma(
        persist_directory=CHROMA_PATH, embedding_function=load_embedding_function(), collection_metadata={"hnsw:space": "cosine"}
    )

    # Calculate the Page IDs.
    chunks_with_ids = calculate_chunk_ids(chunks)

    # Add or Update the documents.
    existing_items = db.get(include=[])
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    # Only add documents that don't exist in the DB.
    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)

    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        db.add_documents(new_chunks, ids=new_chunk_ids)
        db.persist()
        after_training_results = 'successful'
    else:
        print("✅ No new documents to add")
        after_training_results = 'unsuccessful'

    return after_training_results


def calculate_chunk_ids(chunks):
    # This will create IDs in the format:
    # Page Source : Page Number : Chunk Index
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"

        # If the page ID is the same as the last one, increment the index.
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        # Calculate the chunk ID.
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        # Add it to the page metadata.
        chunk.metadata["id"] = chunk_id

    return chunks


if __name__ == "__main__":
    # Setup and load Google Drive Creds.
    creds = setup_creds()

    # Run Flask app on port 5005 (this port can modified as needed).
    app.run(port=5005)

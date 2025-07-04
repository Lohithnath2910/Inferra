import requests
import time
import os

# Configuration
BASE_URL = "http://127.0.0.1:8000"
PDF_PATH = r"C:\Users\lohit\Desktop\Project\pdf-qa-backend\lohith.pdf"

def print_separator(title):
    print("\n" + "="*50)
    print(f" {title}")
    print("="*50)

def test_server_status():
    print_separator("SERVER STATUS CHECK")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Server Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running!")
        print("Please start the server with: uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Error checking server: {e}")
        return False

def test_upload_pdf():
    print_separator("PDF UPLOAD TEST")
    
    if not os.path.exists(PDF_PATH):
        print(f"❌ PDF file not found: {PDF_PATH}")
        return False
    
    print(f"📤 Uploading PDF: {PDF_PATH}")
    
    try:
        with open(PDF_PATH, "rb") as f:
            files = {"file": f}
            response = requests.post(f"{BASE_URL}/upload_pdf", files=files)
        
        print(f"Upload Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ PDF Upload Successful!")
            print(f"Filename: {result.get('filename')}")
            print(f"Chunks Created: {result.get('chunks_count')}")
            print(f"Text Preview: {result.get('text_preview', 'N/A')[:100]}...")
            return True
        else:
            print(f"❌ Upload Failed!")
            try:
                error_detail = response.json()
                print(f"Error: {error_detail}")
            except:
                print(f"Error Text: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Upload Error: {e}")
        return False

def test_ask_questions():
    print_separator("QUESTION ANSWERING TEST")
    print("Type your questions below. Type 'exit' to stop.")
    
    while True:
        question = input("\n📝 Enter your question: ").strip()
        
        if question.lower() in ["exit", "quit", "q"]:
            print("Exiting question loop.")
            break
        
        if not question:
            print("Please enter a non-empty question.")
            continue
        
        try:
            payload = {"question": question}
            response = requests.post(f"{BASE_URL}/ask", json=payload)
            
            print(f"Response Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Question Answered Successfully!")
                print(f"Answer:\n{result.get('answer', 'No answer provided')}")
            else:
                print(f"❌ Question Failed!")
                try:
                    error_detail = response.json()
                    print(f"Error: {error_detail}")
                except:
                    print(f"Error Text: {response.text}")
                    
        except Exception as e:
            print(f"❌ Question Error: {e}")
        
        time.sleep(1)

def run_test_suite():
    print("🧪 PDF Q&A Assistant - Test")
    print(f"Testing server at: {BASE_URL}")
    print(f"PDF file: {PDF_PATH}")
    
    if not test_server_status():
        return
    
    if not test_upload_pdf():
        print("\n❌ Upload failed, skipping question test")
        return

    test_ask_questions()

    print_separator("TEST COMPLETE")
    print("✅ All tests completed!")

if __name__ == "__main__":
    run_test_suite()

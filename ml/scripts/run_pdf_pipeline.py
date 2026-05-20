import os
import sys

# Append the project root to sys.path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.append(project_root)

from ml.src.rag_pipeline import prepare_document_for_rag, retrieve_context, answer_question

if __name__ == "__main__":
    print("="*60)
    print("STUDYMATE AI - PYTHON END-TO-END PDF RAG PIPELINE DEMO")
    print("="*60)
    
    # We will create a small mock PDF or use a temporary PDF file to test the pipeline.
    # To make this script run out of the box, if no path is given, we write a sample temporary PDF.
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else None
    
    if not pdf_path:
        pdf_path = os.path.join(project_root, "ml", "data", "sample_document.pdf")
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        # If no pdf file exists, create a simple text-based pdf simulator file
        # The pdf_extractor has a robust fallback to process this text file seamlessly!
        if not os.path.exists(pdf_path):
            with open(pdf_path, "w") as f:
                f.write("StudyMate AI Mock PDF Document. Introduction to Neural Networks.\n")
                f.write("A neural network is a network or circuit of biological neurons, or in a modern sense, an artificial neural network, composed of artificial neurons or nodes.\n")
                f.write("A model that achieves 99% training accuracy but falls to 60% on validation is demonstrating overfitting.\n")
            print(f"Created a sample document for testing: {pdf_path}")
            
    try:
        # Run document parsing, cleaning, chunking, and embedding
        chunks = prepare_document_for_rag(pdf_path)
        
        # Query
        question = "What is overfitting and how do we identify it?"
        
        # Retrieve context
        retrieved_chunks = retrieve_context(question, chunks, top_k=2)
        
        # Answer
        result = answer_question(question, retrieved_chunks)
        
        print("\n" + "="*50)
        print("QUESTION:")
        print(question)
        print("="*50)
        print("ANSWER:")
        print(result["answer"])
        print("="*50)
        print("RETRIEVED SOURCES:")
        for src in result["sources"]:
            print(f"- Page {src['page_number']} (Chunk Index {src['chunk_index']}, Cosine Similarity: {src['similarity']:.4f})")
        print(f"Confidence Score: {result['confidence']:.2f}")
        print("="*50)
        
    except Exception as e:
        print(f"Pipeline error: {e}", file=sys.stderr)
        sys.exit(1)

import fitz

def create_indo_pdf():
    doc = fitz.open()
    
    # Page 1: Pendahuluan
    page = doc.new_page(width=595, height=842) # A4 size
    # Header
    page.insert_text((50, 60), "StudyMate AI - Panduan Belajar Mandiri", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Materi Kecerdasan Buatan & Rekayasa Sistem", fontsize=20, color=(0.1, 0.1, 0.15))
    
    content = """
Bab 1: Pendahuluan Rekayasa Sistem Modern

Dalam pengembangan perangkat lunak modern, khususnya rekayasa sistem kecerdasan buatan, modularitas menjadi fondasi utama yang menentukan keandalan jangka panjang. Desain komponen modular bekerja dengan mengisolasi kompleksitas sistem ke dalam modul-modul independen yang memiliki tanggung jawab tunggal.

Tujuan utama dari pendekatan modular ini adalah:
1. Mencegah terjadinya regresi fungsional (functional regression) saat melakukan pembaruan kode.
2. Memudahkan proses pengujian unit secara terisolasi.
3. Mempercepat iterasi pengembangan komponen secara paralel.

Dengan mengisolasi parameter kompleks ke dalam bagian-bagian terkontrol, para insinyur dapat meminimalkan ketergantungan antar-modul dan menjaga kestabilan operasional sistem keseluruhan secara maksimal. Hal ini terbukti mampu menghemat waktu pengembangan serta memperkecil risiko kesalahan ketika sistem berkembang menjadi lebih kompleks.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Halaman 1", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 2: Database Vektor
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Panduan Belajar Mandiri", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Bab 2: Database Vektor & Ekstensi pgvector", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
Pencarian semantik berkinerja tinggi memerlukan infrastruktur penyimpanan khusus yang dioptimalkan untuk representasi vektor berdimensi tinggi. Database vektor hadir sebagai solusi untuk menyimpan, mengindeks, dan melakukan kueri cepat pada representasi matematis dari teks atau materi pembelajaran.

Di dalam ekosistem PostgreSQL, mengaktifkan ekstensi pgvector memungkinkan kita untuk menyimpan representasi embedding secara langsung dalam kolom database. pgvector mendukung pembuatan indeks menggunakan struktur khusus seperti IVFFlat (Inverted File with Flat Compression) atau HNSW (Hierarchical Navigable Small World).

Struktur indeks ini memungkinkan pencarian kemiripan vektor dilakukan dalam hitungan milidetik. Pencarian ini dihitung berdasarkan rumus matematis Jarak Cosine (Cosine Distance) untuk mengukur sudut perbedaan arah antara dua vektor dalam ruang berdimensi tinggi. Formula ini dinyatakan sebagai:
Cosine Similarity = (a . b) / (||a|| * ||b||)

Dengan menggunakan pgvector, kita dapat dengan mudah menemukan potongan paragraf yang paling relevan dari ribuan dokumen hanya dengan membandingkan nilai kemiripan vektornya.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Halaman 2", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 3: Overfitting
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Panduan Belajar Mandiri", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Bab 3: Menganalisis & Mengatasi Overfitting", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
Salah satu tantangan terbesar dalam melatih model machine learning adalah fenomena overfitting. Model yang mencapai akurasi pelatihan 99% tetapi turun menjadi 60% pada validasi menunjukkan fenomena overfitting. Ini adalah kondisi di mana model machine learning menghafal detail spesifik dan derau (noise) pada data pelatihan alih-alih mempelajari pola umum yang universal.

Ciri-ciri utama model yang mengalami overfitting meliputi:
1. Akurasi data pelatihan sangat tinggi (mendekati sempurna).
2. Akurasi data pengujian atau validasi sangat rendah dan tidak stabil.
3. Model memiliki varians yang sangat tinggi terhadap perubahan kecil pada input.

Untuk mengatasi overfitting, para praktisi machine learning disarankan menerapkan strategi berikut:
- Menerapkan regularisasi L1 (Lasso) atau L2 (Ridge) untuk memberikan penalti pada bobot yang terlalu besar.
- Menyederhanakan arsitektur jaringan saraf dengan mengurangi jumlah lapisan (layers) atau neuron.
- Memperluas serta menambah variasi dataset pelatihan melalui teknik augmentasi data atau pengumpulan sampel baru.
- Menggunakan teknik early stopping untuk menghentikan pelatihan sebelum model mulai menghafal noise.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Halaman 3", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 4: RAG
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Panduan Belajar Mandiri", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Bab 4: Arsitektur RAG & Efisiensi Token", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
Retrieval-Augmented Generation (RAG) is a highly efficient technique that combines search retrieval with generative LLMs. Retrieval-Augmented Generation (RAG) adalah metode efisien yang menggabungkan pencarian dokumen dengan LLM generatif. Mengirimkan keseluruhan isi file PDF ke model bahasa besar (LLM) seperti OpenAI adalah tindakan yang sangat tidak efisien karena menghabiskan batas token konteks yang besar dan memakan biaya operasional yang sangat mahal.

Arsitektur RAG memecahkan masalah ini melalui alur kerja terstruktur:
1. Dokumen PDF dipotong menjadi paragraf kecil menggunakan metode pemotongan kalimat (semantic chunking).
2. Setiap paragraf dikonversi menjadi representasi vektor embedding (misalnya 1536 dimensi).
3. Ketika pengguna mengajukan pertanyaan, sistem mencari 3 hingga 5 paragraf teratas yang paling mirip menggunakan pgvector.
4. Hanya potongan paragraf terpilih tersebut yang dikirimkan ke OpenAI sebagai konteks pendukung untuk dijawab.

Pendekatan selektif ini secara dramatis meminimalkan konsumsi token OpenAI, meningkatkan kecepatan kueri, dan menjamin jawaban yang berlandaskan sumber data asli tanpa adanya halusinasi informasi.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Halaman 4", fontsize=10, color=(0.5, 0.5, 0.5))

    doc.save("/Users/rizkyhamdana/.gemini/antigravity/scratch/studymate-ai/Materi_Kecerdasan_Buatan.pdf")
    doc.close()
    print("Materi_Kecerdasan_Buatan.pdf created successfully!")

def create_english_pdf():
    doc = fitz.open()
    
    # Page 1: Introduction
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Self-Paced Learning Guide", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Artificial Intelligence & Systems Engineering", fontsize=20, color=(0.1, 0.1, 0.15))
    
    content = """
Chapter 1: Introduction to Modern Systems Engineering

In modern software development, specifically in engineering artificial intelligence systems, modularity serves as the foundational cornerstone that dictates long-term reliability. Modular component design works by isolating system complexity into independent, single-responsibility modules.

The primary goals of this modular approach are:
1. Preventing functional regressions when performing codebase updates.
2. Facilitating isolated unit testing of individual services.
3. Accelerating parallel component iterations across development teams.

By isolating complex parameters into controlled boundaries, engineers can minimize cross-module dependencies and maximize the operational stability of the overall system. This approach is proven to reduce development time and mitigate risks of systematic errors as applications scale.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Page 1", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 2: Vector Databases
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Self-Paced Learning Guide", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Chapter 2: Vector Databases & pgvector Indexing", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
High-performance semantic retrieval requires dedicated storage infrastructures optimized for high-dimensional vector representations. Vector databases emerge as the optimal solution to store, index, and rapidly query mathematical representations of text or study materials.

Within the PostgreSQL ecosystem, enabling the pgvector extension allows storing vector embeddings directly in database tables. pgvector supports index generation using specialized structures such as IVFFlat (Inverted File with Flat Compression) or HNSW (Hierarchical Navigable Small World).

These indexing structures enable similarity searches to execute within milliseconds. The similarity is calculated using the Cosine Distance mathematical formula, which measures the angular difference between two high-dimensional vectors:
Cosine Similarity = (a . b) / (||a|| * ||b||)

By leveraging pgvector, we can easily locate the most relevant paragraphs from thousands of documents simply by comparing their vector similarities.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Page 2", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 3: Overfitting
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Self-Paced Learning Guide", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Chapter 3: Analyzing & Solving Overfitting", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
One of the greatest challenges in training machine learning models is the phenomenon of overfitting. A model that achieves 99% training accuracy but falls to 60% on validation is demonstrating overfitting. This is a state where a machine learning model memorizes specific details and noise in the training dataset rather than learning generalizable, universal patterns.

Core characteristics of an overfitted model include:
1. High training accuracy (near-perfect performance).
2. Poor and highly unstable test or validation accuracy.
3. High variance in response to small perturbations in input features.

To mitigate overfitting, machine learning practitioners are recommended to:
- Apply L1 (Lasso) or L2 (Ridge) regularization to penalize excessively large weights.
- Simplify the neural network architecture by reducing layers or node density.
- Expand and diversify the training dataset through data augmentation or collecting new samples.
- Employ early stopping techniques to halt training before the model starts memorizing noise.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Page 3", fontsize=10, color=(0.5, 0.5, 0.5))

    # Page 4: RAG
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 60), "StudyMate AI - Self-Paced Learning Guide", fontsize=10, color=(0.5, 0.5, 0.5))
    page.draw_line((50, 70), (545, 70), color=(0.8, 0.8, 0.8), width=1)
    
    page.insert_text((50, 120), "Chapter 4: RAG Architectures & Token Efficiency", fontsize=18, color=(0.1, 0.1, 0.15))
    
    content = """
Retrieval-Augmented Generation (RAG) is a highly efficient technique that combines search retrieval with generative LLMs. Sending the entire content of a PDF file to a large language model (LLM) like OpenAI is highly inefficient, quickly consuming context token limits and incurring expensive operational costs.

The RAG architecture solves this through a structured workflow:
1. The PDF document is split into smaller segments using a sentence-boundary parser (semantic chunking).
2. Each segment is converted to a vector embedding (e.g., 1536 dimensions).
3. When the user asks a question, the system queries pgvector for the top 3 to 5 most similar segments.
4. Only those retrieved context segments are sent to OpenAI as context to generate an answer.

This selective approach dramatically minimizes OpenAI token consumption, speeds up system query response times, and guarantees highly accurate answers grounded in original source material without information hallucination.
"""
    page.insert_textbox(fitz.Rect(50, 150, 545, 750), content.strip(), fontsize=11, lineheight=1.5)
    page.insert_text((270, 800), "Page 4", fontsize=10, color=(0.5, 0.5, 0.5))

    doc.save("/Users/rizkyhamdana/.gemini/antigravity/scratch/studymate-ai/Machine_Learning_Fundamentals.pdf")
    doc.close()
    print("Machine_Learning_Fundamentals.pdf created successfully!")

if __name__ == "__main__":
    create_indo_pdf()
    create_english_pdf()

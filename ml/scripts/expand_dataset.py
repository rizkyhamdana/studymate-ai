import os
import pandas as pd

def expand_dataset():
    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "sample_quiz_difficulty_dataset.csv")
    
    if not os.path.exists(csv_path):
        print(f"Error: Base CSV file not found at {csv_path}")
        return

    # Load current dataset
    df_current = pd.read_csv(csv_path)
    print(f"Current dataset contains {len(df_current)} rows.")

    # New 120 questions (60 English, 60 Indonesian)
    new_questions = [
        # English Easy (20 rows)
        {"question": "Who is known as the father of modern physics?", "answer": "Albert Einstein or Galileo Galilei depending on the context, but Isaac Newton and Galileo are primary pioneers.", "topic": "Physics", "difficulty": "easy"},
        {"question": "What is the boiling point of pure water in Celsius?", "answer": "100 degrees Celsius.", "topic": "Physics", "difficulty": "easy"},
        {"question": "What is the speed of light in a vacuum?", "answer": "Approximately 299,792 kilometers per second.", "topic": "Physics", "difficulty": "easy"},
        {"question": "Name the three subatomic particles in an atom.", "answer": "Protons, neutrons, and electrons.", "topic": "Physics", "difficulty": "easy"},
        {"question": "What is an element in chemistry?", "answer": "A pure substance consisting of only one type of atom.", "topic": "Chemistry", "difficulty": "easy"},
        {"question": "Define the concept of pH in chemistry.", "answer": "A measure of how acidic or basic a water-based solution is.", "topic": "Chemistry", "difficulty": "easy"},
        {"question": "What is the symbol for gold in the periodic table?", "answer": "Au.", "topic": "Chemistry", "difficulty": "easy"},
        {"question": "What is a chemical reaction?", "answer": "A process that leads to the chemical transformation of one set of chemical substances to another.", "topic": "Chemistry", "difficulty": "easy"},
        {"question": "Name the capital city of Australia.", "answer": "Canberra.", "topic": "Geography", "difficulty": "easy"},
        {"question": "What is the largest ocean on Earth?", "answer": "The Pacific Ocean.", "topic": "Geography", "difficulty": "easy"},
        {"question": "Which planet is closest to the Sun?", "answer": "Mercury.", "topic": "Geography", "difficulty": "easy"},
        {"question": "What is the currency used in Japan?", "answer": "Japanese Yen.", "topic": "Geography", "difficulty": "easy"},
        {"question": "What is the Turing test in computer science?", "answer": "A test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.", "topic": "Artificial Intelligence", "difficulty": "easy"},
        {"question": "What is natural language processing?", "answer": "A subfield of AI that helps computers understand, interpret and manipulate human language.", "topic": "Artificial Intelligence", "difficulty": "easy"},
        {"question": "Define deep learning.", "answer": "A subset of machine learning based on artificial neural networks with multiple layers.", "topic": "Artificial Intelligence", "difficulty": "easy"},
        {"question": "What is a chatbot?", "answer": "A software application used to conduct an on-line chat conversation via text or text-to-speech.", "topic": "Artificial Intelligence", "difficulty": "easy"},
        {"question": "What is the role of a web browser?", "answer": "To retrieve, present, and traverse information resources on the World Wide Web.", "topic": "Web Development", "difficulty": "easy"},
        {"question": "What is CSS used for?", "answer": "To style and lay out web pages.", "topic": "Web Development", "difficulty": "easy"},
        {"question": "Name the three pillars of web design.", "answer": "Usability, aesthetics, and technology.", "topic": "Web Development", "difficulty": "easy"},
        {"question": "What does HTTP stand for?", "answer": "Hypertext Transfer Protocol.", "topic": "Web Development", "difficulty": "easy"},

        # English Medium (20 rows)
        {"question": "Explain the differences between ionic and covalent chemical bonds.", "answer": "Ionic bonds transfer electrons between atoms, while covalent bonds involve the sharing of electrons.", "topic": "Chemistry", "difficulty": "medium"},
        {"question": "Describe the process of acid-base neutralization.", "answer": "An acid and a base react to form water and a salt, neutralizing the relative pH.", "topic": "Chemistry", "difficulty": "medium"},
        {"question": "Explain how catalysts speed up chemical reactions.", "answer": "By lowering the activation energy required for the reaction to occur without being consumed.", "topic": "Chemistry", "difficulty": "medium"},
        {"question": "How does temperature affect the solubility of a solid in water?", "answer": "Generally, increasing the temperature increases the solubility of a solid solute in water.", "topic": "Chemistry", "difficulty": "medium"},
        {"question": "Explain how tectonic plates move and cause earthquakes.", "answer": "Convection currents in the mantle slide plates past each other; friction causes stress buildup which releases as seismic waves.", "topic": "Geography", "difficulty": "medium"},
        {"question": "Describe the difference between weather and climate.", "answer": "Weather is short-term atmospheric conditions; climate is the average of weather conditions over a long period.", "topic": "Geography", "difficulty": "medium"},
        {"question": "Explain the green house effect and its impact on Earth.", "answer": "Gases trap infrared heat in the atmosphere, keeping Earth warm enough for life but causing warming when excessive.", "topic": "Geography", "difficulty": "medium"},
        {"question": "How does ocean current circulation distribute heat globally?", "answer": "Warm water travels from the equator to the poles, and cold water returns, regulating global climate.", "topic": "Geography", "difficulty": "medium"},
        {"question": "Explain how an artificial neural network processes input data.", "answer": "By multiplying input vectors by weights, adding biases, passing through activation functions, and propagating values.", "topic": "Artificial Intelligence", "difficulty": "medium"},
        {"question": "Describe the difference between regression and classification tasks.", "answer": "Regression predicts continuous numerical values, whereas classification predicts discrete class labels.", "topic": "Artificial Intelligence", "difficulty": "medium"},
        {"question": "How does a decision tree algorithm split nodes during training?", "answer": "By selecting features that maximize information gain or minimize Gini impurity at each step.", "topic": "Artificial Intelligence", "difficulty": "medium"},
        {"question": "Explain the concept of reinforcement learning using an agent.", "answer": "An agent learns to make decisions in an environment by performing actions and receiving rewards or penalties.", "topic": "Artificial Intelligence", "difficulty": "medium"},
        {"question": "Explain the difference between absolute and relative positioning in CSS.", "answer": "Relative positioning is relative to its normal position; absolute is relative to the nearest positioned ancestor.", "topic": "Web Development", "difficulty": "medium"},
        {"question": "How does a standard REST API communicate with client applications?", "answer": "Using HTTP request methods (GET, POST, PUT, DELETE) and exchanging JSON or XML data representations.", "topic": "Web Development", "difficulty": "medium"},
        {"question": "Describe the purpose of using cookies and local storage.", "answer": "Cookies store small session identifier data sent with HTTP requests, while local storage stores larger client-only data.", "topic": "Web Development", "difficulty": "medium"},
        {"question": "Explain how CSS flexbox simplifies responsive layout alignment.", "answer": "It provides a one-dimensional layout model that automatically distributes space and aligns items along a main axis.", "topic": "Web Development", "difficulty": "medium"},
        {"question": "Explain the difference between mass and weight of an object.", "answer": "Mass is the amount of matter in an object; weight is the force exerted on that mass by gravity.", "topic": "Physics", "difficulty": "medium"},
        {"question": "Describe how electromagnetic waves propagate through space.", "answer": "Through self-propagating oscillating electric and magnetic fields traveling perpendicular to each other at the speed of light.", "topic": "Physics", "difficulty": "medium"},
        {"question": "How does optical refraction change light direction when passing media?", "answer": "By altering the speed of light waves when entering a medium of a different optical refractive index.", "topic": "Physics", "difficulty": "medium"},
        {"question": "Explain the concept of half-life in radioactive decay.", "answer": "The time required for half of the radioactive nuclei in a sample to undergo decay.", "topic": "Physics", "difficulty": "medium"},

        # English Hard (20 rows)
        {"question": "Derive the Schrödinger equation for a particle in a one-dimensional box.", "answer": "Set boundary conditions to zero at 0 and L, solve the time-independent wave equation using sin/cos functions, and normalize.", "topic": "Physics", "difficulty": "hard"},
        {"question": "Critically assess how Einstein's theory of general relativity explains gravitational lensing.", "answer": "Mass curves space-time, which bends the geodesic path of passing photons, magnifying and distorting background star light.", "topic": "Physics", "difficulty": "hard"},
        {"question": "Optimize a thermodynamic cycle for maximum efficiency under extreme high temperature limits.", "answer": "Maximize hot reservoir heat input, minimize exhaust cooling, and utilize materials that resist structural failures.", "topic": "Physics", "difficulty": "hard"},
        {"question": "Analyze the quantum mechanical tunneling effect through a potential barrier.", "answer": "Solve wave equations inside and outside the barrier, proving non-zero transmission probability despite E < V.", "topic": "Physics", "difficulty": "hard"},
        {"question": "Derive the rate law for a second-order reaction with two different reactants.", "answer": "Integrate 1/([A]-[B]) * ln([B][A_0]/[A][B_0]) = kt based on stoichiometric consumption differentials.", "topic": "Chemistry", "difficulty": "hard"},
        {"question": "Analyze the molecular geometry of coordinate covalent complexes using ligand field theory.", "answer": "Map d-orbital splitting patterns (t2g and eg) in octahedral fields to estimate strong or weak spin configurations.", "topic": "Chemistry", "difficulty": "hard"},
        {"question": "Optimize a chemical synthesis process for yield and energy efficiency in industry.", "answer": "Implement heat integration exchangers, recycle unreacted reagents, and deploy high-selectivity zeolite catalysts.", "topic": "Chemistry", "difficulty": "hard"},
        {"question": "Prove the law of conservation of momentum using Newton's laws of motion.", "answer": "Deduce that since action equals reaction (F12 = -F21), the net impulse is zero, keeping the total derivative of momentum zero.", "topic": "Physics", "difficulty": "hard"},
        {"question": "Evaluate how global climate feedback loops accelerate polar ice cap melting rates.", "answer": "Ice loss decreases planetary albedo, leading to higher solar absorption, warmer oceans, and further accelerated ice collapse.", "topic": "Geography", "difficulty": "hard"},
        {"question": "Analyze the spatial distribution of economic trade networks under gravity models.", "answer": "Trade volume scales proportionally with GDP sizes of trading partners and inversely with geographic distance variables.", "topic": "Geography", "difficulty": "hard"},
        {"question": "Design a geographic information system database schema optimized for real-time spatial queries.", "answer": "Utilize R-tree coordinate index spatial bounds, partition tables by geography zones, and pre-compute spatial joins.", "topic": "Geography", "difficulty": "hard"},
        {"question": "Critically assess the geological factors contributing to massive volcanic caldera collapses.", "answer": "Rapid magma chamber evacuation, high-viscosity silicic compositions, and tectonic fractures causing structural failure.", "topic": "Geography", "difficulty": "hard"},
        {"question": "Optimize a deep convolutional neural network for real-time inference on mobile hardware.", "answer": "Apply structural channel pruning, integer quantization (INT8), and replace standard convolutions with depthwise separable filters.", "topic": "Artificial Intelligence", "difficulty": "hard"},
        {"question": "Design a multi-agent reinforcement learning system to manage autonomous traffic grids.", "answer": "Deploy localized actor-critic networks with sparse global communication protocols to resolve resource allocation bottlenecks.", "topic": "Artificial Intelligence", "difficulty": "hard"},
        {"question": "Analyze how attention mechanisms in transformers mitigate long-range sequence dependencies.", "answer": "By performing dot-product similarity between query and key vectors, allowing direct connection across all tokens.", "topic": "Artificial Intelligence", "difficulty": "hard"},
        {"question": "Critically assess the ethical implications and biases in generative AI models.", "answer": "Identify toxic representation in training corpuses, copyright infringement risks, and systemic reinforcement of stereotypes.", "topic": "Artificial Intelligence", "difficulty": "hard"},
        {"question": "Optimize a React application experiencing layout thrashing during heavy scrolling events.", "answer": "Implement virtualized list nodes, throttle scroll handlers, batch state commits, and offload calculations to requestAnimationFrame.", "topic": "Web Development", "difficulty": "hard"},
        {"question": "Design a micro-frontend architecture for a highly scalable enterprise dashboard application.", "answer": "Leverage Webpack Module Federation, establish decoupled build pipelines, and construct isolated custom event bus bridges.", "topic": "Web Development", "difficulty": "hard"},
        {"question": "Implement a custom virtual DOM diffing algorithm with linear time complexity.", "answer": "Deploy key-based element tracking, bypass deep subtree recursion for identical tag names, and utilize fiber reconcilers.", "topic": "Web Development", "difficulty": "hard"},
        {"question": "Critically evaluate the security vulnerabilities of JSON Web Token (JWT) storage.", "answer": "Compare local storage XSS theft risk against HTTPOnly Secure cookies CSRF exposure, recommending custom double-token mitigations.", "topic": "Web Development", "difficulty": "hard"},

        # Indonesian Easy (20 rows)
        {"question": "Siapakah penemu benua Asia yang tercatat dalam sejarah?", "answer": "Benua Asia tidak ditemukan oleh satu orang saja karena dihuni sejak pra-sejarah, namun pelancong seperti Marco Polo mencatatnya ke dunia luar.", "topic": "Sejarah", "difficulty": "easy"},
        {"question": "Apa nama ibukota negara Jepang?", "answer": "Tokyo.", "topic": "Geografi", "difficulty": "easy"},
        {"question": "Berapakah jumlah provinsi di pulau Jawa sekarang?", "answer": "Ada 6 provinsi: Banten, DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, dan Jawa Timur.", "topic": "Geografi", "difficulty": "easy"},
        {"question": "Apa fungsi utama dari paru-paru manusia?", "answer": "Untuk pertukaran gas oksigen dari udara bebas dengan karbon dioksida dari darah.", "topic": "Biologi", "difficulty": "easy"},
        {"question": "Apakah lambang kimia untuk unsur air?", "answer": "H2O.", "topic": "Kimia", "difficulty": "easy"},
        {"question": "Apa yang dimaksud dengan atom?", "answer": "Unit terkecil dari suatu unsur kimia yang mempertahankan sifat kimia dari unsur tersebut.", "topic": "Kimia", "difficulty": "easy"},
        {"question": "Berapakah suhu titik didih air pada tekanan normal?", "answer": "100 derajat Celsius.", "topic": "Fisika", "difficulty": "easy"},
        {"question": "Apa yang dimaksud dengan gaya magnet?", "answer": "Gaya tarik atau gaya tolak yang dihasilkan oleh benda yang memiliki sifat magnet.", "topic": "Fisika", "difficulty": "easy"},
        {"question": "Apa nama galaksi tempat tata surya kita berada?", "answer": "Galaksi Bima Sakti (Milky Way).", "topic": "Fisika", "difficulty": "easy"},
        {"question": "Siapa penemu telepon pertama kali?", "answer": "Alexander Graham Bell.", "topic": "Sejarah", "difficulty": "easy"},
        {"question": "Apa kepanjangan dari CPU pada komputer?", "answer": "Central Processing Unit.", "topic": "Ilmu Komputer", "difficulty": "easy"},
        {"question": "Berapa hasil dari 8 dikali 7?", "answer": "Hasilnya adalah 56.", "topic": "Matematika", "difficulty": "easy"},
        {"question": "Apa fungsi utama dari website?", "answer": "Untuk menyajikan informasi dan layanan kepada pengguna melalui jaringan internet.", "topic": "Teknologi Informasi", "difficulty": "easy"},
        {"question": "Apa singkatan dari IP Address?", "answer": "Internet Protocol Address.", "topic": "Jaringan Komputer", "difficulty": "easy"},
        {"question": "Siapakah presiden kedua Republik Indonesia?", "answer": "Jenderal Besar TNI (Purn.) H. M. Soeharto.", "topic": "Sejarah", "difficulty": "easy"},
        {"question": "Apa fungsi utama dari akar pada tumbuhan?", "answer": "Menyerap air dan unsur hara dari dalam tanah serta menopang tegaknya tumbuhan.", "topic": "Biologi", "difficulty": "easy"},
        {"question": "Berapa jumlah hari dalam satu tahun kabisat?", "answer": "366 hari.", "topic": "Geografi", "difficulty": "easy"},
        {"question": "Apa nama mata uang negara Malaysia?", "answer": "Ringgit.", "topic": "Geografi", "difficulty": "easy"},
        {"question": "Siapakah pencipta lagu kebangsaan Indonesia Raya?", "answer": "Wage Rudolf Soepratman.", "topic": "Sejarah", "difficulty": "easy"},
        {"question": "Apa fungsi utama dari keyboard komputer?", "answer": "Alat input untuk mengetik huruf, angka, dan perintah ke dalam sistem komputer.", "topic": "Ilmu Komputer", "difficulty": "easy"},

        # Indonesian Medium (20 rows)
        {"question": "Jelaskan perbedaan antara ikatan ionik dan ikatan kovalen.", "answer": "Ikatan ionik terjadi karena serah terima elektron, sedangkan ikatan kovalen terjadi karena penggunaan bersama pasangan elektron.", "topic": "Kimia", "difficulty": "medium"},
        {"question": "Bagaimana proses fotosintesis menghasilkan oksigen pada tumbuhan?", "answer": "Melalui fotolisis air pada reaksi terang di mana energi cahaya memecah molekul air menjadi hidrogen dan oksigen bebas.", "topic": "Biologi", "difficulty": "medium"},
        {"question": "Jelaskan konsep dasar hukum kekekalan massa dalam kimia.", "answer": "Massa zat sebelum reaksi kimia selalu sama dengan massa zat sesudah reaksi kimia.", "topic": "Kimia", "difficulty": "medium"},
        {"question": "Bagaimana cara kerja termometer dalam mengukur suhu benda?", "answer": "Menggunakan prinsip pemuaian zat cair di dalam tabung kaca ketika menyerap panas dari benda yang diukur.", "topic": "Fisika", "difficulty": "medium"},
        {"question": "Jelaskan bagaimana lempeng tektonik bergerak dan menyebabkan gempa bumi.", "answer": "Arus konveksi magma menggerakkan lempeng; gesekan di perbatasan lempeng menumpuk energi yang tiba-tiba terlepas.", "topic": "Geografi", "difficulty": "medium"},
        {"question": "Bagaimana perbedaan antara cuaca dan iklim di bumi?", "answer": "Cuaca adalah kondisi atmosfer harian di wilayah sempit; iklim adalah rata-rata cuaca jangka panjang di wilayah luas.", "topic": "Geografi", "difficulty": "medium"},
        {"question": "Jelaskan dampak pemanasan global terhadap kenaikan permukaan air laut.", "answer": "Suhu hangat mencairkan gletser kutub dan memicu pemuaian termal air laut, menyebabkan kenaikan permukaan laut global.", "topic": "Geografi", "difficulty": "medium"},
        {"question": "Bagaimana cara kerja dinamo sepeda dalam menghasilkan listrik?", "answer": "Putaran roda memutar magnet di dekat kumparan kabel, memicu induksi elektromagnetik yang menghasilkan arus bolak-balik.", "topic": "Fisika", "difficulty": "medium"},
        {"question": "Jelaskan bagaimana algoritma pencarian linear bekerja pada array data.", "answer": "Memeriksa setiap elemen data satu per satu dari awal hingga akhir sampai elemen yang dicari ditemukan.", "topic": "Ilmu Komputer", "difficulty": "medium"},
        {"question": "Jelaskan konsep dasar pemrograman berorientasi objek tentang enkapsulasi.", "answer": "Membungkus data dan metode ke dalam satu unit (kelas) dan menyembunyikan detail akses variabel sensitif.", "topic": "Ilmu Komputer", "difficulty": "medium"},
        {"question": "Bagaimana cara kerja memori cache dalam mempercepat pemrosesan data?", "answer": "Menyimpan salinan instruksi yang sering diakses agar CPU tidak perlu mengambilnya dari RAM yang lebih lambat.", "topic": "Ilmu Komputer", "difficulty": "medium"},
        {"question": "Jelaskan perbedaan antara data primer dan data sekunder dalam penelitian.", "answer": "Data primer diperoleh langsung dari subjek pertama (wawancara, survei), sedangkan data sekunder diperoleh dari dokumen arsip.", "topic": "Sejarah", "difficulty": "medium"},
        {"question": "Bagaimana pengaruh Revolusi Prancis terhadap sistem pemerintahan di Eropa?", "answer": "Meruntuhkan sistem monarki absolut dan menyebarkan ideologi demokrasi, nasionalisme, serta liberalisme secara masif.", "topic": "Sejarah", "difficulty": "medium"},
        {"question": "Jelaskan bagaimana gaya gesek dapat menghambat gerak suatu benda.", "answer": "Gaya gesek bekerja berlawanan arah dengan arah gerak benda akibat interaksi kasar antara kedua permukaan.", "topic": "Fisika", "difficulty": "medium"},
        {"question": "Bagaimana cara menghitung luas permukaan kubus jika diketahui rusuknya?", "answer": "Kalikan luas salah satu bidang sisi (s kuadrat) dengan jumlah total sisi kubus yaitu 6 (Luas = 6 * s^2).", "topic": "Matematika", "difficulty": "medium"},
        {"question": "Jelaskan perbedaan antara pembelahan mitosis dan pembelahan meiosis.", "answer": "Mitosis untuk pertumbuhan somatis (2n menghasilkan 2n), sedangkan meiosis untuk reproduksi gamet (2n menghasilkan n).", "topic": "Biologi", "difficulty": "medium"},
        {"question": "Bagaimana proses pembentukan batuan sedimen terjadi di alam?", "answer": "Melalui proses pelapukan batuan asal, transportasi oleh air/angin, pengendapan, dan litifikasi sedimentasi.", "topic": "Geografi", "difficulty": "medium"},
        {"question": "Jelaskan bagaimana sistem pernapasan manusia mengedarkan oksigen.", "answer": "Udara masuk ke alveolus, oksigen berdifusi ke pembuluh kapiler darah dan diikat oleh hemoglobin untuk disalurkan jantung.", "topic": "Biologi", "difficulty": "medium"},
        {"question": "Jelaskan perbedaan antara pasar tradisional dan pasar modern.", "answer": "Pasar tradisional menggunakan sistem tawar-menawar harga; pasar modern mencantumkan harga pas dengan kenyamanan terjamin.", "topic": "Geografi", "difficulty": "medium"},
        {"question": "Bagaimana pengaruh iklim tropis terhadap keanekaragaman hayati Indonesia?", "answer": "Curah hujan tinggi dan sinar matahari melimpah sepanjang tahun menciptakan ekosistem hutan hujan tropis yang kaya flora-fauna.", "topic": "Biologi", "difficulty": "medium"},

        # Indonesian Hard (20 rows)
        {"question": "Rancang arsitektur jaringan komputer yang aman untuk perusahaan dengan cabang terdistribusi.", "answer": "Bangun VPN IPSec site-to-site terlindung firewall next-gen, terapkan segmentasi VLAN, serta autentikasi multi-faktor.", "topic": "Jaringan Komputer", "difficulty": "hard"},
        {"question": "Analisis dampak kebijakan moneter bank sentral terhadap tingkat inflasi negara.", "answer": "Kenaikan suku bunga menekan peredaran uang, menurunkan tingkat konsumsi masyarakat, sehingga laju kenaikan harga terkendali.", "topic": "Geografi", "difficulty": "hard"},
        {"question": "Buktikan rumus luas segitiga menggunakan trigonometri secara analitis.", "answer": "Gunakan aturan tinggi h = b * sin(C) dalam persamaan Luas = 1/2 * alas * tinggi, sehingga diperoleh Luas = 1/2 * a * b * sin(C).", "topic": "Matematika", "difficulty": "hard"},
        {"question": "Selesaikan persamaan kuadrat menggunakan metode pembagian kuadrat sempurna secara matematis.", "answer": "Pindahkan konstanta c ke ruas kanan, bagi dengan koefisien a, tambahkan kuadrat setengah dari b/a ke kedua ruas, lalu akar kuadratkan.", "topic": "Matematika", "difficulty": "hard"},
        {"question": "Analisis mekanisme transpor aktif melalui pompa natrium-kalium pada sel eukariotik.", "answer": "Menggunakan energi hidrolisis ATP untuk memompa 3 ion Na+ keluar sel dan memasukkan 2 ion K+ masuk melawan gradien konsentrasi.", "topic": "Biologi", "difficulty": "hard"},
        {"question": "Buktikan hukum kekekalan momentum sudut menggunakan persamaan gerak rotasi.", "answer": "Buktikan bahwa jika torsi eksternal total yang bekerja pada sistem adalah nol, maka laju perubahan momentum sudut dL/dt = 0, sehingga L konstan.", "topic": "Fisika", "difficulty": "hard"},
        {"question": "Derifasikan rumus medan magnet di sekitar kawat lurus berarus menggunakan hukum Ampere.", "answer": "Integrasikan kuat medan magnet B mengelilingi lintasan melingkar tertutup r, lalu samakan dengan mu_0 dikali arus total (B * 2*pi*r = mu_0 * I).", "topic": "Fisika", "difficulty": "hard"},
        {"question": "Rancang sistem basis data terdistribusi yang mendukung replikasi multi-master secara real-time.", "answer": "Gunakan algoritma sinkronisasi konflik dua arah berbasis timestamp, terapkan quorum consensus, dan gunakan WAL log shipping.", "topic": "Basis Data", "difficulty": "hard"},
        {"question": "Analisis dampak runtuhnya imperium Romawi Barat terhadap kemunduran ekonomi Eropa.", "answer": "Mengakibatkan disintegrasi jalur perdagangan, hilangnya keamanan mata uang standar, dan memicu feodalisme agraria lokal.", "topic": "Sejarah", "difficulty": "hard"},
        {"question": "Buktikan bahwa jumlah sudut dalam segitiga bola selalu lebih besar dari 180 derajat.", "answer": "Gunakan teorema Gauss-Bonnet pada ruang dengan kelengkungan positif di mana jumlah sudut dikurangi pi sama dengan integral kelengkungan permukaan.", "topic": "Matematika", "difficulty": "hard"},
        {"question": "Rancang sistem kecerdasan buatan berbasis deep learning untuk mendeteksi penyakit tanaman padi.", "answer": "Gunakan arsitektur ResNet50 yang dilatih dengan citra penyakit daun padi, terapkan transfer learning, dan deploy API via FastAPI.", "topic": "Kecerdasan Buatan", "difficulty": "hard"},
        {"question": "Analisis bagaimana mekanisme pertahanan tubuh manusia melawan infeksi virus SARS-CoV-2.", "answer": "Sel APC mempresentasikan antigen ke T-helper, memicu diferensiasi sel B memproduksi antibodi penetralisir spike protein.", "topic": "Biologi", "difficulty": "hard"},
        {"question": "Evaluasi dampak sosial ekonomi dari pembangunan infrastruktur jalan tol lintas Jawa.", "answer": "Mempercepat waktu logistik antar kota besar namun mendegradasi perekonomian lokal UMKM di sepanjang jalur jalan arteri nontol.", "topic": "Geografi", "difficulty": "hard"},
        {"question": "Rancang algoritma enkripsi data yang aman terhadap serangan komputer kuantum.", "answer": "Gunakan skema kriptografi berbasis kisi (lattice-based cryptography) seperti kerangka kerja NTRU atau algoritma Learning With Errors.", "topic": "Ilmu Komputer", "difficulty": "hard"},
        {"question": "Selesaikan persamaan diferensial parsial untuk aliran panas satu dimensi secara analitis.", "answer": "Gunakan metode pemisahan variabel u(x,t) = X(x)T(t), selesaikan persamaan diferensial biasa masing-masing, dan terapkan deret Fourier.", "topic": "Matematika", "difficulty": "hard"},
        {"question": "Analisis peran mikroba tanah dalam siklus biogeokimia nitrogen secara molekuler.", "answer": "Bakteri Rhizobium mengekspresikan enzim nitrogenase untuk memecah gas N2 menjadi NH3 yang dapat diserap langsung oleh tumbuhan legum.", "topic": "Biologi", "difficulty": "hard"},
        {"question": "Derifasikan hukum ketiga Kepler tentang gerakan planet berdasarkan hukum gravitasi Newton.", "answer": "Samakan gaya gravitasi F = GMm/r^2 dengan gaya sentripetal F = m * omega^2 * r, substitusikan omega = 2*pi/T untuk membuktikan T^2 sebanding r^3.", "topic": "Fisika", "difficulty": "hard"},
        {"question": "Rancang mekanisme load balancing otomatis untuk microservices dengan lalu lintas tinggi.", "answer": "Deploy ingress controller berbasis Nginx/Envoy terintegrasi metrik Prometheus untuk meregulasi beban berdasarkan utilitas CPU kontainer.", "topic": "Ilmu Komputer", "difficulty": "hard"},
        {"question": "Analisis dampak Perang Dingin terhadap penyebaran ideologi politik di Asia Tenggara.", "answer": "Memicu pecahnya perang saudara proxy di Vietnam dan pembantaian simpatisan komunis di berbagai negara guna menahan teori domino.", "topic": "Sejarah", "difficulty": "hard"},
        {"question": "Buktikan rumus luas permukaan bola secara integral kalkulus.", "answer": "Integrasikan elemen cincin silindris rotasi 2 * pi * y * ds menggunakan koordinat polar dari 0 hingga pi, menghasilkan nilai 4 * pi * R^2.", "topic": "Matematika", "difficulty": "hard"}
    ]

    # Convert list to DataFrame
    df_new = pd.DataFrame(new_questions)

    # Check for duplicates (based on question)
    df_new = df_new[~df_new["question"].isin(df_current["question"])]
    print(f"Adding {len(df_new)} new unique questions to the dataset.")
    
    if len(df_new) > 0:
        df_combined = pd.concat([df_current, df_new], ignore_index=True)
        # Drop any fully blank rows if they exist
        df_combined = df_combined.dropna(subset=["question"])
        df_combined.to_csv(csv_path, index=False)
        print(f"Dataset successfully expanded! New total rows: {len(df_combined)}")
        print("Class distributions:")
        print(df_combined["difficulty"].value_counts())
    else:
        print("No new questions were added (all are duplicates).")

if __name__ == "__main__":
    expand_dataset()

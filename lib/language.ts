export function isIndonesian(text: string): boolean {
  const indonesianWords = [
    "dan", "yang", "dengan", "untuk", "pada", "adalah", "itu", "dalam", "bisa", "atau", "dari", "ini",
    "ke", "sebagai", "oleh", "ada", "saya", "kamu", "dia", "mereka", "kita", "kami",
    "kecerdasan", "buatan", "mesin", "pembelajaran", "materi", "tugas", "buku", "laporan",
    "indonesia", "panduan", "kuliah", "mahasiswa", "sekolah"
  ]
  const words = text.toLowerCase().split(/\s+/)
  const matchCount = words.filter(w => indonesianWords.includes(w)).length
  return matchCount >= 2 || text.toLowerCase().includes("indonesia")
}

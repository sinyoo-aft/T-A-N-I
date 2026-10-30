
// ==========================================================
// TANI SIAGA
// File JavaScript utama
// Mengatur seluruh fungsi interaktif website
// ==========================================================


// ==========================================================
// 1. PENGATURAN AWAL WEBSITE
// ==========================================================

// Menunggu seluruh struktur HTML selesai dibaca browser.
document.addEventListener("DOMContentLoaded", function () {

    // Menampilkan tahun secara otomatis di bagian footer.
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ======================================================
    // 2. MENGATUR TANGGAL BUKU HARIAN
    // ======================================================

    // Mengambil input tanggal dari formulir buku kebun.
    const diaryDateInput = document.getElementById("diaryDate");

    // Mendapatkan tanggal lokal perangkat pengguna.
    const today = new Date();

    // Menghindari perubahan tanggal akibat perbedaan zona waktu.
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    // Mengisi tanggal hari ini secara otomatis.
    if (diaryDateInput) {
        diaryDateInput.value = localDate;
    }


    // ======================================================
    // 3. FITUR PEMERIKSAAN KONDISI TANAMAN
    // ======================================================

    // Mengambil elemen formulir dan area hasil pemeriksaan.
    const diagnosisForm = document.getElementById("diagnosisForm");
    const diagnosisResult = document.getElementById("diagnosisResult");


    // Database petunjuk pemeriksaan berdasarkan gejala.
    // Data ini merupakan contoh edukasi, bukan hasil diagnosis
    // penyakit tanaman yang sudah divalidasi secara ilmiah.

    const symptomGuides = {

        kuning: {
            title: "Daun menguning",

            checks: [
                "Periksa apakah perubahan warna terjadi pada daun tua, daun muda, atau keduanya.",
                "Amati kondisi kelembapan tanah dan pola penyiraman.",
                "Periksa keberadaan hama dan perubahan lain pada daun."
            ]
        },

        bercak: {
            title: "Bercak pada daun",

            checks: [
                "Catat bentuk, warna, ukuran, dan lokasi bercak.",
                "Periksa apakah jumlah bercak bertambah.",
                "Bandingkan kondisi tanaman dengan tanaman di sekitarnya."
            ]
        },

        layu: {
            title: "Tanaman layu",

            checks: [
                "Periksa kelembapan tanah dan kondisi drainase.",
                "Amati pangkal batang dan kondisi akar jika memungkinkan.",
                "Catat apakah tanaman tetap layu setelah kondisi air diperiksa."
            ]
        },

        gulung: {
            title: "Daun menggulung",

            checks: [
                "Periksa bagian bawah daun untuk melihat keberadaan hama.",
                "Amati perubahan bentuk pucuk dan daun muda.",
                "Periksa apakah gejala terjadi pada satu atau banyak tanaman."
            ]
        },

        lubang: {
            title: "Daun berlubang",

            checks: [
                "Periksa daun untuk mencari keberadaan serangga atau tanda gigitan.",
                "Amati bentuk dan pola kerusakan daun.",
                "Catat bagian tanaman yang paling banyak terdampak."
            ]
        },

        busuk: {
            title: "Bagian tanaman membusuk",

            checks: [
                "Amati lokasi pembusukan, seperti akar, batang, atau buah.",
                "Periksa kondisi air dan drainase.",
                "Bersihkan peralatan sebelum digunakan pada tanaman lain."
            ]
        }

    };


    // Fungsi untuk membuat elemen HTML dengan aman.
    // textContent mencegah teks masukan dianggap sebagai kode HTML.

    function createTextElement(parent, tag, text, className = "") {

        const element = document.createElement(tag);

        element.textContent = text;

        if (className) {
            element.className = className;
        }

        parent.appendChild(element);

        return element;
    }


    // Memproses formulir pemeriksaan tanaman.
    if (diagnosisForm && diagnosisResult) {

        diagnosisForm.addEventListener("submit", function (event) {

            // Mencegah halaman dimuat ulang ketika formulir dikirim.
            event.preventDefault();


            // Mengambil data dari formulir.
            const crop = document.getElementById("crop").value;

            const plantPart = document.getElementById("plantPart").value;

            const spread = document.getElementById("spread").value;


            // Mengambil seluruh gejala yang dipilih pengguna.
            const selectedSymptoms = Array.from(
                diagnosisForm.querySelectorAll(
                    'input[name="symptom"]:checked'
                )
            ).map(function (checkbox) {
                return checkbox.value;
            });


            // Validasi: pengguna wajib memilih minimal satu gejala.
            if (selectedSymptoms.length === 0) {

                diagnosisResult.hidden = false;

                diagnosisResult.replaceChildren();

                createTextElement(
                    diagnosisResult,
                    "p",
                    "Silakan pilih setidaknya satu gejala tanaman terlebih dahulu."
                );

                return;
            }


            // Membersihkan hasil pemeriksaan sebelumnya.
            diagnosisResult.replaceChildren();

            // Menampilkan kotak hasil pemeriksaan.
            diagnosisResult.hidden = false;


            // Judul hasil.
            createTextElement(
                diagnosisResult,
                "h3",
                "Hasil Pemeriksaan Awal"
            );


            // Menampilkan informasi tanaman.
            createTextElement(
                diagnosisResult,
                "p",
                "Jenis tanaman: " + crop
            );

            createTextElement(
                diagnosisResult,
                "p",
                "Bagian tanaman: " + plantPart
            );


            // Memberikan keterangan berdasarkan luas penyebaran gejala.
            let spreadMessage = "";


            if (spread === "satu") {

                spreadMessage =
                    "Gejala terlihat pada satu tanaman. Tetap amati tanaman di sekitarnya.";

            } else if (spread === "beberapa") {

                spreadMessage =
                    "Beberapa tanaman terdampak. Periksa kemungkinan faktor penyebab yang sama.";

            } else if (spread === "banyak") {

                spreadMessage =
                    "Gejala sudah menyebar luas. Prioritaskan pemeriksaan lapangan dan konsultasikan kepada tenaga kompeten.";

            }


            createTextElement(
                diagnosisResult,
                "p",
                spreadMessage
            );


            // Menampilkan daftar gejala yang dipilih.
            createTextElement(
                diagnosisResult,
                "h4",
                "Gejala yang Ditemukan"
            );

            const symptomList = document.createElement("ul");


            selectedSymptoms.forEach(function (symptom) {

                const guide = symptomGuides[symptom];

                if (guide) {

                    createTextElement(
                        symptomList,
                        "li",
                        guide.title
                    );

                }

            });

            diagnosisResult.appendChild(symptomList);


            // Mengumpulkan petunjuk pemeriksaan selanjutnya.
            createTextElement(
                diagnosisResult,
                "h4",
                "Langkah Pemeriksaan Berikutnya"
            );

            const checkList = document.createElement("ul");

            // Set digunakan untuk menghindari petunjuk yang berulang.
            const allChecks = new Set();


            selectedSymptoms.forEach(function (symptom) {

                const guide = symptomGuides[symptom];

                if (guide) {

                    guide.checks.forEach(function (check) {

                        allChecks.add(check);

                    });

                }

            });


            // Menampilkan seluruh petunjuk pemeriksaan.
            allChecks.forEach(function (check) {

                createTextElement(
                    checkList,
                    "li",
                    check
                );

            });

            diagnosisResult.appendChild(checkList);


            // Peringatan agar hasil tidak dianggap sebagai
            // kepastian diagnosis penyakit tanaman.
            createTextElement(
                diagnosisResult,
                "p",
                "Pemeriksaan ini belum menentukan penyakit atau penyebab spesifik. Lakukan pemeriksaan lanjutan sebelum memilih tindakan pengendalian.",
                "notice"
            );

            // Mengarahkan layar ke bagian hasil.
            diagnosisResult.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });


        // Menghapus hasil pemeriksaan ketika pengguna
        // menekan tombol Atur Ulang.
        diagnosisForm.addEventListener("reset", function () {

            diagnosisResult.hidden = true;

            diagnosisResult.replaceChildren();

        });

    }


    // ======================================================
    // 4. FITUR PENCARIAN PUSTAKA TANAMAN
    // ======================================================

    const searchPlant = document.getElementById("searchPlant");

    const libraryCards = document.querySelectorAll(".library-card");

    const searchEmpty = document.getElementById("searchEmpty");


    // Menjalankan pencarian ketika pengguna mengetik.
    if (searchPlant) {

        searchPlant.addEventListener("input", function () {

            // Mengubah kata kunci menjadi huruf kecil.
            const keyword = searchPlant.value
                .trim()
                .toLowerCase();

            let visibleCount = 0;


            // Memeriksa setiap kartu pustaka.
            libraryCards.forEach(function (card) {

                const searchableText =
                    (card.dataset.search || card.textContent)
                    .toLowerCase();

                // Memeriksa apakah kata kunci cocok.
                const matches =
                    searchableText.includes(keyword);

                // Menyembunyikan kartu yang tidak cocok.
                card.hidden = !matches;

                if (matches) {
                    visibleCount++;
                }

            });


            // Menampilkan pesan ketika tidak ada hasil.
            if (searchEmpty) {

                searchEmpty.hidden = visibleCount !== 0;

            }

        });

    }


    // ======================================================
    // 5. FITUR BUKU HARIAN KEBUN
    // ======================================================

    const diaryForm = document.getElementById("diaryForm");

    const diaryList = document.getElementById("diaryList");

    const exportDiaryButton =
        document.getElementById("exportDiary");


    // Nama penyimpanan lokal pada browser.
    const DIARY_STORAGE_KEY = "taniSiagaDiaryV1";


    // Membaca catatan yang sebelumnya tersimpan.
    function loadDiary() {

        try {

            const savedData = localStorage.getItem(
                DIARY_STORAGE_KEY
            );

            // Jika belum ada catatan, gunakan array kosong.
            if (!savedData) {
                return [];
            }

            const parsedData = JSON.parse(savedData);

            // Memastikan data berbentuk array.
            return Array.isArray(parsedData)
                ? parsedData
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca catatan kebun:",
                error
            );

            return [];

        }

    }


    // Menampung semua catatan kebun.
    let diaryEntries = loadDiary();


    // Menyimpan data terbaru ke localStorage.
    function saveDiary() {

        try {

            localStorage.setItem(
                DIARY_STORAGE_KEY,
                JSON.stringify(diaryEntries)
            );

            return true;

        } catch (error) {

            alert(
                "Catatan gagal disimpan. Periksa ruang penyimpanan browser."
            );

            console.error(
                "Gagal menyimpan catatan:",
                error
            );

            return false;

        }

    }


    // Membuat pesan ketika belum ada catatan.
    function addEmptyMessage() {

        const message = document.createElement("div");

        message.className = "empty-state";

        message.textContent =
            "Belum ada catatan kebun. Silakan tambahkan pengamatan pertama.";

        diaryList.appendChild(message);

    }


    // Menampilkan seluruh riwayat pengamatan.
    function renderDiary() {

        if (!diaryList) {
            return;
        }

        // Menghapus tampilan daftar sebelumnya.
        diaryList.replaceChildren();


        // Jika belum ada data, tampilkan pesan kosong.
        if (diaryEntries.length === 0) {

            addEmptyMessage();

            return;

        }


        // Salin array dan balik urutannya agar catatan terbaru
        // muncul di bagian paling atas.
        const newestFirst = [...diaryEntries].reverse();


        newestFirst.forEach(function (entry) {

            // Membuat kartu catatan.
            const article = document.createElement("article");

            article.className = "diary-entry";


            // Nama tanaman.
            createTextElement(
                article,
                "h4",
                entry.crop
            );


            // Tanggal pengamatan.
            createTextElement(
                article,
                "p",
                "Tanggal: " + entry.date,
                "diary-meta"
            );


            // Kondisi tanaman.
            createTextElement(
                article,
                "p",
                "Kondisi: " + entry.condition
            );


            // Tindakan perawatan.
            createTextElement(
                article,
                "p",
                "Tindakan: " + entry.action
            );


            // Membuat tombol hapus.
            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "btn btn-secondary btn-small";

            deleteButton.textContent = "Hapus Catatan";


            // Fungsi menghapus catatan tertentu.
            deleteButton.addEventListener("click", function () {

                const confirmed = confirm(
                    "Apakah kamu yakin ingin menghapus catatan ini?"
                );

                if (!confirmed) {
                    return;
                }


                // Mengambil catatan selain catatan yang dipilih.
                const previousEntries = diaryEntries;

                diaryEntries = diaryEntries.filter(function (item) {

                    return item.id !== entry.id;

                });


                // Simpan perubahan dan perbarui tampilan.
                if (saveDiary()) {

                    renderDiary();

                } else {

                    // Kembalikan data apabila penyimpanan gagal.
                    diaryEntries = previousEntries;

                }

            });


            article.appendChild(deleteButton);

            diaryList.appendChild(article);

        });

    }


    // Mengaktifkan formulir buku harian.
    if (diaryForm) {

        diaryForm.addEventListener("submit", function (event) {

            event.preventDefault();


            // Mengambil data dari input.
            const date = document.getElementById("diaryDate").value;

            const crop = document.getElementById("diaryCrop").value;

            const condition = document
                .getElementById("diaryCondition")
                .value
                .trim();

            const action = document
                .getElementById("diaryAction")
                .value
                .trim();


            // Membuat objek catatan baru.
            const newEntry = {

                id: Date.now().toString(),

                date: date,

                crop: crop,

                condition: condition,

                action: action

            };


            // Menambahkan catatan ke dalam array.
            diaryEntries.push(newEntry);


            // Menyimpan data ke browser.
            if (!saveDiary()) {

                // Jika gagal, batalkan penambahan data.
                diaryEntries.pop();

                return;

            }


            // Memperbarui tampilan riwayat.
            renderDiary();


            // Mengosongkan kolom kondisi dan tindakan.
            document.getElementById("diaryCondition").value = "";

            document.getElementById("diaryAction").value = "";


            // Memberikan informasi kepada pengguna.
            alert(
                "Catatan kebun berhasil disimpan!"
            );

        });

    }


    // ======================================================
    // 6. FITUR EKSPOR CATATAN MENJADI CSV
    // ======================================================

    if (exportDiaryButton) {

        exportDiaryButton.addEventListener("click", function () {

            // Pastikan terdapat data sebelum ekspor.
            if (diaryEntries.length === 0) {

                alert(
                    "Belum ada catatan kebun untuk diekspor."
                );

                return;

            }


            // Mengamankan teks agar format CSV tetap benar.
            function escapeCSV(value) {

                let text = String(value ?? "");

                // Mencegah teks yang diawali karakter tertentu
                // dianggap sebagai formula oleh aplikasi spreadsheet.
                if (/^[\s]*[=+\-@]/.test(text)) {
                    text = "'" + text;
                }

                // Menggandakan tanda kutip di dalam isi teks.
                return '"' + text.replace(/"/g, '""') + '"';

            }


            // Judul kolom file CSV.
            const headers = [

                "Tanggal",

                "Jenis Tanaman",

                "Kondisi Tanaman",

                "Tindakan Perawatan"

            ];


            // Mengubah setiap catatan menjadi baris CSV.
            const rows = diaryEntries.map(function (entry) {

                return [

                    entry.date,

                    entry.crop,

                    entry.condition,

                    entry.action

                ];

            });


            // Menggabungkan judul dan seluruh baris data.
            const csvContent = [

                headers,

                ...rows

            ].map(function (row) {

                return row.map(escapeCSV).join(",");

            }).join("\r\n");


            // Membuat file CSV agar dapat diunduh.
            // BOM membantu Excel membaca karakter UTF-8.
            const blob = new Blob(

                ["\uFEFF" + csvContent],

                {
                    type: "text/csv;charset=utf-8;"
                }

            );


            // Membuat URL sementara untuk file.
            const url = URL.createObjectURL(blob);

            const downloadLink =
                document.createElement("a");


            // Mengatur nama file hasil unduhan.
            downloadLink.href = url;

            downloadLink.download = "catatan-kebun.csv";


            // Menjalankan unduhan.
            document.body.appendChild(downloadLink);

            downloadLink.click();

            downloadLink.remove();


            // Membersihkan URL sementara.
            setTimeout(function () {

                URL.revokeObjectURL(url);

            }, 1000);

        });

    }


    // Menampilkan catatan yang tersimpan ketika website dibuka.
    if (diaryList) {

        renderDiary();

    }


    // ======================================================
    // 7. FITUR KALKULATOR BIAYA PERAWATAN
    // ======================================================

    const costForm = document.getElementById("costForm");

    const costResult = document.getElementById("costResult");


    // Mengatur format mata uang Indonesia.
    const rupiahFormatter = new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        maximumFractionDigits: 0

    });


    if (costForm && costResult) {

        costForm.addEventListener("submit", function (event) {

            // Mencegah halaman melakukan refresh.
            event.preventDefault();


            // Mengambil nilai biaya dari setiap kolom.
            const seedCost = Number(
                document.getElementById("seedCost").value
            );

            const fertilizerCost = Number(
                document.getElementById("fertilizerCost").value
            );

            const careCost = Number(
                document.getElementById("careCost").value
            );


            // Mengumpulkan seluruh nilai untuk divalidasi.
            const costs = [

                seedCost,

                fertilizerCost,

                careCost

            ];


            // Memastikan nilai bukan negatif dan bukan angka tidak valid.
            const isValid = costs.every(function (cost) {

                return Number.isFinite(cost) && cost >= 0;

            });


            if (!isValid) {

                alert(
                    "Masukkan nilai biaya yang valid dan tidak boleh negatif."
                );

                return;

            }


            // Menjumlahkan seluruh kategori biaya.
            const totalCost =
                seedCost + fertilizerCost + careCost;


            // Menghapus hasil sebelumnya.
            costResult.replaceChildren();


            // Menampilkan keterangan hasil.
            createTextElement(

                costResult,

                "span",

                "Total biaya perawatan"

            );


            // Menampilkan total biaya dengan format Rupiah.
            createTextElement(

                costResult,

                "strong",

                rupiahFormatter.format(totalCost)

            );


            // Menampilkan keterangan perhitungan.
            createTextElement(

                costResult,

                "p",

                "Total dihitung dari biaya benih, pupuk, dan perawatan lainnya."

            );

        });

    }


    // ======================================================
    // 8. SELESAI
    // Semua fitur utama website sudah diaktifkan.
    // ======================================================

});

const COMMON_FIELDS = [
  { key: "fullName", label: "Nama lengkap", placeholder: "Nama lengkap dan gelar" },
  { key: "birthPlaceDate", label: "Tempat, tanggal lahir", placeholder: "Contoh: Jakarta, 12 Januari 1985" },
  { key: "institution", label: "Instansi / Lembaga", placeholder: "Nama instansi atau lembaga" },
  { key: "officeAddress", label: "Alamat kantor", type: "textarea" },
  { key: "homeAddress", label: "Alamat rumah", type: "textarea" },
  { key: "phone", label: "Nomor HP dan WA", placeholder: "08xxxxxxxxxx" },
  { key: "registration", label: "Nomor registrasi", placeholder: "Nomor registrasi" },
  { key: "nipnrp", label: "NIP / NRP", placeholder: "NIP atau NRP" },
  { key: "position", label: "Jabatan", placeholder: "Jabatan pemohon" },
  { key: "rank", label: "Pangkat / Golongan", placeholder: "Pangkat/golongan" },
  { key: "unit", label: "Unit kerja", placeholder: "Unit kerja pemohon" },
  { key: "personnelType", label: "Jenis tenaga", placeholder: "Contoh: Dokter, perawat, tenaga kesehatan lainnya" }
];

const SHARED_FIELDS = [
  { key: "superiorName", label: "Nama atasan langsung", placeholder: "Nama lengkap atasan langsung" },
  { key: "superiorNip", label: "NIP / NRP atasan langsung", placeholder: "NIP atau NRP" },
  { key: "superiorPosition", label: "Jabatan atasan langsung", placeholder: "Jabatan atasan langsung" },
  { key: "superiorInstitution", label: "Instansi atasan langsung", placeholder: "Nama instansi" },
  { key: "letterhead", label: "KOP surat", type: "textarea", full: true, placeholder: "Nama instansi, alamat, telepon, dan informasi kop surat. Digunakan pada formulir yang memiliki KOP surat." },
  { key: "place", label: "Lokasi pembuatan surat", placeholder: "Contoh: Jakarta" },
  { key: "date", label: "Tanggal surat", placeholder: "Contoh: 10 November 2026" }
];

const FORM_META = {
  1: { title: "Surat Izin Instansi", description: "Isi identitas atasan langsung, pemohon, dan informasi surat izin.", heading: "Detail Surat Izin Instansi" },
  2: { title: "Pernyataan Kemampuan Aplikasi", description: "Pernyataan kemampuan mengoperasikan aplikasi komputer dan/atau gawai.", heading: "Detail Surat Pernyataan Kemampuan Aplikasi" },
  3: { title: "Surat Pernyataan PPIH", description: "Pernyataan dan kesanggupan pemohon sebagai petugas PPIH.", heading: "Detail Surat Pernyataan PPIH" },
  4: { title: "Surat Keterangan Pengalaman Kerja", description: "Isi data atasan, masa kerja, dan pengalaman kerja pemohon.", heading: "Detail Surat Keterangan Pengalaman Kerja" },
  5: { title: "Surat Pernyataan Izin Suami", description: "Isi identitas suami sebagai pemberi izin dan identitas istri/pemohon.", heading: "Detail Surat Pernyataan Izin Suami" },
  6: { title: "Surat Pernyataan Tidak Hamil", description: "Pernyataan pemohon mengenai keadaan tidak hamil selama penugasan.", heading: "Detail Surat Pernyataan Tidak Hamil" },
  7: { title: "Surat Pernyataan Telah Berhaji", description: "Isi tahun terakhir pemohon menunaikan ibadah haji.", heading: "Detail Surat Pernyataan Telah Berhaji" }
};

const state = {
  current: 1,
  common: {},
  shared: {
    superiorName: "",
    superiorNip: "",
    superiorPosition: "",
    superiorInstitution: "",
    letterhead: "",
    place: "",
    date: ""
  },
  forms: {
    1: { letterNumber: "", authorizedName: "" },
    2: { platform: "Android dan atau iOS" },
    3: { smoker: "Bukan perokok" },
    4: { letterNumber: "", workUnit: "", startDate: "", endDate: "", durationYears: "", durationMonths: "", experienceAs: "", authorizedName: "", authorizedNip: "" },
    5: { husbandName: "", husbandBirth: "", husbandInstitution: "", husbandOffice: "", husbandHome: "", husbandPhone: "", wifeName: "", wifeBirth: "", wifeInstitution: "", wifeOffice: "", wifeHome: "", wifePhone: "" },
    6: {},
    7: { hajYearHijri: "", hajYearMasehi: "" }
  },
  signatures: {},
  logoData: ""
};

const SIGNATURES = {
  1: [
    { key: "f1_authorized", label: "Pejabat yang berwenang" },
    { key: "f1_supervisor", label: "Atasan langsung" },
    { key: "applicant", label: "Pemohon" }
  ],
  2: [{ key: "applicant", label: "Pemohon / pembuat pernyataan" }],
  3: [{ key: "applicant", label: "Pemohon / pembuat pernyataan" }],
  4: [
    { key: "f4_authorized", label: "Pejabat yang berwenang" },
    { key: "f4_supervisor", label: "Atasan langsung" }
  ],
  5: [{ key: "husband", label: "Suami / pemberi izin" }],
  6: [{ key: "applicant", label: "Pemohon / pembuat pernyataan" }],
  7: [{ key: "applicant", label: "Pemohon / pembuat pernyataan" }]
};

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
const val = (obj, key) => escapeHTML(obj?.[key] || "");
const common = () => state.common;
const shared = () => state.shared;
const form = (id = state.current) => state.forms[id];

function fieldHTML(field, value, scope = "common") {
  const id = `${scope}-${field.key}`;
  const full = field.full ? " full" : "";
  const placeholder = field.placeholder ? ` placeholder="${escapeHTML(field.placeholder)}"` : "";
  const valueAttr = field.type === "textarea" ? "" : ` value="${escapeHTML(value || "")}"`;
  let control = "";
  if (field.type === "textarea") {
    control = `<textarea id="${id}" data-scope="${scope}" data-key="${field.key}"${placeholder}>${escapeHTML(value || "")}</textarea>`;
  } else if (field.type === "select") {
    control = `<select id="${id}" data-scope="${scope}" data-key="${field.key}">${field.options.map(opt => `<option ${opt === value ? "selected" : ""}>${escapeHTML(opt)}</option>`).join("")}</select>`;
  } else {
    control = `<input id="${id}" type="${field.type || "text"}" data-scope="${scope}" data-key="${field.key}"${placeholder}${valueAttr}>`;
  }
  return `<div class="field${full}"><label for="${id}">${escapeHTML(field.label)}</label>${control}${field.hint ? `<small>${escapeHTML(field.hint)}</small>` : ""}</div>`;
}

function groupHTML(title, fields, data, scope, description = "") {
  return `<div class="section-block"><h4>${title}</h4>${description ? `<p class="section-description">${description}</p>` : ""}<div class="field-grid">${fields.map(f => fieldHTML(f, data[f.key], scope)).join("")}</div></div>`;
}

function renderCommonFields() {
  $("#commonFields").innerHTML = COMMON_FIELDS.map(f => fieldHTML(f, state.common[f.key], "common")).join("");
}
function renderSharedFields() {
  $("#sharedFields").innerHTML = SHARED_FIELDS.map(f => fieldHTML(f, state.shared[f.key], "shared")).join("");
}

function signaturePanelHTML(id) {
  const items = SIGNATURES[id] || [];
  return `<div class="section-block"><h4>Tanda tangan (opsional)</h4><p class="section-description">Tanda tangan dapat digambar pada area berikut atau dikosongkan untuk ditandatangani setelah dicetak.</p><div class="signature-grid">${items.map(item => `
    <div class="signature-box">
      <strong>${item.label}</strong>
      <canvas class="signature-pad" width="600" height="160" data-signature="${item.key}" aria-label="Area tanda tangan ${item.label}"></canvas>
      <div class="signature-tools"><small>Gunakan jari, mouse, atau stylus</small><button type="button" data-clear-signature="${item.key}">Hapus tanda tangan</button></div>
    </div>`).join("")}</div></div>`;
}

function renderSpecificFields() {
  const id = state.current;
  const f = form(id);
  let html = "";
  if (id === 1) {
    html += groupHTML("Nomor surat", [
      { key: "letterNumber", label: "Nomor surat", placeholder: "Nomor surat" }
    ], f, "form");
    html += groupHTML("Pengesahan", [
      { key: "authorizedName", label: "Nama pejabat yang berwenang" }
    ], f, "form", "Nama atasan langsung pada kolom tanda tangan mengikuti data bersama.");
  } else if (id === 2) {
    html += groupHTML("Pengaturan aplikasi", [
      { key: "platform", label: "Platform aplikasi", type: "select", options: ["Android dan atau iOS", "Android", "iOS"] }
    ], f, "form", "Lokasi dan tanggal surat mengikuti data bersama.");
  } else if (id === 3) {
    html += groupHTML("Status merokok", [
      { key: "smoker", label: "Status merokok", type: "select", options: ["Perokok", "Bukan perokok"] }
    ], f, "form", "Lokasi dan tanggal surat mengikuti data bersama.");
  } else if (id === 4) {
    html += groupHTML("Nomor surat", [
      { key: "letterNumber", label: "Nomor surat" }
    ], f, "form");
    html += groupHTML("Rincian pengalaman kerja", [
      { key: "workUnit", label: "Unit kerja tempat bekerja" },
      { key: "startDate", label: "Terhitung sejak tanggal" },
      { key: "endDate", label: "Sampai dengan tanggal" },
      { key: "durationYears", label: "Lama kerja (tahun)", placeholder: "Contoh: 5" },
      { key: "durationMonths", label: "Lama kerja (bulan)", placeholder: "Contoh: 6" },
      { key: "experienceAs", label: "Pengalaman dan kapasitas melaksanakan tugas sebagai", type: "textarea", full: true, placeholder: "Uraian pengalaman/kapasitas kerja" }
    ], f, "form");
    html += groupHTML("Pengesahan", [
      { key: "authorizedName", label: "Nama pejabat yang berwenang" },
      { key: "authorizedNip", label: "NIP / NRP pejabat berwenang" }
    ], f, "form", "Nama dan NIP/NRP atasan langsung mengikuti data bersama.");
  } else if (id === 5) {
    html += `<div class="inline-actions"><button type="button" class="btn btn-light" id="copyApplicantToWife">Salin data pemohon ke bagian istri</button></div>`;
    html += groupHTML("Identitas suami (pemberi izin)", [
      { key: "husbandName", label: "Nama lengkap suami" },
      { key: "husbandBirth", label: "Tempat, tanggal lahir suami" },
      { key: "husbandInstitution", label: "Instansi / lembaga suami" },
      { key: "husbandOffice", label: "Alamat kantor suami", type: "textarea" },
      { key: "husbandHome", label: "Alamat rumah suami", type: "textarea" },
      { key: "husbandPhone", label: "Nomor HP dan WA suami" }
    ], f, "form");
    html += groupHTML("Identitas istri (pemohon)", [
      { key: "wifeName", label: "Nama lengkap istri" },
      { key: "wifeBirth", label: "Tempat, tanggal lahir istri" },
      { key: "wifeInstitution", label: "Instansi / lembaga istri" },
      { key: "wifeOffice", label: "Alamat kantor istri", type: "textarea" },
      { key: "wifeHome", label: "Alamat rumah istri", type: "textarea" },
      { key: "wifePhone", label: "Nomor HP dan WA istri" }
    ], f, "form", "Lokasi dan tanggal surat mengikuti data bersama.");
  } else if (id === 6) {
    html += `<p class="section-description">Lokasi dan tanggal surat mengikuti data bersama.</p>`;
  } else if (id === 7) {
    html += groupHTML("Tahun terakhir menunaikan ibadah haji", [
      { key: "hajYearHijri", label: "Tahun haji (Hijriah)", placeholder: "Contoh: 1435" },
      { key: "hajYearMasehi", label: "Tahun haji (Masehi)", placeholder: "Contoh: 2014" }
    ], f, "form", "Lokasi dan tanggal surat mengikuti data bersama.");
  }
  html += signaturePanelHTML(id);
  $("#specificFields").innerHTML = html;
  attachSignaturePads();
  const copyBtn = $("#copyApplicantToWife");
  if (copyBtn) copyBtn.addEventListener("click", copyApplicantToWife);
}

function attachSignaturePads() {
  document.querySelectorAll(".signature-pad").forEach(canvas => {
    const key = canvas.dataset.signature;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 3.5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#17241e";
    if (state.signatures[key]) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = state.signatures[key];
    }
    let drawing = false;
    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
    };
    canvas.addEventListener("pointerdown", event => {
      drawing = true; canvas.setPointerCapture(event.pointerId);
      const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + .1, p.y + .1); ctx.stroke();
      state.signatures[key] = canvas.toDataURL("image/png");
    });
    canvas.addEventListener("pointermove", event => {
      if (!drawing) return;
      const p = point(event); ctx.lineTo(p.x, p.y); ctx.stroke();
      state.signatures[key] = canvas.toDataURL("image/png");
    });
    const stop = () => { drawing = false; state.signatures[key] = canvas.toDataURL("image/png"); };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
  });
  document.querySelectorAll("[data-clear-signature]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.clearSignature;
      delete state.signatures[key];
      const canvas = document.querySelector(`[data-signature="${key}"]`);
      if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      renderPreview();
    });
  });
}

function copyApplicantToWife() {
  const f = form(5);
  const c = common();
  f.wifeName = c.fullName || "";
  f.wifeBirth = c.birthPlaceDate || "";
  f.wifeInstitution = c.institution || "";
  f.wifeOffice = c.officeAddress || "";
  f.wifeHome = c.homeAddress || "";
  f.wifePhone = c.phone || "";
  renderSpecificFields();
  renderPreview();
}

function updateField(event) {
  const el = event.target;
  if (!el.matches("[data-scope][data-key]")) return;
  const scope = el.dataset.scope;
  const key = el.dataset.key;
  if (scope === "common") state.common[key] = el.value;
  else if (scope === "shared") state.shared[key] = el.value;
  else form()[key] = el.value;
  renderPreview();
}

function signatureImage(key) {
  const data = state.signatures[key];
  return data ? `<img class="signature-img" src="${data}" alt="Tanda tangan">` : "";
}
function line(value, fallback = "........................................................") {
  return value ? escapeHTML(value) : fallback;
}
function identityTable(rows) {
  return `<table class="doc-ident">${rows.map(([label, value]) => `<tr><td>${label}</td><td>:</td><td>${line(value)}</td></tr>`).join("")}</table>`;
}
function signBlock(role, name, sigKey, extra = "") {
  return `<div class="doc-sign"><div class="role">${role}</div><div class="sign-space">${signatureImage(sigKey)}</div><div class="name">${line(name, "........................................")}</div>${extra ? `<div>${extra}</div>` : ""}</div>`;
}
function docBase(number, title, body, extraClass = "") {
  return `<article class="doc-page ${extraClass}">
    <div class="doc-form-number">FORMULIR ${number}</div>
    ${title}
    ${body}
  </article>`;
}
function letterheadBlock(text = state.shared.letterhead) {
  const logo = state.logoData ? `<img class="doc-logo" src="${state.logoData}" alt="Logo instansi">` : "";
  const head = text ? escapeHTML(text) : "KOP SURAT";
  return `<div class="doc-letterhead">${logo}${head}</div>`;
}
function dateLine(place = state.shared.place, date = state.shared.date) {
  const p = place || "………………";
  const d = date || "………………";
  return `<p class="doc-date">${escapeHTML(p)}, ${escapeHTML(d)}</p>`;
}

function renderForm1() {
  const c = common(), s = shared(), f = form(1);
  const body = `
    ${letterheadBlock()}
    <h2 class="doc-title"><span class="main">SURAT IZIN INSTANSI</span></h2>
    <p class="doc-number">Nomor : ${line(f.letterNumber, "........................................")}</p>
    <p class="doc-p">Yang bertanda tangan di bawah ini:</p>
    ${identityTable([["Nama", s.superiorName], ["NIP/NRP", s.superiorNip], ["Jabatan", s.superiorPosition], ["Instansi", s.superiorInstitution]])}
    <p class="doc-p">Sebagai atasan langsung dari:</p>
    ${identityTable([["Nama", c.fullName], ["Nomor Registrasi", c.registration], ["NIP/NRP", c.nipnrp], ["Jabatan", c.position], ["Pangkat/Golongan", c.rank], ["Unit Kerja", c.unit]])}
    <p class="doc-p">Menerangkan bahwa nama tersebut di atas benar bekerja di unit kerja yang saya pimpin dan kami memberikan <b>IZIN</b> kepada yang bersangkutan untuk:</p>
    <ol class="doc-list">
      <li>Mengikuti seluruh tahapan Rekrutmen PPIH Arab Saudi Bidang Kesehatan, TKH dan TPK.</li>
      <li>Menjadi Petugas Kesehatan Haji Indonesia Tahun 1448 H/2027 M, apabila yang bersangkutan dinyatakan <b>LULUS</b>.</li>
    </ol>
    <p class="doc-p">Demikian surat izin ini dibuat dengan penuh tanggung jawab.</p>
    ${dateLine()}
    <div class="doc-sign-row">
      ${signBlock("Mengetahui,<br>Pejabat yang Berwenang*)", f.authorizedName, "f1_authorized")}
      ${signBlock("Atasan Langsung", s.superiorName, "f1_supervisor")}
    </div>
    ${signBlock("Pemohon", c.fullName, "applicant", `NIP/NRP: ${line(c.nipnrp)}`)}
    <div class="doc-note"><b>Keterangan*)</b><br>1. Rumah Sakit: oleh Direktur RS<br>2. Klinik: oleh Pimpinan Klinik<br>3. Dokter Praktik: oleh Kepala Dinas Kesehatan Provinsi<br>4. Puskesmas: oleh Kepala Dinas Kesehatan Kab/Kota<br>5. UPT Daerah: oleh Kepala Dinas Kesehatan Kab/Kota<br>6. UPT Pusat: oleh Kepala UPT Pusat<br>7. Unit Utama Pusat: oleh Pejabat Setingkat Eselon II</div>`;
  return docBase(1, "", body, "doc-compact");
}

function renderForm2() {
  const c = common(), f = form(2);
  const platform = f.platform || "Android dan atau iOS";
  const body = `
    <h2 class="doc-title"><span class="main">SURAT PERNYATAAN</span><span class="sub">MAMPU MENGOPERASIKAN APLIKASI KOMPUTER DAN ATAU<br> APLIKASI GAWAI BERBASIS ANDROID DAN ATAU IOS</span></h2>
    <p class="doc-p">Yang bertanda tangan di bawah ini saya:</p>
    ${identityTable([["1. Nama Lengkap", c.fullName], ["2. Tempat, Tanggal Lahir", c.birthPlaceDate], ["3. Instansi / Lembaga", c.institution], ["4. Alamat Kantor", c.officeAddress], ["5. Alamat Rumah", c.homeAddress], ["6. Nomor HP dan WA", c.phone]])}
    <p class="doc-center"><b>MENYATAKAN DENGAN SESUNGGUHNYA</b></p>
    <p class="doc-p">Bahwa saya:</p>
    <table class="doc-ident">
      <tr><td>Kesatu</td><td>:</td><td>Mampu mengoperasikan perangkat Teknologi Informasi dan Komunikasi (Mampu mengoperasikan Aplikasi Pelaporan PPIH berbasis ${escapeHTML(platform)}).</td></tr>
      <tr><td>Kedua</td><td>:</td><td>Memastikan nomor telepon seluler pribadi sebagaimana tertera di atas dapat dihubungi sejak pendaftaran sampai berakhirnya masa tugas PPIH.</td></tr>
      <tr><td>Ketiga</td><td>:</td><td>Bersedia melakukan pelaporan PPIH melalui Aplikasi berbasis ${escapeHTML(platform)} sesuai ketentuan.</td></tr>
      <tr><td>Keempat</td><td>:</td><td>Bersedia mengaktifkan fasilitas Global Positioning System (GPS) pada gawai komunikasi yang digunakan selama bertugas.</td></tr>
      <tr><td>Kelima</td><td>:</td><td>Memastikan ketersediaan paket data internet pribadi selama menjalankan tugas sebagai PPIH.</td></tr>
    </table>
    <p class="doc-p">Demikian Surat Pernyataan ini saya buat dalam keadaan sadar tanpa ada tekanan dari pihak manapun juga, dan saya bersedia dikenakan sanksi sesuai ketentuan yang berlaku, apabila di kemudian hari terbukti bahwa pernyataan saya ini tidak benar.</p>
    ${dateLine()}
    <div class="doc-sign single"><div class="role">Yang membuat pernyataan</div><div class="doc-stamp">Materai 10.000</div><div class="sign-space">${signatureImage("applicant")}</div><div class="name">${line(c.fullName)}</div><div>Tanda tangan dan nama lengkap</div></div>
    <p class="doc-footer-note">Keterangan : *) Coret yang tidak perlu</p>`;
  return docBase(2, "", body, "doc-compact");
}

function renderForm3() {
  const c = common(), f = form(3);
  const smoker = f.smoker || "Bukan perokok";
  const body = `
    <h2 class="doc-title"><span class="main">SURAT PERNYATAAN PPIH</span></h2>
    <p class="doc-p">Yang bertanda tangan di bawah ini:</p>
    ${identityTable([["Nama", c.fullName], ["Nomor Registrasi", c.registration], ["NIP/NRP", c.nipnrp], ["Jabatan", c.position], ["Unit Kerja", c.unit], ["Jenis Tenaga", c.personnelType]])}
    <p class="doc-p">Dengan ini menyatakan bahwa Saya:</p>
    <ol class="doc-list">
      <li>Tidak terlibat dalam proses hukum sampai dengan menyelesaikan tugas sebagai petugas penyelenggara ibadah haji Indonesia tahun 1448 H / 2027 M.</li>
      <li>Bersedia dan sanggup mengikuti seluruh proses seleksi, mentaati seluruh peraturan yang berlaku dan siap ditugaskan dan ditempatkan sesuai kebutuhan operasional di Arab Saudi.</li>
      <li>Dapat bekerja secara teamwork dan menjaga soliditas team dalam menjalankan tugas.</li>
      <li>Menjaga nama baik dan Integritas Kementerian Haji dan Umrah.</li>
      <li>${escapeHTML(smoker)} dan bersedia tidak merokok pada saat mengikuti pelatihan calon petugas penyelenggara ibadah haji dan selama menjalankan tugas sebagai petugas haji.</li>
      <li>Tidak memahrami atau di mahrami jemaah atau petugas haji.</li>
      <li>Tidak menjalin hubungan asmara sesama petugas selama menjadi petugas haji.</li>
      <li>Memberikan data dan dokumen yang benar dalam proses seleksi ini.</li>
    </ol>
    <p class="doc-p">Apabila saya melanggar pernyataan diatas, maka saya bersedia:</p>
    <ol class="doc-list doc-consequences">
      <li>Dibatalkan keikutsertaan/kelulusan sebagai petugas penyelenggara ibadah haji Indonesia.</li>
      <li>Dipulangkan dari Arab Saudi sebelum tugas selesai.</li>
      <li>Mengganti seluruh biaya yang telah dikeluarkan oleh Kementerian Haji dan Umrah.</li>
      <li>Dikenakan sanksi administrasi baik Individu maupun institusi tempat bekerja.</li>
    </ol>
    <p class="doc-p">Demikian, surat pernyataan ini saya buat dengan sadar dan tanpa paksaan atau tekanan dari pihak manapun.</p>
    ${dateLine()}
    <div class="doc-sign single"><div class="role">Yang membuat pernyataan</div><div class="sign-space">${signatureImage("applicant")}</div><div class="name">${line(c.fullName)}</div><div>(${line(c.position, "Nama Lengkap dan Gelar")})</div><div class="doc-small">Dilengkapi TTD dan materai 10.000</div></div>
    <p class="doc-footer-note">* Coret yang tidak perlu</p>`;
  return docBase(3, "", body, "doc-compact");
}

function renderForm4() {
  const c = common(), s = shared(), f = form(4);
  const body = `
    ${letterheadBlock()}
    <h2 class="doc-title"><span class="main">SURAT KETERANGAN PENGALAMAN KERJA</span></h2>
    <p class="doc-number">Nomor : ${line(f.letterNumber, "........................................")}</p>
    <p class="doc-p">Yang bertanda tangan di bawah ini:</p>
    ${identityTable([["Nama", s.superiorName], ["NIP/NRP", s.superiorNip], ["Jabatan", s.superiorPosition], ["Instansi", s.superiorInstitution]])}
    <p class="doc-p">Sebagai atasan langsung dari:</p>
    ${identityTable([["Nama", c.fullName], ["Nomor Registrasi", c.registration], ["NIP/NRP", c.nipnrp], ["Jabatan", c.position], ["Pangkat/Golongan", c.rank], ["Unit Kerja", c.unit]])}
    <p class="doc-p">Menerangkan bahwa nama tersebut di atas benar bekerja di Unit Kerja ${line(f.workUnit || c.unit)} terhitung sejak tanggal ${line(f.startDate)} sampai dengan ${line(f.endDate)}, selama ${line(f.durationYears, "……")} tahun ${line(f.durationMonths, "……")} bulan, serta memiliki pengalaman dan kapasitas melaksanakan tugas sebagai ${line(f.experienceAs)}.</p>
    <p class="doc-p doc-small">(ditulis secara manual).</p>
    <p class="doc-p">Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
    ${dateLine()}
    <div class="doc-sign-row">
      ${signBlock("Mengetahui,<br>Pejabat yang Berwenang*)", f.authorizedName, "f4_authorized", `NIP/NRP: ${line(f.authorizedNip)}<br>(Dilengkapi TTD dan Cap Basah)`)} 
      ${signBlock("Atasan Langsung", s.superiorName, "f4_supervisor", `NIP/NRP: ${line(s.superiorNip)}<br>(Dilengkapi TTD)` )}
    </div>
    <p class="doc-footer-note">Keterangan*)<br>1. Rumah Sakit: oleh Direktur RS<br>2. Klinik: oleh Pimpinan Klinik<br>3. Dokter Praktik: oleh Kepala Dinas Kesehatan Provinsi<br>4. Puskesmas: oleh Kepala Dinas Kesehatan Kab/Kota<br>5. UPT Daerah: oleh Kepala Dinas Kesehatan Kab/Kota<br>6. UPT Pusat: oleh Kepala UPT Pusat<br>7. Unit Utama Pusat: oleh Pejabat Setingkat Eselon II<br><i>(Dilengkapi TTD dan cap basah sesuai format sumber)</i></p>`;
  return docBase(4, "", body, "doc-compact");
}

function renderForm5() {
  const f = form(5);
  const body = `
    <h2 class="doc-title"><span class="main">SURAT PERNYATAAN IZIN SUAMI</span></h2>
    <p class="doc-p">Yang bertanda tangan di bawah ini saya:</p>
    ${identityTable([["1. Nama Lengkap", f.husbandName], ["2. Tempat, Tanggal Lahir", f.husbandBirth], ["3. Instansi / Lembaga", f.husbandInstitution], ["4. Alamat Kantor", f.husbandOffice], ["5. Alamat Rumah", f.husbandHome], ["6. Nomor HP dan WA", f.husbandPhone]])}
    <p class="doc-p">Menyatakan dengan sesungguhnya bahwa saya suami dari</p>
    ${identityTable([["1. Nama Lengkap", f.wifeName], ["2. Tempat, Tanggal Lahir", f.wifeBirth], ["3. Instansi / Lembaga", f.wifeInstitution], ["4. Alamat Kantor", f.wifeOffice], ["5. Alamat Rumah", f.wifeHome], ["6. Nomor HP dan WA", f.wifePhone]])}
    <p class="doc-p">Selanjutnya, saya memberikan izin kepada Istri saya untuk mengikuti Seleksi Calon PPIH Tahun 1448 H/2027 M, dan mengizinkan untuk melaksanakan tugas sebagai PPIH apabila di kemudian hari diterima.</p>
    <p class="doc-p">Demikian surat peryataan ini saya buat, apabila di kemudian hari terbukti bahwa pernyataan saya tidak benar, maka saya bersedia untuk diproses sesuai ketentuan yang berlaku.</p>
    ${dateLine()}
    <div class="doc-sign single"><div class="role">Yang Membuat Pernyataan</div><div class="doc-stamp">Materai 10.000</div><div class="sign-space">${signatureImage("husband")}</div><div class="name">${line(f.husbandName)}</div><div>Tanda tangan</div></div>
    <p class="doc-footer-note">Catatan : Perhatikan surat izin instansi</p>`;
  return docBase(5, "", body, "doc-compact");
}

function renderForm6() {
  const c = common(), f = form(6);
  const body = `
    <h2 class="doc-title"><span class="main">SURAT PERNYATAAN TIDAK HAMIL</span></h2>
    <p class="doc-p">Yang bertanda tangan di bawah ini saya:</p>
    ${identityTable([["1. Nama Lengkap", c.fullName], ["2. Tempat, Tanggal Lahir", c.birthPlaceDate], ["3. Instansi / Lembaga", c.institution], ["4. Alamat Kantor", c.officeAddress], ["5. Alamat Rumah", c.homeAddress], ["6. Nomor HP dan WA", c.phone]])}
    <p class="doc-p">Menyatakan dengan sesungguhnya bahwa saya tidak dalam keadaan hamil sampai dengan selesai penugasan sebagai Petugas Penyelenggara Ibadah Haji (PPIH) tahun 1448 H/2027 M.</p>
    <p class="doc-p">Demikian surat peryataan ini saya buat, apabila di kemudian hari terbukti bahwa pernyataan saya tidak benar, maka saya bersedia untuk dibatalkan penugasannya, mengembalikan seluruh biaya yang telah diterima selama penugasan dan diproses sesuai ketentuan yang berlaku.</p>
    ${dateLine()}
    <div class="doc-sign single"><div class="role">Yang Membuat Pernyataan</div><div class="doc-stamp">Materai 10.000</div><div class="sign-space">${signatureImage("applicant")}</div><div class="name">${line(c.fullName)}</div><div>Tanda tangan</div></div>`;
  return docBase(6, "", body, "doc-compact");
}

function renderForm7() {
  const c = common(), f = form(7);
  const body = `
    <h2 class="doc-title"><span class="main">SURAT PERNYATAAN TELAH BERHAJI</span></h2>
    <p class="doc-p">Yang bertanda tangan di bawah ini saya:</p>
    ${identityTable([["1. Nama Lengkap", c.fullName], ["2. Tempat, Tanggal Lahir", c.birthPlaceDate], ["3. Instansi / Lembaga", c.institution], ["4. Alamat Kantor", c.officeAddress], ["5. Alamat Rumah", c.homeAddress], ["6. Nomor HP dan WA", c.phone]])}
    <p class="doc-p">Menyatakan dengan sesungguhnya bahwa saya telah menunaikan ibadah haji terakhir pada tahun ${line(f.hajYearHijri, "..............")} H/${line(f.hajYearMasehi, ".............")} M.</p>
    <p class="doc-p">Demikian surat peryataan ini saya buat, apabila di kemudian hari terbukti bahwa pernyataan saya tidak benar, maka saya bersedia untuk diproses sesuai ketentuan yang berlaku.</p>
    ${dateLine()}
    <div class="doc-sign single"><div class="role">Yang Membuat Pernyataan</div><div class="doc-stamp">Materai 10.000</div><div class="sign-space">${signatureImage("applicant")}</div><div class="name">${line(c.fullName)}</div><div>Tanda tangan</div></div>`;
  return docBase(7, "", body, "doc-compact");
}

const RENDERERS = { 1: renderForm1, 2: renderForm2, 3: renderForm3, 4: renderForm4, 5: renderForm5, 6: renderForm6, 7: renderForm7 };

function renderPreview() {
  const html = RENDERERS[state.current]();
  $("#previewContainer").innerHTML = `<div class="preview-paper">${html}</div>`;
}
function renderHeader() {
  const meta = FORM_META[state.current];
  $("#formNumber").textContent = state.current;
  $("#currentTitle").textContent = meta.title;
  $("#currentDescription").textContent = meta.description;
  $("#specificHeading").textContent = meta.heading;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", Number(btn.dataset.form) === state.current));
}
function renderAll() {
  renderHeader();
  renderCommonFields();
  renderSharedFields();
  renderSpecificFields();
  renderPreview();
}
function resetCurrent() {
  if (!confirm("Kosongkan isian khusus formulir ini? Data pribadi dan data bersama tidak akan dihapus.")) return;
  const id = state.current;
  const defaults = {
    1: { letterNumber: "", authorizedName: "" },
    2: { platform: "Android dan atau iOS" },
    3: { smoker: "Bukan perokok" },
    4: { letterNumber: "", workUnit: "", startDate: "", endDate: "", durationYears: "", durationMonths: "", experienceAs: "", authorizedName: "", authorizedNip: "" },
    5: { husbandName: "", husbandBirth: "", husbandInstitution: "", husbandOffice: "", husbandHome: "", husbandPhone: "", wifeName: "", wifeBirth: "", wifeInstitution: "", wifeOffice: "", wifeHome: "", wifePhone: "" },
    6: {},
    7: { hajYearHijri: "", hajYearMasehi: "" }
  };
  state.forms[id] = { ...defaults[id] };
  if (id === 1) ["f1_authorized","f1_supervisor"].forEach(k => delete state.signatures[k]);
  if (id === 4) ["f4_authorized","f4_supervisor"].forEach(k => delete state.signatures[k]);
  if (id === 5) delete state.signatures.husband;
  if ([2,3,6,7].includes(id)) delete state.signatures.applicant;
  renderAll();
}

async function printForms(ids) {
  const printArea = $("#printArea");
  // Each renderer reads its own data; menu selection is never changed.
  printArea.innerHTML = ids.map(id => RENDERERS[id]()).join("");
  printArea.dataset.pageCount = String(ids.length);

  // Measure each document off-screen and scale down only if it would overflow A4.
  printArea.style.display = "block";
  printArea.style.position = "fixed";
  printArea.style.left = "-10000px";
  printArea.style.top = "0";
  printArea.style.width = "182mm";
  const availableHeightPx = 277 * 96 / 25.4;
  printArea.querySelectorAll(".doc-page").forEach(page => {
    page.style.fontSize = "9.8pt";
    page.style.lineHeight = "1.13";
    page.style.zoom = "1";
    const contentHeight = page.scrollHeight;
    if (contentHeight > availableHeightPx) {
      page.style.zoom = String(Math.max(0.78, availableHeightPx / contentHeight));
    }
  });

  // Wait for embedded signature images and layout before opening the print dialog.
  const images = Array.from(printArea.querySelectorAll("img"));
  await Promise.all(images.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  // Remove measurement-only positioning; print CSS places the pages on A4.
  printArea.style.removeProperty("position");
  printArea.style.removeProperty("left");
  printArea.style.removeProperty("top");
  printArea.style.removeProperty("width");
  printArea.style.removeProperty("display");

  window.focus();
  window.print();
}

document.addEventListener("input", updateField);
document.addEventListener("change", updateField);
$("#formNav").addEventListener("click", event => {
  const button = event.target.closest("[data-form]");
  if (!button) return;
  state.current = Number(button.dataset.form);
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("#resetCurrent").addEventListener("click", resetCurrent);
$("#printCurrent").addEventListener("click", () => printForms([state.current]));
$("#printAll").addEventListener("click", () => printForms([1,2,3,4,5,6,7]));
window.addEventListener("afterprint", () => {
  const printArea = $("#printArea");
  printArea.querySelectorAll(".doc-page").forEach(page => {
    page.style.removeProperty("zoom");
    page.style.removeProperty("font-size");
    page.style.removeProperty("line-height");
  });
});
renderAll();

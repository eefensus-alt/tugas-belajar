let colors=["#4285F4","#0F9D58","#F4B400","#DB4437","#673AB7"];

const save=(k,d)=>localStorage.setItem(k,JSON.stringify(d));
const get=(k)=>JSON.parse(localStorage.getItem(k))||[];

// TAB
function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ================= JADWAL ================= */
function tambahJadwal(){
  let d=get("jadwal");

  d.push({
    matkul:matkul.value,
    hari:hari.value,
    jam:jam.value,
    sks:sks.value,
    dosen:dosen.value
  });

  save("jadwal",d);
  renderJadwal();
}

function renderJadwal(){
  jadwalList.innerHTML="";
  get("jadwal").forEach((j,i)=>{

    let color=colors[i%colors.length];

    jadwalList.innerHTML+=`
    <div class="card">
      <div class="card-header" style="background:${color}">
        ${j.matkul}
      </div>
      <div class="card-body">
        Hari: ${j.hari}<br>
        Jam: ${j.jam}<br>
        SKS: ${j.sks}<br>
        Dosen: ${j.dosen}<br>
        <button class="btn edit" onclick="editJ(${i})">Edit</button>
        <button class="btn hapus" onclick="hapusJ(${i})">Hapus</button>
      </div>
    </div>`;
  });
}

function hapusJ(i){
  let d=get("jadwal");
  d.splice(i,1);
  save("jadwal",d);
  renderJadwal();
}

function editJ(i){
  let d=get("jadwal");
  let j=d[i];

  matkul.value=j.matkul;
  hari.value=j.hari;
  jam.value=j.jam;
  sks.value=j.sks;
  dosen.value=j.dosen;

  d.splice(i,1);
  save("jadwal",d);
  renderJadwal();
}

/* ================= TUGAS ================= */
function tambahTugas(){
  let d=get("tugas");

  d.push({
    matkul:tMatkul.value,
    jenis:tJenis.value,
    deadline:tDeadline.value,
    selesai:false
  });

  save("tugas",d);
  renderTugas();
}

function renderTugas(){
  tugasList.innerHTML="";
  let s=searchTugas.value.toLowerCase();

  get("tugas").forEach((t,i)=>{
    if(t.matkul.toLowerCase().includes(s)){
      tugasList.innerHTML+=`
      <div class="card">
        <div class="card-body">
          <b>${t.matkul}</b><br>
          ${t.jenis}<br>
          ${t.deadline}<br>
          Status: ${t.selesai?"✅":"❌"}<br>
          <button class="btn edit" onclick="toggle(${i})">Status</button>
          <button class="btn hapus" onclick="hapusT(${i})">Hapus</button>
        </div>
      </div>`;
    }
  });
}

searchTugas.oninput=renderTugas;

function toggle(i){
  let d=get("tugas");
  d[i].selesai=!d[i].selesai;
  save("tugas",d);
  renderTugas();
}

function hapusT(i){
  let d=get("tugas");
  d.splice(i,1);
  save("tugas",d);
  renderTugas();
}

/* ================= MATERI ================= */
function tambahMateri(){
  let file=mFile.files[0];
  if(!file) return alert("Pilih file!");

  let reader=new FileReader();
  reader.onload=e=>{
    let d=get("materi");
    d.push({
      matkul:mMatkul.value,
      nama:file.name,
      data:e.target.result
    });
    save("materi",d);
    renderMateri();
  };
  reader.readAsDataURL(file);
}

function renderMateri(){
  materiList.innerHTML="";
  let s=searchMateri.value.toLowerCase();

  get("materi").forEach((m,i)=>{
    if(m.matkul.toLowerCase().includes(s)){
      materiList.innerHTML+=`
      <div class="card">
        <div class="card-body">
          ${m.matkul} - ${m.nama}<br>
          <a href="${m.data}" target="_blank">📂 Buka</a><br>
          <button class="btn hapus" onclick="hapusM(${i})">Hapus</button>
        </div>
      </div>`;
    }
  });
}

searchMateri.oninput=renderMateri;

function hapusM(i){
  let d=get("materi");
  d.splice(i,1);
  save("materi",d);
  renderMateri();
}

/* ================= ALARM ================= */
setInterval(()=>{
  let now=new Date();

  get("jadwal").forEach(j=>{
    let [jam,menit]=j.jam.split(":");

    let waktu=new Date();
    waktu.setHours(jam);
    waktu.setMinutes(menit-15);

    if(
      now.getHours()==waktu.getHours() &&
      now.getMinutes()==waktu.getMinutes()
    ){
      alert("⏰ 15 menit lagi: "+j.matkul);
    }
  });

},60000);

// INIT
renderJadwal();
renderTugas();
renderMateri();
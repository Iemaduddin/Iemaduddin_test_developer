<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Asset = { asset_id: number; asset_name: string; stock_quantity: number; category: 'Consumable' | 'Non-Consumable' }
const endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/assets`
const assets = ref<Asset[]>([])
const categoryFilter = ref<'All' | Asset['category']>('All')
const error = ref('')
const saving = ref(false)
const editingId = ref<number | null>(null)
const detailAsset = ref<Asset | null>(null)
const deleteAsset = ref<Asset | null>(null)
const form = ref({ asset_name: '', stock_quantity: 0, category: 'Consumable' as Asset['category'] })
const filteredAssets = () => categoryFilter.value === 'All'
  ? assets.value
  : assets.value.filter((asset) => asset.category === categoryFilter.value)

async function load() {
  try {
    const response = await fetch(endpoint)
    if (!response.ok) throw new Error('Gagal memuat data aset')
    assets.value = await response.json() as Asset[]
    error.value = ''
  } catch (e) { error.value = e instanceof Error ? e.message : 'API tidak dapat dihubungi' }
}

async function save() {
  saving.value = true
  try {
    const response = await fetch(editingId.value ? `${endpoint}/${editingId.value}` : endpoint, {
      method: editingId.value ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!response.ok) throw new Error('Gagal menyimpan aset. Periksa isian dan koneksi API.')
    reset()
    await load()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Gagal menyimpan aset' }
  finally { saving.value = false }
}

function edit(asset: Asset) {
  editingId.value = asset.asset_id
  form.value = { asset_name: asset.asset_name, stock_quantity: asset.stock_quantity, category: asset.category }
}

function reset() {
  editingId.value = null
  form.value = { asset_name: '', stock_quantity: 0, category: 'Consumable' }
}

async function remove() {
  if (!deleteAsset.value) return
  try {
    const response = await fetch(`${endpoint}/${deleteAsset.value.asset_id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Gagal menghapus aset')
    deleteAsset.value = null
    await load()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Gagal menghapus aset' }
}

onMounted(load)
</script>

<template>
  <main class="mx-auto min-h-screen max-w-screen-2xl px-4 py-8 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-slate-800 sm:px-8 sm:py-12">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <p class="mb-2 text-xs font-extrabold tracking-[.14em] text-emerald-700">FUMINDO · INVENTORY</p>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Data Aset</h1>
        <p class="mt-1 text-slate-500">Kelola inventaris perusahaan</p>
      </div>
      <span class="rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-800">{{ assets.length }} aset</span>
    </header>

    <p v-if="error" class="mb-5 rounded-lg bg-red-50 p-3 text-red-800" role="alert">{{ error }}</p>

    <section class="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="mb-5 text-lg font-bold">{{ editingId ? 'Edit aset' : 'Tambah aset' }}</h2>
      <form class="grid items-end gap-4 md:grid-cols-[2fr_1fr_1.2fr]" @submit.prevent="save">
        <label class="grid gap-1.5 text-sm font-semibold text-slate-600">Nama aset
          <input v-model.trim="form.asset_name" class="h-11 rounded-lg border border-slate-300 px-3 font-normal text-slate-800 focus:border-emerald-700 focus:outline-2 focus:outline-emerald-200" required maxlength="255" placeholder="Masukkan nama aset" />
        </label>
        <label class="grid gap-1.5 text-sm font-semibold text-slate-600">Jumlah stok
          <input v-model.number="form.stock_quantity" class="h-11 rounded-lg border border-slate-300 px-3 font-normal text-slate-800 focus:border-emerald-700 focus:outline-2 focus:outline-emerald-200" type="number" min="0" required />
        </label>
        <label class="grid gap-1.5 text-sm font-semibold text-slate-600">Kategori
          <select v-model="form.category" class="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-800 focus:border-emerald-700 focus:outline-2 focus:outline-emerald-200">
            <option>Consumable</option><option>Non-Consumable</option>
          </select>
        </label>
        <div class="flex gap-2 md:col-span-3">
          <button class="rounded-lg bg-emerald-800 px-4 py-2.5 font-bold text-white hover:bg-emerald-900 disabled:opacity-60" :disabled="saving">{{ saving ? 'Menyimpan…' : editingId ? 'Simpan perubahan' : 'Tambah aset' }}</button>
          <button v-if="editingId" type="button" class="rounded-lg bg-slate-100 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-200" @click="reset">Batal</button>
        </div>
      </form>
    </section>

    <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 class="text-lg font-bold">Daftar aset</h2>
        <label class="grid gap-1.5 text-sm font-semibold text-slate-600 sm:w-64">Filter kategori
          <select v-model="categoryFilter" aria-label="Filter kategori" class="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal text-slate-800 focus:border-emerald-700 focus:outline-2 focus:outline-emerald-200">
            <option value="All">Semua kategori</option><option value="Consumable">Consumable</option><option value="Non-Consumable">Non-Consumable</option>
          </select>
        </label>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left">
          <thead><tr class="text-xs uppercase tracking-wide text-slate-500"><th class="border-b border-slate-200 px-3 py-3">ID</th><th class="border-b border-slate-200 px-3 py-3">Nama aset</th><th class="border-b border-slate-200 px-3 py-3">Stok</th><th class="border-b border-slate-200 px-3 py-3">Kategori</th><th class="border-b border-slate-200 px-3 py-3">Aksi</th></tr></thead>
          <tbody>
            <tr v-for="asset in filteredAssets()" :key="asset.asset_id" class="text-slate-600">
              <td class="border-b border-slate-100 px-3 py-3">#{{ asset.asset_id }}</td>
              <td class="border-b border-slate-100 px-3 py-3 font-semibold text-slate-800">{{ asset.asset_name }}</td>
              <td class="border-b border-slate-100 px-3 py-3">{{ asset.stock_quantity }}</td>
              <td class="border-b border-slate-100 px-3 py-3"><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{{ asset.category }}</span></td>
              <td class="border-b border-slate-100 px-3 py-3"><div class="flex gap-2"><button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200" @click="detailAsset = asset">Detail</button><button class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200" @click="edit(asset)">Edit</button><button class="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100" @click="deleteAsset = asset">Hapus</button></div></td>
            </tr>
            <tr v-if="filteredAssets().length === 0"><td colspan="5" class="px-3 py-10 text-center text-slate-500">{{ assets.length ? 'Tidak ada aset pada kategori ini.' : 'Belum ada data aset.' }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="detailAsset" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" @click.self="detailAsset = null" @keydown.esc="detailAsset = null">
        <section class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div class="mb-5 flex items-start justify-between"><div><p class="mb-1 text-xs font-extrabold tracking-widest text-emerald-700">INFORMASI ASET</p><h2 id="detail-title" class="text-2xl font-bold">Detail aset</h2></div><button class="grid size-9 place-items-center rounded-full bg-slate-100 text-2xl text-slate-600 hover:bg-slate-200" aria-label="Tutup" @click="detailAsset = null">×</button></div>
          <dl>
            <div class="flex justify-between border-b border-slate-100 py-4"><dt class="text-slate-500">ID aset</dt><dd class="font-semibold">#{{ detailAsset.asset_id }}</dd></div>
            <div class="flex justify-between border-b border-slate-100 py-4"><dt class="text-slate-500">Nama aset</dt><dd class="font-semibold">{{ detailAsset.asset_name }}</dd></div>
            <div class="flex justify-between border-b border-slate-100 py-4"><dt class="text-slate-500">Jumlah stok</dt><dd class="font-semibold">{{ detailAsset.stock_quantity }}</dd></div>
            <div class="flex justify-between py-4"><dt class="text-slate-500">Kategori</dt><dd><span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{{ detailAsset.category }}</span></dd></div>
          </dl>
          <div class="mt-5 flex justify-end"><button class="rounded-lg bg-slate-100 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-200" @click="detailAsset = null">Tutup</button></div>
        </section>
      </div>
      <div v-if="deleteAsset" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" @click.self="deleteAsset = null" @keydown.esc="deleteAsset = null">
        <section class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
          <div class="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-2xl font-extrabold text-red-600">!</div><h2 id="delete-title" class="mt-4 text-2xl font-bold">Hapus aset?</h2>
          <p id="delete-description" class="mx-auto mt-2 max-w-sm leading-relaxed text-slate-500">Aset <strong class="text-slate-800">{{ deleteAsset.asset_name }}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</p>
          <div class="mt-7 flex justify-center gap-3"><button class="rounded-lg bg-slate-100 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-200" @click="deleteAsset = null">Batal</button><button class="rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700" @click="remove">Ya, hapus aset</button></div>
        </section>
      </div>
    </Teleport>
  </main>
</template>

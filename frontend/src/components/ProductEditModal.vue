<template>
    <div class="modal d-block" tabindex="-1" @click.self="close">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <!-- header -->
                <div class="modal-header px-4 py-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="d-flex align-items-center justify-content-center rounded-circle" style="width: 40px; height: 40px; background-color: #fff7ed;">
                            <i class="bi text-orange fs-5" :class="isAdd ? 'bi-box-seam' : 'bi-pencil'"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold mb-0">{{ isAdd ? 'เพิ่มสินค้าใหม่' : `แก้ไขสินค้า ${product.pdId}` }}</h5>
                            <small class="text-secondary">
                                {{ isAdd ? 'Add Product — กรอกข้อมูลให้ครบถ้วน ช่องที่มี * จำเป็นต้องกรอก' : 'Edit Product — แก้ไขข้อมูลแล้วกดบันทึก' }}
                            </small>
                        </div>
                    </div>
                    <button type="button" class="btn-close" @click="close" :disabled="saving"></button>
                </div>

                <div class="modal-body px-4 py-4">
                    <div class="row g-4">
                        <!-- ฟอร์ม -->
                        <div class="col-lg-8">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">รหัสสินค้า (Product ID) <span class="text-danger">*</span></label>
                                    <input v-if="isAdd" type="text" class="form-control custom-input" v-model="form.pdId" maxlength="20" placeholder="เช่น 013">
                                    <template v-else>
                                        <input type="text" class="form-control bg-light text-muted" :value="product.pdId" disabled>
                                        <div class="form-text" style="font-size: 0.75rem;">ไม่สามารถแก้ไขรหัสได้</div>
                                    </template>
                                </div>
                                <div class="col-md-8">
                                    <label class="form-label small fw-bold">ชื่อสินค้า (Product Name) <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control custom-input" v-model="form.pdName" maxlength="255" placeholder="เช่น Nendoroid Hatsune Miku">
                                </div>

                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">ราคา (Price) <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" min="0" step="0.01" class="form-control border-end-0 custom-input" v-model="form.price" placeholder="0">
                                        <span class="input-group-text bg-white text-muted small fw-semibold">THB</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">แบรนด์ (Brand) <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control custom-input" v-model="form.brandName" list="brandOptions" maxlength="100" placeholder="เช่น Good Smile Company">
                                    <!-- แนะนำแบรนด์ที่มีอยู่ ถ้าพิมพ์ชื่อใหม่ backend จะเพิ่มแบรนด์ให้ -->
                                    <datalist id="brandOptions">
                                        <option v-for="b in brands" :key="b.brandId" :value="b.brandName"></option>
                                    </datalist>
                                    <div v-if="isNewBrand" class="form-text text-orange" style="font-size: 0.75rem;">
                                        <i class="bi bi-plus-circle"></i> แบรนด์ใหม่ จะถูกเพิ่มเมื่อบันทึก
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <label class="form-label small fw-bold mb-0">หมวดหมู่ (Category)</label>
                                        <button type="button" class="btn btn-link p-0 text-orange text-decoration-none" style="font-size: 0.75rem;" @click="toggleAddCategory">
                                            {{ isCustomCategory ? 'เลือกจากรายการ' : '+ เพิ่มหมวดหมู่ใหม่' }}
                                        </button>
                                    </div>
                                    <template v-if="isCustomCategory">
                                        <input type="text" class="form-control custom-input" v-model="form.categoryName" list="categoryOptions" maxlength="100" placeholder="พิมพ์ชื่อหมวดหมู่ใหม่...">
                                        <datalist id="categoryOptions">
                                            <option v-for="c in categories" :key="c.categoryId" :value="c.categoryName"></option>
                                        </datalist>
                                        <div v-if="isNewCategory" class="form-text text-orange" style="font-size: 0.75rem;">
                                            <i class="bi bi-plus-circle"></i> หมวดหมู่ใหม่ จะถูกเพิ่มเมื่อบันทึก
                                        </div>
                                    </template>
                                    <template v-else>
                                        <select class="form-select custom-input" v-model="form.categoryId">
                                            <option :value="null">ไม่ระบุหมวดหมู่</option>
                                            <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">{{ c.categoryName }}</option>
                                        </select>
                                    </template>
                                </div>

                                <div class="col-12">
                                    <label class="form-label small fw-bold">รายละเอียดสินค้า (Description)</label>
                                    <textarea class="form-control custom-input" rows="5" v-model="form.description" placeholder="ขนาด วัสดุ อุปกรณ์เสริม และรายละเอียดอื่น ๆ"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- รูปภาพ -->
                        <div class="col-lg-4">
                            <label class="form-label small fw-bold">รูปภาพสินค้า (Image) <span class="text-danger">*</span></label>
                            <div v-if="previewUrl || imageUrl" class="rounded-3 overflow-hidden border mb-3" style="aspect-ratio: 1 / 1; background-color: #f8fafc;">
                                <img :src="previewUrl || imageUrl" class="w-100 h-100 object-fit-cover" alt="Product">
                            </div>
                            <label v-else class="rounded-3 mb-3 d-flex flex-column align-items-center justify-content-center text-muted image-placeholder">
                                <i class="bi bi-image fs-2 mb-2"></i>
                                <span style="font-size: 0.8rem;">ยังไม่มีรูปภาพ</span>
                                <input type="file" class="d-none" accept="image/jpeg, image/png" @change="onFileChange">
                            </label>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <label class="btn btn-sm bg-white border fw-semibold d-flex align-items-center gap-2 px-3" style="border-radius: 8px; cursor: pointer;">
                                    <i class="bi bi-upload"></i> เลือกไฟล์
                                    <input type="file" class="d-none" accept="image/jpeg, image/png" @change="onFileChange">
                                </label>
                                <span class="small text-truncate" :class="file ? 'text-dark fw-semibold' : 'text-muted'">{{ file ? file.name : 'ยังไม่ได้เลือกไฟล์' }}</span>
                            </div>
                            <div class="text-muted" style="font-size: 0.75rem;">รองรับไฟล์ JPG หรือ PNG ขนาดแนะนำ 1:1 (ไม่เกิน 2MB)</div>
                        </div>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger py-2 small mt-4 mb-0">
                        <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
                    </div>
                </div>

                <!-- footer -->
                <div class="modal-footer px-4 py-3" :class="isAdd ? 'justify-content-end' : 'justify-content-between'" style="background-color: #f8fafc; border-radius: 0 0 16px 16px;">
                    <button v-if="!isAdd" type="button" class="btn btn-outline-danger fw-semibold px-3 d-flex align-items-center gap-2" style="border-radius: 8px;" @click="deleteProduct" :disabled="saving">
                        <i class="bi bi-trash3"></i> ลบสินค้า
                    </button>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn bg-white border fw-semibold px-4" style="border-radius: 8px;" @click="close" :disabled="saving">ยกเลิก</button>
                        <button type="button" class="btn btn-orange text-white fw-semibold px-4 d-flex align-items-center gap-2 shadow-sm" style="border-radius: 8px;" @click="save" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
                            <i v-else class="bi bi-floppy"></i> บันทึกข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';

// product = null คือโหมดเพิ่มสินค้าใหม่
const props = defineProps({
    product: { type: Object, default: null },
    categories: { type: Array, default: () => [] },
    imageUrl: { type: String, default: '' },
})
const emit = defineEmits(['close', 'saved', 'deleted'])

const isAdd = computed(() => !props.product)

const brands = ref([])
const isCustomCategory = ref(false)
const form = ref({
    pdId: '',
    pdName: props.product?.pdName || '',
    price: props.product ? Number(props.product.price) : '',
    brandName: props.product?.brand?.brandName || '',
    categoryId: props.product ? props.product.categoryId : (props.categories[0]?.categoryId ?? null),
    categoryName: '',
    description: props.product?.description || '',
})

const toggleAddCategory = () => {
    isCustomCategory.value = !isCustomCategory.value
    if (!isCustomCategory.value) {
        form.value.categoryName = ''
    }
}

const isNewCategory = computed(() => {
    const name = form.value.categoryName.trim().toLowerCase()
    return !!name && props.categories.length > 0 && !props.categories.some(c => c.categoryName.toLowerCase() === name)
})
const file = ref(null)
const previewUrl = ref(null)
const saving = ref(false)
const errorMessage = ref(null)

const isNewBrand = computed(() => {
    const name = form.value.brandName.trim().toLowerCase()
    return !!name && brands.value.length > 0 && !brands.value.some(b => b.brandName.toLowerCase() === name)
})

onMounted(async () => {
    await axios.get(`http://localhost:3000/brands`)
        .then((res) => { brands.value = res.data })
        .catch(err => console.log(err.message))

    // เสนอรหัสถัดไป เช่น 012 → 013
    if (isAdd.value) {
        await axios.get(`http://localhost:3000/products`)
            .then((res) => {
                const maxId = Math.max(0, ...res.data.map(p => parseInt(p.pdId, 10)).filter(n => !isNaN(n)))
                form.value.pdId = String(maxId + 1).padStart(3, '0')
            })
            .catch(err => console.log(err.message))
    }
})

onUnmounted(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const close = () => {
    if (!saving.value) emit('close')
}

// เลือกไฟล์แล้วแสดงตัวอย่างก่อน อัปโหลดจริงตอนกดบันทึก
const onFileChange = (e) => {
    const f = e.target.files[0]
    errorMessage.value = null
    if (!f) return
    if (!['image/jpeg', 'image/png'].includes(f.type) || f.size > 2 * 1024 * 1024) {
        errorMessage.value = "รองรับเฉพาะไฟล์ JPG หรือ PNG ขนาดไม่เกิน 2MB"
        e.target.value = ''
        return
    }
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    file.value = f
    previewUrl.value = URL.createObjectURL(f)
    e.target.value = '' // ให้เลือกไฟล์เดิมซ้ำได้
}

const save = async () => {
    if ((isAdd.value && !form.value.pdId.trim()) || !form.value.pdName.trim() || form.value.price === ''
        || Number(form.value.price) < 0 || !form.value.brandName.trim()) {
        errorMessage.value = isAdd.value
            ? "กรุณากรอกรหัสสินค้า ชื่อสินค้า ราคา และแบรนด์ให้ครบ"
            : "กรุณากรอกชื่อสินค้า ราคา และแบรนด์ให้ครบ"
        return
    }
    if (isAdd.value && !file.value) {
        errorMessage.value = "กรุณาเลือกรูปภาพสินค้า"
        return
    }

    saving.value = true
    errorMessage.value = null
    const pdId = isAdd.value ? form.value.pdId.trim() : props.product.pdId
    const body = {
        ...form.value,
        pdId,
        pdName: form.value.pdName.trim(),
        brandName: form.value.brandName.trim(),
        categoryName: isCustomCategory.value ? form.value.categoryName.trim() : '',
        categoryId: isCustomCategory.value ? null : form.value.categoryId,
    }
    try {
        if (isAdd.value) {
            await axios.post(`http://localhost:3000/products`, body)
        } else {
            await axios.put(`http://localhost:3000/products/${pdId}`, body)
        }
        if (file.value) {
            const formData = new FormData()
            formData.append('file', file.value)
            await axios.post(`http://localhost:3000/products/${pdId}/image`, formData)
        }
        // ดึงข้อมูลใหม่ (มี brand / category แบบเต็ม) ส่งกลับให้หน้าที่เรียก
        const res = await axios.get(`http://localhost:3000/products/${pdId}`)
        emit('saved', res.data, !!file.value, isAdd.value)
    }
    catch (err) {
        errorMessage.value = err.response?.data?.message || "บันทึกข้อมูลไม่สำเร็จ"
    }
    finally {
        saving.value = false
    }
}

const deleteProduct = async () => {
    if (!confirm(`ยืนยันลบสินค้า ${props.product.pdName}?`)) return
    saving.value = true
    errorMessage.value = null
    try {
        await axios.delete(`http://localhost:3000/products/${props.product.pdId}`)
        emit('deleted', props.product.pdId)
    }
    catch (err) {
        errorMessage.value = err.response?.data?.message || "ลบสินค้าไม่สำเร็จ"
    }
    finally {
        saving.value = false
    }
}
</script>

<style scoped>
.text-orange {
  color: #f97316;
}

.btn-orange {
  background-color: #f97316;
  border-color: #f97316;
}

.btn-orange:hover {
  background-color: #ea580c;
  border-color: #ea580c;
}

.custom-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 0.2rem rgba(249, 115, 22, 0.2);
}

.image-placeholder {
  aspect-ratio: 1 / 1;
  border: 1.5px dashed #cbd5e1;
  background-color: #f8fafc;
  cursor: pointer;
}

.image-placeholder:hover {
  border-color: #f97316;
}
</style>

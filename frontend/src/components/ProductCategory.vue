<template>
    <div class="modal d-block modal-overlay" tabindex="-1" @click.self="close">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 460px;">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                <!-- Header -->
                <div class="modal-header px-4 pt-4 pb-3 border-bottom">
                    <h5 class="fw-bold mb-0 text-dark" style="font-size: 1.15rem;">จัดการหมวดหมู่สินค้า</h5>
                    <button type="button" class="btn-close" @click="close" :disabled="submitting"></button>
                </div>

                <!-- Body -->
                <div class="modal-body px-4 py-3">
                    <!-- ข้อความแจ้งเตือน / Error -->
                    <div v-if="errorMessage" class="alert alert-danger py-2 px-3 small mb-3 d-flex justify-content-between align-items-center" style="border-radius: 8px;">
                        <span>{{ errorMessage }}</span>
                        <button type="button" class="btn-close btn-close-sm" style="font-size: 0.65rem;" @click="errorMessage = ''"></button>
                    </div>
                    <div v-if="successMessage" class="alert alert-success py-2 px-3 small mb-3 d-flex justify-content-between align-items-center" style="border-radius: 8px;">
                        <span>{{ successMessage }}</span>
                        <button type="button" class="btn-close btn-close-sm" style="font-size: 0.65rem;" @click="successMessage = ''"></button>
                    </div>

                    <!-- เพิ่มหมวดหมู่ใหม่ -->
                    <div class="d-flex gap-2 mb-3">
                        <input type="text"
                               class="form-control category-input"
                               placeholder="ชื่อหมวดหมู่ใหม่..."
                               v-model="newCategoryName"
                               maxlength="100"
                               @keyup.enter="handleAddCategory"
                               :disabled="submitting" />
                        <button type="button"
                                class="btn btn-orange text-white fw-semibold px-3 d-flex align-items-center gap-1 flex-shrink-0"
                                style="border-radius: 8px; font-size: 0.9rem;"
                                @click="handleAddCategory"
                                :disabled="submitting || !newCategoryName.trim()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                            </svg>
                            เพิ่ม
                        </button>
                    </div>

                    <!-- รายการหมวดหมู่ -->
                    <div class="category-list">
                        <div v-if="categories.length === 0" class="text-center text-muted py-4 small">
                            ยังไม่มีหมวดหมู่สินค้า
                        </div>
                        <div v-for="cat in categories"
                             :key="cat.categoryId"
                             class="category-item d-flex align-items-center justify-content-between py-2 border-bottom">
                            
                            <!-- โหมดแสดงผลปกติ -->
                            <template v-if="editingId !== cat.categoryId">
                                <span class="category-name text-dark fw-normal" style="font-size: 0.95rem;">
                                    {{ cat.categoryName }}
                                </span>
                                <div class="d-flex align-items-center gap-1 flex-shrink-0">
                                    <button type="button"
                                            class="btn btn-sm btn-edit-cat"
                                            @click="startEdit(cat)"
                                            :disabled="submitting">
                                        แก้ไข
                                    </button>
                                    <button type="button"
                                            class="btn btn-sm btn-delete-cat"
                                            @click="handleDelete(cat)"
                                            :disabled="submitting">
                                        ลบ
                                    </button>
                                </div>
                            </template>

                            <!-- โหมดแก้ไขชื่อ -->
                            <template v-else>
                                <div class="d-flex align-items-center gap-2 w-100">
                                    <input type="text"
                                           class="form-control form-control-sm category-input flex-grow-1"
                                           v-model="editingName"
                                           maxlength="100"
                                           @keyup.enter="handleSaveEdit(cat)"
                                           @keyup.esc="cancelEdit"
                                           :disabled="submitting"
                                           ref="editInputRef" />
                                    <button type="button"
                                            class="btn btn-sm btn-save-cat"
                                            @click="handleSaveEdit(cat)"
                                            :disabled="submitting || !editingName.trim()">
                                        บันทึก
                                    </button>
                                    <button type="button"
                                            class="btn btn-sm btn-cancel-cat"
                                            @click="cancelEdit"
                                            :disabled="submitting">
                                        ยกเลิก
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer px-4 pb-4 pt-3 border-top">
                    <button type="button"
                            class="btn btn-close-modal px-4 py-2"
                            @click="close"
                            :disabled="submitting">
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
    categories: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'updated']);

const newCategoryName = ref('');
const editingId = ref(null);
const editingName = ref('');
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const editInputRef = ref(null);

const close = () => {
    emit('close');
};

const handleAddCategory = async () => {
    const name = newCategoryName.value.trim();
    if (!name) return;

    errorMessage.value = '';
    successMessage.value = '';
    submitting.value = true;

    try {
        await axios.post('http://localhost:3000/categories', { categoryName: name });
        newCategoryName.value = '';
        successMessage.value = `เพิ่มหมวดหมู่ "${name}" เรียบร้อยแล้ว`;
        emit('updated');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'ไม่สามารถเพิ่มหมวดหมู่ได้';
    } finally {
        submitting.value = false;
    }
};

const startEdit = (cat) => {
    errorMessage.value = '';
    successMessage.value = '';
    editingId.value = cat.categoryId;
    editingName.value = cat.categoryName;
    nextTick(() => {
        if (Array.isArray(editInputRef.value)) {
            editInputRef.value[0]?.focus();
        } else {
            editInputRef.value?.focus();
        }
    });
};

const cancelEdit = () => {
    editingId.value = null;
    editingName.value = '';
};

const handleSaveEdit = async (cat) => {
    const name = editingName.value.trim();
    if (!name) {
        errorMessage.value = 'กรุณาระบุชื่อหมวดหมู่';
        return;
    }
    if (name === cat.categoryName) {
        cancelEdit();
        return;
    }

    errorMessage.value = '';
    successMessage.value = '';
    submitting.value = true;

    try {
        await axios.put(`http://localhost:3000/categories/${cat.categoryId}`, { categoryName: name });
        successMessage.value = `แก้ไขหมวดหมู่เป็น "${name}" เรียบร้อยแล้ว`;
        editingId.value = null;
        editingName.value = '';
        emit('updated');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้';
    } finally {
        submitting.value = false;
    }
};

const handleDelete = async (cat) => {
    if (!confirm(`คุณต้องการลบหมวดหมู่ "${cat.categoryName}" หรือไม่?`)) {
        return;
    }

    errorMessage.value = '';
    successMessage.value = '';
    submitting.value = true;

    try {
        await axios.delete(`http://localhost:3000/categories/${cat.categoryId}`);
        successMessage.value = `ลบหมวดหมู่ "${cat.categoryName}" เรียบร้อยแล้ว`;
        emit('updated');
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'ไม่สามารถลบหมวดหมู่นี้ได้';
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.modal-overlay {
    background-color: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
}

.category-input {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 0.85rem;
    font-size: 0.95rem;
}

.category-input:focus {
    border-color: #f97316;
    box-shadow: 0 0 0 0.2rem rgba(249, 115, 22, 0.15);
}

.btn-orange {
    background-color: #f97316;
    border: 1px solid #f97316;
    transition: all 0.2s ease;
}

.btn-orange:hover:not(:disabled) {
    background-color: #ea580c;
    border-color: #ea580c;
}

.category-list {
    max-height: 280px;
    overflow-y: auto;
}

.category-item {
    border-color: #f1f5f9 !important;
}

.category-item:last-child {
    border-bottom: none !important;
}

.btn-edit-cat {
    background-color: #eff6ff;
    color: #334155;
    border: none;
    border-radius: 6px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s ease;
}

.btn-edit-cat:hover:not(:disabled) {
    background-color: #dbeafe;
    color: #1e40af;
}

.btn-delete-cat {
    background-color: #fee2e2;
    color: #dc2626;
    border: none;
    border-radius: 6px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s ease;
}

.btn-delete-cat:hover:not(:disabled) {
    background-color: #fecaca;
    color: #b91c1c;
}

.btn-save-cat {
    background-color: #f97316;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 0.25rem 0.65rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.btn-save-cat:hover:not(:disabled) {
    background-color: #ea580c;
}

.btn-cancel-cat {
    background-color: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 6px;
    padding: 0.25rem 0.65rem;
    font-size: 0.85rem;
    font-weight: 500;
}

.btn-cancel-cat:hover:not(:disabled) {
    background-color: #e2e8f0;
}

.btn-close-modal {
    background-color: #ffffff;
    color: #1e293b;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.15s ease;
}

.btn-close-modal:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #94a3b8;
}
</style>

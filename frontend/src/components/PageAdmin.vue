<template>
    <div class="container mt-4 mb-5" v-if="dutyId === 'admin'">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-shield-check text-primary"></i>
                    <span class="text-primary fw-bold" style="font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;">Admin Backoffice</span>
                </div>
                <h2 class="fw-bold mb-2">ระบบจัดการหลังร้าน</h2>
                <p class="text-secondary" style="font-size: 0.95rem;">
                    จัดการบัญชีสมาชิก และตรวจสอบคำสั่งซื้อทั้งหมดในระบบ
                </p>
            </div>
            <div>
                <button class="btn btn-white border shadow-sm fw-semibold d-flex align-items-center gap-2" style="border-radius: 8px;" @click="router.push('/product')">
                    <i class="bi bi-box-seam"></i> จัดการสินค้า ({{ productCount }})
                </button>
            </div>
        </div>

        <div class="row g-3 mb-5">
            <div class="col-xl-3 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="text-secondary fw-semibold" style="font-size: 0.9rem;">สมาชิกทั้งหมด</span>
                        <div class="bg-light rounded p-2 text-secondary d-flex align-items-center justify-content-center">
                            <i class="bi bi-people fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold text-dark mb-1">{{ members.length }}</h3>
                    <p class="text-secondary mb-0" style="font-size: 0.8rem;">Admin {{ adminCount }} บัญชี</p>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="text-secondary fw-semibold" style="font-size: 0.9rem;">บัญชีที่ใช้งานอยู่</span>
                        <div class="bg-light rounded p-2 text-secondary d-flex align-items-center justify-content-center">
                            <i class="bi bi-person-check fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold text-dark mb-2">{{ activeCount }}</h3>
                    <div>
                        <span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-1 rounded-pill fw-semibold" style="font-size: 0.75rem;">
                        {{ suspendedCount }} Suspended
                    </span>
                    </div>
                </div>
            </div>
            <!-- คำสั่งซื้อ -->
            <div class="col-xl-3 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="text-secondary fw-semibold" style="font-size: 0.9rem;">คำสั่งซื้อทั้งหมด</span>
                        <div class="bg-light rounded p-2 text-secondary d-flex align-items-center justify-content-center">
                            <i class="bi bi-clipboard-data fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold text-dark mb-1">{{ orders.length }}</h3>
                    <p class="text-secondary mb-0" style="font-size: 0.8rem;">รอยืนยัน {{ pendingCount }} รายการ</p>
                </div>
            </div>
            <div class="col-xl-3 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="text-secondary fw-semibold" style="font-size: 0.9rem;">ยอดขายที่ยืนยันแล้ว</span>
                        <div class="bg-light rounded p-2 text-secondary d-flex align-items-center justify-content-center">
                            <i class="bi bi-wallet2 fs-5"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold text-dark mb-1">{{ confirmedSales.toLocaleString() }} <span class="fs-5">บาท</span></h3>
                    <p class="text-secondary mb-0" style="font-size: 0.8rem;">ยืนยันแล้ว + จัดส่งแล้ว</p>
                </div>
            </div>
        </div>

        <!-- Member -->
        <div class="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h4 class="fw-bold mb-1">รายชื่อสมาชิก (Member List)</h4>
                <p class="text-secondary mb-0" style="font-size: 0.85rem;">
                    สมาชิกทั้งหมด {{ members.length }} บัญชี · เปลี่ยนสถานะการใช้งานหรือสลับสิทธิ์ผู้ใช้ได้จากตารางนี้
                </p>
            </div>
            <div class="input-group" style="width: 280px;">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 ps-0" :class="{ 'border-end-0': memberSearch }" placeholder="ค้นหาชื่อ อีเมล หรือรหัสสมาชิก" v-model="memberSearch">
                <span class="input-group-text bg-white border-start-0" style="cursor: pointer;" v-if="memberSearch" @click="memberSearch = ''">
                    <i class="bi bi-x-lg text-secondary"></i>
                </span>
            </div>
        </div>
        <div v-if="actionError" class="alert alert-danger py-2 small d-flex justify-content-between align-items-center">
            <span><i class="bi bi-exclamation-triangle-fill me-1"></i> {{ actionError }}</span>
            <button type="button" class="btn-close btn-sm" @click="actionError = null"></button>
        </div>

        <!-- กล่องยืนยัน -->
        <template v-if="confirmBox">
            <div class="modal d-block" tabindex="-1" @click.self="answerConfirm(false)">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                        <div class="modal-body p-4">
                            <h5 class="fw-bold mb-2">{{ confirmBox.title }}</h5>
                            <p class="text-secondary mb-0">{{ confirmBox.message }}</p>
                        </div>
                        <div class="modal-footer border-0 px-4 pb-4 pt-0">
                            <button type="button" class="btn bg-white border fw-semibold px-4" style="border-radius: 8px;" @click="answerConfirm(false)">ยกเลิก</button>
                            <button type="button" class="btn btn-primary fw-semibold px-4" style="border-radius: 8px;" @click="answerConfirm(true)">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </template>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="min-width: 1000px;">
                    <thead class="bg-light text-secondary" style="font-size: 0.85rem;">
                        <tr>
                            <th class="fw-semibold py-3 ps-4 border-bottom-0" style="width: 10%;">Member ID</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 8%;">Profile</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 20%;">Name</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 20%;">Email</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0" style="width: 10%;">Role</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0" style="width: 12%;">Status</th>
                            <th class="fw-semibold py-3 text-end pe-4 border-bottom-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredMembers.length === 0">
                            <td colspan="7" class="text-center py-5 text-secondary">
                                <i class="bi bi-search fs-3 mb-2 d-block"></i>
                                ไม่พบสมาชิกที่ตรงกับ "{{ memberSearch }}"
                            </td>
                        </tr>
                        <tr v-for="mem in filteredMembers" :key="mem.memId">
                            <td class="ps-4 fw-semibold text-secondary font-monospace" style="font-size: 0.85rem;">{{ mem.formattedId }}</td>
                            <td>
                                <img :src="memberAvatar(mem.memId)"
                                     @error="$event.target.onerror = null; $event.target.src='http://localhost:3000/img_mem/default.jpg'"
                                     alt="avatar" 
                                     class="rounded-circle object-fit-cover shadow-sm" 
                                     style="width: 40px; height: 40px;">
                            </td>
                            <td class="fw-semibold text-dark">
    {{ mem.name }}
    <span v-if="mem.memId === authStore.user?.id" class="text-secondary fw-normal ms-1" style="font-size: 0.8rem;">(คุณ)</span>
    <span v-else-if="mem.nickname" class="text-muted fw-normal ms-1" style="font-size: 0.8rem;">({{ mem.nickname }})</span>
</td>
                            <td class="text-secondary">{{ mem.email }}</td>
                            <td class="text-center">
                                <span v-if="mem.role === 'admin'" class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill fw-normal d-inline-flex align-items-center gap-1">
                                    <i class="bi bi-shield-check"></i> Admin
                                </span>
                                <span v-else class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-1 rounded-pill fw-normal d-inline-flex align-items-center gap-1">
                                    <i class="bi bi-person"></i> Member
                                </span>
                            </td>
                            <td class="text-center">
                                <span v-if="mem.status === 'Active'" class="text-emerald fw-semibold d-inline-flex align-items-center gap-2" style="font-size: 0.82rem;">
                                    <span class="status-dot dot-active"></span> Active
                                </span>
                                <span v-else class="text-rose fw-semibold d-inline-flex align-items-center gap-2" style="font-size: 0.82rem;">
                                    <span class="status-dot dot-suspended"></span> Suspended
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <div class="d-flex justify-content-end align-items-center gap-2">
                                    <button class="btn btn-sm btn-action-status fw-semibold rounded-2 px-2 py-1 d-inline-flex align-items-center gap-1"
                                            :disabled="!canChangeStatus(mem) || busyId === mem.memId"
                                            @click="toggleStatus(mem)">
                                        <i class="bi bi-arrow-repeat"></i> เปลี่ยนสถานะ
                                    </button>
                                    <button class="btn btn-sm btn-action-role fw-semibold rounded-2 px-2 py-1 d-inline-flex align-items-center gap-1"
                                            :disabled="!canChangeRole(mem) || busyId === mem.memId"
                                            @click="toggleRole(mem)">
                                        <i class="bi bi-arrow-left-right"></i> สลับ Role
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <hr class="text-muted opacity-25 mb-5">
        <!-- Orders -->
        <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h4 class="fw-bold mb-1">คำสั่งซื้อทั้งหมด (All Orders Inspector)</h4>
                <p class="text-secondary mb-0" style="font-size: 0.85rem;">
                    ประวัติการสั่งซื้อของสมาชิกทุกคน {{ filteredOrders.length }} รายการ
                </p>
            </div>
            
            <div style="width: 200px;">
                <select class="form-select text-secondary bg-light border-0 shadow-sm" v-model="filterStatus">
                    <option value="all">ทุกสถานะ</option>
                    <option value="รอยืนยัน">รอยืนยัน</option>
                    <option value="ยืนยันแล้ว">ยืนยันแล้ว</option>
                    <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                </select>
            </div>
        </div>
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="min-width: 1000px;">
                    <thead class="bg-light text-secondary" style="font-size: 0.85rem;">
                        <tr>
                            <th class="fw-semibold py-3 ps-4 border-bottom-0" style="width: 15%;">Order ID</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 25%;">Member</th>
                            <th class="fw-semibold py-3 border-bottom-0">Order Date</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0">Total Items</th>
                            <th class="fw-semibold py-3 text-end border-bottom-0">Total Amount</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0">Status</th>
                            <th class="fw-semibold py-3 text-center pe-4 border-bottom-0">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(order, index) in filteredOrders" :key="order.orderId">
                            <td class="ps-4 fw-semibold text-dark">{{ order.orderId }}</td>
                            <td>
                                <div class="d-flex align-items-center gap-3">
                                    <img :src="memberAvatar(order.userId)"
                                         @error="$event.target.onerror = null; $event.target.src='http://localhost:3000/img_mem/default.jpg'"
                                         alt="avatar" 
                                         class="rounded-circle object-fit-cover shadow-sm" 
                                         style="width: 40px; height: 40px;">
                                    <div class="d-flex flex-column">
                                        <span class="fw-bold text-dark" style="font-size: 0.9rem;">{{ order.memName }}</span>
                                        <span class="text-secondary" style="font-size: 0.75rem;">{{ order.memId }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-secondary">{{ order.orderDate }}</td>
                            <td class="text-center text-secondary">{{ order.totalItems }} ชิ้น</td>
                            <td class="text-end fw-bold text-dark">{{ order.totalAmount.toLocaleString() }} บาท</td>
                            <td class="text-center">                         
                                <span v-if="order.status === 'รอยืนยัน'" class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill fw-normal d-inline-flex align-items-center gap-1">
                                    <i class="bi bi-clock"></i> รอยืนยัน
                                </span>                                
                                <span v-else-if="order.status === 'ยืนยันแล้ว'" class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-normal d-inline-flex align-items-center gap-1">
                                    <i class="bi bi-check-circle"></i> ยืนยันแล้ว
                                </span>
                                <span v-else-if="order.status === 'จัดส่งแล้ว'" class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-normal d-inline-flex align-items-center gap-1">
                                    <i class="bi bi-truck"></i> จัดส่งแล้ว
                                </span>
                            </td>
                            <td class="text-center pe-4">
                                <button class="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3 d-inline-flex align-items-center gap-1" style="font-size: 0.8rem;" @click="viewDetail(order)">
                                    <i class="bi bi-eye"></i> ดูรายการสินค้า
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredOrders.length === 0" class="text-center py-5 text-secondary">
                    <i class="bi bi-inbox fs-1 mb-2 d-block"></i>
                    ไม่มีรายการคำสั่งซื้อในสถานะนี้
                </div>
            </div>
        </div>

        <!-- Modal รายการสินค้าในคำสั่งซื้อ -->
        <template v-if="detailOrder">
            <div class="modal d-block" tabindex="-1" @click.self="closeDetail">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow" style="border-radius: 16px;">
                        <div class="modal-header px-4 py-3">
                            <div class="d-flex align-items-center gap-3">
                                <div class="d-flex align-items-center justify-content-center rounded-circle" style="width: 40px; height: 40px; background-color: #eff6ff;">
                                    <i class="bi bi-file-text text-primary fs-5"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0">รายการสินค้าในคำสั่งซื้อ</h5>
                                    <small class="text-secondary">Order Items · เลขที่ {{ detailOrder.orderId }}</small>
                                </div>
                            </div>
                            <button type="button" class="btn-close" @click="closeDetail"></button>
                        </div>

                        <div class="modal-body px-4">
                            <div class="row g-0 border rounded-3 p-3 mb-3" style="background-color: #f8fafc;">
                                <div class="col-md-5">
                                    <div class="text-secondary mb-2" style="font-size: 0.75rem;">สมาชิก</div>
                                    <div class="d-flex align-items-center gap-2">
                                        <img :src="memberAvatar(detailOrder.userId)" @error="$event.target.onerror = null; $event.target.src='http://localhost:3000/img_mem/default.jpg'" alt="" class="rounded-circle object-fit-cover" width="32" height="32">
                                        <div class="lh-sm">
                                            <div class="fw-semibold" style="font-size: 0.9rem;">{{ detailOrder.memName }}</div>
                                            <div class="text-secondary" style="font-size: 0.75rem; font-family: monospace;">{{ detailOrder.memId }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="text-secondary mb-2" style="font-size: 0.75rem;">สั่งซื้อวันที่</div>
                                    <div class="fw-bold">{{ detailOrder.orderDate }}</div>
                                </div>
                                <div class="col-md-3">
                                    <div class="text-secondary mb-2" style="font-size: 0.75rem;">สถานะ</div>
                                    <span v-if="detailOrder.status === 'รอยืนยัน'" class="badge rounded-pill bg-warning bg-opacity-10 border border-warning text-warning-emphasis px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                                        <i class="bi bi-clock"></i> รอยืนยัน
                                    </span>
                                    <span v-else-if="detailOrder.status === 'ยืนยันแล้ว'" class="badge rounded-pill bg-success bg-opacity-10 border border-success text-success px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                                        <i class="bi bi-check-circle"></i> ยืนยันแล้ว
                                    </span>
                                    <span v-else class="badge rounded-pill bg-primary bg-opacity-10 border border-primary text-primary px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                                        <i class="bi bi-truck"></i> จัดส่งแล้ว
                                    </span>
                                </div>
                            </div>

                            <div class="border rounded-3 overflow-hidden mb-3">
                                <table class="table mb-0 align-middle detail-table">
                                    <thead>
                                        <tr class="text-secondary" style="font-size: 0.8rem;">
                                            <th class="py-3 px-3 fw-semibold">No.</th>
                                            <th class="py-3 px-3 fw-semibold">Product ID</th>
                                            <th class="py-3 px-3 fw-semibold">Product Name</th>
                                            <th class="py-3 px-3 fw-semibold text-end">Unit Price</th>
                                            <th class="py-3 px-3 fw-semibold text-center">Quantity</th>
                                            <th class="py-3 px-3 fw-semibold text-end">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="detailLoading">
                                            <td colspan="6" class="text-center py-4 text-muted">
                                                <span class="spinner-border spinner-border-sm me-2"></span> กำลังโหลด...
                                            </td>
                                        </tr>
                                        <tr v-else v-for="(item, index) in detailItems" :key="item.pdId">
                                            <td class="py-3 px-3 text-muted">{{ item.row_number || (index + 1) }}</td>
                                            <td class="py-3 px-3 text-muted" style="font-family: monospace;">{{ String(item.pdId).padStart(3, '0') }}</td>
                                            <td class="py-3 px-3 fw-semibold text-dark">{{ item.pdName }}</td>
                                            <td class="py-3 px-3 text-end">{{ Number(item.price).toLocaleString() }}</td>
                                            <td class="py-3 px-3 text-center">{{ item.qty }}</td>
                                            <td class="py-3 px-3 text-end fw-bold text-dark">{{ Number(item.subtotal).toLocaleString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="text-end text-secondary">
                                จำนวนสินค้า <span class="fw-bold text-dark fs-5">{{ detailOrder.totalItems }}</span> ชิ้น,
                                ยอดเงิน <span class="fw-bold text-dark fs-4">{{ detailOrder.totalAmount.toLocaleString() }}</span> บาท
                            </div>
                        </div>

                        <div class="modal-footer px-4 py-3" style="background-color: #f8fafc; border-radius: 0 0 16px 16px;">
                            <button type="button" class="btn btn-light border fw-semibold px-3" style="border-radius: 8px;" @click="closeDetail">ปิด</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-backdrop fade show"></div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const dutyId = ref(null);
const orders = ref([]);
const members = ref([]);
const filterStatus = ref('all');
const productCount = ref(0);

onMounted(async () => {
    await checkAdminDuty();
    if (dutyId.value === 'admin') {
        await fetchAllMembers();
        await fetchAllOrders();
        await fetchProductCount();
    }
});

// จำนวนสินค้าทั้งหมดในร้าน สำหรับปุ่ม "จัดการสินค้า"
const fetchProductCount = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/products`);
        productCount.value = res.data.length;
    } catch (err) {
        console.log(err.message);
    }
};

const checkAdminDuty = async () => {
    const user = await authStore.fetchMe();
    if (user) {
        dutyId.value = user.role;
        if(dutyId.value !== 'admin'){
            router.push('/')
        }
    } else {
        router.push('/login');
    }
};

const fetchAllMembers = async () => {
    try {
        // ดึงสมาชิกจริงจาก backend (ต้องเป็น admin) แล้วแปลงให้ตรงกับที่หน้าจอใช้
        const res = await axios.get(`http://localhost:3000/admin/users`);
        members.value = res.data.map(u => ({
            memId: u.id,
            formattedId: `M${String(u.id).padStart(3, '0')}`,
            name: u.name,
            email: u.email,
            role: u.role === 'admin' ? 'admin' : 'member',
            status: u.status === 'suspended' ? 'Suspended' : 'Active'
        }));
    } catch (err) {
        console.log(err.message);
    }
};

const formattedDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// สถานะจากคอลัมน์ใน carts: cartSend → จัดส่งแล้ว, cartCf → ยืนยันแล้ว, นอกนั้น รอยืนยัน
const orderStatus = (o) => o.cartSend ? 'จัดส่งแล้ว' : (o.cartCf ? 'ยืนยันแล้ว' : 'รอยืนยัน');

const fetchAllOrders = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/admin/orders`);
        orders.value = res.data.map(o => ({
            orderId: o.cartId,
            userId: o.userId,
            memName: o.userName,
            memId: `M${String(o.userId).padStart(3, '0')}`,
            orderDate: formattedDate(o.cartDate),
            totalItems: Number(o.total_items),
            totalAmount: Number(o.total_amount),
            status: orderStatus(o),
        }));
    } catch (err) {
        console.log(err.message);
    }
};

// รูปโปรไฟล์ img_mem/<userId>.jpg (ถ้าไม่มีจะ fallback เป็น default.jpg ใน @error)
const pageVersion = Date.now();
const memberAvatar = (userId) => `http://localhost:3000/img_mem/${userId}.jpg?v=${pageVersion}`;

// เปลี่ยนสถานะ / สลับ Role
const MAIN_ADMIN_EMAIL = 'admin@model.store';
const busyId = ref(null);
const actionError = ref(null);
const isMainAdmin = computed(() => authStore.user?.email === MAIN_ADMIN_EMAIL);

// ทุกคนยกเว้นตัวเองและ admin หลัก
const canChangeStatus = (mem) => mem.memId !== authStore.user?.id && mem.email !== MAIN_ADMIN_EMAIL;
// เฉพาะ admin หลักเห็นปุ่มนี้
const canChangeRole = (mem) => isMainAdmin.value && canChangeStatus(mem);

// กล่องยืนยันในหน้าเว็บ (ใช้แทน confirm() ที่เบราว์เซอร์บล็อกได้เมื่อเปิดซ้ำหลายครั้ง)
const confirmBox = ref(null); // { title, message, resolve }
const askConfirm = (title, message) => new Promise(resolve => {
    confirmBox.value = { title, message, resolve };
});
const answerConfirm = (ok) => {
    confirmBox.value?.resolve(ok);
    confirmBox.value = null;
};

const toggleStatus = async (mem) => {
    const next = mem.status === 'Active' ? 'suspended' : 'active';
    const label = next === 'suspended' ? 'ระงับการใช้งาน (Suspended)' : 'เปิดใช้งาน (Active)';
    if (!await askConfirm('เปลี่ยนสถานะ', `ยืนยันเปลี่ยนสถานะของ ${mem.name} เป็น ${label}?`)) return;
    busyId.value = mem.memId;
    actionError.value = null;
    try {
        const res = await axios.patch(`http://localhost:3000/admin/users/${mem.memId}/status`, { status: next });
        mem.status = res.data.status === 'suspended' ? 'Suspended' : 'Active';
    } catch (err) {
        actionError.value = err.response?.data?.message || 'เปลี่ยนสถานะไม่สำเร็จ';
    } finally {
        busyId.value = null;
    }
};

const toggleRole = async (mem) => {
    const next = mem.role === 'admin' ? 'user' : 'admin';
    const label = next === 'admin' ? 'Admin' : 'Member';
    if (!await askConfirm('สลับ Role', `ยืนยันเปลี่ยน role ของ ${mem.name} เป็น ${label}?`)) return;
    busyId.value = mem.memId;
    actionError.value = null;
    try {
        const res = await axios.patch(`http://localhost:3000/admin/users/${mem.memId}/role`, { role: next });
        mem.role = res.data.role === 'admin' ? 'admin' : 'member';
    } catch (err) {
        actionError.value = err.response?.data?.message || 'สลับ Role ไม่สำเร็จ';
    } finally {
        busyId.value = null;
    }
};

// ค้นหาสมาชิก (พิมพ์แล้วกรองทันที) จากชื่อ อีเมล หรือรหัสสมาชิก
const memberSearch = ref('');
const filteredMembers = computed(() => {
    const q = memberSearch.value.trim().toLowerCase();
    if (!q) return members.value;
    return members.value.filter(m =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        String(m.memId).toLowerCase().includes(q)
    );
});

// ตัวเลขในการ์ดสรุป
const adminCount = computed(() => members.value.filter(m => m.role === 'admin').length);
const activeCount = computed(() => members.value.filter(m => m.status === 'Active').length);
const suspendedCount = computed(() => members.value.filter(m => m.status === 'Suspended').length);
const pendingCount = computed(() => orders.value.filter(o => o.status === 'รอยืนยัน').length);
const confirmedSales = computed(() => orders.value
    .filter(o => o.status === 'ยืนยันแล้ว' || o.status === 'จัดส่งแล้ว')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0));

const filteredOrders = computed(() => {
    if (filterStatus.value === 'all') {
        return orders.value;
    }
    return orders.value.filter(order => order.status === filterStatus.value);
});

// Modal รายการสินค้าในคำสั่งซื้อ
const detailOrder = ref(null);
const detailItems = ref([]);
const detailLoading = ref(false);

const viewDetail = async (order) => {
    detailOrder.value = order;
    detailItems.value = [];
    detailLoading.value = true;
    try {
        const res = await axios.get(`http://localhost:3000/carts/getcartdtl/${order.orderId}`);
        detailItems.value = res.data;
    } catch (err) {
        console.error(err);
    } finally {
        detailLoading.value = false;
    }
};

const closeDetail = () => {
    detailOrder.value = null;
};
</script>

<style scoped>
.detail-table th {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}
.text-warning-emphasis {
    color: #b45309 !important;
}
.table-hover tbody tr:hover {
    background-color: #f8fafc;
}
td {
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9;
}
.btn-outline-primary {
    color: #3b82f6;
    border-color: #bfdbfe;
    background-color: #eff6ff;
}
.btn-outline-primary:hover {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
}
.btn-outline-warning {
    color: #b45309;
    border-color: #fde68a;
    background-color: #fffbeb;
}
.btn-outline-warning:hover {
    background-color: #fbbf24;
    color: #78350f !important;
    border-color: #fbbf24;
}
.form-select:focus, .form-control:focus {
    box-shadow: none;
    border: 1px solid #cbd5e1 !important;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
}
.dot-active {
    background-color: #10b981;
}
.dot-suspended {
    background-color: #ef4444;
}
.text-emerald {
    color: #10b981 !important;
}
.text-rose {
    color: #ef4444 !important;
}

.btn-action-status {
    color: #2563eb;
    border: 1px solid #bfdbfe;
    background-color: #ffffff;
    font-size: 0.76rem;
    transition: all 0.15s ease;
}
.btn-action-status:hover:not(:disabled) {
    background-color: #eff6ff;
    border-color: #93c5fd;
    color: #1d4ed8;
}
.btn-action-status:disabled {
    background-color: #f8fafc;
    border-color: #e2e8f0;
    color: #94a3b8;
    opacity: 0.65;
    cursor: not-allowed;
}

.btn-action-role {
    color: #d97706;
    border: 1px solid #fde68a;
    background-color: #ffffff;
    font-size: 0.76rem;
    transition: all 0.15s ease;
}
.btn-action-role:hover:not(:disabled) {
    background-color: #fffbeb;
    border-color: #fcd34d;
    color: #b45309;
}
.btn-action-role:disabled {
    background-color: #f8fafc;
    border-color: #e2e8f0;
    color: #94a3b8;
    opacity: 0.65;
    cursor: not-allowed;
}

</style>

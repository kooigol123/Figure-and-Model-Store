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
                <button class="btn btn-white border shadow-sm fw-semibold d-flex align-items-center gap-2" style="border-radius: 8px;" @click="alert('กำลังพัฒนาระบบจัดการสินค้า')">
                    <i class="bi bi-box-seam"></i> จัดการสินค้า (12)
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
                    <h3 class="fw-bold text-dark mb-1">8</h3>
                    <p class="text-secondary mb-0" style="font-size: 0.8rem;">Admin 2 บัญชี</p>
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
                    <h3 class="fw-bold text-dark mb-2">6</h3>
                    <span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1 fw-normal" style="font-size: 0.75rem; border-radius: 4px;">
                        2 Suspended
                    </span>
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
                    <h3 class="fw-bold text-dark mb-1">10</h3>
                    <p class="text-secondary mb-0" style="font-size: 0.8rem;">รอยืนยัน 2 รายการ</p>
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
                    <h3 class="fw-bold text-dark mb-1">60,580 <span class="fs-5">บาท</span></h3>
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
                <input type="text" class="form-control border-start-0 ps-0" placeholder="ค้นหาชื่อ อีเมล หรือรหัสสมาชิก">
            </div>
        </div>
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="min-width: 1000px;">
                    <thead class="bg-light text-secondary" style="font-size: 0.85rem;">
                        <tr>
                            <th class="fw-semibold py-3 ps-4 border-bottom-0" style="width: 10%;">Member ID</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 8%;">Profile</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 20%;">Name</th>
                            <th class="fw-semibold py-3 border-bottom-0" style="width: 25%;">Email</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0" style="width: 10%;">Role</th>
                            <th class="fw-semibold py-3 text-center border-bottom-0" style="width: 12%;">Status</th>
                            <th class="fw-semibold py-3 text-end pe-4 border-bottom-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="mem in members" :key="mem.memId">
                            <td class="ps-4 fw-semibold text-secondary">{{ mem.memId }}</td>
                            <td>
                                <img :src="`http://localhost:3000/img_mem/${mem.email}.jpg`" 
                                     @error="$event.target.src='http://localhost:3000/img_mem/default.jpg'"
                                     alt="avatar" 
                                     class="rounded-circle object-fit-cover shadow-sm" 
                                     style="width: 40px; height: 40px;">
                            </td>
                            <td class="fw-semibold text-dark">{{ mem.name }} <span class="text-muted fw-normal" style="font-size: 0.8rem;" v-if="mem.nickname">({{ mem.nickname }})</span></td>
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
                                <span v-if="mem.status === 'Active'" class="text-success fw-semibold d-inline-flex align-items-center gap-2" style="font-size: 0.85rem;">
                                    <span class="bg-success rounded-circle d-inline-block" style="width: 8px; height: 8px;"></span> Active
                                </span>
                                <span v-else class="text-danger fw-semibold d-inline-flex align-items-center gap-2" style="font-size: 0.85rem;">
                                    <span class="bg-danger rounded-circle d-inline-block" style="width: 8px; height: 8px;"></span> Suspended
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <div class="d-flex justify-content-end gap-2">
                                    <button class="btn btn-sm btn-outline-primary fw-semibold rounded px-2 py-1 d-inline-flex align-items-center gap-1" style="font-size: 0.75rem;" @click="alert('ระบบเปลี่ยนสถานะ')">
                                        <i class="bi bi-arrow-repeat"></i> เปลี่ยนสถานะ
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning fw-semibold text-dark rounded px-2 py-1 d-inline-flex align-items-center gap-1" style="font-size: 0.75rem;" @click="alert('ระบบสลับ Role')">
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
                                    <img :src="`http://localhost:3000/img_mem/${order.memEmail}.jpg`" 
                                         @error="$event.target.src='http://localhost:3000/img_mem/default.jpg'"
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
                                <button class="btn btn-sm btn-outline-primary fw-semibold rounded-pill px-3 d-inline-flex align-items-center gap-1" style="font-size: 0.8rem;" @click="viewDetail(order.orderId)">
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
axios.defaults.withCredentials = true;

const router = useRouter();
const dutyId = ref(null);
const orders = ref([]);
const members = ref([]);
const filterStatus = ref('all');

onMounted(async () => {
    await checkAdminDuty();
    if (dutyId.value === 'admin') {
        await fetchAllMembers();
        await fetchAllOrders();
    }
});

const checkAdminDuty = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/members/detail`);
        if (res.data.login) {
            dutyId.value = res.data.dutyId;
            if(dutyId.value !== 'admin'){
                router.push('/')
            }
        } else {
            router.push('/login');
        }
    } catch (err) {
        console.log(err.message);
        router.push('/login');
    }
};

const fetchAllMembers = async () => {
    try {
        // สามารถเชื่อมต่อ API ดึงสมาชิกระบบจริงที่นี่
        // const res = await axios.get(`http://localhost:3000/members/all`);
        // members.value = res.data;

        // Mock data สำหรับแสดงผลรายชื่อสมาชิก
        members.value = [
            { memId: 'M001', name: 'กิตติพงษ์ ศรีสุข', nickname: 'คุณ', email: 'admin@modelstore.ac.th', role: 'admin', status: 'Active' },
            { memId: 'M002', name: 'ณัฐวุฒิ วงศ์ใหญ่', email: 'natthawut.w@student.ac.th', role: 'member', status: 'Active' },
            { memId: 'M003', name: 'พิมพ์ชนก แก้วมณี', email: 'pimchanok.k@student.ac.th', role: 'member', status: 'Active' },
            { memId: 'M004', name: 'ธนากร บุญมา', email: 'thanakorn.b@student.ac.th', role: 'member', status: 'Suspended' },
            { memId: 'M005', name: 'ศิริพร จันทร์เพ็ญ', email: 'siriporn.j@student.ac.th', role: 'member', status: 'Active' }
        ];
    } catch (err) {
        console.log(err.message);
    }
};

const fetchAllOrders = async () => {
    try {
        orders.value = [
            { orderId: '202502180003', memName: 'ณัฐวุฒิ วงศ์ใหญ่', memId: 'M002', memEmail: 'natthawut.w@student.ac.th', orderDate: '2025-02-18', totalItems: 15, totalAmount: 42060, status: 'รอยืนยัน' },
            { orderId: '202502180002', memName: 'ภูริ ทองดี', memId: 'M006', memEmail: 'phuri', orderDate: '2025-02-18', totalItems: 2, totalAmount: 2180, status: 'รอยืนยัน' },
            { orderId: '202502180001', memName: 'พิมพ์ชนก แก้วมณี', memId: 'M003', memEmail: 'pim', orderDate: '2025-02-18', totalItems: 3, totalAmount: 11570, status: 'ยืนยันแล้ว' },
            { orderId: '202502140001', memName: 'ธนากร บุญมา', memId: 'M004', memEmail: 'thanakorn', orderDate: '2025-02-14', totalItems: 2, totalAmount: 2580, status: 'ยืนยันแล้ว' },
            { orderId: '202502100001', memName: 'อรอุมา สุขใจ', memId: 'M007', memEmail: 'onuma', orderDate: '2025-02-10', totalItems: 2, totalAmount: 5780, status: 'ยืนยันแล้ว' },
            { orderId: '202502030001', memName: 'ณัฐวุฒิ วงศ์ใหญ่', memId: 'M002', memEmail: 'natthawut.w@student.ac.th', orderDate: '2025-02-03', totalItems: 4, totalAmount: 7260, status: 'ยืนยันแล้ว' },
            { orderId: '202501270001', memName: 'ภูริ ทองดี', memId: 'M006', memEmail: 'phuri', orderDate: '2025-01-27', totalItems: 1, totalAmount: 13900, status: 'จัดส่งแล้ว' },
        ];
    } catch (err) {
        console.log(err.message);
    }
};

const filteredOrders = computed(() => {
    if (filterStatus.value === 'all') {
        return orders.value;
    }
    return orders.value.filter(order => order.status === filterStatus.value);
});

const viewDetail = (orderId) => {
    alert(`กำลังเปิดดูรายละเอียดของออเดอร์: ${orderId}\n(เตรียมเชื่อมต่อไปหน้ารายละเอียด)`);
};
</script>

<style scoped>
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
</style>
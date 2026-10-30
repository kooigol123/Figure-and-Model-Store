import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";

// token เก็บอยู่ใน cookie (httpOnly) ที่ backend ตั้งให้ตอน login ต้องส่ง cookie ไปทุก request
axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null) // { id, name, email, role, created_at }
    const isLogin = computed(() => !!user.value)

    // รูปโปรไฟล์ img_mem/<id>.jpg — เปลี่ยน avatarVersion เพื่อให้ทุกหน้าโหลดรูปใหม่ทันที
    const defaultAvatar = `http://localhost:3000/img_mem/default.jpg`
    const avatarVersion = ref(Date.now())
    const avatarUrl = computed(() =>
        user.value ? `http://localhost:3000/img_mem/${user.value.id}.jpg?v=${avatarVersion.value}` : defaultAvatar
    )
    const refreshAvatar = () => {
        avatarVersion.value = Date.now()
    }

    // ถาม backend ว่า cookie ที่มีอยู่ยัง login อยู่ไหม
    // - เรียกซ้อนกันหลายที่พร้อมกัน → ใช้ request เดียวกัน (pending)
    // - ล้าง user เฉพาะ 401/403 (หลุดจริง) error อื่น เช่น 500 / network ให้คง user เดิมไว้
    let pending = null
    const fetchMe = () => {
        if (!pending) {
            pending = axios.get(`http://localhost:3000/auth/me`)
                .then(res => { user.value = res.data })
                .catch(err => {
                    if ([401, 403].includes(err.response?.status)) user.value = null
                })
                .finally(() => { pending = null })
        }
        return pending.then(() => user.value)
    }

    const login = (userData) => {
        user.value = userData
        console.log("Login Success:", isLogin.value)
    }

    const logout = async () => {
        try {
            await axios.post(`http://localhost:3000/auth/logout`)
        }
        catch (err) {
            console.log(err)
        }
        user.value = null
        console.log("Logout Success:", !isLogin.value)
    }
    return { user, isLogin, defaultAvatar, avatarUrl, refreshAvatar, fetchMe, login, logout }
})

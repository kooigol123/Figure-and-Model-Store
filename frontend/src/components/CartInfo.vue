<template>
    <div v-if="qty>0" >
        <button  class="btn btn-success text-white" @click="router.push(`/cartshow/${cartId}`)">
            {{cartId}} [{{ qty }}] - {{ money }}฿
        </button>
    </div>
</template>
<script setup>
    import { onMounted, ref,watch } from 'vue'; // import function ref มาจาก vue
    import axios from 'axios';
    import { useAuthStore } from '@/stores/authStore';
    const authStore = useAuthStore()


    import { useRouter } from "vue-router" // เพื่อกำหนดให้ใช้ย้ายหน้า
    const router = useRouter();
    import { useCartStore } from '@/stores/cartStore';
    const cartStore = useCartStore()


    const userId=ref(null) //ข้อมูลผู้ที่ Login อยู่ อ่านจาก /auth/me (cookie) getMember()
    const cartId=ref() //ตะกร้าที่ยังไม่ได้ CF ค่าที่ได้รับจาก chkCart()
    const qty=ref(0) //ค่าที่ได้รับจาก sumCart()
    const money=ref(0) //ค่าที่ได้รับจาก sumCart()
    const id=ref(null) //ค่ารหัสของตะกร้าที่ได้จาก Store เมื่อจำนวนสินค้าเปลี่ยนไป
    // Watch ว่ามีการเปลี่ยนแปลง Qty ใน cartStore หรือไม่
    watch(()=>cartStore.theQty,()=>{
        id.value=cartStore.cartId // ถ้ามีการเปลี่ยนแปลงค่าใน Store ก็ทำการอ่านรหัส Cart
        console.log("Watch Cart:" +id.value)
        sumCart(id.value) // แล้วส่งให้ Backend คำนวนค่าใหม่
    })   
    // เมื่อมีสร้าง component (Refresh Browser) แล้วให้ตรวจสอบใหม่
    onMounted(async ()=>{
        await getMember()
        await chkCart()
        if (cartId.value) await sumCart(cartId.value)
    })
    // ตรวจสอบตะกร้า
    const chkCart=async ()=>{
        console.log('chkCart')
        let members={ userId:userId.value }
        console.log(members)
        try { // Request POST Method
                const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                console.log( response.data.cartId)            
                cartId.value=response.data.cartId  
        }
        catch(err){console.log(err)}                
    }
    // ตรวจสอบ Member
    const getMember=async ()=>{
        const user = await authStore.fetchMe()
        userId.value = user?.id
    }
    // method เพื่อเรียกการคำนวนค่า มีการส่ง parameter cid คือ รหัสตะกร้าที่ส่งมา
    const sumCart=async(cid)=>{
        console.log(`sumCart: ${cid}`)
        // backend ไม่มี sumcart ใช้ getcart ซึ่งคืน sqty / sprice มาให้แทน
        await axios.get(`http://localhost:3000/carts/getcart/${cid}`)
        .then(res => {
            console.log("SumCart: " + res.data.cartId)
            cartId.value = res.data.cartId
            qty.value = Number(res.data.sqty)
            money.value = Number(res.data.sprice)
        })
        .catch(err => { console.error(err);});
    }
</script>
<style></style>

<template>
  <body>

    <div id="app">
      <h2>生鮮食品配送系統</h2>
      <form @submit.prevent="login()">
        <span>{{ error }}</span>
        <div>
          <label for="sN">身分證號碼</label>
          <input v-model="idNumber" type="text" id="sN" name="sN" required>
        </div>
        <div>
          <label for="phoneNumber">電話號碼</label>
          <input v-model="phoneNumber" type="tel" id="phoneNumber" name="phone" required>
        </div>
        <div>
          <button type="submit">登入</button>
        </div>
      </form>
    </div>
  </body>
</template>

<script setup>
import { ref } from 'vue';
import router from '../router'
import { onMounted } from 'vue'
const idNumber = ref('');
const phoneNumber = ref('');
const error = ref("");
const login = () => {
  const loginData = new URLSearchParams();
  loginData.append('idNumber', idNumber.value);
  loginData.append('phoneNumber', phoneNumber.value);
  fetch(`https://db.explosion.tw/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
  //     // Add any other headers your API requires
     },
     // mode: 'cors',
     credentials: 'include', // 將 'same-origin' 改為 'include'
     body: loginData.toString()
   })
     .then(response => response.json())
     .then(data => {
  //     // 處理響應數據
  //     console.log(data)
       if (data['result'] === 1) {
        // localStorage.setItem("fakeID", idNumber.value);
        router.replace('/home');
       } else {
         alert("登入失敗");
       }
     })
     .catch(error => {
       console.error('Error:', error);
     });
};


</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

span {
  color: red;
}

form {
  margin-top: 20px;
}

div {
  margin-bottom: 15px;
}

div label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

div input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

div button {
  background-color: #4caf50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

div button:hover {
  background-color: #45a049;
}

#app {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 300px;
  text-align: center;
}

#app h2 {
  color: #333;
}
</style>

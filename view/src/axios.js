import axios from 'axios'
import store from './store/index.js'
import router from './router/index.js'
// 创建axios实例
var instance = axios.create({
  timeout: 5000, // 请求超过5秒即超时返回错误
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});
// request拦截器
instance.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`;
    }
    return config;
  }
);
// respone拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => { // 默认除了2XX之外的都是错误的，就会走这里
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({ // 跳转到登录页面
            path: 'login',
            query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
      }
    }
    return Promise.reject(error.response);
  }
);
export default {
  // 用户登录
  userLogin(data) {
    return instance.post('http://localhost:3000/api/login', data);
  },
  // 获取用户
  getUser() {
    return instance.get('http://localhost:3000/api/user');
  },
  // 添加用户
  addUser(data) {
    return instance.post('http://localhost:3000/api/addUser', data);
  },
  // 删除用户
  delUser(data) {
    return instance.post('http://localhost:3000/api/delUser', data);
  },
  // 更新用戶
  updateUser(data) {
    return instance.post('http://localhost:3000/api/updateUser', data);
  },
  // 分页查询用户
  pageUser(data) {
    return instance.get('http://localhost:3000/api/pageUser?page=' + data);
  },
  // 查询用户
  findUser(data) {
    return instance.post('http://localhost:3000/api/findUser', data);
  },
  // 获取员工
  getStaff() {
    return instance.get('http://localhost:3000/api/staff');
  },
  // 添加员工
  addStaff(data) {
    return instance.post('http://localhost:3000/api/addStaff', data);
  },
  // 删除员工
  delStaff(data) {
    return instance.post('http://localhost:3000/api/delStaff', data);
  },
  // 更新员工
  updateStaff(data) {
    return instance.post('http://localhost:3000/api/updateStaff', data);
  },
  // 查询员工
  findStaff(data) {
    return instance.post('http://localhost:3000/api/findStaff', data);
  },
  pageStaff(data) {
    return instance.get('http://localhost:3000/api/pageStaff?page=' + data);
  },
  pageStaff_leave(data) {
    return instance.get('http://localhost:3000/api/pageStaff_leave?page=' + data);
  },
  // 员工数据统计
  chart(data) {
    return instance.get('http://localhost:3000/api/chart');
  },
  excel(data) {
    return instance.post('http://localhost:3000/api/excel', data);
  },
  getExcel(data) {
    return instance.get('http://localhost:3000/api/getExcel');
  },
  saveData(data) {
    return instance.post('http://localhost:3000/api/saveData', data);
  },
  saveData(data) {
    return instance.post('http://localhost:3000/api/saveContract', data);
  },
  // 部门管理
  // 添加
  addTransfer(data) {
    return instance.post('http://localhost:3000/api/addTransfer', data);
  },
  // 删除
  delTransfer(data) {
    return instance.post('http://localhost:3000/api/delTransfer', data);
  },
  // 更新
  updateTransfer(data) {
    return instance.post('http://localhost:3000/api/updateTransfer', data);
  },
  // 查询员工
  findTransfer(data) {
    return instance.post('http://localhost:3000/api/findTransfer', data);
  },
  // 分页查询
  pageTransfer(data) {
    return instance.get('http://localhost:3000/api/pageTransfer?page=' + data);
  },
  // 部门职位
  addDepartment(data) {
    return instance.post('http://localhost:3000/api/addDepartment', data);
  },
  addPosition(data) {
    return instance.post('http://localhost:3000/api/addPosition', data);
  },
  findPosition(data) {
    return instance.post('http://localhost:3000/api/findPosition', data);
  },
  findDepartment(data) {
    return instance.post('http://localhost:3000/api/findDepartment', data);
  },
  pageDepartment(data) {
    return instance.get('http://localhost:3000/api/pageDepartment?page=' + data);
  },
  pagePosition(data) {
    return instance.get('http://localhost:3000/api/pagePosition?page=' + data);
  },
  // 查询部门
  findDepart(data) {
    return instance.post('http://localhost:3000/api/findDepart', data);
  },
  find_Position(data) {
    return instance.post('http://localhost:3000/api/find_Position', data);
  },
  updateDepartment(data) {
    return instance.post('http://localhost:3000/api/updateDepartment', data);
  },
  updatePosition(data) {
    return instance.post('http://localhost:3000/api/updatePosition', data);
  },
  delPosition(data) {
    return instance.post('http://localhost:3000/api/delPosition', data);
  },
  findWage(data) {
    return instance.post('http://localhost:3000/api/findWage', data);
  },
  updateWage(data) {
    return instance.post('http://localhost:3000/api/updateWage', data);
  },
  findPayroll(data) {
    return instance.post('http://localhost:3000/api/findPayroll', data);
  },
  exportPayroll(data) {
    return instance.post('http://localhost:3000/api/exportPayroll', data);
  },
  delXlsx(data) {
    return instance.post('http://localhost:3000/api/delXlsx', data);
  },
  exportAttentant(data) {
    return instance.post('http://localhost:3000/api/exportAttentant', data);
  },
  delAttentant(data) {
    return instance.post('http://localhost:3000/api/delAttentant', data);
  },
  UpdatePassword(data) {
    return instance.post('http://localhost:3000/api/updatePassword', data);
  },
  findjob(data) {
    return instance.post('http://localhost:3000/api/findjob', data);
  }
}

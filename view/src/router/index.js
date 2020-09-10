import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
import Layout from '@/components/Layout'
import Login from '@/components/Login'
import File from '@/components/staff/File'
import Onboarding from '@/components/staff/onboarding'
import Former_employee from '@/components/staff/former_employee'
import Employee_attendance from '@/components/staff/employee_attendance'
import Wage from '@/components/staff/wage'
import Admin from '@/components/system/admin'
import Home from '@/components/home/index'
import Chart from '@/components/chart'
import Transfer from '@/components/department/transfer'
import Departments_and_positions from '@/components/department/Departments_and_positions'
import Department from '@/components/department/Department'
import Position from '@/components/department/Position'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/layout',
    name: 'Layout',
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'transfer',
        name: 'Transfer',
        meta: {
          requiresAuth: true
        },
        component: Transfer
      },
      {
        path: 'chart',
        name: 'Chart',
        meta: {
          requiresAuth: true
        },
        component: Chart
      },
      {
        path: 'file',
        name: 'File',
        meta: {
          requiresAuth: true
        },
        component: File
      },
      {
        path: 'employee_attendance',
        name: 'Employee_attendance',
        meta: {
          requiresAuth: true
        },
        component: Employee_attendance
      },
      {
        path: 'wage',
        name: 'Wage',
        meta: {
          requiresAuth: true
        },
        component: Wage
      },
      {
        path: 'departments_and_positions',
        name: 'Departments_and_positions',
        meta: {
          requiresAuth: true
        },
        component: Departments_and_positions
      },
      {
        path: 'position',
        name: 'Position',
        meta: {
          requiresAuth: true
        },
        component: Position
      },
      {
        path: 'department',
        name: 'Department',
        meta: {
          requiresAuth: true
        },
        component: Department
      },
      {
        path: 'former_employee',
        name: 'Former_employee',
        meta: {
          requiresAuth: true
        },
        component: Former_employee
      },
      {
        path: 'onboarding',
        name: 'Onboarding',
        meta: {
          requiresAuth: true
        },
        component: Onboarding
      },
      {
        path: 'admin',
        name: 'Admin',
        meta: {
          requiresAuth: true
        },
        component: Admin
      },
      {
        path: 'home',
        name: 'Home',
        component: Home
      }
    ]
  }
  ]
});
// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = store.state.token;
  // console.log(token);

  // 判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      next({
        path: '',
        query: { redirect: to.fullPath } // 将刚刚要去的路由path作为参数，方便登录成功后直接跳转到该路由
      });
    }
  } else {
    next();
  }
});

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router;

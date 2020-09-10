const Koa = require('koa');
const views = require('koa-views');
const serve = require('koa-static');
const app = new Koa();
const node_xlsx = require('node-xlsx');
//router
const Router = require('koa-router');
// const Cors =require('koa2-cors');
//父路由
const router = new Router();
app.use(serve(__dirname));
app.use(views())
//bodyparser:该中间件用于post请求的数据

// const bodyParser = require('koa-bodyparser');
const Koabody = require('koa-body');
// const bodyParser = require('koa-body');
// app.use(bodyParser());
app.use(Koabody({ multipart: true }));
// app.use(async (ctx, next) => {
//     console.log(ctx.request.body)
//     await next()
// })
// app.use(Cors());
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});
//引入数据库操作方法
const UserController = require('./controller/user.js');
const StaffController = require('./controller/staff.js');
const ExcelController = require('./controller/excel.js');
const DepartmentController = require('./controller/department.js');
const PositionController = require('./controller/position.js');
const WageController = require('./controller/wage.js');
//checkToken作为中间件存在
const checkToken = require('./token/checkToken.js');

//登录
const loginRouter = new Router();
loginRouter.post('/login', UserController.Login);
//添加
const addRouter = new Router();
addRouter.post('/addUser', UserController.AddUser);
//获取所有用户
const userRouter = new Router();
userRouter.get('/user', UserController.GetAllUsers);
// userRouter.get('/user', checkToken, UserController.GetAllUsers);
//删除某个用户
const delUserRouter = new Router();
delUserRouter.post('/delUser', UserController.DelUser);
//更新某个用户
const updateUserRouter = new Router();
updateUserRouter.post('/updateUser', UserController.UpdateUser);
//分页查询
const pageUserRouter = new Router();
pageUserRouter.get('/pageUser', UserController.PageUser);
//查询用户
const findUserRouter = new Router();
findUserRouter.post('/findUser', UserController.FindUser);
//修改密码
const UpdatePasswordRouter = new Router();
UpdatePasswordRouter.post('/updatePassword', UserController.UpdatePassword);

//添加员工
const addStaffRouter = new Router();
addStaffRouter.post('/addStaff', StaffController.AddStaff);
//获取所有员工
const staffRouter = new Router();
staffRouter.get('/staff', StaffController.GetAllStaffs);
// userRouter.get('/user', checkToken, UserController.GetAllUsers);
//删除某个员工
const delStaffRouter = new Router();
delStaffRouter.post('/delStaff', StaffController.DelStaff);
//更新某个员工
const updateStaffRouter = new Router();
updateStaffRouter.post('/updateStaff', StaffController.UpdateStaff);
//查询某个员工
const findStaffRouter = new Router();
findStaffRouter.post('/findStaff', StaffController.FindStaff);
//在职员工分页查询
const pageStaffRouter = new Router();
pageStaffRouter.get('/pageStaff', StaffController.PageStaff);
//离职员工分页查询
const pageStaff_leaveRouter = new Router();
pageStaff_leaveRouter.get('/pageStaff_leave', StaffController.PageStaff_leave);
//员工数据统计
const chartRouter = new Router();
chartRouter.get('/chart', StaffController.Chart);
//获得考勤数据表
const saveDataRouter = new Router();
saveDataRouter.post('/saveData', ExcelController.saveData);
//部门管理模块
//添加
const add_transferRouter = new Router();
add_transferRouter.post('/addTransfer', DepartmentController.Add_transfer);
//删除
const del_transferRouter = new Router();
del_transferRouter.post('/delTransfer', DepartmentController.Del_transfer);
//修改
const update_transferRouter = new Router();
update_transferRouter.post('/updateTransfer', DepartmentController.Update_transfer);
//分页查询
const page_transferRouter = new Router();
page_transferRouter.get('/pageTransfer', DepartmentController.Page_transfer);
//查询用户
const find_transferRouter = new Router();
find_transferRouter.post('/findTransfer', DepartmentController.Find_transfer);
//查询用户
const find_jobRouter = new Router();
find_jobRouter.post('/findjob', DepartmentController.Find_job);
//部门职位
//分页查询
const pageDepartmentRouter = new Router();
pageDepartmentRouter.get('/pageDepartment', PositionController.PageDepartment);
const pagePositionRouter = new Router();
pagePositionRouter.get('/pagePosition', PositionController.PagePosition);
//查询部门
const findDepartmentRouter = new Router();
findDepartmentRouter.post('/findDepartment', PositionController.findDepartment);
//查找职位
const findAllPositionmentRouter = new Router();
findAllPositionmentRouter.post('/findPosition', PositionController.findAllPosition);
//查找职位
const Add_DepartmentRouter = new Router();
Add_DepartmentRouter.post('/addDepartment', PositionController.Add_Department);
const Add_PositionRouter = new Router();
Add_PositionRouter.post('/addPosition', PositionController.Add_Position);
const findDepartRouter = new Router();
findDepartRouter.post('/findDepart', PositionController.findDepart);
const find_PositionRouter = new Router();
find_PositionRouter.post('/find_Position', PositionController.find_Position);
const UpdateDepartmentRouter = new Router();
UpdateDepartmentRouter.post('/updateDepartment', PositionController.UpdateDepartment);
const updatePositionRouter = new Router();
updatePositionRouter.post('/updatePosition', PositionController.UpdatePosition);
const delPositionRouter = new Router();
delPositionRouter.post('/delPosition', PositionController.DelPosition);
const FindWageRouter = new Router();
FindWageRouter.post('/findWage', WageController.FindWage);
const UpdateWageRouter = new Router();
UpdateWageRouter.post('/updateWage', WageController.UpdateWage);
const FindPayrollRouter = new Router();
FindPayrollRouter.post('/findPayroll', WageController.FindPayroll);
const ExportPayrollRouter = new Router();
ExportPayrollRouter.post('/exportPayroll', WageController.ExportPayroll);
const DelXlsxRouter = new Router();
DelXlsxRouter.post('/delXlsx', WageController.DelXlsx);
const ExportAttentantRouter = new Router();
ExportAttentantRouter.post('/exportAttentant', StaffController.ExportAttendance);
const DelAttentantRouter = new Router();
DelAttentantRouter.post('/delAttentant', StaffController.DelAttendance);
//装载上面子路由
router.use('/api', find_jobRouter.routes(), find_jobRouter.allowedMethods());
router.use('/api', DelAttentantRouter.routes(), DelAttentantRouter.allowedMethods());
router.use('/api', ExportAttentantRouter.routes(), ExportAttentantRouter.allowedMethods());
router.use('/api', DelXlsxRouter.routes(), DelXlsxRouter.allowedMethods());
router.use('/api', ExportPayrollRouter.routes(), ExportPayrollRouter.allowedMethods());
router.use('/api', FindPayrollRouter.routes(), FindPayrollRouter.allowedMethods());
router.use('/api', UpdateWageRouter.routes(), UpdateWageRouter.allowedMethods());
router.use('/api', FindWageRouter.routes(), FindWageRouter.allowedMethods());
router.use('/api', delPositionRouter.routes(), delPositionRouter.allowedMethods());
router.use('/api', UpdateDepartmentRouter.routes(), UpdateDepartmentRouter.allowedMethods());
router.use('/api', updatePositionRouter.routes(), updatePositionRouter.allowedMethods());
router.use('/api', findDepartmentRouter.routes(), findDepartmentRouter.allowedMethods());
router.use('/api', findAllPositionmentRouter.routes(), findAllPositionmentRouter.allowedMethods());
router.use('/api', Add_DepartmentRouter.routes(), Add_DepartmentRouter.allowedMethods());
router.use('/api', Add_PositionRouter.routes(), Add_PositionRouter.allowedMethods());
router.use('/api', pageDepartmentRouter.routes(), pageDepartmentRouter.allowedMethods());
router.use('/api', pagePositionRouter.routes(), pagePositionRouter.allowedMethods());
router.use('/api', findDepartRouter.routes(), findDepartRouter.allowedMethods());
router.use('/api', find_PositionRouter.routes(), find_PositionRouter.allowedMethods());
//部门模块
router.use('/api', add_transferRouter.routes(), add_transferRouter.allowedMethods());
router.use('/api', del_transferRouter.routes(), del_transferRouter.allowedMethods());
router.use('/api', update_transferRouter.routes(), update_transferRouter.allowedMethods());
router.use('/api', page_transferRouter.routes(), page_transferRouter.allowedMethods());
router.use('/api', find_transferRouter.routes(), find_transferRouter.allowedMethods());

//管理员模块
router.use('/api', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/api', addRouter.routes(), addRouter.allowedMethods());
router.use('/api', userRouter.routes(), userRouter.allowedMethods());
router.use('/api', delUserRouter.routes(), delUserRouter.allowedMethods());
router.use('/api', updateUserRouter.routes(), updateUserRouter.allowedMethods());
router.use('/api', pageUserRouter.routes(), pageUserRouter.allowedMethods());
router.use('/api', findUserRouter.routes(), findUserRouter.allowedMethods());
router.use('/api', UpdatePasswordRouter.routes(), UpdatePasswordRouter.allowedMethods());
//员工模块
router.use('/api', addStaffRouter.routes(), addStaffRouter.allowedMethods());
router.use('/api', staffRouter.routes(), staffRouter.allowedMethods());
router.use('/api', delStaffRouter.routes(), delStaffRouter.allowedMethods());
router.use('/api', updateStaffRouter.routes(), updateStaffRouter.allowedMethods());
router.use('/api', findStaffRouter.routes(), findStaffRouter.allowedMethods());
router.use('/api', pageStaffRouter.routes(), pageStaffRouter.allowedMethods());
router.use('/api', pageStaff_leaveRouter.routes(), pageStaff_leaveRouter.allowedMethods());
router.use('/api', chartRouter.routes(), chartRouter.allowedMethods());
router.use('/api', saveDataRouter.routes(), saveDataRouter.allowedMethods());


app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('The server is running at http://localhost:' + 3000);
});


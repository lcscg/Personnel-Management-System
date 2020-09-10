const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vue-login');
let db = mongoose.connection;
// 防止Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
db.on('error', function () {
    errorOverlay: true,
        console.log('数据库连接出错！');
});
db.on('open', function () {
    console.log('数据库连接成功！');
});
mongoose.set('useFindAndModify', false);

// mongoose.set('useNewUrlParser', true)
// mongoose.set('useCreateIndex', true)
const userSchema = mongoose.Schema({
    username: String,//姓名
    password: String,
    power: String,
    name: String,//账号
    phone: Number,
    mail: String,
    // recheck: String,
    create_time: Date,
    token: String,
});
const departmentSchema = mongoose.Schema({
    id: String,
    name: String,
    front_department: String,
    front_position: String,
    after_department: String,
    after_position: String,
    remark: String,
    adjustment_data: Date
});
const staffSchema = mongoose.Schema({
    id: String,
    name: String,
    sex: String,
    age: Number,
    phone: Number,
    mail: String,
    addr: String,
    status: String,
    department: String,
    remark: String,
    job: String,
    leafTime: Date,
    birth_addr: String,
    education: String,
    contact: String,
    contact_phone: Number,
    contact_relationship: String,
    marriage: String,
    create_time: Date,
    post_wage: Number,
    basic_wage: Number
});
const positionSchema = mongoose.Schema({
    department: String,
    position: [],
    department_function: String
});
const wageSchema = mongoose.Schema({
    id: String,
    name: String,
    position: String,
    department: String,
    post_wage: Number,//岗位工资
    basic_wage: Number,//基本工资
    deduction: Number,//考勤扣款
    reward: Number,//全勤奖
    bonus: Number,//奖金
    radio: Boolean,
    social_security: Number,//社保
    tax: Number,//个人所得税
    wage: Number//总工资
});
const attendanceSchema = mongoose.Schema({
    id: Number,
    name: String,
    late: Number,
    absenteeism: Number,
    absenteeisms: Number
});
const model = {
    User: mongoose.model('User', userSchema),
    Staff: mongoose.model('Staff', staffSchema),
    Department: mongoose.model('Department', departmentSchema),
    Position: mongoose.model('Position', positionSchema),
    Wage: mongoose.model('Wage', wageSchema),
    Attendance: mongoose.model('attendance', attendanceSchema),
};
module.exports = model;

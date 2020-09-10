const Staff = require('../db/db.js').Staff;
const Position = require('../db/db.js').Position;
const Attendance = require('../db/db.js').Attendance;
const Wage = require('../db/db.js').Wage;
const mongoXlsx = require('mongo-xlsx');
const fs = require('fs')
//数据库的操作
//根据用户名查找用户
const findStaff = (id) => {
  return new Promise((resolve, reject) => {
    Staff.findOne({ id }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//找到所有用户
const findAllStaffs = () => {
  return new Promise((resolve, reject) => {
    Staff.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//删除某个用户
const delStaff = function (id) {
  // //console.log(id);
  return new Promise((resolve, reject) => {
    Staff.findOneAndRemove({ _id: id }, err => {
      if (err) {
        reject(err);
      }
      //console.log('删除用户成功');
      resolve();
    });
  });
};
//更新某个用户
const updateStaff = function (id, result) {
  return new Promise((resolve, reject) => {
    Staff.findOneAndUpdate({ _id: id },
      {
        $set: {
          "name": result.name,
          "sex": result.sex,
          "phone": result.phone,
          "mail": result.mail,
          "age": result.age,
          "addr": result.addr,
          "job": result.job,
          "department": result.department,
          "status": result.status,
          "remark": result.remark,
          "leafTime": result.leafTime
        }
      }, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
};
//更新职位
const updatePosition = function (id, result) {
  return new Promise((resolve, reject) => {
    console.log(result.job, result.department);

    Staff.findOneAndUpdate({ id: id, "status": "在职" }, { $set: { "job": result.job, "department": result.department } }, err => {
      if (err) {
        reject(err);
      }
      console.log('更新职位成功');
      resolve();
    });
  });
};
//添加
const AddStaff = async (ctx) => {
  // let doc = await Staff.find({ "status": "在职" });
  let doc = await Staff.find();
  let position = ctx.request.body.job
  let department = ctx.request.body.department
  var max_id = []
  var len = doc.length
  for (var i = 0; i < len; i++) {
    max_id.push(doc[i].id)
  }
  var m_id = String((Array(6).join(0) + (Number(max_id[len - 1]) + 1)).slice(-6))
  let obj = await Position.find({ 'department': department })
  var Obj;
  var post_wage
  obj.forEach(ele => {
    Obj = ele.position
  })
  Obj.forEach((ele, index) => {
    if (ele.position === position)
      post_wage = ele.post_wage
  })

  let staff = new Staff({
    id: m_id,
    name: ctx.request.body.name,
    sex: ctx.request.body.sex,
    age: ctx.request.body.age,
    addr: ctx.request.body.addr,
    phone: ctx.request.body.phone,
    mail: ctx.request.body.mail,
    status: ctx.request.body.status,
    job: position,
    department: department,
    birth_addr: ctx.request.body.birth_addr,
    education: ctx.request.body.education,
    contact: ctx.request.body.contact,
    contact_phone: ctx.request.body.contact_phone,
    contact_relationship: ctx.request.body.contact_relationship,
    marriage: ctx.request.body.marriage,
    create_time: ctx.request.body.create_time,
    post_wage: post_wage,
    basic_wage: 1500
  });
  ;
  await new Promise((resolve, reject) => {
    staff.save((err) => {
      if (err) {
        reject(err);
      }
      resolve()
    });
  });
  console.log('添加成功');
  ctx.status = 200;
  ctx.body = {
    success: true
  }
  let wage_doc = await Staff.find({ id: m_id })
  let wage_id = wage_doc[0]._id
  let staff_wage = new Wage({
    _id: wage_id,
    id: m_id,
    name: ctx.request.body.name,
    department: department,
    post_wage: post_wage,
    position: position,
    basic_wage: 1500
  });
  await new Promise((resolve, reject) => {
    Wage.findOneAndRemove({ _id: wage_id }).then(res => {
      staff_wage.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    })
    console.log('工资单保存成功');

  });
};


//获得所有用户信息
const GetAllStaffs = async (ctx) => {
  //查询所有用户信息
  var count = await Staff.find().count();
  let doc = await Staff.find().limit(10).sort({ id: -1 });
  ctx.status = 200;
  // ctx.data.push(pagesize);
  // //console.log('获得所有用户信息');
  ctx.body = {
    succsess: '成功',
    result: doc,
    size: count

  };
};

//删除某个用户
const DelStaff = async (ctx) => {
  //拿到要删除的用户id
  //console.log(ctx.request.body.id);
  let id = ctx.request.body.id;
  await delStaff(id);
  ctx.status = 200;
  ctx.body = {
    success: '删除成功'
  };
};

//更新用戶數據
const UpdateStaff = async (ctx) => {
  let id = ctx.request.body._id;
  let result = ctx.request.body;
  console.log(result);
  await updateStaff(id, result);
  if (ctx.request.body.status === '离职') {
    await Wage.findOneAndRemove({ _id: id })
  }
  ctx.body = {
    success: '更新成功',
    code: 200
  };
};

//查询用户数据
const FindStaff = async (ctx) => {
  var page = ctx.request.body.pageNum - 1;
  var name = ctx.request.body.name;
  var id = ctx.request.body.id;
  var phone = ctx.request.body.phone;
  var department = ctx.request.body.department;
  var status = ctx.request.body.status;
  var doc;
  if (name == '' && id == '' && phone == '' && department == '') {
    // doc = await PageStaff();
    var count = await Staff.find({ "status": status }).count();
    doc = await Staff.find({ "status": status }).skip(page * 10).limit(10);
    ctx.body = {
      code: 200,
      size: count,
      result: doc
    }
  } else {
    var obj = {}
    obj.status = status
    if (name != "") obj.name = name
    if (id != "") obj.id = id
    if (phone != "") obj.phone = phone
    if (department != "") obj.department = department
    doc = await Staff.find(obj).skip(page * 10).limit(10);
    var count = await Staff.find(obj).count();
    ctx.status = 200;
    ctx.body = {
      succsess: '成功',
      result: doc,
      size: count
    };
  }
}

//在职员工分页查询
const PageStaff = async (ctx) => {
  let page = ctx.query.page - 1;
  var count = await Staff.find({ "status": "在职" }).count();
  // //console.log(page)
  let doc = await Staff.find({ "status": "在职" }).skip(page * 10).limit(10).sort({ id: -1 });
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: doc,
    size: count
  };
}

//离职员工分页查询
const PageStaff_leave = async (ctx) => {
  let page = ctx.query.page - 1;
  var count = await Staff.find({ "status": "离职" }).count();
  // //console.log(page)
  let doc = await Staff.find({ "status": "离职" }).skip(page * 10).limit(10).sort({ id: -1 });
  //console.log(doc);
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    result: doc,
    size: count
  };
}

const Chart = async (ctx) => {
  var male = await Staff.find(
    { "status": "在职", "sex": "0" }).count();
  var female = await Staff.find(
    { "status": "在职", "sex": "1" }).count();
  var yourth = await Staff.find(
    { "status": "在职", "age": { $gte: 18, $lte: 39 } }).count();
  var middle = await Staff.find(
    { "status": "在职", "age": { $gte: 40, $lte: 49 } }).count();
  var middle_elderly = await Staff.find(
    { "status": "在职", "age": { $gte: 50, $lte: 59 } }).count();
  var elderly = await Staff.find(
    { "status": "在职", "age": { $gte: 60 } }).count();
  ctx.status = 200;
  ctx.body = {
    succsess: '成功',
    male: male,
    female: female,
    yourth: yourth,
    middle: middle,
    middle_elderly: middle_elderly,
    elderly: elderly
  };
}

const ExportAttendance = async (ctx) => {
  let data = await Attendance.find()
  // let model = [
  //     { displayName: '工号', access: 'id', type: 'string' },
  //     { displayName: '姓名', access: 'name', type: 'string' },
  //     { displayName: '所属部门', access: 'department', type: 'string' },
  //     { displayName: '岗位工资', access: 'post_wage', type: 'number' },
  //     { displayName: '基本工资', access: 'basic_wage', type: 'number' },
  //     { displayName: '出勤天数', access: 'attendance', type: 'number' },
  //     { displayName: '考勤扣款', access: 'deduction', type: 'number' },
  //     { displayName: '全勤奖', access: 'reward', type: 'number' },
  //     { displayName: '绩效工资', access: 'performance', type: 'number' },
  //     { displayName: '社保扣款', access: 'social_security', type: 'number' },
  //     { displayName: '个人所得税', access: 'tax', type: 'number' },
  //     { displayName: '总工资', access: 'wage', type: 'number' }
  // ]
  let model = await mongoXlsx.buildDynamicModel(data);
  let options = {
    'fileName': '考勤表.xlsx',
    'path': './excel'
  }
  let fullpath = await read(data, model, options)
  let path = await fullpath.fullPath
  ctx.body = {
    code: 200,
    result: `http://localhost:3000/excel/考勤表.xlsx`
  }
}

const read = (data, model, options) => {
  return new Promise((resolve, reject) => {
    mongoXlsx.mongoData2Xlsx(data, model, options, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    })
  })
}

const DelAttendance = async (ctx) => {
  await setTimeout(() => {
    fs.unlinkSync('./excel/考勤表.xlsx');
  }, 5000);
  ctx.body = {
    code: 200
  }
}

module.exports = {
  DelAttendance,
  ExportAttendance,
  AddStaff,
  GetAllStaffs,
  DelStaff,
  UpdateStaff,
  FindStaff,
  PageStaff,
  PageStaff_leave,
  Chart,
  findStaff,
  updateStaff,
  updatePosition
};

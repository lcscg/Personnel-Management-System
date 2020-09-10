const Department = require('../db/db.js').Department;
const Wage = require('../db/db.js').Wage;
const Position = require('../db/db.js').Position;
const Staffs = require('../db/db.js').Staff;
//下面这两个包用来生成时间
const moment = require('moment');
var Staff = require('./staff')
//数据库的操作
//根据用户名查找用户
const findTransfer = (id) => {
  return new Promise((resolve, reject) => {
    Department.findOne({ id }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//找到所有用户
const findAllTransfer = () => {
  return new Promise((resolve, reject) => {
    Department.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//删除某个用户
const delTransfer = function (id) {
  return new Promise((resolve, reject) => {
    Department.findOneAndRemove({ _id: id }, err => {
      if (err) {
        reject(err);
      }
      console.log('删除成功');
      resolve();
    });
  });
};
//更新某个用户
const updateTransfer = function (id, result) {
  return new Promise((resolve, reject) => {
    Department.findOneAndUpdate({ _id: id }, { $set: { "id": result.id, "front_department": result.front_department, "front_position": result.front_position, "after_department": result.after_department, "after_position": result.after_position, "remark": result.remark, "adjustment_data": result.adjustment_data } }, err => {
      if (err) {
        reject(err);
      }
      console.log('修改成功');
      resolve();
    });
  });
};


//添加
const Add_transfer = async (ctx) => {
  let transfer_id = ctx.request.body.id;
  let department = new Department({
    id: ctx.request.body.id,
    front_department: ctx.request.body.front_department,
    front_position: ctx.request.body.front_position,
    after_department: ctx.request.body.after_department,
    after_position: ctx.request.body.after_position,
    remark: ctx.request.body.remark,
    adjustment_data: ctx.request.body.adjustment_data
    //添加字段
  });
  let doc = await Staff.findStaff(transfer_id);
  let obj = {
    department: ctx.request.body.after_department,
    job: ctx.request.body.after_position
  }
  await new Promise((resolve, reject) => {
    if (!doc) {
      console.log('工号不存在');
      ctx.status = 201;
      ctx.body = {
        info: false,
        msg: '工号不存在'
      }
      resolve();
    } else {
      Staff.updatePosition(transfer_id, obj);
      department.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
      ctx.body = {
        result: '添加成功'
      }
    }
  })
};


//删除某个用户
const Del_transfer = async (ctx) => {
  let id = ctx.request.body.id;
  await delTransfer(id);
  ctx.body = {
    code: 200,
    success: '删除成功'
  };
};

//更新用戶數據
const Update_transfer = async (ctx) => {
  let _id = ctx.request.body._id;
  let id = ctx.request.body.id;
  let result = ctx.request.body;
  let doc = {
    department: result.after_department,
    job: result.after_position
  }
  await Staff.updatePosition(id, doc);
  await updateTransfer(_id, result);
  let a = await Position.find({ department: result.after_department })
  let post_wage = a[0].position[0].post_wage
  let b = await Wage.find({ id: id })
  console.log(b);

  await Wage.updateOne({ id: id }, { $set: { department: result.after_department, position: result.after_position, basic_wage: 1500, post_wage: post_wage, reward: 0, social_security: 0, tax: 0, wage: 0, deduction: 0 } })
  let c = await Wage.find({ id: id })
  console.log(c);
  ctx.body = {
    success: '更新成功'
  };

}

//分页查询
const Page_transfer = async (ctx) => {
  let page = ctx.query.page - 1;
  var count = await Department.find().count();
  let doc = await Department.find().skip(page * 10).limit(10);
  ctx.body = {
    succsess: '成功',
    result: doc,
    size: count
  };
}

//查询用户数据
const Find_transfer = async (ctx) => {
  var id = ctx.request.body.id;
  var page = ctx.request.body.pageNum - 1;
  var doc;
  if (id == '') {
    var count = await Department.find().count();
    doc = await Department.find().skip(page * 10).limit(10);
    ctx.body = {
      code: 200,
      result: doc,
      size: count
    }
  } else {
    doc = await Department.find({ 'id': id }).skip(page * 10).limit(10);
    var count = await Department.find({ 'id': id }).count();
    ctx.body = {
      result: doc,
      size: count
    }
  }
}

const Find_job = async (ctx) => {
  const id = ctx.request.body.id;
  console.log(id);

  let obj = await Staffs.find({ id: id })
  if (obj[0]&&obj[0].status!='离职') {
    ctx.body = {
      code: 200,
      position:obj[0].job,
      department:obj[0].department
    }
  } else {
    ctx.body = {
      msg: "工号不存在",
      code: 201
    }
    console.log("工号不存在");
    
  }
}
module.exports = {
  Add_transfer,
  Del_transfer,
  Update_transfer,
  Page_transfer,
  Find_transfer,
  Find_job
};

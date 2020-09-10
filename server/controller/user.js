const User = require('../db/db.js').User;
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
//用于密码加密
const sha1 = require('sha1');
//createToken
const createToken = require('../token/createToken.js');

//数据库的操作
//根据用户名查找用户
const findUser = (name) => {
  return new Promise((resolve, reject) => {
    User.findOne({ name }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//找到所有用户
const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};
//删除某个用户
const delUser = function (id) {
  // console.log(id);
  return new Promise((resolve, reject) => {
    User.findOneAndRemove({ _id: id }, err => {
      if (err) {
        reject(err);
      }
      console.log('删除用户成功');
      resolve();
    });
  });
};
//更新某个用户
const updateUser = function (id, result) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: id }, { $set: { "name": result.name, "power": result.power, "username": result.username, "phone": result.phone, "mail": result.mail, "password": result.password } }, err => {
      if (err) {
        reject(err);
      }
      // console.log(result)
      console.log('更新用户成功');
      resolve();
    });
  });
};
//登录
const Login = async (ctx) => {
  //拿到账号和密码
  let username = ctx.request.body.name;
  let password = ctx.request.body.pass;
  let doc = await findUser(username);
  if (!doc) {
    console.log('账号不存在');
    ctx.status = 200;
    ctx.body = {
      info: false
    }
  } else if (JSON.parse(JSON.stringify(doc)).password == password) {
    console.log('密码一致!');
    //生成一个新的token,并存到数据库
    let token = createToken(username);
    doc.token = token;
    await new Promise((resolve, reject) => {
      doc.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    ctx.status = 200;
    ctx.body = {
      success: true,
      username,
      token, //登录成功要创建一个新的token,应该存入数据库
      create_time: doc.create_time
    };
  } else {
    console.log('密码错误!');
    ctx.body = {
      success: false,
      status: 300
    };
  }
};
//添加
const AddUser = async (ctx) => {
  let user = new User({
    name: ctx.request.body.name,
    password: ctx.request.body.password, //加密
    power: "0",
    username: ctx.request.body.username,
    phone: ctx.request.body.phone,
    mail: ctx.request.body.mail,
    // recheck: String,
    token: createToken(this.username), //创建token并存入数据
    // create_time: moment(objectIdToTimestamp(user._id)).format('YYYY-MM-DD HH:mm:ss'), //将objectid转换为用户创建时间

  });

  //将objectid转换为用户创建时间(可以不用)

  // user.create_time = moment(objectIdToTimestamp(user._id)).format('YYYY-MM-DD HH:mm:ss');

  let doc = await findUser(user.name);
  if (doc) {
    ctx.status = 200;
    ctx.body = {
      success: false
    };
  } else {
    await new Promise((resolve, reject) => {
      user.save((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    console.log('添加成功');
    ctx.status = 200;
    ctx.body = {
      success: true
    }
  }

};
//获得所有用户信息
const GetAllUsers = async (ctx) => {
  //查询所有用户信息
  let doc = await findAllUsers();
  ctx.status = 200;
  // console.log('获得所有用户信息');
  ctx.body = {
    succsess: '成功',
    result: doc,

  };
};
//删除某个用户
const DelUser = async (ctx) => {
  //拿到要删除的用户id
  // console.log(ctx.request.body.id);
  let id = ctx.request.body.id;
  await delUser(id);
  ctx.status = 200;
  ctx.body = {
    success: '删除成功'
  };
};
//更新用戶數據
const UpdateUser = async (ctx) => {
  let id = ctx.request.body._id;
  // console.log(id);
  let result = ctx.request.body;
  // console.log(result);
  await updateUser(id, result);
  ctx.status = 200;
  ctx.body = {
    success: '更新成功'
  };

}
//分页查询
const PageUser = async (ctx) => {
  let page = ctx.query.page - 1;
  var count = await User.find().count();
  // console.log(page)
  let doc = await User.find().skip(page * 10).limit(10);
  // console.log(doc);
  ctx.code = 200;
  ctx.body = {
    succsess: '成功',
    result: doc,
    size: count
  };
}
//查询用户数据
const FindUser = async (ctx) => {
  var name = ctx.request.body.name;
  var username = ctx.request.body.username;
  var phone = ctx.request.body.phone;
  var page = ctx.request.body.pageNum - 1;
  var doc;
  if (name == '' && username == '' && phone == '') {
    // doc = await PageUser();
    var count = await User.find().count();
    let doc = await User.find().skip(page * 10).limit(10);

    ctx.body = {
      code: 200,
      result: doc,
      size: count
    }
  } else {
    var obj = {}
    if (name != "") obj.name = name
    if (username != "") obj.username = username
    if (phone != "") obj.phone = phone
    // console.log(obj);
    doc = await User.find(obj);
    ctx.body = {
      code: 200,
      result: doc,
      size: count
    }
  }
}
const UpdatePassword = async (ctx) => {
  var username = ctx.request.body.username;
  var password = ctx.request.body.origin;
  var new_password = ctx.request.body.new;
  let doc = await User.find({ "name": username });
  if (doc[0].password === password) {
    await User.findByIdAndUpdate({ _id: doc[0]._id },
       { $set: { "password": new_password } })
    ctx.body = {
      code: 200,
      msg: "修改密码成功"
    }
  } else {
    ctx.body = {
      code: 300,
      msg: "原密码错误"
    }
  }
}
module.exports = {
  Login,
  AddUser,
  GetAllUsers,
  DelUser,
  UpdateUser,
  PageUser,
  FindUser,
  UpdatePassword
};

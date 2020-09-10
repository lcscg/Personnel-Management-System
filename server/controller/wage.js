const Wage = require('../db/db.js').Wage;
const Staff = require('../db/db.js').Staff;
const Position = require('../db/db.js').Position;
const Attendance = require('../db/db').Attendance
const mongoXlsx = require('mongo-xlsx');
const fs = require('fs')
const path = require('path')

const FindWage = async (ctx) => {
    var page = ctx.request.body.pageNum - 1;
    var name = ctx.request.body.name;
    var id = ctx.request.body.id;
    var doc;
    if (name == '' && id == '') {
        var count = await Staff.find({ "status": '在职' }).count();
        doc = await Staff.find({ "status": '在职' }).skip(page * 10).limit(10).sort({ id: 1 });
        ctx.body = {
            code: 200,
            size: count,
            result: doc
        }
    } else {
        var obj = {}
        obj.status = '在职'
        if (name != "") obj.name = name
        if (id != "") obj.id = id
        doc = await Staff.find(obj).skip(page * 10).limit(10);
        var count = await Staff.find(obj).count();
        ctx.body = {
            code: 200,
            result: doc,
            size: count
        };
    }
}

//添加
const UpdateWage = async (ctx) => {
    let _id = ctx.request.body._id;
    let id = ctx.request.body.id
    let name = ctx.request.body.name
    let department = ctx.request.body.department
    let post_wage = ctx.request.body.post_wage
    let position = ctx.request.body.position
    let basic_wage = ctx.request.body.basic_wage
    // let attendance = ctx.request.body.attendance
    let deduction = Number(ctx.request.body.deduction)
    let reward = Number(ctx.request.body.reward || 0)
    let performance = Number(ctx.request.body.performance)
    let radio = ctx.request.body.radio
    let social_security = Number(ctx.request.body.social_security)
    let tax = Number(ctx.request.body.tax)
    let bonus = Number(ctx.request.body.bonus)
    let wages = post_wage + basic_wage + reward + bonus - social_security - tax - deduction
    let wage = new Wage({
        _id: _id,
        id: id,
        name: name,
        department: department,
        post_wage: post_wage,
        position: position,
        basic_wage: basic_wage,
        // attendance: attendance,
        deduction: deduction,
        reward: reward,
        performance: performance,
        wage: wages,
        radio: radio,
        social_security: social_security,
        tax: tax,
        bonus: bonus
    });
    await new Promise((resolve, reject) => {
        Wage.findOneAndRemove({ _id: _id }).then(res => {
            wage.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        })
        ctx.body = {
            code: 200,
            msg: '保存成功'
        }
    });
};

const FindPayroll = async (ctx) => {
    let post_wage = ctx.request.body.post_wage
    let position = ctx.request.body.job
    let basic_wage = ctx.request.body.basic_wage
    // let attendance = ctx.request.body.attendance
    let _id = ctx.request.body._id;
    var id = ctx.request.body.id;
    // let obj = await Attendance.find({ id: id })
    let doc = await Wage.find({ '_id': _id })
    // if (obj != "") {
    //     //考勤扣款计算
    //     let num1 = obj[0].absenteeisms
    //     let num2 = obj[0].absenteeism
    //     let num3 = obj[0].late
    //     if (num3 > 0 || num2 > 0 || num1 > 0) {
    //         var deduction = ((post_wage + basic_wage) / 21.75 * num1 + num2 * (post_wage + basic_wage) / 21.75 / 2 + num3 * 100).toFixed(2)
    //         var reward = 0
    //     } else {
    //         var deduction = 0
    //         var reward = 100
    //     }
    //     //社保扣款
    //     let social_security = ((post_wage + basic_wage - deduction + reward) * 0.6 * 0.8).toFixed(2)
    //     //个人所得税
    //     let all = (post_wage + basic_wage - deduction + reward - social_security)
    //     let tax;
    //     if (all <= 5000) {
    //         tax = 0
    //     } else if (all > 5000 && all <= 36000) {
    //         tax = (all * 0.03).toFixed(2)
    //     } else if (all > 36000 && all <= 144000) {
    //         tax = (all * 0.1).toFixed(2)
    //     } else if (all > 144000 && all <= 300000) {
    //         tax = (all * 0.2).toFixed(2)
    //     } else if (all > 300000 && all <= 420000) {
    //         tax = (all * 0.25).toFixed(2)
    //     } else if (all > 420000 && all <= 660000) {
    //         tax = (all * 0.3).toFixed(2)
    //     } else if (all > 660000 && all <= 960000) {
    //         tax = (all * 0.35).toFixed(2)
    //     } else if (all > 960000) {
    //         tax = (all * 0.45).toFixed(2)
    //     }
    //     let wage = (post_wage + basic_wage - deduction + reward - social_security - tax).toFixed(2)
    //     doc[0].deduction = deduction
    //     doc[0].reward = reward
    //     doc[0].social_security = social_security
    //     doc[0].tax = tax
    //     doc[0].wage = wage
    // }


    if (doc[0] != null) {
        ctx.body = {
            code: 200,
            result: doc,
        };
    } else {
        ctx.body = {
            code: 300
        }

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
const ExportPayroll = async (ctx) => {
    let data = await Wage.find()
    let model = [
        { displayName: '工号', access: 'id', type: 'string' },
        { displayName: '姓名', access: 'name', type: 'string' },
        { displayName: '所属部门', access: 'department', type: 'string' },
        { displayName: '岗位工资', access: 'post_wage', type: 'number' },
        { displayName: '基本工资', access: 'basic_wage', type: 'number' },
        { displayName: '考勤扣款', access: 'deduction', type: 'number' },
        { displayName: '全勤奖', access: 'reward', type: 'number' },
        { displayName: '奖金', access: 'bonus', type: 'number' },
        { displayName: '社保扣款', access: 'social_security', type: 'number' },
        { displayName: '个人所得税', access: 'tax', type: 'number' },
        { displayName: '总工资', access: 'wage', type: 'number' }
    ]
    let options = {
        'fileName': '工资单.xlsx',
        'path': './excel'
    }
    let fullpath = await read(data, model, options)
    let path = await fullpath.fullPath
    ctx.body = {
        code: 200,
        result: `http://localhost:3000/excel/工资单.xlsx`
    }

}

const DelXlsx = async (ctx) => {
    await setTimeout(() => {
        fs.unlinkSync('./excel/工资单.xlsx');
    }, 5000);
    ctx.body = {
        code: 200
    }
}
module.exports = {
    FindWage,
    UpdateWage,
    FindPayroll,
    ExportPayroll,
    DelXlsx
};
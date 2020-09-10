const Position = require('../db/db.js').Position;
const Staff = require('../db/db.js').Staff;
const Wage = require('../db/db.js').Wage;
//数据库的操作

const findDepartment = async (ctx) => {
    let doc = await Position.find()
    var count = await Position.find().count();
    ctx.body = {
        code: 200,
        result: doc,
        size: count
    };
    console.log('查询完毕');
}

//分页查询
const PageDepartment = async (ctx) => {
    let page = ctx.query.page - 1;
    var count = await Position.find().count();
    let doc = await Position.find().skip(page * 10).limit(10);
    ctx.body = {
        code: 200,
        result: doc,
        size: count
    };
}

const PagePosition = async (ctx) => {
    let page = ctx.query.page - 1;
    let doc = await Position.find().skip(page * 5).limit(5);
    let obj = await Position.find()
    var req = []
    var reqs = []
    doc.forEach(ele => {
        ele.position.forEach(ele => {
            req.push(ele)
        })
    })
    obj.forEach(ele => {
        ele.position.forEach(ele => {
            reqs.push(ele)
        })
    })
    var count = reqs.length
    ctx.body = {
        code: 200,
        result: req,
        size: count
    };
}

const findDepart = async (ctx) => {
    var page = ctx.request.body.pageNum - 1;
    var department = ctx.request.body.department;
    var doc;
    if (department == '') {
        // var count = await Position.find().count();
        doc = await Position.find().skip(page * 10).limit(10).sort({ id: 1 });
        ctx.body = {
            code: 200,
            size: 1,
            result: doc
        }
    } else {
        var obj = {}
        if (department != "") obj.department = department
        doc = await Position.find(obj).skip(page * 10).limit(10);
        // var count = await Position.find(obj).count();
        ctx.body = {
            code: 200,
            result: doc,
            size: 1
        };
    }
}

const find_Position = async (ctx) => {
    var page = ctx.request.body.pageNum - 1;
    var department = ctx.request.body.department;
    var position = ctx.request.body.position;
    var doc;
    if (department == '' && position == '') {
        let doc = await Position.find().skip(page * 5).limit(5);
        var req = []
        doc.forEach(ele => {
            ele.position.forEach(ele => {
                req.push(ele)
            })
        })
        var count = req.length
        ctx.body = {
            code: 200,
            result: req,
            size: count
        };
    } else if (position == '') {
        var obj = {}
        if (department != "") obj.department = department
        doc = await Position.find(obj).skip(page * 10).limit(10);
        doc[0].position.length

        var count = doc[0].position.length
        ctx.body = {
            code: 201,
            result: doc,
            size: count
        };
    } else {
        var obj = {}
        if (department != "") obj.department = department
        if (position != "") obj.position = position
        obj = {
            department: department,
        }
        doc = await Position.find(obj).skip(page * 10).limit(10);
        var a;
        doc[0].position.forEach(ele => {
            if (position == ele.position)
                a = [ele]
        })
        ctx.body = {
            code: 200,
            result: a,
            size: 1
        };
    }
}

//更新
const updatePosition = function (department, result) {
    return new Promise((resolve, reject) => {
        Position.findOneAndUpdate({ department: department }, {
            $addToSet: {
                "position": {
                    "department": department,
                    "position": result.position.position,
                    "claim": result.position.claim,
                    "post_wage": result.position.post_wage,
                    "position_function": result.position.position_function,
                }
            }
        }, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

const update_Department_function = function (department, result) {
    return new Promise((resolve, reject) => {
        Position.findOneAndUpdate({ department: department }, { $set: { 'department_function': result } }, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

const UpdateDepartment = async (ctx) => {
    let department = ctx.request.body.department;
    let result = ctx.request.body.department_function;
    await update_Department_function(department, result);
    ctx.body = {
        success: '更新成功',
        code: 200
    };
};

const addPosition = function (department, result) {
    return new Promise((resolve, reject) => {
        Position.findOneAndUpdate({ department: department }, {
            $push: {
                "position": {
                    "department": department,
                    "position": result.position.position,
                    "claim": result.position.claim,
                    "post_wage": result.position.post_wage,
                    "position_function": result.position.position_function,
                }
            }
        }, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};

const delPosition = function (department, result) {
    return new Promise((resolve, reject) => {
        Position.updateOne({ department: department }, {
            $pull: {
                "position": {
                    "position": result
                }
            }
        }, err => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};


const UpdatePosition = async (ctx) => {
    let department = ctx.request.body.department;
    let claim = ctx.request.body.claim;
    let post_wage = ctx.request.body.post_wage;
    let position = ctx.request.body.position;
    let position_function = ctx.request.body.position_function
    await delPosition(department, position);
    var doc = {
        position: {
            claim: claim,
            position_function: position_function,
            post_wage: post_wage,
            position: position
        },
    }
    await updatePosition(department, doc)
    await Wage.updateMany({ position: position }, { $set: { post_wage: post_wage, reward: 0, social_security: 0, tax: 0, wage: 0, deduction: 0 } })
    ctx.body = {
        success: '更新成功',
        code: 200
        // result: doc
    };
};
const findAllPosition = async (ctx) => {
    let department = ctx.request.body.department
    let doc = await Position.find({ 'department': department })
    ctx.body = {
        code: 200,
        result: doc[0].position
    };
    console.log('查询完毕');
}

//添加部门
const Add_Department = async (ctx) => {
    let department = ctx.request.body.depart;
    let department_function = ctx.request.body.department_function
    let position = new Position({
        department: department,
        department_function: department_function
        //添加字段
    });
    let doc = await Position.findOne({ 'department': department });
    await new Promise((resolve, reject) => {
        if (!doc) {
            position.save((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
            ctx.body = {
                code: 200,
                msg: '部门添加成功'
            }
        } else {
            console.log('部门已存在');
            ctx.body = {
                code: 201,
                msg: '部门已存在'
            }
            resolve();
        }
    })
};

//添加职位
const Add_Position = async (ctx) => {
    const department = ctx.request.body.department;
    const position = ctx.request.body.position;
    const post_wage = ctx.request.body.post_wage;
    const position_function = ctx.request.body.position_function;
    const claim = ctx.request.body.claim;
    var doc = {
        position: {
            claim: claim,
            position_function: position_function,
            post_wage: post_wage,
            position: position
        },
    }
    let obj = await Position.find({ 'department': department });
    let arr = obj[0].position
    var Pa;
    arr.forEach(ele => {
        if (ele.position == position)
            Pa = true
    })
    await new Promise((resolve, reject) => {
        if (Pa) {
            console.log('职位已存在');
            ctx.body = {
                code: 201,
                msg: '职位已存在'
            }
            resolve();
        } else {
            addPosition(department, doc)
            ctx.body = {
                code: 200,
                msg: '职位添加成功'
            }
            resolve();
        }
    })
}

const DelPosition = async (ctx) => {
    let department = ctx.request.body.department
    let position = ctx.request.body.position
    let obj = await Staff.find({ job: position })
    if (obj[0] != null) {
        ctx.body = {
            code: 201,
            msg: '该职位有人,禁止删除'
        }
    } else {
        await delPosition(department, position)
        ctx.body = {
            code: 200,
            msg: '删除成功'
        }
    }
}

module.exports = {
    findDepartment,
    DelPosition,
    find_Position,
    PageDepartment,
    PagePosition,
    UpdateDepartment,
    UpdatePosition,
    findAllPosition,
    Add_Department,
    Add_Position,
    findDepart
};

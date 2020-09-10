//接收上传的excel文件，保存解析返回objects
const xlsx = require('xlsx');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const downPath = path.resolve(__dirname, '../excel');

async function getExcelObjs(ctx) {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.path); // 创建可读流 
    const ext = file.name.split('.').pop(); // 获取上传文件扩展名
    const filePath = `${downPath}/考勤表.${ext}`;
    const upStream = fs.createWriteStream(filePath); // 创建可写流
    const getRes = await getFile(reader, upStream); //等待数据存储完成
    const datas = []; //可能存在多个sheet的情况
    if (!getRes) { //没有问题
        const workbook = xlsx.readFile(filePath);
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', ...]
        for (const sheetName of sheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet);
            datas.push(data);
        }
        let arr = await attendance(datas[0], file.name)
        return {
            status: true,
            datas,
            arr
        };
    } else {
        return {
            status: false,
            msg: '上传文件错误'
        };
    }
}

function getFile(reader, upStream) {
    return new Promise(function (result) {
        let stream = reader.pipe(upStream); // 可读流通过管道写入可写流
        stream.on('finish', function (err) {
            result(err);
        });
    });
}

function myMonth(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}
function attendance(res, val) {
    var num = val.substring(0, 7);
    let year = moment(num).format("YYYY");
    let month = moment(num).format("MM");
    let days = myMonth(year, month);
    var obj = [];
    for (var i = 0; i < res.length; i += 2) {
        obj.push({
            id: res[i][3],
            name: res[i][11],
            1: res[i + 1][1],
            2: res[i + 1][2],
            3: res[i + 1][3],
            4: res[i + 1][4],
            5: res[i + 1][5],
            6: res[i + 1][6],
            7: res[i + 1][7],
            8: res[i + 1][8],
            9: res[i + 1][9],
            10: res[i + 1][10],
            11: res[i + 1][11],
            12: res[i + 1][12],
            13: res[i + 1][13],
            14: res[i + 1][14],
            15: res[i + 1][15],
            16: res[i + 1][16],
            17: res[i + 1][17],
            18: res[i + 1][18],
            19: res[i + 1][19],
            20: res[i + 1][20],
            21: res[i + 1][21],
            22: res[i + 1][22],
            23: res[i + 1][23],
            24: res[i + 1][24],
            25: res[i + 1][25],
            26: res[i + 1][26],
            27: res[i + 1][27],
            28: res[i + 1][28],
            29: res[i + 1][29],
            30: res[i + 1][30],
            31: res[i + 1][31]
        });
    }
   return attend(obj, year, month, days)
}

function attend(row, year, month, days) {
    var late = 0;//迟到早退次数
    var absenteeism = 0;//旷工4小时以内次数
    var absenteeisms = 0;//旷工4到8小时次数
    var arr = []
    row.forEach((ele,index) => {
        for (var m = 1; m <= days; m++) {
            if (moment(`${year}-${month}-${m}`).format("d") != 0 &&
                moment(`${year}-${month}-${m}`).format("d") != 6) {
                if (ele[m] != undefined) {
                    var start = ele[m].substring(0, 5);
                    var end = ele[m].substring(ele[m].length - 5);
                    var compared = "9:00";
                    var compared2 = "18:00";
                    var start_time = new Date(
                        `${year}-${month}-${m} ${start}`
                    );
                    var end_time = new Date(`${year}-${month}-${m}-${end}`);
                    var start_compared = new Date(
                        `${year}-${month}-${m} ${compared}`
                    );
                    var end_compared = new Date(
                        `${year}-${month}-${m} ${compared2}`
                    );
                    var morning_time =
                        timeCompare(start_time, start_compared) / 1000;
                    var evening_time = timeCompare(end_time, end_compared) / 1000;
                    if (morning_time > 59 && morning_time <= 1859) {
                        late++;
                    } else if (morning_time > 1860 && morning_time <= 14459) {
                        absenteeism++;
                    } else if (morning_time > 14460 && morning_time <= 28859) {
                        absenteeisms++;
                    } else if (evening_time > -1800 && evening_time < -59) {
                        late++;
                    } else if (evening_time > -14459 && evening_time < -1800) {
                        absenteeism++;
                    } else if (evening_time > -28859 && evening_time < -14460) {
                        absenteeisms++;
                    }
                } else {
                    absenteeisms++;
                }
            }
            ele.late=late
            ele.absenteeism=absenteeism
            ele.absenteeisms=absenteeisms
        }
        late = 0;
        absenteeism = 0;
        absenteeisms = 0;
    });
    return row
}

function timeCompare(start_time, end_Time) {
    var startTime = new Date(start_time);
    var endTime = new Date(end_Time);
    var time = startTime.getTime() - endTime.getTime();
    //进行比较
    return time;
}
module.exports = {
    getExcelObjs
};

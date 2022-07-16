import moment from 'moment';

//获取日期所在周
function getWeekDays(weekStart) {
	const days = [weekStart];
	for (let i = 1; i < 7; i += 1) {
		days.push(moment(weekStart).add(i, 'days').toDate());
	}
	return days;
}

function getWeekRange(date) {
	return {
		from: moment(date).startOf('week').add('days', 1).toDate(),
		to: moment(date).endOf('week').add('days', 1).toDate(),
	};
}

const dayFmtMap = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
};

export default {
    init(fmt, date = new Date()) {
        date = new Date(date)
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds(),
        };
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return fmt;
    },
    getFirstDay(type, date = new Date()) {
        if (type === 'month') {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        } else if (type === 'week') {
            return new Date(date.valueOf() - date.getDay() * 1000 * 60 * 60 * 24);
        }
    },
    _i18n: {
        previousMonth: '上月',
        nextMonth: '下月',
        months: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月',
        ],
        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
    },
    getDayListOfMonth(
        year = new Date().getFullYear(),
        month = new Date().getMonth()
    ) {
        /**
         * 获取一个月的所有日期数&星期数
         */
        let end = new Date(year, month + 1, 1);
        let start = new Date(year, month, 1);
        let days = (end - start) / 1000 / 60 / 60 / 24;
        let dayList = [];
        for (let i = 1; i <= days; i++) {
            dayList.push({
                date: i,
                dayOfWeek: dayFmtMap[new Date(year, month, i).getDay()],
                timeStamp: new Date(year, month, i).getTime(),
            });
        }
        return dayList;
    },
    getDate(index) {
        //获取近几天日期
        let newDate = new Date();
        newDate.setDate(newDate.getDate() + index);
        const month = newDate.getMonth() < 9
            ? '0' + (newDate.getMonth() + 1)
            : newDate.getMonth() + 1;
        const day = newDate.getDate() < 10
            ? '0' + newDate.getDate()
            : newDate.getDate();
        return newDate.getFullYear() + '-' + month + '-' + day;
    },
    getMonthsNum(sMon, eMon) {
        if (eMon.getFullYear() === sMon.getFullYear()) {
            return eMon.getMonth() - sMon.getMonth() + 1;
        } else {
            let sMonsNum = 12 - sMon.getMonth() + 1;
            let eMonsNum = eMon.getMonth();
            let cMonsNum = (eMon.getFullYear() - sMon.getFullYear() - 1) * 12;
            return sMonsNum + cMonsNum + eMonsNum;
        }
    },
    getTimeFormat(type) {
        let formatOpts = ['DD日HH时', 'MM/DD', 'MM/DD', 'MM'];
        return formatOpts[type];
    },
    getThisFullWeek(date) {
        return getWeekDays(getWeekRange(date).from)
    },
    getThisMonthLastDay(year, month) {
        month = parseInt(month, 10);
        let d = new Date(year, month, 0);
        return d.getDate();
    }
};

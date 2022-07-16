export default {
    rules: [
        // 用户信息
        {
            url: '/api/v1/user',
            responsewith: '../src/mock/home/user.json'
        },
        // topkeen
        {
            url: '/api/v1/auth',
            responsewith: '../src/mock/home/auth.json'
        },
        // 学期学年
        {
            url: '/api/v1/info/terms',
            responsewith: '../src/mock/teachinfo/term/term.json'
        },
        // 教室信息
        {
            url: '/api/v1/info/classrooms',
            responsewith: '../src/mock/teachinfo/classroom/classroom.json'
        },
        // 学生信息
        {
            url: '/api/v1/students',
            responsewith: '../src/mock/teachinfo/student/students.json'
        },
        // 教师信息
        {
            url: '/api/v1/teachers',
            responsewith: '../src/mock/teachinfo/teacher/teachers.json'
        },
        // 班级信息
        {
            url: '/api/v1/classes',
            responsewith: '../src/mock/teachinfo/classmateInfo/classmateInfo.json'
        },
        // 课程信息
        {
            url: '/api/v1/info/courses',
            responsewith: '../src/mock/teachinfo/lessonInfo/lessonInfo.json'
        },
        // 课节信息
        {
            url: '/api/v1/info/lessonindexs',
            responsewith: '../src/mock/teachinfo/courseNum/courseNum.json'
        },
        // 设备管理
        {
            url: '/api/v1/screens',
            responsewith: '../src/mock/screen/screen.json'
        },
        // 个人考勤
        {
            url: '/api/v1/attendance/students',
            responsewith: '../src/mock/attendAnalysis/personalAttend.json'
        },
        {
            url: '/api/v1/attendance/student',
            responsewith: '../src/mock/attendAnalysis/personalAttend/personal-see.json'
        },
        // 班级考勤
        {
            url: '/api/v1/info/lessontables',
            responsewith: '../src/mock/attendAnalysis/classmateAttend/classroom-lesssontables.json'
        },
        {
            url: '/api/v1/attendance/class',
            responsewith: '../src/mock/attendAnalysis/classmateAttend/classroom-class.json'
        },
        // 历史纪录
        {
            url: '/api/v1/event/events',
            responsewith: '../src/mock/historyRecord/historyRecord.json'
        },
        // 行为分析
        {
            url: '/api/v1/be/event/line',
            responsewith: '../src/mock/behaviorAnalysis/getBehaviorAnalysisLine.json'
        }
        
    ]
}
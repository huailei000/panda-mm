export default {
    menuList: [
        {
            id: 62,
            codeName: '/home',
            name: '首页',
            children: []
        },
        {
            id: 63,
            name: '教务管理',
            codeName: '/teachinfo',
            children: [
                {
                    id: 81,
                    name: '学期学年',
                    codeName: '/teachinfo/term',
                    parentId: 63
                },
                {
                    id: 80,
                    name: '教室信息',
                    codeName: '/teachinfo/classroom',
                    parentId: 63
                },
                {
                    id: 83,
                    name: '学生信息',
                    codeName: '/teachinfo/student',
                    parentId: 63
                },
                {
                    id: 82,
                    name: '教师信息',
                    codeName: '/teachinfo/teacher',
                    parentId: 63
                },
                {
                    id: 84,
                    name: '班级信息',
                    codeName: '/teachinfo/classmateInfo',
                    parentId: 63
                },
                {
                    id: 86,
                    name: '课程信息',
                    codeName: '/teachinfo/lessonInfo',
                    parentId: 63
                },
                {
                    id: 85,
                    name: '课程节次',
                    codeName: '/teachinfo/courseNum',
                    parentId: 63
                }
            ]
        },
        {
            id: 64,
            codeName: '/sheetmanage',
            name: '课表管理',
            children: []
        },
        {
            id: 65,
            name: '考勤分析',
            codeName: '/attendAnalysis',
            children: [
                {
                    id: 90,
                    name: '班级考勤',
                    codeName: '/attendAnalysis/classmateAttend',
                    parentId: 65
                },
                {
                    id: 91,
                    name: '个人考勤',
                    codeName: '/attendAnalysis/personalAttend',
                    parentId: 65
                }
            ]
        },
        // {
        //     id: 70,
        //     name: '行为统计分析',
        //     codeName: '/behaviorAnalysis',
        //     children: [],
        // },
        {
            id: 67,
            name: '历史记录',
            codeName: '/historyRecord',
            children: [
                // {
                //     id: 100,
                //     name: '识别历史',
                //     codeName: '/historyRecord/recognitionHistory',
                //     parentId: 67
                // },
                // {
                //     id: 101,
                //     name: '表情记录',
                //     codeName: '/historyRecord/faceRecord',
                //     parentId: 67
                // },
                // {
                //     id: 102,
                //     name: '行为记录',
                //     codeName: '/historyRecord/behaviorRecord',
                //     parentId: 67
                // }
            ]
        },
        {
            id: 68,
            codeName: '/screen',
            name: '设备管理',
            children: []
        }
        // {
        //     id: 69,
        //     codeName: '/accountManage',
        //     name: '账号管理',
        //     children: []
        // }
    ],

    PandaMenuMap: {
        首页: '/home',
        教务管理: '/teachinfo',
        课表管理: '/sheetmanage',
        考勤统计分析: '/attendAnalysis',
        行为统计分析: '/behaviorAnalysis',
        历史记录: '/historyRecord',
        设备管理: '/screen',
        // 账号管理: '/accountManage',
        // 关于我们: '/aboutUs',
        // 设置: '/setUp',
        教室信息: '/teachinfo/classroom',
        学期学年: '/teachinfo/term',
        教师信息: '/teachinfo/teacher',
        学生信息: '/teachinfo/student',
        班级信息: '/teachinfo/classmate',
        课程节次: '/teachinfo/courseNum',
        课程信息: '/teachinfo/lesson',
        班级考勤: '/attendAnalysis/classmateAttend',
        个人考勤: '/attendAnalysis/personalAttend'
        // 识别历史: '/historyRecord/recognitionHistory',
        // 表情记录: '/historyRecord/faceRecord',
        // 行为记录: '/historyRecord/behaviorRecord'
    }
};

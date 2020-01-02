'use strict';

module.exports = function(router) {
  router.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      res.json({
        status: 0,
        data: '登录成功'
      });
      return;
    }

    res.json({
      status: 100,
      msg: '用户名或密码错误'
    });
  });

  router.post('/api/user/logout', (req, res) => {
    res.json({
      status: 0,
      data: '退出成功'
    })
  });

  router.get('/api/user/profile', (req, res) => {
    res.json({
      status: 0,
      data: {
        name: 'sense',
        avatar: '/public/avatar-example.jpg',
        uid: '448214643'
      }
    });
  });

  router.get('/api/user/permissions', (req, res) => {
    res.json({
      status: 0,
      data: [
        {
          name: 'dashboard',
          key: '1'
        },
        {
          name: '列表',
          key: '2'
        },
        // {
        //   name: '子列表1',
        //   key: '21'
        // },
        {
          name: '子列表2',
          key: '22'
        },
        {
          name: '子列表1-详情',
          key: '211'
        },
        {
          name: '列表1-删除',
          key: '212'
        },
        {
          name: '表单',
          key: '3'
        },
        {
          name: '标准表单',
          key: '31'
        }
      ]
    })
  });

  router.get('/api/fake/list', (req, res) => {
    const list = [
      {
        name: '张三',
        age: 22,
        motto: '承认问题是解决问题的第一步。'
      },
      {
        name: '李四',
        age: 23,
        motto: '朝闻道，夕死可矣。'
      },
      {
        name: '王五',
        age: 24,
        motto: '懒惰包含着永久的失望。'
      },
      {
        name: '赵六',
        age: 25,
        motto: '工欲善其事，必先利其器。'
      },
      {
        name: '孙七',
        age: 26,
        motto: '过也，人皆见之；更也，人皆仰之。'
      }
    ];

    res.json({
      status: 0,
      data: {
        page: req.query.page,
        pageSize: req.query.pageSize,
        total: list.length,
        list
      }
    });
  });
}

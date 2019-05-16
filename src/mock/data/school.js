import Mock from 'mockjs';

const Schools = [];

for (let i = 0; i < 500; i++) {
  Schools.push(Mock.mock({
    id: Mock.Random.guid(),
    schoolid: i+1,
    schoolname: Mock.Random.cname(),
    schoolengname: Mock.Random.cname(),
    schooltype: '',
    schoolgraduatetype: '年级',
    schooltag: '',
    schooladdr: Mock.mock('@county(true)'),
    schoolpos: { latitude:Mock.Random.float(0, 180, 3, 8), longitude:Mock.Random.float(0, 180, 3, 8) },
    organization: '',
    area: '',
    creator: 'admin',
    create_time: Mock.Random.date(),
    modified_time: Mock.Random.date()
  }));
}

export { Schools };
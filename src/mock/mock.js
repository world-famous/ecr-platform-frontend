import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Course } from './data/course';
import { Package } from './data/package';
import { Subject } from './data/subject';

let _Course = Course;
let _Package = Package;
let _Subject = Subject;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    mock.onPost('/signup').reply(config => {
      let {role, username, password, mobile, smskey, realname, school, major} = JSON.parse(config.data).params;
      return new Promise((resolve, reject) => {
        let user = JSON.stringify({
          role: role, 
          username: username, 
          password: password, 
          mobile: mobile, 
          smskey: smskey, 
          realname: realname, 
          school: school, 
          major: major
        });
        setTimeout(() => {
            resolve([200, { code: 200, msg: '注册', user }]);
        }, 1000);
      });
    });

    mock.onGet('/course/tree').reply(config => {
      let mockCourse = _Course;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([200, {
              course: mockCourse
          }]);
        }, 100);
      });
    });

    mock.onGet('/resource/downloadResource').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([200, {
              responseEntity: {
                responseRes: 200,
                downloadurl: FRONTEND_CONTEXT + 'download/download.php'
              }
          }]);
        }, 100);
      });
    });

    mock.onPost('/package/getPackageList').reply(config => {
      let mockPackage = _Package;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([200, {
              responseEntity: {
                responseRes: 200,
                responseMessage: 'Success'
              },
              pageInfo: {
                list:mockPackage,
                total: 4
              }
          }]);
        }, 100);
      });
    });

    mock.onGet('/package/getPackage').reply(config => {
      let mockPackage = _Package[0];
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            mockPackage.responseRes = 200;
            resolve([200, {
              responseEntity: mockPackage
          }]);
        }, 100);
      });
    });

    mock.onGet('/package/getPackageGradeList').reply(config => {
      let mockPackageGrades = [
        { gradeid:5, gradename:'五年级' },
        { gradeid:6, gradename:'六年级' },
      ];
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([200, {
              responseEntity: {
                responseRes: 200,
                responseMessage: 'Success'
              },
              pageInfo: {
                list:mockPackageGrades,
                total: 2
              }
          }]);
        }, 100);
      });
    });

    mock.onPost('/package/getPackageSubjectList').reply(config => {
      let mockSubjects = _Subject;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([200, {
              responseEntity: {
                responseRes: 200,
                responseMessage: 'Success'
              },
              pageInfo: {
                list:mockSubjects,
                total: 4
              }
          }]);
        }, 100);
      });
    });
  }
};
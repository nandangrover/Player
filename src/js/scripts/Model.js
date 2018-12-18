//  import * as controllerObj from './Controller'

class Model {
    constructor() {
        this.courseData;
        this.assessmentData = [];
        this.jsonData = {};
        this.screenData = {};

    }
    setCourseData(_data, name) {
        this.jsonData[`${name}`] = _data;
    }
    getCourseData() {
        return this.jsonData;
    }
    setScreenData(_data) {
        this.screenData = _data;
    }
    getScreenData(_data) {
        return this.screenData
    }
    setAssesmentData(_dataObj) {
        this.assessmentData.push(_dataObj)
    }
    getAssesmentData(_dataObj) {
        return this.assessmentData
    }

}
let modelObj = new Model();
export {
    modelObj
}
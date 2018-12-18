import {
    modelObj
} from './Model';

class Util {
    constructor() {
        this.objectName;
        this.promises = [];
        this.screenData = {};
    }
    loadJson(path) {
        if (path.split('/')[1].split('.')[0] === 'courseStructure') {
            this.objectName = path.split('/')[1].split('.')[0]
        } else {
            this.objectName = path.split('/')[1] + '_' + path.split('/')[2].split('.')[0];
        }
        let promise = new Promise((resolve, reject) => {
            $.getJSON(path, (_data) => {}).done((_data) => {
                resolve(_data);
            })
        });
        promise.then((res) => {
            modelObj.setCourseData(res, this.objectName)
        })
        return promise;
    }

    loadScreenData(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.promises[i] = new Promise((resolve, reject) => {
                $.getJSON(arr[i], (_data) => {}).done((_data) => {
                    this.screenData[`${arr[i].split('/')[1]}_${arr[i].split('/')[2].split('.')[0]}`] = _data;
                    resolve();
                    // console.log(this.screenData);

                })
            });
        }
        Promise.all(this.promises).then((res) => {
            modelObj.setScreenData(this.screenData)
        })
        return this.promises;

    }
    jumpToScreen(para) {
        document.dispatchEvent(new CustomEvent("jumpToScreen", {
            detail: {
                index: para
            }
        }));
    }
}
let utilObj = new Util();
window.utilObj = utilObj;
export {
    utilObj
}
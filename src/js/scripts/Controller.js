// import _ from 'lodash';
import {
    modelObj
} from './Model';
import {
    utilObj
} from './Util';
import {
    EventBus
} from './EventBus';

import './../../css/main.css';

EventBus.addEventListener("screenCompletion", () => {
    controllerObj.screenCompletion(event)
}, this);

EventBus.addEventListener("hideLoader", () => {
    controllerObj.hideLoader(event)
}, this);

document.addEventListener("jumpToScreen", (event) => {
    controllerObj.jumpToScreen(event.detail.index);
});

class Controller {
    constructor() {
        this.globalCounter = 1;
        this.elemObj = {};
        this.screenData = [];
        this.elemObj.path = [];
        this.screenInfo = {};
        this.elemObj.visisted = [];
    }
    init(_dataObj) {
        this.loadSequence({
            loadNext: 'makeLoader'
        })
    }
    loadSequence(_dataObj) {
        switch (_dataObj.loadNext) {
            case 'makeLoader':
                this.makeLoader();
                break;
            case 'loadCourseConfig':
                this.loadCourseConfig();
                break;
            case 'loadScreenData':
                this.loadScreenData();
                break;
            case 'loadTemplates':
                this.loadTemplates();
                break;
        }
    }
    makeLoader() {
        this.elemObj['pageLoader'] = $('<div>', {
            class: 'pageLoader'
        });
        this.elemObj['pageBlocker'] = $('<div>', {
            class: 'pageBlocker'
        });
        $(".main-wrapper").append(this.elemObj['pageLoader']);
        $(".main-wrapper").append(this.elemObj['pageBlocker']);
        this.loadSequence({
            loadNext: 'loadCourseConfig'
        })
    }
    showLoader() {
        this.elemObj['pageLoader'].show();
        this.elemObj['pageBlocker'].show();
    }

    hideLoader() {
        this.elemObj['pageLoader'].hide();
        this.elemObj['pageBlocker'].hide();
    }
    loadCourseConfig() {
        this.showLoader();
        utilObj.loadJson("config/courseStructure.json").then((res) => {
            this.courseData = modelObj.getCourseData()[`courseStructure`];
            this.loadSequence({
                loadNext: 'loadScreenData'
            })
        })
    }

    loadScreenData() {
        for (let i = 1; i <= this.courseData.screens.length; i++) {
            this.elemObj.path.push(`courses/screen_${i}/config.json`)
        }

        for (let i = 1; i <= this.courseData.screens.length; i++) {
            this.elemObj.path.push(`courses/screen_${i}/text.json`)
        }
        // utilObj.loadScreenData(this.elemObj.path)

        Promise.all(utilObj.loadScreenData(this.elemObj.path)).then((res) => {
            this.screenInfo = modelObj.getScreenData(this.screenData)
            this.loadSequence({
                loadNext: 'loadTemplates'
            })

        })
    }
    loadTemplates() {
        // const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
        this.showLoader();
        this.screenName = this.courseData.screens[this.globalCounter - 1].name;
        this.elemObj.templateWrapper = $('<div>', {
            class: `templateWrapper_${this.globalCounter}`
        })
        $('.main-wrapper').append(this.elemObj.templateWrapper)
        this.elemObj.templateData = {
            activityData: modelObj.getScreenData()[`screen_${this.globalCounter}_config`],
            textData: modelObj.getScreenData()[`screen_${this.globalCounter}_text`],
            screenName: this.screenName,
            templateWrapper: this.elemObj.templateWrapper
        };
        import(`./../templates/js/${this.courseData.screens[this.globalCounter - 1].className}`).then(module => {
            let templateObj = module.default;
            let tempObj = new templateObj(this.elemObj.templateData);
            tempObj.init();
            this.screenData.pop();
            this.screenData.push(tempObj)
        });
        console.log(`ScreenName: ${this.courseData.screens[this.globalCounter - 1].name} class: ${this.courseData.screens[this.globalCounter - 1].className}`);
    }
    jumpToScreen(index) {
        this.showLoader();
        this.destroyTemplate(this.globalCounter)
        this.globalCounter = index;
        this.screenName = this.courseData.screens[index - 1].name;
        this.elemObj.templateWrapper = $('<div>', {
            class: `templateWrapper_${this.globalCounter}`
        })
        $('.main-wrapper').append(this.elemObj.templateWrapper)
        this.elemObj.templateData = {
            activityData: modelObj.getScreenData()[`screen_${index}_config`],
            textData: modelObj.getScreenData()[`screen_${index}_text`],
            screenName: this.screenName,
            templateWrapper: this.elemObj.templateWrapper
        };
        import(`./../templates/js/${this.courseData.screens[index - 1].className}`).then(module => {
            let templateObj = module.default;
            let tempObj = new templateObj(this.elemObj.templateData);
            tempObj.init();
            this.screenData.pop();
            this.screenData.push(tempObj)
        });
        console.log(`ScreenName: ${this.courseData.screens[this.globalCounter - 1].name} class: ${this.courseData.screens[this.globalCounter - 1].className}`);
    }
    screenCompletion(event) {
        this.destroyTemplate(this.globalCounter)
        try {
            if (this.elemObj.visisted[this.globalCounter] === undefined) {
                this.elemObj.visisted[this.globalCounter] = true;
                modelObj.setAssesmentData(this.screenData[0].getData())
            }
        } catch (error) {
            console.log("Move forward");
        }
        this.globalCounter += 1;
        if (this.globalCounter > this.courseData.screens.length) {
            console.log("course complete");
        } else {
            this.loadSequence({
                loadNext: 'loadTemplates'
            })
        }
    }
    destroyTemplate(index) {
        this.screenData[0].destroy();
        $(`.templateWrapper_${index}`).remove()
    }

}
let controllerObj = new Controller();
controllerObj.init();
export {
    controllerObj
}
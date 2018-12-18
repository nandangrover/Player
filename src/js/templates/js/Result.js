import {
    modelObj
} from '../../scripts/Model';
import {
    EventBus
} from '../../scripts/EventBus';

export default class Result {
    constructor(_dataObj) {
        this.activityData = _dataObj.activityData;
        this.textData = _dataObj.textData;
        this.screenName = _dataObj.screenName
        this.elemObj = {};

    }
    init() {
        this.elemObj.defaultPath = this.activityData[`${this.screenName}`].createElements
        Object.keys(this.elemObj.defaultPath).forEach(key => {
            this.elemObj[key] = $(`<${this.elemObj.defaultPath[`${key}`].type}>`, {
                class: `${this.elemObj.defaultPath[`${key}`].class}`,
                id: `${this.elemObj.defaultPath[`${key}`].id}`
            });
            if (this.elemObj.defaultPath[`${key}`].append === undefined) {
                $('body').append(this.elemObj[key])
            }
            $(`.${this.elemObj.defaultPath[`${key}`].append}`).append(this.elemObj[key])
            $(this.elemObj[key]).css(this.elemObj.defaultPath[`${key}`].css)
            if (this.textData[`${this.screenName}`].elementsData[`${key}`] !== undefined) {
                $(this.elemObj[key]).html(this.textData[`${this.screenName}`].elementsData[`${key}`])
            }
            if (this.elemObj.defaultPath[`${key}`].type === 'button') {
                this.elemObj[key].select = false;
                $(this.elemObj[key]).on('click', () => {
                    this.clickHandler();
                })
            }
        });
        EventBus.dispatch("hideLoader", this);
        this.showResult();
    }

    showResult() {
        // $('.result').html(`${modelObj.getAssesmentData()[0].result}`)
        this.elemObj.tempVar = 0;
        for (let i = 0; i < modelObj.getAssesmentData().length; i++) {
            console.log(modelObj.getAssesmentData()[i].result);
            if (modelObj.getAssesmentData()[i].result) {
                this.elemObj.tempVar += 1;
            }
        }
        this.elemObj.resultPercent = (this.elemObj.tempVar / modelObj.getAssesmentData().length) * 100;
        console.log(this.elemObj.resultPercent);

        $('.resultIndicator').animate({
            width: `${this.elemObj.resultPercent}%`
        }, 2000)
        $('.resultText').html(`Your score is: ${this.elemObj.resultPercent}%`)
        $('.resultText').fadeIn(1000)
    }
    clickHandler() {
        this.elemObj.id = event.target.id.split('_');
        switch (this.elemObj.id[0]) {
            case 'submitButton':
                EventBus.dispatch("screenCompletion", this);
                break;
        }
    }
    destroy() {
        this.elemObj = null;
        $('.wrapper').remove();
    }

}
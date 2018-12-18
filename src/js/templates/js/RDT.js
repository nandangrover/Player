import {
    modelObj
} from '../../scripts/Model';
import {
    EventBus
} from '../../scripts/EventBus';

export default class RDT {
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
        this.mcqLogic();
    }
    mcqLogic() {
        this.elemObj.correctcount = 0;
        for (let i = 0; i < this.activityData[`${this.screenName}`].anskey.length; i++) {
            if (this.activityData[`${this.screenName}`].anskey[i]) {
                this.elemObj.correctcount += 1;
            }
        }
        EventBus.dispatch("hideLoader", this);
    }

    clickHandler() {

        this.elemObj.id = event.target.id.split('_');
        switch (this.elemObj.id[0]) {
            case 'checkBox':
                console.log(this.elemObj[`${event.target.id}`].select);

                if (!this.elemObj[`${event.target.id}`].select) {
                    $(`#selected_${this.elemObj.id[1]}`).show();
                    this.elemObj[`${event.target.id}`].select = !this.elemObj[`${event.target.id}`].select;
                    if (this.elemObj.tempId !== undefined) {
                        console.log(this.elemObj.tempId);

                        $(`#selected_${this.elemObj.tempId}`).hide();
                        this.elemObj[`checkBox_${this.elemObj.tempId}`].select = false;
                        this.elemObj.tempId = this.elemObj.id[1];
                    } else {
                        this.elemObj.tempId = this.elemObj.id[1];
                    }
                }
                break;
            case 'prevButton':
                this.elemObj.tempName = Number(this.screenName.split('_')[1]) - 1
                if (this.elemObj.tempName) {
                    document.dispatchEvent(new CustomEvent("jumpToScreen", {
                        detail: {
                            index: this.elemObj.tempName
                        }
                    }));
                }
                break;
            case 'submitButton':
                this.elemObj.selectedBox = 0;


                for (let i = 0; i < this.activityData[`${this.screenName}`].anskey.length; i++) {
                    if (this.elemObj[`checkBox_${i}`].select === true && this.activityData[`${this.screenName}`].anskey[i] === true) {
                        this.elemObj.selectedBox += 1;
                    } else if (this.elemObj[`checkBox_${i}`].select != this.activityData[`${this.screenName}`].anskey[i]) {
                        this.elemObj.selectedBox -= 1;
                    }
                }
                if (this.elemObj.selectedBox === this.elemObj.correctcount) {
                    this.assessmentData = {
                        screen: `${this.screenName}`,
                        result: true
                    }
                    this.getData()
                    EventBus.dispatch("screenCompletion", this);
                } else {
                    this.assessmentData = {
                        screen: `${this.screenName}`,
                        result: false
                    }
                    this.getData()
                    EventBus.dispatch("screenCompletion", this);
                }
                break;
        }

    }
    getData() {
        return this.assessmentData;
    }
    destroy() {
        this.elemObj = null;
    }

}
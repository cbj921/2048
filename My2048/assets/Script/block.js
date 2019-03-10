
let colors = require("colors");

cc.Class({
    extends: cc.Component,

    properties: {
        labelNum:{
            default: null,
            type: cc.Label
        }
    },

    setNumber: function(number){
        if(number == 0 ) this.labelNum.node.active = false;
        else{
            this.labelNum.string = number;
            this.labelNum.node.active = true;
            
            if(number in colors) {
                this.node.color = colors[number];
            }
        }
    },



});

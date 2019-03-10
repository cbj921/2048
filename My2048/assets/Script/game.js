
const ROWS = 4;
const NUMBERS =[2,4];

cc.Class({
    extends: cc.Component,

    properties: {

        blockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        // 获取layout所在Node
        layoutNode: {
            default: null,
            type: cc.Node,
        },
        // 获取 layout 组件
        blockLayout: {
            default: null,
            type: cc.Layout,
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
    },

    /**
     * @description: 
     * @param {Number}  xDimension:一维数组的长度
     * @param {Number}  yDimension:一维数组中每个元素的长度
     * @return: twoArray 返回一个二维数组
     */
    arrayInit: function (xDimension, yDimension) {
        let blockArr = new Array(); // 先声明一维数组
        for (let i = 0; i < xDimension; i++) {
            blockArr[i] = new Array();
            for (let j = 0; j < yDimension; j++) {
                blockArr[i][j] = 0;
            }
        }
        return blockArr;
    },

    /**
     * @description: 初始游戏方块的生成
     * @param {} 
     * @return: block[] 数组
     */
    blockInit: function () {
        this.blockArr = this.arrayInit(ROWS, ROWS);

        let layoutWidth = this.layoutNode.width;
        let blockGap = this.blockLayout.spacingX;
        this.blockLayout.cellSize.width = (layoutWidth - (ROWS - 1) * blockGap) / ROWS;
        this.blockLayout.cellSize.height = this.blockLayout.cellSize.width;

        // 将预制体资源放入二维数组中
        for (let n = 0; n < ROWS; n++) {
            for (let i = 0; i < ROWS; i++) {
                let block = cc.instantiate(this.blockPrefab);
                this.layoutNode.addChild(block);
                block.getComponent("block").setNumber(0); // 初始化数字 0 时候方块样子 
                this.blockArr[n][i] = block;
            }
        }
        
    },

    /**
     * @description: 更新数字标签 
     * @param {Number} number:传入更新的数字 
     * @return: null 
     */
    updateScore: function (number) {
        let score = number;
        this.scoreLabel.string = "分数：" + number;
    },

    /**
     * @description: 游戏初始化
     * @param {type} 
     * @return: 
     */
    gameInit: function () {
        this.updateScore(0);
        this.data = this.arrayInit(ROWS, ROWS); // 用来存储每一个游戏块的数值
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                this.blockArr[row][col].getComponent("block").setNumber(0);
                this.data[row][col] = 0;
            }
        }
        // 随机生成数字块 2 or 4 ;
        this.addBlock();
        this.addBlock();
        this.addBlock();
        cc.log( this.blockArr);
        cc.log( this.data);

    },

    /**
     * @description: 随机生成数字块，遍历二维数组，找到数值为 0 的元素，生成 
     * @param {type} 
     * @return: 
     */
    addBlock: function () {
        let locations = this.getEmptyLocations();
        if(locations.length == 0) return false;
        let location = locations[Math.floor(Math.random()*locations.length)];
        this.data[location.x][location.y] = NUMBERS[Math.floor(Math.random()*NUMBERS.length)];
        let block = this.blockArr[location.x][location.y].getComponent("block");
        block.setNumber(this.data[location.x][location.y]);
    },

    /**
     * @description: 获取所有块中，数值为 0 的位置 
     * @param {type} 
     * @return: location[]
     */
    getEmptyLocations: function () {
        let locations = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                if (this.data[row][col] == 0) {
                    locations.push({ //  将位置放入数组中
                        x: row,
                        y: col,
                    });
                }
            }
        }
        return locations;
    },


    onLoad() {
        this.blockInit();
        this.gameInit();
        this.count = 0; // 用来记录onLoad调用的次数
        this.count++;
        cc.log("onLoad的执行次数: " + this.count);
    },

    start() {
        //cc.log(this.blockLayout.cellSize.width);
        //cc.log(this.layoutNode.height); //获取节点的高度
        //cc.log(this.layoutNode.width);  //获取节点的宽度
    },

    // update (dt) {},
});
